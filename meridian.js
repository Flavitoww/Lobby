(() => {
"use strict";
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const gameNames={lol:"League of Legends",cs2:"Counter-Strike 2",val:"VALORANT",rl:"Rocket League",r6:"Rainbow Six",dota:"Dota 2",mlbb:"Mobile Legends",hok:"Honor of Kings",ow:"Overwatch",cod:"Call of Duty",fc:"EA Sports FC",sc:"StarCraft II",apex:"Apex Legends",fn:"Fortnite",pubg:"PUBG",tft:"Teamfight Tactics",aoe:"Age of Empires",sc2:"StarCraft II"};
const countries=(()=>{const names=new Intl.DisplayNames(["fr"],{type:"region"}),out=[];for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){const code=String.fromCharCode(a,b),name=names.of(code);if(name&&name!==code&&!/région inconnue/i.test(name))out.push([code,name])}return out})()
const S={game:"all",scope:"major",matches:[],recent:[],updated:null,fetchError:false,view:"upcoming",category:"all",items:[],currentQuery:""};
const favorites=(()=>{try{const a=JSON.parse(localStorage.getItem("lobby-favorite-teams")||"[]");return new Set(Array.isArray(a)?a.filter(x=>typeof x==="string").slice(0,200):[])}catch{return new Set()}})();
const favKey=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
const favouriteMatch=m=>favorites.has(favKey(m.an))||favorites.has(favKey(m.bn));
const saveFavorites=()=>{try{localStorage.setItem("lobby-favorite-teams",JSON.stringify([...favorites]))}catch(e){}};
const html=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const validURL=u=>{try{const x=new URL(u);return x.protocol==="https:" ? x.href : ""}catch{return ""}};
const date=t=>{const d=new Date(t);return Number.isNaN(+d)?"—":d.toLocaleString("fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"})};
const time=t=>{const d=new Date(t);return Number.isNaN(+d)?"—":d.toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})};
const logo=(u,n)=>{const url=validURL(u);return url?'<img class="team-logo" alt="" src="'+html(url)+'" loading="lazy" referrerpolicy="no-referrer">':'<span class="team-initial">'+html((n||"?").slice(0,3))+'</span>'};
const side=(m,which)=>{const right=which==="b";const n=right?(m.bs||m.bn):(m.as||m.an);const label=html(n||"À définir");return '<span class="team-side'+(right?" right":"")+'">'+(right?'<span class="team-name" title="'+label+'">'+label+'</span>'+logo(m.bl,n):logo(m.al,n)+'<span class="team-name" title="'+label+'">'+label+'</span>')+'</span>'};
function liveMatch(m){const info=html([gameNames[m.game]||m.game,m.comp,m.serie].filter(Boolean).join(" · "));const score=m.sa+" — "+m.sb;const url=validURL(m.watch);return '<div class="live-match"><div class="match-meta"><span title="'+info+'">'+info+'</span><span class="badge-live">LIVE</span></div><div class="match-teams">'+side(m,"a")+'<span class="match-score">'+score+'</span>'+side(m,"b")+'</div>'+(url?'<a href="'+html(url)+'" target="_blank" rel="noopener noreferrer" class="small-muted">Regarder le direct ↗</a>':'')+'</div>'}
function scheduleMatch(m,past){const label=html([m.comp,m.serie].filter(Boolean).join(" · "));const score=past?'<span class="versus">'+html(m.sa)+" : "+html(m.sb)+'</span>':'<span class="versus">vs</span>';return '<div class="schedule-row"><div class="schedule-date">'+html(date(m.ts))+'</div><div class="schedule-body"><div class="schedule-comp" title="'+label+'">'+html(gameNames[m.game]||m.game)+" · "+label+'</div><div class="schedule-teams">'+side(m,"a")+score+side(m,"b")+'</div></div></div>'}
const bigLeagues=/\b(LEC|LCK|LPL|LCS|CBLOL|MSI|Worlds?|World Championship|First Stand|VCT|Champions Tour|Masters|Champions 20|IEM|Intel Extreme Masters|BLAST|ESL Pro League|PGL|RLCS|Six Invitational|Six Major|EWC|Esports World Cup|The International|DreamLeague|CDL|Call of Duty League|OWCS|Overwatch Champions|PUBG Global)\b/i;
const lowTier=/\b(academy|amateur|community|collegiate|open cup|open qualifier|challengers?|contenders?|division 2|division 3|tier ?[23]|grassroots|betboom rise|predator league|spike series)\b/i;
const featuredTeams=/\b(G2|G2 Esports|T1|Gen\.?G|Fnatic|Team Vitality|Vitality|Karmine Corp|KC|Team Liquid|NAVI|Natus Vincere|FaZe Clan|FaZe|Cloud9|Sentinels|Gentle Mates|BDS|MOUZ|FURIA|100 Thieves|DRX|EDward Gaming|Paper Rex|Team Spirit|Falcons)\b/i;
const isMajor=m=>{
 if(favouriteMatch(m))return true;
 const comp=[m.comp,m.serie,m.tournament].filter(Boolean).join(" ");
 if(m.tier==="s"||m.tier==="a")return !lowTier.test(comp);
 return bigLeagues.test(comp)&&!lowTier.test(comp);
};
const priority=m=>{
 const comp=[m.comp,m.serie,m.tournament].filter(Boolean).join(" ");
 return (m.tier==="s"?1600:m.tier==="a"?900:0)+(bigLeagues.test(comp)?450:0)+
 (featuredTeams.test([m.an,m.bn].join(" "))*210)+(favouriteMatch(m)?4000:0)+
 (m.status==="running"?80:0)+(m.imp||0);
};
function renderMatches(){
 const byGame=(arr)=>S.game==="all"?arr:arr.filter(m=>m.game===S.game);
 const apply=(arr)=>S.scope==="major"?arr.filter(isMajor):arr;
 const live=apply(byGame(S.matches.filter(m=>m.status==="running"))).sort((a,b)=>priority(b)-priority(a));
 const upcoming=apply(byGame(S.matches.filter(m=>m.status!=="running"))).sort((a,b)=>priority(b)-priority(a)||a.ts-b.ts);
 const past=apply(byGame(S.recent)).sort((a,b)=>priority(b)-priority(a)||b.ts-a.ts);
 $("#liveCount").textContent=live.length;
 $("#liveList").innerHTML=live.length?live.slice(0,6).map(liveMatch).join(""):'<p class="empty">'+(S.fetchError?"Source momentanément indisponible. Aucun faux score affiché.":S.scope==="major"?"Aucun match majeur en direct pour ce filtre. <button type=\"button\" class=\"inline-link\" data-all-matches>Voir toutes les divisions →</button>":"Aucun match en direct actuellement.")+'</p>';
 const chosen=S.view==="past"?past:upcoming;
 $("#scheduleList").innerHTML=chosen.length?chosen.slice(0,8).map(m=>scheduleMatch(m,S.view==="past")).join(""):'<p class="empty">'+(S.fetchError?"Données temporairement indisponibles.":S.scope==="major"?"Aucune affiche majeure disponible dans la fenêtre chargée. <button type=\"button\" class=\"inline-link\" data-all-matches>Voir toutes les divisions →</button>":"Aucun match disponible.")+'</p>';
 document.querySelectorAll("[data-all-matches]").forEach(b=>b.addEventListener("click",()=>setScope("all")));
 $("#sourceStatus").textContent=S.fetchError?"Connexion aux matchs indisponible":("PandaScore · actualisé "+(S.updated?time(S.updated):"—")+" · niveau S/A prioritaire");
 $("#liveUpdated").textContent=S.fetchError?"Indisponible":S.scope==="major"?"Compétitions majeures":"Toutes divisions";
}
function setScope(scope){S.scope=scope;$$("[data-scope]").forEach(b=>{b.classList.toggle("selected",b.dataset.scope===scope);b.setAttribute("aria-pressed",String(b.dataset.scope===scope))});renderMatches();}
$$("[data-scope]").forEach(b=>b.addEventListener("click",()=>setScope(b.dataset.scope)));
async function loadMatches(){
 const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),11000);
 try{
  const r=await fetch("/api/live",{signal:ctrl.signal});
  if(!r.ok)throw new Error("unavailable");
  const d=await r.json();
  if(!Array.isArray(d.matches)||!Array.isArray(d.recent))throw Error("invalid");
  S.matches=d.matches;S.recent=d.recent;S.updated=d.updated;S.fetchError=false;
 }catch(e){S.fetchError=true;}
 finally{clearTimeout(timer);renderMatches();}
}
async function loadNews(){
 const el=$("#newsList"),ctrl=new AbortController(),t=setTimeout(()=>ctrl.abort(),11000);
 try{const r=await fetch("/api/news",{signal:ctrl.signal});if(!r.ok)throw Error("unavailable");const d=await r.json();
 const items=(d.items||[]).filter(x=>validURL(x.url)&&x.title).slice(0,6);
 el.innerHTML=items.length?items.map(x=>'<a class="news-item" target="_blank" rel="noopener noreferrer" href="'+html(validURL(x.url))+'"><span class="news-src">'+html(x.source||"Actualité esport")+'</span><h3>'+html(x.title)+'</h3><time>'+html(date(x.published))+'</time></a>').join(""):'<p class="empty">Aucune actualité disponible pour le moment.</p>';
 }catch(e){el.innerHTML='<p class="empty">Actualités temporairement indisponibles. Les liens seront affichés dès le retour de la source.</p>';}
 finally{clearTimeout(t)}
}
$$("[data-game]").forEach(b=>b.addEventListener("click",()=>{
 S.game=b.dataset.game;$$("[data-game]").forEach(x=>{x.classList.toggle("active",x===b);x.setAttribute("aria-pressed",String(x===b))});renderMatches();
}));
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>{S.view=b.dataset.view;$$("[data-view]").forEach(x=>{x.classList.toggle("selected",x===b);x.setAttribute("aria-selected",String(x===b))});renderMatches()}));
$("#refresh").addEventListener("click",()=>{loadMatches();loadNews()});
const frame=$("#atlasFrame"),host=$("#atlasHost"),modal=$("#searchDialog"),q=$("#globalSearch"),results=$("#resultsArea");
let frameLoaded=false,open=false,focusBefore=null,queryAbort=null,queryTimer=null,requestSerial=0,resultsPending=false,activeResult=0;
const reduced=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function viewChange(fn){if(document.startViewTransition&&!reduced()){document.startViewTransition(fn);}else fn();}
function atlasMode(isOpen,searchTerm){
 open=isOpen;document.body.classList.toggle("atlas-open",isOpen);$("#atlasToolbar").hidden=!isOpen;
 frame.contentWindow?.postMessage({type:"lobby:atlas-mode",expanded:isOpen,search:searchTerm||""},location.origin);
 if(isOpen){history.replaceState(null,"","#atlas");setTimeout(()=>$("#atlasClose").focus(),200)}
 else {if(location.hash==="#atlas")history.replaceState(null,"",location.pathname);$("#searchTrigger").focus({preventScroll:true})}
}
function showAtlas(searchTerm){
 closeSearch(false);
 viewChange(()=>atlasMode(true,searchTerm));
}
function hideAtlas(){viewChange(()=>atlasMode(false,""))}
$$("[data-atlas]").forEach(b=>b.addEventListener("click",()=>showAtlas()));
$("#atlasClose").addEventListener("click",hideAtlas);
host.addEventListener("click",e=>{if(window.matchMedia("(max-width:650px)").matches&&!open&&!e.target.closest("button"))showAtlas()});
frame.addEventListener("load",()=>{frameLoaded=true;frame.classList.add("frame-ready");frame.contentWindow?.postMessage({type:"lobby:theme",theme:document.body.dataset.theme},location.origin);frame.contentWindow?.postMessage({type:"lobby:atlas-mode",expanded:open},location.origin)});
function openSearch(category){
 focusBefore=document.activeElement;
 if(open)hideAtlas();
 modal.hidden=false;
 document.body.style.overflow="hidden";
 S.category=category||"all";S.currentQuery="";q.value="";
 $$("[data-category]").forEach(b=>b.classList.toggle("active",b.dataset.category===S.category));
 showShortcuts();q.focus();
}
function closeSearch(restore=true){
 if(modal.hidden)return;modal.hidden=true;document.body.style.overflow="";if(queryAbort)queryAbort.abort();clearTimeout(queryTimer);requestSerial++;
 if(restore&&focusBefore?.focus)focusBefore.focus();
}
$("#searchTrigger").addEventListener("click",()=>openSearch());
$("#searchDismiss").addEventListener("click",()=>closeSearch());
$("[data-search-close]").addEventListener("click",()=>closeSearch());
function showShortcuts(){
 $("#searchHint").textContent="ACCÈS RAPIDES";
 results.innerHTML='<div class="search-shortcuts"><button type="button" data-atlas class="atlas-shortcut"><span class="mini-orbit" aria-hidden="true"></span><span><strong>Atlas mondial</strong><small>Explorer les pays et équipes sur le globe 3D</small></span><b>↗</b></button><button type="button" class="shortcut" data-explore="teams"><strong>Explorer les équipes</strong><span>→</span></button><button type="button" class="shortcut" data-explore="leagues"><strong>Ligues & compétitions</strong><span>→</span></button></div>';
 bindDynamic();
}
function bindDynamic(){
 results.querySelectorAll("[data-atlas]").forEach(b=>b.addEventListener("click",()=>showAtlas()));
 results.querySelectorAll("[data-explore]").forEach(b=>b.addEventListener("click",()=>{openSearch(b.dataset.explore)}));
}
const normalized=s=>String(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function countryResults(terms){
 if(!terms||terms.length<2)return [];
 return countries.filter(([code,name])=>normalized(name).includes(normalized(terms))||normalized(code)===normalized(terms)).slice(0,5).map(([code,name])=>({id:code,type:"countries",name,game:"",country:code}));
}
function hitMarkup(item){
 const label=({teams:"ÉQUIPE",players:"JOUEUR",leagues:"LIGUE",tournaments:"TOURNOI",series:"SAISON",countries:"PAYS"})[item.type]||"DONNÉE";
 const sub=[item.game,item.country,item.team].filter(Boolean).join(" · ")||"PandaScore";
 const pic=validURL(item.image)?'<img src="'+html(validURL(item.image))+'" alt="" loading="lazy" referrerpolicy="no-referrer">':'<span class="hit-initial">'+({players:"♙",teams:"♧",leagues:"◇",tournaments:"♜",countries:"◎"})[item.type]+'</span>';
 return '<button class="search-hit" type="button" data-hit="'+html(item.type+":"+item.id)+'">'+pic+'<span class="hit-text"><strong>'+html(item.name)+'</strong><small>'+html(sub)+'</small></span><span class="hit-type">'+label+'</span></button>';
}
function renderSearch(items,unavailable=[]){
 S.items=items;activeResult=0;
 $("#searchHint").textContent="RÉSULTATS TRIÉS PAR PERTINENCE"+(items.length?" · "+items.length:"");
 if(!items.length){
  results.innerHTML='<p class="empty">Aucun résultat pour cette recherche'+(unavailable.length?". Certaines sources sont indisponibles.":".")+'</p>';return;
 }
 results.innerHTML=items.map(hitMarkup).join("")+(unavailable.length?'<p class="empty">Couverture partielle : '+html(unavailable.join(", "))+' indisponible.</p>':"");
 results.querySelectorAll("[data-hit]").forEach(b=>b.addEventListener("click",()=>activateHit(b.dataset.hit)));
}
async function activateHit(key){
 const item=S.items.find(x=>x.type+":"+x.id===key);if(!item)return;
 if(item.type==="countries"){showAtlas(item.name);return;}
 $("#searchHint").textContent="FICHE · "+item.type.toUpperCase();
 results.innerHTML='<div class="profile-card"><button type="button" class="profile-back" id="profileBack">← Retour aux résultats</button><div class="profile-top">'+(validURL(item.image)?'<img src="'+html(validURL(item.image))+'" alt="" referrerpolicy="no-referrer">':'<span class="hit-initial">'+html(item.name.slice(0,2))+'</span>')+'<div><h3>'+html(item.name)+'</h3><p>'+html([item.game,item.country,item.team].filter(Boolean).join(" · ")||"PandaScore")+'</p></div></div><p class="profile-loading">Chargement des données de la fiche…</p></div>';
 $("#profileBack").addEventListener("click",()=>renderSearch(S.items));
 const ctrl=new AbortController();
 try{
  const r=await fetch("/api/explore?type="+encodeURIComponent(item.type)+"&id="+encodeURIComponent(item.id),{signal:ctrl.signal});
  if(!r.ok)throw Error("unavailable");
  const d=await r.json();const t=(d.items||[])[0]||item;
  const card=results.querySelector(".profile-card");if(!card)return;
  const players=(t.players||[]).filter(p=>p.active!==false);
  const roster=players.length?'<section class="profile-roster"><h4>Effectif actuel <small>selon PandaScore</small></h4>'+players.map(p=>'<div class="profile-player"><span>'+html(p.name)+'</span><small>'+html([p.role,p.country].filter(Boolean).join(" · "))+'</small></div>').join("")+'</section>':"";
  const canAtlas=item.type==="teams"||item.type==="players";
  const dates=[t.begin&&"Début : "+date(t.begin),t.end&&"Fin : "+date(t.end)].filter(Boolean);
  card.querySelector(".profile-loading").outerHTML='<p class="profile-source">Source : PandaScore · '+html(t.game||item.game||"Données publiques")+' · ID '+html(item.id)+'</p>'+(dates.length?'<p class="profile-source">'+html(dates.join(" · "))+'</p>':"")+roster+
    (canAtlas?'<div class="profile-actions"><button type="button" id="profileAtlas" class="outline-btn">Rechercher sur l’Atlas ↗</button></div>':"");
  const atlasBtn=card.querySelector("#profileAtlas");atlasBtn?.addEventListener("click",()=>showAtlas(t.name));
  if(item.type==="teams"){
    const actions=card.querySelector(".profile-actions")||card.appendChild(document.createElement("div"));actions.classList.add("profile-actions");
    const follow=document.createElement("button");follow.type="button";follow.className="outline-btn";
    const k=favKey(item.name);const refresh=()=>{follow.textContent=favorites.has(k)?"★ Équipe suivie — retirer":"☆ Suivre cette équipe";follow.setAttribute("aria-pressed",String(favorites.has(k)))};
    refresh();actions.appendChild(follow);follow.addEventListener("click",()=>{favorites.has(k)?favorites.delete(k):favorites.add(k);saveFavorites();refresh();renderMatches()});
  }
 }catch(e){const card=results.querySelector(".profile-card");if(card){card.querySelector(".profile-loading").textContent="Détails indisponibles. La fiche de base reste accessible.";}}
}
async function searchNow(){
 const term=q.value.trim().slice(0,80);
 S.currentQuery=term;
 const serial=++requestSerial;
 if(queryAbort)queryAbort.abort();
 if(term.length<2){showShortcuts();return;}
 if(S.category==="sponsors"||S.category==="transfers"){
  $("#searchHint").textContent="COUVERTURE DES DONNÉES";
  results.innerHTML='<p class="empty">Cette catégorie attend une source de données vérifiée. Aucun sponsor ou transfert n’est présenté sans preuve. Les autres catégories sont recherchables dès maintenant.</p>';return;
 }
 const local=S.category==="all"||S.category==="countries"?countryResults(term):[];
 if(S.category==="countries"){renderSearch(local);return;}
 results.innerHTML='<p class="empty">Recherche en cours…</p>';
 queryAbort=new AbortController();
 try{
  const type=S.category==="all"?"all":S.category;
  const url="/api/explore?type="+encodeURIComponent(type)+"&q="+encodeURIComponent(term)+(S.game!=="all"?"&game="+encodeURIComponent(S.game):"");
  const r=await fetch(url,{signal:queryAbort.signal});
  const data=await r.json();if(serial!==requestSerial)return;
  if(!r.ok)throw Error(data.error||"unavailable");
  const items=local.concat((data.items||[]).filter(i=>i.name));
  const key=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
  const rank=item=>{const n=key(item.name),t=key(term);return (n===t?10000:n.startsWith(t)?7000:n.includes(t)?3000:0)+
  (item.type==="players"?500:0)+(item.team?200:0)+(item.image?80:0)-(Math.max(0,n.length-t.length)*18)};
  items.sort((a,b)=>rank(b)-rank(a));renderSearch(items,data.unavailable||[]);
 }catch(e){if(serial!==requestSerial)return;renderSearch(local,["PandaScore"]);}
}
q.addEventListener("input",()=>{clearTimeout(queryTimer);queryTimer=setTimeout(searchNow,260)});
$$("[data-category]").forEach(b=>b.addEventListener("click",()=>{
 S.category=b.dataset.category;
 $$("[data-category]").forEach(x=>x.classList.toggle("active",x===b));
 searchNow();q.focus();
}));
$$("[data-explore]").forEach(b=>b.addEventListener("click",()=>openSearch(b.dataset.explore)));
document.addEventListener("keydown",e=>{
 if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();modal.hidden?openSearch():closeSearch();return}
 if(e.key==="Escape"){if(!modal.hidden)closeSearch();else if(open)hideAtlas();return}
 if(!modal.hidden&&(e.key==="ArrowDown"||e.key==="ArrowUp")){
  const hits=[...results.querySelectorAll(".search-hit")];if(hits.length){
    e.preventDefault();activeResult=(activeResult+(e.key==="ArrowDown"?1:-1)+hits.length)%hits.length;
    hits.forEach((h,i)=>h.classList.toggle("keyboard-active",i===activeResult));
    hits[activeResult].scrollIntoView({block:"nearest",behavior:"instant"});
  }return;
 }
 if(!modal.hidden&&e.key==="Enter"){
  const hits=[...results.querySelectorAll(".search-hit")];const chosen=hits[activeResult]||hits[0];
  if(chosen){e.preventDefault();chosen.click()}else if(results.querySelector(".atlas-shortcut"))results.querySelector(".atlas-shortcut").click();
 }
 if(!modal.hidden&&e.key==="Tab"){
  const f=$$("#searchDialog button,#searchDialog input").filter(el=>el.offsetParent!==null);
  if(!f.length)return;
  if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}
  else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}
 }
});
const storedTheme=(()=>{try{return localStorage.getItem("lobby-theme")}catch{return null}})();
function setTheme(value){document.body.dataset.theme=value;document.documentElement.style.colorScheme=value;$("#themeToggle").setAttribute("aria-label",value==="dark"?"Activer le thème clair":"Activer le thème sombre");try{localStorage.setItem("lobby-theme",value)}catch(e){};frame.contentWindow?.postMessage({type:"lobby:theme",theme:value},location.origin)}
setTheme(storedTheme==="light"?"light":"dark");
$("#themeToggle").addEventListener("click",()=>setTheme(document.body.dataset.theme==="dark"?"light":"dark"));
window.addEventListener("message",e=>{if(e.origin!==location.origin)return;if(e.data?.type==="lobby:atlas-close")hideAtlas();if(e.data?.type==="lobby:open-search")openSearch()});
if(location.hash==="#atlas")showAtlas();
renderMatches();loadMatches();loadNews();
document.addEventListener("visibilitychange",()=>{if(!document.hidden && (!S.updated||Date.now()-S.updated>180000))loadMatches()});
setInterval(()=>{if(!document.hidden)loadMatches()},180000);
})();