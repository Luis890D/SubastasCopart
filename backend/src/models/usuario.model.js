const { getPool, sql } = require('../config/db');

const TABLE = 'Usuarios_7145';

/**
 * Modelo Usuario — tabla Usuarios_7145
 */
const UsuarioModel = {
  async findAll() {
    const pool = await getPool();
    const result = await pool.request()
      .query(`SELECT id, nombre, apellido, correo, telefono, created_at FROM ${TABLE}`);
    return result.recordset;
  },

  async findById(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT id, nombre, apellido, correo, telefono, created_at FROM ${TABLE} WHERE id = @id`);
    return result.recordset[0] || null;
  },

  async findByCorreo(correo) {
    const pool = await getPool();
    const result = await pool.request()
      .input('correo', sql.VarChar(255), correo)
      .query(`SELECT * FROM ${TABLE} WHERE correo = @correo`);
    return result.recordset[0] || null;
  },

  /**
   * Crea un usuario (registro)
   * @param {{ nombre, apellido, correo, telefono, password }} data
   */
  async create({ nombre, apellido, correo, telefono, password }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('nombre',   sql.VarChar(100), nombre)
      .input('apellido', sql.VarChar(100), apellido)
      .input('correo',   sql.VarChar(255), correo)
      .input('telefono', sql.VarChar(20),  telefono || null)
      .input('password', sql.VarChar(255), password)
      .query(`
        INSERT INTO ${TABLE} (nombre, apellido, correo, telefono, password)
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.apellido,
               INSERTED.correo, INSERTED.telefono, INSERTED.created_at
        VALUES (@nombre, @apellido, @correo, @telefono, @password)
      `);
    return result.recordset[0];
  },

  async update(id, { nombre, apellido, correo, telefono }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id',       sql.Int,         id)
      .input('nombre',   sql.VarChar(100), nombre)
      .input('apellido', sql.VarChar(100), apellido)
      .input('correo',   sql.VarChar(255), correo)
      .input('telefono', sql.VarChar(20),  telefono || null)
      .query(`
        UPDATE ${TABLE}
        SET nombre = @nombre, apellido = @apellido,
            correo = @correo, telefono = @telefono
        OUTPUT INSERTED.id, INSERTED.nombre, INSERTED.apellido,
               INSERTED.correo, INSERTED.telefono
        WHERE id = @id
      `);
    return result.recordset[0] || null;
  },

  async delete(id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query(`DELETE FROM ${TABLE} WHERE id = @id`);
    return result.rowsAffected[0] > 0;
  },
};

module.exports = UsuarioModel;
