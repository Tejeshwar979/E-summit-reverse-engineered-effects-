/**
 * demo_build.js
 * ---------------------------------------------------------------------------
 * Takes the RECOVERED component sources and splices the real method bodies
 * into standalone, runnable HTML pages. Nothing is re-implemented by hand:
 * the physics/geometry code below is byte-for-byte what was recovered from
 * the production bundle.
 *
 *   demo-grid.html  -> app-gravity-bg   (events page grid mesh)
 *   demo-warp.html  -> app-loading-screen (warp speed + lightning comet)
 */
const fs = require('fs'), path = require('path');

const R = (p) => fs.readFileSync(path.join(__dirname, 'recovered', p), 'utf8');

/** Extract a balanced-brace block starting at `marker` (marker includes the '{'). */
function block(src, marker) {
  const i = src.indexOf(marker);
  if (i < 0) throw new Error('marker not found: ' + marker);
  let j = src.indexOf('{', i), depth = 0, inStr = null;
  for (let k = j; k < src.length; k++) {
    const c = src[k];
    if (inStr) { if (c === '\\') { k++; continue; } if (c === inStr) inStr = null; continue; }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(i, k + 1); }
  }
  throw new Error('unbalanced: ' + marker);
}

const grav = R('app-gravity-bg.component.js');
const load = R('app-loading-screen.component.js');

const gPoint   = block(grav, 'h=class{');            // the lattice node class
const gResize  = block(grav, 'resize(){');
const gMove    = block(grav, 'onMouseMove(t){');
const gLeave   = block(grav, 'onMouseLeave(){');
const gAnimate = block(grav, 'animate=()=>{');
const lInit    = block(load, 'initAnimation(){');
// NB: match the method DEFINITIONS, not the call sites inside initAnimation
const lStars   = block(load, 'drawStars(t,n,i,a,s,h,C,S){');
const lComet   = block(load, 'drawDynamicComet(t,n,i,a,s,h){');

console.log('extracted:');
for (const [n, s] of Object.entries({ gPoint, gResize, gMove, gAnimate, lInit, lStars, lComet }))
  console.log('  ' + n.padEnd(10), String(s.length).padStart(5), 'chars');

