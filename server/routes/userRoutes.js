// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/Users', userController.getAllUsers);

// Ruta para agregar un nuevo usuario
router.post('/Users', userController.createUser);

module.exports = router;
