const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =========================
// ENVIRONMENT
// =========================

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// =========================
// CORS
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://eduvera-ovi6.vercel.app",
  "https://eduvera-chi.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without an origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// MONGODB CONNECTION
// =========================

let isMongoConnected = false;

async function connectMongoDB() {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    return;
  }

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (mongoose.connection.readyState === 1) {
    isMongoConnected = true;
    return;
  }

  await mongoose.connect(MONGO_URI);
  isMongoConnected = true;

  console.log("MongoDB connected successfully");
}

// =========================
// MONGODB MIDDLEWARE
// =========================

app.use(async (req, res, next) => {
  try {
    await connectMongoDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

// =========================
// ROUTES
// =========================

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);

// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Eduvera Backend API is running"
  });
});

// =========================
// HEALTH CHECK
// =========================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
    mongodb:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected"
  });
});

// =========================
// 404 HANDLER
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// =========================
// LOCAL SERVER
// =========================

if (require.main === module) {
  connectMongoDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
    });
}

// =========================
// VERCEL EXPORT
// =========================

module.exports = app;