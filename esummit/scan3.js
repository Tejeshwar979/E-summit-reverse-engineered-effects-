const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'chunks');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
const TOK = ['reactor-svg','reactor-container','bgDrift','gravity-canvas','gravityCanvas','flare-flame',
             'solar-flare','spacebg','sunrise-sun','flare-glow','transition-sun','stack-panel','page-view'];

const idx = {};
for (const f of files) {
  const s = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const t of TOK) {
    let i = -1;
    while ((i = s.indexOf(t, i + 1)) !== -1) {
      (idx[t] ||= []).push({ f, i });
    }
  }
}

for (const t of TOK) {
  const list = idx[t] || [];
  console.log(`\n### ${t}  (${list.length} hits)`);
  const byFile = {};
  for (const h of list) (byFile[h.f] ||= []).push(h.i);
  for (const [f, offs] of Object.entries(byFile)) {
    console.log(`   ${f}: ${offs.length} hits @ ${offs.slice(0, 6).join(', ')}${offs.length > 6 ? ' ...' : ''}`);
  }
}
