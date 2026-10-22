const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'chunks');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const data = files.map(f => ({ f, s: fs.readFileSync(path.join(dir, f), 'utf8') }));

const KW = ['lightning','bolt','zap','grid','mesh','shader','fragment','vertex','webgl','WebGL',
            'three','THREE','p5','particle','streak','speed','wireframe','perspective','wave',
            'ripple','noise','getContext','requestAnimationFrame','voronoi','hexagon','delaunay',
            'forceSimulation','triangle','lineTo','moveTo','createRadialGradient','globalCompositeOperation',
            'ConicGradient','mix-blend','blend','backgroundImage','linear-gradient','repeating-linear'];

const hits = {};
for (const k of KW) {
  hits[k] = [];
  for (const { f, s } of data) {
    let i = -1, n = 0;
    while ((i = s.indexOf(k, i + 1)) !== -1) {
      n++;
      if (hits[k].length < 12) hits[k].push({ file: f, at: i });
    }
    if (n > 12) hits[k].push({ file: f, extra: n - 12 });
  }
}

console.log('=== keyword -> files ===');
for (const [k, list] of Object.entries(hits)) {
  if (!list.length) continue;
  const filesSet = [...new Set(list.map(x => x.file))];
  const total = list.reduce((a, x) => a + (x.extra ? x.extra : 0) + (x.file && x.at !== undefined ? 1 : 0), 0);
  console.log(`\n[${k}] hits=${total} files=${filesSet.length}`);
  console.log('   ' + filesSet.join(', '));
}
