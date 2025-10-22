// server/scripts/initSchema.js
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { sql, getPool } = require('../config/db');

(async () => {
  try {
    const pool = await getPool();
    const schemaPath = path.join(__dirname, '..', '..', 'db', 'sql', '001_schema.sql');
    const sqlText = fs.readFileSync(schemaPath, 'utf8');

    // Divide por 'GO' para ejecutar en lotes (SQL Server)
    const batches = sqlText
      .split(/\r?\nGO\r?\n/gi)
      .map(s => s.trim())
      .filter(Boolean);

    for (const batch of batches) {
      await pool.request().batch(batch);
    }

    console.log('Esquema creado/actualizado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error aplicando esquema:', err);
    process.exit(1);
  }
})();
