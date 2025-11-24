// server/db.js
const sql = require('mssql');

const config = {
  user: process.env.DB_USER,        // 'sa'
  password: process.env.DB_PASS,    // 'YourStrong!Passw0rd'
  server: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME,    // 'DevRecruiter'
  options: {
    encrypt: false,                 // en Windows/local usa false; en Azure true
    trustServerCertificate: true,   // dev local
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

// Single global pool
let poolPromise = null;

async function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config).then((pool) => {
      console.log('✅ MSSQL conectado');
      return pool;
    }).catch((err) => {
      console.error('❌ Error conectando a MSSQL:', err.message);
      poolPromise = null;
      throw err;
    });
  }
  return poolPromise;
}

module.exports = { sql, getPool };
