const fs=require('fs'),p=require('path');
for(const f of ['chunk-STA66WCU.js','chunk-UXY565XE.js']){
  const s=fs.readFileSync(p.join('chunks',f),'utf8');
  let i=-1,c=0;
  while((i=s.toLowerCase().indexOf('speed',i+1))!==-1){c++;if(c<=3)console.log('['+f+'] @'+i+'  ...'+s.slice(Math.max(0,i-110),i+150).replace(/\n/g,' ')+'...\n');}
  console.log('['+f+'] speed x'+c+'\n');
}
// confirm no lightning-named class anywhere
let tot=0;
for(const f of fs.readdirSync('chunks')){
  const s=fs.readFileSync(p.join('chunks',f),'utf8');
  const m=s.match(/lightning|bolt|zap|meteor|plasma|thunder|streak/gi);
  if(m){tot+=m.length;console.log('HIT',f,[...new Set(m)].join(','));}
}
console.log('lightning-ish literals across all 111 chunks:', tot);
