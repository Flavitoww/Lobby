const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
test('Globe uses the current official WebGL constructor',()=>{
 const src=read('atlas/meridian-atlas.js');
 assert.match(src,/new Globe\(el,\{animateIn:false/);
 assert.doesNotMatch(src,/Globe\(\{animateIn:false[^\n]*\}\)\(el\)/);
 assert.match(src,/controls\.enableRotate=false/);
 assert.match(src,/controls\.autoRotate=false/);
 assert.match(src,/LobbyPointerGlobe\.attach/);
 assert.match(read("atlas/pointer-globe.js"),/canvas\.addEventListener\("pointermove"/);
 assert.match(src,/controls\.enableZoom=true/);
 assert.doesNotMatch(src,/controls\.autoRotate=true/);
 assert.match(src,/globe\.onGlobeReady\(reveal\)/);
});
test('Home globe is not covered by headline or scrim pointer layers',()=>{
 const css=read('meridian.css');
 assert.match(css,/\.atlas-scrim\{pointer-events:none/);
 assert.match(css,/\.atlas-content \.primary-btn\{pointer-events:auto!important\}/);
 assert.match(css,/\.atlas-content>\*\{pointer-events:none!important\}/);
 assert.match(css,/\.atlas-frame\{[^}]*pointer-events:auto/);
 const index=read('index.html');
 assert.match(index,/id="atlasFrame"[^>]*src="\/atlas\/\?embed=1"/);
});
test('Atlas canvas receives mouse and touch gestures and fallback waits for WebGL',()=>{
 const css=read('atlas/meridian-atlas.css');
 const js=read('atlas/meridian-atlas.js');
 assert.match(css,/#globe3d canvas\{[^}]*cursor:grab;touch-action:none/);
 assert.match(js,/getContext\("webgl2"\)/);
 assert.match(js,/classList\.add\("ready"\)/);
});
test('3D globe has verified terrain, globe texture and time-dependent lighting',()=>{
 const src=read('atlas/meridian-atlas.js'),earth=read('atlas/earth.js');
 assert.match(src,/\.globeImageUrl\("\/lib\/earth-day\.jpg"\)/);
 assert.match(src,/\.bumpImageUrl\("\/lib\/earth-topology\.png"\)/);
 assert.match(earth,/sunGeo/);
});

test('fallback globe must disclose that WebGL is not interactive',()=>{
 const markup=read('atlas/index.html');
 assert.match(markup,/id="globeUnavailable"/);
 assert.match(markup,/id="globeRetry"/);
 assert.match(markup,/src="\/atlas\/pointer-globe\.js"/);
});
