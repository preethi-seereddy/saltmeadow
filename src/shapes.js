// Little shape library, drawn in a 100x100 box and filled with currentColor.

function circlesOnRing(count, ringRadius, r, offsetDeg = -90) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const a = ((offsetDeg + (360 / count) * i) * Math.PI) / 180;
    const cx = (50 + ringRadius * Math.cos(a)).toFixed(2);
    const cy = (50 + ringRadius * Math.sin(a)).toFixed(2);
    out += `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
  return out;
}

function star(points, outer, inner) {
  const pts = [];
  for (let i = 0; i < points * 2; i++) {
    const rad = i % 2 === 0 ? outer : inner;
    const a = ((-90 + (180 / points) * i) * Math.PI) / 180;
    pts.push(`${(50 + rad * Math.cos(a)).toFixed(2)},${(50 + rad * Math.sin(a)).toFixed(2)}`);
  }
  return `<polygon points="${pts.join(' ')}" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/>`;
}

const SHAPES = {
  circle: '<circle cx="50" cy="50" r="46"/>',
  flower: circlesOnRing(5, 27, 21) + '<circle cx="50" cy="50" r="22"/>',
  scallop: circlesOnRing(12, 36, 12) + '<circle cx="50" cy="50" r="38"/>',
  clover: '<circle cx="50" cy="30" r="22"/><circle cx="29" cy="64" r="22"/><circle cx="71" cy="64" r="22"/><circle cx="50" cy="52" r="16"/>',
  blob: '<circle cx="33" cy="33" r="22"/><circle cx="67" cy="33" r="22"/><circle cx="33" cy="67" r="22"/><circle cx="67" cy="67" r="22"/><circle cx="50" cy="50" r="22"/>',
  burst: star(12, 44, 33),
  sparkle: '<path d="M50 4 C54 38 62 46 96 50 C62 54 54 62 50 96 C46 62 38 54 4 50 C38 46 46 38 50 4Z"/>',
  arch: '<path d="M14 98 V46 A36 36 0 0 1 86 46 V98 Z"/>',
  pill: '<rect x="26" y="4" width="48" height="92" rx="24"/>',
  quarter: '<path d="M8 92 V8 A84 84 0 0 1 92 92 Z"/>',
  diamond: '<rect x="21" y="21" width="58" height="58" rx="14" transform="rotate(45 50 50)"/>',
  square: '<rect x="8" y="8" width="84" height="84" rx="12"/>',
};

function sprite() {
  const symbols = Object.entries(SHAPES)
    .map(([name, body]) => `<symbol id="s-${name}" viewBox="0 0 100 100">${body}</symbol>`)
    .join('');
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true">${symbols}</svg>`;
}

function shape(name, cls = '', color = '') {
  const style = color ? ` style="color:${color}"` : '';
  return `<svg class="shape ${cls}" data-shape="${name}"${style} aria-hidden="true"><use href="#s-${name}"/></svg>`;
}

module.exports = { sprite, shape, SHAPES };
