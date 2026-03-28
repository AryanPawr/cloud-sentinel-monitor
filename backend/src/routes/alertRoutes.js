const express = require("express");
const router = express.Router();
const alertController = require("../controllers/alertController");
const validate = require("../middleware/validate");

const createSchema = {
  service:  { type: "string", required: true, minLength: 2 },
  severity: { type: "string", required: true, enum: ["P1", "P2", "P3"] },
  title:    { type: "string", required: true, minLength: 5 },
  status:   { type: "string", required: false, enum: ["Open", "Resolved"] },
  duration: { type: "string", required: false },
};

router.get("/",                   alertController.getAll);
router.get("/:id",                alertController.getOne);
router.post("/", validate(createSchema), alertController.create);
router.patch("/:id/resolve",      alertController.resolve);

module.exports = router;