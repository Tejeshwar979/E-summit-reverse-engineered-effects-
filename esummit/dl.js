const fs = require('fs');
const path = require('path');

const names = fs.readFileSync(path.join(__dirname, 'chunks.txt'), 'utf8').split(/\r?\n/).filter(Boolean);
const outDir = path.join(__dirname, 'chunks');
fs.mkdirSync(outDir, { recursive: true });

const BASE = 'https://www.ecell.in/esummit/';

(async () => {
  let ok = 0, total = 0;
  const failures = [];
  const CONC = 8;
  const queue = [...names];
  async function worker() {
    while (queue.length) {
      const n = queue.shift();
      try {
        const res = await fetch(BASE + n, { signal: AbortSignal.timeout(60000) });
        if (!res.ok) { failures.push(n + ' HTTP ' + res.status); continue; }
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(outDir, n), buf);
        ok++; total += buf.length;
      } catch (e) {
        failures.push(n + ' ' + e.message);
      }
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log('downloaded', ok, 'of', names.length, 'total', total.toLocaleString(), 'bytes');
  if (failures.length) console.log('failures:', failures.slice(0, 10));
})();
