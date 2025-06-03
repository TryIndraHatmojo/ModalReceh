const { use } = require('react')
const { User } = require('../models')
const bcrypt = require('bcryptjs')

class RegisterController {

    static login(req, res){
        try {
            const { error } = req.query
            res.render("home-login", { error })
        } catch (error) {
            res.send(error)
        }
    }

    static register(req, res){
        try {
            res.render("home-register")
        } catch (error) {
            res.send(error)
        }
    }

    static async registerPost(req, res){
        try {
            const { username, password, role } = req.body

            User.create({ username, password, role })
                .then(newUser => {
                    res.redirect("home-login")
                })
        } catch (error) {
            res.send(error)
        }
    }

}

    static async loginPost(req, res){
        try {
            const { username, password } = req.body

            User.findOne({ where: { username } })
                .then(user => {
                    if (user) {
                        const isValidPassword = bcrypt.compareSync(password, user.password)

                        if (isValidPassword) {
                            return res.redirect("/")
                        } else {
                            const error = "invalid username/password"
                            return res.redirect(`/login?error=${error}`)
                        }
                    } else {
                        const error = "invalid username/password"
                        return res.redirect(`/login?error=${error}`)
                    }
                })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = RegisterController