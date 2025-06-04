const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const TransactionController = require("../controllers/TransactionController")

router.get("/buy/:StockId", TransactionController.buy)
router.post("/buy/:StockId", TransactionController.buyPost)

router.get("/sell/:StockId", TransactionController.sell)
router.post("/sell/:id", TransactionController.sellPost)

router.get("/invoice/:id", TransactionController.invoice)

module.exports = router