const express        = require("express");
const router         = express.Router();
const authController = require("../controllers/authController");
const { protect }    = require("../middleware/authMiddleware");
const validate       = require("../middleware/validate");

const registerSchema = {
  name:     { type: "string", required: true, minLength: 2 },
  email:    { type: "string", required: true, minLength: 5 },
  password: { type: "string", required: true, minLength: 6 },
};

const loginSchema = {
  email:    { type: "string", required: true },
  password: { type: "string", required: true },
};

router.post("/register", validate(registerSchema), authController.register);
router.post("/login",    validate(loginSchema),    authController.login);
router.get("/me",        protect,                  authController.me);

module.exports = router;