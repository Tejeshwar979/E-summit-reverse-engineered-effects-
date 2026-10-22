const fs=require('fs'),p=require('path');const d=p.join(__dirname,'chunks');
const WANT=['app-event-card','app-reactor-core','app-solar-flare','solar-flare','app-events-page','app-loading-screen'];
for(const f of fs.readdirSync(d).filter(x=>x.endsWith('.js'))){
  const s=fs.readFileSync(p.join(d,f),'utf8');
  for(const m of s.matchAll(/selectors:\[\[([^\]]*)\]\]/g)){
    const sel=m[1];
    if(WANT.some(w=>sel.includes(w))) console.log(f.padEnd(24), sel);
  }
}
