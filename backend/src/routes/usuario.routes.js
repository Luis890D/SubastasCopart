const { Router } = require('express');
const UsuarioController = require('../controllers/usuario.controller');
const authMiddleware    = require('../middlewares/auth.middleware');

const router = Router();

// GET    /api/usuarios
router.get('/', authMiddleware, UsuarioController.getAll);

// GET    /api/usuarios/:id
router.get('/:id', authMiddleware, UsuarioController.getById);

// PUT    /api/usuarios/:id
router.put('/:id', authMiddleware, UsuarioController.update);

// DELETE /api/usuarios/:id
router.delete('/:id', authMiddleware, UsuarioController.delete);

module.exports = router;
