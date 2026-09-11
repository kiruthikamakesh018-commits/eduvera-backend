const User = require("../models/User");

// Get profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};


// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      userId,
      name,
      email
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Profile update failed",
      error: error.message
    });
  }
};


module.exports = {
  getProfile,
  updateProfile
};