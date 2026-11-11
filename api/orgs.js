// Agent organisations : equipes des ligues majeures (tournois S/A) + ligues francaises, par jeu (PandaScore).
const BASE = 'https://api.pandascore.co';
const GAMES = {
  lol: { ps: 'lol', n: 40 }, cs2: { ps: 'csgo', n: 40 }, val: { ps: 'valorant', n: 40 }, rl: { ps: 'rl', n: 24 }, dota: { ps: 'dota2', n: 30 },
  r6: { ps: 'r6siege', n: 24 }, ow: { ps: 'ow', n: 16 }, cod: { ps: 'codmw', n: 14 }, fc: { ps: 'fifa', n: 8 }
};
const TIER = { s: 10, a: 4, b: 1.5, c: 0.5, d: 0.2 };
const JUNIOR = /\b(academy|youth|junior|juniors|female|women|fe|rising|reserve|reserves|challengers?|next|prospects?)\b|\.a$| a$|\.bee$|^karmine corp blue/i;
// Orgs signalées inactives par Flavien (liste manuelle, à compléter).
const CFG = require('./_config');
const RETIRED = new RegExp('^(' + CFG.RETIRED.map((x) => x.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')', 'i');
// Une org n'est retenue que si elle a joué un tournoi récent (évite les équipes dissoutes ou plus actives).
const RECENT = (require('./_config').RECENT_DAYS || 200) * 86400000;
const fresh = (tn) => { const d = Date.parse(tn.end_at || tn.begin_at || 0); return d && Date.now() - d < RECENT; };
const CITY = /\b(paris|new york|las vegas|vegas|minnesota|texas|toronto|boston|carolina|miami|london|vancouver|atlanta|seattle)\b/ig;
const FRL = /\b(LFL|LDLC|Ligue Fran|French|France|Gamers Origin|ESL Pro League France|Elite Series|Prime League FR)\b/i;
// Corrections de pays verifiees a la main : PandaScore localise parfois mal une org (une fiche par jeu, pays incoherent).
const CC_FIX = { karminecorp: 'FR', vitality: 'FR', gentlemates: 'FR', solary: 'FR', mandatory: 'FR', gameward: 'FR', gamersorigin: 'FR', joblife: 'FR', peps: 'FR', '3dmax': 'FR', oserve: 'FR', wolves: 'GB', fnatic: 'GB', g2: 'DE', mouz: 'DE' };
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\b(esports?|gaming|team|club)\b/g, '').replace(/[^a-z0-9]/g, '').replace(/clan$/, '');

