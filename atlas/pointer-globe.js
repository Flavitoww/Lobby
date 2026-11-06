/* Reliable pointer rotation for the real Globe.GL / Three.js camera.
   Keep zoom in Globe.GL OrbitControls; implement drag explicitly to avoid
   browser-specific iframe / passive listener inconsistencies. */
(function(){
"use strict";
function attach(globe, canvas, stage, options={}){
  if(!globe||!canvas||!stage)throw Error("Missing WebGL globe");
  const speedLng=Number(options.speedLng)||0.30, speedLat=Number(options.speedLat)||0.20;
  let active=null, recentUntil=0, dragCount=0;
  function wrap(n){return ((n+540)%360+360)%360-180}
  function clamp(n){return Math.max(-85,Math.min(85,n))}
  const onDrag=typeof options.onDrag==="function"?options.onDrag:()=>{};
  const eventLog=[];
  function onDown(e){
    if(e.button!==undefined&&e.button!==0)return;
    if(active||!(e.isPrimary??true))return;
    const pov=globe.pointOfView();
    active={id:e.pointerId,x:e.clientX,y:e.clientY,lat:pov.lat,lng:pov.lng,altitude:pov.altitude,moved:false};
    canvas.setPointerCapture?.(e.pointerId);
    stage.classList.add("dragging");
    stage.dataset.pointerState="down";
    eventLog.push("down");
    if(e.cancelable)e.preventDefault();
  }
  function onMove(e){
    if(!active||active.id!==e.pointerId)return;
    const dx=e.clientX-active.x,dy=e.clientY-active.y;
    if(Math.abs(dx)+Math.abs(dy)>5)active.moved=true;
    if(active.moved){
      globe.pointOfView({lat:clamp(active.lat+dy*speedLat),lng:wrap(active.lng-dx*speedLng),altitude:active.altitude},0);
      dragCount++;
      stage.dataset.dragCount=String(dragCount);
      stage.dataset.pointerState="dragging";
      onDrag();
    }
    if(e.cancelable)e.preventDefault();
  }
  function onUp(e){
    if(!active||active.id!==e.pointerId)return;
    if(active.moved)recentUntil=performance.now()+300;
    active=null;
    try{if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId)}catch(err){}
    stage.classList.remove("dragging");
    stage.dataset.pointerState="idle";
  }
  const optionsNonPassive={passive:false};
  canvas.style.touchAction="none";
  canvas.style.cursor="grab";
  canvas.addEventListener("pointerdown",onDown,optionsNonPassive);
  canvas.addEventListener("pointermove",onMove,optionsNonPassive);
  canvas.addEventListener("pointerup",onUp,optionsNonPassive);
  canvas.addEventListener("pointercancel",onUp,optionsNonPassive);
  canvas.addEventListener("lostpointercapture",onUp);
  stage.dataset.pointerState="idle";
  return {
    get dragCount(){return dragCount},
    get eventLog(){return [...eventLog]},
    isRecentDrag(){return performance.now()<recentUntil},
    dispose(){
      for(const [name,fn] of [["pointerdown",onDown],["pointermove",onMove],["pointerup",onUp],["pointercancel",onUp],["lostpointercapture",onUp]])canvas.removeEventListener(name,fn);
    }
  };
}
window.LobbyPointerGlobe={attach};
})();