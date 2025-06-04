'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile)
      User.hasMany(models.Transaction)

      // Super Many to Many Through Portfolio
      User.belongsToMany(models.Stock, {through: "Portfolio"})
      User.hasMany(models.Portfolio)
    }

    static async loginPost(email, password){
      try {
        const data = await User.findOne({
          where: {
            email
          }
        })
        if(data){
          let isValid = await bcrypt.compare(password, data.password)
          if (isValid) {
            return data
          }else{
            throw {
              name: "ErrorLogin",
              error: "Password salah.",
              path: "password"
            }
          }
        }else{
          throw {
            name: "ErrorLogin",
            error: "Email belum terdaftar.",
            path: "email"
          }
        }
      } catch (error) {
        throw error
      }
    }

    static async addBalanceUser(UserId, totalPrice){
        try {
            const user = await User.findByPk(UserId)
            const balance = user.balance + totalPrice
            await user.update({
                balance
            })
            return user
        } catch (error) {
            throw error
        }
    }

    static async reduceBalanceUser(UserId, totalPrice){
        try {
            const user = await User.findByPk(UserId)
            const balance = user.balance - totalPrice
            await user.update({
                balance
            })
            return user
        } catch (error) {
            throw error
        }
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Username is required"
        },
        notEmpty:{
          msg: "Username is required"
        },
        len: {
          args: [8, 20],
          msg: "Username length minimum 8 and maximum 20"
        },
        is:{
          args: /^[a-zA-Z0-9_]*$/,
          msg: "Username must contain only alphanumeric characters and underscores"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull:{
          msg: "Password is required"
        },
        notEmpty:{
          msg: "Password is required"
        },
        len: {
          args: [8],
          msg: "Password length must 8 characters or more"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Email is already taken'
      },
      validate: {
        notNull:{
          msg: "Email is required"
        },
        notEmpty:{
          msg: "Email is required"
        },
        isEmail: {
          msg: "Email format is not valid"
        }
      }
    },
    balance: {
      type: DataTypes.BIGINT,
      validate: {
        min: {
          args: [0],
          msg: "Insufficient balance on payment"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(instance, options) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(instance.password, salt);
        
        instance.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};