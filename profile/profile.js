(()=>{"use strict";
const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const url=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}};
const params=new URLSearchParams(location.search),type=params.get("type"),id=params.get("id");
const allowed=["teams","players","leagues","tournaments","series"];
const group=allowed.includes(type)?type:"teams";
const typeLabel={teams:"ÉQUIPE",players:"JOUEUR",leagues:"LIGUE",tournaments:"TOURNOI",series:"SAISON"};
$("#backLink").href="/discover/?type="+group;
if(!id||!/^\d+$/.test(id)){location.replace("/discover/?type="+group);return}
const date=s=>{const d=new Date(s);return Number.isFinite(+d)?d.toLocaleString("fr-FR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}):"Date non vérifiée"};
const image=(x)=>{const u=url(x);return u?'<img loading="lazy" src="'+esc(u)+'" alt="" referrerpolicy="no-referrer">':''};
const favKey=s=>String(s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
function savedTeams(){try{const a=JSON.parse(localStorage.getItem("lobby-favorite-teams")||"[]");return Array.isArray(a)?a:[]}catch{return[]}}
function followButton(name){
 if(group!=="teams")return "";
 const k=favKey(name),followed=savedTeams().includes(k);
 return '<button type="button" class="profile-follow" id="profileFollow" aria-pressed="'+followed+'">'+(followed?"★ Équipe suivie":"☆ Suivre cette équipe")+'</button>';
}
function connectFollow(name){
 const b=$("#profileFollow");if(!b)return;
 b.addEventListener("click",()=>{
  const key=favKey(name),set=new Set(savedTeams());
  if(set.has(key))set.delete(key);else set.add(key);
  try{localStorage.setItem("lobby-favorite-teams",JSON.stringify([...set]))}catch{}
  const enabled=set.has(key);b.setAttribute("aria-pressed",String(enabled));b.textContent=enabled?"★ Équipe suivie":"☆ Suivre cette équipe";
 });
}
function roster(x){
 const players=(x.players||[]).filter(p=>p.active!==false);
 if(!players.length){
  $("#profileDetails").innerHTML='<p class="profile-empty">Aucun effectif actuel confirmé par la source pour cette fiche.</p>';return;
 }
 $("#rosterTitle").textContent="Effectif actuel · "+players.length+" joueurs";
 $("#profileDetails").innerHTML='<div class="profile-roster-grid">'+players.map(p=>
  '<a class="profile-player" href="/profile/?type=players&id='+encodeURIComponent(p.id)+'">'+
   (url(p.image)?image(p.image):'<span class="profile-avatar">'+esc(p.name.slice(0,2).toUpperCase())+'</span>')+
   '<span><strong>'+esc(p.name)+'</strong><small>'+esc([p.role,p.country].filter(Boolean).join(" · ")||"Joueur")+'</small></span><span class="profile-chevron">↗</span></a>').join("")+'</div>';
}
function profile(x){
 document.title=x.name+" — Lobby";
 const pic=url(x.image);
 const attrs=[x.game,x.country,x.team].filter(Boolean);
 $("#profileHero").innerHTML=(pic?image(pic):'<span class="profile-monogram">'+esc(x.name.slice(0,2).toUpperCase())+'</span>')+
  '<div class="profile-identity"><span class="profile-label">'+esc(typeLabel[group]||"PROFIL")+' · PandaScore</span>'+
  '<h1>'+esc(x.name)+'</h1><p>'+esc(attrs.join(" · ")||"Informations vérifiables selon couverture")+'</p>'+
  '<div class="profile-buttons">'+followButton(x.name)+
  '<a href="/atlas/?search='+encodeURIComponent(x.name)+'">Voir sur l’Atlas ↗</a>'+
  '<a href="/discover/?type='+encodeURIComponent(group)+'">Explorer d’autres profils ↗</a></div></div>';
 connectFollow(x.name);
 if(group==="teams")roster(x);
 else{
  $("#rosterTitle").textContent=group==="players"?"Informations joueur":"Informations de la compétition";
  $("#profileDetails").innerHTML='<div class="profile-data"><strong>Source</strong><span>PandaScore</span></div>'+
   (x.country?'<div class="profile-data"><strong>Pays</strong><span>'+esc(x.country)+'</span></div>':'')+
   (x.team?'<div class="profile-data"><strong>Équipe actuelle</strong><span>'+esc(x.team)+'</span></div>':'')+
   (x.game?'<div class="profile-data"><strong>Jeu</strong><span>'+esc(x.game)+'</span></div>':'')+
   (x.begin?'<div class="profile-data"><strong>Début</strong><span>'+esc(date(x.begin))+'</span></div>':'')+
   (x.end?'<div class="profile-data"><strong>Fin</strong><span>'+esc(date(x.end))+'</span></div>':'')+
   '<p class="profile-empty">Aucune donnée supplémentaire n’est inventée lorsqu’une source est incomplète.</p>';
 }
 $("#related").innerHTML='<p>Retrouve les prochains rendez-vous et les autres équipes ou compétitions dans l’écosystème Lobby.</p>'+
  '<div class="profile-actions-area"><a href="/matches/?q='+encodeURIComponent(x.name)+'">Explorer les matchs ↗</a>'+
  '<a href="/atlas/?search='+encodeURIComponent(x.name)+'">Repérer sur le globe ↗</a></div>'+
  '<p class="profile-empty">Les données de localisation représentent le pays de l’équipe, pas l’adresse de son siège.</p>';
}
function matchRow(m){
 const logos=(img,name)=>url(img)?image(img):'<span class="profile-match-initial">'+esc((name||"?").slice(0,2))+'</span>';
 const time=date(m.start),live=m.status==="running";
 const result=m.scoreA!==null&&m.scoreB!==null?String(m.scoreA)+" : "+String(m.scoreB):"VS";
 const link=url(m.watch);
 return '<article class="profile-match"><div class="profile-match-meta"><span>'+esc([m.game,m.league,m.tournament].filter(Boolean).join(" · ")||"Esport")+'</span><time>'+esc(time)+'</time></div>'+
  '<div class="profile-match-versus"><span>'+logos(m.al,m.an)+'<strong>'+esc(m.an)+'</strong></span>'+
  '<span class="profile-match-score'+(live?" is-live":"")+'">'+(live?"● ":"")+esc(result)+'</span>'+
  '<span>'+logos(m.bl,m.bn)+'<strong>'+esc(m.bn)+'</strong></span></div>'+
  (link?'<a class="profile-match-link" href="'+esc(link)+'" target="_blank" rel="noopener noreferrer">Regarder ↗</a>':'')+'</article>';
}
function competitionRow(c){
 return '<a href="/profile/?type=tournaments&id='+encodeURIComponent(c.id)+'" class="profile-comp">'+
  (url(c.image)?image(c.image):'<span class="profile-avatar">◇</span>')+
  '<span><strong>'+esc(c.name)+'</strong><small>'+esc([c.league,c.tier].filter(Boolean).join(" · ")||"PandaScore")+'</small></span><span class="profile-chevron">↗</span></a>';
}
async function loadRelations(){
 try{
  const r=await fetch("/api/related?type="+encodeURIComponent(group)+"&id="+encodeURIComponent(id),{signal:AbortSignal.timeout(16500)});
  if(!r.ok)throw Error("source");
  const data=await r.json(),matches=data.matches||[],competitions=data.competitions||[];
  $("#relatedMatches").innerHTML=matches.length?matches.slice(0,20).map(matchRow).join(""):
   '<p class="profile-empty">Aucun match lié disponible dans la couverture actuelle.</p>';
  $("#relatedCompetitions").innerHTML=competitions.length?competitions.slice(0,20).map(competitionRow).join(""):
   '<p class="profile-empty">Aucune compétition associée fournie par la source.</p>';
  $("#relationStatus").textContent=data.partial?"Données partielles · PandaScore":"Données PandaScore · "+date(data.updated);
 }catch(e){
  $("#relatedMatches").innerHTML='<p class="profile-empty">Historique des matchs momentanément indisponible.</p>';
  $("#relatedCompetitions").innerHTML='<p class="profile-empty">Liste des compétitions momentanément indisponible.</p>';
  $("#relationStatus").textContent="Source indisponible";
 }
}
async function load(){
 try{
  const r=await fetch("/api/explore?type="+encodeURIComponent(group)+"&id="+encodeURIComponent(id),{signal:AbortSignal.timeout(14500)});
  if(!r.ok)throw Error("source");const d=await r.json(),x=d.items?.[0];if(!x)throw Error("not_found");
  profile(x);
  loadRelations();
 }catch(e){
  $("#profileHero").innerHTML='<div><span class="profile-label">SOURCE INDISPONIBLE</span><h1>Cette fiche ne peut pas être chargée</h1><p>La source ne répond pas ou ne fournit pas cette entité.</p><a class="profile-error-link" href="/discover/?type='+encodeURIComponent(group)+'">Revenir à l’annuaire ↗</a></div>';
  $("#profileDetails").innerHTML='<p class="profile-empty">Aucune donnée inventée.</p>';
  $("#relatedMatches").innerHTML='<p class="profile-empty">Données indisponibles.</p>';
  $("#relatedCompetitions").innerHTML='<p class="profile-empty">Données indisponibles.</p>';
 }
}
load();
})();
