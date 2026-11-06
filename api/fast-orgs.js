// Lightweight Atlas catalog from recent major matches (not a complete org registry).
// Fast default replaces the legacy minute-long per-game crawler; legacy remains via ?full=1.
const BASE="https://api.pandascore.co";
const GAME={"league-of-legends":"lol","cs-go":"cs2","csgo":"cs2","counter-strike":"cs2","valorant":"val","rl":"rl","rocket-league":"rl","dota-2":"dota","dota2":"dota","r6-siege":"r6","rainbow-6-siege":"r6","ow":"ow","overwatch":"ow","codmw":"cod","call-of-duty":"cod","fifa":"fc","mobile-legends":"mlbb","mlbb":"mlbb","kog":"hok","starcraft-2":"sc"};
const MAJOR=/\b(worlds?|world championship|vct|champions|masters|lec|lck|lpl|msi|iem|blast|esl|major|rlcs|six invitational|ewc|esports world cup|the international|cdl|owcs|lfl)\b/i;
const FIX={karminecorp:"FR",vitality:"FR",gentlemates:"FR",fnatic:"GB",g2:"DE",mouz:"DE",solary:"FR"};
let cached={at:0,body:null};
const norm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"");
async function request(path,token){
 const r=await fetch(BASE+path,{headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(8000)});
 if(!r.ok)throw Error("pandascore "+r.status);
 const data=await r.json();
 return Array.isArray(data)?data:[];
}
function pickTeams(matches){
 const ids=new Map();
 for(const m of matches){
  const game=GAME[m.videogame?.slug];if(!game)continue;
  const names=[m.league?.name,m.serie?.name,m.tournament?.name].filter(Boolean).join(" ");
  const tier=m.tournament?.tier||m.serie?.tier;
  const major=tier==="s"||tier==="a"||MAJOR.test(names);
  if(!major)continue;
  for(const o of m.opponents||[]){
   const x=o?.opponent;if(!x?.id)continue;
   const key=String(x.id),data=ids.get(key)||{id:x.id,games:new Set(),importance:0};
   data.games.add(game);data.importance+=tier==="s"?5:tier==="a"?3:1;
   ids.set(key,data);
  }
 }
 return [...ids.values()].sort((a,b)=>b.importance-a.importance).slice(0,120);
}
module.exports=async(req,res,token)=>{
 res.setHeader("Cache-Control","public, s-maxage=900, stale-while-revalidate=3600");
 if(cached.body&&Date.now()-cached.at<900000)return res.status(200).json(cached.body);
 try{
  const paths=[
   "/matches/running?page[size]=100",
   "/matches/upcoming?sort=begin_at&page[size]=100",
   "/matches/past?sort=-begin_at&page[size]=100"
  ];
  const batches=await Promise.allSettled(paths.map(p=>request(p,token)));
  const matches=batches.flatMap(x=>x.status==="fulfilled"?x.value:[]);
  if(!matches.length)throw Error("matches_unavailable");
  const picks=pickTeams(matches);
  if(!picks.length)throw Error("no_major_teams");
  const chunks=[];for(let i=0;i<picks.length;i+=40)chunks.push(picks.slice(i,i+40));
  const settled=await Promise.allSettled(chunks.map(chunk=>request("/teams?filter[id]="+chunk.map(x=>x.id).join(",")+"&page[size]=100",token)));
  const teams=settled.flatMap(x=>x.status==="fulfilled"?x.value:[]);
  if(!teams.length)throw Error("teams_unavailable");
  const byId=new Map(picks.map(x=>[x.id,x]));
  const orgMap=new Map();
  for(const t of teams){
   const match=byId.get(t.id);if(!match)continue;
   const name=String(t.name||"").trim(),key=norm(name);if(!key)continue;
   const cc=(FIX[key]||t.location||"").toUpperCase();
   if(!/^[A-Z]{2}$/.test(cc))continue;
   let org=orgMap.get(key);
   if(!org){org={id:key,n:name,s:t.acronym||"",cc,lg:t.image_url||"",ld:t.dark_mode_image_url||"",g:{}};orgMap.set(key,org)}
   const players=(t.players||[]).filter(p=>p.active!==false).slice(0,18).map(p=>({id:p.id,n:p.name||"",r:p.role||"",cc:p.nationality||"",im:p.image_url||""}));
   for(const game of match.games)org.g[game]={pid:t.id,f:match.importance,pl:players};
  }
  const orgs=[...orgMap.values()].sort((a,b)=>Math.max(...Object.values(b.g).map(v=>v.f))-Math.max(...Object.values(a.g).map(v=>v.f)));
  if(!orgs.length)throw Error("no_located_teams");
  const now=Date.now();
  const body={updated:now,orgs,scope:"recent_major_matches",source:"PandaScore",partial:batches.some(x=>x.status==="rejected")||settled.some(x=>x.status==="rejected")};
  cached={at:now,body};return res.status(200).json(body);
 }catch(e){if(cached.body)return res.status(200).json({...cached.body,stale:true});
 return res.status(502).json({error:"catalog_unavailable",orgs:[],source:"PandaScore"})}
};
module.exports._test={pickTeams,norm};
