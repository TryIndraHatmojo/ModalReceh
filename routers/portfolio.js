const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const PortfolioController = require("../controllers/PortfolioController")

router.get("/", PortfolioController.portfolio)

module.exports = router