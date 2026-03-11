import { create } from 'zustand';

export interface DrawLine {
  id: string;
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
  opacity: number;
  layerId: string;
  // For spray paint particles
  particles?: Array<{ x: number; y: number; size: number; color: string; opacity: number }>;
  // For text
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  x?: number;
  y?: number;
  // For shapes
  shapeType?: string;
  width?: number;
  height?: number;
  // For wallpaper brush
  wallpaperId?: string;
}

export interface StickerObject {
  id: string;
  emoji: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  layerId: string;
  isAnimating?: boolean;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

export interface CanvasState {
  // Canvas dimensions and view
  canvasWidth: number;
  canvasHeight: number;
  stageScale: number;
  stageX: number;
  stageY: number;
  background: string;

  // Drawing data
  lines: DrawLine[];
  currentLine: DrawLine | null;
  stickers: StickerObject[];
  selectedStickerId: string | null;

  // Layers
  layers: Layer[];
  activeLayerId: string;

  // Undo/Redo
  history: DrawLine[][];
  historyIndex: number;

  // Gallery
  gallery: Array<{ id: string; thumbnail: string; timestamp: number }>;

  // Actions
  setStageScale: (scale: number) => void;
  setStagePosition: (x: number, y: number) => void;
  setBackground: (bg: string) => void;

  addLine: (line: DrawLine) => void;
  setCurrentLine: (line: DrawLine | null) => void;
  updateCurrentLine: (points: number[], particles?: DrawLine['particles']) => void;

  addSticker: (sticker: StickerObject) => void;
  updateSticker: (id: string, props: Partial<StickerObject>) => void;
  removeSticker: (id: string) => void;
  setSelectedSticker: (id: string | null) => void;

  addLayer: () => void;
  removeLayer: (id: string) => void;
  setActiveLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  renameLayer: (id: string, name: string) => void;
  reorderLayers: (layers: Layer[]) => void;

  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  clearCanvas: () => void;

  addToGallery: (thumbnail: string) => void;
}

const LAYER_NAMES = ['Layer Cake 1', 'Secret Layer', 'Doodle Zone', 'Mystery Layer', 'Top Secret'];

let lineIdCounter = 0;
const genLineId = () => `line-${++lineIdCounter}`;

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasWidth: 3000,
  canvasHeight: 3000,
  stageScale: 1,
  stageX: 0,
  stageY: 0,
  background: '#FFFFFF',

  lines: [],
  currentLine: null,
  stickers: [],
  selectedStickerId: null,

  layers: [{ id: 'layer-1', name: 'Layer Cake 1', visible: true, locked: false }],
  activeLayerId: 'layer-1',

  history: [[]],
  historyIndex: 0,

  gallery: [],

  setStageScale: (scale) => set({ stageScale: scale }),
  setStagePosition: (x, y) => set({ stageX: x, stageY: y }),
  setBackground: (bg) => set({ background: bg }),

  addLine: (line) => {
    const lineWithId = { ...line, id: line.id || genLineId() };
    set((state) => ({ lines: [...state.lines, lineWithId], currentLine: null }));
  },

  setCurrentLine: (line) => set({ currentLine: line }),

  updateCurrentLine: (points, particles) =>
    set((state) => {
      if (!state.currentLine) return {};
      return {
        currentLine: {
          ...state.currentLine,
          points,
          ...(particles ? { particles } : {}),
        },
      };
    }),

  addSticker: (sticker) =>
    set((state) => ({
      stickers: [...state.stickers, sticker],
    })),

  updateSticker: (id, props) =>
    set((state) => ({
      stickers: state.stickers.map((s) => (s.id === id ? { ...s, ...props } : s)),
    })),

  removeSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
      selectedStickerId: state.selectedStickerId === id ? null : state.selectedStickerId,
    })),

  setSelectedSticker: (id) => set({ selectedStickerId: id }),

  addLayer: () =>
    set((state) => {
      if (state.layers.length >= 5) return {};
      const idx = state.layers.length;
      const newLayer: Layer = {
        id: `layer-${Date.now()}`,
        name: LAYER_NAMES[idx] || `Layer ${idx + 1}`,
        visible: true,
        locked: false,
      };
      return {
        layers: [...state.layers, newLayer],
        activeLayerId: newLayer.id,
      };
    }),

  removeLayer: (id) =>
    set((state) => {
      if (state.layers.length <= 1) return {};
      const newLayers = state.layers.filter((l) => l.id !== id);
      return {
        layers: newLayers,
        activeLayerId: state.activeLayerId === id ? newLayers[0].id : state.activeLayerId,
        lines: state.lines.filter((l) => l.layerId !== id),
        stickers: state.stickers.filter((s) => s.layerId !== id),
      };
    }),

  setActiveLayer: (id) => set({ activeLayerId: id }),

  toggleLayerVisibility: (id) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)),
    })),

  renameLayer: (id, name) =>
    set((state) => ({
      layers: state.layers.map((l) => (l.id === id ? { ...l, name } : l)),
    })),

  reorderLayers: (layers) => set({ layers }),

  undo: () =>
    set((state) => {
      if (state.historyIndex <= 0) return {};
      const newIndex = state.historyIndex - 1;
      return { lines: [...state.history[newIndex]], historyIndex: newIndex };
    }),

  redo: () =>
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return {};
      const newIndex = state.historyIndex + 1;
      return { lines: [...state.history[newIndex]], historyIndex: newIndex };
    }),

  pushHistory: () =>
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push([...state.lines]);
      // Keep max 50 history entries
      if (newHistory.length > 50) newHistory.shift();
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  clearCanvas: () => {
    const state = get();
    state.pushHistory();
    set({ lines: [], stickers: [], currentLine: null });
  },

  addToGallery: (thumbnail) =>
    set((state) => ({
      gallery: [
        ...state.gallery,
        { id: `gallery-${Date.now()}`, thumbnail, timestamp: Date.now() },
      ],
    })),
}));
