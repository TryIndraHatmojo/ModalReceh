'use strict';
const {
  Model
} = require('sequelize');
const { randomStockPrice } = require("../helpers/helper")

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

    static async updateAllStockPrice(){
      const stocks = await Stock.findAll()
      stocks.forEach(async stock => {
        await stock.update({
          currentPrice: randomStockPrice(stock.currentPrice),
          prevPrice: randomStockPrice(stock.prevPrice),
        })
      });
    }

  }
  Stock.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Name is required"
        },
        notEmpty:{
          msg: "Name is required"
        }
      }
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Code is required"
        },
        notEmpty:{
          msg: "Code is required"
        }
      }
    },
    currentPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Current Price is required"
        },
        notEmpty:{
          msg: "Current Price is required"
        },
        min: {
          args: [1],
          msg: "Minimum Current Price is 1"
        }
      }
    },
    annualReturn: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Annual Return is required"
        },
        notEmpty:{
          msg: "Annual Return is required"
        }
      }
    },
    description: DataTypes.STRING,
    sector: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Sector is required"
        },
        notEmpty:{
          msg: "Sector is required"
        }
      }
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Image Icon URL is required"
        },
        notEmpty:{
          msg: "Image Icon URL is required"
        },
        isUrl: {
          msg : "Image Icon URL is not valid URL"
        }
      }
    },
    prevPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Previous Price is required"
        },
        notEmpty:{
          msg: "Previous Price is required"
        },
        min: {
          args: [1],
          msg: "Minimum Previous Price is 1"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Stock',
    // hooks: {
    //   beforeCreate(instance){
    //     instance.name = instance.name+" Tbk"
    //   }
    // }
  });
  return Stock;
};