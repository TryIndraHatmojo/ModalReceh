const { User, Stock, Transaction, Portfolio, Profile } = require("../models")
const { formatRupiah, formatDateLocal } = require("../helpers/helper")
const easyinvoice = require('easyinvoice');

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
            req.session.balance = user.balance
            
            await Transaction.create({
                price, totalPrice, qty, UserId, StockId, type
            })

            await Portfolio.createOrUpdatePortfolio(StockId, UserId)

            res.redirect("/transaction/sell/"+StockId)
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

            let stock = await Stock.findOne({
                include:{
                    model: Transaction,
                    where: {
                        UserId,
                        type: "Buy"
                    }
                },
                where:{
                    id: StockId
                },
                order: [[{ model: Transaction }, 'createdAt', 'DESC']]
            })
            if(!stock){
                stock = await Stock.findByPk(StockId)
                stock.Transactions = []
            }

            res.render("transaction-sell" , {username, balance, formatRupiah, stock, formatDateLocal})

        } catch (error) {
            res.send(error)
        }
    }

    static async sellStock(req, res){
        try {
            const { TransactionId } = req.params
            const { username, balance, UserId} = req.session
            
            const transaction = await Transaction.sellStock(TransactionId)
            
            await Portfolio.createOrUpdatePortfolio(transaction.Stock.id, UserId)

            const user = await User.addBalanceUser(UserId, Number(transaction.totalSellPrice))
            req.session.balance = user.balance

            res.redirect(`/transaction/sell/history/${transaction.Stock.id}`)
        } catch (error) {
            res.send(error)
        }
    }

    static async sellHistory (req, res){
        try {
            const { StockId } = req.params
            const { username, balance, UserId} = req.session

            let stock = await Stock.findOne({
                include:{
                    model: Transaction,
                    where: {
                        UserId,
                        type: "Sell"
                    }
                },
                where:{
                    id: StockId
                },
                order: [[{ model: Transaction }, 'createdAt', 'DESC']]
            })
            if(!stock){
                stock = await Stock.findByPk(StockId)
                stock.Transactions = []
            }
            res.render("transaction-history-sell" , {username, balance, formatRupiah, stock, formatDateLocal})

        } catch (error) {
            res.send(error)
        }
    }

    static async invoice(req, res){
        try {
            const { TransactionId } = req.params
            const { username, balance, UserId} = req.session

            const user = await User.findByPk(UserId,{
                include:{
                    model: Profile
                }
            })
            
            const transaction = await Transaction.findByPk(TransactionId,{
                include: {
                    model: Stock
                }
            })

            const data = await Transaction.invoiceData(user, transaction)
            
            const result = await easyinvoice.createInvoice(data);
            const fileName = `Invoice ${transaction.Stock.code} Stock, ${formatDateLocal(transaction.createdAt)}.pdf`

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.send(Buffer.from(result.pdf, 'base64'));
            
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = TransactionController