// server/config/db.js
require('dotenv').config();
const sql = require('mssql');

const config = {
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.MSSQL_PASSWORD || 'YourStrong!Passw0rd',
  server: process.env.MSSQL_HOST || 'localhost',
  port: parseInt(process.env.MSSQL_PORT || '1433', 10),
  database: process.env.MSSQL_DATABASE || 'DevRecruiter',
  options: {
    encrypt: true,          // requerido cuando se conecta desde contenedor a contenedor con sqlcmd -C (cert)
    trustServerCertificate: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool;
async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(config);
  return pool;
}

module.exports = { sql, getPool };
