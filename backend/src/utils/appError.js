class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? "error" : "fail";
    this.isOperational = true; // distinguish from unexpected crashes
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;