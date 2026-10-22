// app-loading-screen.component.js
// source: chunks/chunk-2XSY6DAZ.js

var Tm=["warpCanvas"],Lm=["loadingScreen"],Rm=["zoomContainer"],km=["openingImage"],hi=class e{constructor(t){this.ngZone=t}loadingComplete=new Rs;
  canvasRef;
  loadingScreenRef;
  zoomContainerRef;
  openingImageRef;
  animationFrameId=null;
  isDestroyed=!1;
  startTime=0;
  imageFadingIn=!1;
  PHASE1_DURATION=1e3;
  PHASE2_DURATION=1e3;
  PHASE3_DURATION=2e3;
  TOTAL_DURATION=this.PHASE1_DURATION+this.PHASE2_DURATION+this.PHASE3_DURATION;
  trailParticles=[];
  ngAfterViewInit(){this.startTime=performance.now(),this.initAnimation()}ngOnDestroy(){this.isDestroyed=!0,this.animationFrameId!==null&&cancelAnimationFrame(this.animationFrameId)}initAnimation(){let t=this.canvasRef.nativeElement,n=t.getContext("2d",{alpha:!0});
  if(!n)return;
  let i=t.width=window.innerWidth,a=t.height=window.innerHeight;
  window.addEventListener("resize",()=>{i=t.width=window.innerWidth,a=t.height=window.innerHeight});
  let s=[],h=800;
  for(let b=0;
  b<h;
  b++){let A=Math.random()*i*2-i,I=Math.random()*a*2-a;
  s.push({x:A,y:I,z:Math.random()*i,pz:Math.random()*i,angle:Math.atan2(I,A),dist:Math.sqrt(A*A+I*I)})}let C=5,S=()=>{if(this.isDestroyed)return;
  let b=performance.now()-this.startTime,A=i/2,I=a/2;
  if(n.globalCompositeOperation="source-over",n.fillStyle="rgba(0, 0, 0, 0.3)",n.fillRect(0,0,i,a),b<this.PHASE1_DURATION)C<45&&(C+=1.5),n.strokeStyle="white",this.drawStars(n,s,C,i,a,A,I,0);
  else if(b<this.PHASE1_DURATION+this.PHASE2_DURATION){let U=(b-this.PHASE1_DURATION)/this.PHASE2_DURATION;
  C=Math.max(2,45-U*43);
  let ce=U*.15;
  n.save(),n.globalAlpha=Math.max(0,1-U*.5),n.strokeStyle="rgba(200, 220, 255, 1)",this.drawStars(n,s,C,i,a,A,I,ce),n.restore(),U>.5&&!this.imageFadingIn&&(this.imageFadingIn=!0,this.openingImageRef.nativeElement.classList.add("visible"),this.zoomContainerRef.nativeElement.style.transform="scale(1)")}else if(b<this.TOTAL_DURATION){let U=(b-this.PHASE1_DURATION-this.PHASE2_DURATION)/this.PHASE3_DURATION;
  if(n.clearRect(0,0,i,a),this.openingImageRef.nativeElement.style.opacity=Math.min(1,U*1.5).toString(),U>.6){let ce=(U-.6)/.4,fe=1+Math.pow(ce,4)*30;
  this.openingImageRef.nativeElement.style.transformOrigin="75% 45%",this.openingImageRef.nativeElement.style.transform=`scale(${fe})`,this.zoomContainerRef.nativeElement.style.transform="scale(1)"}else this.openingImageRef.nativeElement.style.transformOrigin="75% 45%",this.openingImageRef.nativeElement.style.transform="scale(1)",this.zoomContainerRef.nativeElement.style.transform="scale(1)";
  this.drawDynamicComet(n,A,I,i,a,U)}else n.clearRect(0,0,i,a),this.loadingScreenRef.nativeElement.classList.contains("fade-out")||this.startFadeOut();
  this.animationFrameId=requestAnimationFrame(S)};
  this.ngZone.runOutsideAngular(()=>{S()})}drawStars(t,n,i,a,s,h,C,S){n.forEach(b=>{b.z-=i,S>0&&(b.angle+=S*(1e3/Math.max(100,b.dist)),b.x=Math.cos(b.angle)*b.dist,b.y=Math.sin(b.angle)*b.dist),b.z<=0&&(b.x=Math.random()*a*2-a,b.y=Math.random()*s*2-s,b.z=a,b.pz=a,b.angle=Math.atan2(b.y,b.x),b.dist=Math.sqrt(b.x*b.x+b.y*b.y));
  let A=b.x/b.z*a+h,I=b.y/b.z*s+C,V=b.x/b.pz*a+h,U=b.y/b.pz*s+C;
  b.pz=b.z,t.lineWidth=Math.max(.5,(1-b.z/a)*3),t.beginPath(),t.moveTo(V,U),t.lineTo(A,I),t.stroke()})}drawDynamicComet(t,n,i,a,s,h){t.save(),t.translate(n,i);
  let S=Math.max(0,h-.45),b={x:-a*.8,y:s*.8},
  A={x:a*.8,y:s*.6},
  I={x:a*.6,y:-s*.6},
  V={x:a*.25,y:s*-.05},
  U=ae=>{let le=1-ae;
  return{x:le*le*le*b.x+3*le*le*ae*A.x+3*le*ae*ae*I.x+ae*ae*ae*V.x,y:le*le*le*b.y+3*le*le*ae*A.y+3*le*ae*ae*I.y+ae*ae*ae*V.y}},
  ce=ae=>{let le=1-ae,J=3*le*le*(A.x-b.x)+6*le*ae*(I.x-A.x)+3*ae*ae*(V.x-I.x),ie=3*le*le*(A.y-b.y)+6*le*ae*(I.y-A.y)+3*ae*ae*(V.y-I.y);
  return Math.atan2(ie,J)},
  fe=30,$=7,Se=50,Le=Math.sin(h*Math.PI);
  for(let ae=0;
  ae<fe;
  ae++){let le=(ae-fe/2)*$,J=Math.abs(ae-fe/2)/(fe/2),ie=J<.4,De=Math.max(1,4.5-J*3.5),Ee=0,Ye=0,Fe=!1;
  for(let Qe=0;
  Qe<=Se;
  Qe++){let Ke=S+(h-S)*(Qe/Se);
  if(Ke<=0)continue;
  let Je=Math.pow(Ke,1.15),We=U(Je),st=Math.max(0,1-Je),Ot=ce(Je)+Math.PI/2,Xt=le*Math.sin(Qe/Se*Math.PI)*st,Yt=We.x+Math.cos(Ot)*Xt,ln=We.y+Math.sin(Ot)*Xt;
  if(Fe){t.beginPath(),t.moveTo(Ee,Ye),t.lineTo(Yt,ln);
  let gi=Math.pow(Qe/Se,1.5),br=(ie?1:.6)*gi*Le*(1-J);
  t.strokeStyle=`rgba(255, 255, 255, ${br})`,t.lineWidth=De*st,t.shadowColor=`rgba(255, 255, 255, ${br})`,t.shadowBlur=(ie?15:20)*st,t.stroke()}Ee=Yt,Ye=ln,Fe=!0}}if(h>0&&h<1){let ae=Math.pow(h,1.15),le=U(ae),J=Math.max(0,1-ae);
  t.globalAlpha=Le,t.beginPath(),t.arc(le.x,le.y,10*J,0,Math.PI*2),t.fillStyle="#ffffff",t.shadowColor="#ffffff",t.shadowBlur=40*J,t.fill(),t.beginPath(),t.arc(le.x,le.y,45*J,0,Math.PI*2),t.fillStyle="rgba(255, 255, 255, 0.4)",t.shadowBlur=80*J,t.fill()}t.restore()}startFadeOut(){this.loadingScreenRef.nativeElement.classList.add("fade-out"),setTimeout(()=>{this.ngZone.run(()=>{this.loadingComplete.emit()})},
  800)}static \u0275fac=function(n){return new(n||e)(at(Zn))};
  static \u0275cmp=kt({type:e,selectors:[["app-loading-screen"]],viewQuery:function(n,i){if(n&1&&(St(Tm,7),St(Lm,7),St(Rm,7),St(km,7)),n&2){let a;
  A