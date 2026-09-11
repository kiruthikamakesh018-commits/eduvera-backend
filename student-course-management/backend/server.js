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
  "https://eduvera-chi.vercel.app",
  "https://frontend-mauve-two-97.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without an origin
    if (!origin) {
      return callback(null, true);
    }

    // Allow registered frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================
// MONGODB CONNECTION
// =========================

if (!MONGO_URI) {
  console.error("ERROR: MONGO_URI is not defined");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });
}

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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// =========================
// VERCEL EXPORT
// =========================

module.exports = app;