const fs=require('fs'),p=require('path');const d=p.join(__dirname,'chunks');
const T=['reactor','lightning','bolt','zap','streak','comet','meteor','plasma','electric','thunder','shock','spark','speed','dash','energy-flow','orbit-dash','bg-support','radial-trace','satellite','gyro','nucleus','shutter'];
const found={};
for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.js'))){
  const s=fs.readFileSync(p.join(d,f),'utf8');
  const hits=T.filter(t=>s.includes(t));
  if(hits.length) console.log(f.padEnd(24), hits.join(', '));
}
console.log('\n--- all chunk files on disk:', fs.readdirSync(d).filter(x=>x.endsWith('.js')).length);
console.log('\n===== ALL SHADER BLOCKS (gl_Position / void main) per file =====');
for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.js'))){
  const s=fs.readFileSync(p.join(d,f),'utf8');
  if(!/gl_Position|void\s+main\s*\(/.test(s)) continue;
  console.log('\n#### '+f);
  // split on backtick-quoted template literals (crude but works for minified Angular)
  const parts=s.split('`');
  for(let i=1;i<parts.length;i+=2){
    const body=parts[i];
    if(/gl_Position|void\s+main\s*\(/.test(body) && body.length<4000){
      console.log('--- shader @',i,'len',body.length,'---');
      console.log(body.replace(/\\n/g,'\n').replace(/\\"/g,'"'));
    }
  }
}
