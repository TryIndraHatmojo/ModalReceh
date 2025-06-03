const isLoggedIn = (req,res,next) => {
    if (!req.session.UserId) {
        res.redirect(`/login`)
    } else {
        next()
    }
}

const isLogout = (req,res,next) => {
    if (req.session.UserId) {
        res.redirect(`/dashboard`)
    } else {
        next()
    }
}


const isAdmin = (req,res,next) => {
    if (req.session.role !== 'admin') {
        res.redirect("/dashboard")
    } else {
        next()
    }
}

module.exports = {isLoggedIn,isLogout,isAdmin}