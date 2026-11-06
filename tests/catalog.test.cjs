const test=require('node:test'),assert=require('node:assert/strict');
const catalog=require('../api/catalog'),related=require('../api/related');
function response(){
 return {statusCode:200,body:null,headers:{},setHeader(k,v){this.headers[k]=v},status(code){this.statusCode=code;return this},json(x){this.body=x;return this}};
}
test('catalog: paginated game team browsing, canonical fields and honest hasMore',async()=>{
 const prior=global.fetch;const token=process.env.PANDASCORE_TOKEN;
 process.env.PANDASCORE_TOKEN='integration-test';
 global.fetch=async url=>({ok:true,json:async()=>[{id:1,name:'Team Alpha',location:'FR',image_url:'https://image.test/team.png',videogame:{slug:'league-of-legends'},players:[{id:23,name:'Player'}]}]});
 try{
  const res=response();await catalog({query:{type:'teams',game:'lol',page:'2',size:'20'}},res);
  assert.equal(res.statusCode,200);
  assert.equal(res.body.page,2);assert.equal(res.body.items[0].country,'FR');assert.equal(res.body.items[0].gameSlug,'league-of-legends');
  assert.equal(res.body.hasMore,false);assert.equal(res.body.items[0].players[0].id,23);
 }finally{global.fetch=prior;process.env.PANDASCORE_TOKEN=token}
});
test('catalog: fallback gracefully to partial when country filtering unsupported',async()=>{
 const prior=global.fetch;const token=process.env.PANDASCORE_TOKEN;
 process.env.PANDASCORE_TOKEN='integration-test';
 let calls=0;
 global.fetch=async url=>{calls++;
  if(String(url).includes('filter%5Blocation%5D'))return {ok:false,status:422};
  return {ok:true,json:async()=>[{id:41,name:'FR Team',location:'FR'},{id:42,name:'DE Team',location:'DE'}]};
 };
 try{
  const res=response();await catalog({query:{type:'teams',game:'all',country:'FR',page:'7',size:'50'}},res);
  assert.equal(res.statusCode,200);
  assert.equal(res.body.partial,true);
  assert.equal(res.body.filterMode,'local_partial');
  assert.deepEqual(res.body.items.map(x=>x.name),['FR Team']);
  assert.equal(calls,2);
 }finally{global.fetch=prior;process.env.PANDASCORE_TOKEN=token}
});
test('catalog: refuses unsupported game instead of making up results',async()=>{
 const res=response();await catalog({query:{type:'teams',game:'unlicensed'}},res);
 assert.equal(res.statusCode,400);assert.equal(res.body.error,'invalid_catalog_filter');
});
test('related: normalize match opponent logos and source competition IDs',()=>{
 const m=related._test.match({id:7,status:'finished',opponents:[{opponent:{id:1,name:'A',image_url:'https://cdn.test/a.png'}},{opponent:{id:2,name:'B'}}],results:[{team_id:1,score:2},{team_id:2,score:1}],league:{id:91,name:'Worlds'},tournament:{id:30,name:'Finals'}});
 assert.equal(m.leagueId,91);assert.equal(m.tournamentId,30);
 assert.equal(m.scoreA,2);assert.equal(m.scoreB,1);
 assert.equal(m.al,'https://cdn.test/a.png');
});
