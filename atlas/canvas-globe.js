/* Lobby Atlas compatibility renderer.
 * A genuine orthographic 3D globe projection in Canvas 2D for devices that
 * cannot initialize WebGL. Uses the same Earth imagery and real UTC sun.
 * Draggable, zoomable, supports country clicks; no fake WebGL claims.
 */
(function(){
"use strict";
const PI=Math.PI,TAU=PI*2,RAD=PI/180;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const wrap=n=>((n+540)%360+360)%360-180;
const smooth=x=>{const t=clamp(x,0,1);return t*t*(3-2*t)};
function create(container,{embedded=false,onPick=()=>{}}={}){
 const canvas=document.createElement("canvas");
 canvas.className="canvas-globe-compatible";
 canvas.tabIndex=0;
 canvas.setAttribute("aria-label","Globe terrestre interactif : glisser pour tourner, molette pour zoomer, flèches pour pivoter");
 canvas.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab";
 container.replaceChildren(canvas);
 const ctx=canvas.getContext("2d",{alpha:true,desynchronized:true});
 if(!ctx)throw Error("Canvas 2D unavailable");
 let lon=15,lat=28,alt=embedded?2.25:1.9,width=1,height=1,offset=[0,0];
 let actualRadius=150,centerX=150,centerY=150,raf=0,drag=null,movedCount=0,paused=false,markers=[];
 let day=null,night=null;
 const imageCache=new Map();
 const scratch=document.createElement("canvas"),sc=scratch.getContext("2d",{willReadFrequently:true});
 function loadTexture(url,callback){
  const img=new Image();img.decoding="async";
  img.onload=()=>{try{const c=document.createElement("canvas");c.width=img.naturalWidth;c.height=img.naturalHeight;
   const t=c.getContext("2d",{willReadFrequently:true});t.drawImage(img,0,0);
   callback(t.getImageData(0,0,c.width,c.height));queue();
  }catch(e){console.warn("Canvas Earth texture unavailable",e)}};
  img.onerror=()=>{};
  img.src=url;
 }
 loadTexture("/lib/earth-day.jpg",d=>{day=d});
 loadTexture("/lib/earth-night.jpg",d=>{night=d});
 function position(){const x=container.clientWidth,y=container.clientHeight;
  width=x||600;height=y||500;const ratio=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.ceil(width*ratio);canvas.height=Math.ceil(height*ratio);
  canvas.style.width=width+"px";canvas.style.height=height+"px";
  ctx.setTransform(ratio,0,0,ratio,0,0);
  queue();
 }
 function sizes(){
  const size=Math.min(width,height);
  const zoom=Math.max(.4,Math.min(14,Math.pow(2.25/Math.max(.06,alt),.88)));
  actualRadius=Math.max(70,size*.44*zoom);
  centerX=width/2+(alt>.65?offset[0]:0);centerY=height/2+(alt>.65?offset[1]:0);
 }
 function project(latDeg,lonDeg){
  const phi=latDeg*RAD,phi0=lat*RAD,dl=(lonDeg-lon)*RAD;
  const z=Math.sin(phi0)*Math.sin(phi)+Math.cos(phi0)*Math.cos(phi)*Math.cos(dl);
  if(z<0)return null;
  return [centerX+actualRadius*Math.cos(phi)*Math.sin(dl),
   centerY-actualRadius*(Math.cos(phi0)*Math.sin(phi)-Math.sin(phi0)*Math.cos(phi)*Math.cos(dl)),z];
 }
 function inverse(x,y){
  const px=(x-centerX)/actualRadius,py=(centerY-y)/actualRadius,r2=px*px+py*py;
  if(r2>1)return null;
  const z=Math.sqrt(Math.max(0,1-r2)),phi0=lat*RAD;
  const sinLat=py*Math.cos(phi0)+z*Math.sin(phi0);
  const phi=Math.asin(clamp(sinLat,-1,1));
  const lambda=lon*RAD+Math.atan2(px,z*Math.cos(phi0)-py*Math.sin(phi0));
  return {lat:phi/RAD,lng:wrap(lambda/RAD)};
 }
 function textureSample(tex,lonRad,latRad){
  if(!tex)return null;
  const u=((lonRad/TAU+.5)%1+1)%1;
  const v=clamp(.5-latRad/PI,0,.999999);
  const fx=u*(tex.width-1),fy=v*(tex.height-1);
  const x0=Math.floor(fx),y0=Math.floor(fy),x1=(x0+1)%tex.width,y1=Math.min(tex.height-1,y0+1);
  const a=fx-x0,b=fy-y0,w=tex.width,data=tex.data;
  const i00=(y0*w+x0)*4,i10=(y0*w+x1)*4,i01=(y1*w+x0)*4,i11=(y1*w+x1)*4;
  const m=(j)=>((data[i00+j]*(1-a)+data[i10+j]*a)*(1-b)+(data[i01+j]*(1-a)+data[i11+j]*a)*b);
  return [m(0),m(1),m(2)];
 }
 function markerImage(src){
  if(!src||!/^https:\/\//.test(src))return null;
  let entry=imageCache.get(src);
  if(entry)return entry.ready?entry.img:null;
  const img=new Image();entry={img,ready:false};
  imageCache.set(src,entry);
  img.onload=()=>{entry.ready=true;queue()};
  img.onerror=()=>{imageCache.delete(src)};
  img.src=src;return null;
 }
 function paint(){
  raf=0;if(paused)return;
  sizes();ctx.clearRect(0,0,width,height);
  const radius=actualRadius;
  const ratio=drag?.moved?.86:Math.min(1.35,window.devicePixelRatio||1.25);
  const w=Math.max(180,Math.min(1120,Math.floor(width*ratio)));
  const h=Math.max(180,Math.min(900,Math.floor(height*ratio)));
  if(scratch.width!==w)scratch.width=w;
  if(scratch.height!==h)scratch.height=h;
  const pixels=sc.createImageData(w,h),rgba=pixels.data;
  const phi0=lat*RAD,lam0=lon*RAD,cos0=Math.cos(phi0),sin0=Math.sin(phi0);
  const sun=window.LobbyEarth?.solar?.(new Date())||{lat:0,lon:0};
  const sunCos=Math.cos(sun.lat),sunSin=Math.sin(sun.lat);
  const toX=width/w/radius,toY=height/h/radius;
  const baseX=-centerX/radius,baseY=centerY/radius;
  for(let py=0;py<h;py++){
   const ny=baseY-(py+.5)*toY;
   for(let px=0;px<w;px++){
    const nx=baseX+(px+.5)*toX,r2=nx*nx+ny*ny;
    const i=(py*w+px)*4;
    if(r2>1){rgba[i+3]=0;continue}
    const z=Math.sqrt(1-r2),sinPhi=clamp(ny*cos0+z*sin0,-1,1);
    const phi=Math.asin(sinPhi),lam=lam0+Math.atan2(nx,z*cos0-ny*sin0);
    const sunAmount=sinPhi*sunSin+Math.sqrt(1-sinPhi*sinPhi)*sunCos*Math.cos(lam-sun.lon);
    const daylight=smooth((sunAmount+.11)/.29);
    const illum=.78+.22*z;
    const d=daylight>.01?textureSample(day,lam,phi):null;
    const n=daylight<.99?textureSample(night,lam,phi):null;
    const dayColor=d||[28+17*Math.abs(sinPhi),88+18*Math.abs(sinPhi),154+12*Math.abs(sinPhi)];
    const nightColor=n||[6,24,48];
    rgba[i]=Math.min(255,Math.round((nightColor[0]*(1-daylight)+dayColor[0]*daylight)*illum));
    rgba[i+1]=Math.min(255,Math.round((nightColor[1]*(1-daylight)+dayColor[1]*daylight)*illum));
    rgba[i+2]=Math.min(255,Math.round((nightColor[2]*(1-daylight)+dayColor[2]*daylight)*illum));
    rgba[i+3]=255;
   }
  }
  sc.putImageData(pixels,0,0);
  ctx.save();ctx.shadowColor="rgba(88,171,255,.24)";ctx.shadowBlur=17;
  ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality="high";
  ctx.drawImage(scratch,0,0,width,height);ctx.restore();
  if(radius<Math.max(width,height)*1.25){
   ctx.save();ctx.strokeStyle="rgba(130,196,255,.45)";ctx.lineWidth=1;
   ctx.beginPath();ctx.arc(centerX,centerY,radius,0,TAU);ctx.stroke();ctx.restore();
  }
  // Source-backed team logos are laid out around country centroids (not actual addresses).
  const hitRadius=Math.max(14,Math.min(25,13+14/Math.max(.35,alt)));
  markers.forEach(p=>{
   const q=project(p.lat,p.lng);if(!q||q[0]<-40||q[1]<-40||q[0]>width+40||q[1]>height+40)return;
   const isTeam=p.kind==="org";
   const radiusPx=isTeam?hitRadius:p.live?6:4.3;
   const src=isTeam?markerImage(p.logo):null;
   ctx.save();ctx.shadowColor=p.live?"rgba(255,109,142,.65)":"rgba(61,171,255,.55)";ctx.shadowBlur=isTeam?17:10;
   ctx.fillStyle=isTeam?"rgba(5,25,50,.92)":p.live?"#ff718e":"#69bdff";
   ctx.beginPath();ctx.arc(q[0],q[1],radiusPx,0,TAU);ctx.fill();
   if(isTeam){
    ctx.shadowBlur=0;ctx.strokeStyle=p.live?"#ff718e":"#a2d6ff";ctx.lineWidth=1.5;ctx.stroke();
    if(src){ctx.save();ctx.beginPath();ctx.arc(q[0],q[1],radiusPx-4,0,TAU);ctx.clip();
      ctx.drawImage(src,q[0]-radiusPx+5,q[1]-radiusPx+5,(radiusPx-5)*2,(radiusPx-5)*2);ctx.restore()}
    else{ctx.fillStyle="#fff";ctx.font="700 11px Inter, sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(String(p.name||"").slice(0,2).toUpperCase(),q[0],q[1])}
   }
   ctx.restore();
  });
  const stage=document.querySelector("#globeStage");
  if(stage){stage.dataset.camera=[lat,lon,alt].map(x=>x.toFixed(2)).join(",");}
  window.LobbyEarth?.update?.({lat,lng:lon,altitude:alt});
 }
 function queue(){if(!raf&&!paused)raf=requestAnimationFrame(paint)}
 function pov(v){
  if(v){if(Number.isFinite(v.lat))lat=clamp(v.lat,-85,85);
    if(Number.isFinite(v.lng))lon=wrap(v.lng);
    if(Number.isFinite(v.altitude))alt=clamp(v.altitude,.06,5);
    queue();return api}
  return {lat,lng:lon,altitude:alt};
 }
 function down(e){
  if(e.button!==undefined&&e.button!==0)return;
  drag={id:e.pointerId,x:e.clientX,y:e.clientY,lat,lng:lon,moved:false};
  canvas.setPointerCapture?.(e.pointerId);canvas.style.cursor="grabbing";
  e.preventDefault?.();
 }
 function move(e){if(!drag||e.pointerId!==drag.id)return;
  const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;
  if(drag.moved){lon=wrap(drag.lng-dx*.35);lat=clamp(drag.lat+dy*.24,-85,85);
    movedCount++;const stage=document.querySelector("#globeStage");if(stage)stage.dataset.dragCount=String(movedCount);
    queue();}e.preventDefault?.();
 }
 function up(e){if(!drag||e.pointerId!==drag.id)return;
  const isClick=!drag.moved;
  drag=null;canvas.style.cursor="grab";queue();
  if(isClick){const box=canvas.getBoundingClientRect(),hit=inverse(e.clientX-box.left,e.clientY-box.top);
   if(hit){
    const nearby=markers.map(p=>{const q=project(p.lat,p.lng);return q?{p,dist:Math.hypot(q[0]-(e.clientX-box.left),q[1]-(e.clientY-box.top))}:null})
      .filter(Boolean).sort((a,b)=>a.dist-b.dist)[0];
    if(nearby&&nearby.dist<(nearby.p.kind==="org"?Math.max(20,Math.min(30,15+14/Math.max(.35,alt))):17))hit.marker=nearby.p;
    onPick(hit);
   }
  }
 }
 canvas.addEventListener("pointerdown",down,{passive:false});
 canvas.addEventListener("pointermove",move,{passive:false});
 canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);
 canvas.addEventListener("wheel",e=>{alt=clamp(alt*(1+Math.sign(e.deltaY)*.13),.06,5);queue();e.preventDefault()},{passive:false});
 canvas.addEventListener("keydown",e=>{
  if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","+","-"].includes(e.key)){e.preventDefault();
   if(e.key==="ArrowLeft")lon=wrap(lon-12);if(e.key==="ArrowRight")lon=wrap(lon+12);
   if(e.key==="ArrowUp")lat=clamp(lat+9,-85,85);if(e.key==="ArrowDown")lat=clamp(lat-9,-85,85);
   if(e.key==="+")alt=Math.max(.06,alt*.76);if(e.key==="-")alt=Math.min(5,alt*1.32);
   movedCount++;const stage=document.querySelector("#globeStage");if(stage)stage.dataset.dragCount=String(movedCount);
   queue();
  }
 });
 const observer=typeof ResizeObserver!=="undefined"?new ResizeObserver(position):null;
 observer?.observe(container);
 const api={
  isCanvasFallback:true,
  pointOfView:pov,width(v){if(v!==undefined){queue();return api}return width},
  height(v){if(v!==undefined){queue();return api}return height},
  globeOffset(v){if(v){offset=v;queue();return api}return offset},
  pointsData(v){if(v){markers=v.map(p=>({...p}));queue();return api}return markers},
  pauseAnimation(){paused=true},resumeAnimation(){paused=false;queue()},
  controls(){return {enabled:true,enableRotate:true,enableZoom:true}},
  dispose(){observer?.disconnect();if(raf)cancelAnimationFrame(raf);canvas.remove()},
  canvas
 };
 // Existing Globe.GL chained styling methods are nonoperative, markers remain real.
 for(const n of ["pointColor","pointLat","pointLng","pointAltitude","pointRadius","pointLabel",
  "ringsData","ringLat","ringLng","ringAltitude","ringMaxRadius","ringPropagationSpeed",
  "ringRepeatPeriod","ringColor","htmlElementsData","htmlLat","htmlLng","htmlAltitude","htmlElement"])
  api[n]=()=>api;
 position();
 return api;
}
window.LobbyCanvasGlobe={create};
})();