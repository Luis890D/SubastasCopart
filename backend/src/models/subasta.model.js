const { getPool, sql } = require('../config/db');

/**
 * Modelo Subasta - Acceso a datos para la tabla Subastas
 */
const SubastaModel = {
  /**
   * Obtiene todas las subastas
   * @returns {Promise<Array>}
   */
  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Subastas ORDER BY fecha_inicio DESC');
    return result.recordset;
  },

  /**
   * Obtiene una subasta por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Subastas WHERE id = @id');
    return result.recordset[0] || null;
  },

  /**
   * Crea una nueva subasta
   * @param {{ titulo, descripcion, precio_base, fecha_inicio, fecha_fin, usuario_id }} data
   * @returns {Promise<Object>}
   */
  async create({ titulo, descripcion, precio_base, fecha_inicio, fecha_fin, usuario_id }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('titulo',       sql.VarChar(200),  titulo)
      .input('descripcion',  sql.Text,          descripcion)
      .input('precio_base',  sql.Decimal(18,2), precio_base)
      .input('fecha_inicio', sql.DateTime,      new Date(fecha_inicio))
      .input('fecha_fin',    sql.DateTime,      new Date(fecha_fin))
      .input('usuario_id',   sql.Int,           usuario_id)
      .query(`
        INSERT INTO Subastas (titulo, descripcion, precio_base, fecha_inicio, fecha_fin, usuario_id)
        OUTPUT INSERTED.*
        VALUES (@titulo, @descripcion, @precio_base, @fecha_inicio, @fecha_fin, @usuario_id)
      `);
    return result.recordset[0];
  },

  /**
   * Actualiza una subasta por ID
   * @param {number} id
   * @param {{ titulo, descripcion, precio_base, fecha_inicio, fecha_fin }} data
   * @returns {Promise<Object|null>}
   */
  async update(id, { titulo, descripcion, precio_base, fecha_inicio, fecha_fin }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id',           sql.Int,           id)
      .input('titulo',       sql.VarChar(200),  titulo)
      .input('descripcion',  sql.Text,          descripcion)
      .input('precio_base',  sql.Decimal(18,2), precio_base)
      .input('fecha_inicio', sql.DateTime,      new Date(fecha_inicio))
      .input('fecha_fin',    sql.DateTime,      new Date(fecha_fin))
      .query(`
        UPDATE Subastas
        SET titulo = @titulo, descripcion = @descripcion,
            precio_base = @precio_base, fecha_inicio = @fecha_inicio, fecha_fin = @fecha_fin
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  },

  /**
   * Elimina una subasta por ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Subastas WHERE id = @id');
    return result.rowsAffected[0] > 0;
  },
};

module.exports = SubastaModel;
