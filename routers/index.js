const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const HomeController = require("../controllers/HomeController")
const AuthController = require("../controllers/AuthController")
const RegisterController = require("../controllers/RegisterController")
const DashboardController = require("../controllers/DashboardController")

const stocks = require("./stocks")
const transaction = require("./transaction")
const portfolio = require("./portfolio")

router.get("/", HomeController.home)

router.get("/login", isLogout, AuthController.login)
router.post("/login", isLogout, AuthController.loginPost)
router.get("/logout", isLoggedIn, AuthController.logout)

router.get("/register", RegisterController.register)
router.post("/register", RegisterController.registerPost)

router.get("/dashboard", isLoggedIn, DashboardController.dashboard)

router.use("/transaction", transaction)
router.use("/stocks", stocks)
router.use("/portfolio", portfolio)



module.exports = router