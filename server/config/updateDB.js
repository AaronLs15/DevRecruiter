const db = require('./db');

db.run(`ALTER TABLE Users ADD COLUMN Image TEXT`, (err) => {
  if (err) {
    console.error('Error al agregar la columna:', err.message);
  } else {
    console.log("Columna 'Imagen' agregada exitosamente a la tabla Users.");
  }
  db.close();
});