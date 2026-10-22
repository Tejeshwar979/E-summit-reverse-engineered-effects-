const names=[];
for(let i=1;i<=12;i++) names.push('img/img'+i+'.png');
(async()=>{
 for(const n of names){
   try{ const r=await fetch('https://www.ecell.in/esummit/'+n,{method:'HEAD',signal:AbortSignal.timeout(30000)});
     console.log(r.status, r.headers.get('content-type'), n);
   }catch(e){ console.log('ERR',n,e.message); }
 }
})();
