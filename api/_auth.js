// LOBBY — session admin (/gestion) : cookie signé HMAC, valable 12 h. Code et secret = variables d'env Vercel.
const crypto = require('crypto');
const NAME = 'lobby_admin', TTL = 12 * 3600 * 1000;
const secret = () => process.env.ADMIN_SECRET || '';
const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('hex');
function cookies(req) { const o = {}; (req.headers.cookie || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) o[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); }); return o; }
function isAdmin(req) {
  if (!secret()) return false;
  const v = cookies(req)[NAME]; if (!v) return false;
  const [ts, mac] = v.split('.'); if (!ts || !mac) return false;
  if (Date.now() - +ts > TTL) return false;
  const good = sign(ts);
  return mac.length === good.length && crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(good));
}
function sessionCookie() { const ts = String(Date.now()); return `${NAME}=${ts}.${sign(ts)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL / 1000}`; }
const clearCookie = () => `${NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
function codeOk(input) {
  const code = process.env.ADMIN_CODE || '';
  if (!code || typeof input !== 'string') return false;
  const a = crypto.createHash('sha256').update(input.trim().toUpperCase()).digest(), b = crypto.createHash('sha256').update(code.toUpperCase()).digest();
  return crypto.timingSafeEqual(a, b);
}
module.exports = { isAdmin, sessionCookie, clearCookie, codeOk };
