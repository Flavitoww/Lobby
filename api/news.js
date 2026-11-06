// Lobby News — actualités esport vérifiables, fraîches et classées.
// Expose titres, sources, dates et URL uniquement. Aucun article recopié.
// Les liens RSS et Google News sont des sources externes dont la disponibilité peut varier.
const cache={at:0,items:[]};
const TTL=5*60*1000;
const DAY=86400000;
const queries=[
 {source:"Esports Insider",url:"https://esportsinsider.com/feed/",weight:35},
 {source:"Presse esport FR",url:"https://news.google.com/rss/search?q="+encodeURIComponent("(site:team-aaa.com OR site:lequipe.fr/esport OR site:sheepesports.com) (Worlds OR LoL OR VCT OR CS2 OR esport OR Karmine) when:3d")+"&hl=fr&gl=FR&ceid=FR:fr",weight:22},
 {source:"Worlds et grandes ligues",url:"https://news.google.com/rss/search?q="+encodeURIComponent("(Worlds 2026 OR KC T1 OR Karmine Corp T1 OR LEC OR VCT Champions OR IEM) when:2d")+"&hl=fr&gl=FR&ceid=FR:fr",weight:25},
 {source:"Partenariats esport",url:"https://news.google.com/rss/search?q="+encodeURIComponent("(esports partnership OR esport sponsor OR transfert esport OR mercato LoL) when:3d")+"&hl=fr&gl=FR&ceid=FR:fr",weight:9}
];
const decode=s=>String(s||"").replace(/^<!\[CDATA\[|\]\]>$/g,"").replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16))).replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").trim();
const tag=(s,name)=>{const m=s.match(new RegExp("<"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/"+name+">","i"));return decode(m?.[1]||"")};
const clean=s=>decode(s).replace(/<[^>]*>/g,"").trim().slice(0,230);
const https=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}};
const important=/\b(worlds?|champions?|finale|quarterfinals?|demi-finale|playoffs?|masters?|major|t1|karmine|kameto|faker|g2|vitality|fnatic|sentinels|navi|world championship|msi|lec|lck|lfl)\b/i;
const current=/\b(karmine|kc\b|t1\b|worlds?|league of legends|lol|valorant|vct|cs2|counter.strike|rocket league|rlcs|blast|iem|lck|lec|six major|esport|esports)\b/i;
const business=/\b(sponsoring|sponsor|partenariat|partnership|mercato|transfert|transfer|recrutement|signing|joins|deal)\b/i;
function score(item,now){
 const age=Math.max(0,(now-Date.parse(item.published))/3600000);
 const title=item.title;
 const recency=Math.max(0,100-age*1.6);
 const feature=/\b(karmine\s*corp|karmine|kc\b).*\bt1\b|\bt1\b.*\b(kc\b|karmine)/i.test(title)?125:0;
 return recency+item.weight+(important.test(title)?40:0)+(current.test(title)?20:0)+(business.test(title)?12:0)+feature;
}
function parse(xml,src,now){
 const blocks=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[];
 return blocks.slice(0,50).map(block=>{
  const title=clean(tag(block,"title"));const url=https(tag(block,"link"));
  const date=Date.parse(tag(block,"pubDate")||tag(block,"published"));
  const publisher=clean(tag(block,"source"))||src.source;
  return {title,url,source:publisher,published:Number.isFinite(date)?new Date(date).toISOString():null,weight:src.weight};
 }).filter(i=>i.title&&i.url&&i.published&&now-Date.parse(i.published)<=4*DAY&&Date.parse(i.published)<=now+3600000);
}
function categorize(title){
 if(business.test(title))return "BUSINESS / MERCATO";
 if(/worlds?|league of legends|\blec\b|\blck\b|\blfl\b/i.test(title))return "LEAGUE OF LEGENDS";
 if(/valorant|\bvct\b/i.test(title))return "VALORANT";
 if(/\bcs2\b|counter.strike|\biem\b|\bblast\b/i.test(title))return "COUNTER-STRIKE";
 if(/rocket league|\brlcs\b/i.test(title))return "ROCKET LEAGUE";
 return "ESPORT";
}
async function readFeed(f,now){
 const r=await fetch(f.url,{signal:AbortSignal.timeout(8000),headers:{"User-Agent":"LobbyEsportsNews/2.0","Accept":"application/rss+xml,application/xml,text/xml"}});
 if(!r.ok)throw Error("rss "+r.status);
 return parse((await r.text()).slice(0,900000),f,now);
}
async function update(now){
 const results=await Promise.allSettled(queries.map(f=>readFeed(f,now)));
 const items=results.flatMap(r=>r.status==="fulfilled"?r.value:[]);
 if(!items.length)throw Error("no_feeds");
 const seen=new Set();
 const unique=items.filter(item=>{
  const key=item.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/g,"").slice(0,110);
  if(seen.has(key))return false;seen.add(key);return true;
 });
 unique.forEach(item=>{item.priority=score(item,now);item.category=categorize(item.title);delete item.weight});
 unique.sort((a,b)=>b.priority-a.priority||Date.parse(b.published)-Date.parse(a.published));
 return {items:unique.slice(0,20),partial:results.some(r=>r.status==="rejected")};
}
module.exports=async(req,res)=>{
 res.setHeader("Cache-Control","public, s-maxage=180, stale-while-revalidate=600");
 const now=Date.now();
 if(cache.items.length&&now-cache.at<TTL)return res.status(200).json({items:cache.items,updated:cache.at,source:"Médias esport spécialisés",stale:false});
 try{
  const d=await update(now);
  cache.at=now;cache.items=d.items;
  return res.status(200).json({...d,updated:now,source:"Médias esport spécialisés"});
 }catch(e){
  if(cache.items.length)return res.status(200).json({items:cache.items,stale:true,updated:cache.at,source:"Médias esport spécialisés"});
  return res.status(503).json({items:[],error:"news_sources_unavailable",source:"Médias esport spécialisés"});
 }
};
module.exports._test={parse,score,categorize};
