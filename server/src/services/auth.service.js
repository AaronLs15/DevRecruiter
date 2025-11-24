// server/services/auth.service.js
const { sql, getPool } = require('../config/db');

async function findUserByEmail(email) {
  const pool = await getPool();
  const result = await pool.request()
    .input('email', sql.NVarChar(255), email)
    .query(`
      SELECT id, email, contraseña, rol, nombre_usuario
      FROM dbo.usuarios
      WHERE email = @email
    `);
  return result.recordset[0] || null;
}

async function createSession({ userId, userAgent, ip }) {
  const pool = await getPool();
  const ttlDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);

  const result = await pool.request()
    .input('userId', sql.Int, userId)
    .input('userAgent', sql.NVarChar(255), userAgent || null)
    .input('ip', sql.VarChar(45), ip || null)
    .input('ttl', sql.Int, ttlDays)
    .query(`
      INSERT INTO dbo.auth_session (UserID, RefreshVersion, UserAgent, IpAddress, CreatedAt, LastActivity, ExpiresAt)
      VALUES (@userId, 1, @userAgent, @ip, SYSUTCDATETIME(), SYSUTCDATETIME(), DATEADD(DAY, @ttl, SYSUTCDATETIME()));
      SELECT SCOPE_IDENTITY() AS SessionID;
    `);

  const sessionId = Number(result.recordset[0].SessionID);
  const sess = await getSessionById(sessionId);
  return sess;
}

async function getSessionById(sessionId) {
  const pool = await getPool();
  const result = await pool.request()
    .input('sid', sql.Int, sessionId)
    .query(`SELECT * FROM dbo.auth_session WHERE SessionID = @sid`);
  return result.recordset[0] || null;
}

async function bumpActivity(sessionId) {
  const pool = await getPool();
  await pool.request()
    .input('sid', sql.Int, sessionId)
    .query(`UPDATE dbo.auth_session SET LastActivity = SYSUTCDATETIME() WHERE SessionID = @sid`);
}

async function revokeSession(sessionId, reason = 'logout') {
  const pool = await getPool();
  await pool.request()
    .input('sid', sql.Int, sessionId)
    .input('reason', sql.NVarChar(100), reason)
    .query(`
      UPDATE dbo.auth_session
      SET RevokedAt = SYSUTCDATETIME(), RevokedReason = @reason
      WHERE SessionID = @sid AND RevokedAt IS NULL
    `);
}

async function rotateRefreshVersion(sessionId) {
  const pool = await getPool();
  await pool.request()
    .input('sid', sql.Int, sessionId)
    .query(`
      UPDATE dbo.auth_session
      SET RefreshVersion = RefreshVersion + 1
      WHERE SessionID = @sid AND RevokedAt IS NULL;

      SELECT RefreshVersion FROM dbo.auth_session WHERE SessionID = @sid;
    `);

  const result = await pool.request()
    .input('sid', sql.Int, sessionId)
    .query(`SELECT RefreshVersion FROM dbo.auth_session WHERE SessionID = @sid`);
  return result.recordset[0]?.RefreshVersion;
}

async function withinIdleTimeout(lastActivity) {
  const idleMin = Number(process.env.IDLE_TIMEOUT_MIN || 30);
  const last = new Date(lastActivity);
  const now = new Date();
  const diffMin = (now - last) / (1000 * 60);
  return diffMin <= idleMin;
}

async function validatePassword(plain, hash) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(plain, hash);
}

module.exports = {
  findUserByEmail,
  createSession,
  getSessionById,
  bumpActivity,
  revokeSession,
  rotateRefreshVersion,
  withinIdleTimeout,
  validatePassword,
};
