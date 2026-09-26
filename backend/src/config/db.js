const sql = require('mssql');

const server   = process.env.DB_HOST || process.env.dB_HOST || process.env.DB_SERVER || 'svr-sql-ctezo.southcentralus.cloudapp.azure.com';
const database = process.env.DB_NAME || process.env.DB_DATABASE || 'db_WebDevUMG';
const user     = process.env.DB_USER || 'UsuarioEncuestas';
const password = process.env.DB_PASSWORD || 'DesaWeb2025$!';
const port     = parseInt(process.env.DB_PORT) || 1433;

const config = {
  user,
  password,
  server,
  database,
  port,
  options: {
    encrypt: process.env.DB_ENCRYPT !== 'false',
    trustServerCertificate: true, // Siempre true para certificado autofirmado en Azure
    connectTimeout: 20000,
    requestTimeout: 20000,
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
      console.log('✅ Conectado a SQL Server:', config.database, 'en', config.server);
    } catch (err) {
      pool = null;
      console.error('❌ Error conectando a SQL Server:', err.message);
      throw err;
    }
  }
  return pool;
};

module.exports = { sql, getPool };
