const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

const AuthController = {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { nombre, apellido, correo, telefono, password } = req.body;

      const existe = await UsuarioModel.findByCorreo(correo);
      if (existe) {
        return res.status(409).json({ success: false, error: 'El correo ya está registrado' });
      }

      const hash    = await bcrypt.hash(password, 12);
      const usuario = await UsuarioModel.create({ nombre, apellido, correo, telefono, password: hash });

      return res.status(201).json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res, next) {
    try {
      const { correo, password } = req.body;

      const usuario = await UsuarioModel.findByCorreo(correo);
      if (!usuario) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      const match = await bcrypt.compare(password, usuario.password);
      if (!match) {
        return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { id: usuario.id, correo: usuario.correo, nombre: usuario.nombre },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      const { password: _, ...usuarioSafe } = usuario;
      return res.json({ success: true, token, data: usuarioSafe });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/auth/me  — perfil del usuario autenticado
   */
  async me(req, res, next) {
    try {
      const usuario = await UsuarioModel.findById(req.user.id);
      if (!usuario) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
      res.json({ success: true, data: usuario });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
