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
function ringIncludes(ring,lat,lng){
 if(!ring||ring.length<3)return false;
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  let x=ring[i][0],y=ring[i][1],a=ring[j][0],b=ring[j][1];
  // Adjust longitudes relative to the clicked longitude, handles antimeridian.
  x=lng+((((x-lng)+540)%360+360)%360)-180;
  a=lng+((((a-lng)+540)%360+360)%360)-180;
  if(((y>lat)!==(b>lat))&&(lng<(a-x)*(lat-y)/(b-y)+x))inside=!inside;
 }
 return inside;
}
function featureIncludes(feature,lat,lng){
 const g=feature.geometry;
 if(!g)return false;
 const polys=g.type==="Polygon"?[g.coordinates]:g.type==="MultiPolygon"?g.coordinates:[];
 return polys.some(poly=>poly?.length&&ringIncludes(poly[0],lat,lng)&&!poly.slice(1).some(hole=>ringIncludes(hole,lat,lng)));
}
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
function fly(lat,lng,alt=.7){const width=$("#globe3d")?.clientWidth||1000;state.globe?.pointOfView({lat,lng,altitude:width<560?Math.max(1.2,alt):alt},duration())}
function home(){state.country=null;state.org=null;state.tab="overview";renderPanel();fly(28,15,2.15)}
const safeUrl=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}};
function associateMatches(){
 const byName=new Map(),ambiguous=new Set();
 state.orgs.forEach(o=>{
  const addKey=(name)=>{
    const key=norm(name);
    if(key.length<2)return;
    if(byName.has(key)&&byName.get(key).cc!==o.cc)ambiguous.add(key);
    else byName.set(key,{cc:o.cc,games:Object.keys(o.g||{})});
  };
  addKey(o.n);if(o.s&&norm(o.s).length>2)addKey(o.s);
 });
 for(const key of ambiguous)byName.delete(key);
 const byCountry=new Map();
 for(const m of state.liveMatches){
  const cc=new Set([m.an,m.bn].map(name=>byName.get(norm(name)))
    .filter(o=>o&&(!m.game||o.games.includes(m.game))).map(o=>o.cc));
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
function selectCountry(cc,animate=true){if(!coords[cc])return;state.country=cc;state.org=null;renderPanel();if(!state.expanded&&window.parent!==window){window.parent.postMessage({type:"lobby:atlas-expand",country:cc},location.origin)}if(animate)fly(coords[cc][0],coords[cc][1],.57)}
function selectOrg(id){const o=state.orgs.find(x=>x.id===id);if(!o)return;state.org=o;state.country=o.cc;renderPanel();if(coords[o.cc])fly(coords[o.cc][0],coords[o.cc][1],.49)}
function searchFocus(query){const q=norm(query);if(!q)return;const org=state.orgs.find(o=>norm(o.n)===q)||state.orgs.find(o=>norm(o.n).includes(q));if(org){selectOrg(org.id);return}const cc=Object.keys(coords).find(x=>norm(countryName(x))===q||norm(x)===q);if(cc){selectCountry(cc);return}queuedSearch=query;$("#globeStatus").textContent="Aucune localisation confirmée pour « "+query+" »."}
function setExpanded(v){state.expanded=v;document.documentElement.classList.toggle("embedded",!v);
 if(state.globe){
  if(v)fly(state.country?coords[state.country][0]:28,state.country?coords[state.country][1]:15,state.country?.57:$("#globe3d").clientWidth<560?2.45:1.2);
  else fly(28,15,2.25);
 }
 setTimeout(resize,80);setTimeout(resize,450);setTimeout(resize,1250)
}
function searchRequest(){if(window.parent!==window){window.parent.postMessage({type:"lobby:open-search"},location.origin)}else {location.href="/?search=1"}}
$("#searchOpen").addEventListener("click",searchRequest);
$("#atlasTheme").addEventListener("click",()=>theme(document.documentElement.dataset.theme==="dark"?"light":"dark"));
$$("[data-layer]").forEach(b=>b.addEventListener("click",()=>{state.layer=b.dataset.layer;$$("[data-layer]").forEach(x=>x.classList.toggle("selected",x===b));state.tab=state.layer==="live"?"live":"overview";$$("[data-tab]").forEach(x=>x.classList.toggle("selected",x.dataset.tab===state.tab));renderPanel();updatePoints()}));
$$("[data-tab]").forEach(b=>b.addEventListener("click",()=>{state.tab=b.dataset.tab;$$("[data-tab]").forEach(x=>x.classList.toggle("selected",x===b));renderPanel()}));
$("#home").addEventListener("click",home);$("#recenter").addEventListener("click",home);
$("#zoomIn").addEventListener("click",()=>{if(state.globe){const v=state.globe.pointOfView();fly(v.lat,v.lng,Math.max(.25,v.altitude*.72))}});
$("#zoomOut").addEventListener("click",()=>{if(state.globe){const v=state.globe.pointOfView();fly(v.lat,v.lng,Math.min(3,v.altitude*1.35))}});
window.addEventListener("message",e=>{if(e.origin!==location.origin||!e.data)return;
 if(e.data.type==="lobby:theme")theme(e.data.theme);
 if(e.data.type==="lobby:match-data"&&Array.isArray(e.data.matches)){
  state.liveMatches=e.data.matches.filter(m=>m&&m.status==="running"&&typeof m.id==="number").slice(0,100);associateMatches();
 }
 if(e.data.type==="lobby:visibility"&&state.globe){if(e.data.visible)state.globe.resumeAnimation?.();else state.globe.pauseAnimation?.()}
 if(e.data.type==="lobby:atlas-mode"){setExpanded(!!e.data.expanded);if(e.data.search)searchFocus(e.data.search)}
 if(e.data.type==="lobby:atlas-country"&&/^[A-Z]{2}$/.test(e.data.country||""))selectCountry(e.data.country)
});
function resize(){const el=$("#globe3d");if(!state.globe||!el.clientWidth||!el.clientHeight)return;state.globe.width(el.clientWidth).height(el.clientHeight);state.globe.globeOffset(el.clientWidth<560?[0,0]:state.expanded?[Math.min(85,el.clientWidth*.08),0]:[Math.min(110,el.clientWidth*.15),0])}
const ccpoints=Object.entries(coords).map(([cc,v])=>({cc,lat:v[0],lng:v[1],count:0}));
function updatePoints(){
 if(!state.globe)return;
 const counts={};state.orgs.forEach(o=>{counts[o.cc]=(counts[o.cc]||0)+1});
 ccpoints.forEach(x=>{x.count=counts[x.cc]||0;x.live=(state.liveByCountry.get(x.cc)||[]).length});
 const p=ccpoints.filter(x=>state.layer==="live"?x.live>0:state.layer==="countries"?true:x.count>0);
 state.globe.pointsData(p)
 .pointColor(x=>x.live>0&&state.layer==="live"?"#ff687e":x.count>0?"#62b8ff":"#7da8d1")
 .pointAltitude(x=>x.live&&state.layer==="live"?.026:.012)
 .pointRadius(x=>x.live&&state.layer==="live"?.48:x.count>0?.31:.20)
 .pointLabel(x=>countryName(x.cc)+" · "+x.count+" organisations"+(x.live?" · "+x.live+" live":""));
 const livePoints=ccpoints.filter(x=>x.live>0).slice(0,12);
 state.globe.ringsData(state.layer==="live"?livePoints:[])
  .ringLat("lat").ringLng("lng").ringAltitude(.023)
  .ringMaxRadius(.8).ringPropagationSpeed(.28).ringRepeatPeriod(1600)
  .ringColor(()=>["#ff768d","#ff768d00"]);
 // Geographic pins remain interactive in WebGL; HTML badges were covering
 // the drag surface and cluttering the map on smaller screens.
 state.globe.htmlElementsData([]);
}
function updateSummary(){
 $("#worldTeams").textContent=state.orgs.length||"—";
 $("#worldCountries").textContent=new Set(state.orgs.map(o=>o.cc)).size||"—";
 if(window.parent!==window){
  const sorted=[...state.orgs].sort((a,b)=>Object.keys(b.g||{}).length-Object.keys(a.g||{}).length).slice(0,8);
  window.parent.postMessage({type:"lobby:org-summary",total:state.orgs.length,countries:new Set(state.orgs.map(o=>o.cc)).size,
    orgs:sorted.map(o=>({n:o.n,cc:o.cc,logo:o.lg||o.ld||""}))},location.origin);
 }
}
let fallbackStarted=false;
let worldFeatures=[];
function pickCountry(hit){
 if(!hit)return;
 let feature=worldFeatures.find(f=>featureIncludes(f,hit.lat,hit.lng));
 let cc=feature?resolveCountry(feature.properties?.name):null;
 if(!cc){
  const nearest=Object.entries(coords)
   .map(([code,[la,lo]])=>({code,dist:(la-hit.lat)**2+Math.cos(hit.lat*Math.PI/180)**2*(lo-hit.lng)**2}))
   .sort((a,b)=>a.dist-b.dist)[0];
  if(nearest?.dist<140)cc=nearest.code;
 }
 if(cc){
  if(!coords[cc])coords[cc]=[hit.lat,hit.lng];
  selectCountry(cc);
 }
}
function startCompatibility(reason){
 if(fallbackStarted)return;
 fallbackStarted=true;
 console.warn("[Lobby Atlas] Mode compatible sans WebGL :",reason);
 try{
  state.globe?.pauseAnimation?.();
  state.pointer?.dispose?.();
  const g=window.LobbyCanvasGlobe?.create($("#globe3d"),{embedded,onPick:pickCountry});
  if(!g)throw Error("canvas_renderer_missing");
  state.globe=g;state.ready=true;
  $("#globeStage").classList.remove("failed");
  $("#globeStage").classList.add("ready","compatibility");
  $("#globeUnavailable").hidden=true;
  $("#globeLoadHint").textContent="Glisse pour tourner la Terre";
  $("#globeStatus").textContent="Globe interactif · mode compatible sans WebGL";
  updatePoints();
  resize();
  if(queuedSearch){const q=queuedSearch;queuedSearch="";searchFocus(q)}
 }catch(e){
  console.error("[Lobby Atlas] Le mode compatible n’a pas démarré",e);
  $("#globeStage").classList.add("failed");
  $("#globeUnavailable").hidden=false;
  $("#globeStatus").textContent="Affichage de la Terre indisponible";
 }
}
function fail(message){
 console.warn("[Lobby Atlas] ",message);
 startCompatibility(message);
}
function onWorld(geo){if(fallbackStarted)return;const el=$("#globe3d");if(!window.Globe){fail("Moteur 3D non chargé");return}
 try{
 const globe=new Globe(el,{animateIn:false,waitForGlobeReady:false,rendererConfig:{alpha:true,antialias:window.devicePixelRatio<=1.6}})
  .backgroundColor("rgba(0,0,0,0)")
  .globeImageUrl("/lib/earth-day.jpg").bumpImageUrl("/lib/earth-topology.png")
  .showAtmosphere(true).atmosphereColor("#85c9ff").atmosphereAltitude(.11)
  .onGlobeClick(({lat,lng})=>{
    if(state.pointer?.isRecentDrag())return;
    const f=geo.features.find(feature=>featureIncludes(feature,lat,lng));
    if(!f)return;
    const code=f.properties?.ISO_A2||f.properties?.iso_a2||f.properties?.ISO2||f.properties?.iso2;
    const cc=code&&coords[code]?code:resolveCountry(f.properties?.name);
    if(cc){if(!coords[cc]){const center=geoCenter(f);if(center)coords[cc]=center;}selectCountry(cc)}
  })
  .pointsData([]).pointLat("lat").pointLng("lng").pointAltitude(.018).pointRadius(.28)
  .pointColor(()=>"#64b2ff").pointsTransitionDuration(150)
  .onPointClick(p=>selectCountry(p.cc)).onZoom(pov=>{window.LobbyEarth?.update(pov);$("#globeStage").dataset.camera=[pov.lat,pov.lng,pov.altitude].map(n=>Number(n).toFixed(2)).join(",")});
 state.globe=globe;
 try{globe.renderer().setPixelRatio(Math.min(window.devicePixelRatio||1,1.5))}catch(e){}
 const controls=globe.controls();
 controls.enabled=true;
 controls.enableRotate=false; // Rotation is handled by reliable pointer events.
 controls.enableZoom=true;
 controls.enableDamping=false;
 controls.autoRotate=false; // Prevent false positives: camera only moves on deliberate interaction.
 controls.enablePan=false;
 controls.minDistance=113;
 controls.maxDistance=500;
 const canvas=globe.renderer()?.domElement;
 if(canvas){
  canvas.addEventListener("webglcontextlost",event=>{
    event.preventDefault();
    startCompatibility("Contexte WebGL perdu");
  },{once:true});
 }
 if(canvas&&window.LobbyPointerGlobe){
   state.pointer=window.LobbyPointerGlobe.attach(globe,canvas,$("#globeStage"));
 }else{
   // Native OrbitControls fallback, still a genuine 3D camera.
   controls.enableRotate=true;
 }
 globe.pointOfView({lat:28,lng:15,altitude:el.clientWidth<560?2.45:embedded?2.25:1.9},0);
 updatePoints();resize();window.LobbyEarth?.init(globe);
 let revealed=false;
 const reveal=()=>{
  if(revealed)return;
  const renderer=globe.renderer?.();
  const canvas=renderer?.domElement;
  if(!canvas||!canvas.isConnected||!canvas.getContext("webgl2")&&!canvas.getContext("webgl"))return;
  revealed=true;state.ready=true;
  $("#globeStage").classList.add("ready");
  $("#globeLoadHint").textContent="Glisse sur la Terre pour tourner";
  $("#globeStatus").textContent="Globe 3D interactif · glisse pour tourner";
  $("#globeUnavailable").hidden=true;
  $("#globeStage").classList.remove("failed");
 };
 globe.onGlobeReady(reveal);
 // En cas de texture déjà chargée, l'événement 'ready' peut avoir eu lieu
 // avant l'installation du callback. On vérifie alors le canvas WebGL.
 setTimeout(reveal,400);
 setTimeout(reveal,1300);
 setTimeout(()=>{if(!state.ready&&!fallbackStarted)startCompatibility("Le rendu WebGL n’a pas abouti");},9500);
 const observer=new ResizeObserver(resize);observer.observe(el);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)globe.pauseAnimation?.();else globe.resumeAnimation?.()});
 if(queuedSearch){const q=queuedSearch;queuedSearch="";searchFocus(q)}
 }catch(e){console.error("[Lobby Atlas] Initialisation du moteur 3D impossible",e);fail("Globe 3D indisponible · consulte les erreurs du navigateur")}
}
async function loadJS(src){
 return new Promise((resolve,reject)=>{
  const script=document.createElement("script");
  script.src=src;script.async=true;
  script.onload=()=>resolve();
  script.onerror=()=>{script.remove();reject(new Error("asset:"+src))};
  document.head.appendChild(script);
 });
}
async function getWorld(){
 try{
  const response=await fetch("/lib/countries-110m.json",{signal:AbortSignal.timeout(9000)});
  if(!response.ok)throw Error("world:"+response.status);
  const json=await response.json();
  if(window.topojson?.feature){worldFeatures=window.topojson.feature(json,json.objects.countries).features;}
 }catch(e){console.warn("[Lobby Atlas] Frontières indisponibles",e)}
 return {features:worldFeatures};
}
async function init(){
 // WebGL is optional. The local Canvas renderer remains interactive on all supported browsers.
 const webgl=(()=>{
  try{const c=document.createElement("canvas");return !!(c.getContext("webgl2")||c.getContext("webgl"))}
  catch(e){return false}
 })();
 if(!webgl){startCompatibility("WebGL indisponible dans ce navigateur");return}
 let timer=setTimeout(()=>{if(!state.ready)startCompatibility("Chargement du moteur trop long")},10000);
 try{
  const lib=await Promise.allSettled([
    loadJS("/lib/globe.gl.min.js"),
    loadJS("/lib/topojson-client.min.js")
  ]);
  if(fallbackStarted)return;
  if(lib[0].status!=="fulfilled"||!window.Globe){
   throw new Error("Librairie 3D inaccessible");
  }
  // Missing country geometries must not block a working 3D Earth.
  const geo=await getWorld();
  if(fallbackStarted)return;
  onWorld(geo);
 }catch(e){
  console.warn("[Lobby Atlas] Démarrage WebGL",e);
  startCompatibility(String(e.message||e));
 }finally{clearTimeout(timer)}
}
async function loadOrganizations(){
 try{const saved=JSON.parse(localStorage.getItem("lobby.orgs")||"null");if(saved&&Array.isArray(saved.orgs)&&Date.now()-saved.updated<86400000){state.orgs=saved.orgs;updateSummary();associateMatches()}}catch(e){}
 try{const r=await fetch("/api/orgs",{signal:AbortSignal.timeout(45000)});if(!r.ok)throw Error("data");const json=await r.json();if(!Array.isArray(json.orgs))throw Error("invalid");state.orgs=json.orgs;updateSummary();associateMatches();try{localStorage.setItem("lobby.orgs",JSON.stringify({updated:Date.now(),orgs:json.orgs}))}catch(e){};updatePoints();renderPanel();$("#dataSource").textContent="Équipes : PandaScore · "+json.orgs.length+" organisations indexées";if(queuedSearch){const q=queuedSearch;queuedSearch="";searchFocus(q)}}
 catch(e){$("#dataSource").textContent="Équipes temporairement indisponibles · PandaScore";renderPanel()}
}
async function loadLive(){
 try{
  const r=await fetch("/api/live",{signal:AbortSignal.timeout(14000)});
  if(!r.ok)throw Error("source");
  const data=await r.json();
  if(!Array.isArray(data.matches))throw Error("format");
  state.liveMatches=data.matches.filter(m=>m.status==="running").slice(0,100);
  associateMatches();
 }catch(e){$("#worldLive").textContent="—";$("#dataSource").textContent="Équipes : PandaScore · Live indisponible"}
}
$("#globeRetry").addEventListener("click",()=>location.reload());
renderPanel();init();loadOrganizations();loadLive();
const direct=new URLSearchParams(location.search);
if(direct.get("country")&&/^[A-Z]{2}$/.test(direct.get("country").toUpperCase())){const cc=direct.get("country").toUpperCase();setTimeout(()=>selectCountry(cc),750)}
else if(direct.get("search")){const query=direct.get("search").slice(0,80);setTimeout(()=>searchFocus(query),750)}
})();