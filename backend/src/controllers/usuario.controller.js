const UsuarioModel = require('../models/usuario.model');

const UsuarioController = {
  async getAll(req, res, next) {
    try {
      const usuarios = await UsuarioModel.findAll();
      res.json({ success: true, data: usuarios });
    } catch (err) { next(err); }
  },

  async getById(req, res, next) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      res.json({ success: true, data: usuario });
    } catch (err) { next(err); }
  },

  async update(req, res, next) {
    try {
      const updated = await UsuarioModel.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      res.json({ success: true, data: updated });
    } catch (err) { next(err); }
  },

  async delete(req, res, next) {
    try {
      const deleted = await UsuarioModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      res.json({ success: true, message: 'Usuario eliminado' });
    } catch (err) { next(err); }
  },
};

module.exports = UsuarioController;
module.exports.default = UsuarioController;

