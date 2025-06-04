const { User, Stock, Transaction, Portfolio, Profile } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class ProfileController {

    static async profile(req, res){
        try {
            const { username, UserId, balance, role } = req.session
            const data = await Profile.findOne({
                include:{
                    model : User
                },
                where :{
                    UserId
                }
            })

            const { status } = req.query
            res.render("profile", { username, UserId, balance, data, formatRupiah, status })
            // res.send(data)
        } catch (error) {
            res.send(error)
        }
    }

    static async profileUpdate(req, res){
        try {
            const { UserId } = req.session
            
            const { username, email, name, typeInvestor } = req.body

            const user = await User.findByPk(UserId)
            await user.update({
                username, email
            })
            req.session.username = user.username

            const profile = await Profile.findOne({
                where: {
                    UserId
                }
            })
            await profile.update({
                name, typeInvestor
            })

            res.redirect("/profile?status=updated")
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = ProfileController