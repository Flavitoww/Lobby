// Proxy de ressources : sert les libs 3D depuis le domaine du site (contourne un reseau qui bloque les CDN externes).
const MAP = {
  'three.module.min.js': 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.min.js',
  'three.core.min.js': 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.core.min.js',
  'OrbitControls.js': 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js'
};
const TYPE = { js: 'application/javascript; charset=utf-8', jpg: 'image/jpeg', json: 'application/json; charset=utf-8' };

module.exports = async (req, res) => {
  let file = (req.query && req.query.file) || '';
  if (!file && req.url) { const m = req.url.match(/\/lib\/([^?]+)/); if (m) file = m[1]; }
  const url = MAP[file];
  if (!url) { res.status(404).json({ error: 'unknown', file }); return; }
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) { res.status(502).json({ error: 'upstream', status: r.status }); return; }
    const buf = Buffer.from(await r.arrayBuffer());
    const ext = file.split('.').pop();
    res.setHeader('Content-Type', TYPE[ext] || r.headers.get('content-type') || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).send(buf);
  } catch (e) {
    res.status(502).json({ error: 'fetch_failed', detail: String(e.message || e) });
  }
};
