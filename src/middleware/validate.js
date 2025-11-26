const { validationResult } = require('express-validator');

// Middleware para manejar errores de validación de express-validator
module.exports = function validate(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const formatted = errors.array({ onlyFirstError: true }).map(err => ({
    field: err.path,
    message: err.msg
  }));

  return res.status(400).json({
    success: false,
    message: 'Errores de validación',
    errors: formatted
  });
};
