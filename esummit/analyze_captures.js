/**
 * analyze_captures.js
 * ---------------------------------------------------------------------------
 * Reads the PNG frames captured from the RECOVERED effect demos and reports the
 * pixel signature of each loader phase, plus ASCII renders so the shapes can be
 * inspected without an image viewer.
 *
 *   node analyze_captures.js
 */
const fs = require('fs'), path = require('path');
const { decodePNG } = require('./png.js');

const CAPS = path.join(__dirname, 'captures');
const RAMP = ' .:-=+*#%@';

function stats(file) {
  const img = decodePNG(file);
  const W = img.w, H = img.h, data = img.data;
  const px = (x, y) => {
    const k = (y * W + x) * 4;
    return [data[k], data[k + 1], data[k + 2], data[k + 3]];
  };
  let lit = 0, blue = 0, maxL = 0, opaque = 0;
  let sx = 0, sy = 0, n = 0;
  let maxPx = null;
  const hue = { white: 0, blue: 0, warm: 0 };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const [r, g, b, a] = px(x, y);
      if (a > 8) opaque++;
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      if (L > 50) {
        lit++; sx += x; sy += y; n++;
        if (b > r + 12) { blue++; hue.blue++; }
        else if (r > b + 12) hue.warm++;
        else hue.white++;
      }
      if (L > maxL) { maxL = L; maxPx = [x, y, r, g, b]; }
    }
  }
  return { W, H, lit, blue, maxL: Math.round(maxL), opaque, hue, maxPx,
           centroid: n ? [Math.round(sx / n), Math.round(sy / n)] : null, px };
}

function ascii(img, cw = 78, ch = 26) {
  const W = img.w, H = img.h, data = img.data;
  const rows = [];
  for (let cy = 0; cy < ch; cy++) {
    let line = '';
    for (let cx = 0; cx < cw; cx++) {
      const x0 = Math.floor(cx * W / cw), x1 = Math.floor((cx + 1) * W / cw);
      const y0 = Math.floor(cy * H / ch), y1 = Math.floor((cy + 1) * H / ch);
      let m = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        const k = (y * W + x) * 4;
        const L = 0.299 * data[k] + 0.587 * data[k + 1] + 0.114 * data[k + 2];
        if (L > m) m = L;
      }
      line += RAMP[Math.min(9, Math.floor(Math.pow(m / 255, 0.55) * 9.99))];
    }
    rows.push(line);
  }
  return rows;
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['grid-mesh.png', 'warp-phase1.png', 'warp-phase2.png', 'warp-phase3.png'];

for (const f of files) {
  const full = path.join(CAPS, f);
  if (!fs.existsSync(full)) { console.log(f + ': MISSING'); continue; }
  const s = stats(full);
  const img = decodePNG(full);
  console.log('\n=== ' + f + ' ===');
  console.log('  size            ' + s.W + 'x' + s.H);
  console.log('  lit px (L>50)   ' + s.lit + '   (' + (100 * s.lit / (s.W * s.H)).toFixed(2) + '% of canvas)');
  console.log('  non-transparent ' + s.opaque);
  console.log('  max luminance   ' + s.maxL + '  at ' + JSON.stringify(s.maxPx));
  console.log('  centroid        ' + JSON.stringify(s.centroid));
  console.log('  hue split       white=' + s.hue.white + ' blue=' + s.hue.blue + ' warm=' + s.hue.warm);
  console.log('  ASCII:');
  for (const r of ascii(img)) console.log('   |' + r + '|');
}
