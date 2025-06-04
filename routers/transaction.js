const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const TransactionController = require("../controllers/TransactionController")

router.get("/buy/:StockId", TransactionController.buy)
router.post("/buy/:StockId", TransactionController.buyPost)

router.get("/sell/:StockId", TransactionController.sell)
router.get("/sell/stock/:TransactionId", TransactionController.sellStock)
router.get("/sell/history/:StockId", TransactionController.sellHistory)

router.get("/invoice/:TransactionId", TransactionController.invoice)

module.exports = router