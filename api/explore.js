// Lobby Explore — recherche sur les ressources accessibles du forfait PandaScore.
// Aucune clé exposée au navigateur. Pas d'invention pour les catégories non couvertes.
const BASE = "https://api.pandascore.co";
const TYPES = {teams:"teams",players:"players",leagues:"leagues",tournaments:"tournaments",series:"series"};
const GAME = {"lol":"lol","cs2":"csgo","val":"valorant","rl":"rl","r6":"r6siege","dota":"dota2","ow":"ow","cod":"codmw","fc":"fifa","mlbb":"mlbb","hok":"kog","sc":"starcraft-2","apex":"apex","fn":"fortnite","pubg":"pubg","tft":"tft"};
const memory = new Map();
const TTL = 5 * 60 * 1000;

function string(v, n) { return String(Array.isArray(v) ? v[0] : (v || "")).trim().slice(0,n); }
function normalize(type, item) {
  const vg = item.videogame || {};
  return {
    id: item.id,
    type,
    name: item.name || item.full_name || item.slug || "",
    slug: item.slug || "",
    image: item.image_url || item.dark_mode_image_url || "",
    game: vg.name || vg.slug || "",
    gameSlug: vg.slug || "",
    country: item.location || item.nationality || "",
    acronym: item.acronym || "",
    team: item.current_team && item.current_team.name || "",
    begin: item.begin_at || item.scheduled_at || "",
    end: item.end_at || "",
    updated: item.modified_at || "",
    // Pour les fiches équipe : effectif exposé par PandaScore.
    players: type === "teams" ? (item.players || []).map(p => ({
      id:p.id, name:p.name || "", image:p.image_url || "", country:p.nationality || "",
      role:p.role || "", active:p.active !== false
    })).slice(0,60) : undefined
  };
}
async function remote(type, q, game, id, token) {
  const root = game && GAME[game] ? "/" + GAME[game] : "";
  const path = id ? "/" + type + "/" + id : root + "/" + type;
  const params = new URLSearchParams();
  if (!id) {
    params.set("page[size]", type === "players" ? "100" : type === "teams" ? "60" : "25");
    if (q) params.set("search[name]", q);
  }
  const r = await fetch(BASE + path + (params.toString() ? "?" + params.toString() : ""), {
    headers: {Authorization:"Bearer " + token, Accept:"application/json"},
    signal: AbortSignal.timeout(9500)
  });
  if (!r.ok) {
    const e = new Error("PandaScore " + r.status);
    e.status = r.status;
    throw e;
  }
  const raw = await r.json();
  return (Array.isArray(raw) ? raw : (raw ? [raw] : [])).map(item => normalize(type, item)).filter(item => item.id && item.name);
}
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const token = process.env.PANDASCORE_TOKEN;
  if (!token) return res.status(503).json({error:"source_unconfigured", items:[], source:"PandaScore"});
  const type = string(req.query && req.query.type,20) || "all";
  const q = string(req.query && req.query.q,80);
  const game = string(req.query && req.query.game,12);
  const id = string(req.query && req.query.id,20);
  if (id && !/^\d+$/.test(id)) return res.status(400).json({error:"invalid_id"});
  if (id && type === "all") return res.status(400).json({error:"invalid_type"});
  if (!TYPES[type] && type !== "all") return res.status(400).json({error:"invalid_type", items:[]});
  if (!id && q.length < 2) return res.status(200).json({items:[],source:"PandaScore",message:"Saisis au moins deux caractères"});
  if (game && !GAME[game]) return res.status(400).json({error:"invalid_game"});
  const key = [type,q.toLowerCase(),game,id].join("|");
  const hit = memory.get(key);
  if (hit && Date.now() - hit.ts < TTL) {
    res.setHeader("Cache-Control","public, s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json(hit.data);
  }
  const groups = type === "all" ? ["teams","players","leagues","tournaments"] : [type];
  try {
    const settled = await Promise.allSettled(groups.map(t => remote(t,q,game,id,token)));
    const items = [];
    const unavailable = [];
    groups.forEach((t,i) => {
      if (settled[i].status === "fulfilled") items.push(...settled[i].value);
      else unavailable.push(t);
    });
    if (unavailable.length === groups.length) {
      const code = settled[0].reason && settled[0].reason.status;
      return res.status(code === 429 ? 429 : 502).json({
        error: code === 429 ? "rate_limited" : "source_unavailable",
        items:[], unavailable, source:"PandaScore"
      });
    }
    const norm = s => String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
    const needle=norm(q);
    const score = item => {
      const n=norm(item.name), slug=norm(item.slug), word=item.name.toLowerCase().split(/[\s_-]+/);
      let base = n === needle || slug === needle ? 10000 : n.startsWith(needle) ? 7500 : slug.startsWith(needle) ? 6800 : word.some(w=>w.startsWith(q.toLowerCase())) ? 4500 : n.includes(needle) ? 2600 : 0;
      base -= Math.min(500,Math.max(0,n.length-needle.length)*22);
      // Les joueurs avec pseudo pertinent sont prioritaires, mais jamais devant un nom exact d'un autre type.
      if(item.type==="players")base+=500;
      if(item.type==="players"&&item.team)base+=240;
      if(item.image)base+=100;
      if(item.type==="teams"&&item.players?.length)base+=65;
      return base;
    };
    items.sort((a,b)=>score(b)-score(a)||a.name.localeCompare(b.name));
    const data = {items:items.slice(0,72), unavailable, source:"PandaScore", updated:Date.now()};
    // Garde-fou mémoire (fonctions serverless chaudes seulement).
    if (memory.size > 150) memory.clear();
    memory.set(key,{ts:Date.now(),data});
    res.setHeader("Cache-Control","public, s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json(data);
  } catch(e) {
    return res.status(502).json({error:"source_unavailable",items:[],source:"PandaScore"});
  }
};
