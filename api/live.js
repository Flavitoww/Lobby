// Matchs en direct, a venir et recents, via PandaScore.
// Cache cote lambda (warm) : PandaScore n'est rappele que si le cache a plus de 2 minutes.
const GAME = {
  'lol': 'lol', 'league-of-legends': 'lol', 'cs-go': 'cs2', 'csgo': 'cs2', 'cs2': 'cs2', 'counter-strike': 'cs2',
  'valorant': 'val', 'rl': 'rl', 'rocket-league': 'rl', 'dota-2': 'dota', 'dota2': 'dota', 'r6-siege': 'r6', 'rainbow-6-siege': 'r6',
  'ow': 'ow', 'overwatch': 'ow', 'codmw': 'cod', 'call-of-duty': 'cod', 'fifa': 'fc', 'ea-sports-fc': 'fc',
  'starcraft-2': 'sc', 'starcraft-brood-war': 'sc', 'mobile-legends': 'mlbb', 'mlbb': 'mlbb', 'kog': 'hok', 'honor-of-kings': 'hok', 'age-of-empires': 'aoe'
};
const BASE = 'https://api.pandascore.co';
const FRL = /\b(LFL|LDLC|Ligue Fran|French|France|Gamers Origin|Elite Series)\b/i;
const GW = { lol: 20, cs2: 20, val: 20, dota: 10, rl: 10, r6: 10 };
const TW = { s: 100, a: 60, b: 20, c: 10, d: 5 };
// Orgs « connues » : un match qui en contient une est toujours jugé important (bonus d'importance).
// FR d'abord (public de Lobby), puis les grosses orgs internationales.
const BIG_FR = /^(karmine corp|kc|team vitality|vitality|vit|gentle mates|m8|team bds|bds|solary|sly|gamers ?origin|go|team heretics|heretics|th|aegis|ldlc|mandatory|mdy|joblife|team go|bk rog|zerance|vitality\.bee|kcb|karmine corp blue)$/i;
const BIG_INT = /^(g2|g2 esports|fnatic|fnc|natus vincere|navi|t1|gen\.?g|faze|faze clan|mouz|team liquid|liquid|tl|sentinels|sen|furia|fur|team spirit|spirit|ts|hanwha life esports|hle|bilibili gaming|blg|top esports|tes|jd gaming|jdg|weibo gaming|wbg|cloud9|c9|100 thieves|100t|nrg|paper rex|prx|edward gaming|edg|drx|fut esports|fut|astralis|ast|heroic|virtus\.pro|vp|the mongolz|mongolz|eternal fire|ef|team falcons|falcons|falcons esports|complexity|col|gaimin gladiators|gg|team secret|secret|og|tundra esports|tundra|xtreme gaming|xg|parivision|betboom team|bb|dplus|dk|kt rolls?ter|kt|leviatan|lev|kru esports|kru|loud|mibr|evil geniuses|eg)$/i;
function bigness(t) { const n = String(t.name || ''), a = String(t.acronym || ''); return BIG_FR.test(n) || BIG_FR.test(a) ? 2 : (BIG_INT.test(n) || BIG_INT.test(a) ? 1 : 0); }

function pick(m) {
  const o = (m.opponents || []).map((x) => x.opponent).filter(Boolean);
  if (o.length < 2) return null;
  const game = GAME[m.videogame && m.videogame.slug];
  if (!game) return null;
  const score = (id) => { const r = (m.results || []).find((x) => x.team_id === id); return r ? r.score : 0; };
  const stream = (m.streams_list || []).find((s) => s.main && s.raw_url) || (m.streams_list || []).find((s) => s.official && s.raw_url) || (m.streams_list || [])[0];
  const tier = (m.tournament && m.tournament.tier) || 'b';
  const league = (m.league && m.league.name) || '';
  const serie = (m.serie && (m.serie.full_name || m.serie.name)) || '';
  const fr = FRL.test(league + ' ' + serie);
  const a = o[0], b = o[1];
  const ba = bigness(a), bb = bigness(b), big = Math.max(ba, bb);
  const imp = (GW[game] || 0) + (TW[tier] || 5) + (fr ? 40 : 0) + (big === 2 ? 90 : big === 1 ? 45 : 0) + (ba && bb ? 30 : 0);
  const k = tier === 's' || tier === 'a' || fr || big > 0 ? 1 : 0;
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
  if (CACHE.body && now - CACHE.at < 120000) {
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(CACHE.body);
    return;
  }

  try {
    const [running, upcoming, past, upcoming2] = await Promise.all([
      fetchList('/matches/running?per_page=50', token),
      fetchList('/matches/upcoming?sort=begin_at&per_page=100&page=1', token),
      fetchList('/matches/past?sort=-begin_at&per_page=100', token),
      fetchList('/matches/upcoming?sort=begin_at&per_page=100&page=2', token).catch(() => [])
    ]);

    const seen = new Set();
    const take = (arr) => (arr || []).map(pick).filter((x) => x && !seen.has(x.id) && seen.add(x.id));

    let live = take(running).filter((m) => m.status === 'running');
    let next = take((upcoming || []).concat(upcoming2 || [])).filter((m) => m.status === 'not_started');
    let recent = take(past).filter((m) => m.status === 'finished' && (m.sa || m.sb));

    live.sort((a, b) => b.imp - a.imp);
    next.sort((a, b) => a.ts - b.ts);
    recent.sort((a, b) => b.ts - a.ts);

    // Tri : on garde d'abord ce qui compte (tier S/A, scène FR, grosses orgs), puis un peu de mineur pour ne jamais être vide.
    const imp = (arr, n) => { const k = arr.filter((m) => m.k), o = arr.filter((m) => !m.k); return k.concat(o).slice(0, n); };
    live.sort((a, b) => (b.k - a.k) || (b.imp - a.imp));
    const matches = live.concat(imp(next, 60)).slice(0, 80);
    recent = imp(recent, 20).sort((a, b) => (b.k - a.k) || (b.ts - a.ts));

    const body = { updated: now, matches, recent };
    CACHE = { at: now, body };
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(body);
  } catch (e) {
    if (CACHE.body) { res.status(200).json(CACHE.body); return; }
    res.status(502).json({ error: 'fetch_failed', detail: String(e.message || e), matches: [], recent: [] });
  }
};
