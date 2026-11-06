/* MERIDIAN Earth: astronomical light and visual cloud layer; not live weather. */
(function(){
"use strict";
const pi=Math.PI, rad=pi/180, $=s=>document.querySelector(s);
let globe=null,material=null, lastPov={lat:28,lng:15};
function solar(now=new Date()){
 const year=now.getUTCFullYear(), start=Date.UTC(year,0,0);
 const d=Math.floor((now.getTime()-start)/86400000);
 const minutes=now.getUTCHours()*60+now.getUTCMinutes()+now.getUTCSeconds()/60;
 const g=2*pi/365*(d-1+(minutes/60-12)/24);
 const decl=.006918-.399912*Math.cos(g)+.070257*Math.sin(g)-.006758*Math.cos(2*g)+.000907*Math.sin(2*g)-.002697*Math.cos(3*g)+.00148*Math.sin(3*g);
 const eq=229.18*(.000075+.001868*Math.cos(g)-.032077*Math.sin(g)-.014615*Math.cos(2*g)-.040849*Math.sin(2*g));
 return {lat:decl,lon:(((180-(minutes+eq)/4+540)%360)-180)*rad};
}
function period(lat,lng,pos){
 const p=lat*rad,l=lng*rad;
 const alt=Math.sin(p)*Math.sin(pos.lat)+Math.cos(p)*Math.cos(pos.lat)*Math.cos(l-pos.lon);
 return alt>.13?"day":alt<-.12?"night":"twilight";
}
function update(pov){
 if(pov)lastPov=pov;
 const s=solar();
 if(material)material.uniforms.sunGeo.value.set(s.lon,s.lat);
 const mode=period(lastPov.lat,lastPov.lng,s);
 const el=$("#globeStage");
 if(el)el.dataset.sky=mode;
 const icon=$("#skyIcon"),label=$("#skyPeriod"),clock=$("#skyClock");
 if(icon)icon.textContent=mode==="day"?"☀":mode==="night"?"☾":"◐";
 if(label)label.textContent=mode==="day"?"Jour à cet endroit":mode==="night"?"Nuit à cet endroit":"Crépuscule à cet endroit";
 if(clock)clock.textContent=new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit",timeZone:"UTC"})+" UTC";
}
const vertex=["varying vec2 vUv;","void main(){","vUv=uv;","gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);","}"].join("");
const fragment=[
"uniform sampler2D dayTex,nightTex,cloudTex,heightTex;",
"uniform float cloudEnabled,heightEnabled;",
"uniform vec2 sunGeo;varying vec2 vUv;",
"void main(){",
"float lon=(vUv.x-.5)*6.28318530718;",
"float lat=(vUv.y-.5)*3.14159265359;",
"float illum=sin(lat)*sin(sunGeo.y)+cos(lat)*cos(sunGeo.y)*cos(lon-sunGeo.x);",
"float daylight=smoothstep(-.14,.17,illum);",
"vec3 day=texture2D(dayTex,vUv).rgb;",
"vec3 night=texture2D(nightTex,vUv).rgb;",
"float relief=texture2D(heightTex,vUv).r;",
"day*=mix(1.,mix(.985,1.02,relief),heightEnabled*.48);",
"vec3 moonlit=day*vec3(.17,.235,.34);",
"float cities=max(max(night.r,night.g),night.b);",
"moonlit+=night*.14*smoothstep(.25,.85,cities);",
"vec3 col=mix(moonlit,day,daylight);",
"vec4 clouds=texture2D(cloudTex,vUv);",
"float cloud=clouds.r*clouds.a;",
"col=mix(col,vec3(.92,.96,1.),min(.11,cloud*.11)*cloudEnabled*daylight);",
"gl_FragColor=vec4(col,1.);","}"].join("");
async function init(g){
 globe=g;
 update(g.pointOfView());
 try{
  const THREE=await import("/lib/three.module.js");
  const loader=new THREE.TextureLoader();
  const images=await Promise.allSettled([
   loader.loadAsync("/lib/earth-day.jpg"),
   loader.loadAsync("/lib/earth-night.jpg"),
   loader.loadAsync("/lib/earth-clouds.png"),
   loader.loadAsync("/lib/earth-topology.png")
  ]);
  if(images[0].status!=="fulfilled"||images[1].status!=="fulfilled")return false;
  for(const res of images)if(res.status==="fulfilled"){res.value.colorSpace=THREE.SRGBColorSpace;res.value.anisotropy=2}
  material=new THREE.ShaderMaterial({uniforms:{
   dayTex:{value:images[0].value},nightTex:{value:images[1].value},
   cloudTex:{value:images[2].status==="fulfilled"?images[2].value:images[0].value},
   heightTex:{value:images[3].status==="fulfilled"?images[3].value:images[0].value},
   cloudEnabled:{value:images[2].status==="fulfilled"?1:0},
   heightEnabled:{value:images[3].status==="fulfilled"?1:0},
   sunGeo:{value:new THREE.Vector2(0,0)}
  },vertexShader:vertex,fragmentShader:fragment});
  update(g.pointOfView());
  g.globeMaterial(material);
  const status=$("#globeStatus");
  if(status)status.textContent="Éclairage solaire en temps réel · Terre texturée";
  return true;
 }catch(e){return false}
}
const stars=$("#skyStars");
if(stars){let html="";for(let i=0;i<70;i++){
 let x=((i*73.37)%100).toFixed(1),y=((i*43.91)%100).toFixed(1),opacity=(.25+(i%7)/10).toFixed(2);
 html+='<i style="left:'+x+'%;top:'+y+'%;opacity:'+opacity+'"></i>';
}stars.innerHTML=html}
update();
setInterval(()=>{if(!document.hidden)update(globe?.pointOfView())},60000);
window.LobbyEarth={solar,period,update,init};
})();