// LOBBY — Atlas : globe + données esport (orgs par pays, équipes, joueurs, matchs). Aucune donnée inventée.
import { createGlobe, skyFor } from '/atlas/globe.js';
import { buildIndex, attachSearch } from '/search.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const GN = { lol: 'LoL', cs2: 'CS2', val: 'Valorant', rl: 'Rocket League', dota: 'Dota 2', r6: 'R6', ow: 'Overwatch', cod: 'CoD', fc: 'EA FC', mlbb: 'MLBB', hok: 'HoK', sc: 'StarCraft' };
const GAMES = ['all', 'lol', 'cs2', 'val', 'rl', 'r6', 'dota', 'ow'];
const T2 = new Set(['r6', 'dota', 'ow', 'cod', 'fc']);
const REG = (() => { try { return new Intl.DisplayNames(['fr'], { type: 'region' }); } catch { return null; } })();
const country = (cc) => (REG && cc ? REG.of(cc) : cc) || cc;
// Centre approximatif de chaque pays : la donnée source ne donne que le PAYS d'une org (pas la ville).
const CC = { FR: [46.6, 2.4], DE: [51.2, 10.4], GB: [54, -2], ES: [40.4, -3.7], IT: [42.8, 12.5], PL: [52, 19.4], SE: [62, 15], DK: [56, 9.5], NO: [61, 9], FI: [64, 26], NL: [52.2, 5.5], BE: [50.6, 4.6], PT: [39.6, -8], RU: [56, 38], UA: [49, 32], TR: [39, 35], US: [39.5, -98.5], CA: [56, -106], BR: [-14, -51], AR: [-34, -64], CL: [-33, -71], MX: [23, -102], PE: [-9, -75], CO: [4.5, -74], VE: [7, -66], UY: [-33, -56], KR: [36.5, 127.8], CN: [35, 104], JP: [36.2, 138.2], TW: [23.7, 121], HK: [22.3, 114.2], MO: [22.2, 113.5], VN: [16, 107.8], TH: [15.8, 101], PH: [12.9, 121.8], ID: [-2.5, 118], MY: [4.2, 102], SG: [1.35, 103.8], KH: [12.6, 104.9], MM: [21, 96], AU: [-25.3, 133.8], NZ: [-41, 174], IN: [21, 78], PK: [30.4, 69.3], BD: [23.7, 90.4], SA: [24, 45], AE: [24, 54], QA: [25.3, 51.2], KW: [29.3, 47.5], JO: [31.2, 36.5], LB: [33.9, 35.9], IR: [32.4, 53.7], IQ: [33, 44], KZ: [48, 67], UZ: [41.4, 64.6], KG: [41.2, 74.8], MN: [46.9, 103.8], CZ: [49.8, 15.5], SK: [48.7, 19.7], RS: [44, 21], BG: [42.7, 25.5], RO: [45.9, 25], HU: [47.2, 19.5], AT: [47.5, 14.5], CH: [46.8, 8.2], IL: [31, 35], EE: [58.6, 25], LV: [56.9, 24.6], LT: [55.2, 23.9], BY: [53.7, 28], MD: [47.4, 28.4], GE: [42.3, 43.4], AM: [40.1, 45], AZ: [40.1, 47.6], ZA: [-30.6, 22.9], EG: [26.8, 30.8], MA: [31.8, -7.1], TN: [34, 9.5], DZ: [28, 2.6], NG: [9, 8.7], KE: [0, 38], IE: [53.4, -8.2], GR: [39, 22], HR: [45.1, 15.2], SI: [46.1, 14.9], BA: [44, 17.8], MK: [41.6, 21.7], AL: [41.1, 20.2], ME: [42.7, 19.4], XK: [42.6, 20.9], IS: [64.9, -18.6], LU: [49.8, 6.1], CY: [35.1, 33.4], MT: [35.9, 14.4], CR: [9.7, -84], GT: [15.8, -90.2], DO: [18.7, -70.2], PR: [18.2, -66.5], EC: [-1.8, -78.2], BO: [-16.3, -63.6], PY: [-23.4, -58.4] };

const S = { orgs: [], byCC: {}, live: [], liveCC: new Set(), game: 'all', sel: null, team: null, q: '' };

/* ---------- Globe ---------- */
const stage = $('stage');
const sky = skyFor();
stage.style.background = sky.bg;

