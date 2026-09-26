const UsuarioModel = require('../models/usuario.model');

const UsuarioController = {
  /**
   * GET /api/usuarios
   */
  async getAll(req, res, next) {
    try {
      const usuarios = await UsuarioModel.findAll();
      // Nunca devolver passwords
      const safe = usuarios.map(({ password, ...u }) => u);
      res.json({ success: true, data: safe });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/usuarios/:id
   */
  async getById(req, res, next) {
    try {
      const usuario = await UsuarioModel.findById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }
      const { password, ...safe } = usuario;
      res.json({ success: true, data: safe });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/usuarios/:id
   */
  async update(req, res, next) {
    try {
      const updated = await UsuarioModel.update(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }
      const { password, ...safe } = updated;
      res.json({ success: true, data: safe });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/usuarios/:id
   */
  async delete(req, res, next) {
    try {
      const deleted = await UsuarioModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      }
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = UsuarioController;
