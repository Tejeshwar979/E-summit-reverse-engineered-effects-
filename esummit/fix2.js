const fs=require('fs'),path=require('path');
const OUT=path.join(__dirname,'recovered');
const pretty=s=>s.replace(/;/g,';\n  ').replace(/\},/g,'},\n  ');

// reactor: reuse the already-good extraction
const r=fs.readFileSync(path.join(__dirname,'reactor.component.js'),'utf8');
fs.writeFileSync(path.join(OUT,'app-reactor-core.component.js'),
  '// app-reactor-core.component.js\n// source: main.js (eagerly bundled, NOT a lazy chunk)\n\n'+pretty(r));
console.log('reactor ok', r.length);

// hero: class containing the comet geometry builder + shader
{
  const s=fs.readFileSync(path.join(__dirname,'chunks','chunk-UXY565XE.js'),'utf8');
  const a=s.indexOf('aProgress');
  let st=-1; for(let i=a;i>a-120000;i--){ if(s.startsWith('class ',i)||s.startsWith('=class',i)){st=i;break;} }
  // end = the app-hero cmp block
  const c=s.indexOf('selectors:[["app-hero"]]');
  const b=s.indexOf('static ',c);
  const body=s.slice(st,(b<0?c+3000:b)+400);
  fs.writeFileSync(path.join(OUT,'app-hero.component.js'),
    '// app-hero.component.js\n// WebGL2 "CylinderEngine": panoramic cylinder of 12 images + 18 orange comet trails\n// source: chunks/chunk-UXY565XE.js\n\n'+pretty(body));
  console.log('hero ok', st, c, b, body.length);
}
