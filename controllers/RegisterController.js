const { User } = require('../models')
const bcrypt = require('bcryptjs')

class RegisterController {

    static register(req, res){
        try {
            res.render("home-register")
        } catch (error) {
            res.send(error)
        }
    }

    static async registerPost(req, res){
        try {
            const { username, password, email } = req.body

            User.create({ username, password, email, role: "User" })
                .then(newUser => {
                    req.session.UserId = newUser.id
                    req.session.role = newUser.role
                    req.session.username = newUser.username
                    req.session.balance = newUser.balance
                    res.redirect("/dashboard")
                })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = RegisterController