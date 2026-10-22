// Tiny static file server + capture sink for the recovered-effect demo.
//   GET  /            -> demo-grid.html
//   GET  /<file>      -> static file from this directory
//   POST /save?name=x.png   body = data: URL  -> writes ./captures/<name>
const http = require('http'), fs = require('fs'), path = require('path');

const ROOT = __dirname;
const CAPS = path.join(ROOT, 'captures');
fs.mkdirSync(CAPS, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.json': 'application/json', '.md': 'text/markdown; charset=utf-8'
};

http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (req.method === 'POST' && url.pathname === '/save') {
    console.log('>> POST /save ' + url.search + ' cl=' + (req.headers['content-length'] || '?') + ' te=' + (req.headers['transfer-encoding'] || '-'));
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', () => {
      const name = path.basename(url.searchParams.get('name') || 'capture.png');
      const b64 = body.replace(/^data:image\/png;base64,/, '');
      const out = path.join(CAPS, name);
      fs.writeFileSync(out, Buffer.from(b64, 'base64'), (err) => {
        if (err) { res.writeHead(500).end('write failed: ' + err.message); return; }
        console.log('<< saved ' + name + ' (' + fs.statSync(out).size + ' bytes)');
        res.writeHead(200, { 'Content-Type': 'text/plain', 'Connection': 'close' }).end('ok ' + out);
      });
    });
    return;
  }

  let p = decodeURIComponent(url.pathname);
  if (p === '/') p = '/demo-grid.html';
  const f = path.join(ROOT, path.normalize(p).replace(/^([/\\])+/, ''));
  if (!f.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404).end('not found: ' + p); return; }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(f)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
}).listen(8899, '127.0.0.1', () => console.log('serving ' + ROOT + ' on http://127.0.0.1:8899'));
