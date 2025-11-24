// server/utils/audit.util.js
const { sql, getPool } = require('../config/db');

async function auditAuth({ userId, sessionId = null, event, message = null, ip, ua }) {
  try {
    const pool = await getPool();
    await pool.request()
      .input('userId', sql.Int, userId || 0)
      .input('sessionId', sql.Int, sessionId || null)
      .input('event', sql.NVarChar(50), event)
      .input('message', sql.NVarChar(200), message || null)
      .input('ip', sql.VarChar(45), ip || null)
      .input('ua', sql.NVarChar(255), ua || null)
      .query(`
        INSERT INTO dbo.audit_auth_log (UserID, SessionID, Event, Message, IpAddress, UserAgent, CreatedAt)
        VALUES (@userId, @sessionId, @event, @message, @ip, @ua, SYSUTCDATETIME())
      `);
  } catch (e) {
    console.error('Audit error:', e.message);
  }
}

module.exports = { auditAuth };
