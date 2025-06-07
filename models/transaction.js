'use strict';
const { formatDateLocal } = require("../helpers/helper")

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.belongsTo(models.Stock)
    }

    profitLoss(currentPrice){
      let invested = this.totalPrice
      let currentTotal = currentPrice * this.qty * 100
      return currentTotal - invested
    }

    profitLossPercent(currentPrice){
      let invested = this.totalPrice
      let currentTotal = currentPrice * this.qty * 100
      return ( currentTotal - invested) / currentTotal * 100
    }

    static async userStockData(StockId, UserId){
      try {
        const transactions = await Transaction.findAll({
          where:{
            StockId,
            UserId,
            type: "Buy"
          },
          attributes: [
            [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('price'))), 'avgBuyPrice'],
            [sequelize.fn('SUM', sequelize.col('qty')), 'qty']
          ]
        })
        
        return transactions
      } catch (error) {
        throw error
      }
    }

    static async sellStock(TransactionId){
      try {
        
        const transaction = await Transaction.findByPk(TransactionId,{
            include: {
                model: sequelize.models.Stock
            }
        })
        
        let sellPrice = transaction.Stock.currentPrice
        let totalSellPrice = sellPrice * transaction.qty * 100
        const profit = totalSellPrice - transaction.totalPrice
        let profitPersen = ( totalSellPrice - transaction.totalPrice) / totalSellPrice * 100
        profitPersen = profitPersen.toFixed(2)

        await transaction.update({
            sellPrice,
            profit,
            profitPersen,
            type: "Sell",
            totalSellPrice
        })

        return transaction
      } catch (error) {
        throw error
      }
    }

    static async invoiceData(user, transaction){
        try {
            
            let client = user.username
            if(user.Profile){
                client = user.Profile.name
            }

            // seharusnya bisa di getter
            const dateBuy = formatDateLocal(transaction.createdAt)
            const date = new Date(transaction.createdAt).toLocaleString('id-ID',{year:'numeric', month:'2-digit', day:'2-digit'}).split("/"); // dd-mm-yyyy
            const [day,month,year] = date
            const code = `${year}-${transaction.id}-${transaction.Stock.code}`

            return {
                // karena gk pakai env api key akan di hapus tgl 9-jun-2025
                apiKey: "Whlk6m70k6DyTXKdwPpxIoLcMQDhaCwf0kvcitgLmiehafUN7HpX0tWyxMbiIx2a",
                mode: "development",
                // "customize": {
                //     "template": "SGVsbG8gd29ybGQh" // Must be base64 encoded html. This example contains 'Hello World!' in base64
                // },
                sender: {
                    company: 'Modal Receh',
                    address: 'Keputih',
                    zip: '60111',
                    city: 'Surabaya',
                    country: 'Indonesia'
                },
                client: {
                    company: "Client Name: "+client,
                },
                information: {
                    number: code,
                    date: dateBuy,
                },
                products: [
                    {
                        quantity: (transaction.qty*100).toString(),
                        description: `${transaction.Stock.code} Stocks`,
                        tax: 0,
                        price: transaction.price
                    },
                ],
                'bottom-notice': '',
                settings: {
                    currency: 'IDR', // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                    "locale": "id-ID", // Defaults to en-US, used for number formatting (see docs)
                    // "margin-top": 25, // Default to 25
                    // "margin-right": 25, // Default to 25
                    // "margin-left": 25, // Default to 25
                    // "margin-bottom": 25, // Default to 25
                    // "format": "Letter", // Defaults to A4,
                    // "height": "1000px", // allowed units: mm, cm, in, px
                        // "width": "500px", // allowed units: mm, cm, in, px
                        // "orientation": "landscape", // portrait or landscape, defaults to portrait
                },
                // Used for translating the headers to your preferred language
                // Defaults to English. Below example is translated to Dutch
                "translate": {
                //     "invoice": "FACTUUR",
                //     "number": "Nummer",
                //     "date": "Datum",
                //     "due-date": "Verloopdatum",
                //     "subtotal": "Subtotaal",
                    "products": "Saham",
                    "quantity": "Jumlah Saham (Lembar)",
                    "price": "Harga",
                //     "product-total": "Totaal",
                //     "total": "Totaal"
                //		 "vat": "btw"
                },
            };
        } catch (error) {
            throw error
        }
    }
  }
  Transaction.init({
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate:{
        notNull:{
          msg: "Qty is required"
        },
        notEmpty:{
          msg: "Qty is required"
        },
        min: {
          args: [1],
          msg: "Minimum Qty is 1"
        }
      }
    },
    price: DataTypes.INTEGER,
    totalPrice: DataTypes.BIGINT,
    UserId: DataTypes.INTEGER,
    StockId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    sellPrice: DataTypes.INTEGER,
    totalSellPrice: DataTypes.BIGINT,
    profit: DataTypes.BIGINT,
    profitPersen: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};