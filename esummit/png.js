const fs = require('fs');
const zlib = require('zlib');

function decodePNG(file) {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a png');
  let off = 8, w = 0, h = 0, bitDepth = 8, colorType = 6, interlace = 0;
  const idat = [];
  let palette = null, trns = null;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      w = data.readUInt32BE(0); h = data.readUInt32BE(4);
      bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'PLTE') palette = data;
    else if (type === 'tRNS') trns = data;
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  if (interlace) throw new Error('interlaced not supported');
  if (bitDepth !== 8) throw new Error('bitDepth ' + bitDepth);
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = w * channels;
  const out = Buffer.alloc(h * stride);
  let pos = 0;
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
    return (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); };
  for (let y = 0; y < h; y++) {
    const ft = raw[pos++];
    const line = raw.subarray(pos, pos + stride); pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? cur[x - channels] : 0;
      const b = prev ? prev[x] : 0;
      const c = (prev && x >= channels) ? prev[x - channels] : 0;
      let v = line[x];
      if (ft === 1) v += a;
      else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) v += paeth(a, b, c);
      cur[x] = v & 0xff;
    }
  }
  // normalise to RGBA
  const rgba = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    let r, g, b, a = 255;
    if (colorType === 6) { r = out[i*4]; g = out[i*4+1]; b = out[i*4+2]; a = out[i*4+3]; }
    else if (colorType === 2) { r = out[i*3]; g = out[i*3+1]; b = out[i*3+2]; }
    else if (colorType === 0) { r = g = b = out[i]; }
    else if (colorType === 4) { r = g = b = out[i*2]; a = out[i*2+1]; }
    else if (colorType === 3) { const p = out[i]; r = palette[p*3]; g = palette[p*3+1]; b = palette[p*3+2]; if (trns && p < trns.length) a = trns[p]; }
    rgba[i*4] = r; rgba[i*4+1] = g; rgba[i*4+2] = b; rgba[i*4+3] = a;
  }
  return { w, h, data: rgba };
}

function analyze(file) {
  const { w, h, data } = decodePNG(file);
  console.log(`\n===== ${file.split(/[\\/]/).pop()}  ${w}x${h} =====`);

  const lum = (x, y) => { const i = (y*w+x)*4; return 0.299*data[i] + 0.587*data[i+1] + 0.114*data[i+2]; };
  const rgb = (x, y) => { const i = (y*w+x)*4; return [data[i], data[i+1], data[i+2]]; };

  // --- colour histogram (quantised) ---
  const hist = new Map();
  for (let i = 0; i < w*h; i++) {
    const r = data[i*4], g = data[i*4+1], b = data[i*4+2];
    const key = `${r>>5},${g>>5},${b>>5}`;
    hist.set(key, (hist.get(key)||0)+1);
  }
  const top = [...hist.entries()].sort((a,b)=>b[1]-a[1]).slice(0,8)
    .map(([k,c]) => { const [r,g,b] = k.split(',').map(n => n*32+16);
      return { rgb: `rgb(${r},${g},${b})`, pct: +(100*c/(w*h)).toFixed(1) }; });
  console.log('top colours:', JSON.stringify(top));

  // --- luminance stats ---
  let sum = 0, maxL = 0, bright = 0, orange = 0, cyan = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const L = lum(x,y); sum += L; if (L > maxL) maxL = L; if (L > 90) bright++;
    const [r,g,b] = rgb(x,y);
    if (r > 120 && r > g + 30 && g > b) orange++;
    if (b > 120 && b > r + 30) cyan++;
  }
  console.log(`mean L=${(sum/(w*h)).toFixed(1)} maxL=${maxL.toFixed(0)} bright(>90)=${(100*bright/(w*h)).toFixed(2)}% orange=${(100*orange/(w*h)).toFixed(2)}% cyan=${(100*cyan/(w*h)).toFixed(2)}%`);

  // --- bright pixel geometry: dominant orientation via PCA ---
  const pts = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (lum(x,y) > 110) pts.push([x,y]);
  if (pts.length > 30) {
    const n = pts.length;
    const mx = pts.reduce((s,p)=>s+p[0],0)/n, my = pts.reduce((s,p)=>s+p[1],0)/n;
    let sxx=0, syy=0, sxy=0;
    for (const [x,y] of pts) { const dx=x-mx, dy=y-my; sxx+=dx*dx; syy+=dy*dy; sxy+=dx*dy; }
    const theta = 0.5 * Math.atan2(2*sxy, sxx-syy);
    const deg = (theta*180/Math.PI + 90) % 180;
    // bounding box of bright pixels
    const xs = pts.map(p=>p[0]), ys = pts.map(p=>p[1]);
    console.log(`bright px n=${n} centroid=(${mx.toFixed(0)},${my.toFixed(0)}) dominantOrientation=${deg.toFixed(1)}deg bbox=[${Math.min(...xs)}..${Math.max(...xs)}]x[${Math.min(...ys)}..${Math.max(...ys)}]`);

    // radial histogram around centroid -> radial "spokes" (mesh) vs streaks
    const spokes = new Array(36).fill(0);
    for (const [x,y] of pts) {
      const a = Math.atan2(y-my, x-mx);
      const k = Math.floor(((a + Math.PI) / (2*Math.PI)) * 36) % 36;
      spokes[k]++;
    }
    const maxSpoke = Math.max(...spokes), meanSpoke = spokes.reduce((a,b)=>a+b,0)/36;
    console.log(`radial angular histogram (36 bins) max=${maxSpoke} mean=${meanSpoke.toFixed(1)} ratio=${(maxSpoke/meanSpoke).toFixed(2)}`);
    console.log('  spokes:', spokes.map(v=>Math.round(v)).join(','));
  } else {
    console.log(`bright px n=${pts.length} (too few for orientation analysis)`);
  }

  // --- row / column periodicity (grid detection) ---
  const rowE = new Array(h).fill(0), colE = new Array(w).fill(0);
  for (let y = 0; y < h; y++) { let s=0; for (let x=0;x<w;x++) s+=lum(x,y); rowE[y]=s/w; }
  for (let x = 0; x < w; x++) { let s=0; for (let y=0;y<h;y++) s+=lum(x,y); colE[x]=s/h; }
  const peaks = (arr, minGap) => {
    const out=[];
    for (let i=1;i<arr.length-1;i++){
      if (arr[i]>arr[i-1] && arr[i]>=arr[i+1] && arr[i] > (arr.reduce((a,b)=>a+b,0)/arr.length)*1.15) {
        if (!out.length || i-out[out.length-1]>=minGap) out.push(i);
      }
    }
    return out;
  };
  const rp = peaks(rowE, 8), cp = peaks(colE, 8);
  console.log(`row peaks (n=${rp.length}):`, rp.slice(0,20).join(','));
  console.log(`col peaks (n=${cp.length}):`, cp.slice(0,20).join(','));

  // --- radial gradient profile: is there a spotlight disc? ---
  if (pts.length) {
    const prof = new Array(10).fill(0); const cnt = new Array(10).fill(0);
    for (const [x,y] of pts) { const r = Math.hypot(x-mx,y-my); const k = Math.min(9, Math.floor(r/40)); prof[k]+=lum(x,y); cnt[k]++; }
    console.log('radial mean-luminance profile (40px bins):', prof.map((v,i)=>cnt[i]?(v/cnt[i]).toFixed(0):'-').join(','));
  }
  return { w, h };
}

if (require.main === module) {
  for (const f of process.argv.slice(2)) {
    try { analyze(f); } catch (e) { console.log('ERR', f, e.message); }
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = { decodePNG };
