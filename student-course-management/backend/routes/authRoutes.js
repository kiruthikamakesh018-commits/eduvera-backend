const express = require("express");

const router = express.Router();

const {
  register,
  login,
  updateProfile
} = require("../controllers/authController");


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Profile Management
router.put("/profile", updateProfile);


console.log("LOGIN ROUTE REGISTERED");
console.log("PROFILE ROUTE REGISTERED");


module.exports = router;