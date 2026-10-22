const fs = require('fs'), path = require('path');
const s = fs.readFileSync(path.join(__dirname, 'main.js'), 'utf8');

// Locate the app-reactor-core class: search backwards from its cmp for "class"
const anchor = s.indexOf('selectors:[["app-reactor-core"]]');
if (anchor < 0) { console.log('not found'); process.exit(1); }

// find the class declaration start (look back for "=class" or "class ")
let clsStart = -1;
for (let i = anchor; i > anchor - 12000; i--) {
  if (s.startsWith('class ', i) || s.startsWith('=class', i)) { clsStart = i; break; }
}
// find the end: the styles array end + closing of the cmp object
let clsEnd = s.indexOf('}]});', anchor);
if (clsEnd < 0) clsEnd = anchor + 20000;

const body = s.slice(clsStart, clsEnd + 5);
fs.writeFileSync(path.join(__dirname, 'reactor.component.js'), body);
console.log('reactor component: offsets', clsStart, '->', clsEnd, '=', body.length, 'chars');
console.log('written to reactor.component.js');
