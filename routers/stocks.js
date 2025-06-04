const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const StockController = require("../controllers/StockController")

router.get("/", StockController.stocks)
router.get("/add", isAdmin, StockController.stocksAdd)
router.post("/add", isAdmin, StockController.stocksCreate)
router.get("/edit/:StockId", isAdmin, StockController.stocksEdit)
router.post("/edit/:StockId", isAdmin, StockController.stocksUpdate)
router.get("/delete/:StockId", isAdmin, StockController.stocksDelete)
module.exports = router