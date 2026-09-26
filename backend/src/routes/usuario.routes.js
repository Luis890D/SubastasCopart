const { Router } = require('express');

const resolve = (m) => (m && m.default && m !== m.default ? m.default : m);


const UsuarioController = resolve(require('../controllers/usuario.controller'));
const auth              = resolve(require('../middlewares/auth.middleware'));

const router = Router();

router.get('/',      auth, UsuarioController.getAll);
router.get('/:id',   auth, UsuarioController.getById);
router.put('/:id',   auth, UsuarioController.update);
router.delete('/:id',auth, UsuarioController.delete);

module.exports = router;
module.exports.default = router;

