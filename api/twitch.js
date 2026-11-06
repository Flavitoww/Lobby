// Lobby Twitch — official Helix streams, no scraping or simulated LIVE.
// Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in Vercel (preview + production).
const channels=[
 {login:"kamet0",name:"Kameto",focus:["League of Legends","Esport"]},
 {login:"gotaga",name:"Gotaga",focus:["VALORANT","Esport"]},
 {login:"squeezie",name:"Squeezie",focus:["Esport","Événements"]},
 {login:"etoiles",name:"Étoiles",focus:["Esport","Communauté"]},
 {login:"etostark",name:"EtoStarK",focus:["Rocket League","Esport"]},
 {login:"otplol_",name:"OTP LoL",focus:["League of Legends"]},
 {login:"rocketbaguette",name:"Rocket Baguette",focus:["Rocket League"]},
 {login:"zerator",name:"ZeratoR",focus:["Événements esport"]}
];
const important=/\b(esport|esports|worlds?|lec|lck|lpl|lfl|rlcs|vct|valorant|cs2|counter.strike|league of legends|karmine|kc\b|t1\b|g2\b|vitality|major|champions|finale|cast|co.stream|co-stream|watch.party|watchparty|tournoi|match|compétition|tft|rocket league|six invitational)\b/i;
const category=/\b(league of legends|valorant|counter.strike|rocket league|teamfight tactics|rainbow six)\b/i;
let token={value:"",at:0};
let cached={items:[],at:0};
async function getToken(client,secret){
 if(token.value&&Date.now()<token.at)return token.value;
 const data=new URLSearchParams({client_id:client,client_secret:secret,grant_type:"client_credentials"});
 const r=await fetch("https://id.twitch.tv/oauth2/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:data,signal:AbortSignal.timeout(8500)});
 if(!r.ok)throw Error("twitch_auth");
 const json=await r.json();
 if(!json.access_token)throw Error("twitch_auth");
 token={value:json.access_token,at:Date.now()+Math.max(120,Number(json.expires_in||3600)-90)*1000};
 return token.value;
}
async function getStreams(client,secret){
 const access=await getToken(client,secret);
 const url=new URL("https://api.twitch.tv/helix/streams");
 for(const c of channels)url.searchParams.append("user_login",c.login);
 url.searchParams.set("first","100");
 const r=await fetch(url,{headers:{"Client-ID":client,"Authorization":"Bearer "+access},signal:AbortSignal.timeout(9000)});
 if(!r.ok)throw Error("twitch_"+r.status);
 const raw=await r.json();
 const live=new Map((raw.data||[]).map(c=>[String(c.user_login||"").toLowerCase(),c]));
 return channels.map(c=>{
  const s=live.get(c.login);
  if(!s)return {login:c.login,name:c.name,url:"https://www.twitch.tv/"+c.login,live:false,esport:false};
  const title=String(s.title||"").slice(0,170),game=String(s.game_name||"").slice(0,65);
  const esport=important.test(title)||category.test(game);
  return {login:c.login,name:c.name,url:"https://www.twitch.tv/"+c.login,live:true,esport,
    game,title,viewers:Number(s.viewer_count||0),started:s.started_at||null,
    thumbnail:"https://static-cdn.jtvnw.net/previews-ttv/live_user_"+encodeURIComponent(c.login)+"-320x180.jpg"};
 }).sort((a,b)=>Number(b.live&&b.esport)-Number(a.live&&a.esport)||Number(b.live)-Number(a.live)||Number(b.viewers||0)-Number(a.viewers||0));
}
module.exports=async(req,res)=>{
 res.setHeader("Cache-Control","public, s-maxage=90, stale-while-revalidate=180");
 const client=process.env.TWITCH_CLIENT_ID,secret=process.env.TWITCH_CLIENT_SECRET;
 if(!client||!secret)return res.status(200).json({configured:false,verified:false,items:channels.map(c=>({login:c.login,name:c.name,url:"https://www.twitch.tv/"+c.login,live:null,esport:null})),source:"Twitch Helix API"});
 if(cached.at&&Date.now()-cached.at<90000)return res.status(200).json({configured:true,verified:true,items:cached.items,updated:cached.at,source:"Twitch Helix API"});
 try{
  const items=await getStreams(client,secret);
  cached={items,at:Date.now()};
  return res.status(200).json({configured:true,verified:true,items,updated:cached.at,source:"Twitch Helix API"});
 }catch(e){
  if(cached.at)return res.status(200).json({configured:true,verified:true,items:cached.items,stale:true,updated:cached.at,source:"Twitch Helix API"});
  return res.status(503).json({configured:true,verified:false,items:[],error:"twitch_unavailable"});
 }
};
module.exports._test={channels,important};
