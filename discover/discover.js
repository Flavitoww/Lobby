(()=>{"use strict";
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const p=new URLSearchParams(location.search);
const type=["teams","players","leagues","tournaments","countries","sponsors","transfers"].includes(p.get("type"))?p.get("type"):"teams";
const game=p.get("game")||"all",selectedCountry=/^[A-Z]{2}$/.test((p.get("country")||"").toUpperCase())?p.get("country").toUpperCase():"";
const labels={teams:["Équipes","Explore les organisations esport et leurs effectifs."],
 players:["Joueurs","Découvre les profils des joueurs de la scène compétitive."],
 leagues:["Ligues","Retrouve les circuits, ligues et compétitions par jeu."],
 tournaments:["Tournois","Parcours les événements de compétition et leurs phases."],
 countries:["Pays","Explore les scènes esport par pays dans l’Atlas mondial."],
 sponsors:["Sponsors","Actualités et annonces de partenariats sourcées."],
 transfers:["Transferts","Transferts et mercato : publications sourcées uniquement."]};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const image=s=>{try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}};
const ccname=new Intl.DisplayNames(["fr"],{type:"region"});
const state={page:0,items:[],hasMore:false,partial:false,loading:false,serial:0,browse:true,featured:new Set()};
const input=$("#query"),btn=$("#searchButton"),results=$("#directoryResults"),loadMore=$("#directoryLoadMore"),source=$("#directorySource");
const country=$('#countryFilter'),countryLabel=$("#countryLabel");
const flag=cc=>/^[A-Z]{2}$/.test(cc||"")?String.fromCodePoint(...[...cc].map(c=>127397+c.charCodeAt(0))):"🌐";
$("#pageTitle").textContent=labels[type][0];$("#pageDescription").textContent=labels[type][1];document.title=labels[type][0]+" — Lobby";
$("#sectionTitle").textContent=type==="teams"?"Organisations indexées":type==="players"?"Joueurs disponibles":type==="countries"?"Explorer les régions":type==="sponsors"?"Partenariats publiés":type==="transfers"?"Dernières annonces":"Compétitions disponibles";
$$("[data-tab]").forEach(x=>{x.classList.toggle("current",x.dataset.tab===type);if(x.dataset.tab===type)x.setAttribute("aria-current","page")});
const searchValue=p.get("q")||"";input.value=searchValue;
function setCountryControl(){
 const enabled=type==="teams";
 country.parentElement.hidden=!enabled;
 if(!enabled)return;
 const list=["FR","DE","GB","KR","CN","US","CA","BR","JP","ES","SE","DK","PL","TR","SA","AU","VN","ID","TW","NL","CH","IT","PT","MX"];
 for(const cc of list){const option=document.createElement("option");option.value=cc;option.textContent=flag(cc)+" "+ccname.of(cc);country.appendChild(option)}
 country.value=selectedCountry;
 country.addEventListener("change",()=>{
  const url=new URL(location.href);url.searchParams.delete("q");url.searchParams.delete("page");
  if(country.value)url.searchParams.set("country",country.value);
  else url.searchParams.delete("country");
  location.href=url.pathname+url.search;
 });
}
setCountryControl();
function card(x){
 const name=x.name||"",url=type==="countries"?"/atlas/?country="+encodeURIComponent(x.cc):
  "/profile/?type="+encodeURIComponent(type)+"&id="+encodeURIComponent(x.id);
 const pic=image(x.image);
 const sub=[x.game||x.gameSlug,x.country||x.cc,x.team].filter(Boolean).join(" · ")||"PandaScore";
 const badge=state.featured.has(String(x.id))?"<span class=\"directory-tag\">Présent en compétition majeure</span>":"";
 return '<a class="directory-item" href="'+esc(url)+'" title="'+esc(name)+'">'+
  (pic?'<img loading="lazy" src="'+esc(pic)+'" alt="" referrerpolicy="no-referrer">':
   '<span class="directory-placeholder">'+(type==="countries"?flag(x.cc):esc(name.slice(0,2).toUpperCase()))+'</span>')+
  '<span class="info"><strong>'+esc(name)+'</strong><small>'+esc(sub)+'</small>'+badge+'</span><span class="go" aria-hidden="true">↗</span></a>';
}
function article(x){
 const href=image(x.url),date=new Date(x.published);
 const when=Number.isNaN(+date)?"Date non vérifiée":date.toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"});
 return '<a class="directory-item article" href="'+esc(href)+'" rel="noopener noreferrer" target="_blank"><span class="tag">'+esc(x.category||"ESPORT")+'</span>'+
 '<strong>'+esc(x.title)+'</strong><small>'+esc(x.source||"Source externe")+' · '+esc(when)+'</small><span class="article-go">Lire la source ↗</span></a>';
}
function render(){
 results.innerHTML=state.items.length?state.items.map(type==="sponsors"||type==="transfers"?article:card).join(""):
  '<p class="directory-empty">'+(state.loading?"Chargement des résultats…":"Aucune donnée vérifiée pour ces filtres. Essaie un autre jeu, un pays différent ou une recherche.")+'</p>';
 const size=state.items.length;
 $("#resultsMeta").textContent=state.loading?"Chargement…":size+" résultat"+(size>1?"s":"")+(state.hasMore?" · d’autres pages disponibles":"");
 source.textContent=type==="sponsors"||type==="transfers"?"Articles sourcés · aucun contrat supposé":
  state.partial?"PandaScore · couverture partielle pour ce filtre":"PandaScore · catalogue paginé, non exhaustif";
 loadMore.hidden=!state.hasMore||state.loading;loadMore.disabled=state.loading;
 loadMore.textContent=state.loading?"Chargement…":"Charger davantage de résultats ↓";
}
function rememberUrl(query){
 const url=new URL(location.href);
 if(query.length>=2)url.searchParams.set("q",query);else url.searchParams.delete("q");
 history.replaceState(null,"",url.pathname+url.search);
}
function rank(items,q){
 const norm=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]/g,"");
 const needle=norm(q);return items.sort((a,b)=>{
  const score=o=>{const n=norm(o.name);return(n===needle?10000:n.startsWith(needle)?7200:n.includes(needle)?3000:0)+(o.image?90:0)-(Math.max(0,n.length-needle.length)*7)};
  return score(b)-score(a);
 });
}
async function fetchPage({reset=false}={}){
 const q=input.value.trim(),n=++state.serial;
 if(state.loading)return;
 if(q&&q.length<2){$("#searchHelp").textContent="Au moins deux caractères pour rechercher.";return}
 if(reset){state.items=[];state.page=0;state.hasMore=false}
 const page=state.page+1;state.loading=true;render();
 try{
  const route="/api/catalog?type="+encodeURIComponent(type)+"&game="+encodeURIComponent(game)+"&page="+page+
   (q?"&q="+encodeURIComponent(q):"")+(selectedCountry?"&country="+encodeURIComponent(selectedCountry):"");
  const requests=[fetch(route,{signal:AbortSignal.timeout(14500)})];
  if(q.length>=2&&page===1)requests.push(fetch("/api/explore?type="+encodeURIComponent(type)+"&q="+encodeURIComponent(q)+(game!=="all"?"&game="+encodeURIComponent(game):""),{signal:AbortSignal.timeout(14500)}));
  const settled=await Promise.allSettled(requests);
  const primary=settled[0].status==="fulfilled"?settled[0].value:null;
  if(!primary?.ok)throw Error("catalog_"+(primary?.status||"network"));
  const data=await primary.json();let found=data.items||[];
  if(settled[1]?.status==="fulfilled"&&settled[1].value.ok){
   const ranked=await settled[1].value.json();found=[...(ranked.items||[]),...found];
  }
  if(n!==state.serial)return;
  const byId=new Map(state.items.map(x=>[String(x.id),x]));
  for(const obj of found)if(obj.id&&obj.name)byId.set(String(obj.id),obj);
  state.items=[...byId.values()];if(q.length>=2)rank(state.items,q);
  state.page=page;state.hasMore=!!data.hasMore;
  state.partial=state.partial||!!data.partial;
  $("#searchHelp").textContent=q.length>=2?"Noms exacts puis correspondances proches.":"Utilise les filtres par jeu en haut ou cherche un nom.";
  rememberUrl(q);
 }catch(e){
  const cause=String(e.message||e);
  $("#searchHelp").textContent=cause.includes("403")?"Ce jeu n’est pas couvert par l’API disponible.":"Catalogue indisponible pour le moment.";
 }finally{state.loading=false;render()}
}
function renderCountries(){
 const primary=["FR","KR","CN","US","DE","GB","BR","JP","ES","SA","SE","DK","PL","CA","AU","TR","ID","VN","NL","PT","IT","MX","AR","ZA","IN","PH","TW","CH","AE"];
 const q=input.value.toLocaleLowerCase("fr-FR");
 state.items=primary.map(cc=>({id:cc,cc,name:ccname.of(cc),country:cc}))
  .filter(x=>!q||x.name.toLocaleLowerCase("fr-FR").includes(q)||x.cc.toLowerCase().includes(q));
 state.hasMore=false;state.loading=false;render();
}
async function loadArticles(){
 const keyword=type==="sponsors"?/sponsor|partenariat|partnership|brand|marque|partenaire/i:
  /transfert|mercato|recrute|sign|join|roster|départ|arrival|transfer/i;
 state.loading=true;render();
 try{
  const r=await fetch("/api/news",{signal:AbortSignal.timeout(12000)});
  if(!r.ok)throw Error("news");
  const d=await r.json();const q=input.value.toLocaleLowerCase("fr-FR");
  state.items=(d.items||[]).filter(x=>keyword.test(x.title)&&(!q||(x.title+" "+x.source).toLocaleLowerCase("fr-FR").includes(q)));
 }catch(e){state.items=[]}
 state.loading=false;state.hasMore=false;render();
}
function refresh(){state.serial++;state.items=[];state.page=0;state.hasMore=false;state.partial=false;
 if(type==="countries")return renderCountries();
 if(type==="sponsors"||type==="transfers")return loadArticles();
 return fetchPage({reset:true});
}
let timer=0;
input.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(refresh,330)});
input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();clearTimeout(timer);refresh()}});
btn.addEventListener("click",()=>{clearTimeout(timer);refresh()});
loadMore.addEventListener("click",()=>fetchPage());
$("#openSearch")?.addEventListener("click",()=>{input.focus();input.scrollIntoView({behavior:"smooth",block:"center"})});
refresh();
})();
