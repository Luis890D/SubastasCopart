const { Router } = require('express');
const { body }   = require('express-validator');
const VehiculoController = require('../controllers/vehiculo.controller');
const auth               = require('../middlewares/auth.middleware');
const validate           = require('../middlewares/validate.middleware');
const upload             = require('../middlewares/upload.middleware');

const router = Router();

// ── Vehículos ──────────────────────────────────────────────────────────────────

// GET  /api/vehiculos  — público, con filtros opcionales
router.get('/', VehiculoController.getAll);

// GET  /api/vehiculos/mis-publicaciones  — requiere auth
router.get('/mis-publicaciones', auth, VehiculoController.getMisPublicaciones);

// GET  /api/vehiculos/mis-pujas  — requiere auth
router.get('/mis-pujas', auth, VehiculoController.getMisPujas);

// GET  /api/vehiculos/:id  — público
router.get('/:id', VehiculoController.getById);

// POST /api/vehiculos  — requiere auth + hasta 10 fotos opcionales
router.post('/',
  auth,
  upload.array('fotos', 10),
  [
    body('anio').isInt({ min: 1900, max: 2030 }).withMessage('Año inválido'),
    body('marca').notEmpty().withMessage('La marca es requerida'),
    body('modelo').notEmpty().withMessage('El modelo es requerido'),
    body('nivel_danio').isIn(['verde', 'amarillo', 'rojo']).withMessage('Nivel de daño inválido'),
    body('precio_base').isFloat({ min: 1 }).withMessage('El precio base debe ser mayor a 0'),
    body('fecha_inicio').isISO8601().withMessage('Fecha de inicio inválida'),
    body('fecha_fin').isISO8601().withMessage('Fecha de fin inválida'),
  ],
  validate,
  VehiculoController.create
);

// PUT  /api/vehiculos/:id  — requiere auth (solo el dueño)
router.put('/:id', auth, VehiculoController.update);

// ── Fotos ──────────────────────────────────────────────────────────────────────

// GET  /api/vehiculos/:id/fotos
router.get('/:id/fotos', VehiculoController.getFotos);

// POST /api/vehiculos/:id/fotos  — requiere auth, hasta 10 imágenes
router.post('/:id/fotos',
  auth,
  upload.array('fotos', 10),
  VehiculoController.addFotos
);

// ── Pujas ──────────────────────────────────────────────────────────────────────

// GET  /api/vehiculos/:id/pujas  — público
router.get('/:id/pujas', VehiculoController.getPujas);

// POST /api/vehiculos/:id/pujas  — requiere auth
router.post('/:id/pujas',
  auth,
  [
    body('monto').isFloat({ min: 0.01 }).withMessage('El monto debe ser un número positivo'),
  ],
  validate,
  VehiculoController.createPuja
);

module.exports = router;
