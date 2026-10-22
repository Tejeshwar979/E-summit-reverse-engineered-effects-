const fs = require('fs');
const path = require('path');

const dir = __dirname;
const main = fs.readFileSync(path.join(dir, 'main.js'), 'utf8');

console.log('=== main.js size:', main.length);

const chunkSet = new Set();
for (const m of main.matchAll(/["'`](chunk-[A-Z0-9]{8}\.js|[a-zA-Z0-9_-]*-?[A-Z0-9]{8}\.js)["'`]/g)) {
  chunkSet.add(m[1]);
}
console.log('=== referenced js chunks:', chunkSet.size);
console.log([...chunkSet].join('\n'));

const KW = ['lightning','bolt','zap','grid','mesh','shader','fragment','vertex','webgl','WebGL','THREE','three','p5','particle','streak','speed','wireframe','perspective','wave','ripple','noise','rand','canvas','getContext','requestAnimationFrame','voronoi','hexagon','trigon','dot','delaunay','i3','forceSimulation','d3'];
console.log('\n=== keyword counts in main.js ===');
for (const k of KW) {
  const c = (main.match(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g')) || []).length;
  if (c) console.log(String(c).padStart(6), k);
}