module.exports = async (req, res) => {
  const token = process.env.PANDASCORE_TOKEN;
  if (!token) { res.status(503).json({ error: 'no_key' }); return; }
  let errs = 0, last429 = '', hdr = '';
  const t0 = Date.now();
  const get = async (path, lim) => {
    for (let k = 0; k < 3; k++) {
      if (Date.now() - t0 > lim) throw new Error('deadline');
      let r;
      try { r = await fetch(BASE + path, { headers: { Authorization: 'Bearer ' + token }, signal: AbortSignal.timeout(9000) }); } catch (e) { last429 = 'timeout ' + path.slice(0, 50); continue; }
      hdr = r.status + ' rem=' + r.headers.get('x-rate-limit-remaining') + ' retry=' + r.headers.get('retry-after');
      if (r.ok) return r.json();
      if (r.status === 429 || r.status >= 500) { last429 = path.slice(0, 60) + ' ' + r.status; await new Promise((z) => setTimeout(z, 1500 * (k + 1))); continue; }
      throw new Error(path + ' ' + r.status);
    }
    throw new Error(last429 || path);
  };
  const ok = async (p) => { try { return await p(); } catch (e) { errs++; return []; } };
  const pool = async (tasks, n) => {
    const out = []; let i = 0;
    await Promise.all(Array.from({ length: n }, async () => { while (i < tasks.length) { const k = i++; out[k] = await tasks[k](); } }));
    return out;
  };
  try {
    const keys = Object.keys(GAMES), paths = [];
    const big = ['lol', 'cs2', 'val', 'dota', 'rl', 'r6'];
    const fscene = ['lol', 'val', 'rl', 'cs2']; // scene FR a capturer de maniere fiable (souvent tier B/C)
    keys.forEach((g) => {
      const s = GAMES[g].ps;
      const L = [];
      if (big.indexOf(g) >= 0) L.push('/' + s + '/matches/running?page[size]=100', '/' + s + '/matches/past?page[size]=100&sort=-begin_at');
      L.forEach((p) => paths.push([g, p]));
      paths.push([g, '/' + s + '/tournaments?filter[tier]=s,a&sort=-begin_at&page[size]=25', 'T']);
      // passe dediee aux competitions FR tier B/C (LFL, Valorant France, etc.) -> orgs FR jamais ratees
      if (fscene.indexOf(g) >= 0) paths.push([g, '/' + s + '/tournaments?filter[tier]=b,c&sort=-begin_at&page[size]=40', 'TF']);
    });
    const res1 = await pool(paths.map((x) => () => ok(() => get(x[1], 42000))), 4);
    const perGame = keys.map((g) => {
      const cnt = {};
      paths.forEach((x, i) => {
        if (x[0] !== g) return;
        if (x[2] === 'T') { (res1[i] || []).filter(fresh).forEach((tn) => { const w = TIER[tn.tier] || 1; (tn.teams || []).forEach((t) => { if (!t || !t.id) return; const c = cnt[t.id] = cnt[t.id] || { id: t.id, f: 0 }; c.f += w; }); }); return; }
        if (x[2] === 'TF') { (res1[i] || []).filter(fresh).forEach((tn) => { const lg = (tn.league && tn.league.name) || (tn.name || ''); if (!FRL.test(lg)) return; (tn.teams || []).forEach((t) => { if (!t || !t.id) return; const c = cnt[t.id] = cnt[t.id] || { id: t.id, f: 0 }; c.f += 60; }); }); return; }
        (res1[i] || []).forEach((m) => {
          const tr = (m.tournament && m.tournament.tier) || (m.serie && m.serie.tier) || 'c';
          const lname = (m.league && m.league.name) || '';
          const fr = FRL.test(lname);
          if (tr !== 's' && tr !== 'a' && !fr) return;
          const w = TIER[tr] || 0.5;
          (m.opponents || []).forEach((o) => {
            const t = o && o.opponent; if (!t || !t.id) return;
            const c = cnt[t.id] = cnt[t.id] || { id: t.id, f: 0 }; c.f += w;
          });
        });
      });
      const ids = Object.keys(cnt).map((k) => cnt[k]).sort((a, b) => b.f - a.f).slice(0, GAMES[g].n + 14);
      return { g, ids };
    });
    // Pas de force-include : une equipe n'apparait dans un jeu que si elle a reellement
    // joue des tournois/matchs S/A (ou ligue FR) recents de ce jeu -> donnee recoupee, jamais une presence perimee.
    const need = {};
    perGame.forEach((pg) => pg.ids.forEach((c) => { need[c.id] = 1; }));
    const all = Object.keys(need);
    const chunks = [];
    for (let i = 0; i < all.length; i += 40) chunks.push(all.slice(i, i + 40));
    const lists = await pool(chunks.map((c) => () => ok(() => get('/teams?filter[id]=' + c.join(',') + '&page[size]=100', 57000))), 3);
    const byId = {};
    [].concat(...lists).forEach((t) => { byId[t.id] = t; });
    const orgs = {};
    perGame.forEach((pg) => {
      let kept = 0;
      pg.ids.forEach((c) => {
        const t = byId[c.id]; if (!t || kept >= GAMES[pg.g].n) return;
        if (JUNIOR.test(t.name || '') || RETIRED.test(t.name || '')) return;
        if (!t.image_url && !t.dark_mode_image_url) return;
        const players = (t.players || []).filter((p) => p.active !== false);
        const nm = pg.g === 'cod' ? (String(t.name || '').replace(CITY, '').trim() || t.name) : t.name; const key = norm(nm); if (!key) return;
        const o = orgs[key] = orgs[key] || { id: key, n: nm, s: t.acronym || '', cc: '', lg: '', ld: '', g: {}, _loc: {} };
        // vote de localisation pondere : le pays le plus represente (pondere par l'activite du jeu) l'emporte,
        // sinon une fiche secondaire mal localisee fausserait le pays d'une org (ex : org FR vue "ES" sur un jeu).
        if (t.location) o._loc[t.location] = (o._loc[t.location] || 0) + (Math.round(c.f) + 1);
        if (!o.lg && t.image_url) o.lg = t.image_url;
        if (!o.ld && t.dark_mode_image_url) o.ld = t.dark_mode_image_url;
        if (!o.s && t.acronym) o.s = t.acronym;
        o.g[pg.g] = {
          pid: t.id, f: Math.round(c.f),
          pl: players.map((p) => ({ id: p.id, n: p.name, r: p.role || '', cc: p.nationality || '', im: p.image_url || '', fn: p.first_name || '', ln: p.last_name || '', a: p.age || null }))
        };
        kept++;
      });
    });
    Object.keys(orgs).forEach((k) => {
      const o = orgs[k], L = o._loc; let best = '', bv = -1;
      Object.keys(L).forEach((cc) => { if (L[cc] > bv) { bv = L[cc]; best = cc; } });
      o.cc = CC_FIX[o.id] || best; delete o._loc;
    });
    const list = Object.keys(orgs).map((k) => orgs[k]).filter((o) => o.cc);
    if (list.length < 20) { res.status(502).json({ error: 'incomplete', errs, last: last429, hdr, ms: Date.now() - t0, n: list.length }); return; }
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=604800');
    res.status(200).json({ updated: Date.now(), orgs: list });
  } catch (e) {
    res.status(502).json({ error: 'upstream', detail: String(e.message || e) });
  }
};
