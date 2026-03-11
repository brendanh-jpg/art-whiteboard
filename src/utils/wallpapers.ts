export interface WallpaperDef {
  id: string;
  name: string;
  emoji: string;
  baseColor: string;
  patternColor: string;
  accentColor?: string;
  /** Size of one repeating tile in pixels */
  tileSize: number;
}

export const WALLPAPERS: WallpaperDef[] = [
  { id: 'polkaDots', name: 'Polka Dots', emoji: '🔴', baseColor: '#FFE4F0', patternColor: '#FF6B9D', tileSize: 60 },
  { id: 'checkerboard', name: 'Checkerboard', emoji: '♟️', baseColor: '#FFFFFF', patternColor: '#1A1A1A', tileSize: 80 },
  { id: 'stripes', name: 'Candy Stripes', emoji: '🍬', baseColor: '#FFFFFF', patternColor: '#FF4D6D', accentColor: '#FF8FA3', tileSize: 40 },
  { id: 'zigzag', name: 'Zigzag', emoji: '⚡', baseColor: '#FFF3CD', patternColor: '#FF8C00', accentColor: '#FFD700', tileSize: 80 },
  { id: 'stars', name: 'Starry', emoji: '⭐', baseColor: '#1A1147', patternColor: '#FFD700', accentColor: '#FFF8DC', tileSize: 80 },
  { id: 'hearts', name: 'Hearts', emoji: '💖', baseColor: '#FFF0F5', patternColor: '#FF1493', accentColor: '#FF69B4', tileSize: 70 },
  { id: 'bubbles', name: 'Bubbles', emoji: '🫧', baseColor: '#E0F7FA', patternColor: '#00BCD4', accentColor: '#80DEEA', tileSize: 70 },
  { id: 'confetti', name: 'Confetti', emoji: '🎉', baseColor: '#FFFDE7', patternColor: '#FF5722', accentColor: '#9C27B0', tileSize: 120 },
  { id: 'waves', name: 'Groovy Waves', emoji: '🌊', baseColor: '#E8F5E9', patternColor: '#4CAF50', accentColor: '#81C784', tileSize: 100 },
  { id: 'diamonds', name: 'Diamonds', emoji: '💎', baseColor: '#EDE7F6', patternColor: '#7C4DFF', accentColor: '#B388FF', tileSize: 60 },
  { id: 'retro', name: 'Retro Flowers', emoji: '🌼', baseColor: '#FFF8E1', patternColor: '#FF6F00', accentColor: '#F44336', tileSize: 90 },
];

