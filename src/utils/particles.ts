import type { SprayStyle } from '../stores/toolStore';

export interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx?: number;
  vy?: number;
  life?: number;
  type?: 'normal' | 'neonHalo' | 'neonCenter' | 'confettiRect' | 'drip' | 'stampChar';
  width?: number;
  height?: number;
  rotation?: number;
  char?: string;
}

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToString(h: number, s: number, l: number): string {
  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

function brightenColor(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  return hslToString(h, Math.min(100, s + 20), Math.min(90, l + 25));
}

function tintOrShade(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  const offset = (Math.random() - 0.5) * 40;
  return hslToString((h + (Math.random() - 0.5) * 30 + 360) % 360, Math.min(100, s), Math.max(10, Math.min(90, l + offset)));
}

export function generateStyledSprayParticles(
  cx: number,
  cy: number,
  radius: number,
  density: number,
  color: string,
  style: SprayStyle
): Particle[] {
  switch (style) {
    case 'mist': return generateMistParticles(cx, cy, radius, density, color);
    case 'splatter': return generateSplatterParticles(cx, cy, radius, density, color);
    case 'fan': return generateFanParticles(cx, cy, radius, density, color);
    case 'drip': return generateDripParticles(cx, cy, radius, density, color);
    case 'neon': return generateNeonParticles(cx, cy, radius, density, color);
    case 'confetti': return generateConfettiParticles(cx, cy, radius, density, color);
    case 'stamps': return generateStampParticles(cx, cy, radius, density, color);
    default: return generateMistParticles(cx, cy, radius, density, color);
  }
}

function generateMistParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: 0.5 + Math.random() * 1.5,
      color,
      opacity: 0.3 + Math.random() * 0.7,
    });
  }
  return particles;
}

function generateSplatterParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  const count = Math.ceil(density * 0.6);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 1.3;
    const isBlob = Math.random() < 0.15;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: isBlob ? 4 + Math.random() * 6 : 1.5 + Math.random() * 3,
      color,
      opacity: 0.5 + Math.random() * 0.5,
    });
  }
  return particles;
}

function generateFanParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < density; i++) {
    const spreadX = (Math.random() - 0.5) * radius * 2.5;
    const spreadY = (Math.random() - 0.5) * radius * 0.6;
    particles.push({
      x: cx + spreadX,
      y: cy + spreadY,
      size: 0.8 + Math.random() * 2,
      color,
      opacity: 0.3 + Math.random() * 0.6,
    });
  }
  return particles;
}

function generateDripParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  const baseCount = Math.ceil(density * 0.7);
  for (let i = 0; i < baseCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    particles.push({
      x: px,
      y: py,
      size: 1.5 + Math.random() * 2.5,
      color,
      opacity: 0.5 + Math.random() * 0.5,
    });
    if (Math.random() < 0.3) {
      const dripLen = 5 + Math.random() * 15;
      for (let d = 0; d < 3; d++) {
        particles.push({
          x: px + (Math.random() - 0.5) * 1.5,
          y: py + (dripLen / 3) * (d + 1),
          size: 1 + Math.random() * 1.5,
          color,
          opacity: 0.4 + Math.random() * 0.4,
          type: 'drip',
        });
      }
    }
  }
  return particles;
}

function generateNeonParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  const bright = brightenColor(color);
  const count = Math.ceil(density * 0.5);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    particles.push({
      x: px,
      y: py,
      size: 4 + Math.random() * 4,
      color: bright,
      opacity: 0.12 + Math.random() * 0.1,
      type: 'neonHalo',
    });
    particles.push({
      x: px,
      y: py,
      size: 1 + Math.random() * 1.5,
      color: bright,
      opacity: 0.8 + Math.random() * 0.2,
      type: 'neonCenter',
    });
  }
  return particles;
}

function generateConfettiParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: 1.5 + Math.random() * 2,
      color: tintOrShade(color),
      opacity: 0.6 + Math.random() * 0.4,
      type: 'confettiRect',
      width: 2 + Math.random() * 4,
      height: 1 + Math.random() * 2,
      rotation: Math.random() * 360,
    });
  }
  return particles;
}

const STAMP_CHARS = ['★', '♥', '♦', '♣', '♠', '●', '■', '▲', '✿', '♪', '✦', '◆', '☀', '✖', '◉', '❖'];

function generateStampParticles(cx: number, cy: number, radius: number, density: number, color: string): Particle[] {
  const particles: Particle[] = [];
  const count = Math.ceil(density * 0.4);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: 6 + Math.random() * 10,
      color: Math.random() < 0.7 ? color : tintOrShade(color),
      opacity: 0.6 + Math.random() * 0.4,
      type: 'stampChar',
      char: STAMP_CHARS[Math.floor(Math.random() * STAMP_CHARS.length)],
      rotation: Math.random() * 360,
    });
  }
  return particles;
}

export function generateSprayParticles(
  cx: number,
  cy: number,
  radius: number,
  density: number,
  color: string,
  minSize: number = 1,
  maxSize: number = 3
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < density; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const size = minSize + Math.random() * (maxSize - minSize);
    const opacity = 0.3 + Math.random() * 0.7;
    particles.push({ x, y, size, color, opacity });
  }
  return particles;
}

export function generateGlitterParticles(
  cx: number,
  cy: number,
  spread: number,
  color: string
): Particle[] {
  const particles: Particle[] = [];
  const glitterColors = [color, '#FFD700', '#FFFFFF', '#FFF8DC', color];
  for (let i = 0; i < 5; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * spread;
    particles.push({
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      size: 1 + Math.random() * 3,
      color: glitterColors[Math.floor(Math.random() * glitterColors.length)],
      opacity: 0.5 + Math.random() * 0.5,
    });
  }
  return particles;
}

const RAINBOW_COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
];

export function getRainbowColor(index: number): string {
  return RAINBOW_COLORS[index % RAINBOW_COLORS.length];
}
