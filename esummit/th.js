const fs=require('fs'),p=require('path');
for(const f of ['chunk-2XSY6DAZ.js','chunk-5BLIUTTA.js']){
  const s=fs.readFileSync(p.join('chunks',f),'utf8');
  let i=-1;
  while((i=s.indexOf('Thunder',i+1))!==-1){
    console.log('['+f+'] @'+i+'  ...'+s.slice(Math.max(0,i-160),i+160).replace(/\n/g,' ')+'...\n');
  }
}
