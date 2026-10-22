# E-Summit 2026 (ecell.in/esummit) — Background Effect Reverse Engineering

Target: `https://www.ecell.in/esummit/`
Stack: Angular 17+ SPA, Critters-optimized build, esbuild-style chunk names `chunk-<HASH>.js`.
Corpus: `main.js` (eager, 60 KB) + `index.html` (inline GLSL + LD+JSON) + **111** lazy chunks + `styles.css`.

Recovered sources: `recovered/*.component.js`

---

## 0. Route / component map

| Route | Component | Chunk |
|---|---|---|
| `/esummit/` | `app-landing` | `chunk-2XSY6DAZ.js` (259 KB) |
| `/esummit/` (hero) | `app-hero` | `chunk-UXY565XE.js` (76 KB) |
| `/esummit/` (loader) | `app-loading-screen` | `chunk-2XSY6DAZ.js` |
| `/esummit/events` | `app-events-page` | `chunk-5BLIUTTA.js` |
| `/esummit/events` (bg) | `app-gravity-bg` | `chunk-AXVDNMKI.js` |
| `/esummit/events` (cards) | `app-event-card` | `chunk-TPT6DXCZ.js` |
| **every page** (nav overlay) | `app-reactor-core` | **`main.js` (eager, not a lazy chunk)** |

**Definitive page paint inventory** (from `document.getAnimations()` + `querySelectorAll('canvas')`):

* `/esummit/events` → **exactly one canvas**: `canvas.gravity-canvas` (`position:fixed; z-index:-1`).
  No WebGL anywhere on the events route.
* `/esummit/` → three canvases: `hero-canvas` (WebGL2), `particle-canvas` (2D/p5), `fifth-avenue-canvas` (WebGL).

---

## 1. "SPEED LIGHTNING" → `app-loading-screen` (warp-speed hyperspace intro)

**File:** `chunks/chunk-2XSY6DAZ.js` · **Mounted:** first child of `app-landing` → **only on `/esummit/`**
**Runtime proof:** live `canvas.warp-canvas` captured — 1000×700, **30 637 lit px, 100 % pure white**,
centroid `(510, 317)` (= canvas vanishing point), bbox = full frame.

### 1.1 Gate — when it actually plays

```js
// app-landing
if (this.router.getCurrentNavigation()?.previousNavigation) return false;   // no client-side nav
let n = performance.getEntriesByType("navigation");
return (n[0].type === "reload" || sessionStorage.getItem("esummit-loading-shown"))
       ? false
       : (sessionStorage.setItem("esummit-loading-shown", "true"), true);
```

⇒ **once per browser session, on a hard (non-reload) navigation.** Skipped on refresh and on in-SPA routing.
(Verified: clearing `sessionStorage` + `location.replace('/esummit/')` re-armed it; a `location.reload()` did not.)

### 1.2 Structure

```
.loading-screen
  .zoom-container
    canvas.warp-canvas      (2D, alpha:true, full viewport)
    img.opening-image       (images/backgrounds/opening.png, fade+zoom)
```

Timings: `PHASE1_DURATION=1000`, `PHASE2_DURATION=1000`, `PHASE3_DURATION=2000` → **4 s total**, then
`.loading-screen.fade-out` (800 ms) → `loadingComplete` → `app-landing.onLoadingComplete()`.

### 1.3 PHASE 1 (0–1000 ms) — hyperspace star streaks

* **800 stars.** Init: `x = rand*W*2 - W`, `y = rand*H*2 - H`, `z = rand*W`, `pz = rand*W`,
  `angle = atan2(y,x)`, `dist = hypot(x,y)`.
* Speed `C` starts at **5** and steps **+1.5 per frame** up to **45**.
* Per frame: `z -= C`; when `z <= 0` the star is respawned at the edges with `z = W`, `pz = W`.
* Projection: `A = x/z*W + W/2`, `I = y/z*H + C` → the `+C` is the streak length.
  Previous frame position uses `pz` → a motion line is drawn from `(prev) → (now)`.
* `lineWidth = max(0.5, (1 - z/W) * 3)` → nearer stars are thicker.
* `strokeStyle = "white"`.
* Trail persistence: each frame `fillStyle = "rgba(0,0,0,0.3)"; fillRect(0,0,W,H)` — a 30 %-black wash
  over the previous frame, so the star lines leave decaying trails.

