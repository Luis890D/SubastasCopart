const { getPool, sql } = require('../config/db');

const TABLE       = 'Vehiculos_7145';
const FOTOS_TABLE = 'FotosVehiculo_7145';

/**
 * Modelo Vehiculo — tablas Vehiculos_7145 y FotosVehiculo_7145
 */
const VehiculoModel = {
  /**
   * Listar vehículos con filtros opcionales (búsqueda escrita y por lista)
   */
  async findAll({ busqueda, marca, modelo, anio, combustible, nivel_danio, tren_manejo, orden } = {}) {
    const pool = await getPool();
    const req  = pool.request();
    const where = [];

    if (busqueda && busqueda.trim()) {
      req.input('busqueda', sql.VarChar(100), `%${busqueda.trim()}%`);
      where.push('(v.marca LIKE @busqueda OR v.modelo LIKE @busqueda OR CAST(v.anio AS VARCHAR) LIKE @busqueda OR v.tipo_articulo LIKE @busqueda)');
    }

    if (marca && marca.trim()) {
      req.input('marca', sql.VarChar(100), `%${marca.trim()}%`);
      where.push('v.marca LIKE @marca');
    }
    if (modelo && modelo.trim()) {
      req.input('modelo', sql.VarChar(100), `%${modelo.trim()}%`);
      where.push('v.modelo LIKE @modelo');
    }
    if (anio) {
      req.input('anio', sql.Int, parseInt(anio));
      where.push('v.anio = @anio');
    }
    if (combustible && combustible.trim()) {
      req.input('combustible', sql.VarChar(50), combustible.trim());
      where.push('v.combustible = @combustible');
    }
    if (nivel_danio && nivel_danio.trim()) {
      req.input('nivel_danio', sql.VarChar(10), nivel_danio.trim());
      where.push('v.nivel_danio = @nivel_danio');
    }
    if (tren_manejo && tren_manejo.trim()) {
      req.input('tren_manejo', sql.VarChar(10), tren_manejo.trim());
      where.push('v.tren_manejo = @tren_manejo');
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    let orderBy = 'ORDER BY v.created_at DESC';
    if (orden === 'precio_asc') {
      orderBy = 'ORDER BY v.precio_base ASC';
    } else if (orden === 'precio_desc') {
      orderBy = 'ORDER BY v.precio_base DESC';
    } else if (orden === 'tiempo_fin') {
      orderBy = 'ORDER BY v.fecha_fin ASC';
    } else if (orden === 'anio_desc') {
      orderBy = 'ORDER BY v.anio DESC';
    }

    const result = await req.query(`
      SELECT v.*,
             u.nombre AS propietario_nombre,
             u.apellido AS propietario_apellido,
             (SELECT TOP 1 url FROM ${FOTOS_TABLE} WHERE vehiculo_id = v.id ORDER BY orden ASC) AS foto_portada,
             (SELECT COUNT(*) FROM Pujas_7145 WHERE vehiculo_id = v.id) AS total_pujas,
             (SELECT TOP 1 monto FROM Pujas_7145 WHERE vehiculo_id = v.id ORDER BY monto DESC) AS puja_actual
      FROM ${TABLE} v
      INNER JOIN Usuarios_7145 u ON v.usuario_id = u.id
      ${whereClause}
      ${orderBy}
    `);
    return result.recordset;
  },

  /**
   * Obtener un vehículo por ID con fotos y puja actual
   */
  async findById(id) {
    const pool = await getPool();
    const [vehiculo, fotos, pujaTop] = await Promise.all([
      pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT v.*,
                 u.nombre AS propietario_nombre,
                 u.apellido AS propietario_apellido,
                 (SELECT COUNT(*) FROM Pujas_7145 WHERE vehiculo_id = v.id) AS total_pujas,
                 (SELECT TOP 1 monto FROM Pujas_7145 WHERE vehiculo_id = v.id ORDER BY monto DESC) AS puja_actual
          FROM ${TABLE} v
          INNER JOIN Usuarios_7145 u ON v.usuario_id = u.id
          WHERE v.id = @id
        `),
      pool.request()
        .input('vid', sql.Int, id)
        .query(`SELECT * FROM ${FOTOS_TABLE} WHERE vehiculo_id = @vid ORDER BY orden ASC`),
      pool.request()
        .input('vid2', sql.Int, id)
        .query(`SELECT TOP 1 monto FROM Pujas_7145 WHERE vehiculo_id = @vid2 ORDER BY monto DESC`),
    ]);

    if (!vehiculo.recordset[0]) return null;

    return {
      ...vehiculo.recordset[0],
      fotos:       fotos.recordset,
      puja_actual: pujaTop.recordset[0]?.monto ?? vehiculo.recordset[0].precio_base,
    };
  },

  /**
   * Obtener vehículos de un usuario
   */
  async findByUsuario(usuario_id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('usuario_id', sql.Int, usuario_id)
      .query(`
        SELECT v.*,
               (SELECT TOP 1 url FROM ${FOTOS_TABLE} WHERE vehiculo_id = v.id ORDER BY orden ASC) AS foto_portada,
               (SELECT TOP 1 monto FROM Pujas_7145 WHERE vehiculo_id = v.id ORDER BY monto DESC) AS puja_actual
        FROM ${TABLE} v
        WHERE v.usuario_id = @usuario_id
        ORDER BY v.created_at DESC
      `);
    return result.recordset;
  },

  /**
   * Crear vehículo
   */
  async create({
    usuario_id, anio, tipo_articulo, marca, modelo, motor,
    transmision, combustible, tren_manejo, cilindros,
    nivel_danio, precio_base, fecha_inicio, fecha_fin
  }) {
    const pool = await getPool();
    const result = await pool.request()
      .input('usuario_id',    sql.Int,           usuario_id)
      .input('anio',          sql.Int,           parseInt(anio))
      .input('tipo_articulo', sql.VarChar(100),  tipo_articulo)
      .input('marca',         sql.VarChar(100),  marca)
      .input('modelo',        sql.VarChar(100),  modelo)
      .input('motor',         sql.VarChar(100),  motor)
      .input('transmision',   sql.VarChar(50),   transmision)
      .input('combustible',   sql.VarChar(50),   combustible)
      .input('tren_manejo',   sql.VarChar(10),   tren_manejo)
      .input('cilindros',     sql.Int,           parseInt(cilindros))
      .input('nivel_danio',   sql.VarChar(10),   nivel_danio)
      .input('precio_base',   sql.Decimal(18,2), parseFloat(precio_base))
      .input('fecha_inicio',  sql.DateTime,      new Date(fecha_inicio))
      .input('fecha_fin',     sql.DateTime,      new Date(fecha_fin))
      .query(`
        INSERT INTO ${TABLE}
          (usuario_id, anio, tipo_articulo, marca, modelo, motor,
           transmision, combustible, tren_manejo, cilindros,
           nivel_danio, precio_base, fecha_inicio, fecha_fin)
        OUTPUT INSERTED.*
        VALUES
          (@usuario_id, @anio, @tipo_articulo, @marca, @modelo, @motor,
           @transmision, @combustible, @tren_manejo, @cilindros,
           @nivel_danio, @precio_base, @fecha_inicio, @fecha_fin)
      `);
    return result.recordset[0];
  },

  /**
   * Actualizar vehículo (solo el dueño)
   */
  async update(id, usuario_id, data) {
    const pool = await getPool();
    const {
      anio, tipo_articulo, marca, modelo, motor,
      transmision, combustible, tren_manejo, cilindros,
      nivel_danio, precio_base, fecha_inicio, fecha_fin
    } = data;

    const result = await pool.request()
      .input('id',            sql.Int,           id)
      .input('usuario_id',    sql.Int,           usuario_id)
      .input('anio',          sql.Int,           parseInt(anio))
      .input('tipo_articulo', sql.VarChar(100),  tipo_articulo)
      .input('marca',         sql.VarChar(100),  marca)
      .input('modelo',        sql.VarChar(100),  modelo)
      .input('motor',         sql.VarChar(100),  motor)
      .input('transmision',   sql.VarChar(50),   transmision)
      .input('combustible',   sql.VarChar(50),   combustible)
      .input('tren_manejo',   sql.VarChar(10),   tren_manejo)
      .input('cilindros',     sql.Int,           parseInt(cilindros))
      .input('nivel_danio',   sql.VarChar(10),   nivel_danio)
      .input('precio_base',   sql.Decimal(18,2), parseFloat(precio_base))
      .input('fecha_inicio',  sql.DateTime,      new Date(fecha_inicio))
      .input('fecha_fin',     sql.DateTime,      new Date(fecha_fin))
      .query(`
        UPDATE ${TABLE}
        SET anio = @anio, tipo_articulo = @tipo_articulo, marca = @marca,
            modelo = @modelo, motor = @motor, transmision = @transmision,
            combustible = @combustible, tren_manejo = @tren_manejo,
            cilindros = @cilindros, nivel_danio = @nivel_danio,
            precio_base = @precio_base, fecha_inicio = @fecha_inicio, fecha_fin = @fecha_fin
        OUTPUT INSERTED.*
        WHERE id = @id AND usuario_id = @usuario_id
      `);
    return result.recordset[0] || null;
  },

  /**
   * Agregar fotos a un vehículo
   * @param {number} vehiculo_id
   * @param {Array<{url, orden}>} fotos
   */
  async addFotos(vehiculo_id, fotos) {
    const pool = await getPool();
    const results = [];
    for (const [i, foto] of fotos.entries()) {
      const r = await pool.request()
        .input('vehiculo_id', sql.Int,         vehiculo_id)
        .input('url',         sql.VarChar(500), foto.url)
        .input('orden',       sql.Int,          foto.orden ?? i)
        .query(`
          INSERT INTO ${FOTOS_TABLE} (vehiculo_id, url, orden)
          OUTPUT INSERTED.*
          VALUES (@vehiculo_id, @url, @orden)
        `);
      results.push(r.recordset[0]);
    }
    return results;
  },

  /**
   * Obtener fotos de un vehículo
   */
  async getFotos(vehiculo_id) {
    const pool = await getPool();
    const result = await pool.request()
      .input('vehiculo_id', sql.Int, vehiculo_id)
      .query(`SELECT * FROM ${FOTOS_TABLE} WHERE vehiculo_id = @vehiculo_id ORDER BY orden ASC`);
    return result.recordset;
  },
};

module.exports = VehiculoModel;
