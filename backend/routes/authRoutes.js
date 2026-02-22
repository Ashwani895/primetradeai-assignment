const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getProfile
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route (for dashboard user info)
router.get("/profile", auth, getProfile);

module.exports = router;