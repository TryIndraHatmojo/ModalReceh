const express = require("express")
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const AuthController = require("../controllers/AuthController")
const RegisterController = require("../controllers/RegisterController")

const stocks = require("./stocks")
const transaction = require("./transaction")

router.get("/", HomeController.home)
router.use("/transaction", transaction)
router.use("/stocks", stocks)


module.exports = router