const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "kiruthikamakesh018@gmail.com";
    const password = "Kmakesh@018";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();

      console.log("Existing user is now admin");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: "Admin",
        email,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin user created successfully");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

createAdmin();