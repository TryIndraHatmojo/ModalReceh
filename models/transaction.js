'use strict';
const {
  Model,
  where
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
      return invested - currentTotal
    }

    profitLossPercent(currentPrice){
      let invested = this.totalPrice
      let currentTotal = currentPrice * this.qty * 100
      return (invested - currentTotal) / invested * 100
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