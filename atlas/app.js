function boot(e){"use strict";var t={France:"FR",Germany:"DE","United Kingdom":"GB","South Korea":"KR","United States of America":"US",China:"CN",Brazil:"BR"},n={FR:{
name:"France",en:"France",pov:{lat:46.8,lng:2.6,alt:.55}},DE:{name:"Allemagne",en:"Germany",pov:{lat:51.2,lng:10.4,alt:.6}},GB:{name:"Royaume-Uni",en:"United Kingdom",
pov:{lat:54,lng:-2.5,alt:.65}},KR:{name:"Corée du Sud",en:"South Korea",pov:{lat:36.5,lng:127.8,alt:.55}},US:{name:"États-Unis",en:"United States",pov:{lat:39,lng:-97,
alt:1}},CN:{name:"Chine",en:"China",pov:{lat:35,lng:103,alt:1.1}},BR:{name:"Brésil",en:"Brazil",pov:{lat:-14,lng:-52,alt:1.1}}},a=[{id:"lol",name:"League of Legends",
short:"LoL",mono:"LoL",tier:1,aka:["lol"]},{id:"cs2",name:"Counter-Strike 2",short:"CS2",mono:"CS2",tier:1,aka:["cs","counter strike","csgo"]},{id:"val",name:"Valorant",
short:"Valorant",mono:"VAL",tier:1,aka:["valo"]},{id:"rl",name:"Rocket League",short:"Rocket League",mono:"RL",tier:1,aka:["rl"]},{id:"dota",name:"Dota 2",short:"Dota 2",
mono:"D2",tier:1,aka:[]},{id:"r6",name:"Rainbow Six Siege",short:"R6 Siege",mono:"R6",tier:2,aka:["r6","rainbow six"]},{id:"ow",name:"Overwatch 2",short:"Overwatch 2",
mono:"OW",tier:2,aka:["ow"]},{id:"apex",name:"Apex Legends",short:"Apex",mono:"AX",tier:2,aka:[]},{id:"cod",name:"Call of Duty",short:"Call of Duty",mono:"CoD",tier:2,
aka:["cod"]},{id:"fn",name:"Fortnite",short:"Fortnite",mono:"FN",tier:2,aka:[]},{id:"fc",name:"EA FC",short:"EA FC",mono:"FC",tier:2,aka:["fifa"]},{id:"fgc",
name:"Jeux de combat (FGC)",short:"FGC",mono:"FGC",tier:3,aka:["street fighter","sf6","tekken","jeux de combat","fighting","combat"]},{id:"aoe",name:"Age of Empires",
short:"AoE",mono:"AoE",tier:3,aka:["aoe"]},{id:"mlbb",name:"Mobile Legends",short:"Mobile Legends",mono:"ML",tier:3,aka:["mlbb"]},{id:"hok",name:"Honor of Kings",
short:"Honor of Kings",mono:"HoK",tier:3,aka:["hok"]},{id:"sc",name:"StarCraft",short:"StarCraft",mono:"SC",tier:3,aka:["sc2"]}],r=[{id:"vitality",name:"Team Vitality",
short:"VIT",city:"Paris",country:"FR",lat:48.8566,lng:2.3522,games:["lol","cs2","rl"]},{id:"kc",name:"Karmine Corp",short:"KC",city:"Paris",country:"FR",lat:48.8566,
lng:2.3522,games:["lol","val","rl"]},{id:"gm",name:"Gentle Mates",short:"GM",city:"Paris",country:"FR",lat:48.8566,lng:2.3522,games:["val","rl"]},{id:"g2",
name:"G2 Esports",short:"G2",city:"Berlin",country:"DE",lat:52.52,lng:13.405,games:["lol","cs2","val","rl"]},{id:"fnc",name:"Fnatic",short:"FNC",city:"Londres",
country:"GB",lat:51.5072,lng:-.1276,games:["lol","cs2","val"]},{id:"t1",name:"T1",short:"T1",city:"Séoul",country:"KR",lat:37.5665,lng:126.978,games:["lol","val"]},{
id:"c9",name:"Cloud9",short:"C9",city:"Los Angeles",country:"US",lat:34.0522,lng:-118.2437,games:["lol","val","cs2"]},{id:"nys",name:"New York Subliners",short:"NYS",
city:"New York",country:"US",lat:40.7128,lng:-74.006,games:["cod"]},{id:"jdg",name:"JD Gaming",short:"JDG",city:"Pékin",country:"CN",lat:39.9042,lng:116.4074,
games:["lol"]},{id:"loud",name:"LOUD",short:"LD",city:"São Paulo",country:"BR",lat:-23.55,lng:-46.633,games:["val","lol"]}],o=[{id:"faker",name:"Faker",game:"lol",
org:"t1",role:"Mid",cc:"KR"},{id:"zywoo",name:"ZywOo",game:"cs2",org:"vitality",role:"AWPer",cc:"FR"},{id:"ex1",ex:1,game:"lol",org:"g2",role:"Top",cc:"DE"},{id:"ex2",
ex:2,game:"lol",org:"kc",role:"Jungle",cc:"FR"},{id:"ex3",ex:3,game:"lol",org:"fnc",role:"ADC",cc:"GB"},{id:"ex4",ex:4,game:"lol",org:"vitality",role:"Support",cc:"FR"},{
id:"ex5",ex:5,game:"cs2",org:"g2",role:"IGL",cc:"DE"},{id:"ex6",ex:6,game:"val",org:"kc",role:"Duelist",cc:"FR"},{id:"ex7",ex:7,game:"val",org:"loud",role:"Controller",
cc:"BR"}],i={lol:["Top","Jungle","Mid","ADC","Support"],cs2:["IGL","Entry","AWPer","Lurker","Support"],val:["Duelist","Initiator","Controller","Sentinel"]},s=function(e){
return o.filter(function(t){return t.id===e})[0]};function l(e){return e.ex?me("Joueur exemple")+" "+e.ex:e.name}function c(e){
var t=e.replace(/[^A-Za-z0-9 ]/g,"").split(" ").filter(Boolean);return(t.length>1?t[0][0]+t[1][0]:e.slice(0,2)).toUpperCase()}var u=[{orgs:["kc"],tag:"ok",
title:"Annonce officielle d’un nouveau roster",meta:"Compte officiel de l’équipe · notification envoyée"},{orgs:["g2"],tag:"rumor",
title:"Un insider évoque un transfert, sans confirmation",meta:"Insider reconnu · affichée sans notification"},{orgs:["vitality"],tag:"ok",
title:"Nouveau partenaire maillot confirmé",meta:"Deux sources concordantes · notification envoyée"}],d=[{id:"lec",name:"LEC",game:"lol",region:"Europe",st:"live",
venue:["Berlin",52.52,13.405],watch:"https://lolesports.com",info:"https://liquipedia.net/leagueoflegends/LEC"},{id:"lck",name:"LCK",game:"lol",region:"Corée du Sud",
st:"live",venue:["Séoul",37.5665,126.978],watch:"https://lolesports.com",info:"https://liquipedia.net/leagueoflegends/LCK"},{id:"vct",name:"VCT Champions",game:"val",
region:"International",st:"live",venue:["Shanghai",31.23,121.47],watch:"https://valorantesports.com",info:"https://liquipedia.net/valorant/VCT"},{id:"rlcs",name:"RLCS",
game:"rl",region:"International",st:"soon",venue:["Lyon",45.76,4.84],watch:"https://www.twitch.tv/rocketleague",
info:"https://liquipedia.net/rocketleague/Rocket_League_Championship_Series"},{id:"epl",name:"ESL Pro League",game:"cs2",region:"International",st:"soon",
venue:["Munich",48.14,11.58],watch:"https://www.twitch.tv/eslcs",info:"https://liquipedia.net/counterstrike/ESL_Pro_League"},{id:"worlds",name:"Worlds",game:"lol",
region:"International",st:"done"}],p=function(e){return d.filter(function(t){return t.name===e})[0]},m={org:[],comp:[]};try{
var f=JSON.parse(localStorage.getItem("lobby.fav")||"null");f&&(m={org:f.org||[],comp:f.comp||[]})}catch(e){}function g(e,t){return m[e].indexOf(t)>-1}function h(e,t){
var n=g(e,t)
;return'<button class="star" type="button" data-act="fav" data-k="'+e+'" data-id="'+t+'" aria-pressed="'+n+'" aria-label="'+me(n?"Retirer des favoris":"Ajouter aux favoris")+'" title="'+me(n?"Retirer des favoris":"Ajouter aux favoris")+'"><svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8z"/></svg></button>'
}var v=!1,y=0;function b(e,t){if(e[t+"n"])return{id:S[F(e[t+"n"])]||null,short:e[t+"s"]||e[t+"n"],name:e[t+"n"],logo:e[t+"l"]||"",score:e["s"+t]};var n=ie(e[t])||{
id:null,short:"?",name:"Inconnu"};return{id:n.id,short:n.short,name:n.name,logo:"",score:null}}function E(e){
return g("org",e.a)||g("org",e.b)||p(e.comp)&&g("comp",p(e.comp).id)}var w=[{t:"17:00",game:"lol",comp:"LEC",a:"g2",b:"fnc"},{t:"19:30",game:"val",comp:"VCT Champions",
a:"kc",b:"loud"},{t:"20:00",game:"cs2",comp:"ESL Pro League",a:"vitality",b:"c9"},{t:"21:30",game:"rl",comp:"RLCS",a:"gm",b:"kc"}],k={live:"En cours",soon:"À venir",
done:"Terminée"},C={ok:"Confirmé",rumor:"Rumeur"},M={org:"Équipe",game:"Jeu",country:"Pays",player:"Joueur"},L=32,R=8,A=1.9,T=!1,S={},x={},H={},j={},P={},q={top:"Top",
jun:"Jungle",mid:"Mid",adc:"ADC",sup:"Support"},N={off:{},tiers:{},custom:[]};try{var D=JSON.parse(localStorage.getItem("lobby.games")||"null");D&&(N={off:D.off||{},
tiers:D.tiers||{},custom:D.custom||[]})}catch(e){}function G(){try{localStorage.setItem("lobby.games",JSON.stringify(N))}catch(e){}}function I(e){return!N.off[e]}
function F(e){return String(e||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/\b(esports?|gaming|team|club)\b/g,"").replace(/[^a-z0-9]/g,"")}
function z(e,t,n,a,r){var o=function(e,t,n){var a=F(e);return!Pe()&&(n||H[a])||t||x[a]||H[a]||""}(e,a,r)
;return'<span class="lgw '+(n||"md")+(o?"":" nolg")+'">'+(o?'<img src="'+re(o)+'" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">':"")+"<b>"+re(String(t||e).slice(0,4))+"</b></span>"
}function O(e,t){return z(e.name,e.short,t,e.logo,e.logoDark)}function B(e){return e.real?O(e,"xs"):Te(e.country)}function V(e){return e.city?ge(e.city):be(e.country)}
function U(e){return/^[A-Z]{2}$/.test(e)?be(e):ge(e)}function J(e){var t=0;return e.rosters&&Object.keys(e.rosters).forEach(function(n){t+=e.rosters[n].f||0}),t}
function K(e){return r.slice().sort(function(e,t){return J(t)-J(e)}).slice(0,e)}function Z(e,t,n){var a=F(e);t&&!x[a]&&(x[a]=t),n&&!H[a]&&(H[a]=n)}
N.custom.forEach(function(e){a.some(function(t){return t.id===e.id})||a.push(e)}),document.addEventListener("error",function(e){var t=e.target
;t&&"IMG"===t.tagName&&t.parentNode&&t.parentNode.classList&&t.parentNode.classList.contains("lgw")&&t.parentNode.classList.add("nolg")},!0);var W={falcons:{cod:1,apex:1,
ow:1},faze:{cod:1,apex:1},g2:{cod:1},cloud9:{cod:1},gentlemates:{cod:1},"100thieves":{cod:1,apex:1},heretics:{cod:1},koi:{cod:1},optic:{cod:1},fnatic:{apex:1},furia:{
apex:1},alliance:{apex:1},tsm:{apex:1},darkzero:{apex:1},disguised:{apex:1}};function Y(e){var a={};$e.forEach(function(e){a[e.iso]=e});var s=[],l=[],c={}
;if((e.orgs||[]).forEach(function(e){if(e.lg||e.ld){var t=a[e.cc]||(ve[e.cc]?{lat:ve[e.cc][0],lng:ve[e.cc][1]}:null);if(t&&e.g){var r=Object.keys(e.g).filter(function(e){
return oe(e)}),o=W[F(e.n)];if(o&&Object.keys(o).forEach(function(t){oe(t)&&!e.g[t]&&(e.g[t]={pid:0,f:8,pl:[]},r.push(t))}),r.length){r.sort(function(t,n){
return e.g[n].f-e.g[t].f});var i={id:e.id,name:e.n,short:e.s||e.n.slice(0,3).toUpperCase(),city:"",country:e.cc,lat:t.lat,lng:t.lng,games:r,logo:e.lg,logoDark:e.ld,
real:!0,rosters:e.g};!function(e,t){if(!n[e]){var a=e,r=e;try{a=new Intl.DisplayNames(["fr"],{type:"region"}).of(e),r=new Intl.DisplayNames(["en"],{type:"region"}).of(e)
}catch(e){}n[e]={name:a,en:r,pov:{lat:t.lat,lng:t.lng,alt:.9}}}}(e.cc,t),c[e.cc]=1,s.push(i),Z(i.name,e.lg,e.ld),r.forEach(function(t){e.g[t].pl.forEach(function(e){
l.push({id:"p"+e.id,real:!0,name:e.n,game:t,org:i.id,role:q[e.r]||e.r||"",cc:e.cc,img:e.im,first:e.fn,last:e.ln,age:e.a})})})}}}}),!(s.length<8)){s.sort(function(e,t){
return J(t)-J(e)}),r=s,o=l,T=!0,u.length=0,S={},r.forEach(function(e){S[F(e.name)]=e.id}),Object.keys(t).forEach(function(e){delete t[e]}),
Object.keys(he).forEach(function(e){c[he[e]]&&(t[e]=he[e])}),Object.keys(pn).forEach(function(e){delete pn[e]}),Object.keys(t).forEach(function(e){rt[e]&&(pn[t[e]]=rt[e])
}),$e.forEach(function(e){e.data=!!c[e.iso]}),m.org=m.org.filter(function(e){return!!ie(e)}),ke.recent=ke.recent.filter(function(e){return!!ie(e)}),
i.lol=["Top","Jungle","Mid","ADC","Support"],delete i.cs2,delete i.val;for(var d=w.length-1;d>=0;d--){var p=w[d];p.an||ie(p.a)&&ie(p.b)||w.splice(d,1)}bn(),gn(),qn(),
fn(),qe&&(Fe(),ct(!0))}}function _(){var e=ae("#panel"),t=e.scrollTop;fn(),e.scrollTop=t}var Q=[],X=!1;function $(){if(!X&&Q.length){X=!0;var e=Q.shift()
;fetch("/api/team?n="+encodeURIComponent(e.name)+"&g="+e.g).then(function(e){return 429===e.status?{busy:!0}:e.json()}).then(function(t){if(t.busy)return Q.unshift(e),
X=!1,void setTimeout($,35e3);if(t.error)j[e.k]={s:"err"};else if(t.found){t.ts=Date.now(),j[e.k]={s:"ok",d:t};try{localStorage.setItem("lobby.tx."+e.k,JSON.stringify(t))
}catch(e){}}else j[e.k]={s:"none"};X=!1,te(e.k),$()}).catch(function(){j[e.k]={s:"err"},X=!1,te(e.k),$()})}}function ee(e,t){if(e&&e.real&&t){var n=e.id+"|"+t,a=j[n]
;if(!a||"ok"!==a.s&&"loading"!==a.s&&"none"!==a.s){try{var r=JSON.parse(localStorage.getItem("lobby.tx."+n)||"null");if(r&&Date.now()-r.ts<432e5)return void(j[n]={s:"ok",
d:r})}catch(e){}"function"==typeof fetch&&"file:"!==location.protocol&&(j[n]={s:"loading"},Q.push({k:n,name:e.name,g:t}),$())}}}function te(e){var t=ke.view
;("org"===t.t&&0===e.indexOf(t.id+"|")||"roster"===t.t&&e===t.org+"|"+t.g)&&_()}function ne(e){var t=function(e){var t=F(e.name),n=w.filter(function(e){
return F(e.an)===t||F(e.bn)===t}),a=n.filter(function(e){return"running"===e.status})[0]||n.filter(function(e){return"not_started"===e.status})[0]||n[0];return{
id:a&&/worlds?\b|world championship|champions/i.test(a.comp)?"worlds":"regular",label:a?a.comp+(a.serie&&a.serie!==a.comp?" "+a.serie:""):""}
}(e),n=P[e.id]||P[F(e.name)]||null,a=n&&(n[t.id]||n.regular||n.worlds),r="worlds"===t.id?me("Maillot Worlds"):me("Maillot saison régulière");if(a&&a.img){var o=n&&n[t.id]
;return'<div><img class="kit-img" src="'+re(a.img)+'" alt="'+re(r)+'" loading="lazy" referrerpolicy="no-referrer"><span class="kit-n">'+re(a.label||r)+"</span><small>"+(o?re(t.label||r):me("Visuel du moment indisponible, dernier maillot connu"))+"</small></div>"
}return"<div>"+function(e){
return'<svg viewBox="0 0 200 180" role="img" aria-label="Silhouette de maillot"><path d="M60 10 L10 40 L30 80 L55 68 L55 170 L145 170 L145 68 L170 80 L190 40 L140 10 Q100 38 60 10 Z" fill="var(--bg)" stroke="var(--line)" stroke-width="2"/><text x="100" y="112" text-anchor="middle" font-family="Geist Mono, monospace" font-size="26" fill="var(--accent)">'+re(e.short)+"</text></svg>"
}(e)+'<span class="kit-n">'+re(r)+"</span><small>"+me("Visuel officiel pas encore collecté")+"</small></div>"}var ae=function(e){return document.querySelector(e)
},re=function(e){return String(e).replace(/[&<>"']/g,function(e){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[e]})},oe=function(e){
return a.filter(function(t){return t.id===e})[0]},ie=function(e){return r.filter(function(t){return t.id===e})[0]},se=function(e){return(e<10?"0":"")+e
},le=[["fr","Français"],["en","English"],["es","Español"],["de","Deutsch"]],ce="fr";try{var ue=localStorage.getItem("lobby.lang");if(ue&&le.some(function(e){
return e[0]===ue}))ce=ue;else{var de=(navigator.language||"fr").slice(0,2);le.some(function(e){return e[0]===de})&&(ce=de)}}catch(e){}var pe={en:{
"Rechercher une équipe, un joueur, un jeu ou un pays":"Search a team, player, game or country","Rechercher une équipe, un joueur, un jeu…":"Search a team, player, game…",
"Réglages":"Settings","Équipes":"Teams","Équipe":"Team",Jeu:"Game",Pays:"Country",Joueur:"Player",
"Glisse pour tourner, molette pour zoomer, clique un pays ou une équipe.":"Drag to rotate, scroll to zoom, click a country or a team.",Ciel:"Sky",
"Changer le moment de la journée":"Change the time of day","Ma position":"My location","Position indisponible":"Location unavailable","Vous êtes ici":"You are here",
Retour:"Back",Tous:"All","Niveau des jeux":"Game tier",Accueil:"Home",Jeux:"Games","Compétitions":"Competitions",Partenaires:"Partners",Partenariats:"Partnerships",
"Maquette. Équipes, compétitions et actualités sont des exemples, sans données vérifiées.":"Mockup. Teams, competitions and news are examples, with no verified data.",
"Aujourd’hui":"Today","Aujourd’hui · exemples":"Today · examples","Aucun match pour ce filtre.":"No match for this filter.",
"Aucune compétition pour ce filtre.":"No competition for this filter.","En cours":"Live","À venir":"Upcoming","Passées":"Past","Terminée":"Finished",
"Consultées récemment":"Recently viewed","Les plus consultées":"Most viewed","Actualités":"News",Exemple:"Example","Jeux par tier":"Games by tier","Aucun jeu":"No game",
"Confirmé":"Confirmed",Rumeur:"Rumor",
"Les partenariats (marque, équipe, roster) arrivent avec les vraies données.":"Partnerships (brand, team, roster) will arrive with real data.",
"Annonce officielle d’un nouveau roster":"Official announcement of a new roster",
"Compte officiel de l’équipe · notification envoyée":"Official team account · notification sent",
"Un insider évoque un transfert, sans confirmation":"An insider mentions a transfer, unconfirmed",
"Insider reconnu · affichée sans notification":"Known insider · shown without notification","Nouveau partenaire maillot confirmé":"New jersey partner confirmed",
"Deux sources concordantes · notification envoyée":"Two matching sources · notification sent","{n} équipes":"{n} teams","{n} équipe":"{n} team",
" avec ce filtre":" with this filter","Aucune organisation répertoriée pour ce pays dans la maquette.":"No organization listed for this country in the mockup.",
"Aucune équipe de ce pays pour ce filtre.":"No team from this country for this filter.",Rosters:"Rosters",Maillot:"Jersey",
"Roster en cours de collecte":"Roster being collected","Partenaire principal":"Main partner","Équipementier":"Kit supplier",
"Partenaires par roster":"Partners per roster","À renseigner":"To be filled in","Aucune source":"No source",
"Le visuel du maillot de la saison en cours viendra ici.":"The current season jersey will appear here.","Couleur de la carte":"Map color",Langue:"Language",
"Heure simulée":"Simulated time","Étoiles, soleil et lune":"Stars, sun and moon",Nuages:"Clouds","Relief des pays au survol":"Country relief on hover",
"Éclairer le globe selon l’heure":"Light the globe by time of day",
"Le ciel est calé sur Paris. En mode Auto, il suit ton heure réelle.":"The sky is based on Paris. In Auto mode it follows your real time.",
"Tier de chaque jeu":"Tier of each game",
"Dans la version finale, cet écran sera protégé par un accès administrateur. Ici, les changements ne sont pas enregistrés.":"In the final version this screen will be admin-only. Here, changes are not saved.",
Aube:"Dawn",Jour:"Day","Crépuscule":"Dusk",Nuit:"Night",Manuel:"Manual","Ciel : ":"Sky: ","Aucun résultat. Vérifie l’orthographe.":"No result. Check the spelling.",
Europe:"Europe","Corée du Sud":"South Korea",International:"International","Amérique du Nord":"North America","Amérique latine":"Latin America",Afrique:"Africa",
"Asie-Pacifique":"Asia-Pacific","Océanie":"Oceania","Jeux de combat (FGC)":"Fighting games (FGC)",Joueurs:"Players","Rôle":"Role","Tous les rôles":"All roles",
"Trier par":"Sort by",Nom:"Name",Titres:"Titles",Infos:"Info","Palmarès":"Honors",Historique:"History",Staff:"Staff",
"Aucun palmarès vérifié pour le moment. Les titres seront classés ici une fois les données branchées.":"No verified honors yet. Titles will be ranked here once data is connected.",
"Aucun historique vérifié pour le moment.":"No verified history yet.","Joueur exemple":"Example player",Coach:"Coach","Coach assistant":"Assistant coach",
Manager:"Manager","Créateur de contenu":"Content creator","Aucun joueur pour ce filtre.":"No player for this filter.",
"Roster en cours de collecte, aucun joueur renseigné.":"Roster being collected, no player listed yet.","Données d’exemple, non vérifiées.":"Example data, unverified.",
"Pays d’origine":"Home country","Équipe actuelle":"Current team",Londres:"London","Séoul":"Seoul","Pékin":"Beijing"},es:{
"Rechercher une équipe, un joueur, un jeu ou un pays":"Buscar un equipo, jugador, juego o país",
"Rechercher une équipe, un joueur, un jeu…":"Buscar un equipo, jugador, juego…","Réglages":"Ajustes","Équipes":"Equipos","Équipe":"Equipo",Jeu:"Juego",Pays:"País",
Joueur:"Jugador","Glisse pour tourner, molette pour zoomer, clique un pays ou une équipe.":"Arrastra para girar, rueda para hacer zoom, haz clic en un país o equipo.",
Ciel:"Cielo","Changer le moment de la journée":"Cambiar la hora del día","Ma position":"Mi ubicación","Position indisponible":"Ubicación no disponible",
"Vous êtes ici":"Estás aquí",Retour:"Volver",Tous:"Todos","Niveau des jeux":"Nivel de los juegos",Accueil:"Inicio",Jeux:"Juegos","Compétitions":"Competiciones",
Partenaires:"Socios",Partenariats:"Patrocinios",
"Maquette. Équipes, compétitions et actualités sont des exemples, sans données vérifiées.":"Maqueta. Equipos, competiciones y noticias son ejemplos, sin datos verificados.",
"Aujourd’hui":"Hoy","Aujourd’hui · exemples":"Hoy · ejemplos","Aucun match pour ce filtre.":"Ningún partido con este filtro.",
"Aucune compétition pour ce filtre.":"Ninguna competición con este filtro.","En cours":"En curso","À venir":"Próximas","Passées":"Pasadas","Terminée":"Terminada",
"Consultées récemment":"Vistos recientemente","Les plus consultées":"Más vistos","Actualités":"Noticias",Exemple:"Ejemplo","Jeux par tier":"Juegos por nivel",
"Aucun jeu":"Ningún juego","Confirmé":"Confirmado",Rumeur:"Rumor",
"Les partenariats (marque, équipe, roster) arrivent avec les vraies données.":"Los patrocinios (marca, equipo, roster) llegarán con los datos reales.",
"Annonce officielle d’un nouveau roster":"Anuncio oficial de un nuevo roster",
"Compte officiel de l’équipe · notification envoyée":"Cuenta oficial del equipo · notificación enviada",
"Un insider évoque un transfert, sans confirmation":"Un insider menciona un fichaje, sin confirmar",
"Insider reconnu · affichée sans notification":"Insider conocido · mostrado sin notificación",
"Nouveau partenaire maillot confirmé":"Nuevo patrocinador de camiseta confirmado",
"Deux sources concordantes · notification envoyée":"Dos fuentes coincidentes · notificación enviada","{n} équipes":"{n} equipos","{n} équipe":"{n} equipo",
" avec ce filtre":" con este filtro","Aucune organisation répertoriée pour ce pays dans la maquette.":"Ninguna organización registrada para este país en la maqueta.",
"Aucune équipe de ce pays pour ce filtre.":"Ningún equipo de este país con este filtro.",Rosters:"Rosters",Maillot:"Camiseta",
"Roster en cours de collecte":"Roster en recopilación","Partenaire principal":"Socio principal","Équipementier":"Proveedor de equipación",
"Partenaires par roster":"Socios por roster","À renseigner":"Por completar","Aucune source":"Sin fuente",
"Le visuel du maillot de la saison en cours viendra ici.":"La camiseta de la temporada actual aparecerá aquí.","Couleur de la carte":"Color del mapa",Langue:"Idioma",
"Heure simulée":"Hora simulada","Étoiles, soleil et lune":"Estrellas, sol y luna",Nuages:"Nubes","Relief des pays au survol":"Relieve de los países al pasar",
"Éclairer le globe selon l’heure":"Iluminar el globo según la hora",
"Le ciel est calé sur Paris. En mode Auto, il suit ton heure réelle.":"El cielo se basa en París. En modo Auto sigue tu hora real.",
"Tier de chaque jeu":"Nivel de cada juego",
"Dans la version finale, cet écran sera protégé par un accès administrateur. Ici, les changements ne sont pas enregistrés.":"En la versión final esta pantalla será solo para administradores. Aquí los cambios no se guardan.",
Aube:"Alba",Jour:"Día","Crépuscule":"Atardecer",Nuit:"Noche",Manuel:"Manual","Ciel : ":"Cielo: ",
"Aucun résultat. Vérifie l’orthographe.":"Sin resultados. Revisa la ortografía.",Europe:"Europa","Corée du Sud":"Corea del Sur",International:"Internacional",
"Amérique du Nord":"Norteamérica","Amérique latine":"Latinoamérica",Afrique:"África","Asie-Pacifique":"Asia-Pacífico","Océanie":"Oceanía",
"Jeux de combat (FGC)":"Juegos de lucha (FGC)",Joueurs:"Jugadores","Rôle":"Rol","Tous les rôles":"Todos los roles","Trier par":"Ordenar por",Nom:"Nombre",
Titres:"Títulos",Infos:"Info","Palmarès":"Palmarés",Historique:"Historial",Staff:"Staff",
"Aucun palmarès vérifié pour le moment. Les titres seront classés ici une fois les données branchées.":"Aún no hay palmarés verificado. Los títulos se ordenarán aquí cuando se conecten los datos.",
"Aucun historique vérifié pour le moment.":"Aún no hay historial verificado.","Joueur exemple":"Jugador de ejemplo",Coach:"Entrenador",
"Coach assistant":"Entrenador asistente",Manager:"Manager","Créateur de contenu":"Creador de contenido","Aucun joueur pour ce filtre.":"Ningún jugador con este filtro.",
"Roster en cours de collecte, aucun joueur renseigné.":"Roster en recopilación, ningún jugador registrado.",
"Données d’exemple, non vérifiées.":"Datos de ejemplo, sin verificar.","Pays d’origine":"País de origen","Équipe actuelle":"Equipo actual",Londres:"Londres",
"Séoul":"Seúl","Pékin":"Pekín"},de:{"Rechercher une équipe, un joueur, un jeu ou un pays":"Team, Spieler, Spiel oder Land suchen",
"Rechercher une équipe, un joueur, un jeu…":"Team, Spieler, Spiel suchen…","Réglages":"Einstellungen","Équipes":"Teams","Équipe":"Team",Jeu:"Spiel",Pays:"Land",
Joueur:"Spieler","Glisse pour tourner, molette pour zoomer, clique un pays ou une équipe.":"Ziehen zum Drehen, Scrollen zum Zoomen, Land oder Team anklicken.",
Ciel:"Himmel","Changer le moment de la journée":"Tageszeit ändern","Ma position":"Mein Standort","Position indisponible":"Standort nicht verfügbar",
"Vous êtes ici":"Du bist hier",Retour:"Zurück",Tous:"Alle","Niveau des jeux":"Spielstufe",Accueil:"Start",Jeux:"Spiele","Compétitions":"Wettbewerbe",
Partenaires:"Partner",Partenariats:"Partnerschaften",
"Maquette. Équipes, compétitions et actualités sont des exemples, sans données vérifiées.":"Mockup. Teams, Wettbewerbe und News sind Beispiele ohne geprüfte Daten.",
"Aujourd’hui":"Heute","Aujourd’hui · exemples":"Heute · Beispiele","Aucun match pour ce filtre.":"Kein Spiel für diesen Filter.",
"Aucune compétition pour ce filtre.":"Kein Wettbewerb für diesen Filter.","En cours":"Läuft","À venir":"Kommend","Passées":"Vergangen","Terminée":"Beendet",
"Consultées récemment":"Zuletzt angesehen","Les plus consultées":"Meistgesehen","Actualités":"News",Exemple:"Beispiel","Jeux par tier":"Spiele nach Stufe",
"Aucun jeu":"Kein Spiel","Confirmé":"Bestätigt",Rumeur:"Gerücht",
"Les partenariats (marque, équipe, roster) arrivent avec les vraies données.":"Partnerschaften (Marke, Team, Roster) kommen mit den echten Daten.",
"Annonce officielle d’un nouveau roster":"Offizielle Ankündigung eines neuen Rosters",
"Compte officiel de l’équipe · notification envoyée":"Offizieller Team-Account · Benachrichtigung gesendet",
"Un insider évoque un transfert, sans confirmation":"Ein Insider erwähnt einen Transfer, unbestätigt",
"Insider reconnu · affichée sans notification":"Bekannter Insider · ohne Benachrichtigung angezeigt",
"Nouveau partenaire maillot confirmé":"Neuer Trikotpartner bestätigt",
"Deux sources concordantes · notification envoyée":"Zwei übereinstimmende Quellen · Benachrichtigung gesendet","{n} équipes":"{n} Teams","{n} équipe":"{n} Team",
" avec ce filtre":" mit diesem Filter","Aucune organisation répertoriée pour ce pays dans la maquette.":"Keine Organisation für dieses Land im Mockup.",
"Aucune équipe de ce pays pour ce filtre.":"Kein Team aus diesem Land für diesen Filter.",Rosters:"Rosters",Maillot:"Trikot",
"Roster en cours de collecte":"Roster wird erfasst","Partenaire principal":"Hauptpartner","Équipementier":"Ausrüster","Partenaires par roster":"Partner pro Roster",
"À renseigner":"Noch auszufüllen","Aucune source":"Keine Quelle",
"Le visuel du maillot de la saison en cours viendra ici.":"Das Trikot der aktuellen Saison erscheint hier.","Couleur de la carte":"Kartenfarbe",Langue:"Sprache",
"Heure simulée":"Simulierte Uhrzeit","Étoiles, soleil et lune":"Sterne, Sonne und Mond",Nuages:"Wolken","Relief des pays au survol":"Länderrelief beim Überfahren",
"Éclairer le globe selon l’heure":"Globus nach Tageszeit beleuchten",
"Le ciel est calé sur Paris. En mode Auto, il suit ton heure réelle.":"Der Himmel richtet sich nach Paris. Im Auto-Modus folgt er deiner echten Zeit.",
"Tier de chaque jeu":"Stufe jedes Spiels",
"Dans la version finale, cet écran sera protégé par un accès administrateur. Ici, les changements ne sont pas enregistrés.":"In der finalen Version ist dieser Bildschirm nur für Admins. Hier werden Änderungen nicht gespeichert.",
Aube:"Morgengrauen",Jour:"Tag","Crépuscule":"Dämmerung",Nuit:"Nacht",Manuel:"Manuell","Ciel : ":"Himmel: ",
"Aucun résultat. Vérifie l’orthographe.":"Kein Ergebnis. Prüfe die Schreibweise.",Europe:"Europa","Corée du Sud":"Südkorea",International:"International",
"Amérique du Nord":"Nordamerika","Amérique latine":"Lateinamerika",Afrique:"Afrika","Asie-Pacifique":"Asien-Pazifik","Océanie":"Ozeanien",
"Jeux de combat (FGC)":"Kampfspiele (FGC)",Joueurs:"Spieler","Rôle":"Rolle","Tous les rôles":"Alle Rollen","Trier par":"Sortieren nach",Nom:"Name",Titres:"Titel",
Infos:"Infos","Palmarès":"Erfolge",Historique:"Verlauf",Staff:"Staff",
"Aucun palmarès vérifié pour le moment. Les titres seront classés ici une fois les données branchées.":"Noch keine geprüften Erfolge. Titel werden hier sortiert, sobald die Daten angebunden sind.",
"Aucun historique vérifié pour le moment.":"Noch kein geprüfter Verlauf.","Joueur exemple":"Beispielspieler",Coach:"Coach","Coach assistant":"Assistenzcoach",
Manager:"Manager","Créateur de contenu":"Content Creator","Aucun joueur pour ce filtre.":"Kein Spieler für diesen Filter.",
"Roster en cours de collecte, aucun joueur renseigné.":"Roster wird erfasst, noch kein Spieler eingetragen.",
"Données d’exemple, non vérifiées.":"Beispieldaten, ungeprüft.","Pays d’origine":"Herkunftsland","Équipe actuelle":"Aktuelles Team",Londres:"London","Séoul":"Seoul",
"Pékin":"Peking"}};function me(e,t){var n=pe[ce],a=n&&void 0!==n[e]?n[e]:e;return t&&Object.keys(t).forEach(function(e){a=a.replace("{"+e+"}",t[e])}),a}var fe={en:{
"New York":"New York",Moscou:"Moscow",Varsovie:"Warsaw","Dubaï":"Dubai","Le Caire":"Cairo",Singapour:"Singapore",Rome:"Rome",Barcelone:"Barcelona",Munich:"Munich",
Stockholm:"Stockholm",Istanbul:"Istanbul",Tokyo:"Tokyo",Mexico:"Mexico City","Pékin":"Beijing","Séoul":"Seoul",Londres:"London"},es:{"New York":"Nueva York",
Moscou:"Moscú",Varsovie:"Varsovia","Dubaï":"Dubái","Le Caire":"El Cairo",Singapour:"Singapur",Rome:"Roma",Barcelone:"Barcelona",Munich:"Múnich",Stockholm:"Estocolmo",
Istanbul:"Estambul",Tokyo:"Tokio",Mexico:"Ciudad de México",Sydney:"Sídney","Pékin":"Pekín","Séoul":"Seúl","Rio de Janeiro":"Río de Janeiro",Berlin:"Berlín",
Marseille:"Marsella"},de:{"New York":"New York",Moscou:"Moskau",Varsovie:"Warschau","Dubaï":"Dubai","Le Caire":"Kairo",Singapour:"Singapur",Rome:"Rom",
Barcelone:"Barcelona",Munich:"München",Stockholm:"Stockholm",Istanbul:"Istanbul",Tokyo:"Tokio",Mexico:"Mexiko-Stadt","Pékin":"Peking","Séoul":"Seoul",Londres:"London",
Marseille:"Marseille"}};function ge(e){var t=fe[ce];return t&&t[e]||e}var he={France:"FR",Germany:"DE","United Kingdom":"GB",Spain:"ES",Italy:"IT",Poland:"PL",
Sweden:"SE",Norway:"NO",Finland:"FI",Ukraine:"UA",Turkey:"TR",Russia:"RU","United States of America":"US",Canada:"CA",Mexico:"MX",Brazil:"BR",Argentina:"AR",
Colombia:"CO",Chile:"CL",Peru:"PE",Morocco:"MA",Algeria:"DZ",Egypt:"EG",Nigeria:"NG","South Africa":"ZA","Saudi Arabia":"SA",Iran:"IR",India:"IN",China:"CN",Japan:"JP",
"South Korea":"KR",Indonesia:"ID",Australia:"AU",Kazakhstan:"KZ",Portugal:"PT",Netherlands:"NL",Belgium:"BE",Switzerland:"CH",Denmark:"DK",Romania:"RO",Greece:"GR",
Thailand:"TH",Vietnam:"VN",Philippines:"PH","Dem. Rep. Congo":"CD",Ethiopia:"ET",Kenya:"KE",Pakistan:"PK",Iraq:"IQ",Mongolia:"MN"};!function(){var e;try{
e=new Intl.DisplayNames(["en"],{type:"region"})}catch(e){return}var t,n,a,r,o="ABCDEFGHIJKLMNOPQRSTUVWXYZ";for(t=0;t<26;t++)for(n=0;n<26;n++){a=o[t]+o[n];try{r=e.of(a)
}catch(e){r=null}r&&r!==a&&!he[r]&&(he[r]=a)}var i={"United States of America":"US",Turkey:"TR",Myanmar:"MM","Dem. Rep. Congo":"CD",Congo:"CG","Bosnia and Herz.":"BA",
"Dominican Rep.":"DO","Central African Rep.":"CF","S. Sudan":"SS","Solomon Is.":"SB","W. Sahara":"EH","Eq. Guinea":"GQ","Falkland Is.":"FK",eSwatini:"SZ",
"North Macedonia":"MK",Macedonia:"MK",Palestine:"PS",Czechia:"CZ","Ivory Coast":"CI","Côte d'Ivoire":"CI",Laos:"LA",Vietnam:"VN",Russia:"RU","South Korea":"KR",
"North Korea":"KP",Taiwan:"TW",Syria:"SY",Iran:"IR",Bolivia:"BO",Venezuela:"VE",Tanzania:"TZ",Moldova:"MD",Brunei:"BN"};Object.keys(i).forEach(function(e){he[e]=i[e]})}()
;var ve={HK:[22.32,114.17],SG:[1.35,103.82],MO:[22.2,113.55],BH:[26.07,50.55],MT:[35.9,14.5],CW:[12.12,-68.93],LU:[49.61,6.13],MU:[-20.2,57.5]};function ye(e){try{
return new Intl.DisplayNames([ce],{type:"region"}).of(e)||e}catch(t){return e}}function be(e){var t=n[e];return t?"fr"===ce?t.name:ye(e):e}function Ee(e){
return"fgc"===e.id?me(e.name):e.name}var we,ke={tier:"all",game:null,view:{t:"home"},tiers:{},home:"home",cst:"live",recent:[]};try{
ke.recent=JSON.parse(localStorage.getItem("lobby.recent")||"[]").filter(function(e){return r.some(function(t){return t.id===e})})}catch(e){}function Ce(e){
var t=e.games.filter(I);return!!t.length&&(ke.game?t.indexOf(ke.game)>-1:"all"===ke.tier||t.some(function(e){return ke.tiers[e]===ke.tier}))}function Me(e){
return r.some(function(t){return t.country===e&&Ce(t)})}function Le(e){var t=ae("#toast");t.textContent=e,t.classList.add("on"),clearTimeout(we),we=setTimeout(function(){
t.classList.remove("on")},2600)}function Re(e,t,n){for(var a=[],r=0;r<10;r++){var o=-Math.PI/2+r*Math.PI/5,i=r%2?.4*n:n
;a.push((e+Math.cos(o)*i).toFixed(2)+","+(t+Math.sin(o)*i).toFixed(2))}return'<polygon points="'+a.join(" ")+'"/>'}a.forEach(function(e){ke.tiers[e.id]=e.tier}),
Object.keys(N.tiers).forEach(function(e){ke.tiers[e]&&(ke.tiers[e]=N.tiers[e])});var Ae={
FR:'<rect width="10" height="20" fill="#0055a4"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ef4135"/>',
DE:'<rect width="30" height="6.7" fill="#000"/><rect y="6.7" width="30" height="6.7" fill="#dd0000"/><rect y="13.3" width="30" height="6.7" fill="#ffce00"/>',
GB:'<rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.5"/><path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="6"/><path d="M15 0V20M0 10H30" stroke="#c8102e" stroke-width="3.4"/>',
KR:'<rect width="30" height="20" fill="#fff"/><path d="M10.5 10A4.5 4.5 0 0 1 19.5 10A2.25 2.25 0 0 1 15 10A2.25 2.25 0 0 0 10.5 10Z" fill="#cd2e3a"/><path d="M19.5 10A4.5 4.5 0 0 1 10.5 10A2.25 2.25 0 0 1 15 10A2.25 2.25 0 0 0 19.5 10Z" fill="#0047a0"/><g fill="#000"><g transform="translate(6 4.6) rotate(-35)"><rect x="-2.2" y="-1.7" width="4.4" height=".8"/><rect x="-2.2" y="-.4" width="4.4" height=".8"/><rect x="-2.2" y=".9" width="4.4" height=".8"/></g><g transform="translate(24 4.6) rotate(35)"><rect x="-2.2" y="-1.7" width="4.4" height=".8"/><rect x="-2.2" y="-.4" width="4.4" height=".8"/><rect x="-2.2" y=".9" width="4.4" height=".8"/></g><g transform="translate(6 15.4) rotate(35)"><rect x="-2.2" y="-1.7" width="4.4" height=".8"/><rect x="-2.2" y="-.4" width="4.4" height=".8"/><rect x="-2.2" y=".9" width="4.4" height=".8"/></g><g transform="translate(24 15.4) rotate(-35)"><rect x="-2.2" y="-1.7" width="4.4" height=".8"/><rect x="-2.2" y="-.4" width="4.4" height=".8"/><rect x="-2.2" y=".9" width="4.4" height=".8"/></g></g>',
CN:'<rect width="30" height="20" fill="#de2910"/><g fill="#ffde00">'+Re(5,5.2,3)+Re(10,2,1)+Re(12,4.3,1)+Re(12,7.2,1)+Re(10,9.4,1)+"</g>",
BR:'<rect width="30" height="20" fill="#009c3b"/><polygon points="15,2 28,10 15,18 2,10" fill="#ffdf00"/><circle cx="15" cy="10" r="4.6" fill="#002776"/><path d="M10.6 9.3Q15 7.8 19.4 11" stroke="#fff" stroke-width=".9" fill="none"/>'
};function Te(e){
return Ae[e]?'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true">'+Ae[e]+"</svg>":/^[A-Z]{2}$/.test(e||"")&&"file:"!==location.protocol?'<img class="flag" src="https://flagcdn.com/w40/'+e.toLowerCase()+'.png" alt="" loading="lazy">':""
}!function(){for(var e="",t=0;t<13;t++)e+='<rect y="'+(20*t/13).toFixed(2)+'" width="30" height="'+(20/13+.05).toFixed(2)+'" fill="'+(t%2?"#fff":"#b22234")+'"/>'
;for(var n="",a=0;a<4;a++)for(var r=0;r<5;r++)n+='<circle cx="'+(1.4+2.2*r)+'" cy="'+(1.3+2.4*a)+'" r=".5" fill="#fff"/>'
;Ae.US=e+'<rect width="12.5" height="10.8" fill="#3c3b6e"/>'+n}();var Se={
cs2:"M21.7101 3.2348a.0218.0218 0 0 1-.0216-.0215c.001-.0815.003-.3698.004-.424 0-.1292-.1428-.1831-.2117-.0829-.0113.016-.1457.212-.2287.3323a.0244.0244 0 0 1-.0198.0103h-6.5508a.0473.0473 0 0 1-.0473-.0463l-.0131-.177a.0477.0477 0 0 1 .056-.0477l.335.0319a.059.059 0 0 0 .0624-.0445l.2441-.989a.0475.0475 0 0 0-.0295-.0542l-.2268-.0848a.0427.0427 0 0 1-.0263-.0295c-.0412-.1722-.3766-1.3235-1.9935-1.581-.7867-.125-1.302.2107-1.577.4784a1.594 1.594 0 0 0-.3018.4095l-.0965.2125c-.008.0164-.046.2157-.046.234l.0513.9815a.109.109 0 0 0 .0422.0856l.3546.153-.1958.3244a.055.055 0 0 1-.053.0402s-.417.0108-.6227.0192c-.3856.0155-1.2444.4858-1.8773 1.8385-.6219 1.3282-.724 1.5496-.724 1.5496a.0736.0736 0 0 1-.0684.0398l-.5776.0019c-.0356 0-.0736.0285-.0886.0608l-.8982 2.5428c-.0149.0323-.006.081.0173.1081l.627.3918a.059.059 0 0 1 .0195.059l-.3274.9664a.1916.1916 0 0 1-.0235.0618l-.4343.3824a.1056.1056 0 0 0-.0356.059l-.5978 1.5308a.0632.0632 0 0 1-.0608.0455l-.3355.0018a.1633.1633 0 0 0-.162.1488l-.2007 2.2883a1.7194 1.7194 0 0 1-.0159.1207l-.1583.908a.128.128 0 0 1-.0333.0553l-.5584.4263c-.2559.2443-.5988.6903-.7665 1.0015l-1.86 3.9235c-.045.0833-.0811.227-.0788.3221l.1321.2354c.002.0842-.0319.4559-.0707.5307L.817 23.6545a.0985.0985 0 0 0-.003.0856l.0309.0706.0932.1859 1.8913.0029c.1173.0106.247-.1396.2507-.3005l.1027-1.2965-.0268-.1952 3.6063-4.232c.0942-.1146.222-.3168.2861-.4506l1.7186-3.7892a.1712.1712 0 0 1 .1004-.088l.1086-.035a.1694.1694 0 0 1 .1827.0528c.1505.1807.5042.781.6765 1.0315.1425.2079.8495 1.2304 1.1582 1.5675.0853.0926.3481.198.4658.2696a.083.083 0 0 1 .029.1119l-1.0298 1.8083-.4549 2.1357a.9542.9542 0 0 0-.0356.1526l-.4118 1.4831c.003.1873-.141.2856-.1527.5064l-.15 1.084a.0581.0581 0 0 0 .0582.0614l2.5445.014c.0951-.0003.1902-.0045.2854-.0067a1.1049 1.1049 0 0 0 .0755-.0069c.1242-.0158.5629-.0754.75-.1503.1097-.0388.1809-.0819.2268-.1295.1855-.1935.2002-.278.2034-.3975.001-.0212-.011-.0726-.0283-.1049-.0053-.0117-.0316-.0382-.059-.0477l-1.1815-.3562a.3693.3693 0 0 1-.1889-.1338l-.3172-.469a.0865.0865 0 0 1 .0173-.0973l.618-.609a.2017.2017 0 0 0 .0483-.072l1.9036-4.488c.089-.285.0595-.6056 0-.9445-.044-.2504-.6854-1.3264-.8532-1.6236-.1476-.262-1.0677-1.8707-1.286-2.2517-.0793-.1376-.1894-.1328-.2287-.276l-.0726-1.1173a.0398.0398 0 0 1 .0356-.0505l.3312-.0276a.093.093 0 0 0 .0741-.0487l1.147-2.1544a.0958.0958 0 0 0-.002-.094l-.2349-.2907a.0874.0874 0 0 1-.001-.0875l.3515-.3796a.054.054 0 0 1 .0736-.0206l.9343.5266a.3819.3819 0 0 0 .186.0505c.259-.0019.6858-.1549.908-.2906a.3833.3833 0 0 0 .1386-.148l.4583-1.0703c.006-.0136.0262-.0117.029.0028l.1278.5953a.0635.0635 0 0 0 .0788.0501l1.3494-.3a.0662.0662 0 0 0 .05-.0786l-.318-1.3437a.0716.0716 0 0 1 .009-.0534l.1313-.2036a.281.281 0 0 0 .036-.0814l.1589-.725a.0408.0408 0 0 1 .0397-.0323l3.7327.0047a.0916.0916 0 0 0 .0932-.0931v-.6336a.022.022 0 0 1 .0216-.0216h1.4393a.0465.0465 0 0 0 .0464-.0463v-.2855a.0465.0465 0 0 0-.0464-.0463h-1.4398z",
dota:"M 9.817 23.607 L 9.471 23.313 L 9.003 23.273 C 8.419 23.225 8.147 23.172 7.817 23.041 L 7.559 22.938 L 7.281 23.048 C 7.045 23.143 6.467 23.229 6.028 23.236 C 6.004 23.236 5.964 23.18 5.939 23.111 C 5.911 23.041 5.862 22.974 5.824 22.961 C 5.789 22.949 5.527 23.007 5.237 23.094 L 4.712 23.252 L 4.523 23.161 C 4.285 23.045 4.185 23.047 3.787 23.168 C 3.484 23.262 3.446 23.264 3.203 23.212 C 2.84 23.136 2.537 23.141 1.854 23.238 C 1.11 23.344 1.094 23.344 0.875 23.194 C 0.728 23.094 0.648 23.069 0.469 23.069 C 0.266 23.069 0.244 23.06 0.221 22.965 C 0.206 22.906 0.225 22.787 0.264 22.688 C 0.376 22.41 0.42 21.736 0.432 20.125 L 0.444 18.62 L 0.655 18.635 L 0.863 18.65 L 0.895 17.78 C 0.911 17.302 0.927 16.611 0.93 16.246 L 0.935 15.586 L 0.823 15.506 C 0.518 15.283 0.532 15.315 0.405 14.588 C 0.339 14.211 0.274 13.658 0.259 13.358 C 0.234 12.826 0.236 12.811 0.334 12.7 L 0.434 12.586 L 0.682 12.799 C 0.82 12.916 0.937 12.993 0.948 12.969 C 0.984 12.856 0.871 11.508 0.813 11.338 C 0.775 11.238 0.747 11.101 0.747 11.03 C 0.747 10.962 0.679 10.778 0.594 10.618 L 0.443 10.329 L 0.494 9.816 C 0.561 9.136 0.475 8.636 0.19 8.034 L 0.065 7.763 L 0.144 7.09 L 0.228 6.416 L 0.14 6.067 L 0.049 5.717 L 0.154 5.326 L 0.255 4.933 L 0.14 4.553 L 0.021 4.174 L 0.164 3.774 C 0.305 3.385 0.308 3.364 0.305 2.73 C 0.303 2.016 0.228 1.551 0.08 1.365 C -0.047 1.203 -0.026 1.092 0.163 0.919 C 0.253 0.834 0.328 0.726 0.328 0.681 C 0.328 0.612 0.359 0.599 0.549 0.595 C 0.669 0.595 1.039 0.563 1.372 0.525 L 1.979 0.452 L 2.773 0.569 C 3.565 0.684 3.566 0.684 4.652 0.638 L 5.74 0.591 L 5.997 0.746 L 6.257 0.899 L 7.312 0.884 L 8.368 0.869 L 8.724 0.74 C 8.918 0.669 9.229 0.545 9.414 0.461 C 9.596 0.377 9.927 0.264 10.144 0.204 L 10.542 0.099 L 11.056 0.261 L 11.57 0.425 L 12.014 0.276 L 12.456 0.127 L 12.933 0.285 C 13.196 0.371 13.684 0.583 14.022 0.757 L 14.633 1.069 L 15.273 1.051 C 15.758 1.036 15.924 1.018 15.95 0.973 C 15.97 0.942 16.031 0.758 16.083 0.566 L 16.178 0.215 L 16.783 0.235 C 17.236 0.251 17.642 0.299 18.384 0.429 L 19.379 0.605 L 19.638 0.501 C 19.778 0.444 20.046 0.375 20.233 0.351 C 20.546 0.309 20.6 0.314 21.027 0.422 C 21.425 0.522 21.562 0.537 22.109 0.537 C 22.454 0.537 22.812 0.522 22.907 0.506 C 23.07 0.478 23.097 0.489 23.428 0.728 C 23.621 0.866 23.792 1.001 23.807 1.03 C 23.824 1.057 23.86 1.203 23.884 1.354 L 23.93 1.632 L 23.721 2.028 C 23.604 2.246 23.507 2.443 23.507 2.466 C 23.507 2.489 23.555 2.527 23.611 2.554 C 23.668 2.579 23.764 2.677 23.826 2.771 L 23.937 2.941 L 23.912 5.226 C 23.897 6.483 23.872 7.604 23.858 7.715 L 23.831 7.919 L 23.486 7.897 L 23.142 7.87 L 23.113 8.061 C 23.097 8.164 23.084 8.353 23.084 8.485 C 23.084 8.677 23.054 8.778 22.924 9.031 L 22.761 9.342 L 22.851 9.471 C 22.901 9.543 23.072 9.736 23.231 9.901 L 23.523 10.206 L 23.434 10.529 L 23.344 10.854 L 23.451 11.542 C 23.575 12.369 23.566 12.577 23.363 13.293 C 23.282 13.58 23.217 13.846 23.217 13.886 C 23.217 13.961 23.272 13.98 23.644 14.031 C 23.809 14.052 23.844 14.072 23.844 14.147 C 23.844 14.196 23.87 15.251 23.904 16.492 C 24.011 20.567 24.021 21.456 23.971 22.38 C 23.944 22.862 23.913 23.262 23.904 23.271 C 23.894 23.28 23.563 23.147 23.166 22.976 L 22.443 22.668 L 22.131 22.803 C 21.809 22.942 21.777 22.978 21.735 23.245 C 21.706 23.422 21.728 23.414 20.935 23.576 L 20.468 23.672 L 20.014 23.52 C 19.594 23.379 19.537 23.369 19.206 23.391 C 18.959 23.406 18.789 23.394 18.644 23.351 C 18.436 23.292 18.436 23.292 18.087 23.453 L 17.735 23.612 L 16.435 23.612 C 15.066 23.61 14.784 23.632 13.841 23.807 C 13.189 23.927 12.96 23.922 11.819 23.785 L 11.217 23.711 L 10.796 23.807 C 10.562 23.861 10.326 23.903 10.27 23.901 C 10.202 23.901 10.046 23.8 9.819 23.607 L 9.817 23.607 Z M 7.284 19.918 C 8.289 19.539 9.118 19.223 9.123 19.216 C 9.136 19.202 5.206 15.39 4.684 14.909 C 4.539 14.775 4.409 14.672 4.399 14.682 C 4.39 14.693 4.07 15.547 3.69 16.577 C 3.27 17.715 3.011 18.476 3.032 18.508 C 3.057 18.55 5.424 20.599 5.451 20.605 C 5.454 20.605 6.279 20.296 7.284 19.918 Z M 20.796 17.829 C 21.319 16.564 21.732 15.519 21.718 15.504 C 21.699 15.483 11.888 8.858 5.02 4.226 L 4.469 3.855 L 3.569 4.262 C 3.072 4.484 2.673 4.687 2.68 4.709 C 2.69 4.737 6.011 8.219 10.064 12.449 L 17.432 20.141 L 18.638 20.133 L 19.847 20.125 L 20.796 17.829 Z M 19.434 6.972 C 19.607 6.01 19.75 5.191 19.75 5.151 C 19.75 5.108 19.497 4.902 19.074 4.605 C 18.702 4.343 18.373 4.115 18.344 4.096 C 18.291 4.063 14.442 5.104 14.447 5.149 C 14.451 5.179 19.091 8.748 19.107 8.731 C 19.115 8.725 19.261 7.932 19.434 6.972 Z",
lol:"m1.912 0 1.212 2.474v19.053L1.912 24h14.73l1.337-4.682H8.33V0ZM12 1.516c-.913 0-1.798.112-2.648.312v1.74a9.738 9.738 0 0 1 2.648-.368c5.267 0 9.536 4.184 9.536 9.348a9.203 9.203 0 0 1-2.3 6.086l-.273.954-.602 2.112c2.952-1.993 4.89-5.335 4.89-9.122C23.25 6.468 18.213 1.516 12 1.516Zm0 2.673c-.924 0-1.814.148-2.648.414v13.713h8.817a8.246 8.246 0 0 0 2.36-5.768c0-4.617-3.818-8.359-8.529-8.359zM2.104 7.312A10.858 10.858 0 0 0 .75 12.576c0 1.906.492 3.7 1.355 5.266z",
val:"M23.792 2.152a.252.252 0 0 0-.098.083c-3.384 4.23-6.769 8.46-10.15 12.69-.107.093-.025.288.119.265 2.439.003 4.877 0 7.316.001a.66.66 0 0 0 .552-.25c.774-.967 1.55-1.934 2.324-2.903a.72.72 0 0 0 .144-.49c-.002-3.077 0-6.153-.003-9.23.016-.11-.1-.206-.204-.167zM.077 2.166c-.077.038-.074.132-.076.205.002 3.074.001 6.15.001 9.225a.679.679 0 0 0 .158.463l7.64 9.55c.12.152.308.25.505.247 2.455 0 4.91.003 7.365 0 .142.02.222-.174.116-.265C10.661 15.176 5.526 8.766.4 2.35c-.08-.094-.174-.272-.322-.184z"
};function xe(e,t){var n=Se[e.id]
;return'<span class="tile t'+ke.tiers[e.id]+(t?" sm":"")+(n?" ic":"")+'" aria-hidden="true">'+(n?'<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="'+n+'"/></svg>':re(e.mono))+"</span>"
}var He={};function je(){["sea","land","land-on","land-hover","stroke","atmo","monument"].forEach(function(e){var t;He[e]=(t="--"+e,
getComputedStyle(document.documentElement).getPropertyValue(t).trim())})}function Pe(){var e=document.documentElement.getAttribute("data-theme")
;return"light"===e||!e&&matchMedia("(prefers-color-scheme: light)").matches}je();var qe=null,Ne=null,De=[],Ge=[];function Ie(e){var n=t[e.properties.name]
;return e===Ne?He["land-hover"]:n&&Me(n)?He["land-on"]:He.land}function Fe(){qe&&(qe.polygonAltitude(function(){return.006}),qe.polygonStrokeColor(function(e){
var n=t[e.properties.name];return n&&Me(n)?"rgba(255,92,88,.8)":He.stroke}),qe.polygonCapColor(Ie),qe.polygonSideColor(function(){return He.stroke}),
qe.polygonStrokeColor(function(){return He.stroke}),qe&&!We&&(We=requestAnimationFrame(Ye)))}function ze(){if(qe){var e=qe.globeMaterial();e.color.set(He.sea),
e.specular&&e.specular.set(0),qe.atmosphereColor(He.atmo),De.forEach(function(e){e.color.set(He.monument),e.emissive&&e.emissive.set(He.monument)}),
Oe.forEach(function(e){e.color.set(He.stroke)}),Fe()}}var Oe=[];function Be(){var e=new THREE.MeshStandardMaterial({color:He.monument,roughness:.78,metalness:.05,
emissive:He.monument,emissiveIntensity:.24});return De.push(e),e}function Ve(e,t,n,a,r){
var o=(new THREE.Vector3).subVectors(t,e),i=o.length(),s=new THREE.Mesh(new THREE.CylinderGeometry(a,n,i,6),r);return s.position.copy(e).add(t).multiplyScalar(.5),
s.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),o.normalize()),s}function Ue(e,t,n,a,r,o,i){var s=new THREE.Mesh(new THREE.BoxGeometry(e,t,n),i)
;return s.position.set(a,r+t/2,o),s}var Je={eiffel:function(){var e=new THREE.Group,t=Be(),n=THREE.Vector3;return[-1,1].forEach(function(a){[-1,1].forEach(function(r){
e.add(Ve(new n(1.5*a,0,1.5*r),new n(.45*a,2.6,.45*r),.15,.1,t)),e.add(Ve(new n(.45*a,2.6,.45*r),new n(.14*a,4.4,.14*r),.1,.06,t))})}),[-1,1].forEach(function(a){
e.add(Ve(new n(1.2*a,.5,1.2),new n(1.2*a,.5,-1.2),.05,.05,t)),e.add(Ve(new n(1.2,.5,1.2*a),new n(-1.2,.5,1.2*a),.05,.05,t))}),[-1,1].forEach(function(a){
e.add(Ve(new n(1*a,.2,1),new n(.7*a,1.55,-.7),.025,.025,t)),e.add(Ve(new n(1*a,.2,-1),new n(.7*a,1.55,.7),.025,.025,t))}),e.add(Ue(1.95,.14,1.95,0,1.55,0,t)),
e.add(Ue(.85,.12,.85,0,3.4,0,t)),e.add(Ve(new n(0,4.3,0),new n(0,6.2,0),.07,.015,t)),e},liberty:function(){var e=new THREE.Group,t=Be();e.add(Ue(1.1,1.3,1.1,0,0,0,t))
;var n=new THREE.Mesh(new THREE.ConeGeometry(.5,1.7,16),t);n.position.y=2.15,e.add(n);var a=new THREE.Mesh(new THREE.SphereGeometry(.22,14,12),t);a.position.y=3.2,
e.add(a),e.add(Ve(new THREE.Vector3(.18,2.7,0),new THREE.Vector3(.45,4.2,0),.07,.06,t));var r=new THREE.Mesh(new THREE.SphereGeometry(.14,10,8),t)
;r.position.set(.47,4.35,0),e.add(r);for(var o=0;o<5;o++){var i=.45*o-.9
;e.add(Ve(new THREE.Vector3(0,3.36,0),new THREE.Vector3(.32*Math.sin(i),3.62,.32*Math.cos(i)*.4),.025,.012,t))}return e},skyline:function(){
for(var e=new THREE.Group,t=Be(),n=11,a=function(){return((n=16807*n%2147483647)-1)/2147483646},r=-3;r<=3;r++)for(var o=-1;o<=1;o++)if(0!==r||0!==o){
var i=.3+.22*a(),s=.6+a()*(2.3-.25*Math.abs(r));e.add(Ue(i,s,i,.62*r+.1*(a()-.5),0,.62*o+.1*(a()-.5),t))}return e.add(Ue(.5,2.6,.5,0,0,0,t)),
e.add(Ue(.36,.9,.36,0,2.6,0,t)),e.add(Ue(.2,.6,.2,0,3.5,0,t)),e.add(Ve(new THREE.Vector3(0,4.1,0),new THREE.Vector3(0,4.9,0),.04,.01,t)),e},bigben:function(){
var e=new THREE.Group,t=Be();e.add(Ue(.6,3.2,.6,0,0,0,t)),e.add(Ue(.78,.5,.78,0,3.2,0,t));var n=new THREE.Mesh(new THREE.ConeGeometry(.5,1.2,4),t)
;return n.rotation.y=Math.PI/4,n.position.y=4.3,e.add(n),e},tower:function(){var e=new THREE.Group,t=Be(),n=THREE.Vector3;e.add(Ve(new n(0,0,0),new n(0,3.4,0),.22,.1,t))
;var a=new THREE.Mesh(new THREE.SphereGeometry(.5,16,12),t);return a.position.y=3.5,e.add(a),e.add(Ve(new n(0,3.9,0),new n(0,5.6,0),.07,.015,t)),e}};function Ke(e){
var t,n=new THREE.Group,a=Je[e]();t=[],a.traverse(function(e){e.isMesh&&t.push(e)}),t.forEach(function(e){
var t=new THREE.LineSegments(new THREE.EdgesGeometry(e.geometry,18),new THREE.LineBasicMaterial({color:He.stroke,transparent:!0,opacity:.32}));Oe.push(t.material),
e.add(t)}),n.add(a),n.rotation.x=-Math.PI/2,n.scale.setScalar(.95);var r=new THREE.Group;return r.add(n),r.visible=!1,r}Je.colosseum=function(){
var e=new THREE.Group,t=Be();t.side=THREE.DoubleSide;var n=new THREE.Mesh(new THREE.CylinderGeometry(1.5,1.5,.9,32,1,!0),t);n.position.y=.45,e.add(n)
;var a=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.5,.6,32,1,!0),t);a.position.y=1.2,e.add(a);var r=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,.08,32),t)
;return r.position.y=.04,e.add(r),e},Je.pyramids=function(){var e=new THREE.Group,t=Be();return[[1.5,1.8,-.4,0],[1,1.2,1.5,.6],[.65,.8,2.6,1.1]].forEach(function(n){
var a=new THREE.Mesh(new THREE.ConeGeometry(n[0],n[1],4),t);a.rotation.y=Math.PI/4,a.position.set(n[2],n[1]/2,n[3]),e.add(a)}),e},Je.burj=function(){
var e=new THREE.Group,t=Be(),n=0;return[[.5,.42,1.2],[.42,.34,1.1],[.34,.26,1],[.26,.18,.9]].forEach(function(a){
var r=new THREE.Mesh(new THREE.CylinderGeometry(a[1],a[0],a[2],10),t);r.position.y=n+a[2]/2,e.add(r),n+=a[2]}),
e.add(Ve(new THREE.Vector3(0,n,0),new THREE.Vector3(0,n+1.3,0),.1,.012,t)),e},Je.tokyo=function(){var e=new THREE.Group,t=Be(),n=THREE.Vector3
;return[-1,1].forEach(function(a){[-1,1].forEach(function(r){e.add(Ve(new n(1*a,0,1*r),new n(.22*a,3.2,.22*r),.1,.07,t))})}),e.add(Ue(1.2,.12,1.2,0,1.3,0,t)),
e.add(Ue(.6,.1,.6,0,2.6,0,t)),e.add(Ve(new n(0,3.2,0),new n(0,4.8,0),.07,.012,t)),e},Je.pearl=function(){var e=new THREE.Group,t=Be(),n=THREE.Vector3
;[0,2.1,4.2].forEach(function(a){e.add(Ve(new n(.7*Math.cos(a),0,.7*Math.sin(a)),new n(0,2,0),.07,.06,t))});var a=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12),t)
;a.position.y=1.2,e.add(a);var r=new THREE.Mesh(new THREE.SphereGeometry(.62,18,14),t);return r.position.y=2.6,e.add(r),
e.add(Ve(new n(0,3.2,0),new n(0,4.6,0),.06,.012,t)),e},Je.temple=function(){var e=new THREE.Group,t=Be(),n=0,a=function(a,r){
var o=new THREE.Mesh(new THREE.CylinderGeometry(a,a,r,20),t);o.position.y=n+r/2,e.add(o),n+=r},r=function(a,r){var o=new THREE.Mesh(new THREE.ConeGeometry(a,r,20),t)
;o.position.y=n+r/2,e.add(o),n+=r};return a(1.3,.25),a(.8,.45),r(1.05,.35),a(.6,.4),r(.85,.32),a(.42,.35),r(.65,.45),
e.add(Ve(new THREE.Vector3(0,n,0),new THREE.Vector3(0,n+.5,0),.05,.01,t)),e},Je.christ=function(){var e=new THREE.Group,t=Be();e.add(Ue(.9,1,.9,0,0,0,t))
;var n=new THREE.Mesh(new THREE.CylinderGeometry(.16,.26,1.5,10),t);n.position.y=1.75,e.add(n),e.add(Ue(2.1,.12,.14,0,2.25,0,t))
;var a=new THREE.Mesh(new THREE.SphereGeometry(.15,10,8),t);return a.position.y=2.7,e.add(a),e},Je.sagrada=function(){var e=new THREE.Group,t=Be()
;return e.add(Ue(2.2,.5,.9,0,0,0,t)),[[-.8,1.9],[-.4,2.6],[0,3.4],[.4,2.6],[.8,1.9]].forEach(function(n){
var a=new THREE.Mesh(new THREE.CylinderGeometry(.13,.17,n[1],8),t);a.position.set(n[0],.5+n[1]/2,0),e.add(a);var r=new THREE.Mesh(new THREE.ConeGeometry(.17,.6,8),t)
;r.position.set(n[0],.5+n[1]+.3,0),e.add(r)}),e},Je.opera=function(){var e=new THREE.Group,t=Be();return e.add(Ue(2.2,.2,1,0,0,0,t)),
[[-.7,.75,.2],[.1,.95,0],[.8,.6,-.2]].forEach(function(n){var a=new THREE.Mesh(new THREE.SphereGeometry(n[1],16,10,0,2*Math.PI,0,Math.PI/2),t);a.position.set(n[0],.2,0),
a.scale.set(.8,1,.8),a.rotation.z=n[2],e.add(a)}),e},Ge=[{lat:48.8584,lng:2.2945,k:"eiffel",cc:"FR"},{lat:40.73,lng:-74.38,k:"liberty",cc:"US"},{lat:40.99,lng:-73.95,
k:"skyline",cc:"US"},{lat:51.5007,lng:-.1246,k:"bigben",cc:"GB"},{lat:37.5512,lng:126.9882,k:"tower",cc:"KR"},{lat:52.5208,lng:13.4094,k:"tower",cc:"DE"},{lat:41.94,
lng:12.69,k:"colosseum",cc:"IT"},{lat:29.9792,lng:31.1342,k:"pyramids",cc:"EG"},{lat:24.71,lng:55.4,k:"burj",cc:"AE"},{lat:35.6586,lng:139.7454,k:"tokyo",cc:"JP"},{
lat:31.34,lng:121.53,k:"pearl",cc:"CN"},{lat:39.8822,lng:116.4066,k:"temple",cc:"CN"},{lat:-22.61,lng:-43.01,k:"christ",cc:"BR"},{lat:41.75,lng:1.97,k:"sagrada",cc:"ES"
},{lat:-33.42,lng:150.97,k:"opera",cc:"AU"}];var Ze=.006,We=0;function Ye(){var e=!1;Ge.forEach(function(t){if(t.obj){var n=Ze,a=void 0===t.lift?Ze:t.lift,r=a+.3*(n-a)
;Math.abs(n-r)<3e-4?r=n:e=!0,t.lift=r,Object.assign(t.obj.position,qe.getCoords(t.lat,t.lng,r))}}),We=e?requestAnimationFrame(Ye):0}var _e=!1;function Qe(){
!_e&&qe&&(_e=!0,requestAnimationFrame(function(){_e=!1;var e=qe.pointOfView().altitude;Ge.forEach(function(t){t.obj&&(t.obj.visible=e<1.2&&e>.5)}),
ae("#globe").classList.toggle("far",e>1.5),ae("#globe").classList.toggle("mid",e>.45),
ae("#globe").style.setProperty("--dot",Math.max(3,Math.min(6,10-2.4*e)).toFixed(1)+"px"),zt(),ct()}))}var Xe="",$e=[];e.features.forEach(function(e){
var n=e.properties.name,a=he[n];if(a){var r="Polygon"===e.geometry.type?[e.geometry.coordinates]:e.geometry.coordinates,o=null,i=-1;r.forEach(function(e){
var t=999,n=-999,a=999,r=-999;e[0].forEach(function(e){t=Math.min(t,e[0]),n=Math.max(n,e[0]),a=Math.min(a,e[1]),r=Math.max(r,e[1])});var s=(n-t)*(r-a);s>i&&(i=s,
o=[(t+n)/2,(a+r)/2])});var s={France:[2.4,46.6],"United States of America":[-98,39.5],Canada:[-100,59],Russia:[95,62],Norway:[9,61.5],"United Kingdom":[-2.3,53.3]}[n]
;s&&(o=s),$e.push({iso:a,lng:o[0],lat:o[1],data:!!t[n]})}})
;var et,tt=[["Madrid",40.42,-3.7],["Rome",41.9,12.5],["Istanbul",41.01,28.98],["Moscou",55.75,37.62],["Dubaï",25.2,55.27],["Tokyo",35.68,139.69],["Singapour",1.35,103.82],["Sydney",-33.87,151.21],["Toronto",43.65,-79.38],["Mexico",19.43,-99.13],["Rio de Janeiro",-22.91,-43.17],["Chicago",41.88,-87.63]],nt={
EU:{n:"Europe",ll:[22,53]},MENA:{n:"MENA",ll:[20,26]},NA:{n:"Amérique du Nord",ll:[-102,46]},LATAM:{n:"Amérique latine",ll:[-62,-12]},AF:{n:"Afrique",ll:[21,-4]},APAC:{
n:"Asie-Pacifique",ll:[102,31]},OCE:{n:"Océanie",ll:[140,-26]}
},at=["Morocco","W. Sahara","Algeria","Tunisia","Libya","Egypt","Israel","Palestine","Lebanon","Syria","Jordan","Iraq","Iran","Saudi Arabia","Yemen","Oman","United Arab Emirates","Qatar","Kuwait","Bahrain"],rt={}
;et={Russia:"EU",Kazakhstan:"EU",Uzbekistan:"EU",Turkmenistan:"EU",Kyrgyzstan:"EU",Tajikistan:"EU",Turkey:"EU",Cyprus:"EU",Greenland:"NA"},e.features.forEach(function(e){
var t=e.properties.name,n="Polygon"===e.geometry.type?[e.geometry.coordinates]:e.geometry.coordinates,a=null,r=-1;n.forEach(function(e){var t=999,n=-999,o=999,i=-999
;e[0].forEach(function(e){t=Math.min(t,e[0]),n=Math.max(n,e[0]),o=Math.min(o,e[1]),i=Math.max(i,e[1])});var s=(n-t)*(i-o);s>r&&(r=s,a=[(t+n)/2,(o+i)/2])})
;var o,i=a[0],s=a[1];o=et[t]?et[t]:s<-10&&i>100?"OCE":i<-25?s>=30?"NA":"LATAM":at.indexOf(t)>-1?"MENA":i<=60&&s>=35.5?"EU":i<=55&&s<36?"AF":"APAC",rt[t]=o});var ot=[]
;!function(){var t={},n=function(e){return e[0].toFixed(3)+","+e[1].toFixed(3)};e.features.forEach(function(e){var a=rt[e.properties.name]
;("Polygon"===e.geometry.type?[e.geometry.coordinates]:e.geometry.coordinates).forEach(function(e){e.forEach(function(e){for(var r=0;r<e.length-1;r++){
var o=n(e[r]),i=n(e[r+1]),s=o<i?o+"|"+i:i+"|"+o;(t[s]=t[s]||{a:e[r],b:e[r+1],ak:o,bk:i,r:{}}).r[a]=1}})})});var a=Object.keys(t).map(function(e){return t[e]
}).filter(function(e){return Object.keys(e.r).length>1}),r={};a.forEach(function(e,t){(r[e.ak]=r[e.ak]||[]).push(t),(r[e.bk]=r[e.bk]||[]).push(t)});var o={}
;function i(e){for(var t=r[e]||[],n=0;n<t.length;n++)if(!o[t[n]])return t[n];return-1}a.forEach(function(e,t){if(!o[t]){o[t]=1;for(var n,r=[e.a,e.b],s=e.bk;(n=i(s))>-1;){
o[n]=1;var l=a[n];l.ak===s?(r.push(l.b),s=l.bk):(r.push(l.a),s=l.ak)}for(var c=e.ak;(n=i(c))>-1;){o[n]=1;var u=a[n];u.ak===c?(r.unshift(u.b),c=u.bk):(r.unshift(u.a),
c=u.ak)}ot.push(r)}})}();var it=null;function st(){var e={};return d.forEach(function(t){
if(!(!t.venue||!t.verified||"done"===t.st||ke.game&&t.game!==ke.game||"all"!==ke.tier&&ke.tiers[t.game]!==ke.tier)){var n=e[t.venue[0]]=e[t.venue[0]]||{city:t.venue[0],
lat:t.venue[1],lng:t.venue[2],names:[],live:!1,fav:!1};n.names.push(t.name),"live"===t.st&&(n.live=!0)}}),Object.keys(e).map(function(t){return e[t]})}function lt(e){
var t=function(e){var t;if("country"===e.kind)return(t=document.createElement("span")).className="lbl-country"+(e.data?" has":""),t.textContent=e.name,t
;if("region"===e.kind)return e.count?((t=document.createElement("button")).type="button",t.className="lbl-region act",t.style.pointerEvents="auto",
t.innerHTML="<em>"+re(e.name)+"</em><b>"+e.count+"</b>",t.addEventListener("click",function(t){t.stopPropagation(),pt(e.lat,e.lng,.6,1200)}),
t):((t=document.createElement("span")).className="lbl-region",t.textContent=e.name,t);if("me"===e.kind)return(t=document.createElement("span")).className="lbl-me",
t.innerHTML="<i></i><em>"+re(me("Vous êtes ici"))+"</em>",t;if("event"===e.kind)return(t=document.createElement("button")).type="button",
t.className="evt"+(e.live?" live":""),t.style.pointerEvents="auto",t.innerHTML="<i></i><span>"+re(ge(e.city))+"</span><small>"+re(e.names.join(" · "))+"</small>",
t.addEventListener("click",function(t){t.stopPropagation(),pt(e.lat,e.lng,.45,1200)}),t;if("town"===e.kind)return(t=document.createElement("span")).className="lbl-town",
t.textContent=e.name,t;(t=document.createElement("button")).type="button",t.className="pin",t.style.pointerEvents="auto","city"===e.kind?(t.classList.add("cluster"),
t.title=U(e.city)+" : "+me(e.list.length>1?"{n} équipes":"{n} équipe",{n:e.list.length}),
t.innerHTML=Te(e.list[0].country)+"<span>"+re(U(e.city))+"</span><b>"+e.list.length+"</b>",t.addEventListener("click",function(t){t.stopPropagation(),
pt(e.lat,e.lng,.3,1200)})):(g("org",e.org.id)&&t.classList.add("fav"),t.title=e.org.name,t.classList.add("club"),
t.innerHTML=(e.org.real?O(e.org,"sm"):'<span class="lgw sm nolg"><b>'+re(e.org.short.slice(0,4))+"</b></span>")+"<span>"+re(e.org.short)+"</span>",
t.addEventListener("click",function(t){t.stopPropagation(),Kt(e.org.id)}));return t}(e);return t.style.opacity="0",t}function ct(e){if(qe){
var t=qe.pointOfView().altitude,n=function(e){return e>1.5?"g":e>1.15?"h":e>1?"i":e>.75?"m":e>.45?"c":e>.4?"d":String(Math.round(10*e))
}(t),a=ce+(it?"u":"")+n+"|"+m.org.join()+"|"+st().map(function(e){return e.city+e.names.join()}).join()+"|"+r.filter(Ce).map(function(e){return e.id}).join()
;if(e||a!==Xe){Xe=a;var o=function(e){var t=[],n={},a=st(),o=a.map(function(e){return e.city}),i={};$e.forEach(function(e){i[e.iso]=e});var s=r.filter(Ce),l=e>.9,c=e>.4
;if(l){var u={};s.forEach(function(e){var t=pn[e.country];t&&(u[t]=(u[t]||0)+1)}),Object.keys(nt).forEach(function(e){t.push({kind:"region",name:me(nt[e].n),
count:u[e]||0,lat:nt[e].ll[1],lng:nt[e].ll[0]})})}else e>.4&&$e.forEach(function(e){e.data||t.push({kind:"country",name:ye(e.iso),lat:e.lat,lng:e.lng,data:e.data})})
;return e<=1.15&&a.forEach(function(e){t.push({kind:"event",city:e.city,names:e.names,live:e.live,lat:e.lat,lng:e.lng})}),e<=.7&&tt.filter(function(e){
return o.indexOf(e[0])<0}).forEach(function(e){t.push({kind:"town",name:ge(e[0]),lat:e[1],lng:e[2]})}),it&&t.push({kind:"me",lat:it.lat,lng:it.lng}),
l||(s.forEach(function(e){var t=c?e.country:e.city||e.country;(n[t]=n[t]||[]).push(e)}),Object.keys(n).forEach(function(a){var r=n[a],o=r[0],s=c&&i[a]?i[a]:o
;if(e>.4)t.push({kind:"city",list:r,city:c?ye(a):a,lat:s.lat,lng:s.lng,country:o.country});else if(1!==r.length){var l=Math.max(1.5,5*e)*(1+r.length/9)
;r.forEach(function(e,n){var a=n/r.length*Math.PI*2+(2===r.length?0:Math.PI/6);t.push({kind:"club",org:e,lat:e.lat+Math.sin(a)*l*.45,
lng:e.lng+Math.cos(a)*l/Math.cos(e.lat*Math.PI/180)})})}else t.push({kind:"club",org:o,lat:o.lat,lng:o.lng})})),t}(t);qe.htmlElementsData(o),qe.pointsData([])}}}
var ut=null;var dt=null;function pt(e,t,n,a,r){if(qe){dt=r?{lat:e,lng:t}:null;var o,i,s=qe.controls(),l=qe.camera().position.constructor;if(s.autoRotate=!1,r){
var c=qe.getCoords(e,t,0),u=new l(c.x,c.y,c.z),d=u.clone().normalize(),p=new l(0,1,0).cross(d);p.lengthSq()<1e-6&&p.set(1,0,0),p.normalize()
;var m=d.clone().cross(p).normalize(),f=100*n,g=r*Math.PI/180;o=u.clone().add(d.clone().multiplyScalar(f*Math.cos(g))).sub(m.clone().multiplyScalar(f*Math.sin(g))),i=u,
s.minDistance=4}else{var h=qe.getCoords(e,t,n);o=new l(h.x,h.y,h.z),i=new l(0,0,0),s.minDistance=112}s.target.setScalar=function(){return this},s.zoomToCursor=!1,
function(e,t,n,a){
var r=qe.camera(),o=qe.controls(),i=r.quaternion.constructor,s=r.position.clone(),l=o.target.clone(),c=s.length(),u=e.length(),d=s.clone().normalize(),p=(new i).setFromUnitVectors(d,e.clone().normalize()),m=new i,f=performance.now(),g=ut={}
;function h(e){m.copy(new i).slerp(p,e),r.position.copy(d.clone().applyQuaternion(m).multiplyScalar(c+(u-c)*e)),o.target.lerpVectors(l,t,e),o.update()}if(!n)return h(1),
ut=null,void(a&&a());!function e(t){if(ut===g){var r=Math.min(1,(t-f)/n);h(r<.5?4*r*r*r:1-Math.pow(-2*r+2,3)/2),r<1?requestAnimationFrame(e):(ut=null,a&&a())}}(f)
}(o,i,void 0===a?1300:a,function(){r||(delete s.target.setScalar,s.zoomToCursor=!0,s.target.set(0,0,0))})}}var mt=48.8566,ft=2.3522,gt=Math.PI/180,ht={mode:"auto",
hour:19,on:!0,light:!0,clouds:!0,relief:!1,sound:!1,custom:null,cw:"signal"};try{var vt=JSON.parse(localStorage.getItem("atlas.sky")||"null")
;vt&&("lagon"!==vt.cw&&"ardoise"!==vt.cw||(vt.cw="signal"),ht.mode="auto",ht.hour="number"==typeof vt.hour?vt.hour:19,ht.on=!1!==vt.on,ht.light=!1!==vt.light,
ht.clouds=!1!==vt.clouds,ht.relief=!0===vt.relief,ht.sound=!0===vt.sound,ht.custom=vt.custom||null,vt.cw&&(ht.cw=vt.cw))}catch(e){}function yt(){try{
localStorage.setItem("atlas.sky",JSON.stringify(ht))}catch(e){}}var bt={auto:"Maintenant",dawn:"Aube",day:"Jour",dusk:"Crépuscule",night:"Nuit",manual:"Manuel"
},Et=["auto","dawn","day","dusk","night"];function wt(e){
var t=e.getTime()/864e5-10957.5,n=(357.528+.9856003*t)%360*gt,a=((280.46+.9856474*t)%360+1.915*Math.sin(n)+.02*Math.sin(2*n))*gt,r=(23.439-4e-7*t)*gt,o=Math.asin(Math.sin(r)*Math.sin(a)),i=Math.atan2(Math.cos(r)*Math.sin(a),Math.cos(a))/gt,s=(280.46061837+360.98564736629*t)%360,l=(s+ft-i)*gt
;l=Math.atan2(Math.sin(l),Math.cos(l));var c=mt*gt;return{elev:Math.asin(Math.sin(c)*Math.sin(o)+Math.cos(c)*Math.cos(o)*Math.cos(l))/gt,H:l,subLat:o/gt,
subLng:((i-s)%360+540)%360-180}}function kt(){var e=new Date;return Date.UTC(e.getFullYear(),e.getMonth(),e.getDate())+6e4*e.getTimezoneOffset()}function Ct(){
var e=new Date;return e.getHours()+e.getMinutes()/60}function Mt(e){var t=Math.round(60*e)%1440;return se(Math.floor(t/60))+":"+se(t%60)}
var Lt=[[30,[28,53,82],[11,20,32],[0,0,0,0]],[10,[26,46,74],[11,16,24],[255,170,90,.1]],[0,[27,37,64],[10,13,18],[255,140,60,.34]],[-6,[18,26,51],[7,9,14],[255,110,70,.22]],[-12,[10,15,31],[5,7,11],[80,90,160,.12]],[-20,[5,7,12],[3,5,9],[60,80,140,.06]]]
;var Rt=function(e){return Math.max(0,Math.min(1,e))};var At=null,Tt=null,St=null,xt=null;function Ht(){var e=document.createElement("canvas");e.width=256,e.height=128
;var t=e.getContext("2d"),n=5,a=function(){return((n=16807*n%2147483647)-1)/2147483646};t.fillStyle="#d9dee6",t.fillRect(0,0,256,128)
;for(var r=0;r<34;r++)t.fillStyle="rgba(120,130,150,"+(.1+.22*a())+")",t.beginPath(),t.arc(256*a(),128*a(),5+20*a(),0,6.283),t.fill()
;for(var o=0;o<40;o++)t.strokeStyle="rgba(90,100,120,0.28)",t.lineWidth=1,t.beginPath(),t.arc(256*a(),128*a(),2+6*a(),0,6.283),t.stroke()
;return new THREE.CanvasTexture(e)}function jt(){var e=qe.scene(),t=qe.camera(),n=9,a=function(){return((n=16807*n%2147483647)-1)/2147483646},r=function(){
return(a()+a()+a()+a()-2)/2
},o=new THREE.Vector3(.35,.8,.5).normalize(),i=(new THREE.Vector3).crossVectors(o,new THREE.Vector3(0,0,1)).normalize(),s=(new THREE.Vector3).crossVectors(o,i)
;function l(t,n,l,c){for(var u=new Float32Array(3*t),d=new Float32Array(3*t),p=2600,m=0;m<t;m++){var f;if(l){var g=6.2832*a(),h=.16*r()
;f=i.clone().multiplyScalar(Math.cos(g)).add(s.clone().multiplyScalar(Math.sin(g))).add(o.clone().multiplyScalar(h)).normalize()}else{
var v=2*a()-1,y=6.2832*a(),b=Math.sqrt(1-v*v);f=new THREE.Vector3(b*Math.cos(y),v,b*Math.sin(y))}var E=c?.8+.2*a():l?.28+.4*a():.4+.6*a(),w=a();u[3*m]=p*f.x,
u[3*m+1]=p*f.y,u[3*m+2]=p*f.z,d[3*m]=E*(w>.85?1:.86),d[3*m+1]=E*(w>.85?.86:.92),d[3*m+2]=E*(w<.15?.8:1)}var k=new THREE.BufferGeometry
;k.setAttribute("position",new THREE.BufferAttribute(u,3)),k.setAttribute("color",new THREE.BufferAttribute(d,3));var C=new THREE.Points(k,new THREE.PointsMaterial({
size:n,sizeAttenuation:!1,vertexColors:!0,transparent:!0,opacity:0,depthWrite:!1}));return e.add(C),C}var c=l(1500,1.5,!1,!1),u=l(2200,1.1,!0,!1),d=l(70,2.9,!1,!0)
;c.userData.extra=[u,d];var p=function(){var e=document.createElement("canvas");e.width=e.height=128;var t=e.getContext("2d"),n=t.createRadialGradient(64,64,0,64,64,64)
;return n.addColorStop(0,"rgba(255,255,255,0.95)"),n.addColorStop(.22,"rgba(255,255,255,0.4)"),n.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=n,
t.fillRect(0,0,128,128),new THREE.CanvasTexture(e)}(),m=new THREE.Group,f=new THREE.Mesh(new THREE.SphereGeometry(52,24,16),new THREE.MeshBasicMaterial({color:16773577
})),g=new THREE.Sprite(new THREE.SpriteMaterial({map:p,color:16756832,transparent:!0,depthWrite:!1,blending:THREE.AdditiveBlending}));g.scale.set(900,900,1)
;var h=new THREE.Group;h.add(g),h.add(f);var v=new THREE.MeshBasicMaterial({map:Ht(),color:15659770
}),y=new THREE.Mesh(new THREE.SphereGeometry(46,32,20),v),b=new THREE.Sprite(new THREE.SpriteMaterial({map:p,color:10335456,transparent:!0,depthWrite:!1,
blending:THREE.AdditiveBlending,opacity:.55}));b.scale.set(520,520,1);var E=new THREE.Group;E.add(b),E.add(y),m.add(h),m.add(E),t.parent||e.add(t),t.add(m),At={stars:c,
sun:h,sunCore:f,sunGlow:g,moon:E,moonCore:y,moonGlow:b,group:m},matchMedia("(prefers-reduced-motion: reduce)").matches||function e(){if(At.group.visible){
y.rotation.y+=.0012,c.rotation.y+=5e-5;var t=c.userData.extra;t[0].rotation.y=c.rotation.y,t[1].rotation.y=c.rotation.y,
t[1].material.opacity=(At.starsA||0)*(.72+.28*Math.sin(performance.now()/900))}requestAnimationFrame(e)}()}var Pt={signal:{n:"Signal",on:"#222c37",hv:"#34404d",
atmo:"#8a9099"}};function qt(){var e,t,n,a=Pt[ht.cw]||Pt.signal,r=ht.custom||{},o=r.on||a.on;return{on:o,hv:r.on?(e=o,t=.22,n=parseInt(e.slice(1),16),
"#"+[n>>16&255,n>>8&255,255&n].map(function(e){return Math.max(0,Math.min(255,Math.round(t>=0?e+(255-e)*t:e*(1+t))))}).map(function(e){return(e<16?"0":"")+e.toString(16)
}).join("")):a.hv,atmo:r.atmo||a.atmo,land:r.land||"#1e2832"}}function Nt(){var e=document.documentElement.style,t=qt()
;Pe()?["--land-on","--land-hover","--atmo","--land"].forEach(function(t){e.removeProperty(t)}):(e.setProperty("--land-on",t.on),e.setProperty("--land-hover",t.hv),
e.setProperty("--atmo",t.atmo),ht.custom&&ht.custom.land?e.setProperty("--land",t.land):e.removeProperty("--land")),je()}var Dt=null;var Gt=null;function It(){
if(ht.sound)try{
for(var e=Gt=Gt||new(window.AudioContext||window.webkitAudioContext),t=.9*e.sampleRate,n=e.createBuffer(1,t,e.sampleRate),a=n.getChannelData(0),r=0;r<t;r++)a[r]=(2*Math.random()-1)*Math.sin(Math.PI*r/t)
;var o=e.createBufferSource();o.buffer=n;var i=e.createBiquadFilter();i.type="bandpass",i.Q.value=1.2,i.frequency.setValueAtTime(5200,e.currentTime),
i.frequency.exponentialRampToValueAtTime(900,e.currentTime+.9);var s=e.createGain();s.gain.value=.05,o.connect(i),i.connect(s),s.connect(e.destination),o.start()
}catch(e){}}function Ft(){if(At){var e=qe.scene(),t=qe.camera(),n=[];[{seed:77,R:2100,o:.36,rot:0},{seed:311,R:1900,o:.24,rot:2.1}].forEach(function(t){var a=function(e){
var t=document.createElement("canvas");t.width=1024,t.height=512;for(var n=t.getContext("2d"),a=e||77,r=function(){return((a=16807*a%2147483647)-1)/2147483646
},o=function(){return(r()+r()+r()-1.5)/1.5
},i=0;i<48;i++)for(var s=1024*r(),l=512*(.16+.68*r()),c=14+Math.floor(14*r()),u=0;u<c;u++)for(var d=s+52*o(),p=l+13*o(),m=6+17*r(),f=-1;f<=1;f++){n.save(),
n.translate(d+1024*f,p),n.scale(1.5,.62);var g=n.createRadialGradient(0,0,0,0,0,m);g.addColorStop(0,"rgba(255,255,255,"+(.34+.22*r())+")"),
g.addColorStop(.55,"rgba(255,255,255,0.14)"),g.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=g,n.beginPath(),n.arc(0,0,m,0,6.2832),n.fill(),n.restore()}
var h=new THREE.CanvasTexture(t);return h.wrapS=THREE.RepeatWrapping,h}(t.seed),r=new THREE.MeshBasicMaterial({map:a,transparent:!0,depthWrite:!1,depthTest:!0,
side:THREE.BackSide,opacity:0,fog:!1}),o=new THREE.Mesh(new THREE.SphereGeometry(t.R,48,32),r);o.rotation.y=t.rot,o.renderOrder=-5,o.frustumCulled=!1
;var i=new THREE.Group;i.add(o),e.add(i),n.push({grp:i,list:[o],o:t.o,v:0})}),(Dt={extra:[],layers:n,d:0,list:[].concat.apply([],n.map(function(e){return e.list}))
}).cam=t;var a=matchMedia("(prefers-reduced-motion: reduce)").matches,r=performance.now();try{Dt.extra.push(function(e){var t={map:{value:null},sun:{
value:new THREE.Vector3(1,0,0)},k:{value:0},texel:{value:new THREE.Vector2(1/2048,1/1024)}},n=new THREE.ShaderMaterial({uniforms:t,transparent:!0,depthWrite:!1,
blending:THREE.AdditiveBlending,
vertexShader:"varying vec2 vUv; varying vec3 vN; void main(){ vUv = uv; vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
fragmentShader:"uniform sampler2D map; uniform vec3 sun; uniform float k; uniform vec2 texel; varying vec2 vUv; varying vec3 vN;float L(vec2 p){ return texture2D(map, p).r; }void main(){ vec2 u = texel; float ctr = L(vUv); float blur = (L(vUv + vec2(u.x,0.)) + L(vUv - vec2(u.x,0.)) + L(vUv + vec2(0.,u.y)) + L(vUv - vec2(0.,u.y)) + L(vUv + u) + L(vUv - u) + L(vUv + vec2(u.x,-u.y)) + L(vUv + vec2(-u.x,u.y))) * 0.125; float sharp = clamp(ctr * 1.9 - blur * 0.9, 0.0, 1.0); float core = pow(smoothstep(0.085, 0.34, sharp), 1.15); float l = clamp(core * 1.25, 0.0, 1.0); float night = max(0.82, 1.0 - smoothstep(-0.08, 0.08, dot(normalize(vN), normalize(sun)))); vec3 col = mix(vec3(1.0, 0.96, 0.90), vec3(1.0, 1.0, 0.99), core); gl_FragColor = vec4(col * l * night * k, 1.0); }"
}),a=new THREE.Mesh(new THREE.SphereGeometry(100.9,96,64),n);a.rotation.y=-Math.PI/2,a.visible=!1,a.renderOrder=2,e.add(a);var r=!1;try{var o=new THREE.TextureLoader
;o.setCrossOrigin("anonymous"),o.load("/lib/earth-night.jpg",function(e){e.anisotropy=16,e.generateMipmaps=!0,e.minFilter=THREE.LinearMipMapLinearFilter,
e.magFilter=THREE.LinearFilter,e.image&&e.image.width&&t.texel.value.set(1/e.image.width,1/e.image.height),e.needsUpdate=!0,t.map.value=e,r=!0},void 0,function(){})
}catch(e){}return function(){var e=r&&xt&&ht.on&&ht.light&&!Pe();if(a.visible=!!e,e){
var n=qe.getCoords(xt.subLat,xt.subLng,0),o=new THREE.Vector3(n.x,n.y,n.z).applyAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);t.sun.value.copy(o),
t.k.value=Math.max(0,Math.min(1,(qe.pointOfView().altitude-1.1)/.5))}}}(e)),Dt.extra.push(function(e){var t=qe.camera(),n=[],a=4;return function(r,o,i){
var s=At&&(At.starsA||0)>.4&&ht.on;if(a-=r,s&&!i&&a<=0&&n.length<2){a=5+9*Math.random();var l=new THREE.Vector3;t.getWorldDirection(l)
;var c=new THREE.Vector3(0,1,0),u=(new THREE.Vector3).crossVectors(l,c).normalize(),d=(new THREE.Vector3).crossVectors(u,l).normalize(),p=t.position.clone().add(l.clone().multiplyScalar(1700)).add(u.clone().multiplyScalar(1700*(Math.random()-.5))).add(d.clone().multiplyScalar(250+450*Math.random())),m=u.clone().multiplyScalar((Math.random()<.5?-1:1)*(.7+.5*Math.random())).add(d.clone().multiplyScalar(-.45-.35*Math.random())).normalize(),f=new THREE.BufferGeometry,g=new Float32Array(6),h=new Float32Array([0,0,0,1,1,1])
;f.setAttribute("position",new THREE.BufferAttribute(g,3)),f.setAttribute("color",new THREE.BufferAttribute(h,3));var v=new THREE.Line(f,new THREE.LineBasicMaterial({
vertexColors:!0,transparent:!0,depthWrite:!1,depthTest:!1,blending:THREE.AdditiveBlending}));v.frustumCulled=!1,e.add(v),n.push({ln:v,o:p,dir:m,t:0,
sp:1500+700*Math.random()}),It()}for(var y=n.length-1;y>=0;y--){var b=n[y];b.t+=r
;var E=b.o.clone().add(b.dir.clone().multiplyScalar(b.sp*b.t)),w=E.clone().sub(b.dir.clone().multiplyScalar(Math.min(520,b.sp*b.t))),k=b.ln.geometry.attributes.position.array
;k[0]=w.x,k[1]=w.y,k[2]=w.z,k[3]=E.x,k[4]=E.y,k[5]=E.z,b.ln.geometry.attributes.position.needsUpdate=!0,b.ln.material.opacity=Math.max(0,1-b.t/.85),
b.t>.85&&(e.remove(b.ln),b.ln.geometry.dispose(),b.ln.material.dispose(),n.splice(y,1))}}}(e))}catch(e){console.warn("Détails du ciel indisponibles",e)}!function e(t){
requestAnimationFrame(e);var n=Math.min(.1,(t-r)/1e3);r=t,Dt.extra.forEach(function(e){e(n,t,a)});var o=ht.clouds&&!Pe()&&ht.on;Dt.layers.forEach(function(e){
var t=e.o*Dt.d;e.grp.visible=o&&t>.01,e.list.forEach(function(e){e.material.opacity=t}),e.grp.position.copy(Dt.cam.position)})}(r)}}function zt(){
if(Tt&&qe)if(ht.on&&ht.light&&!Pe()&&xt){var e=qe.getCoords(xt.subLat,xt.subLng,0);Tt.position.set(e.x,e.y,e.z).normalize().multiplyScalar(300)
}else St&&Tt.position.copy(St)}function Ot(e){var t=ae("#skyLbl");t&&(t.textContent=me(bt[ht.mode])+(e?" · "+Mt("auto"===ht.mode?Ct():ht.hour):""))}function Bt(){
var e=ae(".stage");if(!(ht.on&&!Pe()))return e.style.removeProperty("--stage-bg"),At&&(At.group.visible=!1,At.stars.visible=!1),xt=null,zt(),void Ot(null)
;var t=wt("auto"===ht.mode?new Date:new Date(kt()+36e5*ht.hour)),n=t.elev,a=function(e){if(e>=Lt[0][0])return Lt[0];for(var t=0;t<Lt.length-1;t++){var n=Lt[t],a=Lt[t+1]
;if(e>=a[0]){var r=(n[0]-e)/(n[0]-a[0]),o=function(e,t){return e.map(function(e,n){return e+(t[n]-e)*r})};return[e,o(n[1],a[1]),o(n[2],a[2]),o(n[3],a[3])]}}
return Lt[Lt.length-1]}(n);xt=t,function(e){if(Dt){Dt.d=Rt((e+3)/14);var t=Rt((14-e)/14)*Dt.d;Dt.list.forEach(function(e){e.material.color.setRGB(1,1-.28*t,1-.5*t)})}}(n)
;var r=function(e){return"rgb("+e.map(Math.round).join(",")+")"
},o=a[3],i=50+42*Math.sin(t.H),s=Rt((-n-4)/14),l=s>.01?"radial-gradient(55% 50% at 20% 26%, rgba(112,126,150,"+(.13*s).toFixed(3)+"), transparent 70%), radial-gradient(48% 42% at 82% 72%, rgba(110,130,140,"+(.08*s).toFixed(3)+"), transparent 70%), radial-gradient(40% 30% at 62% 14%, rgba(130,138,150,"+(.07*s).toFixed(3)+"), transparent 70%), ":""
;if(e.style.setProperty("--stage-bg",l+"radial-gradient(120% 70% at "+i.toFixed(1)+"% 112%, rgba("+Math.round(o[0])+","+Math.round(o[1])+","+Math.round(o[2])+","+o[3].toFixed(3)+") 0%, rgba("+Math.round(o[0])+","+Math.round(o[1])+","+Math.round(o[2])+",0) 62%), linear-gradient(180deg, "+r(a[1])+" 0%, "+r(a[2])+" 100%)"),
At){var c=Rt((-n-3)/12),u=Rt((n+9)/10),d=Rt((-n-2)/8);At.group.visible=!0,At.stars.visible=c>.01,At.stars.material.opacity=c,At.starsA=c,
At.stars.userData.extra.forEach(function(e,t){e.visible=c>.01,e.material.opacity=c*(t?1:.8)});var p=function(e){return 820*Math.max(-.5,Math.min(1,e/65))-400}
;At.sun.position.set(620*Math.sin(t.H),p(n),-1300),At.moon.position.set(620*-Math.sin(t.H),p(-n),-1300),At.sun.visible=u>.02,At.moon.visible=d>.02;var m=Rt((28-n)/24)
;At.sunCore.material.color.setRGB(1,.95-.38*m,.8-.5*m),At.sunGlow.material.color.setRGB(1,.72-.1*m,.38+.3*(1-m)),At.sunGlow.material.opacity=u,
At.sunCore.material.opacity=1,At.sunCore.material.transparent=!0,At.sunCore.material.opacity=u,At.moonCore.material.transparent=!0,At.moonCore.material.opacity=d,
At.moonGlow.material.opacity=.55*d}zt(),Ot(t)}function Vt(e){if(ht.mode=e,"auto"!==e){var t=function(){for(var e=kt(),t=null,n=null,a=12,r=-99,o=null,i=0;i<=24;i+=.05){
var s=wt(new Date(e+36e5*i)).elev;s>r&&(r=s,a=i),null!==o&&(o<=0&&s>0&&null===t&&(t=i),o>0&&s<=0&&(n=i)),o=s}return{dawn:(null===t?7:t)+.25,day:a,dusk:(null===n?19:n)+.2,
night:1.5}}();ht.hour=void 0===t[e]?ht.hour:t[e]}yt(),Bt(),"settings"===ke.view.t&&fn()}function Ut(){ke.view={t:"home"},fn(),pt(L,R,A,1200),_t()}function Jt(e,t){
if(ke.view={t:"country",code:e,name:t},fn(),_t(),e){var a=n[e].pov;pt(a.lat,a.lng,a.alt,1300,a.alt<=.7?32:0)}}function Kt(e){var t=ie(e);if(t){
ke.recent=[e].concat(ke.recent.filter(function(t){return t!==e})).slice(0,6);try{localStorage.setItem("lobby.recent",JSON.stringify(ke.recent))}catch(e){}ke.view={
t:"org",id:e,tab:"rosters"},fn(),_t(),t.real?pt(t.lat,t.lng,.85,1300,0):pt(t.lat,t.lng,.3,1500,58)}}function Zt(e){ke.view={t:"match",i:+e},fn(),_t()}function Wt(e){
ke.view={t:"player",id:e},fn(),_t()}function Yt(){var e,t=ke.view;if("org"===t.t)Jt(ie(t.id).country);else if("roster"===t.t)Kt(t.org);else if("player"===t.t){
var n=s(t.id);e=n.game,ke.view={t:"game",id:e,role:null,sort:"name"},fn(),_t()}else"game"===t.t&&(ke.game=null,hn()),Ut()}function _t(){
ae("#btnSettings").setAttribute("aria-pressed",String("settings"===ke.view.t))}function Qt(e,t,n,a,r){
return'<header class="ph">'+(n?'<button class="back" type="button" data-act="back" aria-label="'+me("Retour")+'">←</button>':"")+(a||"")+"<div><h1>"+re(e)+"</h1>"+(t?'<p class="sub">'+t+"</p>":"")+"</div>"+(r?'<span class="ph-x">'+r+"</span>":"")+"</header>"
}function Xt(e){
return'<button class="card" type="button" data-act="org" data-id="'+e.id+'">'+(e.real?O(e,"lg"):'<span class="badge">'+re(e.short)+"</span>")+'<span class="card-n">'+(g("org",e.id)?"★ ":"")+re(e.name)+'</span><span class="card-m">'+Te(e.country)+re(V(e))+'</span><span class="tags">'+function(e){
return e.games.filter(I).map(function(e){return xe(oe(e),!0)}).join("")}(e)+"</span></button>"}function $t(){
return'<div class="sechead"><h2 class="h2">'+me("Compétitions")+'</h2><div class="subtabs">'+["live","soon","done"].map(function(e){
return'<button class="subtab" type="button" data-act="cst" data-st="'+e+'" aria-pressed="'+(ke.cst===e)+'">'+me({live:"En cours",soon:"À venir",done:"Passées"
}[e])+"</button>"}).join("")+"</div></div>"+(e=ke.cst,(t=d.filter(function(t){
return I(t.game)&&(!e||t.st===e)&&(!ke.game||t.game===ke.game)&&("all"===ke.tier||ke.tiers[t.game]===ke.tier)})).length?(t=t.slice().sort(function(e,t){
return g("comp",t.id)-g("comp",e.id)})).map(function(e){var t=oe(e.game)
;return'<div class="comp clk'+(g("comp",e.id)?" fav":"")+'" role="button" tabindex="0" data-act="comp" data-id="'+e.id+'">'+xe(t)+'<span class="comp-n">'+re(e.name)+'</span><span class="comp-m">'+re(me(e.region)+" · "+Ee(t)+(e.venue?" · "+ge(e.venue[0]):""))+'</span><span class="rt">'+h("comp",e.id)+'<span class="live '+e.st+'">'+me(k[e.st])+"</span></span></div>"
}).join(""):'<p class="empty">'+me("Aucune compétition pour ce filtre.")+"</p>");var e,t}function en(e){if(e.status)return"running"===e.status?{k:"live",n:0
}:"finished"===e.status?{k:"done",n:0}:{k:"soon",n:Math.max(0,Math.round((e.ts-Date.now())/6e4))}
;var t=e.t.split(":"),n=60*+t[0]+ +t[1],a=new Date,r=60*a.getHours()+a.getMinutes();return r<n?{k:"soon",n:n-r}:r<n+120?{k:"live",n:0}:{k:"done",n:0}}function tn(e){
return(e.orgs||[]).some(function(e){return g("org",e)})?1:0}function nn(){
var e,t,n='<nav class="hometabs" role="tablist">'+[["home",me("Accueil")],["orgs",me("Équipes")],["games",me("Jeux")],["comps",me("Compétitions")],["partners",me("Partenaires")]].map(function(e){
return'<button class="tab" type="button" role="tab" data-act="htab" data-h="'+e[0]+'" aria-selected="'+(ke.home===e[0])+'">'+e[1]+"</button>"
}).join("")+"</nav>",o=v?'<div class="note live-note">'+me("Données en direct · mise à jour {t}",{t:se(new Date(y).getHours())+":"+se(new Date(y).getMinutes())
})+"</div>":'<div class="note">'+me("Maquette. Équipes, compétitions et actualités sont des exemples, sans données vérifiées.")+"</div>",i=[1,2,3].map(function(e){
var t=a.filter(function(t){return ke.tiers[t.id]===e&&I(t.id)});return'<div class="tier-row"><b>T'+e+'</b><div class="tier-games">'+(t.length?t.map(function(e){
return'<button class="gbtn" type="button" data-act="game" data-id="'+e.id+'">'+xe(e,!0)+re(e.short)+"</button>"
}).join(""):'<span class="empty">'+me("Aucun jeu")+"</span>")+"</div></div>"}).join("")
;if("orgs"===ke.home)e='<div class="cards">'+r.filter(Ce).map(Xt).join("")+"</div>";else if("games"===ke.home)e='<section class="sec"><h2 class="lbl">'+me("Jeux par tier")+"</h2>"+i+"</section>";else if("comps"===ke.home)e=o+'<section class="sec">'+$t()+"</section>";else if("partners"===ke.home)e=o+'<section class="sec"><h2 class="lbl">'+me("Partenariats")+'</h2><p class="empty">'+me("Les partenariats (marque, équipe, roster) arrivent avec les vraies données.")+"</p></section>";else{
var s=(T?K(8):["vitality","kc","g2","t1","gm"].map(ie)).filter(Boolean),l=ke.recent.map(ie).filter(Boolean).slice(0,4),c=m.org.length||m.comp.length?'<section class="sec"><h2 class="lbl">★ '+me("Favoris")+'</h2><div class="pills">'+m.org.map(ie).filter(Boolean).map(function(e){
return'<button class="pill" type="button" data-act="org" data-id="'+e.id+'">'+B(e)+'<span class="mono">'+re(e.short)+"</span>"+re(e.name)+"</button>"
}).join("")+m.comp.map(function(e){return d.filter(function(t){return t.id===e})[0]}).filter(Boolean).map(function(e){
return'<span class="pill"><span class="mono">'+re(e.name)+"</span>"+me(k[e.st])+"</span>"}).join("")+"</div></section>":"",p=u.slice().sort(function(e,t){
return tn(t)-tn(e)});e=o+c+'<section class="sec"><div class="sechead"><h2 class="h2">'+me("Aujourd’hui")+"</h2></div>"+(((t=w.map(function(e,t){return{m:e,i:t}
}).filter(function(e){return I(e.m.game)&&(!ke.game||e.m.game===ke.game)&&("all"===ke.tier||ke.tiers[e.m.game]===ke.tier)})).length?(t.sort(function(e,t){
return E(t.m)-E(e.m)}),t.map(function(e){
var t=e.m,n=oe(t.game),a=b(t,"a"),r=b(t,"b"),o=en(t),i=null!=a.score&&"soon"!==o.k?' <b class="mono">'+a.score+"–"+r.score+"</b>":""
;return'<button class="comp mt'+(E(t)?" fav":"")+'" type="button" data-act="match" data-i="'+e.i+'"><span class="mt-t mono">'+t.t+'</span><span class="comp-n">'+(E(t)?"★ ":"")+z(a.name,a.short,"xs",a.logo)+re(a.short)+' <span class="vs">vs</span> '+z(r.name,r.short,"xs",r.logo)+re(r.short)+i+'</span><span class="comp-m">'+re(t.comp+" · "+Ee(n))+("live"===o.k?' · <span class="live live">'+me("En cours")+"</span>":"")+"</span>"+xe(n,!0)+"</button>"
}).join("")):'<p class="empty">'+me("Aucun match pour ce filtre.")+"</p>")+'</section><section class="sec">')+$t()+"</section>"+(l.length?'<section class="sec"><h2 class="lbl">'+me("Consultées récemment")+'</h2><div class="pills">'+l.map(function(e){
return'<button class="pill" type="button" data-act="org" data-id="'+e.id+'">'+B(e)+'<span class="mono">'+re(e.short)+"</span>"+re(e.name)+"</button>"
}).join("")+"</div></section>":"")+'<section class="sec"><h2 class="lbl">'+me("Les plus consultées")+'</h2><div class="pills">'+s.map(function(e){
return'<button class="pill" type="button" data-act="org" data-id="'+e.id+'">'+B(e)+'<span class="mono">'+re(e.short)+"</span>"+re(e.name)+"</button>"
}).join("")+'</div></section><section class="sec"><h2 class="lbl">'+me("Actualités")+"</h2>"+(p.length?"":'<p class="empty">'+me("Les actualités vérifiées arrivent avec la source de news, en cours de branchement.")+"</p>")+'<ul class="news">'+p.map(function(e){
return'<li class="news-i'+(tn(e)?" fav":"")+'"><div class="news-h">'+(tn(e)?'<span class="fv">★ '+me("Favori")+"</span>":"")+'<span class="tag '+e.tag+'">'+me(C[e.tag])+'</span><span class="ex">'+me("Exemple")+'</span></div><p class="news-t">'+re(me(e.title))+'</p><p class="news-m">'+re(me(e.meta))+"</p></li>"
}).join("")+"</ul></section>"}return n+e}function an(e){
var t=ie(e.org),n=e.img?'<span class="lgw sm pl"><img src="'+re(e.img)+'" alt="" loading="lazy" referrerpolicy="no-referrer"><b>'+re(c(l(e)))+"</b></span>":'<span class="tile">'+re(c(l(e)))+"</span>"
;return'<button class="prow" type="button" data-act="player" data-id="'+e.id+'">'+n+'<span class="row-n">'+re(l(e))+'</span><span class="row-m">'+re((e.role?e.role+" · ":"")+t.short)+'</span><span class="row-r">'+Te(e.cc)+"</span></button>"
}function rn(e){var t=oe(e.id),n=i[t.id],a=r.filter(function(e){return e.games.indexOf(t.id)>-1}),s=o.filter(function(n){return n.game===t.id&&(!e.role||n.role===e.role)
});"titles"!==e.sort&&(s=s.slice().sort(function(e,t){return l(e).localeCompare(l(t))}))
;var c=n?'<div class="subtabs wrap"><button class="subtab" type="button" data-act="role" data-role="" aria-pressed="'+!e.role+'">'+me("Tous les rôles")+"</button>"+n.map(function(t){
return'<button class="subtab" type="button" data-act="role" data-role="'+t+'" aria-pressed="'+(e.role===t)+'">'+t+"</button>"
}).join("")+"</div>":"",u='<div class="sortrow"><span class="lbl" style="margin:0">'+me("Trier par")+'</span><div class="subtabs">'+[["name","Nom"],["titles","Titres"]].map(function(t){
return'<button class="subtab" type="button" data-act="sort" data-sort="'+t[0]+'" aria-pressed="'+((e.sort||"name")===t[0])+'">'+me(t[1])+"</button>"
}).join("")+"</div></div>"
;return Qt(Ee(t),"Tier "+ke.tiers[t.id],!0,xe(t).replace('class="tile','class="tile big'))+(T?"":'<div class="note">'+me("Données d’exemple, non vérifiées.")+"</div>")+'<section class="sec"><h2 class="lbl">'+me("Rosters")+" · "+a.length+'</h2><div class="rows">'+(a.length?a.map(function(e){
return'<button class="prow" type="button" data-act="roster" data-org="'+e.id+'" data-g="'+t.id+'">'+(e.real?O(e,"md"):'<span class="badge sm">'+re(e.short)+"</span>")+'<span class="row-n">'+re(e.name)+'</span><span class="row-m">'+Te(e.country)+re(V(e))+"</span></button>"
}).join(""):'<p class="empty">'+me("Aucune équipe pour ce jeu pour le moment.")+"</p>")+'</div></section><section class="sec"><h2 class="lbl">'+me("Joueurs")+" · "+s.length+"</h2>"+c+u+'<div class="rows">'+(s.length?s.slice(0,60).map(an).join("")+(s.length>60?'<p class="empty">'+me("Utilise la recherche pour retrouver un joueur précis.")+"</p>":""):'<p class="empty">'+me("Aucun joueur pour ce filtre.")+"</p>")+'</div></section><section class="sec"><h2 class="lbl">'+me("Compétitions")+"</h2>"+function(e){
var t=d.filter(function(t){return t.game===e});return t.length?t.map(function(e){
return'<div class="comp"><span class="comp-n">'+re(e.name)+'</span><span class="comp-m">'+re(me(e.region))+'</span><span class="live '+e.st+'">'+me(k[e.st])+"</span></div>"
}).join(""):'<p class="empty">'+me("Aucune compétition pour ce filtre.")+"</p>"}(t.id)+"</section>"}function on(e,t){var n=j[e.id+"|"+t]
;if(!e.real)return'<p class="empty">'+me("À renseigner")+"</p>"
;if(!n||"loading"===n.s)return'<p class="collect"><span class="spin"></span>'+me("Collecte en cours sur Liquipedia. La première fois, cela peut prendre une minute.")+"</p>"
;if("none"===n.s)return'<p class="empty">'+me("Aucune page Liquipedia trouvée pour cette équipe.")+"</p>"
;if("err"===n.s)return'<p class="empty">'+me("Source momentanément indisponible.")+'</p><button class="lnk" type="button" data-act="retry" data-org="'+e.id+'" data-g="'+t+'">'+me("Réessayer")+"</button>"
;var a=n.d.staff||[];return a.length?'<div class="rows">'+a.map(function(e){
return'<div class="row plain"><span class="row-n">'+re(e.id)+(e.name&&e.name!==e.id?' <span class="mut">'+re(e.name)+"</span>":"")+'</span><span class="row-m">'+re(e.pos||me("Rôle non précisé"))+(e.join?" · "+re(e.join):"")+'</span><span class="row-r">'+Te(he[e.cc]||"")+"</span></div>"
}).join("")+'</div><p class="sub"><span class="tag single">'+me("Source unique")+'</span><a class="srcl" href="'+re(n.d.url)+'" target="_blank" rel="noopener noreferrer">Liquipedia ↗</a></p>':'<p class="empty">'+me("Aucun staff renseigné sur la source.")+"</p>"
}setInterval(function(){"auto"===ht.mode&&Bt()},6e4);var sn={
discord:"M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
facebook:"M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
instagram:"M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
linkedin:"M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
tiktok:"M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
twitch:"M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z",
x:"M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
youtube:"M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
},ln=[["twitter.com","x"],["x.com","x"],["instagram.com","instagram"],["twitch.tv","twitch"],["youtube.com","youtube"],["tiktok.com","tiktok"],["discord","discord"],["facebook.com","facebook"],["linkedin.com","linkedin"]],cn="M12 2a10 10 0 100 20 10 10 0 000-20zm6.9 9h-3.2a15.7 15.7 0 00-1.4-6A8 8 0 0118.9 11zM12 4.1c.9 1.2 1.7 3.2 2 5.9H10c.3-2.7 1.1-4.7 2-5.9zM4.3 13h3.2c.1 2.2.6 4.2 1.4 6A8 8 0 014.3 13zm3.2-2H4.3a8 8 0 014.6-6 15.7 15.7 0 00-1.4 6zM12 19.9c-.9-1.2-1.7-3.2-2-5.9h4c-.3 2.7-1.1 4.7-2 5.9zm2.1-.9c.8-1.8 1.3-3.8 1.4-6h3.2a8 8 0 01-4.6 6z"
;function un(e,t){var n=j[e.id+"|"+t],a=n&&"ok"===n.s?n.d:null,r=[],o={},i="";return a&&((a.info.links||[]).forEach(function(e){var t="web";ln.forEach(function(n){
"web"===t&&e.indexOf(n[0])>-1&&(t=n[1])}),o[t]||(o[t]=1,r.push(function(e,t){var n="web"===t?me("Site officiel"):t.charAt(0).toUpperCase()+t.slice(1)
;return'<a class="soc '+t+'" href="'+re(e)+'" target="_blank" rel="noopener noreferrer" aria-label="'+re(n)+'" title="'+re(n)+'"><svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="'+("web"===t?cn:sn[t])+'"/></svg></a>'
}(e,t)))}),a.info.created&&(i+='<div class="stat"><small>'+me("Fondée en")+"</small><b>"+re(a.info.created.slice(0,4))+"</b></div>"),
a.info.winnings&&(i+='<div class="stat"><small>'+me("Gains cumulés")+"</small><b>"+re(a.info.winnings)+"</b></div>")),
(r.length?'<div class="socs">'+r.join("")+"</div>":"")+(i?'<div class="stats">'+i+"</div>":"")}function dn(e){var t=ie(e.org),n=oe(e.g),a=o.filter(function(e){
return e.org===t.id&&e.game===n.id});ee(t,n.id);var r=function(e,t){var n=j[e.id+"|"+t];if(!n||"ok"!==n.s||!e.rosters||!e.rosters[t])return null
;var a=e.rosters[t].pl.map(function(e){return e.n.toLowerCase()}),r=(n.d.roster||[]).map(function(e){return e.id.toLowerCase()});return r.length&&a.length?{
ok:a.filter(function(e){return r.indexOf(e)>-1}).length>=Math.ceil(.8*a.length),onlyPs:a.filter(function(e){return r.indexOf(e)<0}),onlyLp:r.filter(function(e){
return a.indexOf(e)<0})}:null
}(t,n.id),i=j[t.id+"|"+n.id],s=t.real?r?r.ok?'<span class="tag ok">'+me("Confirmé")+" · 2 sources</span>":'<span class="tag rumor">'+me("Sources en désaccord")+"</span>":i&&"loading"===i.s?'<span class="tag single">'+me("Vérification en cours")+"</span>":'<span class="tag single">'+me("Source unique")+"</span>":"",l=r&&!r.ok?'<p class="sub">'+(r.onlyPs.length?me("Seulement chez PandaScore")+" : "+re(r.onlyPs.join(", "))+". ":"")+(r.onlyLp.length?me("Seulement chez Liquipedia")+" : "+re(r.onlyLp.join(", "))+".":"")+"</p>":""
;return Qt(t.name+" · "+n.short,Te(t.country)+re(V(t)),!0,t.real?O(t,"lg"):xe(n).replace('class="tile','class="tile big'))+'<section class="sec"><h2 class="lbl">'+me("Joueurs")+" "+s+'</h2><div class="rows">'+(a.length?a.map(an).join(""):'<p class="empty">'+me("Roster en cours de collecte, aucun joueur renseigné.")+"</p>")+"</div>"+l+'</section><section class="sec"><h2 class="lbl">'+me("Staff")+"</h2>"+on(t,n.id)+'</section><section class="sec"><h2 class="lbl">'+me("Partenaires par roster")+'</h2><p class="empty">'+me("Aucune donnée vérifiée pour le moment.")+"</p></section>"
}var pn={};function mn(e){var t=ie(e.id),n="",a=e.g||t.games[0];ee(t,a),n="rosters"===e.tab?'<div class="rows">'+t.games.filter(I).map(function(e){
var n=oe(e),a=o.filter(function(n){return n.org===t.id&&n.game===e}).length
;return'<button class="prow" type="button" data-act="roster" data-org="'+t.id+'" data-g="'+e+'">'+xe(n)+'<span class="row-n">'+re(Ee(n))+'</span><span class="row-m">'+(a?a+" "+me("Joueurs").toLowerCase():me("Roster en cours de collecte"))+'</span><span class="row-r">T'+ke.tiers[e]+"</span></button>"
}).join("")+"</div>":"staff"===e.tab?(t.games.length>1?'<p class="sub">'+me("Source")+" : "+re(Ee(oe(a)))+"</p>":"")+on(t,a):"results"===e.tab?function(e,t){
var n=j[e.id+"|"+t];if(!e.real)return'<p class="empty">'+me("À renseigner")+"</p>"
;if(!n||"loading"===n.s)return'<p class="collect"><span class="spin"></span>'+me("Collecte en cours sur Liquipedia. La première fois, cela peut prendre une minute.")+"</p>"
;if("ok"!==n.s)return'<p class="empty">'+me("Palmarès indisponible pour le moment.")+"</p>";var a=n.d.results||[]
;return a.length?'<div class="rows res-list">'+a.map(function(e){var t=e.vs?'<span class="rm">vs '+re(e.vs)+(e.score?" <b>"+re(e.score)+"</b>":"")+"</span>":""
;return'<div class="rrow"><div class="rr-main"><div class="rr-t">'+re(e.event||"—")+'</div><div class="rr-m"><span class="rm">'+re(e.date)+"</span>"+(e.tier?'<span class="rm tier">'+re(e.tier)+"</span>":"")+t+(e.prize&&"-"!==e.prize?'<span class="rm prize">'+re(e.prize)+"</span>":"")+'</div></div><b class="place p'+re((e.place||"")[0]||"")+'">'+re(e.place||"")+"</b></div>"
}).join("")+'</div><p class="sub"><span class="tag single">'+me("Source unique")+'</span><a class="srcl" href="'+re(n.d.url)+'" target="_blank" rel="noopener noreferrer">Liquipedia ↗</a></p>':'<p class="empty">'+me("Aucun résultat renseigné sur la source.")+"</p>"
}(t,a):'<div class="rows">'+["Partenaire principal","Équipementier","Partenaires par roster"].map(function(e){
return'<div class="row plain"><span class="row-n">'+me(e)+'</span><span class="row-m">'+me("À renseigner")+'</span><span class="row-r">'+me("Aucune source")+"</span></div>"
}).join("")+"</div>";var r=[["rosters",me("Rosters")],["staff",me("Staff")],["results",me("Palmarès")],["partners",me("Partenariats")]].map(function(t){
return'<button class="tab" type="button" role="tab" data-act="tab" data-tab="'+t[0]+'" aria-selected="'+(e.tab===t[0])+'">'+t[1]+"</button>"
}).join(""),i='<div class="hero"><div>'+O(t,"xxl")+'<span class="kit-n">'+re(t.name)+"</span><small>"+Te(t.country)+" "+re(V(t))+"</small></div>"+ne(t)+"</div>"
;return Qt(t.name,Te(t.country)+re(t.city?V(t)+" · "+be(t.country):be(t.country)),!0,O(t,"lg"),h("org",t.id))+i+un(t,a)+'<div class="tabs" role="tablist">'+r+"</div>"+n}
function fn(){var e,t,o,i,u=ke.view,m=ae("#panel");m.innerHTML="home"===u.t?nn():"country"===u.t?function(e){
if(!e.code||!n[e.code])return Qt(e.name||me("Pays"),rt[e.name]?'<span class="region-tag">'+re(me(nt[rt[e.name]].n))+"</span>":null,!0)+'<p class="empty">'+me("Aucune organisation répertoriée pour ce pays dans la maquette.")+"</p>"
;var t=r.filter(function(t){return t.country===e.code}),a=t.filter(Ce),o=pn[e.code]
;return Qt(be(e.code),(o?'<span class="region-tag">'+re(me(nt[o].n))+"</span> ":"")+me(a.length>1?"{n} équipes":"{n} équipe",{n:a.length
})+(a.length<t.length?me(" avec ce filtre"):""),!0,Te(e.code).replace('class="flag"','class="flag" style="width:36px;height:24px"'))+(a.length?'<div class="cards">'+a.map(Xt).join("")+"</div>":'<p class="empty">'+me("Aucune équipe de ce pays pour ce filtre.")+"</p>")
}(u):"org"===u.t?mn(u):"game"===u.t?rn(u):"match"===u.t?function(e){
var t=w[e.i],n=oe(t.game),a=b(t,"a"),r=b(t,"b"),o=p(t.comp),i=en(t),s="soon"===i.k?me("Début dans {n}",{n:i.n>=60?Math.floor(i.n/60)+" h "+se(i.n%60):i.n+" min"
}):"live"===i.k?me("En cours"):me("Terminé"),l=function(e){var t=z(e.name,e.short,"xxl",e.logo,"")+"<span>"+re(e.name)+"</span>"
;return e.id?'<button class="mside" type="button" data-act="org" data-id="'+e.id+'">'+t+"</button>":'<div class="mside">'+t+"</div>"
},c=t.watch?'<a class="lnk primary" href="'+re(t.watch)+'" target="_blank" rel="noopener noreferrer">'+me("Regarder en direct")+" ↗</a>":o&&!v?'<a class="lnk primary" href="'+o.watch+'" target="_blank" rel="noopener noreferrer">'+me("Regarder en direct")+' ↗</a><a class="lnk" href="'+o.info+'" target="_blank" rel="noopener noreferrer">'+me("Score et détails")+" ↗</a>":""
;return Qt(a.short+" vs "+r.short,re(t.comp)+" · "+re(Ee(n)),!0,xe(n).replace('class="tile','class="tile big'))+(v?"":'<div class="note">'+me("Données d’exemple, non vérifiées.")+"</div>")+'<div class="board">'+l(a)+'<div class="mid"><b class="mono">'+t.t+'</b><span class="live '+i.k+'">'+s+'</span><em class="mono">'+(null!=a.score&&"soon"!==i.k?a.score+" : "+r.score:"– : –")+"</em></div>"+l(r)+'</div><section class="sec"><h2 class="lbl">'+me("Regarder")+'</h2><div class="links">'+c+'</div><p class="sub">'+me("Les liens mènent vers les sources officielles de la compétition.")+"</p></section>"
}(u):"player"===u.t?function(e){
var t=s(e.id),n=ie(t.org),a=oe(t.game),r=[t.first,t.last].filter(Boolean).join(" "),o=[[me("Rôle"),re(t.role||"—"),""],[me("Équipe actuelle"),re(n.name),'data-act="org" data-id="'+n.id+'"'],[me("Jeu"),re(Ee(a)),'data-act="game" data-id="'+a.id+'"'],[me("Pays d’origine"),Te(t.cc)+" "+re(be(t.cc)),""]]
;r&&o.unshift([me("Nom"),re(r),""]),t.age&&o.push([me("Âge"),re(t.age)+" "+me("ans"),""])
;var i=t.img?'<span class="lgw xl pl"><img src="'+re(t.img)+'" alt="" referrerpolicy="no-referrer"><b>'+re(c(l(t)))+"</b></span>":'<span class="badge big">'+re(c(l(t)))+"</span>"
;return Qt(l(t),Te(t.cc)+re(n.name)+" · "+re(Ee(a)),!0,i)+(t.ex?'<div class="note">'+me("Données d’exemple, non vérifiées.")+"</div>":"")+'<section class="sec"><h2 class="lbl">'+me("Infos")+'</h2><div class="rows">'+o.map(function(e){
return e[2]?'<button class="prow plainrow" type="button" '+e[2]+'><span class="row-m">'+e[0]+'</span><span class="row-n">'+e[1]+"</span></button>":'<div class="prow plainrow"><span class="row-m">'+e[0]+'</span><span class="row-n">'+e[1]+"</span></div>"
}).join("")+"</div>"+(t.real?'<p class="sub"><span class="tag single">'+me("Source unique")+"</span>PandaScore</p>":"")+'</section><section class="sec"><h2 class="lbl">'+me("Palmarès")+'</h2><p class="empty">'+me("Aucun palmarès individuel vérifié pour le moment.")+"</p></section>"
}(u):"roster"===u.t?dn(u):"comp"===u.t?function(e){var t=d.filter(function(t){return t.id===e.id})[0];if(!t)return nn();var n=oe(t.game),a=function(e,t){
return'<div class="kv"><span>'+me(e)+"</span><b>"+t+"</b></div>"
},r='<em class="muted">'+me("Non communiqué")+"</em>",o=t.teams&&t.teams.length?'<div class="pills">'+t.teams.map(function(e){var t=ie(e)
;return t?'<button class="pill" type="button" data-act="org" data-id="'+t.id+'">'+B(t)+re(t.name)+"</button>":""
}).join("")+"</div>":r,i=(t.watch?'<a class="lnk" target="_blank" rel="noopener" href="'+re(t.watch)+'">'+me("Regarder")+"</a>":"")+(t.info?'<a class="lnk" target="_blank" rel="noopener" href="'+re(t.info)+'">Liquipedia</a>':"")
;return'<button class="back" type="button" data-act="back">← '+me("Retour")+'</button><div class="hero1">'+xe(n,!1)+'<h1 class="h1">'+re(t.name)+'</h1><span class="live '+t.st+'">'+me(k[t.st])+'</span></div><section class="kvs">'+a("Jeu",re(Ee(n)))+a("Région",re(me(t.region||"—")))+a("Lieu",t.venue?re(ge(t.venue[0])):r)+a("Dates",t.dates?re(t.dates):r)+a("Format",t.format?re(t.format):r)+'</section><h2 class="h2">'+me("Équipes participantes")+"</h2>"+o+'<div class="links">'+i+"</div>"
}(u):(e="auto"===ht.mode?Ct():ht.hour,t=Et.map(function(e){return'<button type="button" data-sky="'+e+'" aria-pressed="'+(ht.mode===e)+'">'+me(bt[e])+"</button>"
}).join(""),o=qt(),i=le.map(function(e){return'<button type="button" class="cw" data-lang="'+e[0]+'" aria-pressed="'+(ce===e[0])+'">'+e[1]+"</button>"}).join(""),
Qt(me("Réglages"),null,!0)+'<section class="skyset"><h2 class="lbl">'+me("Langue")+'</h2><div class="sky-btns">'+i+'</div></section><section class="skyset"><h2 class="lbl">'+me("Couleur de la carte")+'</h2><div class="picks"><label class="pick"><input id="cOn" type="color" value="'+o.on+'"><span>'+me("Pays actifs")+'</span></label><button type="button" class="cw" data-cw-reset="1">'+me("Par défaut")+'</button></div></section><section class="skyset"><h2 class="lbl">'+me("Ciel")+'</h2><div class="sky-btns">'+t+'</div><div class="slider"><div class="slider-top"><label for="skyHour">'+me("Heure simulée")+'</label><span class="mono" id="skyHourLbl">'+Mt(e)+'</span></div><input id="skyHour" type="range" min="0" max="24" step="0.25" value="'+e.toFixed(2)+'"></div><label class="check" for="skyOn"><input id="skyOn" type="checkbox"'+(ht.on?" checked":"")+">"+me("Étoiles, soleil et lune")+'</label><label class="check" for="skySound"><input id="skySound" type="checkbox"'+(ht.sound?" checked":"")+">"+me("Son des étoiles filantes")+'</label><label class="check" for="skyClouds"><input id="skyClouds" type="checkbox"'+(ht.clouds?" checked":"")+">"+me("Nuages")+'</label><label class="check" for="skyLight"><input id="skyLight" type="checkbox"'+(ht.light?" checked":"")+">"+me("Éclairer le globe selon l’heure")+'</label><p class="sub">'+me("Le ciel est calé sur Paris. En mode Auto, il suit ton heure réelle.")+'</p></section><section><h2 class="lbl">'+me("Jeux")+'</h2><p class="sub">'+me("Active ou masque un jeu, change son tier, ou ajoute un jeu. Tes choix sont gardés sur cet appareil.")+"</p>"+a.map(function(e){
return'<div class="gamerow'+(I(e.id)?"":" off")+'"><input type="checkbox" data-gon="'+e.id+'" aria-label="'+re(Ee(e))+'"'+(I(e.id)?" checked":"")+">"+xe(e,!0)+'<span class="row-n">'+re(Ee(e))+'</span><select data-tier-of="'+e.id+'" aria-label="Tier">'+[1,2,3].map(function(t){
return'<option value="'+t+'"'+(ke.tiers[e.id]===t?" selected":"")+">T"+t+"</option>"
}).join("")+"</select>"+(e.custom?'<button type="button" class="gdel" data-act="delgame" data-id="'+e.id+'" aria-label="'+me("Supprimer")+'">×</button>':"<span></span>")+"</div>"
}).join("")+'<div class="addgame"><input id="agName" type="text" maxlength="30" placeholder="'+me("Nom du jeu à ajouter")+'"><select id="agTier" aria-label="Tier"><option value="1">T1</option><option value="2">T2</option><option value="3" selected>T3</option></select><button type="button" class="lnk primary" data-act="addgame">'+me("Ajouter")+'</button></div><p class="sub">'+me("Un jeu ajouté apparaît dans les filtres ; ses équipes arrivent quand la source de données le couvre.")+"</p></section>"),
m.scrollTop=0,m.classList.remove("pin-in"),m.offsetWidth,m.classList.add("pin-in")}function gn(){ae("#tiers").innerHTML=["all",1,2,3].map(function(e){
return'<button type="button" class="seg-btn" data-tier="'+e+'" aria-pressed="'+(ke.tier===e)+'">'+("all"===e?me("Tous"):"T"+e)+"</button>"}).join("");var e="",t=0
;a.slice().sort(function(e,t){return ke.tiers[e.id]-ke.tiers[t.id]}).forEach(function(n){
I(n.id)&&("all"!==ke.tier&&ke.tiers[n.id]!==ke.tier||("all"===ke.tier&&ke.tiers[n.id]!==t&&(t=ke.tiers[n.id],e+='<span class="grp" aria-hidden="true">T'+t+"</span>"),
e+='<button type="button" class="chip" data-game="'+n.id+'" aria-pressed="'+(ke.game===n.id)+'">'+xe(n)+re(n.short)+"</button>"))}),ae("#chips").innerHTML=e}
function hn(){gn(),ct(),Fe(),"game"===ke.view.t&&ke.game!==ke.view.id&&(ke.view={t:"home"}),"country"!==ke.view.t&&"home"!==ke.view.t&&"game"!==ke.view.t||fn()}
function vn(e){ke.game=ke.game===e?null:e,ke.game&&"all"!==ke.tier&&ke.tiers[e]!==ke.tier&&(ke.tier="all"),ke.game?ke.view={t:"game",id:ke.game,role:null,sort:"name"
}:"game"===ke.view.t&&(ke.view={t:"home"}),hn(),_t()}Object.keys(t).forEach(function(e){rt[e]&&(pn[t[e]]=rt[e])}),ae("#panel").addEventListener("click",function(e){
var t=e.target.closest("[data-lang]");if(t)!function(e){ce=e;try{localStorage.setItem("lobby.lang",e)}catch(e){}jn(),bn(),gn(),fn(),qn(),ct(!0),
document.querySelectorAll(".pin").forEach(function(){})}(t.getAttribute("data-lang"));else{if(e.target.closest("[data-cw-reset]"))return ht.custom=null,ht.cw="signal",
yt(),Nt(),ze(),void fn();var n=e.target.closest("[data-sky]");if(n)Vt(n.getAttribute("data-sky"));else{var r=e.target.closest("[data-act]");if(r){
var o,i,s,l=r.getAttribute("data-act");if("org"===l)Kt(r.getAttribute("data-id"));else if("back"===l)Yt();else if("tab"===l)ke.view.tab=r.getAttribute("data-tab"),
fn();else if("game"===l)vn(r.getAttribute("data-id"));else if("match"===l)Zt(r.getAttribute("data-i"));else if("fav"===l)!function(e,t){var n=m[e].indexOf(t)
;n>-1?m[e].splice(n,1):m[e].push(t);try{localStorage.setItem("lobby.fav",JSON.stringify(m))}catch(e){}}(r.getAttribute("data-k"),r.getAttribute("data-id")),fn(),qn(),
ct(!0);else if("player"===l)Wt(r.getAttribute("data-id"));else if("roster"===l)o=r.getAttribute("data-org"),i=r.getAttribute("data-g"),s=ie(o),ke.view={t:"roster",org:o,
g:i},fn(),_t(),s.real?pt(s.lat,s.lng,.85,1200,0):pt(s.lat,s.lng,.3,1300,58);else if("role"===l)ke.view.role=r.getAttribute("data-role")||null,
fn();else if("sort"===l)ke.view.sort=r.getAttribute("data-sort"),fn();else if("htab"===l)ke.home=r.getAttribute("data-h"),fn();else if("comp"===l){ke.view={t:"comp",
id:r.getAttribute("data-id")},fn();var c=d.filter(function(e){return e.id===ke.view.id})[0];c&&c.venue&&pt(c.venue[1],c.venue[2],.6,1200)
}else if("cst"===l)ke.cst=r.getAttribute("data-st"),fn();else if("retry"===l){var u=ie(r.getAttribute("data-org"));delete j[u.id+"|"+r.getAttribute("data-g")],
ee(u,r.getAttribute("data-g")),_()}else if("addgame"===l){var p=(ae("#agName").value||"").trim();if(!p)return
;var f="c"+Date.now().toString(36),g=Number(ae("#agTier").value)||3,h={id:f,name:p,short:p,mono:p.replace(/[^A-Za-z0-9]/g,"").slice(0,3).toUpperCase()||"?",tier:g,aka:[],
custom:!0};a.push(h),N.custom.push(h),ke.tiers[f]=g,G(),bn(),gn(),_(),Le(p+" ajouté")}else if("delgame"===l){var v=r.getAttribute("data-id")
;a.splice(a.findIndex(function(e){return e.id===v}),1),N.custom=N.custom.filter(function(e){return e.id!==v}),delete N.off[v],delete N.tiers[v],
ke.game===v&&(ke.game=null),G(),bn(),gn(),ct(!0),_()}}}}}),ae("#panel").addEventListener("keydown",function(e){var t=e.target.closest&&e.target.closest(".comp.clk")
;!t||"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),t.click())}),ae("#panel").addEventListener("input",function(e){var t={cOn:"on"}[e.target.id]
;if(t)return ht.custom=ht.custom||{},ht.custom[t]=e.target.value,yt(),Nt(),void ze();"skyHour"===e.target.id&&(ht.mode="manual",ht.hour=Number(e.target.value),yt(),Bt(),
ae("#skyHourLbl").textContent=Mt(ht.hour),document.querySelectorAll("[data-sky]").forEach(function(e){e.setAttribute("aria-pressed","false")}))}),
ae("#panel").addEventListener("change",function(e){var t=e.target.getAttribute&&e.target.getAttribute("data-gon");if(t)return e.target.checked?delete N.off[t]:N.off[t]=1,
e.target.checked||ke.game!==t||(ke.game=null),G(),gn(),qn(),ct(!0),Fe(),void _();var n=e.target.getAttribute&&e.target.getAttribute("data-tier-of")
;if(n)return ke.tiers[n]=Number(e.target.value),N.tiers[n]=ke.tiers[n],G(),ke.game===n&&"all"!==ke.tier&&ke.tier!==ke.tiers[n]&&(ke.game=null),gn(),ct(),void Fe()
;"skyOn"===e.target.id&&(ht.on=e.target.checked,yt(),Bt()),"skySound"===e.target.id&&(ht.sound=e.target.checked,yt(),ht.sound&&It()),
"skyClouds"===e.target.id&&(ht.clouds=e.target.checked,yt()),"skyLight"===e.target.id&&(ht.light=e.target.checked,yt(),Bt())}),
ae("#btnSettings").addEventListener("click",function(){"settings"===ke.view.t?Ut():(ke.view={t:"settings"},fn(),_t())}),
ae("#btnHome").addEventListener("click",function(){var e=function(e,t){it={lat:e,lng:t},ct(!0),pt(e,t,.9,1400)},t=function(){var t=function(){var e="";try{
e=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}return{"Europe/Paris":[48.86,2.35],"Europe/London":[51.5,-.12],"Europe/Berlin":[52.52,13.4],
"Europe/Madrid":[40.42,-3.7],"Europe/Rome":[41.9,12.5],"Europe/Brussels":[50.85,4.35],"Europe/Amsterdam":[52.37,4.9],"America/New_York":[40.71,-74],
"America/Chicago":[41.88,-87.63],"America/Los_Angeles":[34.05,-118.24],"America/Sao_Paulo":[-23.55,-46.63],"Asia/Seoul":[37.57,126.98],"Asia/Tokyo":[35.68,139.69],
"Asia/Shanghai":[31.23,121.47],"Australia/Sydney":[-33.87,151.2]}[e]||null}();t?e(t[0],t[1]):(Ut(),Le(me("Position indisponible")))}
;navigator.geolocation?navigator.geolocation.getCurrentPosition(function(t){e(t.coords.latitude,t.coords.longitude)},t,{timeout:4e3,maximumAge:6e5}):t()}),
ae("#brand").addEventListener("click",Ut),ae("#btnSky").addEventListener("click",function(){var e=Et.indexOf(ht.mode);Vt(Et[(e+1)%Et.length]),
Le(me("Ciel : ")+me(bt[ht.mode])+("auto"===ht.mode?"":" ("+Mt(ht.hour)+")"))}),ae("#tiers").addEventListener("click",function(e){var t=e.target.closest("[data-tier]")
;if(t){var n=t.getAttribute("data-tier");ke.tier="all"===n?"all":Number(n),ke.game&&"all"!==ke.tier&&ke.tiers[ke.game]!==ke.tier&&(ke.game=null),hn()}}),
ae("#chips").addEventListener("click",function(e){var t=e.target.closest("[data-game]");t&&vn(t.getAttribute("data-game"))}),
ae("#chips").addEventListener("wheel",function(e){Math.abs(e.deltaY)>Math.abs(e.deltaX)&&(this.scrollLeft+=e.deltaY,e.preventDefault())},{passive:!1});var yn=[]
;function bn(){yn.length=0,r.forEach(function(e){yn.push({type:"org",id:e.id,label:e.name,alt:[e.short],meta:(e.city?ge(e.city)+" · ":"")+be(e.country),cc:e.country,org:e
})}),a.forEach(function(e){yn.push({type:"game",id:e.id,label:Ee(e),alt:e.aka.concat([e.short,e.name]),meta:"Tier "+e.tier})}),Object.keys(n).forEach(function(e){
yn.push({type:"country",id:e,label:be(e),alt:[n[e].en,n[e].name],meta:"",cc:e})}),o.forEach(function(e){yn.push({type:"player",id:e.id,label:l(e),alt:[],
meta:(e.role?e.role+" · ":"")+ie(e.org).short,cc:e.cc})})}function En(e){return e.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9 ]/g,"")}
function wn(e,t){var n=e.length,a=t.length;if(!n)return a;if(!a)return n;for(var r=[],o=0;o<=a;o++)r[o]=o;for(var i=1;i<=n;i++){var s=r[0];r[0]=i;for(var l=1;l<=a;l++){
var c=r[l];r[l]=Math.min(r[l]+1,r[l-1]+1,s+(e[i-1]===t[l-1]?0:1)),s=c}}return r[a]}function kn(e,t){var n=99;return[t.label].concat(t.alt).forEach(function(t){var a=En(t)
;if(a)if(0===a.indexOf(e))n=Math.min(n,0);else if(a.split(" ").some(function(t){return 0===t.indexOf(e)
}))n=Math.min(n,1);else if(a.indexOf(e)>-1)n=Math.min(n,2);else if(e.length>=3){
var r=Math.min(wn(e,a.slice(0,e.length)),wn(e,a.slice(0,e.length+1)),wn(e,a.slice(0,e.length-1)));r<=1?n=Math.min(n,3):e.length>=6&&r<=2&&(n=Math.min(n,4))}}),n}
var Cn=[],Mn=0;function Ln(e,t){Cn=e,Mn=0;var n=ae("#results");n.innerHTML=(t?'<li class="res-h" role="presentation">'+t+"</li>":"")+(e.length?e.map(function(e,t){
return'<li role="option" id="r'+t+'" class="res" data-i="'+t+'" aria-selected="'+(0===t)+'"><span class="res-i">'+function(e){
return"game"===e.type?xe(oe(e.id),!0):"player"===e.type?'<span class="tile sm" aria-hidden="true">'+re(c(e.label))+"</span>":"org"===e.type&&e.org&&e.org.real?O(e.org,"xs"):Te(e.cc)
}(e)+'</span><span class="res-l">'+re(e.label)+'</span><span class="res-m">'+re(e.meta||"")+'</span><span class="res-t">'+me(M[e.type])+"</span></li>"
}).join(""):'<li class="res-empty">'+me("Aucun résultat. Vérifie l’orthographe.")+"</li>"),n.hidden=!1,ae("#q").setAttribute("aria-expanded","true")}function Rn(){
ae("#results").hidden=!0,ae("#q").setAttribute("aria-expanded","false")}function An(){var e=En(ae("#q").value.trim());e?Ln(yn.map(function(t){return{e:t,s:kn(e,t)}
}).filter(function(e){return e.s<99}).sort(function(e,t){return e.s-t.s}).slice(0,6).map(function(e){return e.e})):Ln((T?K(5).map(function(e){return e.id
}):["vitality","kc","g2","t1"]).map(function(e){return yn.filter(function(t){return"org"===t.type&&t.id===e})[0]}).filter(Boolean),me("Les plus consultées"))}
function Tn(e){Cn.length&&(Mn=(e+Cn.length)%Cn.length,document.querySelectorAll("#results .res").forEach(function(e,t){e.setAttribute("aria-selected",String(t===Mn))}))}
function Sn(e){e&&(ae("#q").value="",Rn(),ae("#q").blur(),"org"===e.type?Kt(e.id):"country"===e.type?Jt(e.id):"game"===e.type?(ke.game=null,vn(e.id)):Wt(e.id))}
var xn=ae("#q");function Hn(){Nt(),ze(),Bt()}function jn(){document.documentElement.lang=ce,
ae("label[for=q]").textContent=me("Rechercher une équipe, un joueur, un jeu ou un pays"),ae("#q").placeholder=me("Rechercher une équipe, un joueur, un jeu…"),
ae("#btnSettings").setAttribute("aria-label",me("Réglages")),ae(".ticker").setAttribute("aria-label",me("Équipes")),
ae(".hint").textContent=me("Glisse pour tourner, molette pour zoomer, clique un pays ou une équipe."),ae("#btnSky").firstChild.nodeValue=me("Ciel"),
ae("#btnSky").setAttribute("aria-label",me("Changer le moment de la journée")),ae("#btnHome").title=me("Ma position"),
ae("#btnHome").setAttribute("aria-label",me("Ma position")),ae("#tiers").setAttribute("aria-label",me("Niveau des jeux"))}xn.addEventListener("input",An),
xn.addEventListener("focus",An),xn.addEventListener("blur",function(){setTimeout(Rn,140)}),xn.addEventListener("keydown",function(e){
"ArrowDown"===e.key?(e.preventDefault(),Tn(Mn+1)):"ArrowUp"===e.key?(e.preventDefault(),Tn(Mn-1)):"Enter"===e.key?(e.preventDefault(),
Sn(Cn[Mn])):"Escape"===e.key&&(xn.value="",Rn(),xn.blur())}),ae("#results").addEventListener("mousedown",function(e){var t=e.target.closest(".res")
;t&&(e.preventDefault(),Sn(Cn[Number(t.getAttribute("data-i"))]))}),document.addEventListener("keydown",function(e){
"/"!==e.key||document.activeElement===xn||/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)||(e.preventDefault(),xn.focus())}),
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",Hn),new MutationObserver(Hn).observe(document.documentElement,{attributes:!0,
attributeFilter:["data-theme"]});var Pn="";function qn(){var e=function(e){return'<span class="tk lab"><b>'+e+"</b></span>"
},t=r.filter(Ce),n=m.org.map(ie).filter(Boolean),a=t.filter(function(e){return!g("org",e.id)});T&&(a=a.slice(0,60));var o=function(e){var t=g("org",e.id)
;return'<button class="tk'+(t?" fav":"")+'" type="button" data-act="org" data-id="'+e.id+'">'+(e.real?O(e,"xs"):"<i>"+e.country+"</i>")+(t?"★ ":"")+re(e.name)+"</button>"
},i=w.map(function(e,t){return{m:e,i:t}}).filter(function(e){return I(e.m.game)}).sort(function(e,t){return E(t.m)-E(e.m)
}),s=(n.length?e("★ "+me("Favoris"))+n.map(o).join(""):"")+e(me("Matchs du jour"))+i.map(function(e){var t=e.m,n=b(t,"a"),a=b(t,"b")
;return'<button class="tk match'+(E(t)?" fav":"")+'" type="button" data-act="match" data-i="'+e.i+'"><i>'+t.t+"</i>"+z(n.name,n.short,"xs",n.logo)+re(n.short)+(null!=t.sa&&"not_started"!==t.status?" <b>"+t.sa+"</b>":"")+" <u>vs</u> "+(null!=t.sb&&"not_started"!==t.status?"<b>"+t.sb+"</b> ":"")+z(a.name,a.short,"xs",a.logo)+re(a.short)+"<small>"+re(t.comp)+"</small></button>"
}).join("")+e(me("Compétitions en cours"))+d.filter(function(e){return"live"===e.st&&I(e.game)}).map(function(e){
return'<span class="tk comp"><span class="dot"></span>'+re(e.name)+"</span>"
}).join("")+e(me("Équipes"))+a.map(o).join("")+'<span class="tk end"></span>',l=s+s,c=ae("#ticker");l!==Pn&&(Pn=l,c.innerHTML=l,
c.style.animationDuration=Math.max(120,Math.round(c.scrollWidth/2/30))+"s")}ae("#ticker").addEventListener("click",function(e){var t=e.target.closest("[data-act]")
;t&&("match"===t.getAttribute("data-act")?Zt(t.getAttribute("data-i")):"org"===t.getAttribute("data-act")&&Kt(t.getAttribute("data-id")))});var Nn,Dn,Gn={en:{
"Pays actifs":"Active countries",Terres:"Land","Halo du globe":"Globe glow","Par défaut":"Default",Maintenant:"Now","Son des étoiles filantes":"Shooting star sound",
"Matchs du jour":"Today’s matches","Données en direct · mise à jour {t}":"Live data · updated {t}",Favoris:"Favorites",Favori:"Favorite",
"Compétitions en cours":"Live competitions","Regarder en direct":"Watch live","Score et détails":"Score and details",Regarder:"Watch",
"Ajouter aux favoris":"Add to favorites","Retirer des favoris":"Remove from favorites","Début dans {n}":"Starts in {n}","Terminé":"Finished",
"Les liens mènent vers les sources officielles de la compétition.":"Links go to the competition’s official sources."},es:{"Pays actifs":"Países activos",Terres:"Tierras",
"Halo du globe":"Halo del globo","Par défaut":"Por defecto",Maintenant:"Ahora","Son des étoiles filantes":"Sonido de estrellas fugaces",
"Matchs du jour":"Partidos de hoy","Données en direct · mise à jour {t}":"Datos en vivo · actualizado {t}",Favoris:"Favoritos",Favori:"Favorito",
"Compétitions en cours":"Competiciones en curso","Regarder en direct":"Ver en directo","Score et détails":"Resultado y detalles",Regarder:"Ver",
"Ajouter aux favoris":"Añadir a favoritos","Retirer des favoris":"Quitar de favoritos","Début dans {n}":"Empieza en {n}","Terminé":"Terminado",
"Les liens mènent vers les sources officielles de la compétition.":"Los enlaces llevan a las fuentes oficiales de la competición."},de:{"Pays actifs":"Aktive Länder",
Terres:"Land","Halo du globe":"Globus-Schein","Par défaut":"Standard",Maintenant:"Jetzt","Son des étoiles filantes":"Sternschnuppen-Ton",
"Matchs du jour":"Heutige Spiele","Données en direct · mise à jour {t}":"Live-Daten · aktualisiert {t}",Favoris:"Favoriten",Favori:"Favorit",
"Compétitions en cours":"Laufende Wettbewerbe","Regarder en direct":"Live ansehen","Score et détails":"Ergebnis und Details",Regarder:"Ansehen",
"Ajouter aux favoris":"Zu Favoriten","Retirer des favoris":"Aus Favoriten entfernen","Début dans {n}":"Beginnt in {n}","Terminé":"Beendet",
"Les liens mènent vers les sources officielles de la compétition.":"Die Links führen zu den offiziellen Quellen des Wettbewerbs."}};function In(){
"function"==typeof fetch&&"file:"!==location.protocol&&fetch("/api/live",{cache:"no-cache"}).then(function(e){return e.ok?e.json():null}).then(function(e){
e&&e.matches&&function(e){var t=(e.matches||[]).filter(function(e){return e.ts}).sort(function(e,t){return e.ts-t.ts
}),n="FR DE ES IT GB UK PT NL BE DK SE NO FI PL CZ SK HU RO BG GR TR LT LV EE AT CH IE UA RS HR SI".split(" "),a=function(e){var t=e&&S[F(e)],n=t&&ie(t)
;return n?n.country:""},r={lol:400,val:380,cs2:380,rl:300,r6:200,fc:180,cod:120,fn:80,ow:60,apex:60,dota:-200},o={s:3,a:2,b:1,c:.5,d:.25},i=function(e){
var t=a(e.an),i=a(e.bn),s=(e.comp||"")+" "+(e.serie||""),l="FR"===t||"FR"===i||/\b(LFL|LDLC|Ligue Fran|Gamers Origin|Elite Series|France|French)\b/i.test(s),c=n.indexOf(t)>=0||n.indexOf(i)>=0||/\b(LEC|EMEA|Europe|European|Prime League|Superliga|Ultraliga|LVP|NLC|EU)\b/i.test(s)
;return 1e5*(l?3:c?2:1)+2e4*(o[e.tier]||1)+10*(r[e.game]||0)+("running"===e.status?3e3:0)+(e.imp||0)-Math.abs(e.ts-Date.now())/36e5};t.forEach(function(e){
Z(e.an,e.al,""),Z(e.bn,e.bl,"")}),Date.now();var s=new Date;s.setHours(0,0,0,0);var l=t.filter(function(e){
return"running"===e.status||"not_started"===e.status&&e.ts<s.getTime()+1296e5||"finished"===e.status&&e.ts>s.getTime()}).sort(function(e,t){return i(t)-i(e)}).slice(0,40)
;w.length=0,l.forEach(function(e){var t=new Date(e.ts);e.t=se(t.getHours())+":"+se(t.getMinutes()),w.push(e)});var c={};d.length=0,t.forEach(function(e){
var t="running"===e.status?"live":"finished"===e.status?"done":"soon",n=e.comp+"|"+e.game;if(!c[n]||"live"===t&&"live"!==c[n].st){var a=c[n]||{id:n,name:e.comp,
game:e.game,region:e.serie||"",st:t,watch:e.watch,info:""};a.st="live"===t?"live":a.st,c[n]=a}}),Object.keys(c).forEach(function(e){d.push(c[e])}),v=!0,
y=e.updated||Date.now(),qn(),fn()}(e)}).catch(function(){})}Object.keys(Gn).forEach(function(e){pe[e]=pe[e]||{},Object.keys(Gn[e]).forEach(function(t){pe[e][t]=Gn[e][t]})
}),qn(),In(),function(){if("function"==typeof fetch&&"file:"!==location.protocol){try{var e=JSON.parse(localStorage.getItem("lobby.orgs")||"null")
;e&&e.orgs&&Date.now()-e.updated<6048e5&&Y(e)}catch(e){}fetch("/api/orgs",{cache:"no-cache"}).then(function(e){return e.ok?e.json():null}).then(function(e){if(e&&e.orgs){
Y(e);try{localStorage.setItem("lobby.orgs",JSON.stringify(e))}catch(e){}}}).catch(function(){}),fetch("/jerseys.json",{cache:"no-cache"}).then(function(e){
return e.ok?e.json():null}).then(function(e){e&&(P=e,"org"===ke.view.t&&_())}).catch(function(){})}}(),setInterval(function(){"visible"===document.visibilityState&&In()
},6e4),jn(),bn(),Nt(),qn(),gn(),fn(),Bt(),Nn=function(){var n=ae("#globe");if("function"==typeof Globe){var a=matchMedia("(prefers-reduced-motion: reduce)").matches
;if("function"==typeof(qe=Globe({animateIn:!a
})(n).backgroundColor("rgba(0,0,0,0)").showAtmosphere(!0).atmosphereColor(He.atmo).atmosphereAltitude(.14).polygonsData(e.features).polygonCapColor(Ie).polygonSideColor(function(){
return He.stroke}).polygonStrokeColor(function(){return He.stroke}).polygonAltitude(function(){return Ze
}).polygonsTransitionDuration(250).pathsData(ot).pathPoints(function(e){return e}).pathPointLat(function(e){return e[1]}).pathPointLng(function(e){return e[0]
}).pathPointAlt(.0075).pathStroke(null).pathTransitionDuration(0).pathColor(function(){return Pe()?"rgba(20,24,30,0.35)":"rgba(236,238,242,0.3)"
}).onPolygonHover(function(e){Ne=e,n.style.cursor=e?"pointer":"",Fe()}).onPolygonClick(function(e){Jt(t[e.properties.name]||null,e.properties.name)
}).htmlLat("lat").htmlLng("lng").htmlAltitude(function(e){return.009
}).pointLat("lat").pointLng("lng").pointAltitude(.045).pointRadius(.09).pointResolution(6).pointsMerge(!1).pointColor(function(e){return"rgba(244,244,242,.95)"
}).htmlElement(function(e){return e.el||(e.el=lt(e))})).htmlElementVisibilityModifier&&qe.htmlElementVisibilityModifier(function(e,t){e.style.opacity=t?1:0,
e.style.pointerEvents=t?"auto":"none"}),"undefined"!=typeof THREE){try{qe.customLayerData(Ge).customThreeObject(function(e){var t=Ke(e.k);return e.obj=t,t
}).customThreeObjectUpdate(function(e,t){Object.assign(e.position,qe.getCoords(t.lat,t.lng,void 0===t.lift?Ze:t.lift)),e.lookAt(0,0,0)})}catch(e){
console.warn("Monuments indisponibles",e)}try{jt()}catch(e){console.warn("Ciel 3D indisponible",e),At=null}try{Ft()}catch(e){console.warn("Nuages indisponibles",e),
Dt=null}}!function(){try{(Tt=qe.lights().filter(function(e){return"DirectionalLight"===e.type})[0]||null)&&(St=Tt.position.clone())}catch(e){Tt=null}}()
;var r=qe.controls();r.autoRotate=!a,r.autoRotateSpeed=.4,r.minDistance=112,r.maxDistance=480,r.addEventListener("start",function(){r.autoRotate=!1,ut=null}),
r.addEventListener("change",Qe),n.addEventListener("wheel",function(e){if(qe&&!ut){var t=qe.pointOfView()
;e.deltaY<0&&!dt&&t.altitude<.7&&t.altitude>.2?pt(t.lat,t.lng,Math.max(.3,.85*t.altitude),900,40):e.deltaY>0&&dt&&t.altitude>.95&&pt(dt.lat,dt.lng,1,900)}},{passive:!0}),
qe.pointOfView({lat:L,lng:R,altitude:A},0),ze(),ct(!0),Qe(),Bt();var o=function(){var e=n.getBoundingClientRect();e.width&&e.height&&qe.width(e.width).height(e.height)}
;o(),new ResizeObserver(o).observe(n)}else n.innerHTML='<p class="fail">Le globe 3D n’a pas pu se charger. Recharge la page.</p>'},Dn=function(){
var e=document.createElement("script");e.src="/lib/globe.gl.min.js",e.onload=Nn,e.onerror=Nn,document.head.appendChild(e)},
import("/lib/three.module.min.js").then(function(e){window.THREE=Object.assign({},e),Dn()}).catch(function(){Dn()}),function(){
var e=document.querySelector(".ticker"),t=ae("#ticker");if(e&&t){
var n=0,a=!1,r=0,o=0,i=performance.now(),s=0,l=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;t.style.animation="none",e.style.cursor="grab",
e.style.touchAction="pan-y",requestAnimationFrame(function e(r){var o=Math.min(.05,(r-i)/1e3);i=r,!a&&!l&&r>s&&(n+=-32*o),function(){var e=t.scrollWidth/2;if(e){
for(;n<-e;)n+=e;for(;n>0;)n-=e}}(),t.style.transform="translate3d("+n.toFixed(1)+"px,0,0)",requestAnimationFrame(e)}),e.addEventListener("pointerdown",function(t){
if(!(t.button>0)){a=!0,r=0,o=t.clientX,e.style.cursor="grabbing";try{e.setPointerCapture(t.pointerId)}catch(e){}}}),e.addEventListener("pointermove",function(e){if(a){
var t=e.clientX-o;o=e.clientX,r+=Math.abs(t),n+=t}}),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),e.addEventListener("lostpointercapture",c),
e.addEventListener("click",function(e){r>6&&(e.stopPropagation(),e.preventDefault(),r=0)},!0),e.addEventListener("wheel",function(e){
var t=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;n-=t,s=performance.now()+1800,e.preventDefault()},{passive:!1}),e.addEventListener("keydown",function(e){
"ArrowLeft"===e.key&&(n+=160,s=performance.now()+1800),"ArrowRight"===e.key&&(n-=160,s=performance.now()+1800)})}function c(){a&&(a=!1,e.style.cursor="grab",
r>6&&(s=performance.now()+1800))}}(),function(){var e=document.querySelector(".panel"),t=document.getElementById("sheetGrip");if(e&&t){var n=function(){
return matchMedia("(max-width: 820px)").matches},a=function(){return.4*innerHeight},r=function(){return.06*innerHeight},o=!1;g(),addEventListener("resize",g)
;var i=!1,s=0,l=0,c=0,u=0,d=0,p=0;t.addEventListener("pointerdown",function(a){if(n()){i=!0,s=a.clientY,l=f(),c=l,u=a.clientY,d=performance.now(),p=0,
e.classList.add("sheet-drag");try{t.setPointerCapture(a.pointerId)}catch(e){}}}),t.addEventListener("pointermove",function(e){if(i){
m(c=Math.max(r(),Math.min(innerHeight-56,l+(e.clientY-s))));var t=performance.now();p=(e.clientY-u)/Math.max(1,t-d),u=e.clientY,d=t}}),
t.addEventListener("pointerup",function(t){if(i){var n=Math.abs(t.clientY-s);if(i=!1,e.classList.remove("sheet-drag"),n<6)return o=!o,void g();var r=innerHeight-a()/2
;o=p<-.35||!(p>.35)&&c<r,g()}}),t.addEventListener("pointercancel",function(){i=!1,e.classList.remove("sheet-drag"),g()})}function m(t){
e.style.setProperty("--sheet-y",t+"px")}function f(){return o?r():innerHeight-a()}function g(){n()?m(f()):e.style.removeProperty("--sheet-y")}}(),window.__atlas={
openOrg:Kt,openCountry:Jt,goHome:Ut,getGlobe:function(){return qe},setSky:Vt,setHour:function(e){ht.mode="manual",ht.hour=e,Bt()},hover:function(t){
Ne=e.features.filter(function(e){return e.properties.name===t})[0]||null,Fe()},sky:function(){return{sky:ht,sun:xt,hasSky:!!At,hasLight:!!Tt,
lightPos:Tt&&[Tt.position.x,Tt.position.y,Tt.position.z]}}}}
(function () {
  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js';
  s.onload = function () {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(function (r) { return r.json(); }).then(function (w) {
      var f = topojson.feature(w, w.objects.countries).features.filter(function (x) { return x.properties.name !== 'Antarctica'; });
      boot({ type: 'FeatureCollection', features: f });
    });
  };
  document.head.appendChild(s);
})();