let fly = null;
try { fly = JSON.parse(sessionStorage.getItem('lobbyFly') || 'null'); sessionStorage.removeItem('lobbyFly'); if (fly && Date.now() - fly.t > 6000) fly = null; } catch { fly = null; }
let g = null;
try {
  g = createGlobe($('globe'), { view: fly ? { lat: fly.lat, lon: fly.lon, dist: fly.dist } : { lat: 38, lon: 8, dist: 3.3 }, starsOpacity: sky.stars, autoRotate: !fly });
} catch (e) {
  $('loading').innerHTML = '<div style="max-width:420px;text-align:center;line-height:1.5"><b style="color:#fff;font-size:15px">La 3D (WebGL) est désactivée dans ce navigateur.</b><br>Sur Chrome : Réglages → Système → active « Utiliser l\'accélération graphique si disponible », puis relance. Les données restent consultables dans le panneau.</div>';
}
if (g) {
  g.ready.then(() => { $('loading').style.opacity = 0; setTimeout(() => $('loading').remove(), 700); });
  if (fly) setTimeout(() => g.zoomTo(3.3, 1300).then(() => { g.controls.autoRotate = true; }), 350);
  $('zin').onclick = () => g.zoomTo(Math.max(1.45, g.camera.position.length() * 0.75), 450);
  $('zout').onclick = () => g.zoomTo(Math.min(7, g.camera.position.length() / 0.72), 450);
  $('home').onclick = () => { select(null); g.flyTo(38, 8, 3.3); };
  g.onFrame(placeMarkers);
}
document.body.classList.add(fly ? 'enter-fly' : 'enter');
// Plongée : l'Atlas s'ouvre en plein écran (là où l'accueil s'est arrêté), puis le globe se range dans sa place.
if (fly && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const slot = stage.getBoundingClientRect();
  const ph = document.createElement('div'); ph.style.height = slot.height + 'px'; ph.className = 'stage-ph';
  stage.parentNode.insertBefore(ph, stage);
  Object.assign(stage.style, { position: 'fixed', zIndex: 200, left: 0, top: 0, width: innerWidth + 'px', height: innerHeight + 'px', borderRadius: '0px', margin: 0 });
  const settle = () => {
    const r = ph.getBoundingClientRect();
    stage.style.transition = 'left .9s var(--ease), top .9s var(--ease), width .9s var(--ease), height .9s var(--ease), border-radius .9s var(--ease)';
    Object.assign(stage.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', borderRadius: '24px' });
    setTimeout(() => { ph.remove(); stage.removeAttribute('style'); stage.style.background = sky.bg; if (g) g.redraw(); }, 950);
  };
  (g ? Promise.race([g.ready, new Promise((r) => setTimeout(r, 1500))]) : Promise.resolve()).then(() => setTimeout(settle, 250));
}

/* ---------- Marqueurs (HTML, projetés à chaque image) ---------- */
const layer = $('mk');
const pins = {}; // cc -> { el, ring: [els] }
let order = [];
function logo(url, txt, cls = 'lg') {
  const t = esc(String(txt || '?').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase());
  return `<span class="${cls}">${url ? `<img src="${esc(url)}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${t}'))">` : t}</span>`;
}
function visibleOrgs(list) { return S.game === 'all' ? list : list.filter((o) => o.g && o.g[S.game]); }
function buildPins() {
  layer.innerHTML = ''; Object.keys(pins).forEach((k) => delete pins[k]);
  Object.keys(S.byCC).forEach((cc) => {
    const list = visibleOrgs(S.byCC[cc]); if (!list.length || !CC[cc]) return;
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'pin'; el.dataset.cc = cc;
    el.setAttribute('aria-label', `${country(cc)} : ${list.length} équipe${list.length > 1 ? 's' : ''}`);
    const top3 = list.slice().sort((a, b) => act(b) - act(a)).slice(0, 3);
    const isLive = S.liveCC.has(cc);
    el.classList.toggle('live', isLive);
    el.innerHTML = `<span class="pd"><span class="pc">${list.length}</span></span><span class="pl"><b>${esc(country(cc))}</b>${top3.map((o) => logo(o.lg || o.ld, o.s || o.n, 'mini')).join('')}${isLive ? '<em>● live</em>' : ''}</span>`;
    el.style.setProperty('--sz', (18 + Math.min(12, Math.sqrt(list.length) * 2.4)).toFixed(1) + 'px');
    el.onclick = (e) => { e.stopPropagation(); select(cc, true); };
    layer.appendChild(el);
    const ring = list.slice().sort((a, b) => act(b) - act(a)).slice(0, 8).map((o, i, arr) => {
      const r = document.createElement('button');
      r.type = 'button'; r.className = 'tlogo'; r.title = o.n; r.setAttribute('aria-label', o.n);
      r.innerHTML = logo(o.ld || o.lg, o.s || o.n, 'tlg');
      r.dataset.a = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
      r.onclick = (e) => { e.stopPropagation(); openTeam(o); };
      layer.appendChild(r); return r;
    });
    pins[cc] = { el, ring, n: list.length };
  });
  order = Object.keys(pins).sort((a, b) => pins[b].n - pins[a].n);
  updStats();
}
function updStats() {
  const nT = Object.keys(pins).reduce((s, k) => s + pins[k].n, 0), nC = Object.keys(pins).length, nL = S.liveCC.size;
  $('stat').innerHTML = nT ? `<b>${nT}</b> équipes · <b>${nC}</b> pays${nL ? ` · <span class="lvd"></span><b>${nL}</b> en direct` : ''}` : 'Chargement des équipes…';
}
const act = (o) => Object.values(o.g || {}).reduce((s, x) => s + (x.f || 0), 0);
function placeMarkers(cam, dist) {
  const far = dist > 3.6, close = dist < 2.2;
  layer.classList.toggle('far', far); layer.classList.toggle('close', close);
  const placed = [];
  // pays le plus proche du centre de l'écran : seul à afficher son étiquette au zoom (lisibilité)
  let focusCC = null, fd = 1e9; const W = stage.clientWidth / 2, H = stage.clientHeight / 2;
  if (close) for (const cc of order) { const q = g.project(CC[cc][0], CC[cc][1]); if (!q.front) continue; const dd = Math.hypot(q.x - W, q.y - H); if (dd < fd) { fd = dd; focusCC = cc; } }
  for (const cc of order) {
    const p = pins[cc], [la, lo] = CC[cc], s = g.project(la, lo);
    let on = s.front;
    // anti-chevauchement : un petit pays trop près d'un plus gros est masqué (sauf s'il est sélectionné)
    if (on && S.sel !== cc && placed.some((q) => Math.hypot(q.x - s.x, q.y - s.y) < (close ? 26 : 22))) on = false;
    if (on) placed.push(s);
    p.el.style.transform = `translate(${s.x}px,${s.y}px)`;
    p.el.classList.toggle('hid', !on);
    p.el.classList.toggle('sel', S.sel === cc);
    const showRing = on && S.sel === cc;
    p.el.classList.toggle('lab', on && (S.sel === cc || (close && cc === focusCC)));
    const R = 30 + Math.min(14, p.ring.length * 2);
    if (showRing || p.shown) p.ring.forEach((r) => {
      const a = +r.dataset.a;
      if (showRing) r.style.transform = `translate(${s.x + Math.cos(a) * R}px,${s.y + Math.sin(a) * R}px)`;
      r.classList.toggle('show', showRing);
    });
    p.shown = showRing;
  }
}

/* ---------- Panneau ---------- */
const panel = $('panel');
function setPanel(html) { panel.innerHTML = html; panel.scrollTop = 0; panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
function matchesOf(o) {
  const n = o.n.toLowerCase(), s = (o.s || '').toLowerCase(), eq = (x, y) => (x || '').toLowerCase() === y;
  return S.live.filter((m) => eq(m.an, n) || eq(m.bn, n) || (s.length >= 2 && (eq(m.as, s) || eq(m.bs, s))));
}
function matchRow(m) {
  const lv = m.status === 'running';
  const t = lv ? '<span class="lv">LIVE</span>' : new Date(m.ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `<a class="mrow" ${m.watch ? `href="${esc(m.watch)}" target="_blank" rel="noopener"` : ''}><span class="mt">${t}</span><span class="mm">${logo(m.al, m.as)}<b>${esc(m.as || m.an)}</b><span class="ms">${lv ? `${m.sa}:${m.sb}` : 'vs'}</span><b>${esc(m.bs || m.bn)}</b>${logo(m.bl, m.bs)}</span><span class="mc">${esc(m.comp)}</span></a>`;
}
function home() {
  S.sel = null; S.team = null;
  const ccs = Object.keys(S.byCC).filter((cc) => visibleOrgs(S.byCC[cc]).length).sort((a, b) => visibleOrgs(S.byCC[b]).length - visibleOrgs(S.byCC[a]).length);
  const nT = ccs.reduce((s, cc) => s + visibleOrgs(S.byCC[cc]).length, 0);
  const live = S.live.filter((m) => m.k && (S.game === 'all' || m.game === S.game)).slice(0, 4);
  setPanel(`
    <div class="ph"><div class="eyebrow">Exploration</div><h2>Découvre la scène mondiale.</h2><p class="lead">Clique un pays sur le globe, ou cherche une équipe.</p></div>
    ${live.length ? `<div class="sec"><h3>À suivre</h3>${live.map(matchRow).join('')}</div>` : ''}
    ${S.orgs.length ? `<div class="sec"><h3>Équipes à la une</h3><div class="tgrid">${visibleOrgs(S.orgs).slice().sort((a, b) => act(b) - act(a)).slice(0, 12).map((o) => `<button type="button" class="tcell" data-id="${esc(o.id)}" title="${esc(o.n)}">${logo(o.lg || o.ld, o.s || o.n)}<span>${esc(o.s || o.n)}</span></button>`).join('')}</div></div>` : ''}
    <div class="sec"><h3>Pays les plus représentés</h3>${ccs.slice(0, 8).map((cc) => { const l = visibleOrgs(S.byCC[cc]); return `<button type="button" class="crow" data-cc="${cc}"><span>${esc(country(cc))}${S.liveCC.has(cc) ? ' <em class="lvt">live</em>' : ''}</span><span class="stack">${l.slice().sort((a, b) => act(b) - act(a)).slice(0, 3).map((o) => logo(o.lg || o.ld, o.s || o.n, 'mini')).join('')}</span><i>${l.length}</i></button>`; }).join('') || '<p class="empty">Chargement des équipes…</p>'}</div>
    <p class="note">Les équipes sont placées au centre de leur pays : la source ne donne pas leur ville.</p>`);
}
function openCountry(cc) {
  const list = visibleOrgs(S.byCC[cc] || []).slice().sort((a, b) => act(b) - act(a));
  const ms = []; list.forEach((o) => matchesOf(o).forEach((m) => { if (!ms.includes(m)) ms.push(m); }));
  setPanel(`
    <button type="button" class="back" data-back>← Monde</button>
    <div class="ph"><div class="eyebrow">Pays</div><h2>${esc(country(cc))}</h2><p class="lead">${list.length} équipe${list.length > 1 ? 's' : ''} suivie${list.length > 1 ? 's' : ''}${S.game !== 'all' ? ' en ' + GN[S.game] : ''}</p></div>
    ${ms.length ? `<div class="sec"><h3>Leurs matchs</h3>${ms.slice(0, 5).map(matchRow).join('')}</div>` : ''}
    <div class="sec"><h3>Équipes</h3>${list.map((o) => `<button type="button" class="trow" data-id="${esc(o.id)}">${logo(o.lg || o.ld, o.s || o.n)}<span><b>${esc(o.n)}</b><small>${Object.keys(o.g || {}).map((k) => GN[k] || k).join(' · ')}</small></span><i>›</i></button>`).join('') || '<p class="empty">Aucune équipe pour ce filtre.</p>'}</div>`);
}
function openTeam(o, forceGame, hlPlayer) {
  S.team = o; S.sel = o.cc;
  const games = Object.keys(o.g || {});
  const gk = forceGame && o.g[forceGame] ? forceGame : (S.game !== 'all' && o.g[S.game] ? S.game : games[0]);
  const ms = matchesOf(o);
  const roster = (k) => {
    const pl = (o.g[k] && o.g[k].pl) || [];
    return pl.length ? pl.map((p) => `<div class="prow${hlPlayer && p.id == hlPlayer ? ' hl' : ''}">${p.im ? `<img src="${esc(p.im)}" alt="" loading="lazy">` : `<span class="pav">${esc((p.n || '?').slice(0, 2).toUpperCase())}</span>`}<span><b>${esc(p.n)}</b><small>${esc([p.fn, p.ln].filter(Boolean).join(' '))}${p.r ? ' · ' + esc(p.r) : ''}</small></span>${p.cc ? `<i>${esc(p.cc)}</i>` : ''}</div>`).join('') : '<p class="empty">Roster non disponible.</p>';
  };
  setPanel(`
    <button type="button" class="back" data-cc-back="${esc(o.cc)}">← ${esc(country(o.cc))}</button>
    <div class="team">${logo(o.lg || o.ld, o.s || o.n, 'lg big')}<div><div class="eyebrow">Équipe · ${esc(country(o.cc))}</div><h2>${esc(o.n)}</h2></div></div>
    ${ms.length ? `<div class="sec"><h3>Matchs</h3>${ms.slice(0, 4).map(matchRow).join('')}</div>` : ''}
    <div class="sec"><h3>Roster</h3>
      ${games.length > 1 ? `<div class="gtabs">${games.map((k) => `<button type="button" data-g="${k}" aria-pressed="${k === gk}">${GN[k] || k}</button>`).join('')}</div>` : ''}
      <div id="roster">${roster(gk)}</div></div>`);
  panel.querySelectorAll('.gtabs button').forEach((b) => b.onclick = () => { panel.querySelectorAll('.gtabs button').forEach((x) => x.setAttribute('aria-pressed', x === b)); $('roster').innerHTML = roster(b.dataset.g); });
  if (g && CC[o.cc]) g.flyTo(CC[o.cc][0], CC[o.cc][1], 1.9);
}
function select(cc, fromGlobe) {
  S.sel = cc; S.team = null;
  if (!cc) return home();
  openCountry(cc);
  if (g && CC[cc]) g.flyTo(CC[cc][0], CC[cc][1], Math.min(g.camera.position.length(), 2.05));
}
panel.addEventListener('click', (e) => {
  const c = e.target.closest('[data-cc]'); if (c && c.classList.contains('crow')) return select(c.dataset.cc);
  const t = e.target.closest('.trow,.tcell'); if (t) { const o = S.orgs.find((x) => x.id === t.dataset.id); if (o) openTeam(o); return; }
  if (e.target.closest('[data-back]')) { select(null); if (g) g.zoomTo(3.3, 700); return; }
  const cb = e.target.closest('[data-cc-back]'); if (cb) return select(cb.dataset.ccBack);
});

/* ---------- Filtres jeux ---------- */
$('games').innerHTML = GAMES.map((k, i) => `${T2.has(k) && !T2.has(GAMES[i - 1]) ? '<span class="segsep" aria-hidden="true"></span>' : ''}<button type="button" data-g="${k}" aria-pressed="${k === 'all'}"${T2.has(k) ? ' class="t2"' : ''}>${k === 'all' ? 'Tous' : GN[k]}</button>`).join('');
$('games').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  S.game = b.dataset.g; $('games').querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', x === b));
  buildPins(); if (S.team) openTeam(S.team); else if (S.sel) openCountry(S.sel); else home();
});

/* ---------- Recherche (globale, partagée avec l'accueil) ---------- */
let IDX = null, IDXK = '';
const items = () => { const k = S.orgs.length + ':' + S.live.length; if (!IDX || IDXK !== k) { IDXK = k; IDX = buildIndex(S.orgs, S.live); } return S.orgs.length ? IDX : []; };
attachSearch($('q'), { getItems: items, onPick: (it) => {
  if (it.t === 'team') openTeam(it.o);
  else if (it.t === 'player') openTeam(it.o, it.game, it.p.id);
  else if (it.t === 'country') select(it.cc);
  else if (it.t === 'comp' || it.t === 'match') { const m = it.m || S.live.find((x) => x.comp === it.comp); if (m && m.watch && it.t === 'match') window.open(m.watch, '_blank', 'noopener'); else home(); }
} });

/* ---------- Données ---------- */
home();
fetch('/api/live').then((r) => r.ok ? r.json() : null).then((d) => { if (d) { S.live = (d.matches || []).concat(d.recent || []); if (S.orgs.length) { computeLive(); buildPins(); } if (!S.sel) home(); } }).catch(() => {});
function setOrgs(d) {
  if (!d || !d.orgs || !d.orgs.length) return false;
  S.orgs = d.orgs; S.byCC = {};
  S.orgs.forEach((o) => { const cc = (o.cc || '').toUpperCase(); o.cc = cc; (S.byCC[cc] = S.byCC[cc] || []).push(o); });
  computeLive(); buildPins();
  const u = new URLSearchParams(location.search);
  if (!S.urlDone && (u.get('team') || u.get('cc'))) {
    S.urlDone = true;
    const o = S.orgs.find((x) => x.id === u.get('team'));
    if (o) openTeam(o, u.get('g'), u.get('p')); else if (u.get('cc')) select(u.get('cc').toUpperCase());
    history.replaceState(null, '', '/atlas');
  } else if (S.team) openTeam(S.orgs.find((x) => x.id === S.team.id) || S.team); else if (S.sel) openCountry(S.sel); else home();
  if (g) g.redraw(); return true;
}
function computeLive() {
  S.liveCC = new Set();
  S.live.filter((m) => m.status === 'running').forEach((m) => S.orgs.forEach((o) => { if (matchesOf(o).includes(m)) S.liveCC.add(o.cc); }));
}
// 1) copie locale immédiate (vraies données, mise à jour régulièrement) 2) API live ensuite
fetch('/assets/orgs.json').then((r) => r.ok ? r.json() : null).then((d) => { if (!S.orgs.length) setOrgs(d); }).catch(() => {});
fetch('/api/orgs?v=3').then((r) => { if (!r.ok) throw 0; return r.json(); }).then(setOrgs).catch(() => { if (!S.orgs.length) $('stat').textContent = 'Équipes indisponibles pour le moment'; });
