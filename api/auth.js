// LOBBY — connexion / déconnexion à /gestion. Anti-force brute : 5 essais par 10 min et par adresse.
const { sessionCookie, clearCookie, codeOk } = require('./_auth');
const tries = new Map();
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'DELETE') { res.setHeader('Set-Cookie', clearCookie()); res.status(200).json({ ok: true }); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return; }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'x';
  const now = Date.now(), t = (tries.get(ip) || []).filter((x) => now - x < 600000);
  if (t.length >= 5) { res.status(429).json({ error: 'Trop d\'essais. Réessaie dans quelques minutes.' }); return; }
  let body = req.body; if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  await new Promise((r) => setTimeout(r, 400)); // ralentit les essais
  if (!codeOk(body && body.code)) { t.push(now); tries.set(ip, t); res.status(401).json({ error: 'Code incorrect.', left: 5 - t.length }); return; }
  tries.delete(ip);
  res.setHeader('Set-Cookie', sessionCookie());
  res.status(200).json({ ok: true });
};
