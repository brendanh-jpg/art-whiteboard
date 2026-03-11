export const CRAYOLA_PALETTE = [
  // Row 1 - Reds & Pinks
  '#ED1C24', '#FF5349', '#FF6961', '#FC74FD', '#FF00CC', '#FF69B4',
  // Row 2 - Oranges & Yellows
  '#FF8C00', '#FFA500', '#FFD700', '#FFFF00', '#FFF44F', '#FDFD96',
  // Row 3 - Greens
  '#00FF00', '#7CFC00', '#32CD32', '#228B22', '#006400', '#00A86B',
  // Row 4 - Blues
  '#00BFFF', '#1E90FF', '#3B82F6', '#0000FF', '#191970', '#4B0082',
  // Row 5 - Purples & Browns
  '#8B5CF6', '#9333EA', '#A855F7', '#C084FC', '#8B4513', '#D2691E',
  // Row 6 - Neutrals
  '#FFFFFF', '#D3D3D3', '#808080', '#404040', '#1A1A1A', '#000000',
];

export const MOOD_PALETTES: Record<string, { name: string; colors: string[] }> = {
  calm: {
    name: 'Calm',
    colors: ['#A8D8EA', '#AA96DA', '#FCBAD3', '#FFFFD2', '#B5EAD7', '#C7CEEA'],
  },
  energized: {
    name: 'Energized',
    colors: ['#FF0000', '#FF8C00', '#FFD700', '#00FF00', '#00BFFF', '#FF00FF'],
  },
  nightVibes: {
    name: 'Night Vibes',
    colors: ['#1E1B4B', '#312E81', '#4C1D95', '#5B21B6', '#6D28D9', '#7C3AED'],
  },
  ocean: {
    name: 'Ocean',
    colors: ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#CAF0F8'],
  },
  sunset: {
    name: 'Sunset',
    colors: ['#FF6B6B', '#FFA07A', '#FFD93D', '#FF8E53', '#FF4E50', '#FC913A'],
  },
};

export const BACKGROUND_PRESETS = [
  { id: 'white', name: 'White', color: '#FFFFFF' },
  { id: 'graphPaper', name: 'Graph Paper', color: '#F0F0FF' },
  { id: 'chalkboard', name: 'Chalkboard', color: '#2D5016' },
  { id: 'corkboard', name: 'Cork Board', color: '#C4956A' },
  { id: 'nightSky', name: 'Night Sky', color: '#0F0A2E' },
  { id: 'tieDye', name: 'Tie-Dye', color: '#FFB6C1' },
];

export function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
