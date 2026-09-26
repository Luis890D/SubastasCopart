const SubastaModel = require('../models/subasta.model');

const SubastaController = {
  /**
   * GET /api/subastas
   */
  async getAll(req, res, next) {
    try {
      const subastas = await SubastaModel.findAll();
      res.json({ success: true, data: subastas });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/subastas/:id
   */
  async getById(req, res, next) {
    try {
      const subasta = await SubastaModel.findById(req.params.id);
      if (!subasta) {
        return res.status(404).json({ success: false, error: 'Subasta no encontrada' });
      }
      res.json({ success: true, data: subasta });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/subastas
   */
  async create(req, res, next) {
    try {
      const data = { ...req.body, usuario_id: req.user.id };
      const subasta = await SubastaModel.create(data);
      res.status(201).json({ success: true, data: subasta });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/subastas/:id
   */
  async update(req, res, next) {
    try {
      const subasta = await SubastaModel.update(req.params.id, req.body);
      if (!subasta) {
        return res.status(404).json({ success: false, error: 'Subasta no encontrada' });
      }
      res.json({ success: true, data: subasta });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/subastas/:id
   */
  async delete(req, res, next) {
    try {
      const deleted = await SubastaModel.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, error: 'Subasta no encontrada' });
      }
      res.json({ success: true, message: 'Subasta eliminada correctamente' });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = SubastaController;
