const { Router } = require('express');
const { body }   = require('express-validator');

const resolve = (m) => (m && m.default && m !== m.default ? m.default : m);


const PujaController = resolve(require('../controllers/puja.controller'));
const authMiddleware  = resolve(require('../middlewares/auth.middleware'));
const validate        = resolve(require('../middlewares/validate.middleware'));

const router = Router({ mergeParams: true });

// GET  /api/subastas/:id/pujas
router.get('/', PujaController.getBySubasta);

// POST /api/subastas/:id/pujas  (requiere autenticación)
router.post(
  '/',
  authMiddleware,
  [
    body('monto').isFloat({ min: 0.01 }).withMessage('El monto debe ser un número mayor a 0'),
  ],
  validate,
  PujaController.create
);

module.exports = router;
module.exports.default = router;

