const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const StockController = require("../controllers/StockController")

router.get("/", isLoggedIn, StockController.stocks)
router.get("/add", isLoggedIn, isAdmin, StockController.stocksAdd)
router.post("/add", isLoggedIn, isAdmin, StockController.stocksCreate)
router.get("/edit/:StockId", isLoggedIn, isAdmin, StockController.stocksEdit)
router.post("/edit/:StockId", isLoggedIn, isAdmin, StockController.stocksUpdate)
router.get("/delete/:StockId", isLoggedIn, isAdmin, StockController.stocksDelete)
module.exports = router