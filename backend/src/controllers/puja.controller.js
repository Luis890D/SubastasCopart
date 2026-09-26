const PujaModel    = require('../models/puja.model');
const SubastaModel = require('../models/subasta.model');

const PujaController = {
  /**
   * GET /api/subastas/:id/pujas
   */
  async getBySubasta(req, res, next) {
    try {
      const pujas = await PujaModel.findBySubasta(req.params.id);
      res.json({ success: true, data: pujas });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/subastas/:id/pujas
   */
  async create(req, res, next) {
    try {
      const subasta_id = req.params.id;
      const { monto }  = req.body;

      // Validar que la subasta existe y está activa
      const subasta = await SubastaModel.findById(subasta_id);
      if (!subasta) {
        return res.status(404).json({ success: false, error: 'Subasta no encontrada' });
      }
      if (new Date() > new Date(subasta.fecha_fin)) {
        return res.status(400).json({ success: false, error: 'La subasta ya ha finalizado' });
      }

      // Validar que la puja supera la oferta actual
      const maxPuja = await PujaModel.findMaxPuja(subasta_id);
      const minOferta = maxPuja ? maxPuja.monto : subasta.precio_base;

      if (parseFloat(monto) <= parseFloat(minOferta)) {
        return res.status(400).json({
          success: false,
          error: `La puja debe ser mayor a ${minOferta}`,
        });
      }

      const puja = await PujaModel.create({
        monto,
        subasta_id,
        usuario_id: req.user.id,
      });

      res.status(201).json({ success: true, data: puja });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = PujaController;
