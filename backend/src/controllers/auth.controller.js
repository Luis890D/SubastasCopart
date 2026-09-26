const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

const AuthController = {
  /**
   * POST /api/auth/register
   */
  async register(req, res, next) {
    try {
      const { nombre, correo, password } = req.body;

      // Verificar si el correo ya existe
      const existe = await UsuarioModel.findByCorreo(correo);
      if (existe) {
        return res.status(409).json({ success: false, error: 'El correo ya está registrado' });
      }

      // Hash de la contraseña
      const hash = await bcrypt.hash(password, 12);

      const usuario = await UsuarioModel.create({ nombre, correo, password: hash });

      // Quitar el password del response
      const { password: _, ...usuarioSafe } = usuario;

      return res.status(201).json({ success: true, data: usuarioSafe });
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
        { id: usuario.id, correo: usuario.correo },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      const { password: _, ...usuarioSafe } = usuario;

      return res.json({ success: true, token, data: usuarioSafe });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = AuthController;
