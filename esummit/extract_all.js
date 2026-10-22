// Extracts the four reversed-engineered components into readable source files.
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'recovered');
fs.mkdirSync(OUT, { recursive: true });

const read = (p) => fs.readFileSync(path.join(__dirname, p), 'utf8');
const pretty = (s) => s.replace(/;/g, ';\n  ').replace(/\},/g, '},\n  ');

function slice(file, startNeedle, endNeedle, outName, extra = 0) {
  const s = read(file);
  const a = s.indexOf(startNeedle);
  if (a < 0) { console.log('MISS start', outName, startNeedle.slice(0, 40)); return; }
  const b = s.indexOf(endNeedle, a);
  const body = s.slice(a, (b < 0 ? a + 20000 : b) + extra);
  fs.writeFileSync(path.join(OUT, outName), '// ' + outName + '\n// source: ' + file + '\n\n' + pretty(body));
  console.log('wrote', outName, body.length, 'chars');
}

// 1. app-gravity-bg  (events page: the interactive grid mesh)
slice('chunks/chunk-AXVDNMKI.js', 'var C=["gravityCanvas"]', 'static \\u0275fac', 'app-gravity-bg.component.js', 200);

// 2. app-loading-screen  (landing page: warp-speed "speed lightning")
slice('chunks/chunk-2XSY6DAZ.js', 'var Tm=["warpCanvas"]', 'static \\u0275fac', 'app-loading-screen.component.js', 200);

// 3. app-reactor-core  (radial SVG wireframe mesh, eagerly bundled in main.js)
{
  const s = read('main.js');
  const a = s.indexOf('selectors:[["app-reactor-core"]]');
  let st = s.lastIndexOf('class ', a);
  // walk back to the true class start
  for (let i = a; i > a - 14000; i--) { if (s.startsWith('class ', i)) { st = i; break; } }
  const b = s.indexOf('}]});', a);
  fs.writeFileSync(path.join(OUT, 'app-reactor-core.component.js'),
    '// app-reactor-core.component.js\n// source: main.js\n\n' + pretty(s.slice(st, b + 5)));
  console.log('wrote app-reactor-core.component.js', b - st, 'chars');
}

// 4. app-hero  (landing hero: WebGL2 cylinder + orange comet trails)
{
  const s = read('chunks/chunk-UXY565XE.js');
  const a = s.indexOf('selectors:[["app-hero"]]');
  let st = a;
  for (let i = a; i > a - 60000; i--) { if (s.startsWith('class ', i) || s.startsWith('=class', i)) { st = i; break; } }
  const b = s.indexOf('static \\u0275fac', a);
  const body = s.slice(st, b + 200);
  // keep the shader blocks readable
  fs.writeFileSync(path.join(OUT, 'app-hero.component.js'),
    '// app-hero.component.js\n// source: chunks/chunk-UXY565XE.js\n\n' + pretty(body));
  console.log('wrote app-hero.component.js', body.length, 'chars');
}
