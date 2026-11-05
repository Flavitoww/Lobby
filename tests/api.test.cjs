// Tests sans dépendance des API serverless : n'utilisent aucune véritable clé ni requête réseau.
const assert=require('node:assert/strict');
const test=require('node:test');
const explore=require('../api/explore');
const live=require('../api/live');
function mockResponse(){return {headers:{},statusCode:200,setHeader(k,v){this.headers[k]=v;return this},status(n){this.statusCode=n;return this},json(v){this.body=v;return this}};}
function sampleMatch(id,status,opponents=[]){return {id,status,videogame:{slug:'league-of-legends'},tournament:{tier:'a'},league:{name:'Example league'},serie:{name:'Example season'},opponents,results:[],scheduled_at:'2026-11-06T20:00:00Z',streams_list:[]};}
test('explore: refuses short query without spending API quota',async()=>{
 process.env.PANDASCORE_TOKEN='unit-test';
 const original=global.fetch;let calls=0;global.fetch=async()=>{calls++;throw Error('unexpected')};
 try{const res=mockResponse();await explore({query:{q:'a',type:'teams'}},res);
 assert.equal(res.statusCode,200);assert.equal(res.body.items.length,0);assert.equal(calls,0)}
 finally{global.fetch=original}
});
test('explore: categorizes teams and players without inventing results',async()=>{
 process.env.PANDASCORE_TOKEN='unit-test';const original=global.fetch;
 global.fetch=async(url)=>({ok:true,json:async()=>String(url).includes('/teams')?[{id:7,name:'Test Team',players:[{id:8,name:'Test Player',active:true}]}]:String(url).includes('/players')?[{id:8,name:'Test Player'}]:[]});
 try{const res=mockResponse();await explore({query:{q:'Test',type:'all'}},res);assert.equal(res.statusCode,200);
 assert.deepEqual(res.body.items.map(x=>x.type),['players','teams']);assert.equal(res.body.items.find(x=>x.type==='teams').players.length,1)}
 finally{global.fetch=original}
});
test('explore: invalid types blocked',async()=>{
 process.env.PANDASCORE_TOKEN='unit-test';const res=mockResponse();
 await explore({query:{q:'test',type:'unknown'}},res);assert.equal(res.statusCode,400);
});
test('live: keeps fixtures with to-be-announced opponents (no fake team names)',async()=>{
 process.env.PANDASCORE_TOKEN='unit-test';const original=global.fetch;
 global.fetch=async(url)=>({ok:true,json:async()=>String(url).includes('/matches/upcoming')?[sampleMatch(983,'not_started')]:[]});
 try{const res=mockResponse();await live({query:{}},res);assert.equal(res.statusCode,200);const match=res.body.matches.find(x=>x.id===983);
 assert.equal(match.an,'À définir');assert.equal(match.bn,'À définir');assert.equal(res.body.source,'PandaScore')}
 finally{global.fetch=original}
});

test('explore: relevant player Faker is ahead of names containing fake',async()=>{
 process.env.PANDASCORE_TOKEN='unit-test';const original=global.fetch;
 global.fetch=async url=>({ok:true,json:async()=>String(url).includes('/players')?
 [{id:40,name:'Faker',slug:'faker',current_team:{name:'T1'}},{id:41,name:'fake player'}]:
 String(url).includes('/teams')?[{id:12,name:'fakeTEAM'},{id:13,name:'Faketeam123'}]:[]});
 try{const res=mockResponse();await explore({query:{q:'fake',type:'all'}},res);
 assert.equal(res.statusCode,200);assert.equal(res.body.items[0].name,'Faker')}
 finally{global.fetch=original}
});