/** Simple seeded random for deterministic confetti. */
function seededRandom(seed: number) {
  let t = (seed + 0x6D2B79F5) | 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Cache of generated tile canvases keyed by wallpaper id. */
const tileCache = new Map<string, HTMLCanvasElement>();

/**
 * Generate (or return cached) an offscreen canvas containing one
 * repeating tile of the wallpaper pattern.
 * This tile is designed to seamlessly repeat via ctx.createPattern('repeat').
 */
export function getWallpaperTile(wallpaperId: string): HTMLCanvasElement | null {
  if (tileCache.has(wallpaperId)) return tileCache.get(wallpaperId)!;

  const wp = WALLPAPERS.find((w) => w.id === wallpaperId);
  if (!wp) return null;

  const s = wp.tileSize;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d')!;

  // Fill with base color
  ctx.fillStyle = wp.baseColor;
  ctx.fillRect(0, 0, s, s);

  switch (wallpaperId) {
    case 'polkaDots': {
      const r = 8;
      ctx.fillStyle = wp.patternColor;
      ctx.globalAlpha = 0.7;
      // Center dot
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, r, 0, Math.PI * 2);
      ctx.fill();
      // Corner dots (shared with neighboring tiles)
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(0, s, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(s, s, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      break;
    }

    case 'checkerboard': {
      const half = s / 2;
      ctx.fillStyle = wp.patternColor;
      ctx.globalAlpha = 0.15;
      ctx.fillRect(half, 0, half, half);
      ctx.fillRect(0, half, half, half);
      ctx.globalAlpha = 1;
      break;
    }

    case 'stripes': {
      const sw = 10;
      ctx.strokeStyle = wp.patternColor;
      ctx.lineWidth = sw;
      ctx.globalAlpha = 0.3;
      // Diagonal stripes — draw extra to cover corners when tiled
      for (let off = -s; off < s * 2; off += sw * 2) {
        ctx.beginPath();
        ctx.moveTo(off, 0);
        ctx.lineTo(off + s, s);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }

    case 'zigzag': {
      const amp = s / 4;
      const mid = s / 2;
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.5;
      // Top zigzag
      ctx.strokeStyle = wp.patternColor;
      ctx.beginPath();
      ctx.moveTo(0, mid - amp);
      ctx.lineTo(s / 4, mid);
      ctx.lineTo(s / 2, mid - amp);
      ctx.lineTo(s * 3 / 4, mid);
      ctx.lineTo(s, mid - amp);
      ctx.stroke();
      // Bottom zigzag
      ctx.strokeStyle = wp.accentColor || wp.patternColor;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.moveTo(0, mid + amp);
      ctx.lineTo(s / 4, mid);
      ctx.lineTo(s / 2, mid + amp);
      ctx.lineTo(s * 3 / 4, mid);
      ctx.lineTo(s, mid + amp);
      ctx.stroke();
      ctx.globalAlpha = 1;
      break;
    }

    case 'stars': {
      ctx.globalAlpha = 0.6;
      const drawStar = (cx: number, cy: number, outerR: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : outerR * 0.4;
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      };
      drawStar(s / 2, s / 2, 12, wp.patternColor);
      drawStar(0, 0, 7, wp.accentColor || wp.patternColor);
      drawStar(s, 0, 7, wp.accentColor || wp.patternColor);
      drawStar(0, s, 7, wp.accentColor || wp.patternColor);
      drawStar(s, s, 7, wp.accentColor || wp.patternColor);
      ctx.globalAlpha = 1;
      break;
    }

    case 'hearts': {
      ctx.globalAlpha = 0.4;
      const drawHeart = (cx: number, cy: number, scale: number, color: string) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, -3);
        ctx.bezierCurveTo(-7, -12, -14, 0, 0, 10);
        ctx.bezierCurveTo(14, 0, 7, -12, 0, -3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
      drawHeart(s / 2, s / 2, 1.2, wp.patternColor);
      drawHeart(0, 0, 0.8, wp.accentColor || wp.patternColor);
      drawHeart(s, 0, 0.8, wp.accentColor || wp.patternColor);
      drawHeart(0, s, 0.8, wp.accentColor || wp.patternColor);
      drawHeart(s, s, 0.8, wp.accentColor || wp.patternColor);
      ctx.globalAlpha = 1;
      break;
    }

    case 'bubbles': {
      ctx.globalAlpha = 0.35;
      const drawBubble = (cx: number, cy: number, r: number, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      };
      drawBubble(s / 2, s / 2, 15, wp.patternColor);
      drawBubble(s * 0.15, s * 0.2, 8, wp.accentColor || wp.patternColor);
      drawBubble(s * 0.85, s * 0.8, 10, wp.accentColor || wp.patternColor);
      ctx.globalAlpha = 1;
      break;
    }

    case 'confetti': {
      const COLORS = ['#FF5722', '#9C27B0', '#2196F3', '#4CAF50', '#FFEB3B', '#FF1493', '#00BCD4'];
      ctx.globalAlpha = 0.55;
      for (let i = 0; i < 30; i++) {
        const rx = seededRandom(i * 3) * s;
        const ry = seededRandom(i * 3 + 1) * s;
        const rr = seededRandom(i * 3 + 2);
        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(rr * Math.PI * 2);
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.fillRect(-4, -2, 6 + rr * 6, 3 + rr * 3);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
      break;
    }

    case 'waves': {
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = wp.patternColor;
      ctx.beginPath();
      for (let x = 0; x <= s; x += 2) {
        ctx.lineTo(x, s * 0.3 + Math.sin((x / s) * Math.PI * 2) * 12);
      }
      ctx.stroke();
      ctx.strokeStyle = wp.accentColor || wp.patternColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= s; x += 2) {
        ctx.lineTo(x, s * 0.7 + Math.sin((x / s) * Math.PI * 2 + 2) * 12);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      break;
    }

    case 'diamonds': {
      ctx.globalAlpha = 0.3;
      const drawDiamond = (cx: number, cy: number, w: number, h: number, color: string) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - h / 2);
        ctx.lineTo(cx + w / 2, cy);
        ctx.lineTo(cx, cy + h / 2);
        ctx.lineTo(cx - w / 2, cy);
        ctx.closePath();
        ctx.fill();
      };
      drawDiamond(s / 2, s / 2, s * 0.5, s * 0.7, wp.patternColor);
      drawDiamond(0, 0, s * 0.4, s * 0.5, wp.accentColor || wp.patternColor);
      drawDiamond(s, 0, s * 0.4, s * 0.5, wp.accentColor || wp.patternColor);
      drawDiamond(0, s, s * 0.4, s * 0.5, wp.accentColor || wp.patternColor);
      drawDiamond(s, s, s * 0.4, s * 0.5, wp.accentColor || wp.patternColor);
      ctx.globalAlpha = 1;
      break;
    }

    case 'retro': {
      ctx.globalAlpha = 0.5;
      const drawFlower = (cx: number, cy: number, petalR: number, color: string) => {
        ctx.fillStyle = color;
        for (let p = 0; p < 6; p++) {
          const angle = (p / 6) * Math.PI * 2;
          ctx.beginPath();
          ctx.arc(cx + Math.cos(angle) * petalR, cy + Math.sin(angle) * petalR, petalR * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#FFEB3B';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
      };
      drawFlower(s / 2, s / 2, 10, wp.patternColor);
      drawFlower(0, 0, 6, wp.accentColor || wp.patternColor);
      drawFlower(s, 0, 6, wp.accentColor || wp.patternColor);
      drawFlower(0, s, 6, wp.accentColor || wp.patternColor);
      drawFlower(s, s, 6, wp.accentColor || wp.patternColor);
      ctx.globalAlpha = 1;
      break;
    }
  }

  tileCache.set(wallpaperId, canvas);
  return canvas;
}

/** Clear the tile cache (e.g. on theme change). */
export function clearTileCache() {
  tileCache.clear();
}
