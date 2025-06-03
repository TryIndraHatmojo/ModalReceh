const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const PortfolioController = require("../controllers/PortfolioController")

router.get("/", isLoggedIn, PortfolioController.portfolio)

module.exports = router