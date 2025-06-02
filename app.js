const express = require('express')
const session = require("express-session")
const app = express()
const port = 4000

app.set("view engine","ejs")
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(session({
    secret: "Phasellus ac eros",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        sameSite: true
    }
}))

const router = require("./routers/index")
app.use("/", router)

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
