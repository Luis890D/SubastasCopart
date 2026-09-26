const { Router } = require('express');

const resolve = (m) => {
  let res = m;
  while (res && typeof res === 'object' && res.default && typeof res !== 'function') {
    res = res.default;
  }
  return res;
};

const UsuarioController = resolve(require('../controllers/usuario.controller'));
const auth              = resolve(require('../middlewares/auth.middleware'));

const router = Router();

router.get('/',      auth, UsuarioController.getAll);
router.get('/:id',   auth, UsuarioController.getById);
router.put('/:id',   auth, UsuarioController.update);
router.delete('/:id',auth, UsuarioController.delete);

module.exports = router;
module.exports.default = router;

