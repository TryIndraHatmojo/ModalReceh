const { Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class DashboardController {

    static async dashboard(req, res){
        try {
            const { username, balance, role } = req.session
            const stocks = await Stock.findAll()
            res.render("dashboard", { stocks, username, balance, formatRupiah, role })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = DashboardController