// LOBBY — Atlas immersif. mountAtlas() se pose sur un globe (créé ici ou déjà présent, ex. celui de l'accueil).
// Aucune donnée inventée : équipes = /api/orgs (ou copie locale), matchs = /api/live.
import { createGlobe, skyFor } from '/atlas/globe.js';
import { buildIndex, attachSearch } from '/search.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const GN = { lol: 'LoL', cs2: 'CS2', val: 'Valorant', rl: 'Rocket League', dota: 'Dota 2', r6: 'R6', ow: 'Overwatch', cod: 'CoD', fc: 'EA FC' };
const GAMES = ['all', 'lol', 'cs2', 'val', 'rl', 'r6', 'dota', 'ow'];
const T2 = new Set(['r6', 'dota', 'ow', 'cod', 'fc']);
const RETIRED = /^(ici japon corp)/i;
const REG = (() => { try { return new Intl.DisplayNames(['fr'], { type: 'region' }); } catch { return null; } })();
const country = (cc) => (REG && cc ? REG.of(cc) : cc) || cc;
// Centre approximatif de chaque pays : la source ne donne que le PAYS d'une org, pas sa ville.
export const CC = { FR: [46.6, 2.4], DE: [51.2, 10.4], GB: [54, -2], ES: [40.4, -3.7], IT: [42.8, 12.5], PL: [52, 19.4], SE: [62, 15], DK: [56, 9.5], NO: [61, 9], FI: [64, 26], NL: [52.2, 5.5], BE: [50.6, 4.6], PT: [39.6, -8], RU: [56, 38], UA: [49, 32], TR: [39, 35], US: [39.5, -98.5], CA: [56, -106], BR: [-14, -51], AR: [-34, -64], CL: [-33, -71], MX: [23, -102], PE: [-9, -75], CO: [4.5, -74], VE: [7, -66], UY: [-33, -56], KR: [36.5, 127.8], CN: [35, 104], JP: [36.2, 138.2], TW: [23.7, 121], HK: [22.3, 114.2], MO: [22.2, 113.5], VN: [16, 107.8], TH: [15.8, 101], PH: [12.9, 121.8], ID: [-2.5, 118], MY: [4.2, 102], SG: [1.35, 103.8], KH: [12.6, 104.9], MM: [21, 96], AU: [-25.3, 133.8], NZ: [-41, 174], IN: [21, 78], PK: [30.4, 69.3], BD: [23.7, 90.4], SA: [24, 45], AE: [24, 54], QA: [25.3, 51.2], KW: [29.3, 47.5], JO: [31.2, 36.5], LB: [33.9, 35.9], IR: [32.4, 53.7], IQ: [33, 44], KZ: [48, 67], UZ: [41.4, 64.6], KG: [41.2, 74.8], MN: [46.9, 103.8], CZ: [49.8, 15.5], SK: [48.7, 19.7], RS: [44, 21], BG: [42.7, 25.5], RO: [45.9, 25], HU: [47.2, 19.5], AT: [47.5, 14.5], CH: [46.8, 8.2], IL: [31, 35], EE: [58.6, 25], LV: [56.9, 24.6], LT: [55.2, 23.9], BY: [53.7, 28], MD: [47.4, 28.4], GE: [42.3, 43.4], AM: [40.1, 45], AZ: [40.1, 47.6], ZA: [-30.6, 22.9], EG: [26.8, 30.8], MA: [31.8, -7.1], TN: [34, 9.5], DZ: [28, 2.6], NG: [9, 8.7], KE: [0, 38], IE: [53.4, -8.2], GR: [39, 22], HR: [45.1, 15.2], SI: [46.1, 14.9], BA: [44, 17.8], MK: [41.6, 21.7], AL: [41.1, 20.2], ME: [42.7, 19.4], XK: [42.6, 20.9], IS: [64.9, -18.6], LU: [49.8, 6.1], CY: [35.1, 33.4], MT: [35.9, 14.4], CR: [9.7, -84], GT: [15.8, -90.2], DO: [18.7, -70.2], PR: [18.2, -66.5], EC: [-1.8, -78.2], BO: [-16.3, -63.6], PY: [-23.4, -58.4] };
const act = (o) => Object.values(o.g || {}).reduce((s, x) => s + (x.f || 0), 0);
function logo(url, txt, cls = 'lg') {
  const t = esc(String(txt || '?').replace(/[^A-Za-z0-9]/g, '').slice(0, 3).toUpperCase());
  return `<span class="${cls}">${url ? `<img src="${esc(url)}" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${t}'))">` : t}</span>`;
}

