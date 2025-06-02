class HomeController {

    static home(req, res){
        try {
            res.render("home")
        } catch (error) {
            res.send(error)
        }
    }

}

module.exports = HomeController