### 1.4 PHASE 2 (1000–2000 ms) — deceleration + spiral

* `C = max(2, 45 - U*43)` where `U = elapsed/PHASE2` → speed decays 45 → 2.
* **Swirl:** `angle += S * (1000 / max(100, dist))` with `S = U * 0.15` → near stars spin faster,
  the field curls into a vortex.
* `strokeStyle = "rgba(200, 220, 255, 1)"` (white → ice blue), `globalAlpha = max(0, 1 - U*0.5)`.
* At `U > 0.5` the `opening.png` gains `.visible` (opacity 0→1, scale 1.5→1 over 1 s / 2.5 s ease-out).

### 1.5 PHASE 3 (2000–4000 ms) — **the lightning bolt / comet** ★

`ctx.clearRect` then `drawDynamicComet(ctx, W/2, H/2, W, H, U)` every frame.

**Path** — one cubic Bézier, control points relative to the screen centre:

| P0 (tail start) | P1 | P2 | P3 (end) |
|---|---|---|---|
| `(-0.80W, +0.80H)` | `(+0.80W, +0.60H)` | `(+0.60W, -0.60H)` | `(+0.25W, -0.05H)` |

**Geometry** — 30 parallel streaks, 7 px apart, 51 points each:

```
Ke  = S + (h - S) * (q/50)          S = max(0, h - 0.45)   // head travels 0→1, tail is 0.45 behind
Je  = Ke ^ 1.15                     // eased path parameter
pos = B(Je)                         // point on the Bézier
st  = max(0, 1 - Je)                // width factor: 1 at the tail → 0 at the head (pinch)
nrm = tangent(Je) + 90°            // perpendicular
off = le * sin(q/50 * π) * st       // leaf/lens lateral spread, zero at both ends
```

**Styling** (this is what produces the "lightning" look):

```js
alpha      = (core ? 1 : 0.6) * (q/50)^1.5 * sin(h*π) * (1 - |J|)
lineWidth  = max(1, 4.5 - 3.5*|J|) * st          // core streaks thickest
shadowColor= rgba(255,255,255,alpha)             // ← the glow
shadowBlur = (core ? 15 : 20) * st
```

**Head** (the bright leading tip):

```js
r1 = 10 * (1 - h^1.15)   fill "#ffffff"            shadowBlur 40
r2 = 45 * (1 - h^1.15)   fill "rgba(255,255,255,0.4)"  shadowBlur 80
globalAlpha = sin(h*π)
```

**Verified by faithful replay** of the extracted math (`h = 0.55`, 1000×700, ASCII luminance ramp):

```
                                                                      ......
                                                                     .:*##*:
                                                                    ..-@@@*:
                                                                    .%@@@*-:
                                                                 .-#@@@%...
                                                              .-=#@@@@+
                                                          .:-=+*#%%@%#-
                                                      .::-=+*#%%%%#=.
                                                  ..::--+*###%%#*=:.
                                              ..::---+**#####**-:.
                                          ..:::--++****##***--:.
                                     ...::::-=+++*******+--::.
                                 ...::::====+++****+++--::.
```

Bright head (`@@@`) on the right, tail widening then tapering to the lower-left — a **glowing
comet / lightning bolt**. `maxLum = 255`, 22 416 lit px at `h = 0.55`.

### 1.6 Bonus: the orange comet trails in the hero (`app-hero`, WebGL2)

`chunks/chunk-UXY565XE.js` — `CylinderEngine`:
* panoramic cylinder built from `img/img1.png … img/img12.png` (12 × 1536²) tiled into a 1024×12288 atlas, `uDarkness: 0.28`, camera `z ≈ 7.2`.
* **18 comet line-strips** (24 segments each) with `aProgress` attribute (0 = tail → 1 = head) and a dedicated fragment shader:

