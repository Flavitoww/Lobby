/* Shared MERIDIAN navigation for all subpages; main Desk keeps its rich search modal. */
(()=>{"use strict";
 const path=location.pathname;
 if(path==="/"||path.startsWith("/atlas/"))return;
 const header=document.querySelector(".header");if(!header)return;
 const searchParams=new URLSearchParams(location.search);
 const game=searchParams.get("game")||"all";
 const section=path.split("/").filter(Boolean)[0]||"discover";
 const current=(x)=>section===x?"nav-active":"";
 const svgSearch='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
 const svgSun='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
 const searchOnPage=section==="discover";
 header.innerHTML='<a href="/" class="brand" aria-label="Lobby, accueil"><span class="mark" aria-hidden="true"><i></i><i></i></span>Lobby</a>'+
  '<nav class="topnav" aria-label="Navigation principale">'+
  '<a href="/" class="'+current("home")+'">Desk</a>'+
  '<a href="/atlas/">Atlas</a>'+
  '<a href="/matches/" class="'+current("matches")+'">Matchs</a>'+
  '<a href="/discover/?type=teams" class="'+(section==="discover"&&searchParams.get("type")==="teams"?"nav-active":"")+'">Équipes</a>'+
  '<a href="/discover/?type=leagues" class="'+(section==="discover"&&searchParams.get("type")==="leagues"?"nav-active":"")+'">Compétitions</a>'+
  '<a href="/news/" class="'+current("news")+'">Actualités</a>'+
  '<a href="/streams/" class="'+current("streams")+'">Streams</a></nav>'+
  (searchOnPage?'<button type="button" id="openSearch" class="search-trigger" aria-label="Rechercher dans Lobby">'+svgSearch+'<span>Équipe, joueur, compétition, pays…</span><kbd>⌘ K</kbd></button>':
    '<a href="/discover/?type=teams" id="openSearch" class="search-trigger" aria-label="Explorer les données">'+svgSearch+'<span>Rechercher dans Lobby</span><kbd>⌘ K</kbd></a>')+
  '<div class="header-actions"><button id="theme" class="icon-button theme-toggle" type="button" title="Thème clair / sombre" aria-label="Changer de thème">'+svgSun+'</button></div>';
 let theme="dark";
 try{theme=localStorage.getItem("lobby-theme")==="light"?"light":"dark"}catch{}
 document.body.dataset.theme=theme;
 const bar=document.createElement("div");
 bar.className="gamebar lobby-site-gamebar";
 bar.setAttribute("role","group");
 bar.setAttribute("aria-label","Filtrer par jeu");
 const games=[["all","Tous les jeux"],["lol","LoL"],["cs2","CS2"],["val","VALORANT"],["rl","Rocket League"],["r6","Rainbow Six"],["dota","Dota 2"],["mlbb","Mobile Legends"],["hok","Honor of Kings"],["cod","Call of Duty"],["ow","Overwatch"],["apex","Apex Legends"],["fn","Fortnite"],["pubg","PUBG"],["tft","TFT"],["fc","EA FC"]];
 for(const [id,label] of games){
  const b=document.createElement("button");
  b.className="game"+(id===game?" active":"");
  b.dataset.game=id;b.type="button";b.textContent=label;
  b.addEventListener("click",()=>{
    let url=new URL(location.href);
    if(section==="profile"){url=new URL("/discover/?type=teams",location.origin)}
    else if(section==="news"||section==="streams"){url=new URL("/matches/",location.origin)}
    if(id==="all")url.searchParams.delete("game");
    else url.searchParams.set("game",id);
    location.href=url.pathname+url.search;
  });
  bar.appendChild(b);
 }
 header.insertAdjacentElement("afterend",bar);
 header.querySelector("#theme")?.addEventListener("click",()=>{
  const next=document.body.dataset.theme==="dark"?"light":"dark";
  document.body.dataset.theme=next;
  try{localStorage.setItem("lobby-theme",next)}catch{}
 });
 document.addEventListener("keydown",e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){
   e.preventDefault();
   if(searchOnPage)document.querySelector("#query")?.focus();
   else location.href="/discover/?type=teams";
  }
 });
})();
