import { create } from 'zustand';

export interface DrawLine {
  id: string;
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
  opacity: number;
  layerId: string;
  particles?: Array<{ x: number; y: number; size: number; color: string; opacity: number }>;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  x?: number;
  y?: number;
  shapeType?: string;
  width?: number;
  height?: number;
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

export interface GalleryItem {
  id: string;
  name: string;
  thumbnail: string;
  timestamp: number;
}

export interface CanvasState {
  canvasWidth: number;
  canvasHeight: number;
  stageScale: number;
  stageX: number;
  stageY: number;
  background: string;

  lines: DrawLine[];
  currentLine: DrawLine | null;
  stickers: StickerObject[];
  selectedStickerId: string | null;

  layers: Layer[];
  activeLayerId: string;

  history: DrawLine[][];
  historyIndex: number;

  gallery: GalleryItem[];

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
  newCanvas: () => void;

  addToGallery: (name: string, thumbnail: string) => void;
  removeFromGallery: (id: string) => void;
  loadFromGallery: (id: string) => void;

  remoteCurrentLines: Map<string, DrawLine>;
  setRemoteCurrentLine: (userId: string, line: DrawLine) => void;
  updateRemoteCurrentLine: (userId: string, lineId: string, points: number[], particles?: DrawLine['particles']) => void;
  removeRemoteCurrentLine: (userId: string) => void;

  addRemoteLine: (line: DrawLine) => void;
  addRemoteSticker: (sticker: StickerObject) => void;
  updateRemoteSticker: (id: string, props: Partial<StickerObject>) => void;
  removeRemoteSticker: (id: string) => void;
}

const LAYER_NAMES = ['Layer Cake 1', 'Secret Layer', 'Doodle Zone', 'Mystery Layer', 'Top Secret'];

let lineIdCounter = 0;
const genLineId = () => `line-${++lineIdCounter}`;

const LS_KEY = 'playspace-canvas';
const LS_GALLERY_KEY = 'playspace-gallery';

function loadCanvasFromStorage(): Partial<CanvasState> | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return {
      lines: data.lines || [],
      stickers: data.stickers || [],
      background: data.background || '#FFFFFF',
      layers: data.layers || [{ id: 'layer-1', name: 'Layer Cake 1', visible: true, locked: false }],
      activeLayerId: data.activeLayerId || 'layer-1',
    };
  } catch {
    return null;
  }
}

function loadGalleryFromStorage(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(LS_GALLERY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveGalleryToStorage(gallery: GalleryItem[]) {
  try {
    localStorage.setItem(LS_GALLERY_KEY, JSON.stringify(gallery));
  } catch {}
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function debouncedSaveCanvas(state: CanvasState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const data = {
        lines: state.lines,
        stickers: state.stickers,
        background: state.background,
        layers: state.layers,
        activeLayerId: state.activeLayerId,
      };
      localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch {}
  }, 500);
}

const saved = loadCanvasFromStorage();
const savedGallery = loadGalleryFromStorage();

export const useCanvasStore = create<CanvasState>((set, get) => ({
  canvasWidth: 3000,
  canvasHeight: 3000,
  stageScale: 1,
  stageX: 0,
  stageY: 0,
  background: saved?.background || '#FFFFFF',

  lines: saved?.lines || [],
  currentLine: null,
  stickers: saved?.stickers || [],
  selectedStickerId: null,

  layers: saved?.layers || [{ id: 'layer-1', name: 'Layer Cake 1', visible: true, locked: false }],
  activeLayerId: saved?.activeLayerId || 'layer-1',

  history: [saved?.lines || []],
  historyIndex: 0,

  gallery: savedGallery,

  remoteCurrentLines: new Map<string, DrawLine>(),

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
      if (newHistory.length > 50) newHistory.shift();
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  clearCanvas: () => {
    const state = get();
    state.pushHistory();
    set({ lines: [], stickers: [], currentLine: null });
  },

  newCanvas: () => {
    set({
      lines: [],
      stickers: [],
      currentLine: null,
      background: '#FFFFFF',
      layers: [{ id: 'layer-1', name: 'Layer Cake 1', visible: true, locked: false }],
      activeLayerId: 'layer-1',
      history: [[]],
      historyIndex: 0,
      selectedStickerId: null,
    });
    try { localStorage.removeItem(LS_KEY); } catch {}
  },

  addToGallery: (name, thumbnail) => {
    const state = get();
    const id = `gallery-${Date.now()}`;
    const newItem: GalleryItem = { id, name, thumbnail, timestamp: Date.now() };
    const newGallery = [...state.gallery, newItem];
    saveGalleryToStorage(newGallery);
    try {
      const saveData = {
        lines: state.lines,
        stickers: state.stickers,
        background: state.background,
        layers: state.layers,
        activeLayerId: state.activeLayerId,
      };
      localStorage.setItem(`playspace-save-${id}`, JSON.stringify(saveData));
    } catch {}
    set({ gallery: newGallery });
  },

  removeFromGallery: (id) =>
    set((state) => {
      const newGallery = state.gallery.filter((g) => g.id !== id);
      saveGalleryToStorage(newGallery);
      return { gallery: newGallery };
    }),

  loadFromGallery: (id) => {
    const state = get();
    const item = state.gallery.find((g) => g.id === id);
    if (!item) return;
    try {
      const raw = localStorage.getItem(`playspace-save-${id}`);
      if (raw) {
        const data = JSON.parse(raw);
        set({
          lines: data.lines || [],
          stickers: data.stickers || [],
          background: data.background || '#FFFFFF',
          layers: data.layers || [{ id: 'layer-1', name: 'Layer Cake 1', visible: true, locked: false }],
          activeLayerId: data.activeLayerId || 'layer-1',
          history: [data.lines || []],
          historyIndex: 0,
          currentLine: null,
          selectedStickerId: null,
        });
      }
    } catch {}
  },

  setRemoteCurrentLine: (userId, line) =>
    set((state) => {
      const newMap = new Map(state.remoteCurrentLines);
      newMap.set(userId, line);
      return { remoteCurrentLines: newMap };
    }),

  updateRemoteCurrentLine: (userId, lineId, points, particles) =>
    set((state) => {
      const existing = state.remoteCurrentLines.get(userId);
      if (!existing || existing.id !== lineId) return {};
      const newMap = new Map(state.remoteCurrentLines);
      newMap.set(userId, { ...existing, points, ...(particles ? { particles } : {}) });
      return { remoteCurrentLines: newMap };
    }),

  removeRemoteCurrentLine: (userId) =>
    set((state) => {
      const newMap = new Map(state.remoteCurrentLines);
      newMap.delete(userId);
      return { remoteCurrentLines: newMap };
    }),

  addRemoteLine: (line) =>
    set((state) => ({
      lines: [...state.lines, line],
    })),

  addRemoteSticker: (sticker) =>
    set((state) => ({
      stickers: [...state.stickers, sticker],
    })),

  updateRemoteSticker: (id, props) =>
    set((state) => ({
      stickers: state.stickers.map((s) => (s.id === id ? { ...s, ...props } : s)),
    })),

  removeRemoteSticker: (id) =>
    set((state) => ({
      stickers: state.stickers.filter((s) => s.id !== id),
      selectedStickerId: state.selectedStickerId === id ? null : state.selectedStickerId,
    })),
}));

useCanvasStore.subscribe((state) => {
  debouncedSaveCanvas(state);
});
