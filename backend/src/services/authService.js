const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const AppError = require("../utils/AppError");

const JWT_SECRET  = process.env.JWT_SECRET  || "change-me-in-production";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

const signToken = (userId) =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("Name, email, and password are required.", 400);
  }
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  const existing = User.findByEmail(email);
  if (existing) throw new AppError("An account with that email already exists.", 409);

  const user  = await User.create({ name, email, password });
  const token = signToken(user.id);

  return { user: User.sanitize(user), token };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  const user = User.findByEmail(email);
  if (!user) throw new AppError("Invalid email or password.", 401);

  const valid = await User.verifyPassword(password, user.passwordHash);
  if (!valid) throw new AppError("Invalid email or password.", 401);

  const token = signToken(user.id);
  return { user: User.sanitize(user), token };
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new AppError("Invalid or expired token. Please log in again.", 401);
  }
};

module.exports = { register, login, verifyToken };