```glsl
precision highp float;
uniform vec3 uColor;        // [1.0, 0.52, 0.12]  (orange)
uniform float uOpacity;
varying float vProgress;
void main() {
  // Glowing fiery head tapering into a smooth fading tail
  vec3 headColor = vec3(1.0, 0.96, 0.85);
  vec3 col   = mix(uColor, headColor, pow(vProgress, 2.6));
  float alpha= uOpacity * (0.05 + 0.95 * pow(vProgress, 1.35));
  gl_FragColor = vec4(col, alpha);
}
```

* **Momentum / speed model** (drag the cylinder to spin it, it keeps spinning):
  `momentum = momentum*0.92 + velocity*0.15`, `speed = |velocity| * 100`,
  opacity target `min(speed*3.5, 0.95)` (idle fallback `0.22`),
  per-trail `speed = 0.85 + (i % 4) * 0.35`,
  base spin `+0.005*speed`, trail advance `velocity * speed * 1.6`.
* Runtime confirmed live: WebGL2 context, **11 distinct shader programs**, continuous `drawArrays`/`drawElements`.

---

## 2. "GRID MESH STRUCTURE"

### 2.1 `app-gravity-bg` — the events-page mesh (the real one)

**File:** `chunks/chunk-AXVDNMKI.js` · full source in `recovered/app-gravity-bg.component.js`
**Host:** `app-gravity-bg` → `<canvas class="gravity-canvas">`, `position:fixed; z-index:-1`, host `background-color:#000`.

```js
spacing = 60
resize():  canvas.width = innerWidth; canvas.height = innerHeight
            cols = floor(W/60)+2 ; rows = floor(H/60)+2
            point(r,c) = { x: c*60, y: r*60, ox: c*60, oy: r*60, vx:0, vy:0 }

animate():
  ctx.fillStyle="black"; fillRect(0,0,W,H)

  for each point i:
      s = mouse.x - i.ox ;  n = mouse.y - i.oy ;  c = hypot(s,n)
      r = 250
      if (c < r) { m = (r-c)/r ;  target = (i.ox + s*m*0.7 , i.oy + n*m*0.7) }   // REPEL
      else        target = (i.ox , i.oy)
      i.vx += (target.x - i.x) * 0.15 ;  i.vy += (target.y - i.y) * 0.15
      i.vx *= 0.65 ;  i.vy *= 0.65
      i.x  += i.vx ;  i.y  += i.vy

  ctx.strokeStyle = "rgba(255,255,255,0.7)" ; ctx.lineWidth = 1
  rows  → one polyline per row  (moveTo(points[r][0]) → lineTo ...)
  cols  → one polyline per col
  ctx.stroke()

  if (mouse.x !== -1e3) {                       // ── MASK
      ctx.globalCompositeOperation = "destination-in"
      g = radialGradient(mouse.x, mouse.y, 0 → 250)
          .addColorStop(0,"rgba(0,0,0,1)") ; .addColorStop(1,"rgba(0,0,0,0)")
      ctx.fillStyle = g ; fillRect(0,0,W,H)
      ctx.globalCompositeOperation = "source-over"
  } else {                                      // ── no cursor
      clearRect(0,0,W,H) ; fillStyle="black" ; fillRect(0,0,W,H)
  }
```

**Key characteristics**

| Property | Value |
|---|---|
| Lattice pitch | **60 px** (both axes) |
| Lattice size | `floor(W/60)+2 × floor(H/60)+2` |
| Spring | `v += (target-pos) * 0.15`, `v *= 0.65` (damped) |
| Cursor influence radius | **250 px** |
| Displacement | `((250-d)/250) * 0.7`, **away from** the cursor (repulsion, not attraction) |
| Stroke | `rgba(255,255,255,0.7)`, `lineWidth = 1` |
| Visibility | `destination-in` radial mask ⇒ **mesh is visible ONLY within 250 px of the cursor**; everything else is erased (the CSS `#000` shows through) |
| Idle (no mouse) | canvas painted solid black — **nothing visible** |

**Runtime proof** (synthetic `mousemove` at 456,335 on an 866×670 canvas, focused tab):

* lit-pixel histogram by radius (50 px bins): `382, 1500, 2109, 2021, 1523, 1385, 516, **0, 0, 0**`
  → **zero lit pixels beyond 300 px** — the mesh is a cursor-following spotlight.
