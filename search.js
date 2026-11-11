// LOBBY — recherche globale : joueurs, équipes, pays, compétitions, matchs.
// Tolérante aux fautes, classée par pertinence ET par importance (orgs connues, scène FR, gros jeux).
const GN = { lol: 'LoL', cs2: 'CS2', val: 'Valorant', rl: 'Rocket League', dota: 'Dota 2', r6: 'R6', ow: 'Overwatch', cod: 'CoD', fc: 'EA FC', mlbb: 'MLBB', hok: 'HoK', sc: 'StarCraft' };
const GW = { lol: 1, cs2: 1, val: 1, rl: 1, r6: 0.55, dota: 0.4, ow: 0.4, cod: 0.4, fc: 0.3 };
const BIG = /^(karmine corp|team vitality|gentle mates|team bds|solary|g2 esports|fnatic|natus vincere|t1|gen\.?g|faze clan|mouz|team liquid|sentinels|furia|team spirit|hanwha life esports|bilibili gaming|top esports|team heretics|cloud9|100 thieves|paper rex|team falcons|ninjas in pyjamas|astralis|heroic|the mongolz|edward gaming|drx|fut esports|koi|movistar koi|vitality)$/i;
const REG = (() => { try { return new Intl.DisplayNames(['fr'], { type: 'region' }); } catch { return null; } })();
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
const flat = (s) => norm(s).replace(/ /g, '');

// distance d'édition (Damerau simplifiée), plafonnée pour rester rapide
function dist(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const c = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}
// score textuel d'une requête contre une liste de noms (0 = aucun rapport)
function textScore(q, names) {
  // names[0] = nom principal (pseudo, équipe…) ; les suivants (vrai nom, sigle…) comptent moins et sans faute de frappe
  let best = 0, fuzzy = false;
  names.forEach((raw, idx) => {
    if (!raw) return;
    const n = flat(raw), words = norm(raw).split(' '), w = idx === 0 ? 1 : 0.72;
    if (!n) return;
    let sc = 0;
    if (n === q) sc = 100;
    else if (n.startsWith(q)) sc = 84 - Math.min(14, (n.length - q.length) * 0.7);
    else if (words.some((x) => x.startsWith(q))) sc = 64;
    else if (idx === 0 && n.includes(q) && q.length >= 3) sc = 46;
    else if (idx === 0 && q.length >= 3) {
      const tol = q.length >= 6 ? 2 : 1;
      const dd = Math.min(dist(q, n.slice(0, q.length), tol), dist(q, n, tol));
      if (dd <= tol) { sc = dd === 1 ? 40 : 30; fuzzy = true; }
    }
    best = Math.max(best, sc * w);
  });
  return { s: best, fuzzy };
}

export function buildIndex(orgs, live = []) {
  const act = (o) => Object.values(o.g || {}).reduce((s, x) => s + (x.f || 0), 0);
  const maxA = Math.max(1, ...orgs.map(act));
  const items = [];
  const cc = new Map();
  orgs.forEach((o) => {
    const games = Object.keys(o.g || {});
    const gw = Math.max(0, ...games.map((k) => GW[k] || 0.3));
    const pop = Math.min(1, 0.45 * Math.sqrt(act(o) / maxA) + (BIG.test(o.n) ? 0.35 : 0) + (o.cc === 'FR' ? 0.35 : 0) + 0.15 * gw);
    const core = o.n.replace(/\b(team|esports?|gaming|club)\b/gi, '').trim() || o.n;
    items.push({ t: 'team', id: o.id, names: [core, o.n, o.s], label: o.n, sub: `Équipe · ${(REG && o.cc && REG.of(o.cc)) || o.cc || ''} · ${games.map((k) => GN[k] || k).join(', ')}`, img: o.lg || o.ld, pop, o });
    games.forEach((k) => (o.g[k].pl || []).forEach((p) => {
      items.push({ t: 'player', id: o.id + ':' + p.id, names: [p.n, [p.fn, p.ln].filter(Boolean).join(' '), p.ln], label: p.n, sub: `Joueur · ${o.n} · ${GN[k] || k}${p.r ? ' · ' + p.r : ''}`, img: p.im || o.lg, pop: pop * 0.95 + 0.05 * (GW[k] || 0.3), o, game: k, p });
    }));
    if (o.cc) cc.set(o.cc, (cc.get(o.cc) || 0) + 1);
  });
  cc.forEach((n, code) => {
    const name = (REG && REG.of(code)) || code;
    items.push({ t: 'country', id: code, names: [name, code], label: name, sub: `Pays · ${n} équipe${n > 1 ? 's' : ''}`, pop: Math.min(1, n / 15), cc: code });
  });
  const comps = new Map();
  live.forEach((m) => { if (m.comp && !comps.has(m.comp)) comps.set(m.comp, m); });
  comps.forEach((m, name) => items.push({ t: 'comp', id: name, names: [name, m.serie], label: name, sub: `Compétition · ${GN[m.game] || ''}`, img: m.ll, pop: m.k ? 0.7 : 0.2, comp: name }));
  live.forEach((m) => items.push({ t: 'match', id: 'm' + m.id, names: [m.an, m.bn, m.as, m.bs], label: `${m.as || m.an} vs ${m.bs || m.bn}`, sub: `Match · ${m.status === 'running' ? 'en direct' : new Date(m.ts).toLocaleString('fr-FR', { weekday: 'short', hour: '2-digit', minute: '2-digit' })} · ${m.comp}`, img: m.al, pop: (m.k ? 0.6 : 0.1) + (m.status === 'running' ? 0.3 : 0), m }));
  return items;
}

