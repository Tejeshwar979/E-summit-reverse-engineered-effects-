const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'chunks');

// 1. Which components does a chunk define?
function selectors(file) {
  const s = fs.readFileSync(path.join(dir, file), 'utf8');
  const out = [];
  for (const m of s.matchAll(/selectors:\[\[([^\]]*)\]\]/g)) out.push(m[1]);
  return out;
}

const files = process.argv.slice(2);
for (const f of files) {
  const sel = selectors(f);
  console.log(`\n### ${f} defines selectors:`);
  console.log('   ' + (sel.join('\n   ') || '(none found)'));
}

// 2. Pull GLSL shader blocks out of a chunk
if (process.env.SHADER) {
  const s = fs.readFileSync(path.join(dir, process.env.SHADER), 'utf8');
  console.log(`\n\n########## SHADER SOURCE in ${process.env.SHADER} ##########`);
  const re = /(?:void\s+main\s*\(\s*\)\s*\{|precision\s+(?:highp|mediump|lowp)\s+float)/g;
  let m, seen = new Set();
  while ((m = re.exec(s))) {
    // walk back to the start of the enclosing template literal
    let start = s.lastIndexOf('`', m.index);
    if (start < 0) continue;
    // handle escaped backticks: find the real start
    let k = start - 1, guard = 0;
    while (k >= 0 && guard++ < 4000) {
      if (s[k] === '`' && s[k-1] !== '\\') { start = k; break; }
      k--;
    }
    const end = s.indexOf('`', m.index);
    if (end < 0) continue;
    const body = s.slice(start + 1, end);
    if (body.length < 40 || body.length > 6000) continue;
    const key = body.slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    console.log(`\n----- shader block @ ${m.index} (${body.length} chars) -----`);
    console.log(body);
  }
}
