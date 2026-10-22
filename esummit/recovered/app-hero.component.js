// app-hero.component.js
// WebGL2 "CylinderEngine": panoramic cylinder of 12 images + 18 orange comet trails
// source: chunks/chunk-UXY565XE.js

=class{constructor(t,{image:i,target:r=t.TEXTURE_2D,type:n=t.UNSIGNED_BYTE,format:s=t.RGBA,internalFormat:a=s,wrapS:l=t.CLAMP_TO_EDGE,wrapT:h=t.CLAMP_TO_EDGE,wrapR:o=t.CLAMP_TO_EDGE,generateMipmaps:c=r===(t.TEXTURE_2D||t.TEXTURE_CUBE_MAP),minFilter:f=c?t.NEAREST_MIPMAP_LINEAR:t.LINEAR,magFilter:g=t.LINEAR,premultiplyAlpha:d=!1,unpackAlignment:p=4,flipY:u=r==(t.TEXTURE_2D||t.TEXTURE_3D),anisotropy:m=0,level:x=0,width:y,height:M=y,length:_=1}={}){this.gl=t,this.id=Di++,this.image=i,this.target=r,this.type=n,this.format=s,this.internalFormat=a,this.minFilter=f,this.magFilter=g,this.wrapS=l,this.wrapT=h,this.wrapR=o,this.generateMipmaps=c,this.premultiplyAlpha=d,this.unpackAlignment=p,this.flipY=u,this.anisotropy=Math.min(m,this.gl.renderer.parameters.maxAnisotropy),this.level=x,this.width=y,this.height=M,this.length=_,this.texture=this.gl.createTexture(),this.store={image:null},
  this.glState=this.gl.renderer.state,this.state={},
  this.state.minFilter=this.gl.NEAREST_MIPMAP_LINEAR,this.state.magFilter=this.gl.LINEAR,this.state.wrapS=this.gl.REPEAT,this.state.wrapT=this.gl.REPEAT,this.state.anisotropy=0}bind(){this.glState.textureUnits[this.glState.activeTextureUnit]!==this.id&&(this.gl.bindTexture(this.target,this.texture),this.glState.textureUnits[this.glState.activeTextureUnit]=this.id)}update(t=0){let i=!(this.image===this.store.image&&!this.needsUpdate);
  if((i||this.glState.textureUnits[t]!==this.id)&&(this.gl.renderer.activeTexture(t),this.bind()),!!i){if(this.needsUpdate=!1,this.flipY!==this.glState.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this.flipY),this.glState.flipY=this.flipY),this.premultiplyAlpha!==this.glState.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this.premultiplyAlpha),this.glState.premultiplyAlpha=this.premultiplyAlpha),this.unpackAlignment!==this.glState.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this.unpackAlignment),this.glState.unpackAlignment=this.unpackAlignment),this.minFilter!==this.state.minFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MIN_FILTER,this.minFilter),this.state.minFilter=this.minFilter),this.magFilter!==this.state.magFilter&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_MAG_FILTER,this.magFilter),this.state.magFilter=this.magFilter),this.wrapS!==this.state.wrapS&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_S,this.wrapS),this.state.wrapS=this.wrapS),this.wrapT!==this.state.wrapT&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_T,this.wrapT),this.state.wrapT=this.wrapT),this.wrapR!==this.state.wrapR&&(this.gl.texParameteri(this.target,this.gl.TEXTURE_WRAP_R,this.wrapR),this.state.wrapR=this.wrapR),this.anisotropy&&this.anisotropy!==this.state.anisotropy&&(this.gl.texParameterf(this.target,this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT,this.anisotropy),this.state.anisotropy=this.anisotropy),this.image){if(this.image.width&&(this.width=this.image.width,this.height=this.image.height),this.target===this.gl.TEXTURE_CUBE_MAP)for(let r=0;
  r<6;
  r++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+r,this.level,this.internalFormat,this.format,this.type,this.image[r]);
  else if(ArrayBuffer.isView(this.image))this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,this.image):(this.target===this.gl.TEXTURE_2D_ARRAY||this.target===this.gl.TEXTURE_3D)&&this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,this.image);
  else if(this.image.isCompressedTexture)for(let r=0;
  r<this.image.length;
  r++)this.gl.compressedTexImage2D(this.target,r,this.internalFormat,this.image[r].width,this.image[r].height,0,this.image[r].data);
  else this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.format,this.type,this.image):this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,this.image);
  this.generateMipmaps&&(!this.gl.renderer.isWebgl2&&(!ai(this.image.width)||!ai(this.image.height))?(this.generateMipmaps=!1,this.wrapS=this.wrapT=this.gl.CLAMP_TO_EDGE,this.minFilter=this.gl.LINEAR):this.gl.generateMipmap(this.target)),this.onUpdate&&this.onUpdate()}else if(this.target===this.gl.TEXTURE_CUBE_MAP)for(let r=0;
  r<6;
  r++)this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X+r,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,si);
  else this.width?this.target===this.gl.TEXTURE_2D?this.gl.texImage2D(this.target,this.level,this.internalFormat,this.width,this.height,0,this.format,this.type,null):this.gl.texImage3D(this.target,this.level,this.internalFormat,this.width,this.height,this.length,0,this.format,this.type,null):this.gl.texImage2D(this.target,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,si);
  this.store.image=this.image}}};
  var Vi=/[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig;
  var Ni=/[\+\-]?\d*\.?\d+e[\+\-]?\d+/ig;
  var Ui=Math.PI/180,qr=180/Math.PI,gt=Math.sin,dt=Math.cos,it=Math.abs,et=Math.sqrt;
  var Xi=function(t){return typeof t=="number"};
  var hi=1e5;
  var H=function(t){return Math.round(t*hi)/hi||0};
  function li(e,t,i,r,n,s,a){for(var l=e.length,h,o,c,f,g;
  --l>-1;
  )for(h=e[l],o=h.length,c=0;
  c<o;
  c+=2)f=h[c],g=h[c+1],h[c]=f*t+g*r+s,h[c+1]=f*i+g*n+a;
  return e._dirty=1,e}function Bi(e,t,i,r,n,s,a,l,h){if(!(e===l&&t===h)){i=it(i),r=it(r);
  var o=n%360*Ui,c=dt(o),f=gt(o),g=Math.PI,d=g*2,p=(e-l)/2,u=(t-h)/2,m=c*p+f*u,x=-f*p+c*u,y=m*m,M=x*x,_=y/(i*i)+M/(r*r);
  _>1&&(i=et(_)*i,r=et(_)*r);
  var w=i*i,E=r*r,v=(w*E-w*M-E*y)/(w*M+E*y);
  v<0&&(v=0);
  var C=(s===a?-1:1)*et(v),F=C*(i*x/r),b=C*-(r*m/i),T=(e+l)/2,P=(t+h)/2,R=T+(c*F-f*b),A=P+(f*F+c*b),O=(m-F)/i,U=(x-b)/r,rt=(-m-F)/i,nt=(-x-b)/r,It=O*O+U*U,Dt=(U<0?-1:1)*Math.acos(O/et(It)),X=(O*nt-U*rt<0?-1:1)*Math.acos((O*rt+U*nt)/et(It*(rt*rt+nt*nt)));
  isNaN(X)&&(X=g),!a&&X>0?X-=d:a&&X<0&&(X+=d),Dt%=d,X%=d;
  var Vt=Math.ceil(it(X)/(d/4)),B=[],st=X/Vt,at=4/3*gt(st/2)/(1+dt(st/2)),ui=c*i,mi=f*i,xi=f*-r,yi=c*r,I;
  for(I=0;
  I<Vt;
  I++)n=Dt+I*st,m=dt(n),x=gt(n),O=dt(n+=st),U=gt(n),B.push(m-at*x,x+at*m,O+at*U,U-at*O,O,U);
  for(I=0;
  I<B.length;
  I+=2)m=B[I],x=B[I+1],B[I]=m*ui+x*xi+R,B[I+1]=m*mi+x*yi+A;
  return B[I-2]=l,B[I-1]=h,B}}function oi(e){var t=(e+"").replace(Ni,function(F){var b=+F;
  return b<1e-4&&b>-1e-4?0:b}).match(Vi)||[],i=[],r=0,n=0,s=2/3,a=t.length,l=0,h="ERROR: malformed path: "+e,o,c,f,g,d,p,u,m,x,y,M,_,w,E,v,C=function(b,T,P,R){y=(P-b)/3,M=(R-T)/3,u.push(b+y,T+M,P-y,R-M,P,R)};
  if(!e||!isNaN(t[0])||isNaN(t[1]))return console.log(h),i;
  for(o=0;
  o<a;
  o++)if(w=d,isNaN(t[o])?(d=t[o].toUpperCase(),p=d!==t[o]):o--,f=+t[o+1],g=+t[o+2],p&&(f+=r,g+=n),o||(m=f,x=g),d==="M")u&&(u.length<8?i.length-=1:l+=u.length),r=m=f,n=x=g,u=[f,g],i.push(u),o+=2,d="L";
  else if(d==="C")u||(u=[0,0]),p||(r=n=0),u.push(f,g,r+t[o+3]*1,n+t[o+4]*1,r+=t[o+5]*1,n+=t[o+6]*1),o+=6;
  else if(d==="S")y=r,M=n,(w==="C"||w==="S")&&(y+=r-u[u.length-4],M+=n-u[u.length-3]),p||(r=n=0),u.push(y,M,f,g,r+=t[o+3]*1,n+=t[o+4]*1),o+=4;
  else if(d==="Q")y=r+(f-r)*s,M=n+(g-n)*s,p||(r=n=0),r+=t[o+3]*1,n+=t[o+4]*1,u.push(y,M,r+(f-r)*s,n+(g-n)*s,r,n),o+=4;
  else if(d==="T")y=r-u[u.length-4],M=n-u[u.length-3],u.push(r+y,n+M,f+(r+y*1.5-f)*s,g+(n+M*1.5-g)*s,r=f,n=g),o+=2;
  else if(d==="H")C(r,n,r=f,n),o+=1;
  else if(d==="V")C(r,n,r,n=f+(p?n-r:0)),o+=1;
  else if(d==="L"||d==="Z")d==="Z"&&(f=m,g=x,u.closed=!0),(d==="L"||it(r-f)>.5||it(n-g)>.5)&&(C(r,n,f,g),d==="L"&&(o+=2)),r=f,n=g;
  else if(d==="A"){if(E=t[o+4],v=t[o+5],y=t[o+6],M=t[o+7],c=7,E.length>1&&(E.length<3?(M=y,y=v,c--):(M=v,y=E.substr(2),c-=2),v=E.charAt(1),E=E.charAt(0)),_=Bi(r,n,+t[o+1],+t[o+2],+t[o+3],+E,+v,(p?r:0)+y*1,(p?n:0)+M*1),o+=c,_)for(c=0;
  c<_.length;
  c++)u.push(_[c]);
  r=u[u.length-2],n=u[u.length-1]}else console.log(h);
  return o=u.length,o<6?(i.pop(),o=0):u[0]===u[o-2]&&u[1]===u[o-1]&&(u.closed=!0),i.totalPoints=l+o,i}function ci(e){Xi(e[0])&&(e=[e]);
  var t="",i=e.length,r,n,s,a;
  for(n=0;
  n<i;
  n++){for(a=e[n],t+="M"+H(a[0])+","+H(a[1])+" C",r=a.length,s=2;
  s<r;
  s++)t+=H(a[s++])+","+H(a[s++])+" "+H(a[s++])+","+H(a[s++])+" "+H(a[s++])+","+H(a[s])+" ";
  a.closed&&(t+="z")}return t}var z,pi,gi=function(){return z||typeof window<"u"&&(z=window.gsap)&&z.registerPlugin&&z},
  fi=function(){z=gi(),z?(z.registerEase("_CE",N.create),pi=1):console.warn("Please gsap.registerPlugin(CustomEase)")},
  ki=1e20,ut=function(t){return~~(t*1e3+(t<0?-.5:.5))/1e3},
  Gi=1,Hi=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/gi,Yi=/[cLlsSaAhHvVtTqQ]/g,qi=function(t){var i=t.length,r=ki,n;
  for(n=1;
  n<i;
  n+=6)+t[n]<r&&(r=+t[n]);
  return r},
  ji=function(t,i,r){!r&&r!==0&&(r=Math.max(+t[t.length-1],+t[1]));
  var n=+t[0]*-1,s=-r,a=t.length,l=1/(+t[a-2]+n),h=-i||(Math.abs(+t[a-1]-+t[1])<.01*(+t[a-2]-+t[0])?qi(t)+s:+t[a-1]+s),o;
  for(h?h=1/h:h=-l,o=0;
  o<a;
  o+=2)t[o]=(+t[o]+n)*l,t[o+1]=(+t[o+1]+s)*h},
  Wi=function e(t,i,r,n,s,a,l,h,o,c,f){var g=(t+r)/2,d=(i+n)/2,p=(r+s)/2,u=(n+a)/2,m=(s+l)/2,x=(a+h)/2,y=(g+p)/2,M=(d+u)/2,_=(p+m)/2,w=(u+x)/2,E=(y+_)/2,v=(M+w)/2,C=l-t,F=h-i,b=Math.abs((r-l)*F-(n-h)*C),T=Math.abs((s-l)*F-(a-h)*C),P;
  return c||(c=[{x:t,y:i},
  {x:l,y:h}],f=1),c.splice(f||c.length-1,0,{x:E,y:v}),(b+T)*(b+T)>o*(C*C+F*F)&&(P=c.length,e(t,i,g,d,y,M,E,v,o,c,f),e(E,v,_,w,m,x,l,h,o,c,f+1+(c.length-P))),c},
  N=function(){function e(i,r,n){pi||fi(),this.id=i,Gi&&this.setData(r,n)}var t=e.prototype;
  return t.setData=function(r,n){n=n||{},
  r=r||"0,0,1,1";
  var s=r.match(Hi),a=1,l=[],h=[],o=n.precision||1,c=o<=1,f,g,d,p,u,m,x,y,M;
  if(this.data=r,(Yi.test(r)||~r.indexOf("M")&&r.indexOf("C")<0)&&(s=oi(r)[0]),f=s.length,f===4)s.unshift(0,0),s.push(1,1),f=8;
  else if((f-2)%6)throw"Invalid CustomEase";
  for((+s[0]!=0||+s[f-2]!=1)&&ji(s,n.height,n.originY),this.segment=s,p=2;
  p<f;
  p+=6)g={x:+s[p-2],y:+s[p-1]},
  d={x:+s[p+4],y:+s[p+5]},
  l.push(g,d),Wi(g.x,g.y,+s[p],+s[p+1],+s[p+2],+s[p+3],d.x,d.y,1/(o*2e5),l,l.length-1);
  for(f=l.length,p=0;
  p<f;
  p++)x=l[p],y=l[p-1]||x,(x.x>y.x||y.y!==x.y&&y.x===x.x||x===y)&&x.x<=1?(y.cx=x.x-y.x,y.cy=x.y-y.y,y.n=x,y.nx=x.x,c&&p>1&&Math.abs(y.cy/y.cx-l[p-2].cy/l[p-2].cx)>2&&(c=0),y.cx<a&&(y.cx?a=y.cx:(y.cx=.001,p===f-1&&(y.x-=.001,a=Math.min(a,.001),c=0)))):(l.splice(p--,1),f--);
  if(f=1/a+1|0,u=1/f,m=0,x=l[0],c){for(p=0;
  p<f;
  p++)M=p*u,x.nx<M&&(x=l[++m]),g=x.y+(M-x.x)/x.cx*x.cy,h[p]={x:M,cx:u,y:g,cy:0,nx:9},
  p&&(h[p-1].cy=g-h[p-1].y);
  m=l[l.length-1],h[f-1].cy=m.y-g,h[f-1].cx=m.x-h[h.length-1].x}else{for(p=0;
  p<f;
  p++)x.nx<p*u&&(x=l[++m]),h[p]=x;
  m<l.length-1&&(h[p-1]=l[l.length-2])}return this.ease=function(_){var w=h[_*f|0]||h[f-1];
  return w.nx<_&&(w=w.n),w.y+(_-w.x)/w.cx*w.cy},
  this.ease.custom=this,this.id&&z&&z.registerEase(this.id,this.ease),this},
  t.getSVGData=function(r){return e.getSVGData(this,r)},
  e.create=function(r,n,s){return new e(r,n,s).ease},
  e.register=function(r){z=r,fi()},
  e.get=function(r){return z.parseEase(r)},
  e.getSVGData=function(r,n){n=n||{};
  var s=n.width||100,a=n.height||100,l=n.x||0,h=(n.y||0)+a,o=z.utils.toArray(n.path)[0],c,f,g,d,p,u,m,x,y,M;
  if(n.invert&&(a=-a,h=0),typeof r=="string"&&(r=z.parseEase(r)),r.custom&&(r=r.custom),r instanceof e)c=ci(li([r.segment],s,0,0,-a,l,h));
  else{for(c=[l,h],m=Math.max(5,(n.precision||1)*200),d=1/m,m+=2,x=5/m,y=ut(l+d*s),M=ut(h+r(d)*-a),f=(M-h)/(y-l),g=2;
  g<m;
  g++)p=ut(l+g*d*s),u=ut(h+r(g*d)*-a),(Math.abs((u-M)/(p-y)-f)>x||g===m-1)&&(c.push(y,M),f=(u-M)/(p-y)),y=p,M=u;
  c="M"+c.join(",")}return o&&o.setAttribute("d",c),c},
  e}();
  N.version="3.13.0";
  N.headless=!0;
  gi()&&z.registerPlugin(N);
  typeof window<"u"&&(yt.registerPlugin(Yt,N),N.create("cinematicSilk","0.45, 0.05, 0.55, 0.95"),N.create("cinematicSmooth","0.25, 0.1, 0.25, 1"),N.create("cinematicFlow","0.33, 0, 0.2, 1"),N.create("cinematicLinear","0.4, 0, 0.6, 1"));
  var Qi=`
  attribute vec2 uv;
  
  attribute vec3 position;
  
  
  uniform mat4 modelViewMatrix;
  
  uniform mat4 projectionMatrix;
  
  
  varying vec2 vUv;
  
  
  void main() {
    vUv = uv;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  
  }
`,Zi=`
  precision highp float;
  

  uniform sampler2D tMap;
  
  uniform float uDarkness;
  

  varying vec2 vUv;
  

  void main() {
    vec4 tex = texture2D(tMap, vUv);
  
    tex.rgb *= (1.0 - uDarkness);
  
    gl_FragColor = tex;
  
  }
`,$i=`
  attribute vec3 position;
  
  attribute float aProgress;
  
  uniform mat4 modelViewMatrix;
  
  uniform mat4 projectionMatrix;
  
  varying float vProgress;
  
  
  void main() {
    vProgress = aProgress;
  
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  
  }
`,Ki=`
  precision highp float;
  
  uniform vec3 uColor;
  
  uniform float uOpacity;
  
  varying float vProgress;
  
  
  void main() {
    // Glowing fiery head tapering into a smooth fading tail
    vec3 headColor = vec3(1.0, 0.96, 0.85);
  
    vec3 tailColor = uColor;
  
    vec3 col = mix(tailColor, headColor, pow(vProgress, 2.6));
  
    float alpha = uOpacity * (0.05 + 0.95 * pow(vProgress, 1.35));
  
    gl_FragColor = vec4(col, alpha);
  
  }
`;
  function Ji(e,t,i,r,n,s){let a=t.naturalWidth/t.naturalHeight,l=n/s,h=0,o=0,c=t.naturalWidth,f=t.naturalHeight;
  a>l?(c=t.naturalHeight*l,h=(t.naturalWidth-c)/2):(f=t.naturalWidth/l,o=(t.naturalHeight-f)/2),e.save(),e.translate(i,r+s),e.scale(1,-1),e.drawImage(t,h,o,c,f,0,0,n,s),e.restore()}function tr(e,t,i,r=64,n=1){let s=[],a=[],l=[];
  for(let h=0;
  h<=n;
  h++){let o=h/n,c=(o-.5)*i;
  for(let f=0;
  f<=r;
  f++){let g=f/r,d=g*Math.PI*2,p=Math.cos(d)*t,u=Math.sin(d)*t;
  s.push(p,c,u),a.push(g,1-o)}}for(let h=0;
  h<n;
  h++)for(let o=0;
  o<r;
  o++){let c=h*(r+1)+o,f=c+r+1,g=c+1,d=f+1;
  l.push(c,f,g),l.push(f,d,g)}return new Q(e,{position:{size:3,data:new Float32Array(s)},
  uv:{size:2,data:new Float32Array(a)},
  index:{data:new Uint16Array(l)}})}function er(e,t,i,r,n,s,a){let l=[],h=[],o=s/t*Math.PI*2,f=s<t/2?a*.35+s/(t/2)*a*.55:-a*.9+(s-t/2)/(t/2)*a*.55,g=.22+s%4*.12,d=s*1.37%(Math.PI*2),p=(s%5-2)*.14,u=((s+2)%5-2)*.12,m=i+(s%3-1)*.35,x=.85+s%4*.35;
  for(let y=0;
  y<=r;
  y++){let M=y/r,_=o+n*M,w=Math.cos(_)*m,E=Math.sin(_)*m,v=f+Math.sin(_+d)*g,C=v*Math.cos(p)-E*Math.sin(p),F=v*Math.sin(p)+E*Math.cos(p),b=w*Math.cos(u)-C*Math.sin(u),T=w*Math.sin(u)+C*Math.cos(u);
  l.push(b,T,F),h.push(M)}return{geometry:new Q(e,{position:{size:3,data:new Float32Array(l)},
  aProgress:{size:1,data:new Float32Array(h)}}),userData:{baseAngle:o,angleSpan:n,baseY:f,yAmplitude:g,phase:d,tiltX:p,tiltZ:u,speed:x,radius:m}}}var mt=class{canvas;
  renderer;
  gl;
  camera;
  scene;
  cylinder=null;
  particles=[];
  isDestroyed=!1;
  animFrameId=null;
  cameraAnim={x:0,y:0,z:8,rotY:0};
  targetMouseX=0;
  targetMouseY=0;
  mouseX=0;
  mouseY=0;
  isDragging=!1;
  lastPointerX=0;
  dragVelocity=0;
  momentum=0;
  velocity=0;
  lastRotation=0;
  baseRotationSpeed=.0035;
  initialRadius=2.5;
  initialCylinderHeight=1.05;
  images=["img/img1.png","img/img2.png","img/img3.png","img/img4.png","img/img5.png","img/img6.png","img/img7.png","img/img8.png","img/img9.png","img/img10.png","img/img11.png","img/img12.png"];
  onReady;
  constructor(t){this.canvas=t,this.init()}getDimensions(){let t=window.innerWidth,i=window.innerHeight,r=t/i,n=t<768,s=t>=768&&t<1024,a=n?50:45,l=n?5.8:s?6.8:7.2,h=a*Math.PI/180,c=l*Math.tan(h/2)*r;
  return{radius:Math.max(c*.96,n?2.2:3.6),cylinderHeight:n?.72:s?.88:1.05,cameraZ:l,fov:a,isMobile:n}}init(){let t=Math.min(window.devicePixelRatio||1,2);
  this.renderer=new K({canvas:this.canvas,width:window.innerWidth,height:window.innerHeight,dpr:t,alpha:!0,antialias:!0}),this.gl=this.renderer.gl,this.gl.clearColor(0,0,0,0),this.gl.disable(this.gl.CULL_FACE);
  let i=this.getDimensions(),r={fov:i.fov};
  i.isMobile&&(r.aspect=window.innerWidth/window.innerHeight),this.camera=new J(this.gl,r),this.camera.position.set(0,0,i.cameraZ),this.cameraAnim.z=i.cameraZ,this.scene=new k,this.setupListeners(),this.loadAssetsAndBuild(i)}loadAssetsAndBuild(t){this.initialRadius=t.radius,this.initialCylinderHeight=t.cylinderHeight;
  let i=tr(this.gl,t.radius,t.cylinderHeight,64,1),r=this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE)||4096,n=t.isMobile?2048:Math.min(r,8192),s=document.createElement("canvas"),a=s.getContext("2d",{willReadFrequently:!1,alpha:!1}),l=this.images.length,h=1024,o=1024,c=h*l,f=Math.min(1,n/c);
  s.width=Math.floor(c*f),s.height=Math.floor(o*f);
  let g=0,d=[];
  this.images.forEach((p,u)=>{let m=new Image;
  m.crossOrigin="anonymous",m.onload=()=>{if(d[u]=m,g++,g===l){let x=s.width,y=s.height;
  d.forEach((F,b)=>{let T=b/l*x,P=(b+1)/l*x,R=Math.floor(T),O=Math.floor(P)-R;
  Ji(a,F,R,0,O,y)});
  let M=new tt(this.gl,{wrapS:this.gl.CLAMP_TO_EDGE,wrapT:this.gl.CLAMP_TO_EDGE,minFilter:this.gl.LINEAR,magFilter:this.gl.LINEAR,generateMipmaps:!1});
  M.image=s,M.needsUpdate=!0;
  let _=new Z(this.gl,{vertex:Qi,fragment:Zi,uniforms:{tMap:{value:M},
  uDarkness:{value:.28}},
  cullFace:null});
  this.cylinder=new $(this.gl,{geometry:i,program:_}),this.cylinder.setParent(this.scene),this.cylinder.rotation.y=.5;
  let w=18,E=t.radius+.65,v=24,C=.42;
  for(let F=0;
  F<w;
  F++){let{geometry:b,userData:T}=er(this.gl,w,E,v,C,F,t.cylinderHeight),P=new Z(this.gl,{vertex:$i,fragment:Ki,uniforms:{uColor:{value:[1,.52,.12]},
  uOpacity:{value:0}},
  transparent:!0,depthTest:!0}),R=new $(this.gl,{geometry:b,program:P,mode:this.gl.LINE_STRIP});
  R.userData=T,R.setParent(this.scene),this.particles.push(R)}this.onReady&&this.onReady(),this.startLoop()}},
  m.onerror=()=>{console.warn("Could not load hero cylinder image:",p)},
  m.src=p})}setupListeners(){window.addEventListener("resize",this.onResize),window.addEventListener("pointermove",this.onPointerMove),window.addEventListener("pointerdown",this.onPointerDown),window.addEventListener("pointerup",this.onPointerUp)}onResize=()=>{if(this.isDestroyed||!this.renderer||!this.camera)return;
  let t=window.innerWidth,i=window.innerHeight;
  this.renderer.setSize(t,i);
  let r=this.getDimensions();
  if(this.camera.perspective({fov:r.fov,aspect:t/i}),this.cylinder&&this.initialRadius&&this.initialCylinderHeight){let n=r.radius/this.initialRadius,s=r.cylinderHeight/this.initialCylinderHeight;
  this.cylinder.scale.set(n,s,n)}};
  onPointerMove=t=>{let i=t.clientX/window.innerWidth*2-1,r=-(t.clientY/window.innerHeight)*2+1;
  if(this.targetMouseX=i*.45,this.targetMouseY=r*.35,this.isDragging&&this.cylinder){let n=(t.clientX-this.lastPointerX)/window.innerWidth;
  this.lastPointerX=t.clientX,this.cylinder.rotation.y+=n*3.5,this.dragVelocity=n*.4}};
  onPointerDown=t=>{this.isDragging=!0,this.lastPointerX=t.clientX};
  onPointerUp=()=>{this.isDragging=!1};
  setupScroll(t,i,r,n){if(!t)return;
  let s=this.getDimensions(),a=yt.timeline({scrollTrigger:{trigger:t,start:"top top",end:"+="+window.innerHeight*3.5,pin:!0,pinSpacing:!0,scrub:1}});
  a.to(this.cameraAnim,{x:0,y:0,z:s.cameraZ,duration:1,ease:"cinematicSilk"},
  0).to(this.cameraAnim,{x:0,y:4.8,z:4.8,duration:1.2,ease:"cinematicFlow"},
  1).to(this.cameraAnim,{x:1.5,y:2,z:2,duration:2,ease:"cinematicLinear"},
  2.2).to(this.cameraAnim,{x:.4,y:0,z:.8,duration:3.5,ease:"power1.inOut"},
  4.2).to(this.cameraAnim,{x:-5.5,y:-1,z:s.cameraZ,duration:1.2,ease:"cinematicSmooth"},
  7.7),this.cylinder&&a.to(this.cylinder.rotation,{y:"+=28.27",duration:8.9,ease:"none"},
  0),i&&a.to(i,{opacity:0,scale:.88,y:-40,duration:1.4,ease:"power2.inOut",pointerEvents:"none"},
  .6),r&&a.fromTo(r,{opacity:0,scale:.9,y:30},
  {opacity:1,scale:1,y:0,duration:1.2,ease:"cinematicSmooth"},
  1.8).to(r,{opacity:0,scale:1.05,y:-30,duration:.8,ease:"power2.in"},
  3.8),n&&a.fromTo(n,{opacity:0,scale:.9,y:30},
  {opacity:1,scale:1,y:0,duration:1.2,ease:"cinematicSmooth"},
  4.6).to(n,{opacity:0,scale:1.05,y:-30,duration:.8,ease:"power2.in"},
  7.2)}startLoop=()=>{let t=()=>{if(!this.isDestroyed){if(this.dragVelocity*=.92,this.mouseX+=(this.targetMouseX-this.mouseX)*.06,this.mouseY+=(this.targetMouseY-this.mouseY)*.06,this.camera.position.set(this.cameraAnim.x+this.mouseX*.8,this.cameraAnim.y+this.mouseY*.6,this.cameraAnim.z),this.camera.lookAt([0,0,0]),this.cylinder){this.cylinder.rotation.y+=this.baseRotationSpeed+this.dragVelocity;
  let i=this.cylinder.rotation.y;
  this.velocity=i-this.lastRotation,this.lastRotation=i;
  let r=.15,n=.92;
  this.momentum=this.momentum*n+this.velocity*r;
  let s=Math.abs(this.velocity)*100,a=Math.abs(this.velocity)>1e-4;
  this.particles.forEach(l=>{let h=l.userData,o=a?Math.min(s*3.5,.95):.22,c=l.program.uniforms.uOpacity.value||0;
  l.program.uniforms.uOpacity.value=c+(o-c)*.12;
  let f=.005*h.speed,g=this.velocity*h.speed*1.6;
  h.baseAngle+=f+g;
  let d=24,p=l.geometry.attributes.position.data;
  for(let u=0;
  u<=d;
  u++){let m=u/d,x=h.baseAngle+h.angleSpan*m,y=h.radius*(1+.12*Math.sin(x*2+h.phase)),M=Math.cos(x)*y,_=Math.sin(x)*y,w=h.baseY+Math.sin(x+h.phase)*h.yAmplitude,E=w*Math.cos(h.tiltX)-_*Math.sin(h.tiltX),v=w*Math.sin(h.tiltX)+_*Math.cos(h.tiltX),C=M*Math.cos(h.tiltZ)-E*Math.sin(h.tiltZ),F=M*Math.sin(h.tiltZ)+E*Math.cos(h.tiltZ);
  p[u*3]=C,p[u*3+1]=F,p[u*3+2]=v}l.geometry.attributes.position.needsUpdate=!0})}this.renderer.render({scene:this.scene,camera:this.camera}),this.animFrameId=requestAnimationFrame(t)}};
  this.animFrameId=requestAnimationFrame(t)};
  destroy(){this.isDestroyed=!0,this.animFrameId&&cancelAnimationFrame(this.animFrameId),window.removeEventListener("resize",this.onResize),window.removeEventListener("pointermove",this.onPointerMove),window.removeEventListener("pointerdown",this.onPointerDown),window.removeEventListener("pointerup",this.onPointerUp)}};
  var ir=["heroCanvas"],rr=["heroHeader"],nr=["heroContent"],sr=["perspective1"],ar=["perspective2"];
  function hr(e,t){e&1&&(D(0,"button",12),G(1,"Explore"),V())}function lr(e,t){e&1&&(D(0,"button",17),G(1,"Register"),V(),D(2,"button",18),G(3,"Login"),V())}var di=class e{isLoggedIn=!1;
  canvasRef;
  headerRef;
  contentRef;
  perspective1Ref;
  perspective2Ref;
  engine=null;
  constructor(){}ngOnInit(){}ngAfterViewInit(){this.canvasRef?.nativeElement&&this.initEngine()}initEngine(){try{this.engine=new mt(this.canvasRef.nativeElement),this.headerRef?.nativeElement&&this.engine.setupScroll(this.headerRef.nativeElement,this.contentRef?.nativeElement,this.perspective1Ref?.nativeElement,this.perspective2Ref?.nativeElement)}catch(t){console.error("Failed to initialize Hero CylinderEngine:",t)}}ngOnDestroy(){this.engine&&(this.engine.destroy(),this.engine=null)}static \u0275fac=function(i){return new(i||e)};
  static \u0275cmp=Nt({type:e,selectors:[["app-hero"]],viewQuery:function(i,r){if(i&1&&(q(ir,5),q(rr,5),q(nr,5),q(sr,5),q(ar,5)),i&2){let n;
  j(n=W())&&(r.canvasRef=n.first),j(n=W())&&(r.headerRef=n.first),j(n=W())&&(r.contentRef=n.first),j(n=W())&&(r.perspective1Ref=n.first),j(n=W())&&(r.perspective2Ref=n.first)}},
  inputs:{isLoggedIn:"isLoggedIn"},
  standalone:!0,features:[kt],decls:24,vars:1,consts:[["heroHeader",""],["heroCanvas",""],["heroContent",""],["perspective1",""],["perspective2",""],[1,"header"],[1,"canvas-container"],[1,"hero-canvas"],[1,"hero-content"],[1,"logo"],["src","pseudo_plogo.svg","alt","22nd E-Summit Logo"],[1,"hero-cta","standard"],["routerLink","/events"],[1,"perspective-card","perspective-1"],[1,"perspective-title"],[1,"perspective-sub"],[1,"perspective-card","perspective-2"],["routerLink","/register"],["routerLink","/login"]],template:function(i,r){i&1&&(D(0,"header",5,0)(2,"div",6),xt(3,"canvas",7,1),V(),D(5,"div",8,2)(7,"div",9),xt(8,"img",10),V(),D(9,"div",11),Xt(10,hr,2,0,"button",12)(11,lr,4,0),V()(),D(12,"div",13,3)(14,"h2",14),G(15,"ASIA'S LARGEST"),V(),D(16,"p",15),G(17,"ENTREPRENEURIAL CONCLAVE"),V()(),D(18,"div",16,4)(20,"p",15),G(21,"REACH THE"),V(),D(22,"h2",14),G(23,"PERIHELION OF ENDEAVOUR"),V()()()),i&2&&(Ut(10),Bt(r.isLoggedIn?10:11))},
  dependencies:[Gt,Ht],styles:['[_nghost-%COMP%]{--bg: #000;
  --fg: #fff;
  display:block;
  width:100%}.header[_ngcontent-%COMP%]{display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  height:100vh;
  min-height:100svh;
  width:100vw;
  position:relative;
  top:0;
  left:0;
  background-color:#010101;
  overflow:hidden;
  box-sizing:border-box;
  -webkit-user-select:none;
  user-select:none}.header[_ngcontent-%COMP%]   .canvas-container[_ngcontent-%COMP%]{position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:1;
  pointer-events:all;
  cursor:grab}.header[_ngcontent-%COMP%]   .canvas-container[_ngcontent-%COMP%]:active{cursor:grabbing}.header[_ngcontent-%COMP%]   .canvas-container[_ngcontent-%COMP%]   .hero-canvas[_ngcontent-%COMP%]{width:100%;
  height:100%;
  display:block}.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]{position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:5;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  pointer-events:none;
  will-change:transform,opacity}.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{padding:10px;
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative}.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:820px;
  height:auto;
  max-width:85vw;
  filter:drop-shadow(0 10px 40px rgba(0,0,0,.8));
  animation:_ngcontent-%COMP%_cinematicReveal 1.8s cubic-bezier(.16,1,.3,1) .8s both}@media (max-width: 1200px){.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:700px}}@media (max-width: 992px){.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:80vw}}@media (max-width: 768px){.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:88vw}}@media (max-width: 480px){.header[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:92vw}}.header[_ngcontent-%COMP%]   .hero-content[_ngconte