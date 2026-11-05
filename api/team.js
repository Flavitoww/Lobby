// Agent fiche equipe : staff, dirigeants, palmares et liens officiels depuis Liquipedia.
// Liquipedia limite les appels d'analyse de page (1 toutes les 30 s) : on espace les appels et on met en cache 12 h.
const WIKI = { lol: 'leagueoflegends', cs2: 'counterstrike', val: 'valorant', rl: 'rocketleague', dota: 'dota2', r6: 'rainbowsix', ow: 'overwatch', cod: 'callofduty', mlbb: 'mobilelegends', hok: 'honorofkings', sc: 'starcraft2' };
const UA = 'LobbyAtlas/1.0 (personal esports atlas; gzip)';
let last = 0;

const dec = (s) => s.replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCharCode(parseInt(n, 16))).replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n)).replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
const txt = (h) => dec(h.replace(/<sup[\s\S]*?<\/sup>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

async function api(wiki, qs) {
  const r = await fetch('https://liquipedia.net/' + wiki + '/api.php?format=json&' + qs, { headers: { 'User-Agent': UA, 'Accept-Encoding': 'gzip' } });
  if (!r.ok) throw new Error('liquipedia ' + r.status);
  return r.json();
}
async function pageHtml(wiki, title) {
  const wait = last + 31000 - Date.now();
  if (wait > 0) { if (wait > 45000) return { busy: true }; await new Promise((r) => setTimeout(r, wait)); }
  last = Date.now();
  const j = await api(wiki, 'action=parse&prop=text&disablelimitreport=1&disableeditsection=1&redirects=1&page=' + encodeURIComponent(title));
  if (j.error) return { err: j.error.code };
  return { html: j.parse.text['*'], title: j.parse.title };
}

function tables(html) {
  const heads = [], re = /<h([23]) id="([^"]+)"/g; let m;
  while ((m = re.exec(html))) heads.push({ lvl: +m[1], id: m[2], pos: m.index });
  const rows = [], rr = /<tr class="table2(?:&#95;|_)(?:&#95;|_)row--(head|body)[^"]*">([\s\S]*?)<\/tr>/g;
  const out = []; let cur = null;
  while ((m = rr.exec(html))) {
    let h2 = '', h3 = '';
    for (const h of heads) { if (h.pos > m.index) break; if (h.lvl === 2) { h2 = h.id; h3 = ''; } else h3 = h.id; }
    const cells = [], cr = /<t([dh])[^>]*>([\s\S]*?)<\/t\1>/g; let c;
    while ((c = cr.exec(m[2]))) {
      const flag = /class="flag"[^>]*>\s*(?:<a[^>]*>)?\s*<img alt="([^"]+)"/.exec(c[2]);
      cells.push({ t: txt(c[2]), flag: flag ? flag[1] : '' });
    }
    if (m[1] === 'head') { cur = { h2, h3, head: cells.map((x) => x.t), rows: [] }; out.push(cur); }
    else if (cur) cur.rows.push(cells);
  }
  return out;
}
function people(tb) {
  const hi = (n) => tb.head.findIndex((h) => h.toLowerCase() === n);
  const iId = hi('id'), iName = hi('name'), iPos = hi('position'), iJoin = hi('join date');
  if (iId < 0) return [];
  return tb.rows.map((r) => ({ id: (r[iId] && r[iId].t) || '', cc: (r[iId] && r[iId].flag) || '', name: iName > -1 && r[iName] ? r[iName].t : '', pos: iPos > -1 && r[iPos] ? r[iPos].t : '', join: iJoin > -1 && r[iJoin] ? r[iJoin].t.slice(0, 10) : '' })).filter((p) => p.id);
}
function infobox(html) {
  const o = { links: [] };
  const a = html.indexOf('fo-nttax-infobox-wrapper'); if (a < 0) return o;
  const seg = html.slice(a, a + 30000);
  const re = /infobox-description">([^<]*)<\/div><div>([\s\S]*?)<\/div><\/div>/g; let m;
  while ((m = re.exec(seg))) { const k = m[1].replace(/:$/, '').trim().toLowerCase(); if (!o[k]) o[k] = txt(m[2]); }
  const w = /Total Winnings[\s\S]{0,80}?(\$[\d,]+)/.exec(seg); if (w) o.winnings = w[1];
  const l = seg.indexOf('>Links<');
  if (l > -1) { const e = seg.indexOf('infobox-header', l + 10); const blk = seg.slice(l, e > -1 ? e : l + 4000); const hr = /href="(https?:\/\/[^"]+)"/g; let h; while ((h = hr.exec(blk))) o.links.push(dec(h[1])); }
  return o;
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const name = String(q.n || '').slice(0, 80), wiki = WIKI[q.g];
  if (!name || !wiki) { res.status(400).json({ error: 'bad_request' }); return; }
  try {
    let r = await pageHtml(wiki, name.replace(/ /g, '_'));
    if (r.busy) { res.status(429).json({ error: 'busy', retry: 35 }); return; }
    if (r.err) {
      const s = await api(wiki, 'action=opensearch&limit=1&namespace=0&search=' + encodeURIComponent(name));
      const t = s && s[1] && s[1][0];
      if (!t) { res.setHeader('Cache-Control', 'public, s-maxage=43200'); res.status(200).json({ found: false }); return; }
      r = await pageHtml(wiki, t);
      if (r.busy) { res.status(429).json({ error: 'busy', retry: 35 }); return; }
      if (r.err) { res.status(200).json({ found: false }); return; }
    }
    const tb = tables(r.html);
    const ib = infobox(r.html);
    const notFormer = (t) => !/former|inactive|alumni/i.test(t.h3);
    const roster = tb.find((t) => /roster|squad|player/i.test(t.h2) && notFormer(t) && people(t).length);
    const staffTb = tb.filter((t) => /organi|staff|management/i.test(t.h2) && notFormer(t));
    const staff = [].concat(...staffTb.map(people));
    const resTb = tb.find((t) => /^results$/i.test(t.h2) && t.head.some((h) => /place/i.test(h)));
    const results = resTb ? resTb.rows.slice(0, 14).map((c) => {
      const t = c.map((x) => x.t);
      const si = t.findIndex((x, i) => i > 2 && /^\d+\s*:\s*\d+$/.test(x));
      return { date: t[0] || '', place: t[1] || '', tier: t[2] || '', event: t.slice(3).find((x) => x && !/^\d+\s*:\s*\d+$/.test(x) && !/^(offline|online|lan|online\s*\+?\s*offline|offline\s*\+?\s*online)$/i.test(x)) || '', score: si > -1 ? t[si] : '', vs: si > -1 ? t[si + 1] || '' : '', prize: t[t.length - 1] || '' };
    }) : [];
    res.setHeader('Cache-Control', 'public, s-maxage=43200, stale-while-revalidate=604800');
    res.status(200).json({
      found: true, title: r.title, url: 'https://liquipedia.net/' + wiki + '/' + encodeURIComponent(r.title.replace(/ /g, '_')),
      info: { location: (ib.location || '').replace(new RegExp('\\s*' + (ib.region || '@@').replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), ''), region: ib.region || '', created: ((ib.created || '').match(/\d{4}-\d{2}-\d{2}/) || [''])[0], disbanded: ib.disbanded || '', winnings: ib.winnings || '', links: ib.links.slice(0, 14) },
      roster: roster ? people(roster) : [], staff, results
    });
  } catch (e) {
    res.status(502).json({ error: 'upstream', detail: String(e.message || e) });
  }
};
