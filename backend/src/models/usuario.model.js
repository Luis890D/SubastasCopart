const { getPool, sql } = require('../config/db');

/**
 * Modelo Usuario - Acceso a datos para la tabla Usuarios
 */
const UsuarioModel = {
  /**
   * Obtiene todos los usuarios
   * @returns {Promise<Array>}
   */
  async findAll() {
    const pool = await getPool();
    const result = await pool.request().query('SELECT * FROM Usuarios');
    return result.recordset;
  },

  /**
   * Obtiene un usuario por ID
   * @param {number} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Usuarios WHERE id = @id');
    return result.recordset[0] || null;
  },

  /**
   * Obtiene un usuario por correo electrónico
   * @param {string} correo
   * @returns {Promise<Object|null>}
   */
  async findByCorreo(correo) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('correo', sql.VarChar(255), correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo');
    return result.recordset[0] || null;
  },

  /**
   * Crea un nuevo usuario
   * @param {{ nombre, correo, password }} data
   * @returns {Promise<Object>}
   */
  async create({ nombre, correo, password }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('nombre',   sql.VarChar(150), nombre)
      .input('correo',   sql.VarChar(255), correo)
      .input('password', sql.VarChar(255), password)
      .query(`
        INSERT INTO Usuarios (nombre, correo, password)
        OUTPUT INSERTED.*
        VALUES (@nombre, @correo, @password)
      `);
    return result.recordset[0];
  },

  /**
   * Actualiza un usuario por ID
   * @param {number} id
   * @param {{ nombre, correo }} data
   * @returns {Promise<Object|null>}
   */
  async update(id, { nombre, correo }) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id',     sql.Int,         id)
      .input('nombre', sql.VarChar(150), nombre)
      .input('correo', sql.VarChar(255), correo)
      .query(`
        UPDATE Usuarios
        SET nombre = @nombre, correo = @correo
        OUTPUT INSERTED.*
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  },

  /**
   * Elimina un usuario por ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Usuarios WHERE id = @id');
    return result.rowsAffected[0] > 0;
  },
};

module.exports = UsuarioModel;
