const { User, Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class StockController {
    
    static async stocks(req, res){
        try {
            const { username, balance, role } = req.session
            const stocks = await Stock.findAll({
                order: [["id","DESC"]]
            })

            const { code, status } = req.query
            res.render("stocks", { stocks, username, balance, formatRupiah, role, code, status })
        } catch (error) {
            res.send(error)
        }
    }

    static async stocksDelete(req, res){
        try {
            const {StockId} = req.params
            const data = await Stock.findByPk(StockId)
            await data.destroy()

            res.redirect(`/stocks?status=delete&code=${data.code}`)
        } catch (error) {
            res.send(error)
        }
    }

    static async stocksAdd(req, res){
        try {
            const { username, balance, role } = req.session
            res.render("stocks-add", {username, balance, formatRupiah})
        } catch (error) {
            res.send(error)
        }
    }

    static async stocksCreate(req, res){
        try {
            const {
                code, 
                name, 
                currentPrice, 
                annualReturn, 
                description, 
                sector, 
                img, 
                prevPrice
            } = req.body
            const data = await Stock.create({
                code, 
                name, 
                currentPrice, 
                annualReturn, 
                description, 
                sector, 
                img, 
                prevPrice
            })
            res.redirect(`/stocks/?status=add&code=${data.code}`)
        } catch (error) {
            res.send(error)
        }
    }

    static async stocksEdit(req, res){
        try {
            const { username, balance, role } = req.session
            const {StockId} = req.params

            const data = await Stock.findByPk(StockId)

            res.render("stocks-edit", {username, balance, formatRupiah, data})
        } catch (error) {
            res.send(error)
        }
    }

    static async stocksUpdate(req, res){
        try {
            const {
                code, 
                name, 
                currentPrice, 
                annualReturn, 
                description, 
                sector, 
                img, 
                prevPrice
            } = req.body
            const {StockId} = req.params

            const data = await Stock.findByPk(StockId)
            await data.update({
                code, 
                name, 
                currentPrice, 
                annualReturn, 
                description, 
                sector, 
                img, 
                prevPrice
            })

            res.redirect(`/stocks/?status=edit&code=${data.code}`)
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = StockController