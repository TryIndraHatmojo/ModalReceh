'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stock.hasMany(models.Transaction)

      // Super Many to Many Through Portfolio
      Stock.belongsToMany(models.User, {through: "Portfolio"})
      Stock.hasMany(models.Portfolio)
    }

    get currentPercent(){
      const returnPercent = ((this.currentPrice - this.prevPrice) / this.prevPrice) * 100;
      return returnPercent
    }
  }
  Stock.init({
    name: DataTypes.STRING,
    code: DataTypes.STRING,
    currentPrice: DataTypes.INTEGER,
    annualReturn: DataTypes.FLOAT,
    description: DataTypes.STRING,
    sector: DataTypes.STRING,
    img: DataTypes.STRING,
    prevPrice: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};