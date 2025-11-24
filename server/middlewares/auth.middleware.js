const { verifyAccessToken } = require('../utils/jwt.util');
const { getSessionById, withinIdleTimeout, bumpActivity, revokeSession } = require('../services/auth.service');
const { auditAuth } = require('../utils/audit.util');

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'UNAUTHORIZED' });

    const payload = verifyAccessToken(token);
    const { sub: userId, sid: sessionId } = payload || {};
    if (!userId || !sessionId) return res.status(401).json({ error: 'INVALID_TOKEN' });

    const [session] = await getSessionById(sessionId);
    if (!session) return res.status(401).json({ error: 'SESSION_NOT_FOUND' });
    if (session.RevokedAt) return res.status(401).json({ error: 'SESSION_REVOKED' });

    const now = new Date();
    if (now > new Date(session.ExpiresAt)) {
      await revokeSession(session.SessionID, 'expired');
      await auditAuth({ userId, sessionId, event: 'logout', message: 'expired', ip: req.ip, ua: req.get('user-agent') });
      return res.status(401).json({ error: 'SESSION_EXPIRED' });
    }

    const okIdle = await withinIdleTimeout(session.LastActivity);
    if (!okIdle) {
      await revokeSession(session.SessionID, 'idle_timeout');
      await auditAuth({ userId, sessionId, event: 'logout_idle', ip: req.ip, ua: req.get('user-agent') });
      return res.status(401).json({ error: 'SESSION_IDLE' });
    }

    // Sesión válida: actualizar actividad
    await bumpActivity(session.SessionID);

    req.user = { id: userId };
    req.session = { id: sessionId };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'INVALID_OR_EXPIRED_TOKEN' });
  }
}

module.exports = { requireAuth };