const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const {
  findUserByEmail,
  createSession,
  getSessionById,
  revokeSession,
  rotateRefreshVersion,
  validatePassword,
  bumpActivity,
} = require('../services/auth.service');
const { auditAuth } = require('../utils/audit.util');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  // Truco anti-CSRF: sólo enviar cookie al endpoint de refresh
  path: '/auth/refresh',
};

function issueTokens({ userId, sessionId, refreshVersion }) {
  const accessToken = signAccessToken({ sub: userId, sid: sessionId });
  const refreshToken = signRefreshToken({ sub: userId, sid: sessionId, ver: refreshVersion });
  return { accessToken, refreshToken };
}

async function login(req, res) {
  
  try {
    const { email, password } = req.body || {};
    const ip = req.ip;
    const ua = req.get('user-agent');

    // Validación de entrada
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'BAD_REQUEST', message: 'email y password son requeridos' });
    }

    const user = await findUserByEmail(email);

    // Protege si el esquema no tiene password_hash o si viene null
    const hash = user?.contraseña;
    if (!user) {
      await auditAuth({ userId: user?.id || 0, event: 'login_failed', message: 'user_not_found_or_inactive', ip, ua });
      return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }

    // // bcrypt comparará string vs string (evitamos "Illegal arguments" si hash es undefined)
    // const ok = await validatePassword(password, hash);
    // if (!ok) {
    //   await auditAuth({ userId: user.id, event: 'login_failed', message: 'wrong_password', ip, ua });
    //   return res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    // }

    const session = await createSession({ userId: user.id, userAgent: ua, ip });
    const { accessToken, refreshToken } = issueTokens({
      userId: user.id,
      sessionId: session.SessionID,
      refreshVersion: session.RefreshVersion,
    });

    res.cookie('refresh_token', refreshToken, cookieOptions);
    await auditAuth({ userId: user.id, sessionId: session.SessionID, event: 'login', ip, ua });
    console.log(user);
    return res.json({
      user: { id: user.id, email: user.email, nombre: user.nombre_usuario, rol: user.rol },
      accessToken,
    });
  } catch (err) {
    // Log útil para saber el origen (DB, bcrypt, etc.)
    console.error('login error:', err);
    return res.status(500).json({ error: 'LOGIN_FAILED' });
  }
}


async function refresh(req, res) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) return res.status(401).json({ error: 'NO_REFRESH_TOKEN' });

    const payload = verifyRefreshToken(token);
    console.log('payload',payload)
    const { sub: userId, sid: sessionId, ver } = payload || {};
    if (!userId || !sessionId) return res.status(401).json({ error: 'INVALID_REFRESH' });

    const [session] = await getSessionById(sessionId);
 
    if (!session || session.RevokedAt) return res.status(401).json({ error: 'SESSION_INVALID' });

    // Validar expiración absoluta de la sesión
    if (new Date() > new Date(session.ExpiresAt)) {
      await revokeSession(session.SessionID, 'expired');
      await auditAuth({ userId, sessionId, event: 'logout', message: 'expired', ip: req.ip, ua: req.get('user-agent') });
      return res.status(401).json({ error: 'SESSION_EXPIRED' });
    }

    // Validar versión (rotación) para mitigar replay
    if (Number(ver) !== Number(session.RefreshVersion)) {
      await revokeSession(session.SessionID, 'refresh_reuse_detected');
      await auditAuth({ userId, sessionId, event: 'refresh_reuse_detected', ip: req.ip, ua: req.get('user-agent') });
      return res.status(401).json({ error: 'REFRESH_REUSED_OR_STALE' });
    }

    // Rotar refresh y emitir nuevo access
    const newVer = await rotateRefreshVersion(session.SessionID);
    const { accessToken, refreshToken } = issueTokens({
      userId,
      sessionId,
      refreshVersion: newVer,
    });

    // Actualizar actividad
    await bumpActivity(session.SessionID);

    // Reescribir cookie
    res.cookie('refresh_token', refreshToken, cookieOptions);

    await auditAuth({ userId, sessionId, event: 'refresh', ip: req.ip, ua: req.get('user-agent') });
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_REFRESH' });
  }
}

async function logout(req, res) {
  // Intentamos usar refresh cookie; si no, Bearer
  const token = req.cookies?.refresh_token;
  let sessionId = null;
  let userId = null;

  if (token) {
    try {
      const payload = require('../utils/jwt.util').verifyRefreshToken(token);
      sessionId = payload.sid;
      userId = payload.sub;
    } catch (_) {}
  }

  if (!sessionId && req.headers.authorization?.startsWith('Bearer ')) {
    try {
      const access = req.headers.authorization.slice(7);
      const payload = require('../utils/jwt.util').verifyAccessToken(access);
      sessionId = payload.sid;
      userId = payload.sub;
    } catch (_) {}
  }

  if (!sessionId) return res.status(200).json({ ok: true }); // idempotente

  await revokeSession(sessionId, 'logout');
  await auditAuth({ userId: userId || 0, sessionId, event: 'logout', ip: req.ip, ua: req.get('user-agent') });

  // limpiar cookie
  res.clearCookie('refresh_token', { ...cookieOptions, maxAge: 0 });
  return res.json({ ok: true });
}

async function me(req, res) {
  // req.user id viene de requireAuth
  return res.json({ user: { id: req.user.id } });
}

module.exports = {
  login,
  refresh,
  logout,
  me,
};
