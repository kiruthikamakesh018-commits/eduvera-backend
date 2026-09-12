const express = require("express");

const router = express.Router();

const {
  register,
  login,
  updateProfile,
  updateAdminCredentials
} = require("../controllers/authController");

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Profile Management
router.put("/profile", updateProfile);

// Update Admin Credentials
router.put("/admin/update-credentials", updateAdminCredentials);

console.log("LOGIN ROUTE REGISTERED");
console.log("PROFILE ROUTE REGISTERED");
console.log("ADMIN CREDENTIALS ROUTE REGISTERED");

module.exports = router;