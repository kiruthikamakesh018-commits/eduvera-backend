const express = require("express");

const router = express.Router();

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

// Get profile
router.get("/", getProfile);

// Update profile
router.put("/", updateProfile);

module.exports = router;