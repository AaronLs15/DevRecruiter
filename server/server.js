const express = require('express');
const cors = require('cors');
const path = require('path'); // Opcional: para manejo avanzado de rutas si lo requieres
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para obtener todos los usuarios
app.get('/api/Users', (req, res) => {
  db.all("SELECT * FROM Users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Endpoint para agregar un nuevo usuario
app.post('/api/Users', (req, res) => {
  const { Name, Email, Password } = req.body;
  if (!Name || !Email || !Password) {
    res.status(400).json({ error: "Te hacen falta datos" });
    return;
  }
  db.run(
    "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)",
    [Name, Email, Password],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
    }
  );
});

// Endpoint interactivo para ver la ruta completa del backend
app.get('/', (req, res) => {
  res.send(`Servidor escuchando en el puerto ${PORT}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
