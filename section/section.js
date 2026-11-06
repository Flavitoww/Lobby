(()=>{"use strict";
const $=s=>document.querySelector(s);
const path=location.pathname.split("/").filter(Boolean)[0]||"matches",kind=["matches","news","streams"].includes(path)?path:"matches";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const valid=u=>{try{const x=new URL(u);return x.protocol==="https:"?x.href:""}catch{return""}};
const date=t=>{const d=new Date(t);return isNaN(d)?"Date indisponible":d.toLocaleString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})};
const games={lol:"League of Legends",val:"VALORANT",cs2:"Counter-Strike",rl:"Rocket League",r6:"Rainbow Six",ow:"Overwatch",cod:"Call of Duty",dota:"Dota 2",hok:"Honor of Kings",mlbb:"Mobile Legends"};
const params=new URLSearchParams(location.search);
const filters=kind==="matches"?{major:"À la une",live:"En direct",upcoming:"À venir",results:"Résultats",all:"Toutes divisions"}:kind==="news"?{all:"Essentiel",lol:"League of Legends",val:"VALORANT",cs2:"CS2",business:"Business & transferts",recent:"Plus récentes"}:{esport:"Esport en direct",all:"Toutes les chaînes",offline:"Chaînes suivies"};
let choice=params.get("view")||Object.keys(filters)[0],data=null;
if(!filters[choice])choice=Object.keys(filters)[0];
function setFilters(){
 $("#sectionFilters").innerHTML=Object.entries(filters).map(([k,v])=>'<button type="button" data-filter="'+esc(k)+'" class="'+(k===choice?"active":"")+'">'+esc(v)+'</button>').join("");
 $("#sectionFilters").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{choice=b.dataset.filter;history.replaceState(null,"","?view="+encodeURIComponent(choice));setFilters();render()}));
}
const isMajor=m=>{
 const comp=[m.comp,m.serie,m.tournament].filter(Boolean).join(" ");
 return (m.tier==="s"||m.tier==="a"||/\b(LEC|LCK|LPL|MSI|Worlds|World Championship|First Stand|VCT|Champions Tour|Masters|IEM|BLAST|ESL Pro League|PGL|RLCS|Six Invitational|EWC|The International|CDL|OWCS)\b/i.test(comp))&&!/\b(academy|amateur|open qualifier|spike series|tier 3)\b/i.test(comp);
};
const important=m=>Number(m.tier==="s")*1100+Number(m.tier==="a")*650+(m.imp||0)+Number(/\b(T1|KC|Karmine|G2|Vitality|Fnatic|NAVI|FaZe|Gen\.?G|Sentinels)\b/i.test([m.an,m.bn].join(" ")))*350;
function matchCard(m,feature=false){
 const live=m.status==="running",when=live?'<span class="badge-live-text">● LIVE</span>':esc(date(m.ts));
 const url=valid(m.watch),left=valid(m.al),right=valid(m.bl);
 const teamLogo=u=>u?'<img class="match-team-logo" src="'+esc(u)+'" loading="lazy" alt="">':'';
 return '<article class="section-item'+(feature?" match-feature":"")+'"><div class="eyebrow">'+esc(games[m.game]||m.game)+" · "+esc(m.comp||m.serie||"Compétition")+'</div><div class="versus"><span class="match-team">'+teamLogo(left)+esc(m.an||"À définir")+'</span><em>'+esc(live?m.sa+" : "+m.sb:"VS")+'</em><span class="match-team">'+teamLogo(right)+esc(m.bn||"À définir")+'</span></div><p>'+when+' · '+esc(m.tournament||m.serie||"Match esport")+'</p>'+(url?'<a class="card-link" target="_blank" rel="noopener noreferrer" href="'+esc(url)+'">Regarder le match ↗</a>':'<a class="card-link" href="/discover/?type=teams&q='+encodeURIComponent(m.an||"")+'">Explorer les équipes ↗</a>')+'</article>';
}
function renderMatches(){
 const arr=[...(data.matches||[]),...(data.recent||[])],now=Date.now();
 let filtered=arr.filter(m=>{
  if(choice==="live")return m.status==="running";
  if(choice==="upcoming")return m.status==="not_started"&&m.ts>=now-3600000;
  if(choice==="results")return m.status==="finished";
  if(choice==="major")return isMajor(m)&&m.status!=="finished";
  return true;
 });
 if(params.get("q")){const q=params.get("q").toLowerCase();filtered=filtered.filter(m=>(m.an+" "+m.bn+" "+m.comp).toLowerCase().includes(q))}
 filtered.sort((a,b)=>choice==="results"?b.ts-a.ts:choice==="upcoming"?a.ts-b.ts:important(b)-important(a)||a.ts-b.ts);
 const target=$("#sectionResults");
 target.innerHTML=filtered.length?filtered.slice(0,90).map((m,i)=>matchCard(m,i===0&&choice==="major")).join(""):'<p class="section-item">Aucun match confirmé disponible pour ce filtre. Choisis « Toutes divisions » pour élargir.</p>';
 $("#sectionUpdated").textContent=filtered.length+" matchs · PandaScore · "+date(data.updated);
 $("#sectionSubheading").textContent=choice==="major"?"Les affiches prioritaires":filters[choice];
}
function newsCard(x){const u=valid(x.url);return '<article class="section-item"><div class="eyebrow">'+esc(x.category||"ESPORT")+'</div><h3>'+esc(x.title)+'</h3><p>'+esc(x.source)+' · '+esc(date(x.published))+'</p>'+(u?'<a class="card-link" href="'+esc(u)+'" rel="noopener noreferrer" target="_blank">Lire l’article original ↗</a>':"")+'</article>'}
function renderNews(){
 const base=[...(data.items||[])];let arr=base;
 if(choice==="lol")arr=base.filter(x=>/league of legends|worlds?|lec|lck|karmine|t1|lol/i.test(x.title));
 if(choice==="val")arr=base.filter(x=>/valorant|vct/i.test(x.title));
 if(choice==="cs2")arr=base.filter(x=>/cs2|counter.strike|iem|blast/i.test(x.title));
 if(choice==="business")arr=base.filter(x=>/sponsor|partenariat|partnership|mercato|transfert|transfer|signing|recruit/i.test(x.title));
 if(choice==="recent")arr.sort((a,b)=>Date.parse(b.published)-Date.parse(a.published));
 $("#sectionResults").innerHTML=arr.length?arr.map(newsCard).join(""):'<p class="section-item">Aucune actualité récente vérifiée pour ce filtre.</p>';
 $("#sectionUpdated").textContent=arr.length+" articles · dernières publications disponibles";
 $("#sectionSubheading").textContent=filters[choice];
}
function renderStreams(){
 const verified=data.verified===true,arr=(data.items||[]).filter(c=>choice==="all"||choice==="offline"?!false:!!(c.live&&c.esport));
 const list=choice==="all"?data.items||[]:choice==="offline"?(data.items||[]):arr;
 $("#sectionResults").innerHTML=list.length?list.map(c=>{
  const live=verified&&c.live===true,focus=live&&c.esport===true;
  const state=verified?(live?focus?"LIVE · CAST ESPORT":"En direct · autre contenu":"Hors ligne"):"Statut non vérifié";
  const th=focus?valid(c.thumbnail):"";
  return '<article class="section-item stream"><div class="stream-portrait"><span class="stream-avatar">'+esc(c.name.slice(0,2).toUpperCase())+'</span><div><h3>'+esc(c.name)+'</h3><div class="status">'+esc(state)+'</div></div></div>'+(th?'<img class="stream-preview" src="'+esc(th)+'" loading="lazy" alt="Aperçu du stream">':"")+(c.title&&live?'<p>'+esc(c.title)+'</p>':"")+(live?'<p>'+Number(c.viewers||0).toLocaleString("fr-FR")+' spectateurs · '+esc(c.game||"Twitch")+'</p>':"")+'<a class="card-link" href="'+esc(valid(c.url))+'" target="_blank" rel="noopener noreferrer">Voir la chaîne Twitch ↗</a></article>';
 }).join(""):'<p class="section-item">Aucun stream esport vérifié en direct actuellement.</p>';
 $("#sectionUpdated").textContent=verified?"Statuts vérifiés via Twitch Helix · "+date(data.updated):"Statuts LIVE non disponibles · authentification Twitch nécessaire";
 $("#sectionSubheading").textContent=choice==="esport"?"Diffusions esport en cours":filters[choice];
 $("#sectionDisclaimer").textContent=verified?"Le classement LIVE privilégie les titres et catégories liés aux matchs esport ; certains streams peuvent être mal classés.":"Les chaînes restent accessibles, mais aucune indication LIVE n'est affichée sans authentification officielle.";
}
function render(){if(!data)return;if(kind==="matches")renderMatches();else if(kind==="news")renderNews();else renderStreams();}
async function load(){
 try{const endpoint=kind==="matches"?"/api/live":kind==="news"?"/api/news":"/api/twitch";const r=await fetch(endpoint);if(!r.ok)throw Error("unavailable");data=await r.json();render()}
 catch(e){$("#sectionResults").innerHTML='<p class="section-item">Source temporairement indisponible. Les résultats ne peuvent pas être vérifiés.</p>';$("#sectionUpdated").textContent="Données indisponibles"}
}
const theme=(()=>{try{return localStorage.getItem("lobby-theme")}catch{return null}})();if(theme==="light")document.body.dataset.theme="light";
setFilters();load();
})();