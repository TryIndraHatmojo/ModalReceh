const { User } = require("../models")

class AuthController {

    static login(req, res){
        try {
            const {errors} = req.query
            res.render("home-login", {errors})
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
            if(error.name=== "ErrorLogin"){
                res.redirect("/login?errors="+error.error)
            }else{
                res.send(error)
            }
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