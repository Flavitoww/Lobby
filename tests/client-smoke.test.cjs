const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const ROOT=path.resolve(__dirname,'..');
function smoke(filename,fetcher){
 const elements=new Map();
 const elem=()=>({
  dataset:{},style:{},innerHTML:'',textContent:'',hidden:false,value:'',className:'',
  classList:{add(){},remove(){},toggle(){},contains(){return false}},
  addEventListener(){},setAttribute(){},getAttribute(){return null},focus(){},
  scrollIntoView(){},appendChild(){},querySelector(){return elem()},
  querySelectorAll(){return []},contentWindow:{postMessage(){}},closest(){return null}
 });
 const doc={
  querySelector(sel){if(!elements.has(sel))elements.set(sel,elem());return elements.get(sel)},
  querySelectorAll(){return []},
  createElement(){return elem()},addEventListener(){},head:{appendChild(){}},
  body:{style:{},dataset:{},classList:elem().classList},
  documentElement:{style:{},dataset:{},classList:elem().classList},
  hidden:false
 };
 const win={addEventListener(){},matchMedia(){return {matches:false}},parent:null};
 win.parent=win;const location={hash:'',search:'',origin:'https://lobby.test',pathname:'/'};
 const localStorage={getItem(){return null},setItem(){}};
 const ctx={window:win,document:doc,location,history:{replaceState(){}},localStorage,
  URLSearchParams,Intl,URL,Date,Math,console,
  fetch:fetcher||(()=>new Promise(()=>{})),
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},
  AbortController,AbortSignal,ResizeObserver:class {observe(){}},IntersectionObserver:class{observe(){}}
 };
 const code=fs.readFileSync(path.join(ROOT,filename),'utf8');
 vm.runInNewContext(code,ctx,{filename,timeout:2000});
 return {ctx,doc};
}
test('Desk script reaches initialization without client-side DOM exception',()=>assert.doesNotThrow(()=>smoke('meridian.js')));
test('Atlas script reaches initialization without client-side DOM exception',()=>assert.doesNotThrow(()=>smoke('atlas/meridian-atlas.js')));
test('collection click handlers must use querySelectorAll, not querySelector',()=>{
 for(const name of ['meridian.js','atlas/meridian-atlas.js']){
  const src=fs.readFileSync(path.join(ROOT,name),'utf8');
  assert.doesNotMatch(src,/(?<!\$)\$\("[^"]+"\)\.forEach\(/,name);
 }
});

test('Desk renders verified match statistics and content after API response',async()=>{
 const now=Date.now();
 const match={id:101,status:'running',ts:now,game:'lol',tier:'s',imp:120,comp:'Worlds',serie:'Knockout',tournament:'Quarterfinals',
  an:'Karmine Corp',bn:'T1',as:'KC',bs:'T1',sa:1,sb:0,al:null,bl:null,ll:null};
 const respond=async url=>({
  ok:true,
  json:async()=>String(url).includes('/api/live')?{updated:now,matches:[match],recent:[]}:
   String(url).includes('/api/news')?{items:[{title:'Esport headline',url:'https://example.com',source:'Example',published:new Date(now).toISOString()}]}:
   {configured:false,verified:false,items:[]}
 });
 const {doc}=smoke('meridian.js',respond);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(doc.querySelector('#pulseLive').textContent,1);
 assert.equal(doc.querySelector('#pulseLeagues').textContent,1);
 assert.equal(doc.querySelector('#heroMatchCount').textContent,1);
 assert.equal(doc.querySelector('#liveCount').textContent,1);
 assert.equal(doc.querySelector('#featuredMatch').hidden,false);
});
