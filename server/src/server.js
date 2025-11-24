// app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/userRoutes');
const { requireAuth } = require('./middlewares/auth.middleware');
const cookieParser = require('cookie-parser');


const app = express();

app.set('trust proxy', false);
app.use(express.json());
app.use(cookieParser());

// --- CORS primero ---
const allowedOrigins = [
  process.env.FRONTEND_URL,          // p.ej. http://localhost:5173
  'http://localhost:5173',           // fallback útil en dev
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // permitir REST tools / SSR sin origin
    if (!origin) return callback(null, true);
    const ok = allowedOrigins.includes(origin);
    callback(ok ? null : new Error('Not allowed by CORS'), ok);
  },
  credentials: true, // necesario para /auth/refresh (cookie httpOnly)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204, // evita issues con navegadores antiguos
}));

// Asegura que todos los preflights reciban los headers CORS correctos
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
}));

// --- Rutas ---
app.use('/auth', authRoutes);
app.use('/api', userRoutes);

// ejemplo protegido
app.get('/private/hello', requireAuth, (req, res) => {
  res.json({ msg: `Hola, usuario ${req.user.id}` });
});

app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err?.stack || err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API corriendo en :${port}`));
