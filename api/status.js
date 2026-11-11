// LOBBY — état du site en direct pour la page /gestion (aucun secret n'est renvoyé).
const CFG = require('./_config');
const { isAdmin } = require('./_auth');
const BOOT = Date.now();

const timed = async (fn, ms = 9000) => {
  const t0 = Date.now();
  try { const v = await Promise.race([fn(), new Promise((_, r) => setTimeout(() => r(new Error('délai dépassé')), ms))]); return { ok: true, ms: Date.now() - t0, ...v }; }
  catch (e) { return { ok: false, ms: Date.now() - t0, error: String(e.message || e) }; }
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!isAdmin(req)) { res.status(401).json({ error: 'auth' }); return; }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const base = 'https://' + host;
  const token = process.env.PANDASCORE_TOKEN;

  const [pandascore, live, orgs, snapshot, lib] = await Promise.all([
    timed(async () => {
      if (!token) throw new Error('clé PANDASCORE_TOKEN absente');
      const r = await fetch('https://api.pandascore.co/matches/running?per_page=1', { headers: { Authorization: 'Bearer ' + token } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return { quotaRemaining: r.headers.get('x-rate-limit-remaining'), quotaLimit: r.headers.get('x-rate-limit-limit') };
    }),
    timed(async () => {
      const r = await fetch(base + '/api/live'); if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json(), m = d.matches || [], rec = d.recent || [];
      const byGame = {}; m.concat(rec).forEach((x) => { byGame[x.game] = (byGame[x.game] || 0) + 1; });
      return { updated: d.updated, live: m.filter((x) => x.status === 'running').length, liveImportant: m.filter((x) => x.status === 'running' && x.k).length, upcoming: m.filter((x) => x.status === 'not_started').length, upcomingImportant: m.filter((x) => x.status === 'not_started' && x.k).length, recent: rec.length, byGame };
    }),
    timed(async () => {
      const r = await fetch(base + '/api/orgs?v=4'); if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json(), o = d.orgs || [];
      return { updated: d.updated, teams: o.length, countries: new Set(o.map((x) => x.cc)).size, players: o.reduce((s, x) => s + Object.values(x.g || {}).reduce((a, g) => a + (g.pl || []).length, 0), 0) };
    }, 20000),
    timed(async () => {
      const r = await fetch(base + '/assets/orgs.json'); if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json(); return { updated: d.updated, teams: (d.orgs || []).length };
    }),
    timed(async () => { const r = await fetch(base + '/lib/three.module.min.js', { method: 'HEAD' }); if (!r.ok) throw new Error('HTTP ' + r.status); return {}; })
  ]);

  res.status(200).json({
    now: Date.now(),
    deployment: {
      env: process.env.VERCEL_ENV || 'local', region: process.env.VERCEL_REGION || null, url: process.env.VERCEL_URL || null,
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || '').slice(0, 7) || null, message: (process.env.VERCEL_GIT_COMMIT_MESSAGE || '').split('\n')[0] || null,
      branch: process.env.VERCEL_GIT_COMMIT_REF || null, node: process.version, instanceSince: BOOT
    },
    checks: { pandascore, live, orgs, snapshot, lib },
    config: CFG
  });
};
