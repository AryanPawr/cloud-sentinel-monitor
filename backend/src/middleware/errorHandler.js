const AppError = require("../utils/appError");

// Catch-all for unmatched routes
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Central error responder
// Express identifies 4-arg functions as error middleware automatically
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  // Only log stack traces in development
  if (process.env.NODE_ENV === "development") {
    console.error("💥 ERROR:", err);
  } else if (statusCode === 500) {
    console.error("💥 UNHANDLED ERROR:", err.message);
  }

  res.status(statusCode).json({
    status,
    message: err.isOperational ? err.message : "Something went wrong. Please try again.",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };