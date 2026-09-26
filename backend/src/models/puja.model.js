const { getPool, sql } = require('../config/db');

/**
 * Modelo Puja - Acceso a datos para la tabla Pujas
 */
const PujaModel = {
  /**
   * Obtiene todas las pujas de una subasta
   * @param {number} subasta_id
   * @returns {Promise<Array>}
   */
  async findBySubasta(subasta_id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('subasta_id', sql.Int, subasta_id)
      .query('SELECT * FROM Pujas WHERE subasta_id = @subasta_id ORDER BY monto DESC');
    return result.recordset;
  },

  /**
   * Obtiene la puja más alta de una subasta
   * @param {number} subasta_id
   * @returns {Promise<Object|null>}
   */
  async findMaxPuja(subasta_id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('subasta_id', sql.Int, subasta_id)
      .query('SELECT TOP 1 * FROM Pujas WHERE subasta_id = @subasta_id ORDER BY monto DESC');
    return result.recordset[0] || null;
  },

  /**
   * Crea una nueva puja
   * @param {{ monto, subasta_id, usuario_id }} data
   * @returns {Promise<Object>}
   */
  async create({ monto, subasta_id, usuario_id }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('monto',       sql.Decimal(18,2), monto)
      .input('subasta_id',  sql.Int,           subasta_id)
      .input('usuario_id',  sql.Int,           usuario_id)
      .query(`
        INSERT INTO Pujas (monto, subasta_id, usuario_id, fecha)
        OUTPUT INSERTED.*
        VALUES (@monto, @subasta_id, @usuario_id, GETDATE())
      `);
    return result.recordset[0];
  },
};

module.exports = PujaModel;
