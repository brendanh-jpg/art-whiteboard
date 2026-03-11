import { create } from 'zustand';

export type ToolType =
  | 'pencil'
  | 'eraser'
  | 'line'
  | 'sprayPaint'
  | 'paintBucket'
  | 'shapeStamp'
  | 'text'
  | 'highlighter'
  | 'glitterPen'
  | 'rainbowBrush'
  | 'eyedropper'
  | 'pan'
  | 'wallpaperBrush';

export type SprayStyle = 'mist' | 'splatter' | 'fan' | 'drip' | 'neon' | 'confetti' | 'stamps';

export type ShapeType = 'star' | 'heart' | 'lightning' | 'cloud' | 'speechBubble';

export interface ToolState {
  activeTool: ToolType;
  brushSize: number;
  opacity: number;
  color: string;
  recentColors: string[];
  activeShape: ShapeType;
  fontSize: number;
  fontFamily: string;
  sprayRadius: number;
  sprayDensity: number;
  sprayStyle: SprayStyle;
  selectedWallpaper: string | null;
  wallpaperBrushSize: number;
  setTool: (tool: ToolType) => void;
  setBrushSize: (size: number) => void;
  setOpacity: (opacity: number) => void;
  setColor: (color: string) => void;
  addRecentColor: (color: string) => void;
  setActiveShape: (shape: ShapeType) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setSprayRadius: (radius: number) => void;
  setSprayDensity: (density: number) => void;
  setSprayStyle: (style: SprayStyle) => void;
  setSelectedWallpaper: (wp: string | null) => void;
  setWallpaperBrushSize: (size: number) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  activeTool: 'pencil',
  brushSize: 4,
  opacity: 1,
  color: '#000000',
  recentColors: [],
  activeShape: 'star',
  fontSize: 24,
  fontFamily: "'Comic Neue', cursive",
  sprayRadius: 20,
  sprayDensity: 30,
  sprayStyle: 'mist',
  selectedWallpaper: null,
  wallpaperBrushSize: 80,
  setTool: (tool) => set({ activeTool: tool }),
  setBrushSize: (size) => set({ brushSize: size }),
  setOpacity: (opacity) => set({ opacity }),
  setColor: (color) => set({ color }),
  addRecentColor: (color) =>
    set((state) => {
      const filtered = state.recentColors.filter((c) => c !== color);
      return { recentColors: [color, ...filtered].slice(0, 8) };
    }),
  setActiveShape: (shape) => set({ activeShape: shape }),
  setFontSize: (size) => set({ fontSize: size }),
  setFontFamily: (font) => set({ fontFamily: font }),
  setSprayRadius: (radius) => set({ sprayRadius: radius }),
  setSprayDensity: (density) => set({ sprayDensity: density }),
  setSprayStyle: (style) => set({ sprayStyle: style }),
  setSelectedWallpaper: (wp) => set({ selectedWallpaper: wp }),
  setWallpaperBrushSize: (size) => set({ wallpaperBrushSize: size }),
}));
