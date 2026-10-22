const fs=require('fs'),p=require('path');
const s=fs.readFileSync(p.join('chunks','chunk-2XSY6DAZ.js'),'utf8');
console.log('===== app-landing wrapper (213900..216400) =====');
console.log(s.slice(213900,216400).replace(/;/g,';\n'));
