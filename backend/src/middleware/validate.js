const AppError = require("../utils/appError");

/**
 * Returns an Express middleware that validates req.body against a schema.
 *
 * Schema format:
 *   { fieldName: { type: "string"|"number"|"boolean", required: bool, enum: [...] } }
 *
 * Usage:
 *   router.post("/", validate(createServiceSchema), serviceController.create);
 */
const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];
    const missing = value === undefined || value === null || value === "";

    if (rules.required && missing) {
      errors.push(`'${field}' is required`);
      continue; // skip further checks if field is absent
    }

    if (!missing) {
      // Type check
      if (rules.type && typeof value !== rules.type) {
        errors.push(`'${field}' must be of type ${rules.type}`);
      }

      // Enum check
      if (rules.enum && !rules.enum.includes(value)) {
        errors.push(`'${field}' must be one of: ${rules.enum.join(", ")}`);
      }

      // Min-length for strings
      if (rules.minLength && typeof value === "string" && value.trim().length < rules.minLength) {
        errors.push(`'${field}' must be at least ${rules.minLength} characters`);
      }
    }
  }

  if (errors.length > 0) {
    return next(new AppError(`Validation failed: ${errors.join("; ")}`, 400));
  }

  next();
};

module.exports = validate;