const fs=require('fs'),p=require('path');
const s=fs.readFileSync(p.join('chunks','chunk-2XSY6DAZ.js'),'utf8');
function dump(a,b,label){
  console.log('\n########## '+label+'  ['+a+'..'+b+'] ##########');
  console.log(s.slice(a,b).replace(/;/g,';\n'));
}
dump(207600,213200,'TRAIL-PARTICLE PHASE ENGINE');
