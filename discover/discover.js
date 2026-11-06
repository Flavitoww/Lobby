(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const params=new URLSearchParams(location.search);
const types={teams:["Équipes","Les organisations qui structurent la scène mondiale."],players:["Joueurs","Retrouve les joueurs, pseudos, nationalités et rosters disponibles."],leagues:["Ligues","Les grands circuits et ligues professionnels."],tournaments:["Tournois","Les événements compétitifs suivis par Lobby."],countries:["Pays","Un accès à la scène esport mondiale, pays par pays."],transfers:["Transferts","Le mercato esport, avec les sources d'origine."],sponsors:["Sponsors","Les partenariats et marques de l'écosystème esport."]};
const type=types[params.get("type")]?params.get("type"):"teams";
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const image=u=>{try{const a=new URL(u);return a.protocol==="https:"?a.href:""}catch{return""}};
const formatDate=s=>{const t=new Date(s);return isNaN(t)?"Date non vérifiée":t.toLocaleString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})};
$("#pageTitle").textContent=types[type][0];$("#pageDescription").textContent=types[type][1];
document.title=types[type][0]+" — Lobby";
$$("[data-tab]").forEach(x=>x.classList.toggle("current",x.dataset.tab===type));
const q=$("#query"),button=$("#searchButton"),results=$("#directoryResults");
const item=(obj,kind)=>{
 const name=obj.name||obj.n||"",u=image(obj.image||obj.logo||obj.lg||obj.ld);
 const sub=[obj.game,obj.country||obj.cc,obj.team].filter(Boolean).join(" · ")||"PandaScore";
 const href=kind==="countries"?"/atlas/?country="+encodeURIComponent(obj.cc||obj.id||""):
  "/profile/?type="+encodeURIComponent(kind)+"&id="+encodeURIComponent(obj.id||"");
 return '<a class="directory-item" href="'+escape(href)+'">'+(u?'<img loading="lazy" alt="" src="'+escape(u)+'">':'<span class="directory-placeholder">'+escape(name.slice(0,2).toUpperCase())+'</span>')+'<span class="info"><strong>'+escape(name)+'</strong><small>'+escape(sub)+'</small></span><span class="go" aria-hidden="true">↗</span></a>';
};
function show(items,kind){results.innerHTML=items.length?items.slice(0,60).map(x=>item(x,kind)).join(""):'<p class="directory-empty">Aucun résultat vérifié disponible. Essaie un autre nom ou un autre jeu.</p>';$("#resultsMeta").textContent=items.length+" résultats · données sources";}
function articles(items){results.innerHTML=items.length?items.slice(0,18).map(i=>'<a class="directory-item article" href="'+escape(image(i.url))+'" rel="noopener noreferrer" target="_blank"><span class="tag">'+escape(i.category||i.source)+'</span><strong>'+escape(i.title)+'</strong><small>'+escape(i.source)+' · '+escape(formatDate(i.published))+'</small></a>').join(""):'<p class="directory-empty">Aucune annonce sourcée récemment dans ce domaine.</p>';$("#resultsMeta").textContent=items.length+" publications récentes · sources externes";}
let serial=0;
async function search(){
 const term=q.value.trim(),n=++serial;
 if(term.length<2){$("#searchHelp").textContent="Entre au moins deux caractères.";return}
 $("#searchHelp").textContent="Recherche en cours…";
 if(type==="countries"){const countries=new Intl.DisplayNames(["fr"],{type:"region"}),list=[];for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){const cc=String.fromCharCode(a,b),name=countries.of(cc);if(name!==cc&&name.toLowerCase().includes(term.toLowerCase()))list.push({id:cc,cc,name})}show(list,"countries");return}
 if(type==="sponsors"||type==="transfers"){
  const all=window._news||[];articles(all.filter(x=>(x.title+" "+x.source).toLowerCase().includes(term.toLowerCase())));return;
 }
 try{const res=await fetch("/api/explore?type="+encodeURIComponent(type)+"&q="+encodeURIComponent(term));if(!res.ok)throw Error("source");const data=await res.json();if(n!==serial)return;show(data.items||[],type);$("#searchHelp").textContent="Tri par pertinence ; les noms exacts apparaissent en priorité."}
 catch(e){if(n!==serial)return;results.innerHTML='<p class="directory-empty">Source momentanément indisponible. Réessaie plus tard.</p>';$("#searchHelp").textContent="PandaScore indisponible."}
}
q.addEventListener("input",()=>{clearTimeout(window._searchTimer);window._searchTimer=setTimeout(search,320)});
button.addEventListener("click",search);q.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();search()}});
async function browseFallback(){
 try{const r=await fetch("/api/explore?type="+encodeURIComponent(type)+"&browse=1",{signal:AbortSignal.timeout(10000)});
  if(!r.ok)throw Error("browse");const d=await r.json();
  show(d.items||[],type);$("#searchHelp").textContent="Catalogue PandaScore · les résultats initiaux ne sont pas un classement des meilleurs.";
 }catch(e){results.innerHTML='<p class="directory-empty">Catalogue momentanément indisponible. Utilise la recherche pour accéder à une fiche.</p>'}
}
function initial(){
 if(type==="countries"){const primary=["FR","KR","CN","US","DE","GB","BR","JP","ES","SA","SE","DK","PL","CA","AU","TR","ID","VN"];const names=new Intl.DisplayNames(["fr"],{type:"region"});show(primary.map(cc=>({id:cc,cc,name:names.of(cc)})),"countries");return}
 if(type==="sponsors"||type==="transfers"){
  $("#searchHelp").textContent="Actualités et annonces sourcées. Aucun contrat n'est supposé.";
  fetch("/api/news").then(r=>r.json()).then(d=>{window._news=(d.items||[]).filter(x=>(type==="sponsors"?/sponsor|partenariat|partnership|brand|marque/i:/transfert|mercato|recrute|sign|join|roster/i).test(x.title));articles(q.value.trim()?window._news.filter(x=>(x.title+" "+x.source).toLowerCase().includes(q.value.trim().toLowerCase())):window._news)}).catch(()=>{results.innerHTML='<p class="directory-empty">Flux d’actualités indisponible.</p>'});return;
 }
 if(type==="teams"||type==="players"){
  fetch("/api/orgs",{signal:AbortSignal.timeout(13000)}).then(r=>{if(!r.ok)throw Error("catalog");return r.json()}).then(d=>{
   if(type==="teams")show((d.orgs||[]).slice(0,60).map(o=>({...o,id:Object.values(o.g||{})[0]?.pid||"",name:o.n,image:o.lg||o.ld,country:o.cc,game:Object.keys(o.g||{}).join(" · ")})).filter(o=>o.id),type);
   else{const people=new Map();for(const o of d.orgs||[])for(const [game,v] of Object.entries(o.g||{}))for(const p of v.pl||[]){if(!people.has(p.id))people.set(p.id,{id:p.id,name:p.n,image:p.im,country:p.cc,game,team:o.n})}show([...people.values()].slice(0,60),"players")}
  }).catch(()=>browseFallback());return;
 }
 fetch("/api/live",{signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error("matches");return r.json()}).then(d=>{
  const games=[...(d.matches||[]),...(d.recent||[])],map=new Map();
  for(const m of games){const name=type==="leagues"?m.comp:m.tournament;if(!name)continue;const id=type==="leagues"?m.leagueId:m.tournamentId;if(!id)continue;map.set(id,{id,name,image:m.ll,game:m.game})}
  if(map.size)show([...map.values()].slice(0,45),type);else browseFallback();
 }).catch(()=>browseFallback());
}
$("#theme").addEventListener("click",()=>{document.body.dataset.theme=document.body.dataset.theme==="dark"?"light":"dark";localStorage.setItem("lobby-theme",document.body.dataset.theme)});
const saved=(()=>{try{return localStorage.getItem("lobby-theme")}catch{return null}})();if(saved==="light")document.body.dataset.theme="light";
$("#openSearch").addEventListener("click",()=>{q.focus();q.scrollIntoView({block:"center",behavior:"smooth"})});
document.addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();q.focus()}});
if(params.get("q"))q.value=params.get("q");
if(params.get("q")&&!["sponsors","transfers"].includes(type))search();else initial();
})();