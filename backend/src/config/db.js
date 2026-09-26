const sql = require('mssql');

const config = {
  user:     process.env.DB_USER     || 'UsuarioEncuestas',
  password: process.env.DB_PASSWORD || 'DesaWeb2025$!',
  server:   process.env.DB_SERVER   || 'svr-sql-ctezo.southcentralus.cloudapp.azure.com',
  database: process.env.DB_DATABASE || 'db_WebDevUMG',
  port:     parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt:              process.env.DB_ENCRYPT !== 'false',
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool = null;

/**
 * Devuelve (o crea) el pool de conexiones de SQL Server.
 * @returns {Promise<sql.ConnectionPool>}
 */
const getPool = async () => {
  if (!pool || !pool.connected) {
    try {
      pool = await new sql.ConnectionPool(config).connect();
      console.log('✅ Conectado a SQL Server:', config.database);
    } catch (err) {
      pool = null;
      console.error('❌ Error conectando a SQL Server:', err.message);
      throw err;
    }
  }
  return pool;
};

module.exports = { sql, getPool };
