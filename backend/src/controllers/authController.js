const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ status: "success", token, data: { user } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ status: "success", token, data: { user } });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me — returns the currently authenticated user
const me = async (req, res) => {
  // req.user is attached by authMiddleware
  res.status(200).json({ status: "success", data: { user: req.user } });
};

module.exports = { register, login, me };