const shell = (title, body, extraCss = '') => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title><style>
 html,body{margin:0;height:100%;background:#000;overflow:hidden}
 canvas{display:block;width:100vw;height:100vh;background:#000}
 .tag{position:fixed;left:8px;top:8px;z-index:9;color:#FF9E2E;font:12px/1.5 monospace;
      background:rgba(0,0,0,.6);padding:4px 8px;border:1px solid #333}
 ${extraCss}
</style></head>
<body>
${body}
<script>
"use strict";
window.__err = null;
window.addEventListener('error', e => { window.__err = (e.error && e.error.stack) || e.message; });
try {
${extraCss ? '' : ''}
} catch (e) { window.__err = e.stack || String(e); }
window.__ready = true;
</script>
</body></html>`;

/* ------------------------------------------------------------------ grid */
const gridHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>app-gravity-bg (recovered)</title>
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}
canvas{display:block;width:100vw;height:100vh}
.tag{position:fixed;left:8px;top:8px;z-index:9;color:#FF9E2E;font:12px/1.5 monospace;
     background:rgba(0,0,0,.65);padding:4px 8px;border:1px solid #333}</style></head>
<body>
<canvas id="c"></canvas>
<div class="tag">app-gravity-bg &mdash; recovered &middot; 60px lattice &middot; 250px cursor spotlight</div>
<script>
"use strict";
window.__err = null;
window.addEventListener('error', e => { window.__err = (e.error && e.error.stack) || e.message; });
try {
const ${gPoint};
class GravityBg {
  constructor(canvas){
    this.canvasRef = { nativeElement: canvas };
    this.ctx = canvas.getContext("2d");
    this.points = [];
    this.mouse = { x: -1e3, y: -1e3 };
    this.animationFrameId = 0;
    this.cols = 0; this.rows = 0; this.spacing = 60;
    this.resize();
  }
  ${gResize}
  ${gMove}
  ${gLeave}
  ${gAnimate}
}
const grid = new GravityBg(document.getElementById('c'));
// Headless shim: this browser window is not foregrounded, so the real
// requestAnimationFrame gets throttled to ~0. Detect that and fall back to a
// timer. The recovered algorithm itself is untouched.
const _raf = window.requestAnimationFrame.bind(window);
let _n = 0; const _tick = () => { _n++; _raf(_tick); }; _raf(_tick);
setTimeout(() => {
  if (_n < 5) { window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16); window.__rafShim = true; }
  window.__rafFps = _n;
  grid.animate();
}, 400);
// mirror the component's hostBindings (Angular target 'o' === window):
//   "resize" -> resize(), "mousemove" -> onMouseMove($event), "mouseleave" -> onMouseLeave()
window.addEventListener('resize', () => grid.resize());
window.addEventListener('mousemove', e => grid.onMouseMove(e));
window.addEventListener('mouseleave', () => grid.onMouseLeave());
// drive a real cursor path so the spotlight tracks.
// NOTE: the component's own onMouseLeave() resets mouse to -1e3 (that is what
// makes the live site's canvas go black when the pointer leaves the window),
// so the demo calls the recovered handler directly to keep the spotlight on.
let t = 0;
const fire = () => {
  t += 0.02;
  const x = innerWidth/2 + Math.cos(t)*innerWidth*0.22;
  const y = innerHeight/2 + Math.sin(t*1.3)*innerHeight*0.22;
  grid.onMouseMove({ clientX: x, clientY: y });
};
setInterval(fire, 30);
window.__grid = grid;
// capture the steady-state frame once the spring system has settled
setTimeout(() => {
  const cv = document.getElementById('c');
  fetch('/save?name=grid-mesh.png', { method: 'POST', body: cv.toDataURL('image/png') })
    .then(r => r.text())
    .then(t => { window.__posted = t; })
    .catch(e => { window.__fetchErr = String(e); });
}, 2500);
} catch (e) { window.__err = e.stack || String(e); }
window.__ready = true;
</script>
</body></html>`;

/* ------------------------------------------------------------------ warp */
const warpHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>app-loading-screen (recovered)</title>
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}
canvas{display:block;width:100vw;height:100vh}
.tag{position:fixed;left:8px;top:8px;z-index:9;color:#FF9E2E;font:12px/1.5 monospace;
     background:rgba(0,0,0,.65);padding:4px 8px;border:1px solid #333}</style></head>
<body>
<canvas id="c"></canvas>
<div class="tag" id="tag">app-loading-screen &mdash; recovered</div>
<script>
"use strict";
window.__err = null;
window.addEventListener('error', e => { window.__err = (e.error && e.error.stack) || e.message; });
try {
class LoadingScreen {
  constructor(canvas, opts){
    this.canvasRef = { nativeElement: canvas };
    this.loadingScreenRef = { nativeElement: document.createElement('div') };
    this.zoomContainerRef  = { nativeElement: document.createElement('div') };
    this.openingImageRef  = { nativeElement: document.createElement('div') };
    this.isDestroyed = false;
    this.startTime = performance.now();
    this.PHASE1_DURATION = 1e3; this.PHASE2_DURATION = 1e3; this.PHASE3_DURATION = 2e3;
    this.TOTAL_DURATION = this.PHASE1_DURATION + this.PHASE2_DURATION + this.PHASE3_DURATION;
    this.imageFadingIn = false;
    this.ngZone = { runOutsideAngular: f => f(), run: f => f() };
    this.onPhase = opts && opts.onPhase;
  }
  ${lInit.replace(/^initAnimation\(\)\{/, 'start(){')}
  ${lStars}
  ${lComet}
  startFadeOut(){ if (this.onPhase) this.onPhase('fade-out'); }
}
const warp = new LoadingScreen(document.getElementById('c'), {
  onPhase: p => { document.getElementById('tag').textContent = 'app-loading-screen \\u2014 recovered \\u2014 phase: ' + p; }
});
// headless rAF shim (see demo-grid.html)
const _raf2 = window.requestAnimationFrame.bind(window);
let _n2 = 0; const _tick2 = () => { _n2++; _raf2(_tick2); }; _raf2(_tick2);
setTimeout(() => {
  if (_n2 < 5) { window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 16); window.__rafShim = true; }
  window.__rafFps = _n2;
  warp.start();
  // ---- capture harness (test scaffolding, NOT part of the recovered code) ----
  // Grabs the brightest frame of each of the loader's three phases and POSTs
  // the raw canvas to the local capture sink.
  // NOTE: exactly ONE POST per phase. Chrome allows only 6 concurrent
  // connections per host; fire-and-forget POSTs starve the queue and the
  // later phases never arrive.
  const best = { p1: -1, p2: -1, p3: -1 };
  const frames = {};
  const posted = {};
  const post = (p) => {
    if (posted[p] || !frames[p]) return;
    posted[p] = true;
    fetch('/save?name=warp-phase' + p + '.png', { method: 'POST', body: frames[p] })
      .then(r => r.text())
      .then(t => { window.__posted = (window.__posted || []).concat(p + ':' + t); })
      .catch(e => { window.__fetchErr = (window.__fetchErr || '') + ' | ' + e; });
  };
  const grab = () => {
    const cv = document.getElementById('c');
    const ctx = cv.getContext('2d');
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let lit = 0, blue = 0;
    for (let i = 0; i < d.length; i += 4) {
      const L = 0.299*d[i] + 0.587*d[i+1] + 0.114*d[i+2];
      if (L > 50) { lit++; if (d[i+2] > d[i] + 12) blue++; }
    }
    const el = performance.now() - warp.startTime;
    const phase = el < warp.PHASE1_DURATION ? 1
                : el < warp.PHASE1_DURATION + warp.PHASE2_DURATION ? 2
                : el < warp.TOTAL_DURATION ? 3 : 0;
    const score = phase === 2 ? blue : lit;
    if (phase && score > best['p' + phase]) {
      best['p' + phase] = score;
      frames[phase] = cv.toDataURL('image/png');
    }
    // flush a phase's best frame once that phase is over
    if (el >= 1000) post(1);
    if (el >= 2000) post(2);
    if (el >= 4000) post(3);
  };
  const iv = setInterval(grab, 70);
  setTimeout(() => { clearInterval(iv); window.__best = best; }, warp.TOTAL_DURATION + 1500);
}, 400);
window.__warp = warp;
} catch (e) { window.__err = e.stack || String(e); }
window.__ready = true;
</script>
</body></html>`;

fs.writeFileSync(path.join(__dirname, 'demo-grid.html'), gridHtml);
fs.writeFileSync(path.join(__dirname, 'demo-warp.html'), warpHtml);
console.log('\nwrote demo-grid.html (' + gridHtml.length + ') and demo-warp.html (' + warpHtml.length + ')');
