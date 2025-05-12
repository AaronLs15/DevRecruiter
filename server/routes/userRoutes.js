// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/Users', userController.getAllUsers);

// Ruta para obtener un usuario por ID
router.get('/Users/:ID', userController.getUserByID);

// Ruta para agregar un nuevo usuario
router.post('/actUser', userController.createUser);

// Ruta para agregar un nuevo aspirante
router.post('/actAspirante', userController.actAspirante);

// Ruta para agregar un nuevo empleador
router.post('/actEmpleador', userController.actEmpleador);

// Ruta para iniciar sesión
router.post('/iniciarSesion', userController.iniciarSesion);

// Ruta para obtener las preguntas de la primera fase
router.get('/PrimeraFasePreguntas', userController.getPrimeraFase);

//Ruta para crear la entrevista
router.post('/Entrevista', userController.createEntrevista);

// Ruta para insertar la calificación de la primera fase
router.post('/actCalificacionPrimeraFase', userController.actCalificacionPrimeraFase);

// Ruta para insertar la calificacion de la segunda fase
router.post('/actCalificacionSegundaFase', userController.actCalificacionSegundaFase);

// Ruta para insertar el feedback de la entrevista
router.post('/actFeedbackEntrevista', userController.actFeedbackEntrevistau);

//Ruta para insertar entrevista ya finalizada
router.post('/actEntrevistaFinalizada', userController.actEntrevistaFinalizada);

//Ruta para obtener Entrevistas
router.post('/Entrevistas', userController.getEntrevistaByUserID);

// Ruta para obtener los datos del perfil de un usuario
router.get('/users/:id/profile', userController.getProfile);

// Ruta para obtener los puntajes de un usuario
router.get('/users/:id/interviews', userController.getPuntajes);

module.exports = router;
