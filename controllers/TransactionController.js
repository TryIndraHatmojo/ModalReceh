const { User, Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class TransactionController {

    static async buy(req, res){
        try {
            const { StockId } = req.params
            const { username, balance } = req.session
            const stock = await Stock.findByPk(StockId)
            
            res.render("transaction-buy", {username, balance, formatRupiah, stock})
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
            res.send(error)
        }
    }

    

    

    static async sell(req, res){
        try {
            
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