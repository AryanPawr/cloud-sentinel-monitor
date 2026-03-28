const authService = require("../services/authService");
const User        = require("../models/User");
const AppError    = require("../utils/AppError");

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("You are not logged in. Please authenticate.", 401);
    }

    const token   = authHeader.split(" ")[1];
    const decoded = authService.verifyToken(token); // throws if invalid/expired

    const user = User.findById(decoded.id);
    if (!user) throw new AppError("The user belonging to this token no longer exists.", 401);

    // Attach sanitised user to request for downstream use
    req.user = User.sanitize(user);
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };