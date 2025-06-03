const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const HomeController = require("../controllers/HomeController")
const AuthController = require("../controllers/AuthController")
const RegisterController = require("../controllers/RegisterController")

const stocks = require("./stocks")
const transaction = require("./transaction")

router.get("/", HomeController.home)

router.get("/login", isLogout, AuthController.login)
router.post("/login", isLogout, AuthController.loginPost)
router.get("/logout", AuthController.logout)

router.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})

router.get("/register", RegisterController.register)
router.post("/register", RegisterController.registerPost)

router.use("/transaction", transaction)
router.use("/stocks", stocks)


module.exports = router