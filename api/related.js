// Cross-linked profile data from PandaScore (no invented team history/rosters).
const BASE="https://api.pandascore.co";
const TYPES={teams:{matches:"matches",related:"tournaments"},
 players:{matches:"matches",related:"tournaments"},
 leagues:{matches:"matches",related:"tournaments"},
 tournaments:{matches:"matches",related:"rosters"}};
const memory=new Map(),TTL=7*60*1000;
async function get(path,token){
 const r=await fetch(BASE+path,{headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(10500)});
 if(!r.ok){const e=new Error("pandascore "+r.status);e.status=r.status;throw e}
 const j=await r.json();return Array.isArray(j)?j:[];
}
function match(m){
 const a=m.opponents?.[0]?.opponent||{},b=m.opponents?.[1]?.opponent||{};
 const scores=new Map((m.results||[]).map(r=>[r.team_id,r.score]));
 return {id:m.id,an:a.name||"À définir",bn:b.name||"À définir",al:a.image_url||"",bl:b.image_url||"",
  aId:a.id||null,bId:b.id||null,status:m.status||"",start:m.begin_at||m.scheduled_at||"",
  scoreA:scores.get(a.id)??null,scoreB:scores.get(b.id)??null,
  league:m.league?.name||"",leagueId:m.league?.id||null,
  tournament:m.tournament?.name||"",tournamentId:m.tournament?.id||null,
  game:m.videogame?.name||"",gameSlug:m.videogame?.slug||"",
  watch:m.streams_list?.find?.(s=>s.raw_url)?.raw_url||m.official_stream_url||""};
}
function competition(x){return {id:x.id,name:x.name||"",image:x.image_url||"",tier:x.tier||"",start:x.begin_at||"",end:x.end_at||"",
 league:x.league?.name||"",leagueId:x.league?.id||null,game:x.videogame?.name||""}}
module.exports=async(req,res)=>{
 res.setHeader("Cache-Control","public, s-maxage=240, stale-while-revalidate=600");
 const type=String(req.query?.type||""),id=String(req.query?.id||"");
 if(!TYPES[type]||!/^\d{1,12}$/.test(id))return res.status(400).json({error:"invalid_type_or_id"});
 const token=process.env.PANDASCORE_TOKEN;
 if(!token)return res.status(503).json({error:"source_unconfigured"});
 const key=type+":"+id,now=Date.now(),cached=memory.get(key);
 if(cached&&now-cached.updated<TTL)return res.status(200).json(cached);
 const routes=[
  "/"+type+"/"+id+"/matches?page[size]=45",
  "/"+type+"/"+id+"/"+TYPES[type].related+"?page[size]=36"
 ];
 const list=await Promise.allSettled(routes.map(x=>get(x,token)));
 if(list.every(x=>x.status==="rejected"))return res.status(502).json({error:"profile_relations_unavailable",matches:[],competitions:[],partial:true});
 const matches=list[0].status==="fulfilled"?list[0].value.map(match):[];
 matches.sort((a,b)=>Date.parse(b.start||0)-Date.parse(a.start||0));
 let competitions=list[1].status==="fulfilled"&&type!=="tournaments"?list[1].value.map(competition):[];
 if(type==="tournaments"&&matches.length){
  const map=new Map();matches.forEach(m=>{if(m.tournamentId)map.set(m.tournamentId,{id:m.tournamentId,name:m.tournament,league:m.league})});
  competitions=[...map.values()];
 }
 const result={type,id,matches:matches.slice(0,45),competitions:competitions.slice(0,36),
  updated:now,partial:list.some(x=>x.status==="rejected"),source:"PandaScore"};
 if(memory.size>120)memory.delete(memory.keys().next().value);
 memory.set(key,result);
 return res.status(200).json(result);
};
module.exports._test={match,competition};
