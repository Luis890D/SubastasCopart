const { validationResult } = require('express-validator');

/**
 * Middleware de validación.
 * Úsalo después de los validators de express-validator en las rutas.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = validate;
module.exports.default = validate;

