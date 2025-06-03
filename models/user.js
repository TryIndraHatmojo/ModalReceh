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
            console.log(user);
            
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
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    balance: DataTypes.BIGINT,
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