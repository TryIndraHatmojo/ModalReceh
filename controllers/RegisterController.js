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
            
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = RegisterController