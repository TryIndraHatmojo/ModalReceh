const { User, Stock, Transaction, Portfolio, Profile } = require("../models")
const { formatRupiah } = require("../helpers/helper")

class ProfileController {

    static async profile(req, res){
        try {
            const { username, UserId, balance, role } = req.session
            console.log(UserId);
            
            const data = await User.findByPk(UserId, {
                include:{
                    model : Profile
                }
            })

            const { status, errors } = req.query
            res.render("profile", { username, UserId, balance, data, formatRupiah, status, errors })
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
            if(profile){
                await profile.update({
                    name, typeInvestor
                })
            }else{
                await Profile.create({
                    name, typeInvestor, UserId
                })
            }

            res.redirect("/profile?status=updated")
        } catch (error) {
            if(error.name=== "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError"){
                const errors = error.errors.map(el=>el.message)
                res.redirect("/profile?errors="+errors)
            }else{
                res.send(error)
            }
        }
    }
}

module.exports = ProfileController