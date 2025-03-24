const db = require('./db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Name TEXT NOT NULL,
      Email TEXT NOT NULL,
      Password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creando la tabla:", err.message);
    } else {
      console.log("Tabla 'Users' creada o ya existente.");
    }
  });
});
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Preguntas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      Texto TEXT NOT NULL,
      Tipo_pregunta TEXT NOT NULL,
      Dificultad TEXT NOT NULL,
       TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creando la tabla:", err.message);
    } else {
      console.log("Tabla 'Users' creada o ya existente.");
    }
  });
});

// Cierra la conexión (opcional, para este script de inicialización)
db.close();
