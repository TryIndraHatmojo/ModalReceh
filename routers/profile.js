const express = require("express")
const router = express.Router()
const { isAdmin, isLoggedIn, isLogout } = require("../middleware/authMiddleware")
const ProfileController = require("../controllers/ProfileController")

router.get("/", ProfileController.profile)
router.post("/edit/:id", ProfileController.profileUpdate)

module.exports = router