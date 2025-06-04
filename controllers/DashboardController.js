const { Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")
const { Op } = require("sequelize")

class DashboardController {

    static async dashboard(req, res){
        try {
            const { username, balance, role } = req.session
            const { search } = req.query
            let opt = {}

            if(search){
                opt.where = {
                    sector:{
                        [Op.iLike]: `%${search}%`
                    }
                }
            }else{
                await Stock.updateAllStockPrice()
            }

            const stocks = await Stock.findAll(opt)
            res.render("dashboard", { stocks, username, balance, formatRupiah, role })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = DashboardController