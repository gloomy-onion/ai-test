import type { HistoryEntry } from './types';

export const buildMiniChart = (entries: HistoryEntry[]): string => {
  const W = 160;
  const H = 68;
  const P = 8;
  const scores = entries.map((e) => e.score);
  const n = scores.length;
  const mn = Math.max(0, Math.min(...scores) - 10);
  const mx = Math.min(100, Math.max(...scores) + 10);
  const range = mx - mn || 1;
  const pts = scores.map((s, i) => {
    const x = P + (i / (n - 1)) * (W - P * 2);
    const y = H - P - ((s - mn) / range) * (H - P * 2 - 10);

    return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
  });
  const poly = pts.map((p) => p.join(',')).join(' ');
  const area = `${pts[0][0]},${H - P} ${poly} ${pts[n - 1][0]},${H - P}`;
  const [lx, ly] = pts[n - 1];
  const col = scores[n - 1] >= 80 ? '#4ecd7a' : scores[n - 1] >= 55 ? '#f7b32b' : '#ff5c5c';

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="cg${n}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${col}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${col}" stop-opacity="0"/>
    </linearGradient></defs>
    <polygon points="${area}" fill="url(#cg${n})"/>
    <polyline points="${poly}" stroke="${col}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
    <circle cx="${lx}" cy="${ly}" r="3.5" fill="${col}"/>
    <text x="${Math.min(lx + 5, W - 20)}" y="${Math.max(ly - 5, 10)}" font-size="9" fill="${col}" font-family="monospace" font-weight="600">${scores[n - 1]}</text>
    <text x="${P}" y="${H - 1}" font-size="9" fill="#555a70" font-family="monospace">последние ${n}</text>
  </svg>`;
};