const { User, Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah, formatDateLocal } = require("../helpers/helper")

class TransactionController {

    static async buy(req, res){
        try {
            const { StockId } = req.params
            const { username, balance, role} = req.session
            const stock = await Stock.findByPk(StockId)
            
            const {errors} = req.query
            res.render("transaction-buy", {username, balance, formatRupiah, stock, role, errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async buyPost(req, res){
        try {
            const { StockId } = req.params
            const { UserId } = req.session
            let { price, totalPrice, qty } = req.body
            const type = "Buy"

            const user = await User.reduceBalanceUser(UserId, Number(totalPrice))

            req.session.UserId = user.id
            req.session.role = user.role
            req.session.username = user.username
            req.session.balance = user.balance
            
            await Transaction.create({
                price, totalPrice, qty, UserId, StockId, type
            })

            await Portfolio.createOrUpdatePortfolio(StockId, UserId)

            res.redirect("/dashboard")
        } catch (error) {
            if(error.name=== "SequelizeValidationError"){
                const errors = error.errors.map(el=>el.message)

                const { StockId } = req.params
                res.redirect(`/transaction/buy/${StockId}?errors=`+errors)
            }else{
                res.send(error)
            }
        }
    }

    static async sell(req, res){
        try {
            const { StockId } = req.params
            const { username, balance, UserId} = req.session

            // const data = await Transaction.findAll({
            //     include:{
            //         model: Stock
            //     },
            //     where:{
            //         StockId,
            //         UserId
            //     }
            // })

            const stock = await Stock.findOne({
                include:{
                    model: Transaction,
                    where: {
                        UserId
                    }
                },
                where:{
                    id: StockId
                },
                order: [[{ model: Transaction }, 'createdAt', 'ASC']]
            })

            res.render("transaction-sell" , {username, balance, formatRupiah, stock, formatDateLocal})

        } catch (error) {
            res.send(error)
        }
    }

    static async sellPost(req, res){
        try {
            
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = TransactionController