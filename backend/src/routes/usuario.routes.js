const { Router } = require('express');
const UsuarioController = require('../controllers/usuario.controller');
const auth              = require('../middlewares/auth.middleware');

const router = Router();

router.get('/',      auth, UsuarioController.getAll);
router.get('/:id',   auth, UsuarioController.getById);
router.put('/:id',   auth, UsuarioController.update);
router.delete('/:id',auth, UsuarioController.delete);

module.exports = router;
