const VehiculoModel = require('../models/vehiculo.model');
const PujaModel     = require('../models/puja.model');
const path          = require('path');

const VehiculoController = {
  /**
   * GET /api/vehiculos
   * Soporta filtros: ?marca=&modelo=&anio=&combustible=&nivel_danio=&tren_manejo=
   */
  async getAll(req, res, next) {
    try {
      const vehiculos = await VehiculoModel.findAll(req.query);
      res.json({ success: true, data: vehiculos });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/vehiculos/mis-publicaciones
   */
  async getMisPublicaciones(req, res, next) {
    try {
      const vehiculos = await VehiculoModel.findByUsuario(req.user.id);
      res.json({ success: true, data: vehiculos });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/vehiculos/:id
   */
  async getById(req, res, next) {
    try {
      const vehiculo = await VehiculoModel.findById(req.params.id);
      if (!vehiculo) {
        return res.status(404).json({ success: false, error: 'Vehículo no encontrado' });
      }
      res.json({ success: true, data: vehiculo });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/vehiculos  (requiere auth)
   */
  async create(req, res, next) {
    try {
      const vehiculo = await VehiculoModel.create({ ...req.body, usuario_id: req.user.id });

      // Si se subieron fotos junto con la creación
      if (req.files && req.files.length > 0) {
        const fotos = req.files.map((f, i) => ({
          url:   `/uploads/${f.filename}`,
          orden: i,
        }));
        await VehiculoModel.addFotos(vehiculo.id, fotos);
      }

      res.status(201).json({ success: true, data: vehiculo });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/vehiculos/:id  (requiere auth — solo el dueño)
   */
  async update(req, res, next) {
    try {
      const vehiculo = await VehiculoModel.update(req.params.id, req.user.id, req.body);
      if (!vehiculo) {
        return res.status(404).json({ success: false, error: 'Vehículo no encontrado o no autorizado' });
      }
      res.json({ success: true, data: vehiculo });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/vehiculos/:id/fotos  (requiere auth)
   * Acepta campo "fotos" en multipart/form-data
   */
  async addFotos(req, res, next) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ success: false, error: 'No se enviaron imágenes' });
      }

      const fotos = req.files.map((f, i) => ({
        url:   `/uploads/${f.filename}`,
        orden: i,
      }));

      const result = await VehiculoModel.addFotos(req.params.id, fotos);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/vehiculos/:id/fotos
   */
  async getFotos(req, res, next) {
    try {
      const fotos = await VehiculoModel.getFotos(req.params.id);
      res.json({ success: true, data: fotos });
    } catch (err) {
      next(err);
    }
  },

  // ── Pujas ──────────────────────────────────────────────────────────────────

  /**
   * GET /api/vehiculos/:id/pujas
   */
  async getPujas(req, res, next) {
    try {
      const pujas = await PujaModel.findByVehiculo(req.params.id);
      res.json({ success: true, data: pujas });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/vehiculos/:id/pujas  (requiere auth)
   * Emite evento Socket.io al completar la puja
   */
  async createPuja(req, res, next) {
    try {
      const vehiculo_id = parseInt(req.params.id);
      const { monto }   = req.body;

      const result = await PujaModel.create({
        monto,
        vehiculo_id,
        usuario_id: req.user.id,
      });

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error });
      }

      // ── Emitir evento en tiempo real a todos en la sala ───────────────────
      const { io } = require('../server');
      const vehiculo = await VehiculoModel.findById(vehiculo_id);

      io.to(`subasta-${vehiculo_id}`).emit('nueva_puja', {
        vehiculo_id,
        monto_actual:     parseFloat(result.puja.monto),
        total_pujas:      vehiculo?.total_pujas ?? 0,
        tiempo_restante:  calcularTiempoRestante(vehiculo?.fecha_fin),
        usuario_ganador:  req.user.id, // solo para comparar en el cliente, no se muestra
      });

      res.status(201).json({ success: true, data: result.puja });
    } catch (err) {
      next(err);
    }
  },
};

/**
 * Calcula segundos restantes para el cierre de una subasta
 */
function calcularTiempoRestante(fecha_fin) {
  if (!fecha_fin) return 0;
  const diff = new Date(fecha_fin) - new Date();
  return diff > 0 ? Math.floor(diff / 1000) : 0;
}

module.exports = VehiculoController;
