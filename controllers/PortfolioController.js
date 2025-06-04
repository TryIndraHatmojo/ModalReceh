const { User, Stock, Transaction, Portfolio } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class PortfolioController {

    static async portfolio(req, res){
        try {
            const { username, UserId, balance, role } = req.session
            const portfolios = await User.findOne({
                include: [{
                    model: Stock,
                }],
                where: {
                    id: UserId
                }
            })
            
            // res.send(data)
            res.render("portfolio", {username, UserId, balance, formatRupiah, portfolios, role})
        } catch (error) {
            res.send(error)
        }
    }



}

module.exports = PortfolioController