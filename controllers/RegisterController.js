const { User } = require('../models')
const bcrypt = require('bcryptjs')

class RegisterController {

    static register(req, res){
        try {
            const {errors} = req.query
            res.render("home-register", {errors})
        } catch (error) {
            res.send(error)
        }
    }

    static async registerPost(req, res){
        try {
            const { username, password, email } = req.body

            const newUser = await User.create({ username, password, email, role: "User" })
            req.session.UserId = newUser.id
            req.session.role = newUser.role
            req.session.username = newUser.username
            req.session.balance = newUser.balance
            res.redirect("/dashboard")
        } catch (error) {
            if(error.name=== "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError"){
                const errors = error.errors.map(el=>el.message)
                res.redirect("/register?errors="+errors)
            }else{
                res.send(error)
            }
        }
    }

}

module.exports = RegisterController