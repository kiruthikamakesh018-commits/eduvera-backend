const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// =========================
// CORS
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  "https://eduvera-ovi6.vercel.app",
  "https://eduvera-chi.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// ROUTES
// =========================

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Student Course Management API is running"
  });
});

// =========================
// MONGODB CONNECTION
// =========================

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });