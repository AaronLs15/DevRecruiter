// server/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors());
app.use(express.json());

// Montar rutas de la API
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

// Endpoint de salud o información del servidor
app.get('/', (req, res) => {
  res.send(`Servidor escuchando en el puerto ${PORT}`);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
