'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Portfolio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Super Many to Many
      Portfolio.belongsTo(models.User)
      Portfolio.belongsTo(models.Stock)
    }

    get invested(){
      return this.avgBuyPrice * this.qty * 100
    }

    profitLoss(currentPrice){
      let invested = this.avgBuyPrice * this.qty * 100
      let currentTotal = currentPrice * this.qty * 100
      return currentTotal - invested
    }

    profitLossPercent(currentPrice){
      let invested = this.avgBuyPrice * this.qty * 100
      let currentTotal = currentPrice * this.qty * 100
      return (currentTotal- invested) / currentTotal * 100
    }

    static async createOrUpdatePortfolio(StockId, UserId){
        try {
            let userStockData = await sequelize.models.Transaction.userStockData(StockId, UserId)
            userStockData = userStockData[0].dataValues

            const portfolio = await Portfolio.findOne({
                where:{
                    StockId, UserId
                }
            })
            if(portfolio){
                await portfolio.update({
                    qty: userStockData.qty,
                    avgBuyPrice: userStockData.avgBuyPrice,
                })
            }else{
                await Portfolio.create({
                    qty: userStockData.qty,
                    avgBuyPrice: userStockData.avgBuyPrice,
                    UserId,
                    StockId
                })
            }
        } catch (error) {
            throw error
        }
    }
  }
  Portfolio.init({
    qty: DataTypes.INTEGER,
    avgBuyPrice: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    StockId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Portfolio',
  });
  return Portfolio;
};