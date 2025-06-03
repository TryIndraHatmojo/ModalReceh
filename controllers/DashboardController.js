const { Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class DashboardController {

    static async dashboard(req, res){
        try {
            const { username, balance } = req.session
            const stocks = await Stock.findAll()
            res.render("dashboard", { stocks, username, balance, formatRupiah })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = DashboardController