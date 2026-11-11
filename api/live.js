// Matchs en direct, a venir et recents, via PandaScore.
// Cache cote lambda (warm) : PandaScore n'est rappele que si le cache a plus de 2 minutes.
const GAME = {
  'lol': 'lol', 'league-of-legends': 'lol', 'cs-go': 'cs2', 'csgo': 'cs2', 'cs2': 'cs2', 'counter-strike': 'cs2',
  'valorant': 'val', 'rl': 'rl', 'rocket-league': 'rl', 'dota-2': 'dota', 'dota2': 'dota', 'r6-siege': 'r6', 'rainbow-6-siege': 'r6',
  'ow': 'ow', 'overwatch': 'ow', 'codmw': 'cod', 'call-of-duty': 'cod', 'fifa': 'fc', 'ea-sports-fc': 'fc',
  'starcraft-2': 'sc', 'starcraft-brood-war': 'sc', 'mobile-legends': 'mlbb', 'mlbb': 'mlbb', 'kog': 'hok', 'honor-of-kings': 'hok', 'age-of-empires': 'aoe'
};
const BASE = 'https://api.pandascore.co';
const FRL = /\b(LFL|LDLC|Ligue Fran|French|France|Gamers Origin|Elite Series|Coupe de France|Slash|Rising League|Nexus League)\b/i;
// Grands événements internationaux : un tier S y est toujours important, même sans org « connue ».
const INTL = /\b(world|worlds|msi|major|masters|champions|first stand|esports world cup|ewc|rlcs|nations cup|enc|iem|blast premier|pgl)\b/i;
// Tiers de jeux (choix de Flavien) : T1 LoL, CS2, Valorant, Rocket League ; T2 R6, Dota 2, Overwatch, CoD, EA FC ; T3 (MLBB, HoK, StarCraft, AoE) exclu.
const CFG = require('./_config');
const GW = CFG.GAME_WEIGHT;
const T3 = new Set(CFG.TIERS.T3);
const TW = { s: 100, a: 60, b: 20, c: 10, d: 5 };
// Orgs « connues » : un match qui en contient une est toujours jugé important (bonus d'importance).
// FR d'abord (public de Lobby), puis les grosses orgs internationales.
const BIG_FR = /^(karmine corp|kc|team vitality|vitality|vit|gentle mates|m8|team bds|bds|solary|sly|gamers ?origin|go|team heretics|heretics|th|aegis|ldlc|mandatory|mdy|joblife|team go|bk rog|zerance|vitality\.bee|kcb|karmine corp blue)$/i;
const BIG_INT = /^(g2|g2 esports|fnatic|fnc|natus vincere|navi|t1|gen\.?g|faze|faze clan|mouz|team liquid|liquid|tl|sentinels|sen|furia|fur|team spirit|spirit|ts|hanwha life esports|hle|bilibili gaming|blg|top esports|tes|jd gaming|jdg|weibo gaming|wbg|cloud9|c9|100 thieves|100t|nrg|paper rex|prx|edward gaming|edg|drx|fut esports|fut|astralis|ast|heroic|virtus\.pro|vp|the mongolz|mongolz|eternal fire|ef|team falcons|falcons|falcons esports|complexity|col|gaimin gladiators|team secret|secret|og|tundra esports|tundra|xtreme gaming|xg|parivision|betboom team|bb|dplus|dk|kt rolls?ter|kt|leviatan|lev|kru esports|kru|loud|mibr|evil geniuses|eg)$/i;
// Nom complet uniquement : les sigles courts (GG, TS, TL…) sont partagés par trop de petites équipes.
function bigness(t) { const n = String(t.name || '').trim(); return BIG_FR.test(n) ? 2 : (BIG_INT.test(n) ? 1 : 0); }

function pick(m) {
  const o = (m.opponents || []).map((x) => x.opponent).filter(Boolean);
  if (o.length < 2) return null;
  const game = GAME[m.videogame && m.videogame.slug];
  if (!game || T3.has(game)) return null;
  const score = (id) => { const r = (m.results || []).find((x) => x.team_id === id); return r ? r.score : 0; };
  const stream = (m.streams_list || []).find((s) => s.main && s.raw_url) || (m.streams_list || []).find((s) => s.official && s.raw_url) || (m.streams_list || [])[0];
  const tier = (m.tournament && m.tournament.tier) || 'b';
  const league = (m.league && m.league.name) || '';
  const serie = (m.serie && (m.serie.full_name || m.serie.name)) || '';
  const fr = FRL.test(league + ' ' + serie);
  const a = o[0], b = o[1];
  const ba = bigness(a), bb = bigness(b), big = Math.max(ba, bb);
  const imp = (GW[game] || 0) + (TW[tier] || 5) + (fr ? 40 : 0) + (big === 2 ? 90 : big === 1 ? 45 : 0) + (ba && bb ? 30 : 0);
  // Important = une org connue, la scène FR, ou un tier S sur un jeu majeur (LoL, CS2, Valorant). Le reste = mineur.
  // Important = org connue, scène FR, ou tier S d'un GRAND événement international sur un jeu T1 (pas une ligue régionale lambda).
  const k = big > 0 || fr || (tier === 's' && (GW[game] || 0) >= 20 && INTL.test(league + ' ' + serie)) ? 1 : 0;
  const short = (t) => (t.acronym || t.name || '?').toString();
  const ts = Date.parse(m.begin_at || m.scheduled_at || m.modified_at || 0) || 0;
  return {
    imp, k, big, tier, id: m.id, status: m.status, ts, game,
    comp: league, serie,
    ll: (m.league && m.league.image_url) || null,
    an: a.name, as: short(a), al: a.image_url || null, sa: score(a.id),
    bn: b.name, bs: short(b), bl: b.image_url || null, sb: score(b.id),
    watch: stream && stream.raw_url ? stream.raw_url : null
  };
}

