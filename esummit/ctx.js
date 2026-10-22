const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'chunk-2XSY6DAZ.js';
const markers = (process.argv[3] || 'void main').split('|');
const WIN = parseInt(process.argv[4] || '1800', 10);

const s = fs.readFileSync(path.join(__dirname, 'chunks', target), 'utf8');
console.log(`### ${target} (${s.length} bytes)`);

for (const mk of markers) {
  let i = -1, n = 0;
  while ((i = s.indexOf(mk, i + 1)) !== -1) {
    n++;
    console.log(`\n===== [${mk}] occurrence ${n} @ offset ${i} =====`);
    const start = Math.max(0, i - Math.floor(WIN / 2));
    console.log(s.slice(start, start + WIN));
    if (n >= 3) break;
  }
  if (n === 0) console.log(`\n===== [${mk}] NOT FOUND =====`);
}
