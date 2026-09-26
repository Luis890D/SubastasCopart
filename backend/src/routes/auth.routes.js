const { Router } = require('express');
const { body }   = require('express-validator');

const resolve = (m) => (m && m.default && m !== m.default ? m.default : m);


const AuthController = resolve(require('../controllers/auth.controller'));
const auth           = resolve(require('../middlewares/auth.middleware'));
const validate       = resolve(require('../middlewares/validate.middleware'));

const router = Router();

// POST /api/auth/register
router.post('/register',
  [
    body('nombre').notEmpty().withMessage('El nombre es requerido'),
    body('apellido').notEmpty().withMessage('El apellido es requerido'),
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  validate,
  AuthController.register
);

// POST /api/auth/login
router.post('/login',
  [
    body('correo').isEmail().withMessage('Correo inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  validate,
  AuthController.login
);

// GET /api/auth/me  (requiere auth)
router.get('/me', auth, AuthController.me);

module.exports = router;
module.exports.default = router;

