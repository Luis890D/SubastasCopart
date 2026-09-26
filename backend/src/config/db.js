const sql = require('mssql');

const config = {
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server:   process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port:     parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt:              process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true',
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
  if (!pool) {
    pool = await new sql.ConnectionPool(config).connect();
    console.log('✅ Conectado a SQL Server:', process.env.DB_DATABASE);
  }
  return pool;
};

module.exports = { sql, getPool };