* opaque-pixel histogram by radius: `7825, 23572, 39240, 39089, 34812, 28257, 10665, **0, 0, 0**`
  → the `destination-in` mask also erases the black backing outside the 250 px disc.
* a horizontal scan through the cursor row lights up only the grid lines, and the **column exactly at
  the cursor is fully deflected** (vertical scan = all zeros) — direct evidence of the repulsion.

### 2.2 `app-reactor-core` — the polar/radial wireframe mesh

**File:** `main.js` (**eager bundle**, so it is present on *every* route — it was missing from all 111
lazy chunks, which is why a chunk-name scan missed it). Full source: `recovered/app-reactor-core.component.js`.
**Host:** `NAV.fullscreen-navbar` → `.fullscreen-menu` → `.backdrop` → `app-reactor-core` (inline `<svg viewBox="0 0 1000 1000">`, centre 500,500).
The `.backdrop` is `opacity:0; visibility:hidden` until the hamburger menu opens — but **all 22 of its
CSS animations are running on the events page too** (confirmed via `document.getAnimations()`).

| Layer | Count | Generation | Animation |
|---|---|---|---|
| `bg-support-layer` ellipses | 18 | `rx 200–350`, `ry 80–200`, random rotation, `dasharray "${40–240} ${100–400}"`, colour `#1A0000`/`#993300`, opacity `.1–.25` | `bgDrift0..3` 180/220/150/280 s |
| `bg-support-layer` arcs | 12 | random SVG arc `M … A r r 0 …` | `bgDrift0..3` |
| `radial-trace-layer` spokes | 38 | random angular step 8–22°, length ∈ {150,250,320}, width ∈ {0.5,1,1.5}, colour `#FFB400`/`#FF8A00`/`#993300` | static |
| `satellite-layer` | 48 | ring radius 320–480, r 2–8, type circle/target/partial | `satOrbit` 200 s (idx<28), `satPulse` 4 s (idx≥41) |
| `dominant-orbit` / `secondary-orbit` | 2 | — | `heavyRotation` 38 s / 52 s reverse |
| `orbit-primary` / `orbit-secondary` | 2 | `stroke-dasharray: 400 600`, `#FF8A00`, `softGlow` filter | `orbitDash` 20 s / 28 s |
| `energy-flow` | 2 | `#FFB400`, `dasharray 60 340` | `energyPacket` 2 s / 3 s |
| `inner-ring-layer` | 3 + 1 ring | — | `innerRingSpin` 25 s |
| `nucleus-assembly` | 5 + 8 shutters | shutters at 30/60/90/135/180/225/270/315°, size 8×10 / 6×12 | `shutterTravel` 6 s staggered 2 s; `nucleusJitter` 14 s |
| `gyro-layer` | 2 | — | `gyroSweep1` 12 s / `gyroSweep2` 8 s |

This is a **polar grid**: concentric wireframe rings + radial spokes + a dashed ellipse "support" mesh,
all in the E-Summit orange palette.

---

## 3. Everything else visible on `/esummit/events`

* `h1.page-heading` — orange `linear-gradient` text "EVENTS".
* Event cards (`app-event-card`, `chunk-TPT6DXCZ.js`) — `.solar-flare-container` → `.flare-glow`
  (`glowFloat` 5 s) + `.flare-flame flame-1/2/3` (`floatFlame1..3`, **per-instance random duration
  6.8–9.8 s with negative delays**, orange radial gradients, `mix-blend-mode: screen`, blurred).
* `.transition-sun` — fixed `150vmax` orange radial circle, scales on scroll.
* `.spacebg` — **styled but never rendered** (`spacebg: null` in the DOM).
* `app-reactor-core` SVG in the nav backdrop (hidden until the menu opens).

## 4. Ruled out

* No `lightning` / `bolt` / `zap` / `streak` / `comet` / `meteor` / `plasma` / `thunder` / `electric`
  identifiers anywhere in the 111 chunks (the only two hits for "Thunder" are the CSS font-family
  `"Thunder", Georgia, sans-serif`).
* `/esummit/events` has **no WebGL** — one 2D canvas only. The "speed" effect is therefore the
  landing-page loader, not an events-page element.
