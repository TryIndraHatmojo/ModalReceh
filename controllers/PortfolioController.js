const { User, Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class PortfolioController {

    static async portfolio(req, res){
        try {
            const { username, UserId, balance } = req.session
            const portfolios = await User.findAll({
                include: [{
                    model: Stock,
                }],
                where: {
                    id: UserId
                }
            })
            
            // res.send(data)
            res.render("portfolio", {username, UserId, balance, formatRupiah, portfolios})
        } catch (error) {
            res.send(error)
        }
    }



}

module.exports = PortfolioController