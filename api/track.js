// LOBBY — mesure d'audience maison, sans cookie ni adresse IP stockée.
// POST (public) : signal de présence toutes les 30 s.  GET (admin) : visiteurs en direct + statistiques.
// Les chiffres vivent en mémoire de la fonction : ils repartent de zéro après un redémarrage (indiqué sur /gestion).
const { isAdmin } = require('./_auth');
const START = Date.now();
const active = new Map();       // sid -> session
let day = '', D = null;
const recent = [];              // 60 dernières visites
const searches = [];            // 40 dernières recherches
function today() { const k = new Date().toISOString().slice(0, 10); if (k !== day) { day = k; D = { views: 0, sids: new Set(), pages: {}, countries: {}, refs: {}, devices: {}, browsers: {}, os: {}, hours: Array(24).fill(0), searches: {} }; } return D; }
const inc = (o, k) => { if (!k) return; o[k] = (o[k] || 0) + 1; };
function ua(s) {
  s = String(s || '');
  const device = /iPad|Tablet/i.test(s) ? 'Tablette' : /Mobi|Android|iPhone/i.test(s) ? 'Mobile' : 'Ordinateur';
  const browser = /Edg\//.test(s) ? 'Edge' : /OPR\//.test(s) ? 'Opera' : /Firefox\//.test(s) ? 'Firefox' : /Chrome\//.test(s) ? 'Chrome' : /Safari\//.test(s) ? 'Safari' : 'Autre';
  const os = /iPhone|iPad|iOS/.test(s) ? 'iOS' : /Android/.test(s) ? 'Android' : /Mac OS X/.test(s) ? 'macOS' : /Windows/.test(s) ? 'Windows' : /Linux/.test(s) ? 'Linux' : 'Autre';
  const bot = /bot|crawl|spider|slurp|headless|lighthouse/i.test(s);
  return { device, browser, os, bot };
}
const top = (o, n = 8) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const d = today();
  if (req.method === 'POST') {
    let b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
    b = b || {};
    const sid = String(b.sid || '').slice(0, 40); if (!sid) { res.status(204).end(); return; }
    const u = ua(req.headers['user-agent']); if (u.bot) { res.status(204).end(); return; }
    const now = Date.now();
    if (b.t === 'search') { const q = String(b.q || '').slice(0, 60); if (q) { inc(d.searches, q.toLowerCase()); searches.unshift({ q, pick: String(b.pick || '').slice(0, 80), at: now }); searches.length = Math.min(searches.length, 40); } res.status(204).end(); return; }
    const page = String(b.page || '/').slice(0, 80);
    const country = req.headers['x-vercel-ip-country'] || '', city = decodeURIComponent(req.headers['x-vercel-ip-city'] || '');
    let s = active.get(sid);
    const isNewView = !s || s.page !== page || b.t === 'view';
    if (!s) { s = { sid, since: now, views: 0 }; d.sids.add(sid); inc(d.countries, country || '?'); inc(d.devices, u.device); inc(d.browsers, u.browser); inc(d.os, u.os); let r = ''; try { r = b.ref ? new URL(b.ref).hostname.replace(/^www\./, '') : ''; } catch {} inc(d.refs, r && !/lobby-esport/.test(r) ? r : 'Accès direct'); recent.unshift({ at: now, page, country, city, device: u.device, browser: u.browser, ref: r }); recent.length = Math.min(recent.length, 60); }
    if (isNewView && b.t !== 'ping') { s.views++; d.views++; inc(d.pages, page); d.hours[new Date().getUTCHours()]++; }
    Object.assign(s, { page, last: now, country, city, device: u.device, browser: u.browser, os: u.os, screen: String(b.w || '') + '×' + String(b.h || ''), lang: String(b.lang || '').slice(0, 10), tz: String(b.tz || '').slice(0, 40), gone: b.t === 'leave' });
    active.set(sid, s);
    res.status(204).end(); return;
  }
  if (!isAdmin(req)) { res.status(401).json({ error: 'auth' }); return; }
  const now = Date.now();
  for (const [k, s] of active) if (now - s.last > 30 * 60000) active.delete(k);
  const live = [...active.values()].filter((s) => !s.gone && now - s.last < 75000).sort((a, b) => b.last - a.last)
    .map((s) => ({ page: s.page, since: s.since, last: s.last, country: s.country, city: s.city, device: s.device, browser: s.browser, os: s.os, screen: s.screen, lang: s.lang, views: s.views }));
  res.status(200).json({
    now, since: START, live,
    today: { date: day, views: d.views, visitors: d.sids.size, pages: top(d.pages), countries: top(d.countries), refs: top(d.refs), devices: top(d.devices), browsers: top(d.browsers), os: top(d.os), hours: d.hours, searches: top(d.searches, 10) },
    recent: recent.slice(0, 25), lastSearches: searches.slice(0, 15)
  });
};