export function search(items, query, limit = 9) {
  const q = flat(query);
  if (q.length < 1) return [];
  const TYPEW = { player: 1, team: 1.06, country: 1.04, comp: 0.9, match: 0.88 };
  const out = [];
  for (const it of items) {
    const { s, fuzzy } = textScore(q, it.names);
    if (!s) continue;
    // la pertinence textuelle d'abord, l'importance départage (Caliste avant un inconnu pour « ca »)
    out.push({ it, fuzzy, score: (s + it.pop * (q.length <= 3 ? 34 : 22)) * (TYPEW[it.t] || 1) });
  }
  // les fautes de frappe ne servent que si la recherche exacte ne donne presque rien
  const exact = out.filter((r) => !r.fuzzy);
  if (exact.length >= 3) out.splice(0, out.length, ...exact);
  out.sort((a, b) => b.score - a.score);
  const seen = new Set(), res = [];
  for (const r of out) { const k = r.it.t + r.it.id; if (seen.has(k)) continue; seen.add(k); res.push(r.it); if (res.length >= limit) break; }
  return res;
}

const TAG = { player: 'Joueur', team: 'Équipe', country: 'Pays', comp: 'Compétition', match: 'Match' };
function hl(label, query) {
  const q = norm(query).replace(/ /g, ''); if (!q) return esc(label);
  const i = norm(label).replace(/ /g, '').indexOf(q);
  if (i < 0 || norm(label).replace(/ /g, '').length !== label.length) return esc(label);
  return esc(label.slice(0, i)) + '<mark>' + esc(label.slice(i, i + q.length)) + '</mark>' + esc(label.slice(i + q.length));
}

// Branche la recherche sur un <input> : liste déroulante, navigation clavier, choix.
export function attachSearch(input, { getItems, onPick }) {
  const box = document.createElement('div');
  box.className = 'sres'; box.hidden = true; box.setAttribute('role', 'listbox');
  input.closest('.search').appendChild(box);
  input.setAttribute('role', 'combobox'); input.setAttribute('aria-autocomplete', 'list');
  let res = [], cur = 0;
  const render = () => {
    const v = input.value.trim();
    if (!v) { box.hidden = true; return; }
    const items = getItems();
    res = items.length ? search(items, v) : [];
    cur = 0;
    box.innerHTML = !items.length ? '<div class="sempty">Chargement des données…</div>'
      : res.length ? res.map((it, i) => `<button type="button" role="option" class="sopt${i === 0 ? ' on' : ''}" data-i="${i}">
          <span class="sav${it.t === 'player' ? ' round' : ''}">${it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy" onerror="this.remove()">` : ''}<em>${esc((it.label || '?').slice(0, 2).toUpperCase())}</em></span>
          <span class="stx"><b>${hl(it.label, v)}</b><small>${esc(it.sub)}</small></span><i class="stag">${TAG[it.t]}</i></button>`).join('')
      : `<div class="sempty">Aucun résultat pour « ${esc(v)} ». Essaie le pseudo d'un joueur, une équipe ou un pays.</div>`;
    box.hidden = false;
  };
  const move = (d) => { const o = box.querySelectorAll('.sopt'); if (!o.length) return; o[cur].classList.remove('on'); cur = (cur + d + o.length) % o.length; o[cur].classList.add('on'); o[cur].scrollIntoView({ block: 'nearest' }); };
  const pick = (i) => { const it = res[i]; if (!it) return; box.hidden = true; input.blur(); try { window.lobbyTrack && window.lobbyTrack('search', { q: input.value.trim(), pick: TAG[it.t] + ' · ' + it.label }); } catch (_) {} onPick(it); };
  input.addEventListener('input', render);
  input.addEventListener('focus', () => { if (input.value.trim()) render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { e.preventDefault(); pick(cur); }
    else if (e.key === 'Escape') { box.hidden = true; input.blur(); }
  });
  box.addEventListener('mousedown', (e) => { const b = e.target.closest('.sopt'); if (b) { e.preventDefault(); pick(+b.dataset.i); } });
  document.addEventListener('click', (e) => { if (!e.target.closest('.search')) box.hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement !== input && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); } });
  return { refresh: () => { if (!box.hidden) render(); } };
}
