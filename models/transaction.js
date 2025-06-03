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
    qty: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    totalPrice: DataTypes.BIGINT,
    UserId: DataTypes.INTEGER,
    StockId: DataTypes.INTEGER,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};