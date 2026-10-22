const fs=require('fs'),path=require('path');
const OUT=path.join(__dirname,'recovered');
const pretty=s=>s.replace(/;/g,';\n  ').replace(/\},/g,'},\n  ');

// --- reactor: reuse the offsets that already worked ---
{
  const s=fs.readFileSync(path.join(__dirname,'main.js'),'utf8');
  const a=s.indexOf('selectors:[["app-reactor-core"]]');
  let st=-1; for(let i=a;i>a-14000;i--){ if(s.startsWith('class ',i)){st=i;break;} }
  const b=s.indexOf('}]});',a);
  fs.writeFileSync(path.join(OUT,'app-reactor-core.component.js'),
    '// app-reactor-core.component.js\n// source: main.js (eagerly bundled, not a lazy chunk)\n\n'+pretty(s.slice(st,b+5)));
  console.log('reactor ok', st, b, b-st);
}

// --- hero: find the engine class by its distinctive markers ---
{
  const s=fs.readFileSync(path.join(__dirname,'chunks','chunk-UXY565XE.js'),'utf8');
  const a=s.indexOf('selectors:[["app-hero"]]');
  // the engine class contains 'aProgress' / 'uOpacity' ; walk back from a to the nearest 'class'
  let st=-1;
  for(let i=a;i>a-200000;i--){ if(s.startsWith('class ',i)||s.startsWith('=class',i)){st=i;break;} }
  const b=s.indexOf('static \\u0275fac',a);
  const body=s.slice(st,(b<0?a+20000:b)+200);
  fs.writeFileSync(path.join(OUT,'app-hero.component.js'),
    '// app-hero.component.js  (WebGL2 CylinderEngine: cylinder of images + 18 orange comet trails)\n// source: chunks/chunk-UXY565XE.js\n\n'+pretty(body));
  console.log('hero ok', st, b, body.length);
}
