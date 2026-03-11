export interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  vx?: number;
  vy?: number;
  life?: number;
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
