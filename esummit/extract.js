const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const selector = process.argv[3];
const span = parseInt(process.argv[4] || '9000', 10);

const s = fs.readFileSync(path.join(__dirname, 'chunks', file), 'utf8');
const needles = [`["${selector}"]`, `[["${selector}"]]`, `"${selector}"`];
let idx = -1, used = '';
for (const n of needles) {
  idx = s.indexOf(n);
  if (idx >= 0) { used = n; break; }
}
if (idx < 0) { console.log(`selector "${selector}" NOT found in ${file}`); process.exit(0); }

// find the enclosing component: walk back to the nearest `C({` or `static \u0275cmp=C({`
const start = Math.max(0, idx - span);
const chunk = s.slice(start, idx + span);
console.log(`### ${file} :: ${selector} @ ${idx}  (context ${start}..${idx + span})\n`);
console.log(chunk);
