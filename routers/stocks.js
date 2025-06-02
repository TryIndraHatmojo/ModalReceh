const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")

module.exports = router