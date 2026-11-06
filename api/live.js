// Matchs en direct, a venir et recents, via PandaScore.
// Couverture des matches sur plusieurs pages. Cache 5 min pour proteger les quotas PandaScore.
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
// Les niveaux de compétition remontent tels quels : la sélection T1 se fait dans le Desk.


function pick(m) {
  const o = (m.opponents || []).map((x) => x.opponent).filter(Boolean);
  // Conserver les affiches dont les adversaires ne sont pas encore annoncés.
  const game = GAME[m.videogame && m.videogame.slug];
  if (!game) return null;
  const score = (id) => { const r = (m.results || []).find((x) => x.team_id === id); return r ? r.score : 0; };
  const stream = (m.streams_list || []).find((s) => s.main && s.raw_url) || (m.streams_list || []).find((s) => s.official && s.raw_url) || (m.streams_list || [])[0];
  const tier = (m.tournament && m.tournament.tier) || (m.serie && m.serie.tier) || null;
  const tournament = (m.tournament && m.tournament.name) || '';
  const league = (m.league && m.league.name) || '';
  const serie = (m.serie && (m.serie.full_name || m.serie.name)) || '';
  const fr = FRL.test(league + ' ' + serie);
  const imp = (GW[game] || 0) + (TW[tier] || 5) + (fr ? 40 : 0);
  const a = o[0] || {id:-1,name:'À définir',acronym:'TBD'}; const b = o[1] || {id:-2,name:'À définir',acronym:'TBD'};
  const short = (t) => (t.acronym || t.name || '?').toString();
  const ts = Date.parse(m.begin_at || m.scheduled_at || m.modified_at || 0) || 0;
  return {
    imp, tier, id: m.id, status: m.status, ts, game,
    comp: league, serie, tournament,
    leagueId: m.league?.id || null,
    tournamentId: m.tournament?.id || null,
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
  if (CACHE.body && now - CACHE.at < 300000) {
    res.setHeader('Cache-Control', 'public, s-maxage=180, stale-while-revalidate=600');
    res.status(200).json(CACHE.body);
    return;
  }

  try {
    const base = [
      '/matches/running?page[size]=100',
      '/matches/upcoming?sort=begin_at&page[size]=100&page[number]=1',
      '/matches/upcoming?sort=begin_at&page[size]=100&page[number]=2',
      '/matches/upcoming?sort=begin_at&page[size]=100&page[number]=3',
      '/lol/matches/upcoming?sort=begin_at&page[size]=100',
      '/lol/matches/running?page[size]=100',
      '/matches/past?sort=-begin_at&page[size]=100&page[number]=1',
      '/matches/past?sort=-begin_at&page[size]=100&page[number]=2'
    ];
    // Les pages secondaires peuvent échouer sans casser toute la page.
    const batches = await Promise.allSettled(base.map(path=>fetchList(path,token)));
    const ready = idx => batches[idx].status === 'fulfilled' ? batches[idx].value : [];
    const running=ready(0).concat(ready(5));
    const upcoming=ready(1).concat(ready(2),ready(3),ready(4));
    const past=ready(6).concat(ready(7));
    if(batches.every(b=>b.status!=='fulfilled'))throw Error("all sources unavailable");

    const seen = new Set();
    const take = (arr) => (arr || []).map(pick).filter((x) => x && !seen.has(x.id) && seen.add(x.id));

    let live = take(running).filter((m) => m.status === 'running');
    let next = take(upcoming).filter((m) => m.status === 'not_started');
    let recent = take(past).filter((m) => m.status === 'finished');

    live.sort((a, b) => b.imp - a.imp);
    next.sort((a, b) => a.ts - b.ts);
    recent.sort((a, b) => b.ts - a.ts);

    const matches = live.concat(next);
    // Les résultats complets de la première page de l'API sont conservés.

    const body = { updated: now, matches, recent, source: 'PandaScore', meta: {running:live.length,upcoming:next.length,recent:recent.length,perPage:100,moreAvailable:true,pages:{upcoming:4,past:2},featuredGame:"lol",partial:batches.some(b=>b.status!=="fulfilled")} };
    CACHE = { at: now, body };
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.status(200).json(body);
  } catch (e) {
    if (CACHE.body) { res.setHeader('X-Lobby-Stale','1');res.status(200).json({...CACHE.body,stale:true}); return; }
    res.status(502).json({ error: 'fetch_failed', detail: String(e.message || e), matches: [], recent: [] });
  }
};
