const fs = require('fs'), path = require('path');
const f = process.argv[2] || 'chunk-UXY565XE.js';
let s = fs.readFileSync(path.join(__dirname, 'chunks', f), 'utf8');

// Replace template literals with a marker, but keep shader ones labelled
const shaders = [];
s = s.replace(/`([\s\S]*?)`/g, (m, body) => {
  if (/gl_Position|void\s+main\s*\(/.test(body)) {
    shaders.push(body);
    return '`<<SHADER#' + (shaders.length - 1) + '>>`';
  }
  return '`<<TPL>>`';
});

fs.writeFileSync(path.join(__dirname, 'out_' + f + '.js'), s);
console.log('wrote out_' + f + '.js  (' + s.length + ' chars), ' + shaders.length + ' shaders');
