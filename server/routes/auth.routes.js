const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit'); // <- este paquete
const cookieParser = require('cookie-parser');
const { requireAuth } = require('../middlewares/auth.middleware');
const { login, refresh, logout, me } = require('../controllers/auth.controller');

// rate limiter opcional
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

module.exports = router;
