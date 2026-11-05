(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const embedded=document.documentElement.classList.contains("embedded");
const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"");
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const safeImage=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}};
const names=new Intl.DisplayNames(["fr"],{type:"region"});
const english=new Intl.DisplayNames(["en"],{type:"region"});
const aliases={unitedstatesofamerica:"US",russianfederation:"RU",russia:"RU",southkorea:"KR",republicofkorea:"KR",northkorea:"KP",czechrepublic:"CZ",czechia:"CZ",unitedkingdom:"GB",turkey:"TR",turkiye:"TR",taiwan:"TW",vietnam:"VN",ivorycoast:"CI",cotedivoire:"CI"};
const countryIndex=(()=>{const out=new Map();for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){const cc=String.fromCharCode(a,b),en=english.of(cc),fr=names.of(cc);if(en&&en!==cc)out.set(norm(en),cc);if(fr&&fr!==cc)out.set(norm(fr),cc)}return out})();
const resolveCountry=name=>{const n=norm(name);return aliases[n]||countryIndex.get(n)||null;};
function geoCenter(feature){
 const geo=feature?.geometry;if(!geo)return null;
 const rings=geo.type==="MultiPolygon"?geo.coordinates.map(p=>p[0]):geo.type==="Polygon"?[geo.coordinates[0]]:[];
 const ring=rings.filter(Array.isArray).sort((a,b)=>b.length-a.length)[0];if(!ring?.length)return null;
 const lat=ring.reduce((v,p)=>v+p[1],0)/ring.length;
 const longs=ring.map(p=>p[0]);const crosses=Math.max(...longs)-Math.min(...longs)>180;
 const shifted=longs.map(x=>crosses&&x<0?x+360:x),lng=shifted.reduce((v,x)=>v+x,0)/shifted.length;
 return [Math.max(-83,Math.min(83,lat)),lng>180?lng-360:lng];
}
const coords={FR:[46.6,2.3],DE:[51.2,10.4],GB:[54,-2],US:[38,-98],CA:[57,-104],BR:[-11,-52],KR:[36.5,127.8],CN:[35,104],JP:[36,138],ES:[40,-4],SE:[62,15],DK:[56,10],PL:[52,19],UA:[49,32],SA:[24,45],AE:[24,54],AU:[-25,134],IN:[21,79],ID:[-3,118],TR:[39,35],NL:[52,5],BE:[51,4],IT:[42,12],PT:[39,-8],NO:[62,10],FI:[64,26],CH:[47,8],AT:[48,14],CZ:[50,15],RO:[46,25],RS:[44,21],HR:[45,16],GR:[39,22],SG:[1.3,104],MY:[4,102],PH:[13,122],TH:[15,101],VN:[16,108],TW:[24,121],HK:[22,114],MX:[24,-102],AR:[-36,-64],CL:[-33,-71],PE:[-10,-76],CO:[4,-74],ZA:[-29,25],EG:[26,30],MA:[32,-6],TN:[34,10],IL:[31,35],KZ:[48,68],RU:[61,105],NZ:[-41,174]};
const state={globe:null,orgs:[],country:null,org:null,layer:"teams",tab:"overview",expanded:!embedded,ready:false,liveMatches:[],liveByCountry:new Map()};
let lastFocus=null,queuedSearch="";
const flag=cc=>{if(!/^[A-Z]{2}$/.test(cc||""))return"◎";return String.fromCodePoint(...[...cc].map(c=>127397+c.charCodeAt(0)))};
const countryName=cc=>names.of(cc)||cc;
const ctrl=()=>state.globe?.controls?.();
const duration=()=>matchMedia("(prefers-reduced-motion: reduce)").matches?0:1150;
function fly(lat,lng,alt=.7){state.globe?.pointOfView({lat,lng,altitude:alt},duration())}
function home(){state.country=null;state.org=null;state.tab="overview";renderPanel();fly(28,15,2.15)}
const safeUrl=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}};
function associateMatches(){
 const byName=new Map();
 state.orgs.forEach(o=>{
  const base=norm(o.n);
  if(base.length>2)byName.set(base,o.cc);
  if(o.s&&norm(o.s).length>3)byName.set(norm(o.s),o.cc);
 });
 const byCountry=new Map();
 for(const m of state.liveMatches){
  const cc=new Set([m.an,m.bn].map(n=>byName.get(norm(n))).filter(Boolean));
  for(const code of cc){if(!byCountry.has(code))byCountry.set(code,[]);byCountry.get(code).push(m)}
 }
 state.liveByCountry=byCountry;
 const count=[...byCountry.values()].reduce((n,v)=>n+v.length,0);
 $("#worldLive").textContent=new Set([...byCountry.values()].flat().map(m=>m.id)).size;
 $("#mapLiveCount").textContent=[...new Set([...byCountry.values()].flat().map(m=>m.id))].length;
 $("#countryLiveCount").textContent=state.country?(byCountry.get(state.country)||[]).length:state.liveMatches.length;
 updatePoints();
 renderPanel();
}
function matchCard(m){
 const game=({lol:"League of Legends",val:"VALORANT",cs2:"Counter-Strike 2",rl:"Rocket League",dota:"Dota 2",ow:"Overwatch",r6:"Rainbow Six",cod:"Call of Duty",hok:"Honor of Kings",mlbb:"Mobile Legends"})[m.game]||m.game||"Esport";
 const url=safeUrl(m.watch);
 return '<article class="match-mini"><div class="match-mini-meta"><span class="match-mini-live">● LIVE</span> · '+esc(game)+' · '+esc(m.comp||"Compétition")+'</div><div class="match-mini-line"><span>'+esc(m.as||m.an||"À définir")+'</span><strong>'+esc(m.sa)+' — '+esc(m.sb)+'</strong><span>'+esc(m.bs||m.bn||"À définir")+'</span></div><p class="match-note">Position : pays d’une équipe identifiée, pas lieu de l’événement.</p>'+(url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Regarder le match ↗</a>':"")+'</article>';
}
function countryLiveHtml(cc){
 const matches=cc?(state.liveByCountry.get(cc)||[]):state.liveMatches;
 return matches.length?matches.slice(0,9).map(matchCard).join(""):'<p class="note">Aucun match en direct relié à ce pays actuellement. Couverture limitée à PandaScore.</p>';
}
function renderWorld(){
 const body=$("#panelContent"),list=Object.entries(Object.groupBy?Object.groupBy(state.orgs,o=>o.cc):state.orgs.reduce((a,o)=>{(a[o.cc]||=[]).push(o);return a},{}))
  .map(([cc,orgs])=>({cc,orgs})).filter(x=>x.cc).sort((a,b)=>b.orgs.length-a.orgs.length).slice(0,8);
 $("#panelTitle").textContent="Le monde esport";$("#panelSubtitle").textContent="Une scène mondiale, des données identifiées";
 $("#countryLiveCount").textContent=state.liveMatches.length;
 body.innerHTML='<div class="data-label">EN CE MOMENT</div><div class="globe-key"><span class="key-dot live"></span><span>Matchs en direct associés au pays d’une équipe</span></div>'+
 (state.liveMatches.length?state.liveMatches.slice(0,4).map(matchCard).join(""):'<p class="note">Aucun live confirmé dans la fenêtre PandaScore actuelle.</p>')+
 '<div class="data-label">PAYS LES PLUS REPRÉSENTÉS</div>'+list.map(x=>'<button class="org-item" type="button" data-country="'+esc(x.cc)+'"><span class="org-fallback">'+flag(x.cc)+'</span><span><strong>'+esc(countryName(x.cc))+'</strong><small>'+x.orgs.length+' organisations indexées</small></span><span class="arrow">↗</span></button>').join("")+
 '<p class="note">Pays d’origine des organisations, non géolocalisation de leurs bureaux ou des rencontres. Source : PandaScore.</p>';
 body.querySelectorAll("[data-country]").forEach(b=>b.addEventListener("click",()=>selectCountry(b.dataset.country)));
}
function theme(t){document.documentElement.dataset.theme=t==="light"?"light":"dark";try{localStorage.setItem("lobby-theme",document.documentElement.dataset.theme)}catch{};if(state.globe)state.globe.atmosphereColor(t==="light"?"#b6d9f7":"#68b5ff")}
function renderPanel(){
 const title=$("#panelTitle"),sub=$("#panelSubtitle"),body=$("#panelContent");
 if(!state.country&&!state.org){renderWorld();return;}
 if(state.org){const o=state.org;title.textContent=o.n;sub.textContent=(o.cc?countryName(o.cc):"")+(o.s?" · "+o.s:"");const logo=safeImage(o.lg||o.ld);const sets=Object.entries(o.g||{});body.innerHTML='<button type="button" class="detail-back" id="countryBack">← '+esc(countryName(o.cc))+'</button><div class="detail-head">'+(logo?'<img src="'+esc(logo)+'" alt="" loading="lazy">':'<span class="org-fallback">'+esc(o.n.slice(0,2))+'</span>')+'<div><h3>'+esc(o.n)+'</h3><p>'+esc(countryName(o.cc))+'</p></div></div><div class="country-stat"><div class="number">'+sets.length+'</div><p>Jeu'+(sets.length===1?"":"x")+' représenté'+(sets.length===1?"":"s")+'</p></div><div class="data-label">EFFECTIFS PAR JEU</div>'+sets.map(([game,v])=>'<div><p><strong>'+esc(game.toUpperCase())+'</strong></p>'+((v.pl||[]).length?(v.pl||[]).slice(0,12).map(p=>'<div class="roster-row"><strong>'+esc(p.n)+'</strong><small>'+esc([p.r,p.cc].filter(Boolean).join(" · "))+'</small></div>').join(""):'<p class="note">Effectif non renseigné par la source.</p>')+'</div>').join("")+'<p class="note">Source : PandaScore. Les rosters peuvent évoluer et ne couvrent pas toutes les compétitions.</p>';$("#countryBack").addEventListener("click",()=>selectCountry(o.cc,false));return;}
 const cc=state.country,orgs=state.orgs.filter(o=>o.cc===cc),shown=orgs.slice(0,70);title.textContent=flag(cc)+" "+countryName(cc);sub.textContent="Scène esport · "+cc;$("#countryLiveCount").textContent=(state.liveByCountry.get(cc)||[]).length;
 const logos=shown.map(o=>{const u=safeImage(o.lg||o.ld);return'<button class="org-item" type="button" data-org="'+esc(o.id)+'">'+(u?'<img class="org-logo" src="'+esc(u)+'" alt="" loading="lazy">':'<span class="org-fallback">'+esc(o.n.slice(0,2))+'</span>')+'<span><strong>'+esc(o.n)+'</strong><small>'+esc(Object.keys(o.g||{}).map(k=>k.toUpperCase()).join(" · "))+'</small></span><span class="arrow">↗</span></button>'}).join("");
 body.innerHTML='<div class="country-stat"><div class="number">'+(state.orgs.length?orgs.length:"—")+'</div><p>Organisations indexées par Lobby</p></div>'+
 (state.tab==="live"?'<div class="data-label">MATCHS EN DIRECT · ASSOCIÉS À CE PAYS</div>'+countryLiveHtml(cc):
 '<div class="data-label">ÉQUIPES DANS CETTE RÉGION</div>'+(state.orgs.length?(logos||'<p class="note">Aucune équipe indexée dans ce pays pour le moment.</p>'):'<p class="note">Chargement des équipes…</p>'))+
 '<p class="note">Pays des organisations, pas lieux de rencontre. La couverture dépend des données PandaScore.</p>';
 body.querySelectorAll("[data-org]").forEach(el=>el.addEventListener("click",()=>selectOrg(el.dataset.org)));
}
function selectCountry(cc,animate=true){if(!coords[cc])return;state.country=cc;state.org=null;renderPanel();if(animate)fly(coords[cc][0],coords[cc][1],.57)}
function selectOrg(id){const o=state.orgs.find(x=>x.id===id);if(!o)return;state.org=o;state.country=o.cc;renderPanel();if(coords[o.cc])fly(coords[o.cc][0],coords[o.cc][1],.49)}
function searchFocus(query){const q=norm(query);if(!q)return;const org=state.orgs.find(o=>norm(o.n)===q)||state.orgs.find(o=>norm(o.n).includes(q));if(org){selectOrg(org.id);return}const cc=Object.keys(coords).find(x=>norm(countryName(x))===q||norm(x)===q);if(cc){selectCountry(cc);return}queuedSearch=query;$("#globeStatus").textContent="Aucune localisation confirmée pour « "+query+" »."}
function setExpanded(v){state.expanded=v;document.documentElement.classList.toggle("embedded",!v);
 if(state.globe){
  if(v)fly(state.country?coords[state.country][0]:28,state.country?coords[state.country][1]:15,state.country?.57:1.2);
  else fly(28,15,2.25);
 }
 setTimeout(resize,80);setTimeout(resize,450);setTimeout(resize,1250)
}
function searchRequest(){if(window.parent!==window){window.parent.postMessage({type:"lobby:open-search"},location.origin)}else {location.href="/?search=1"}}
$("#searchOpen").addEventListener("click",searchRequest);
$("#atlasTheme").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$$("[data-layer]").forEach(b=>b.addEventListener("click",()=>{state.layer=b.dataset.layer;$$("[data-layer]").forEach(x=>x.classList.toggle("selected",x===b));if(state.layer==="competitions"){$("#panelTitle").textContent="Compétitions par pays";$("#panelSubtitle").textContent="Exploration géographique";$("#panelContent").innerHTML='<p class="note">Les compétitions ne sont pas toutes associées à un pays par PandaScore. Choisis un pays, puis une équipe pour retrouver ses jeux et rosters. Les localisations non confirmées ne sont pas inventées.</p>'}else{renderPanel()}updatePoints()}));
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>{state.tab=b.dataset.tab;$$("[data-tab]").forEach(x=>x.classList.toggle("selected",x===b));renderPanel()}));
$("#home").addEventListener("click",home);$("#recenter").addEventListener("click",home);
$("#zoomIn").addEventListener("click",()=>{if(state.globe){const v=state.globe.pointOfView();fly(v.lat,v.lng,Math.max(.25,v.altitude*.72))}});
$("#zoomOut").addEventListener("click",()=>{if(state.globe){const v=state.globe.pointOfView();fly(v.lat,v.lng,Math.min(3,v.altitude*1.35))}});
window.addEventListener("message",e=>{if(e.origin!==location.origin||!e.data)return;
 if(e.data.type==="lobby:theme")theme(e.data.theme);
 if(e.data.type==="lobby:visibility"&&state.globe){if(e.data.visible)state.globe.resumeAnimation?.();else state.globe.pauseAnimation?.()}
 if(e.data.type==="lobby:atlas-mode"){setExpanded(!!e.data.expanded);if(e.data.search)searchFocus(e.data.search)}
});
function resize(){const el=$("#globe3d");if(!state.globe||!el.clientWidth||!el.clientHeight)return;state.globe.width(el.clientWidth).height(el.clientHeight);state.globe.globeOffset(embedded?[Math.min(110,el.clientWidth*.15),0]:[Math.min(85,el.clientWidth*.08),0])}
const ccpoints=Object.entries(coords).map(([cc,v])=>({cc,lat:v[0],lng:v[1],count:0}));
function updatePoints(){if(!state.globe)return;const counts={};state.orgs.forEach(o=>{counts[o.cc]=(counts[o.cc]||0)+1});
 ccpoints.forEach(x=>{x.count=counts[x.cc]||0});
 const points=ccpoints;
 state.globe.pointsData(points).pointColor(p=>p.count>0?"#59aeff":"#77a6d6").pointAltitude(p=>p.count>0?.018:.004).pointRadius(p=>p.count>0?.32:.18).pointLabel(p=>countryName(p.cc)+(p.count?" · "+p.count+" équipes":""));
}
function fail(message){$("#globeStatus").textContent=message;/* Keep always-visible fallback globe */}
function onWorld(geo){const el=$("#globe3d");if(!window.Globe){fail("Globe statique affiché · 3D indisponible");return}
 try{
 const globe=Globe({animateIn:false,rendererConfig:{alpha:true,antialias:window.devicePixelRatio<=1.6}})(el)
  .backgroundColor("rgba(0,0,0,0)").showAtmosphere(true).atmosphereColor("#68b5ff").atmosphereAltitude(.12)
  .polygonsData(geo.features).polygonCapColor(()=>document.documentElement.dataset.theme==="light"?"#a8c6e7":"#24496e")
  .polygonSideColor(()=>"#142e4e").polygonStrokeColor(()=>document.documentElement.dataset.theme==="light"?"#ffffff":"#4779af")
  .polygonAltitude(.003).polygonsTransitionDuration(280)
  .onPolygonClick(f=>{const code=f.properties?.ISO_A2||f.properties?.iso_a2||f.properties?.ISO2||f.properties?.iso2;const cc=code&&coords[code]?code:resolveCountry(f.properties?.name);if(cc){if(!coords[cc]){const center=geoCenter(f);if(center)coords[cc]=center;}state.country=cc;state.org=null;renderPanel();if(coords[cc])fly(coords[cc][0],coords[cc][1],.57)}})
  .pointsData([]).pointLat("lat").pointLng("lng").pointAltitude(.018).pointRadius(.28)
  .pointColor(()=>"#64b2ff").pointsTransitionDuration(150)
  .onPointClick(p=>selectCountry(p.cc));
 state.globe=globe;
 try{globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio||1,1.5))}catch(e){}
 const controls=globe.controls();controls.autoRotate=true;controls.autoRotateSpeed=.3;controls.enablePan=false;controls.minDistance=113;controls.maxDistance=500;
 controls.addEventListener("start",()=>{controls.autoRotate=false});
 globe.pointOfView({lat:28,lng:15,altitude:embedded?2.25:1.9},0);
 updatePoints();resize();
 requestAnimationFrame(()=>{$("#globeStage").classList.add("ready");$("#globeStatus").textContent="Globe 3D · clique sur un pays";state.ready=true});
 const observer=new ResizeObserver(resize);observer.observe(el);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)globe.pauseAnimation?.();else globe.resumeAnimation?.()});
 if(queuedSearch){const q=queuedSearch;queuedSearch="";searchFocus(q)}
 }catch(e){fail("Globe statique disponible · erreur de rendu 3D")}
}
async function loadJS(src){return new Promise((resolve,reject)=>{const s=document.createElement("script");s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}
async function init(){
 // Two independent sources: bundled WebGL library proxy and small world TopoJSON.
 try{
 const [lib,topo]=await Promise.allSettled([loadJS("/lib/globe.gl.min.js"),loadJS("/lib/topojson-client.min.js")]);
 if(lib.status!=="fulfilled"||topo.status!=="fulfilled")throw Error("library");
 const response=await fetch("/lib/countries-110m.json",{signal:AbortSignal.timeout(14000)});
 if(!response.ok)throw Error("world");
 const json=await response.json(),geo=topojson.feature(json,json.objects.countries);
 onWorld(geo);
 }catch(e){fail("Aperçu de la planète disponible · 3D non chargée")}
}
async function loadOrganizations(){
 try{const saved=JSON.parse(localStorage.getItem("lobby.orgs")||"null");if(saved&&Array.isArray(saved.orgs)&&Date.now()-saved.updated<86400000){state.orgs=saved.orgs;updatePoints();renderPanel()}}catch(e){}
 try{const r=await fetch("/api/orgs",{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error("data");const json=await r.json();if(!Array.isArray(json.orgs))throw Error("invalid");state.orgs=json.orgs;try{localStorage.setItem("lobby.orgs",JSON.stringify({updated:Date.now(),orgs:json.orgs}))}catch(e){};updatePoints();renderPanel();$("#dataSource").textContent="Équipes : PandaScore · "+json.orgs.length+" organisations indexées";if(queuedSearch){const q=queuedSearch;queuedSearch="";searchFocus(q)}}
 catch(e){$("#dataSource").textContent="Équipes temporairement indisponibles · PandaScore";renderPanel()}
}
renderPanel();init();loadOrganizations();
})();