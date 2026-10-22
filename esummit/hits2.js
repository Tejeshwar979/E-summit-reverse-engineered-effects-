const fs=require('fs'),p=require('path');
const files=[];
for(const f of fs.readdirSync('chunks')) files.push('chunks/'+f);
files.push('main.js');
for(const f of files){
  const s=fs.readFileSync(f,'utf8');
  const n=(s.match(/app-loading-screen/g)||[]).length;
  if(n) console.log(f.padEnd(26),'app-loading-screen x'+n);
}
console.log('\n--- where used (template refs) ---');
for(const f of files){
  const s=fs.readFileSync(f,'utf8');
  for(const m of s.matchAll(/app-loading-screen/g)){
    const i=m.index;
    const before=s.slice(Math.max(0,i-260),i+120).replace(/\n/g,' ');
    if(!/selectors:\[\[/.test(s.slice(Math.max(0,i-40),i+40))) {
      console.log('\n['+f+' @'+i+']\n  ...'+before+'...');
    }
  }
}
