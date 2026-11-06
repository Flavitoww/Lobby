const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function earth(){
 const win={},ctx={window:win,document:{querySelector:()=>null},setInterval:()=>0,Math,Date,Intl,URL,console};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../atlas/earth.js'),'utf8'),ctx,{filename:'earth.js'});
 return win.LobbyEarth;
}
test('solar noon: northern equinox near Greenwich is illuminated',()=>{
 const e=earth(),pos=e.solar(new Date('2026-03-20T12:00:00Z'));
 assert.ok(Math.abs(pos.lat)<.1,'equinox declination near zero');
 assert.equal(e.period(0,0,pos),'day');
 assert.equal(e.period(0,180,pos),'night');
});
test('solstice: subsolar point moves north in June and south in December',()=>{
 const e=earth(),north=e.solar(new Date('2026-06-21T12:00:00Z')),south=e.solar(new Date('2026-12-21T12:00:00Z'));
 assert.ok(north.lat>.35);
 assert.ok(south.lat<-.35);
});
test('Atlas does not import the previous interface',()=>{
 const src=fs.readFileSync(path.join(__dirname,'../atlas/index.html'),'utf8');
 assert.ok(src.includes('meridian-atlas.js'));
 assert.ok(src.includes('earth.js'));
 assert.equal(src.includes('src="/atlas/app.js"'),false);
});
