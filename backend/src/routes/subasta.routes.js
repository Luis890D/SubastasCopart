const { Router } = require('express');
const { body }   = require('express-validator');

const resolve = (m) => (m && m.default && m !== m.default ? m.default : m);


const SubastaController = resolve(require('../controllers/subasta.controller'));
const authMiddleware    = resolve(require('../middlewares/auth.middleware'));
const validate          = resolve(require('../middlewares/validate.middleware'));

const router = Router();

// GET  /api/subastas
router.get('/', SubastaController.getAll);

// GET  /api/subastas/:id
router.get('/:id', SubastaController.getById);

// POST /api/subastas  (requiere autenticación)
router.post(
  '/',
  authMiddleware,
  [
    body('titulo').notEmpty().withMessage('El título es requerido'),
    body('precio_base').isFloat({ min: 0 }).withMessage('El precio base debe ser un número positivo'),
    body('fecha_inicio').isISO8601().withMessage('Fecha de inicio inválida'),
    body('fecha_fin').isISO8601().withMessage('Fecha de fin inválida'),
  ],
  validate,
  SubastaController.create
);

// PUT  /api/subastas/:id  (requiere autenticación)
router.put('/:id', authMiddleware, SubastaController.update);

// DELETE /api/subastas/:id  (requiere autenticación)
router.delete('/:id', authMiddleware, SubastaController.delete);

module.exports = router;
module.exports.default = router;

