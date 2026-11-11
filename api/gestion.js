// LOBBY — /gestion : sert le tableau de bord seulement après connexion ; sinon le portail de code.
const fs = require('fs'), path = require('path');
const { isAdmin } = require('./_auth');
const LOGIN = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Accès — Lobby</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@500;600&display=swap"><link rel="stylesheet" href="/lobby.css">
<style>body{min-height:100vh;display:grid;place-items:center;padding:20px}.box{width:min(400px,100%);padding:32px}.box h1{margin:14px 0 6px;font-size:28px;font-weight:600;letter-spacing:-.03em}.box p{color:var(--mut);margin:0 0 22px}
.box input{width:100%;height:52px;border-radius:14px;border:1px solid var(--line);background:var(--soft);padding:0 16px;font:600 18px var(--mono);letter-spacing:.12em;text-transform:uppercase;outline:none}.box input:focus{border-color:var(--ink);background:#fff}
.box .btn{width:100%;margin-top:12px}.err{color:#c22;font-size:13px;min-height:20px;margin-top:10px}.lock{width:44px;height:44px;border-radius:14px;background:var(--ink);display:grid;place-items:center}.lock svg{width:20px;height:20px;stroke:#fff;fill:none;stroke-width:2}</style></head>
<body><form class="card box" id="f"><div class="lock"><svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></div><h1>Accès gestion<b style="color:var(--or)">.</b></h1><p>Espace privé. Entre ton code d'accès.</p>
<label class="sr" for="c">Code d'accès</label><input id="c" autocomplete="one-time-code" autocapitalize="characters" spellcheck="false" placeholder="LBY-XXXX-XXXX" required autofocus>
<button class="btn pri" type="submit">Entrer</button><div class="err" id="e" role="alert"></div><a href="/" style="display:block;text-align:center;margin-top:8px;font-size:13px;color:var(--mut)">← Retour au site</a></form>
<script>document.getElementById("f").onsubmit=function(ev){ev.preventDefault();var e=document.getElementById("e");e.textContent="";fetch("/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:document.getElementById("c").value})}).then(function(r){return r.json().then(function(d){if(r.ok)location.reload();else e.textContent=d.error+(d.left!=null?" ("+d.left+" essai(s) restant(s))":"")})}).catch(function(){e.textContent="Erreur réseau."})}</script></body></html>`;
module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (!isAdmin(req)) { res.status(200).send(LOGIN); return; }
  res.status(200).send(fs.readFileSync(path.join(__dirname, '_gestion.html'), 'utf8'));
};