async function fetchList(path, token) {
  const r = await fetch(BASE + path, {
    headers: { Authorization: 'Bearer ' + token },
    signal: AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error('pandascore ' + r.status + ' on ' + path);
  return r.json();
}

let CACHE = { at: 0, body: null };

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const token = process.env.PANDASCORE_TOKEN;
  if (!token) { res.status(500).json({ error: 'no_token', matches: [], recent: [] }); return; }

  const now = Date.now();
  if (CACHE.body && now - CACHE.at < 240000) {
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(CACHE.body);
    return;
  }

  try {
    const [running, upcoming, past, perGame] = await Promise.all([
      fetchList('/matches/running?per_page=50', token),
      fetchList('/matches/upcoming?sort=begin_at&per_page=100&page=1', token),
      fetchList('/matches/past?sort=-begin_at&per_page=100', token),
      // Passe dédiée aux jeux T1 : sinon un jeu moins couvert (Rocket League…) disparaît derrière le volume CS2/Dota.
      Promise.all(['lol', 'csgo', 'valorant', 'rl'].map((g) => Promise.all([
        fetchList('/' + g + '/matches/upcoming?sort=begin_at&per_page=40', token).catch(() => []),
        fetchList('/' + g + '/matches/past?sort=-begin_at&per_page=25', token).catch(() => [])
      ]))).catch(() => [])
    ]);

    const seen = new Set();
    const take = (arr) => (arr || []).map(pick).filter((x) => x && !seen.has(x.id) && seen.add(x.id));

    let live = take(running).filter((m) => m.status === 'running');
    const pgUp = [], pgPast = []; (perGame || []).forEach((x) => { pgUp.push(...(x[0] || [])); pgPast.push(...(x[1] || [])); });
    let next = take((upcoming || []).concat(pgUp)).filter((m) => m.status === 'not_started');
    let recent = take((past || []).concat(pgPast)).filter((m) => m.status === 'finished' && (m.sa || m.sb));

    live.sort((a, b) => b.imp - a.imp);
    next.sort((a, b) => a.ts - b.ts);
    recent.sort((a, b) => b.ts - a.ts);

    // Tri : on garde d'abord ce qui compte (tier S/A, scène FR, grosses orgs), puis un peu de mineur pour ne jamais être vide.
    const imp = (arr, n) => { const k = arr.filter((m) => m.k), o = arr.filter((m) => !m.k); return k.concat(o).slice(0, n); };
    live.sort((a, b) => (b.k - a.k) || (b.imp - a.imp));
    // Matchs sourcés à la main : « en direct » pendant ~1h15 après l'heure annoncée (Bo5), sans score inventé.
    (CFG.MANUAL || []).forEach((x) => {
      const ts = Date.parse(x.at); if (now > ts + 75 * 60000) return;
      const m = { imp: 160, k: 1, big: 2, tier: 'b', id: x.id, status: now >= ts ? 'running' : 'not_started', ts, game: x.game, comp: x.comp, serie: '2026', ll: null,
        an: x.a[0], as: x.a[1], al: null, sa: null, bn: x.b[0], bs: x.b[1], bl: null, sb: null, watch: x.watch, src: x.source, manual: 1 };
      (m.status === 'running' ? live : next).push(m);
    });
    live.sort((a, b) => (b.k - a.k) || (b.imp - a.imp)); next.sort((a, b) => a.ts - b.ts);
    const matches = live.concat(imp(next, 90)).slice(0, 110);
    recent = imp(recent, 30).sort((a, b) => (b.k - a.k) || (b.ts - a.ts));

    const today = new Date(now).toISOString().slice(0, 10);
    const events = (CFG.EVENTS || []).filter((e) => e.from <= today && today < e.until);
    const body = { updated: now, matches, recent, events };
    CACHE = { at: now, body };
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(body);
  } catch (e) {
    if (CACHE.body) { res.status(200).json(CACHE.body); return; }
    res.status(502).json({ error: 'fetch_failed', detail: String(e.message || e), matches: [], recent: [] });
  }
};
