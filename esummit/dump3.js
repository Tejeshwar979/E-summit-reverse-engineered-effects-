const fs=require('fs'),p=require('path');
const s=fs.readFileSync(p.join('chunks','chunk-2XSY6DAZ.js'),'utf8');
for(const t of ['sessionStorage','localStorage','hasVisited','seenLoader','onLoadingComplete','loadingComplete','isLoading','showLoader','loaderShown']){
  let i=-1,c=0;
  while((i=s.indexOf(t,i+1))!==-1){c++;if(c<=2)console.log('['+t+'] @'+i+'  ...'+s.slice(Math.max(0,i-160),i+200).replace(/\n/g,' ')+'...');}
  if(c)console.log('   ('+t+' total '+c+')');console.log('');
}
console.log('===== app-landing component class =====');
const a=s.indexOf('selectors:[["app-landing"]]');
console.log('anchor',a);
if(a>0){
  let st=s.lastIndexOf('class ',a); // not reliable; print a window
  console.log(s.slice(a-4000,a+400).replace(/;/g,';\n'));
}
