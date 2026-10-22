const fs=require('fs'),p=require('path');
const s=fs.readFileSync(p.join('chunks','chunk-2XSY6DAZ.js'),'utf8');
const T=['fifth','avenue','Fifth','Avenue','particle','Particle','speed','Speed','lightning','streak','comet','trail','dash','road','perspective','grid','Grid'];
for(const t of T){
  let i=-1,n=0;
  while((i=s.indexOf(t,i+1))!==-1){ n++; if(n<=3) console.log('['+t+'] @'+i+'  ...'+s.slice(Math.max(0,i-90),i+130).replace(/\n/g,' ')+'...'); }
  if(n>3) console.log('['+t+'] total '+n);
  console.log('');
}