/**
 * stage   : élément plein écran qui contient (ou contiendra) le globe
 * globe   : instance existante (accueil) — sinon créée dans stage
 * onClose : mode accueil — le bouton « ← Accueil » referme l'Atlas sans changer de page
 * params  : URLSearchParams (team, g, p, cc) pour ouvrir directement une fiche
 */
export function mountAtlas(o) {
  const stage = o.stage, mobile = () => innerWidth <= 900;
  const S = { orgs: [], byCC: {}, live: [], liveCC: new Set(), game: 'all', sel: null, team: null, urlDone: false };
  const root = document.createElement('div');
  root.className = 'atl';
  root.innerHTML = `
    <div class="mk"></div>
    <div class="top fx d1">
      <a class="logo" href="/">Lobby<b>.</b></a>
      ${o.onClose ? '<button type="button" class="back" data-close>← Accueil</button>' : '<a class="back" href="/">← Accueil</a>'}
      <span class="ttl">Atlas</span>
      <div class="seg" role="group" aria-label="Filtrer par jeu"></div>
      <label class="search"><span class="sr">Rechercher un joueur, une équipe ou un pays</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/></svg><input type="search" placeholder="Joueur, équipe, pays…" autocomplete="off" spellcheck="false"><kbd>/</kbd></label>
    </div>
    <div class="seg mseg fx d2" role="group" aria-label="Filtrer par jeu"></div>
    <span class="glass stat fx d2">Chargement des équipes…</span>
    <span class="glass hint fx d3">Glisse pour tourner · zoome pour voir les logos des équipes</span>
    <span class="glass ctl fx d3"><button type="button" data-z="in" aria-label="Zoomer">+</button><button type="button" data-z="out" aria-label="Dézoomer">−</button><button type="button" data-z="home" aria-label="Vue monde">◎</button></span>
    <aside class="side fx d4" aria-label="Informations"><button type="button" class="grip" aria-label="Agrandir ou réduire le panneau"></button><div class="panel" aria-live="polite"></div></aside>`;
  stage.appendChild(root);
  const $ = (sel) => root.querySelector(sel);
  const layer = $('.mk'), panel = $('.panel'), side = $('.side');

  /* ---------- Globe ---------- */
  const sky = skyFor();
  let g = o.globe || null;
  if (!g) {
    stage.style.background = sky.bg;
    try { g = createGlobe(o.glEl || stage, { view: o.view || { lat: 38, lon: 8, dist: 3.1 }, starsOpacity: sky.stars }); }
    catch (e) { root.insertAdjacentHTML('afterbegin', '<div class="msg"><div><b style="color:#fff;font-size:15px">La 3D (WebGL) est désactivée dans ce navigateur.</b><br>Chrome : Réglages → Système → « Utiliser l\'accélération graphique », puis relance. Les données restent dans le panneau.</div></div>'); }
  }
  const applyOffset = (ms) => { if (!g) return; if (mobile()) g.setOffset(0, side.classList.contains('min') ? 0 : Math.round(innerHeight * 0.2), ms); else g.setOffset(196, 0, ms); };
  if (g) { g.setInteractive(true); g.setStars(sky.stars); g.onFrame(placeMarkers); applyOffset(o.globe ? 900 : 0); }
  const onResize = () => applyOffset(0); addEventListener('resize', onResize);
  root.addEventListener('click', (e) => {
    const z = e.target.closest('[data-z]');
    if (z && g) {
      const d = g.camera.position.length();
      if (z.dataset.z === 'in') g.zoomTo(Math.max(1.45, d * 0.75), 450);
      else if (z.dataset.z === 'out') g.zoomTo(Math.min(7, d / 0.75), 450);
      else { select(null); g.flyTo(38, 8, 3.1); }
    }
    if (e.target.closest('[data-close]') && o.onClose) o.onClose();
    if (e.target.closest('.grip')) { side.classList.toggle('min'); applyOffset(400); }
  });

  /* ---------- Marqueurs ---------- */
  const pins = {}; let order = [];
  const visibleOrgs = (list) => (S.game === 'all' ? list : list.filter((x) => x.g && x.g[S.game]));
  function buildPins() {
    layer.innerHTML = ''; Object.keys(pins).forEach((k) => delete pins[k]);
    Object.keys(S.byCC).forEach((cc) => {
      const list = visibleOrgs(S.byCC[cc]); if (!list.length || !CC[cc]) return;
      const top3 = list.slice().sort((a, b) => act(b) - act(a)).slice(0, 3), isLive = S.liveCC.has(cc);
      const el = document.createElement('button');
      el.type = 'button'; el.className = 'pin' + (isLive ? ' live' : ''); el.dataset.cc = cc;
      el.setAttribute('aria-label', `${country(cc)} : ${list.length} équipe${list.length > 1 ? 's' : ''}`);
      el.innerHTML = `<span class="pd"><span class="pc">${list.length}</span></span><span class="pl"><b>${esc(country(cc))}</b>${top3.map((x) => logo(x.lg || x.ld, x.s || x.n, 'mini')).join('')}${isLive ? '<em>● live</em>' : ''}</span>`;
      el.style.setProperty('--sz', (18 + Math.min(12, Math.sqrt(list.length) * 2.4)).toFixed(1) + 'px');
      el.onclick = (e) => { e.stopPropagation(); select(cc); };
      layer.appendChild(el);
      const ring = list.slice().sort((a, b) => act(b) - act(a)).slice(0, 8).map((t, i, arr) => {
        const r = document.createElement('button');
        r.type = 'button'; r.className = 'tlogo'; r.title = t.n; r.setAttribute('aria-label', t.n);
        r.innerHTML = logo(t.ld || t.lg, t.s || t.n, 'tlg'); r.dataset.a = (i / arr.length) * Math.PI * 2 - Math.PI / 2;
        r.onclick = (e) => { e.stopPropagation(); openTeam(t); };
        layer.appendChild(r); return r;
      });
      pins[cc] = { el, ring, n: list.length };
    });
    order = Object.keys(pins).sort((a, b) => pins[b].n - pins[a].n);
    const nT = order.reduce((s, k) => s + pins[k].n, 0), nL = S.liveCC.size;
    $('.stat').innerHTML = nT ? `<b>${nT}</b> équipes · <b>${order.length}</b> pays${nL ? ` · <span class="lvd"></span> <b>${nL}</b> en direct` : ''}` : 'Chargement des équipes…';
    if (g) g.redraw();
  }
  function placeMarkers(cam, dist) {
    const close = dist < 2.2, placed = [];
    let focusCC = null, fd = 1e9; const W = stage.clientWidth / 2 - (mobile() ? 0 : 196), H = stage.clientHeight / 2;
    if (close) for (const cc of order) { const q = g.project(CC[cc][0], CC[cc][1]); if (!q.front) continue; const dd = Math.hypot(q.x - W, q.y - H); if (dd < fd) { fd = dd; focusCC = cc; } }
    for (const cc of order) {
      const p = pins[cc], s = g.project(CC[cc][0], CC[cc][1]);
      let on = s.front;
      if (on && S.sel !== cc && placed.some((q) => Math.hypot(q.x - s.x, q.y - s.y) < (close ? 26 : 22))) on = false;
      if (on) placed.push(s);
      p.el.style.transform = `translate(${s.x}px,${s.y}px)`;
      p.el.classList.toggle('hid', !on); p.el.classList.toggle('sel', S.sel === cc);
      p.el.classList.toggle('lab', on && (S.sel === cc || (close && cc === focusCC)));
      const showRing = on && S.sel === cc, R = 30 + Math.min(14, p.ring.length * 2);
      if (showRing || p.shown) p.ring.forEach((r) => { const a = +r.dataset.a; if (showRing) r.style.transform = `translate(${s.x + Math.cos(a) * R}px,${s.y + Math.sin(a) * R}px)`; r.classList.toggle('show', showRing); });
      p.shown = showRing;
    }
  }

  /* ---------- Panneau ---------- */
  function setPanel(html) { panel.innerHTML = html; panel.scrollTop = 0; panel.classList.remove('swap'); void panel.offsetWidth; panel.classList.add('swap'); }
  function matchesOf(t) { const n = t.n.toLowerCase(), s = (t.s || '').toLowerCase(), eq = (x, y) => (x || '').toLowerCase() === y; return S.live.filter((m) => eq(m.an, n) || eq(m.bn, n) || (s.length >= 2 && (eq(m.as, s) || eq(m.bs, s)))); }
  function matchRow(m) {
    const lv = m.status === 'running', fin = m.status === 'finished';
    const d = new Date(m.ts), t = lv ? '<span class="lv">LIVE</span>' : d.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '') + '<br>' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    return `<a class="mrow" ${m.watch ? `href="${esc(m.watch)}" target="_blank" rel="noopener"` : ''}><span class="mt">${t}</span><span class="mm">${logo(m.al, m.as)}<b>${esc(m.as || m.an)}</b><span class="ms">${lv || fin ? (m.sa == null ? '–' : `${m.sa}:${m.sb}`) : 'vs'}</span><b>${esc(m.bs || m.bn)}</b>${logo(m.bl, m.bs)}</span><span class="mc">${esc(m.comp)}</span></a>`;
  }
  function home() {
    S.sel = null; S.team = null;
    const ccs = Object.keys(S.byCC).filter((cc) => visibleOrgs(S.byCC[cc]).length).sort((a, b) => visibleOrgs(S.byCC[b]).length - visibleOrgs(S.byCC[a]).length);
    const live = S.live.filter((m) => m.k && m.status !== 'finished' && (S.game === 'all' || m.game === S.game)).slice(0, 4);
    setPanel(`
      <div class="ph"><div class="eyebrow">L'Atlas Lobby</div><h2>Découvre la scène mondiale.</h2><p class="lead">Clique un pays sur le globe, ou cherche un joueur, une équipe.</p></div>
      ${live.length ? `<div class="sec"><h3>À suivre</h3>${live.map(matchRow).join('')}</div>` : ''}
      ${S.orgs.length ? `<div class="sec"><h3>Équipes à la une</h3><div class="tgrid">${visibleOrgs(S.orgs).slice().sort((a, b) => act(b) - act(a)).slice(0, 12).map((t) => `<button type="button" class="tcell" data-id="${esc(t.id)}" title="${esc(t.n)}">${logo(t.lg || t.ld, t.s || t.n)}<span>${esc(t.s || t.n)}</span></button>`).join('')}</div></div>` : ''}
      <div class="sec"><h3>Pays les plus représentés</h3>${ccs.slice(0, 8).map((cc) => { const l = visibleOrgs(S.byCC[cc]); return `<button type="button" class="crow" data-cc="${cc}"><span>${esc(country(cc))}${S.liveCC.has(cc) ? ' <em class="lvt">live</em>' : ''}</span><span class="stack">${l.slice().sort((a, b) => act(b) - act(a)).slice(0, 3).map((t) => logo(t.lg || t.ld, t.s || t.n, 'mini')).join('')}</span><i>${l.length}</i></button>`; }).join('') || '<p class="empty">Chargement des équipes…</p>'}</div>
      <p class="note">Les équipes sont placées au centre de leur pays : la source ne donne pas leur ville.</p>`);
  }
  function openCountry(cc) {
    const list = visibleOrgs(S.byCC[cc] || []).slice().sort((a, b) => act(b) - act(a));
    const ms = []; list.forEach((t) => matchesOf(t).forEach((m) => { if (!ms.includes(m)) ms.push(m); }));
    setPanel(`<button type="button" class="pback" data-world>← Monde</button>
      <div class="ph"><div class="eyebrow">Pays</div><h2>${esc(country(cc))}</h2><p class="lead">${list.length} équipe${list.length > 1 ? 's' : ''} suivie${list.length > 1 ? 's' : ''}${S.game !== 'all' ? ' en ' + GN[S.game] : ''}</p></div>
      ${ms.length ? `<div class="sec"><h3>Leurs matchs</h3>${ms.slice(0, 6).map(matchRow).join('')}</div>` : ''}
      <div class="sec"><h3>Équipes</h3>${list.map((t) => `<button type="button" class="trow" data-id="${esc(t.id)}">${logo(t.lg || t.ld, t.s || t.n)}<span><b>${esc(t.n)}</b><small>${Object.keys(t.g || {}).map((k) => GN[k] || k).join(' · ')}</small></span><i>›</i></button>`).join('') || '<p class="empty">Aucune équipe pour ce filtre.</p>'}</div>`);
  }
  function openTeam(t, forceGame, hlPlayer) {
    S.team = t; S.sel = t.cc;
    const games = Object.keys(t.g || {});
    const gk = forceGame && t.g[forceGame] ? forceGame : (S.game !== 'all' && t.g[S.game] ? S.game : games[0]);
    const roster = (k) => { const pl = (t.g[k] && t.g[k].pl) || []; return pl.length ? pl.map((p) => `<div class="prow${hlPlayer && p.id == hlPlayer ? ' hl' : ''}">${p.im ? `<img src="${esc(p.im)}" alt="" loading="lazy" onerror="this.remove()">` : `<span class="pav">${esc((p.n || '?').slice(0, 2).toUpperCase())}</span>`}<span><b>${esc(p.n)}</b><small>${esc([p.fn, p.ln].filter(Boolean).join(' '))}${p.r ? ' · ' + esc(p.r) : ''}</small></span>${p.cc ? `<i>${esc(p.cc)}</i>` : ''}</div>`).join('') : '<p class="empty">Roster non disponible.</p>'; };
    const ms = matchesOf(t);
    setPanel(`<button type="button" class="pback" data-ccb="${esc(t.cc)}">← ${esc(country(t.cc))}</button>
      <div class="team">${logo(t.lg || t.ld, t.s || t.n, 'lg big')}<div><div class="eyebrow">Équipe · ${esc(country(t.cc))}</div><h2>${esc(t.n)}</h2></div></div>
      ${ms.length ? `<div class="sec"><h3>Matchs</h3>${ms.slice(0, 5).map(matchRow).join('')}</div>` : ''}
      <div class="sec"><h3>Roster</h3>${games.length > 1 ? `<div class="gtabs">${games.map((k) => `<button type="button" data-g="${k}" aria-pressed="${k === gk}">${GN[k] || k}</button>`).join('')}</div>` : ''}<div class="rst">${roster(gk)}</div></div>`);
    panel.querySelectorAll('.gtabs button').forEach((b) => b.onclick = () => { panel.querySelectorAll('.gtabs button').forEach((x) => x.setAttribute('aria-pressed', x === b)); panel.querySelector('.rst').innerHTML = roster(b.dataset.g); });
    if (hlPlayer) setTimeout(() => { const h = panel.querySelector('.prow.hl'); if (h) h.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 350);
    if (g && CC[t.cc]) g.flyTo(CC[t.cc][0], CC[t.cc][1], 1.95);
  }
  function select(cc) { S.sel = cc; S.team = null; if (!cc) return home(); openCountry(cc); if (g && CC[cc]) g.flyTo(CC[cc][0], CC[cc][1], Math.min(g.camera.position.length(), 2.05)); }
  panel.addEventListener('click', (e) => {
    const c = e.target.closest('.crow'); if (c) return select(c.dataset.cc);
    const t = e.target.closest('.trow,.tcell'); if (t) { const x = S.orgs.find((y) => y.id === t.dataset.id); if (x) openTeam(x); return; }
    if (e.target.closest('[data-world]')) { select(null); if (g) g.zoomTo(3.1, 700); return; }
    const cb = e.target.closest('[data-ccb]'); if (cb) return select(cb.dataset.ccb);
  });

  /* ---------- Filtres ---------- */
  const segHTML = GAMES.map((k, i) => `${T2.has(k) && !T2.has(GAMES[i - 1]) ? '<span class="segsep" aria-hidden="true"></span>' : ''}<button type="button" data-g="${k}" aria-pressed="${k === 'all'}"${T2.has(k) ? ' class="t2"' : ''}>${k === 'all' ? 'Tous' : GN[k]}</button>`).join('');
  root.querySelectorAll('.seg').forEach((sg) => {
    sg.innerHTML = segHTML;
    sg.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return; S.game = b.dataset.g;
      root.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', x.dataset.g === S.game));
      buildPins(); if (S.team) openTeam(S.team); else if (S.sel) openCountry(S.sel); else home();
    });
  });

  /* ---------- Recherche ---------- */
  let IDX = null, IDXK = '';
  const items = () => { const k = S.orgs.length + ':' + S.live.length; if (!IDX || IDXK !== k) { IDXK = k; IDX = buildIndex(S.orgs, S.live); } return S.orgs.length ? IDX : []; };
  attachSearch($('.search input'), { getItems: items, onPick: (it) => {
    if (it.t === 'team') openTeam(it.o);
    else if (it.t === 'player') openTeam(it.o, it.game, it.p.id);
    else if (it.t === 'country') select(it.cc);
    else if (it.t === 'match' && it.m.watch) window.open(it.m.watch, '_blank', 'noopener');
    else home();
  } });

  /* ---------- Données ---------- */
  // Logos manquants : on complète avec ceux qu'on a déjà (fiche org), quelle que soit la source du match.
  const kn = (x) => String(x || '').toLowerCase().replace(/^team\s+|\s+(esports?|gaming)$/g, '').trim();
  function fillLogos() {
    if (!S.orgs.length || !S.live.length) return; const L = {};
    S.orgs.forEach((t) => { const u = t.lg || t.ld; if (u) { L[kn(t.n)] = u; if (t.s) L['#' + kn(t.s)] = L['#' + kn(t.s)] || u; } });
    const f = (n, s) => L[kn(n)] || L['#' + kn(s)] || null;
    S.live.forEach((m) => { if (!m.al) m.al = f(m.an, m.as); if (!m.bl) m.bl = f(m.bn, m.bs); });
  }
  function computeLive() { fillLogos(); S.liveCC = new Set(); S.live.filter((m) => m.status === 'running').forEach((m) => S.orgs.forEach((t) => { if (matchesOf(t).includes(m)) S.liveCC.add(t.cc); })); }
  function refreshView() {
    const u = o.params;
    if (u && !S.urlDone && (u.get('team') || u.get('cc')) && S.orgs.length) {
      S.urlDone = true;
      const t = S.orgs.find((x) => x.id === u.get('team'));
      if (t) openTeam(t, u.get('g'), u.get('p')); else if (u.get('cc')) select(u.get('cc').toUpperCase());
      if (o.onParamsUsed) o.onParamsUsed();
    } else if (S.team) openTeam(S.orgs.find((x) => x.id === S.team.id) || S.team); else if (S.sel) openCountry(S.sel); else home();
  }
  function setOrgs(d) {
    if (!d || !d.orgs || !d.orgs.length) return;
    if (S.orgs.length && d.orgs.length < S.orgs.length * 0.8) return; // on garde la liste la plus complète
    S.orgs = d.orgs.filter((t) => !RETIRED.test(t.n)); S.byCC = {};
    S.orgs.forEach((t) => { const cc = (t.cc || '').toUpperCase(); t.cc = cc; (S.byCC[cc] = S.byCC[cc] || []).push(t); });
    computeLive(); buildPins(); refreshView();
  }
  home();
  const pre = o.preload || {};
  if (pre.live) S.live = (pre.live.matches || []).concat(pre.live.recent || []);
  if (pre.orgs) setOrgs(pre.orgs);
  if (!pre.live) fetch('/api/live').then((r) => (r.ok ? r.json() : null)).then((d) => { if (d) { S.live = (d.matches || []).concat(d.recent || []); if (S.orgs.length) { computeLive(); buildPins(); } refreshView(); } }).catch(() => {});
  if (!pre.orgs) fetch('/assets/orgs.json').then((r) => (r.ok ? r.json() : null)).then((d) => { if (!S.orgs.length) setOrgs(d); }).catch(() => {});
  if (!pre.orgsApi) fetch('/api/orgs?v=4').then((r) => { if (!r.ok) throw 0; return r.json(); }).then(setOrgs).catch(() => {});

  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('in')));

  return {
    globe: g,
    unmount(ms = 400) {
      root.classList.remove('in'); removeEventListener('resize', onResize);
      if (g) g.setOffset(0, 0, ms);
      return new Promise((r) => setTimeout(() => { root.remove(); r(); }, ms));
    }
  };
}
