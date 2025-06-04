const { Stock } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class HomeController {

    static async home(req, res){
        try {
            const { UserId } = req.session
            const stocks = await Stock.findAll({
                limit:6
            })
            res.render("home", { stocks, formatRupiah })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = HomeController