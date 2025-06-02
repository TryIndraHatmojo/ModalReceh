class HomeController {

    static async home(req, res){
        try {
            res.render("home")
            console.log(req.session);
            
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = HomeController