
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const protect = require("./middleware/authMiddleware");
const User = require("./models/User");

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "IntervAI Backend is running"
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Protected profile route
app.get("/api/auth/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not fetch profile"
    });
  }
});

module.exports = app;
