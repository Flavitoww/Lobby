// Actualités esports : titres, dates et liens uniquement, sans reproduction d'articles.
// Google News RSS est une source publique non officielle : disponibilité non garantie.
let cache={at:0,items:[]};
const URL="https://news.google.com/rss/search?q="+encodeURIComponent('("esport" OR "esports" OR "League of Legends" OR "VALORANT" OR "Counter-Strike") when:7d')+"&hl=fr&gl=FR&ceid=FR:fr";
function decode(s){
 return String(s||"").replace(/^<!\[CDATA\[|\]\]>$/g,"").replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)))
 .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n))
 .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").trim();
}
const tag=(xml,name)=>{const m=xml.match(new RegExp("<"+name+"(?:\\s[^>]*)?>([\\s\\S]*?)<\\/"+name+">","i"));return m?decode(m[1]):""};
module.exports=async(req,res)=>{
 res.setHeader("Access-Control-Allow-Origin","*");
 res.setHeader("Cache-Control","public, s-maxage=900, stale-while-revalidate=3600");
 if(Date.now()-cache.at<900000)return res.status(200).json({items:cache.items,source:"Google Actualités RSS",updated:cache.at});
 try{
  const r=await fetch(URL,{headers:{"User-Agent":"LobbyNews/1.0 (esports headlines reader)","Accept":"application/rss+xml,application/xml,text/xml"},signal:AbortSignal.timeout(9000)});
  if(!r.ok)throw Error("rss "+r.status);
  const xml=(await r.text()).slice(0,1200000);
  const entries=xml.match(/<item(?:\s[^>]*)?>[\s\S]*?<\/item>/gi)||[];
  const items=entries.slice(0,35).map(it=>({
   title:tag(it,"title").slice(0,220),url:tag(it,"link"),source:tag(it,"source").slice(0,80)||"Google Actualités",
   published:Number.isFinite(Date.parse(tag(it,"pubDate")))?new Date(tag(it,"pubDate")).toISOString():null
  })).filter(x=>x.title&&/^https:\/\/news\.google\.com\//.test(x.url)).slice(0,12);
  cache={at:Date.now(),items};
  return res.status(200).json({items,source:"Google Actualités RSS",updated:cache.at});
 }catch(e){
  if(cache.at)return res.status(200).json({items:cache.items,source:"Google Actualités RSS",updated:cache.at,stale:true});
  return res.status(502).json({error:"news_source_unavailable",items:[],source:"Google Actualités RSS"});
 }
};
