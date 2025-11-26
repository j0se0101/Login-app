const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, logout, getMe, updateUser, deleteUser } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate');

// Rutas públicas
router.post(
  '/register',
  [
    body('username').trim().notEmpty().withMessage('El nombre de usuario es requerido')
      .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    body('email').trim().notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es requerida')
      .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('El email es requerido')
      .isEmail().withMessage('Email inválido').normalizeEmail(),
    body('password').notEmpty().withMessage('La contraseña es requerida')
  ],
  validate,
  login
);

// Rutas protegidas (requieren autenticación)
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put(
  '/update',
  protect,
  [
    body('username').optional().trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
    body('email').optional().trim().isEmail().withMessage('Email inválido').normalizeEmail()
  ],
  validate,
  updateUser
);
router.delete('/delete', protect, deleteUser);

module.exports = router;