* `index.html` embeds two inline GLSL scripts (`#vertexshader`, `#fragmentshader`) — a trivial
  two-pass bloom (base + blur) used by the p5 particle pass, **not** the lightning.
* `chunk-STA66WCU.js` contains the literal "speed" only inside body copy ("challenge their strategy,
  speed, and smarts").

---

## 5. Re-running the recovered code (executable proof)

The recovered sources are *fragments of an Angular bundle*, so they were spliced back into
runnable pages by a small builder that copies the method bodies **verbatim** out of the recovered
files (no re-implementation):

| file | what it does |
|---|---|
| `demo_build.js` | extracts `resize/onMouseMove/onMouseLeave/animate` (grid) and `initAnimation/drawStars/drawDynamicComet` (loader) from `recovered/*.js` by a balanced-brace walk and emits `demo-grid.html` + `demo-warp.html` |
| `serve.js` | static server on `127.0.0.1:8899` **+ a `/save` sink** so the pages can POST their raw canvas back to disk |
| `analyze_captures.js` | decodes the captured PNGs (`png.js`, dependency-free) and prints the pixel signature + ASCII render of each frame |
| `demo-captures.html` | contact sheet of the four captured frames |

```
node demo_build.js
node serve.js                     # background
# open http://127.0.0.1:8899/demo-grid.html
# open http://127.0.0.1:8899/demo-warp.html
node analyze_captures.js
```

### 5.1 Captured frames (rendered by the recovered code)

| frame | lit px (L>50) | max lum | hue | what it proves |
|---|---|---|---|---|
| `grid-mesh.png` | 9 021 (1.37 %) | 255 | 100 % white | lattice renders; only 26 % of the canvas is non-transparent — the `destination-in` radial mask erases the rest |
| `warp-phase1.png` | 15 828 (2.26 %) | 255 | **white 15 828 / blue 0** | phase 1 streaks are pure `white` |
| `warp-phase2.png` | 8 941 (1.28 %) | 196 | **blue 8 082 / white 859** | phase 2 switches to `rgba(200,220,255,1)` and fades via `globalAlpha` |
| `warp-phase3.png` | 45 541 (6.51 %) | 255 @ (966,321) | 100 % white | the comet/bolt; centroid (797,553) |

The ASCII render of `grid-mesh.png` shows the lattice visibly **bulging around the cursor** — the
nodes inside r=250 are pushed away from the pointer, the ones outside are not.

The ASCII render of `warp-phase3.png` shows the comet's streak fan as a broad diagonal wedge
running from the lower-left to the upper-right, with the brightest pixel (the head) at (966,321).

### 5.2 Two behaviours that only the live run exposed

1. **`onMouseLeave()` resets the cursor to `(-1e3, -1e3)`**, which sends the mesh down the *else*
   branch (`clearRect` + opaque black `fillRect`). The grid is therefore **invisible whenever the
   pointer is outside the browser window** — which is why a headless screenshot of the live events
   page shows a black canvas. It is not broken; it is a 250 px spotlight that follows the mouse.
2. **`requestAnimationFrame` is throttled to ~0 in a non-foregrounded window.** The demos therefore
   detect a dead rAF and fall back to a 16 ms timer; the recovered algorithm itself is untouched.
   (`browser.screenshot` additionally requires an OS-visible window.)

### 5.3 Runtime bug found while building the harness

`block(load, 'drawStars(')` matched the **call site** inside `initAnimation`
(`this.drawStars(n,s,C,i,a,A,I,0)`) instead of the method definition, so the extracted body was
garbage and the page threw a parse error. Fixed by matching the full signatures
`drawStars(t,n,i,a,s,h,C,S){` and `drawDynamicComet(t,n,i,a,s,h){`. Worth remembering for any other
minified-bundle surgery.

### 5.4 Toolchain notes

* Chrome allows only **6 concurrent connections per host** — fire-and-forget `fetch()` POSTs from
  the page starve the queue and later frames never arrive. The capture harness therefore posts
  **exactly one frame per phase** and the server replies with `Connection: close`.
* `browser.screenshot` fails with *"Screenshot needs a visible tab"* when the OS window is not in
  the foreground; capturing the canvas from inside the page (`toDataURL` → POST) avoids that
  entirely and is pixel-exact.
