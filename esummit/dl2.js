const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'chunks');
const BASE = 'https://www.ecell.in/esummit/';

// Discover every chunk name referenced anywhere in the tree
function collect() {
  const names = new Set();
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js'))) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of s.matchAll(/chunk-[A-Za-z0-9_.-]+\.js/g)) names.add(m[0]);
    for (const m of s.matchAll(/\.\/(chunk-[A-Za-z0-9_.-]+\.js)/g)) names.add(m[1]);
  }
  for (const m of fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8').matchAll(/\.\/(chunk-[A-Za-z0-9_.-]+\.js)/g)) names.add(m[1]);
  return names;
}

(async () => {
  const have = new Set(fs.readdirSync(dir));
  let names = collect();
  let round = 0, added = 0;
  // iterate: newly downloaded chunks may reference more chunks
  while (round++ < 6) {
    const todo = [...names].filter(n => !have.has(n));
    if (!todo.length) break;
    console.log(`round ${round}: fetching ${todo.length}`);
    let ok = 0;
    await Promise.all(todo.map(async n => {
      try {
        const r = await fetch(BASE + n, { signal: AbortSignal.timeout(60000) });
        if (!r.ok) return;
        const b = Buffer.from(await r.arrayBuffer());
        fs.writeFileSync(path.join(dir, n), b);
        have.add(n); ok++; added++;
      } catch (e) { /* ignore */ }
    }));
    console.log(`  fetched ${ok}`);
    names = collect();
  }
  console.log(`total chunks on disk: ${fs.readdirSync(dir).filter(f=>f.endsWith('.js')).length} (+${added})`);

  // Now locate component style owners
  const NEEDLES = ['reactor-container', 'reactor-svg', 'bg-support-layer', 'radial-trace-layer',
                   'shutter-pulse', 'sat-rotate', 'energy-flow', 'orbit-primary', 'nucleus-assembly',
                   'gyro-layer', 'app-gravity-bg', 'gravity-canvas', 'esummit-loader'];
  console.log('\n=== component style owners ===');
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js'))) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    const hits = NEEDLES.filter(n => s.includes(n));
    if (hits.length) console.log(`  ${f.padEnd(24)} ${hits.join(', ')}`);
  }
})();
