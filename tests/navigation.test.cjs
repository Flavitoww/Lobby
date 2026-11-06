const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const news=require('../api/news'),twitch=require('../api/twitch');
test('news: important Worlds matchup receives a stronger ranking',()=>{
 const now=Date.parse('2026-11-06T12:00:00Z');
 const make=(title)=>({title,published:'2026-11-06T10:00:00Z',weight:22});
 assert.ok(news._test.score(make('Karmine Corp vs T1 : quart de finale Worlds 2026'),now)>news._test.score(make('Esport local amateur tournoi'),now));
});
test('news: rejects old or future articles, accepts recent official headlines',()=>{
 const now=Date.parse('2026-11-06T12:00:00Z');
 const xml='<rss><channel><item><title>Worlds 2026 : T1 vs KC</title><link>https://www.team-aaa.com/fr/actualite/test</link><pubDate>Fri, 06 Nov 2026 10:00:00 GMT</pubDate></item>'+
 '<item><title>Old news</title><link>https://example.com/old</link><pubDate>Mon, 26 Oct 2026 10:00:00 GMT</pubDate></item></channel></rss>';
 const items=news._test.parse(xml,{source:'Team aAa',weight:10},now);
 assert.equal(items.length,1);assert.match(items[0].title,/T1/);
});
test('Twitch: esport terms are checked against live title and game',()=>{
 assert.ok(twitch._test.important.test('Worlds 2026 KC vs T1 - cast'));
 assert.ok(twitch._test.channels.some(x=>x.login==='etostark__'));
 assert.ok(twitch._test.channels.some(x=>x.login==='otplol_'));
});
test('navigation: all primary page destinations exist',()=>{
 const root=path.resolve(__dirname,'..');
 for(const page of ['index.html','atlas/index.html','discover/index.html','profile/index.html','matches/index.html','news/index.html','streams/index.html']){
  assert.ok(fs.existsSync(path.join(root,page)),page);
 }
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.ok(home.includes('id="atlasFrame"'));
 assert.ok(home.includes('id="featuredMatch"'));
 assert.ok(home.includes('id="streamHighlights"'));
});
test('globe: single embedded 3D atlas expands instead of navigating to the V1',()=>{
 const root=path.resolve(__dirname,'..');
 const home=fs.readFileSync(path.join(root,'meridian.js'),'utf8');
 const atlas=fs.readFileSync(path.join(root,'atlas/meridian-atlas.js'),'utf8');
 assert.match(home,/lobby:atlas-mode/);
 assert.match(atlas,/lobby:atlas-expand/);
 assert.match(atlas,/Globe\(/);
});
