require("dotenv").config();

const app  = require("./src/app");

const PORT = process.env.PORT || 5000;
const ENV  = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`\n🚀  Server running in ${ENV} mode on port ${PORT}`);
  console.log(`   http://localhost:${PORT}\n`);
});

// Graceful shutdown on unhandled errors
process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Promise Rejection:", err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err.message);
  process.exit(1);
});