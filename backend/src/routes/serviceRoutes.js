const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const validate = require("../middleware/validate");

const SERVICE_TYPES  = ["API", "Database", "Worker", "CDN", "Service", "Storage"];
const SERVICE_STATUS = ["UP", "DOWN"];

const createSchema = {
  name:         { type: "string",  required: true,  minLength: 2 },
  status:       { type: "string",  required: true,  enum: SERVICE_STATUS },
  region:       { type: "string",  required: true,  minLength: 2 },
  type:         { type: "string",  required: true,  enum: SERVICE_TYPES  },
  responseTime: { type: "number",  required: false },
};

const updateSchema = {
  name:         { type: "string",  required: false, minLength: 2 },
  status:       { type: "string",  required: false, enum: SERVICE_STATUS },
  region:       { type: "string",  required: false, minLength: 2 },
  type:         { type: "string",  required: false, enum: SERVICE_TYPES  },
  responseTime: { type: "number",  required: false },
};

router.get("/",            serviceController.getAll);
router.get("/:id",         serviceController.getOne);
router.post("/",   validate(createSchema), serviceController.create);
router.put("/:id", validate(updateSchema), serviceController.update);
router.delete("/:id",      serviceController.remove);

module.exports = router;