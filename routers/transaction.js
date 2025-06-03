const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const TransactionController = require("../controllers/TransactionController")

router.get("/buy/:StockId", isLoggedIn, TransactionController.buy)
router.post("/buy/:StockId", isLoggedIn, TransactionController.buyPost)

router.get("/sell/:StockId", isLoggedIn, TransactionController.sell)
router.post("/sell/:StockId", isLoggedIn, TransactionController.sellPost)

module.exports = router