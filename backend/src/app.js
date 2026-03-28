const express = require("express");
const cors = require("cors");

const authRoutes      = require("./routes/authRoutes");
const serviceRoutes   = require("./routes/serviceRoutes");
const alertRoutes     = require("./routes/alertRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const { protect }     = require("./middleware/authMiddleware");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// ── Global middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Strip trailing slashes (/services/ → /services)
app.use((req, _res, next) => {
  if (req.path.length > 1 && req.path.endsWith("/")) {
    req.url = req.url.slice(0, -1);
  }
  next();
});

// ── Health check ───────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({ status: "success", message: "CloudReliability API is running 🚀" });
});

// ── Public routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);

// ── Protected routes (JWT required) ───────────────────────────────
app.use("/api/services",  protect, serviceRoutes);
app.use("/api/alerts",    protect, alertRoutes);
app.use("/api/dashboard", protect, dashboardRoutes);

// ── 404 + Error handling (must be last) ───────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;