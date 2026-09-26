const { getPool, sql } = require('../config/db');

const TABLE    = 'Pujas_7145';
const VEH_TBL  = 'Vehiculos_7145';

/**
 * Modelo Puja — tabla Pujas_7145
 */
const PujaModel = {
  /**
   * Pujas de un vehículo ordenadas por monto DESC
   */
  async findByVehiculo(vehiculo_id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('vehiculo_id', sql.Int, vehiculo_id)
      .query(`
        SELECT monto, fecha
        FROM ${TABLE}
        WHERE vehiculo_id = @vehiculo_id
        ORDER BY monto DESC
      `);
    // Solo devolvemos monto y fecha — anonimato de postores
    return result.recordset;
  },

  /**
   * Puja más alta de un vehículo
   */
  async findMax(vehiculo_id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('vehiculo_id', sql.Int, vehiculo_id)
      .query(`
        SELECT TOP 1 monto
        FROM ${TABLE}
        WHERE vehiculo_id = @vehiculo_id
        ORDER BY monto DESC
      `);
    return result.recordset[0] || null;
  },

  /**
   * ¿El usuario tiene la puja más alta?
   */
  async isUserWinning(vehiculo_id, usuario_id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('vehiculo_id', sql.Int, vehiculo_id)
      .input('usuario_id',  sql.Int, usuario_id)
      .query(`
        SELECT TOP 1 usuario_id
        FROM ${TABLE}
        WHERE vehiculo_id = @vehiculo_id
        ORDER BY monto DESC
      `);
    return result.recordset[0]?.usuario_id === usuario_id;
  },

  /**
   * Crear puja con validaciones de negocio
   * Retorna { success, puja, error }
   */
  async create({ monto, vehiculo_id, usuario_id }) {
    const pool = await getPool();

    // Traer datos de la subasta
    const subRes = await pool.request()
      .input('vid', sql.Int, vehiculo_id)
      .query(`SELECT precio_base, fecha_inicio, fecha_fin FROM ${VEH_TBL} WHERE id = @vid`);

    const subasta = subRes.recordset[0];
    if (!subasta) return { success: false, error: 'Vehículo no encontrado' };

    const now = new Date();
    if (now < new Date(subasta.fecha_inicio)) return { success: false, error: 'La subasta aún no ha iniciado' };
    if (now >= new Date(subasta.fecha_fin))   return { success: false, error: 'La subasta ya cerró' };

    // Puja actual más alta
    const maxRes = await pool.request()
      .input('vid2', sql.Int, vehiculo_id)
      .query(`SELECT TOP 1 monto FROM ${TABLE} WHERE vehiculo_id = @vid2 ORDER BY monto DESC`);

    const montoActual = parseFloat(maxRes.recordset[0]?.monto ?? subasta.precio_base);
    const montoNuevo  = parseFloat(monto);

    if (montoNuevo <= parseFloat(subasta.precio_base)) {
      return { success: false, error: `La oferta debe ser mayor al precio base (Q. ${subasta.precio_base})` };
    }
    if (montoNuevo < montoActual * 1.10) {
      return {
        success: false,
        error: `La puja debe superar la oferta actual (Q. ${montoActual.toFixed(2)}) en al menos un 10%. Mínimo: Q. ${(montoActual * 1.10).toFixed(2)}`,
      };
    }

    // Insertar puja
    const result = await pool.request()
      .input('monto',       sql.Decimal(18,2), montoNuevo)
      .input('vehiculo_id', sql.Int,           vehiculo_id)
      .input('usuario_id',  sql.Int,           usuario_id)
      .query(`
        INSERT INTO ${TABLE} (monto, vehiculo_id, usuario_id)
        OUTPUT INSERTED.*
        VALUES (@monto, @vehiculo_id, @usuario_id)
      `);

    return { success: true, puja: result.recordset[0] };
  },
};

module.exports = PujaModel;
