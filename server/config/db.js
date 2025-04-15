// server/config/db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectándose a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

module.exports = db;
