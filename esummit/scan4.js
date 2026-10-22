const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'chunks');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

// 1. Which chunk files are referenced from OTHER chunks (nested lazy imports)?
const refs = new Map();
for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const m of s.matchAll(/chunk-[A-Za-z0-9_.-]+\.js/g)) {
    if (!refs.has(m[0])) refs.set(m[0], new Set());
    refs.get(m[0]).add(f);
  }
}
console.log('=== chunk files referenced from inside other chunks ===');
const owned = new Set(files);
for (const [name, from] of refs) {
  console.log(`  ${name.padEnd(26)} <- ${[...from].slice(0, 3).join(', ')}${from.size > 3 ? ` (+${from.size - 3})` : ''}${owned.has(name) ? '' : '   <-- NOT DOWNLOADED'}`);
}

// 2. Where are the reactor / trace / flare component styles defined?
const NEEDLES = ['reactor-container', 'reactor-svg', 'esummit-loader', 'traceOutline',
                 'solar-flare-container', 'gravity-canvas', 'app-gravity-bg', 'bgDrift',
                 'shutter-pulse', 'sat-rotate', 'energy-flow', 'orbit-primary'];
console.log('\n=== component style owners ===');
for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), 'utf8');
  const hits = NEEDLES.filter(n => s.includes(n));
  if (hits.length) console.log(`  ${f.padEnd(24)} ${hits.join(', ')}`);
}
