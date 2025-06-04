const { User } = require("../models")

class AuthController {

    static login(req, res){
        try {
            res.render("home-login")
        } catch (error) {
            res.send(error)
        }
    }

    static async loginPost(req, res){
        try {
            const { email, password } = req.body
            const data = await User.loginPost(email, password)
            req.session.UserId = data.id
            req.session.role = data.role
            req.session.username = data.username
            req.session.balance = data.balance
            console.log(req.session);
            
            res.redirect("/dashboard")
        } catch (error) {
            res.send(error)
        }
    }

    static async logout(req, res){
        try {
            req.session.destroy((err)=>{
                if(err){
                    res.send(err)
                }else{
                    res.redirect("/")
                }
            })
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = AuthController