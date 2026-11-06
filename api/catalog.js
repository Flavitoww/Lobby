// Lobby catalog — paginated, source-grounded PandaScore exploration.
// No assumptions that any page is the full universe of esports entities.
const BASE="https://api.pandascore.co";
const TYPES={teams:"teams",players:"players",leagues:"leagues",tournaments:"tournaments",series:"series"};
const GAMES={all:"",lol:"lol",cs2:"csgo",val:"valorant",rl:"rl",dota:"dota2",r6:"r6siege",ow:"ow",cod:"codmw",mlbb:"mlbb",hok:"kog",fc:"fifa",sc:"starcraft-2",apex:"apex",fn:"fortnite",pubg:"pubg",tft:"tft"};
const memory=new Map();
const TTL=12*60*1000;
const text=(s,n=90)=>String(Array.isArray(s)?s[0]:(s||"")).trim().slice(0,n);
function normalized(type,x){
 const vg=x.videogame||{};
 const common={id:x.id,type,name:x.name||x.full_name||x.slug||"",slug:x.slug||"",image:x.image_url||x.dark_mode_image_url||"",game:vg.name||"",gameSlug:vg.slug||"",country:x.location||x.nationality||"",acronym:x.acronym||"",begin:x.begin_at||"",end:x.end_at||"",tier:x.tier||"",modified:x.modified_at||""};
 if(type==="teams")common.players=(x.players||[]).filter(p=>p.active!==false).slice(0,25).map(p=>({id:p.id,name:p.name||"",image:p.image_url||"",country:p.nationality||"",role:p.role||""}));
 if(type==="leagues"||type==="tournaments"||type==="series"){
   common.leagueId=x.league?.id||null;common.league=x.league?.name||"";
   common.serieId=x.serie?.id||null;common.serie=x.serie?.name||"";
 }
 return common;
}
function getParams(query){
 const type=text(query.type,16)||"teams";
 const game=text(query.game,12)||"all";
 const q=text(query.q,75);
 const country=text(query.country,2).toUpperCase();
 const page=Math.min(60,Math.max(1,Number(query.page)||1));
 const size=Math.min(100,Math.max(20,Number(query.size)||100));
 return {type,game,q,country,page,size};
}
async function request(type,game,q,country,page,size,token,withCountry){
 const url=new URL(BASE+(game!=="all"?"/"+GAMES[game]:"")+"/"+type);
 url.searchParams.set("page[number]",String(page));
 url.searchParams.set("page[size]",String(size));
 if(q)url.searchParams.set("search[name]",q);
 if(country&&type==="teams"&&withCountry)url.searchParams.set("filter[location]",country);
 const r=await fetch(url,{headers:{Authorization:"Bearer "+token,Accept:"application/json"},signal:AbortSignal.timeout(11000)});
 if(!r.ok){const e=new Error("PandaScore "+r.status);e.status=r.status;throw e}
 const raw=await r.json();if(!Array.isArray(raw))throw new Error("invalid_catalog");
 return raw;
}
module.exports=async(req,res)=>{
 res.setHeader("Cache-Control","public, s-maxage=360, stale-while-revalidate=1200");
 const token=process.env.PANDASCORE_TOKEN;
 if(!token)return res.status(503).json({error:"source_unconfigured",items:[],source:"PandaScore"});
 const {type,game,q,country,page,size}=getParams(req.query||{});
 if(!TYPES[type]||!Object.prototype.hasOwnProperty.call(GAMES,game))return res.status(400).json({error:"invalid_catalog_filter",items:[]});
 if(country&&!/^[A-Z]{2}$/.test(country))return res.status(400).json({error:"invalid_country",items:[]});
 const key=[type,game,q.toLowerCase(),country,page,size].join("|");
 const now=Date.now(),hit=memory.get(key);
 if(hit&&now-hit.at<TTL)return res.status(200).json(hit.body);
 try{
  let list,filterMode=country?"remote":"none",partial=false;
  try{list=await request(type,game,q,country,page,size,token,true)}
  catch(e){
   // Some PandaScore plans/game endpoints do not accept location filtering.
   // Never pass a locally filtered page off as the full country's results.
   if(country&&type==="teams"&&(e.status===400||e.status===422)){
    list=await request(type,game,q,"",page,size,token,false);
    filterMode="local_partial";partial=true;
   }else throw e;
  }
  const rawCount=list.length;
  if(country&&type==="teams")list=list.filter(x=>String(x.location||"").toUpperCase()===country);
  const items=list.map(x=>normalized(type,x)).filter(x=>x.id&&x.name);
  const body={
   items,page,size,hasMore:rawCount===size,partial,filterMode,
   source:"PandaScore",type,game,country:country||null,updated:now,
   coverage:"Pagination de la source; nombre total inconnu. Équipes sans pays référencé exclues."
  };
  if(memory.size>180)memory.delete(memory.keys().next().value);
  memory.set(key,{at:now,body});
  return res.status(200).json(body);
 }catch(e){
  const status=e.status===429?429:e.status===403?403:502;
  return res.status(status).json({error:status===429?"rate_limited":status===403?"game_not_covered":"catalog_unavailable",source:"PandaScore",items:[],type,game,page});
 }
};
module.exports._test={normalized,getParams};
