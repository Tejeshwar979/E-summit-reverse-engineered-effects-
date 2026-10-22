const fs=require('fs'),path=require('path');
const dir=path.join(__dirname,'legacy'); fs.mkdirSync(dir,{recursive:true});
const names=['633bd5f1b1.js','spline-viewer.js','p5.min.js','bundle.js','checkout.js'];
(async()=>{
 for(const n of names){
   try{
     const r=await fetch('https://www.ecell.in/esummit/'+n,{signal:AbortSignal.timeout(90000)});
     const b=Buffer.from(await r.arrayBuffer());
     fs.writeFileSync(path.join(dir,n),b);
     console.log('OK  ',n,b.length.toLocaleString());
   }catch(e){console.log('FAIL',n,e.message);}
 }
})();
