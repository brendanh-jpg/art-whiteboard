import React, { useState } from 'react';
import Konva from 'konva';
import { useCanvasStore } from '../../stores/canvasStore';
import { useToolStore } from '../../stores/toolStore';
import { WALLPAPERS } from '../../utils/wallpapers';
import StickerCategory from '../Stickers/StickerCategory';
import LayerItem from '../Layers/LayerItem';
import type { PanelSize } from '../Stickers/StickerItem';

export type PanelTab = 'stickers' | 'layers' | 'wallpaper' | null;

const STICKER_CATEGORIES: Record<string, Array<{ emoji: string; label: string }>> = {
  'Feelings': [
    { emoji: '😊', label: 'Happy' }, { emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' }, { emoji: '😕', label: 'Confused' }, { emoji: '😤', label: 'Frustrated' },
    { emoji: '🥹', label: 'Proud' }, { emoji: '😨', label: 'Scared' }, { emoji: '🤪', label: 'Silly' },
    { emoji: '😌', label: 'Calm' }, { emoji: '🥰', label: 'Loved' }, { emoji: '😴', label: 'Tired' },
    { emoji: '🤔', label: 'Thoughtful' }, { emoji: '😎', label: 'Confident' }, { emoji: '🥺', label: 'Hopeful' },
    { emoji: '😮', label: 'Surprised' },
  ],
  'Emoji': [
    { emoji: '😀', label: 'Grinning' }, { emoji: '😂', label: 'Laughing' }, { emoji: '🥳', label: 'Party' },
    { emoji: '😍', label: 'Heart Eyes' }, { emoji: '🤩', label: 'Star Eyes' }, { emoji: '😜', label: 'Winking' },
    { emoji: '🤗', label: 'Hugging' }, { emoji: '🫡', label: 'Salute' },
  ],
  'Animals': [
    { emoji: '🐶', label: 'Dog' }, { emoji: '🐱', label: 'Cat' }, { emoji: '🐰', label: 'Bunny' },
    { emoji: '🦊', label: 'Fox' }, { emoji: '🐻', label: 'Bear' }, { emoji: '🦋', label: 'Butterfly' },
    { emoji: '🐢', label: 'Turtle' }, { emoji: '🦄', label: 'Unicorn' },
  ],
  'Food': [
    { emoji: '🍕', label: 'Pizza' }, { emoji: '🍦', label: 'Ice Cream' }, { emoji: '🧁', label: 'Cupcake' },
    { emoji: '🍩', label: 'Donut' }, { emoji: '🍓', label: 'Strawberry' }, { emoji: '🌮', label: 'Taco' },
    { emoji: '🍪', label: 'Cookie' }, { emoji: '🎂', label: 'Cake' },
  ],
  'Nature': [
    { emoji: '🌸', label: 'Cherry Blossom' }, { emoji: '🌈', label: 'Rainbow' }, { emoji: '⭐', label: 'Star' },
    { emoji: '🌙', label: 'Moon' }, { emoji: '☀️', label: 'Sun' }, { emoji: '🔥', label: 'Fire' },
    { emoji: '💧', label: 'Water' }, { emoji: '🍀', label: 'Clover' },
  ],
  'Space': [
    { emoji: '🚀', label: 'Rocket' }, { emoji: '🛸', label: 'UFO' }, { emoji: '👽', label: 'Alien' },
    { emoji: '🌍', label: 'Earth' }, { emoji: '💫', label: 'Dizzy Star' }, { emoji: '🪐', label: 'Planet' },
    { emoji: '☄️', label: 'Comet' }, { emoji: '🌟', label: 'Glowing Star' },
  ],
  'Sports': [
    { emoji: '⚽', label: 'Soccer' }, { emoji: '🏀', label: 'Basketball' }, { emoji: '🎾', label: 'Tennis' },
    { emoji: '🏈', label: 'Football' }, { emoji: '⚾', label: 'Baseball' }, { emoji: '🎯', label: 'Target' },
    { emoji: '🏆', label: 'Trophy' }, { emoji: '🥇', label: 'Gold Medal' },
  ],
  'Music': [
    { emoji: '🎵', label: 'Music Note' }, { emoji: '🎸', label: 'Guitar' }, { emoji: '🥁', label: 'Drum' },
    { emoji: '🎤', label: 'Microphone' }, { emoji: '🎹', label: 'Piano' }, { emoji: '🎷', label: 'Saxophone' },
    { emoji: '🎺', label: 'Trumpet' }, { emoji: '🎶', label: 'Notes' },
  ],
};

interface RightPanelProps {
  activeTab: PanelTab;
  onClose: () => void;
}

/* ─── Wallpaper Preview (CSS-based thumbnail) ─── */
function WallpaperPreview({ wallpaper, isActive }: { wallpaper: typeof WALLPAPERS[number]; isActive: boolean }) {
  const base: React.CSSProperties = {
    width: '100%', aspectRatio: '1', borderRadius: '12px',
    backgroundColor: wallpaper.baseColor, position: 'relative', overflow: 'hidden',
  };
  const overlays: Record<string, React.CSSProperties> = {
    polkaDots: { backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}90 4px, transparent 4px)`, backgroundSize: '16px 16px' },
    checkerboard: { backgroundImage: `linear-gradient(45deg, ${wallpaper.patternColor}22 25%, transparent 25%),linear-gradient(-45deg, ${wallpaper.patternColor}22 25%, transparent 25%),linear-gradient(45deg, transparent 75%, ${wallpaper.patternColor}22 75%),linear-gradient(-45deg, transparent 75%, ${wallpaper.patternColor}22 75%)`, backgroundSize: '12px 12px', backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0' },
    stripes: { backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, ${wallpaper.patternColor}40 5px, ${wallpaper.patternColor}40 10px)` },
    zigzag: { backgroundImage: `linear-gradient(135deg, ${wallpaper.patternColor}60 25%, transparent 25%),linear-gradient(225deg, ${wallpaper.patternColor}60 25%, transparent 25%)`, backgroundSize: '12px 12px' },
    stars: { backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}AA 2px, transparent 2px)`, backgroundSize: '18px 18px' },
    hearts: { backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}80 3px, transparent 3px)`, backgroundSize: '14px 14px' },
    bubbles: { backgroundImage: `radial-gradient(circle, transparent 5px, ${wallpaper.patternColor}30 5px, ${wallpaper.patternColor}30 7px, transparent 7px)`, backgroundSize: '20px 20px' },
    confetti: { backgroundImage: `radial-gradient(circle, #FF572280 2px, transparent 2px),radial-gradient(circle, #9C27B080 2px, transparent 2px),radial-gradient(circle, #2196F380 2px, transparent 2px)`, backgroundSize: '14px 14px, 18px 18px, 10px 10px', backgroundPosition: '0 0, 7px 9px, 3px 5px' },
    waves: { backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${wallpaper.patternColor}30 10px, ${wallpaper.patternColor}30 12px)` },
    diamonds: { backgroundImage: `linear-gradient(45deg, ${wallpaper.patternColor}30 25%, transparent 25%),linear-gradient(-45deg, ${wallpaper.patternColor}30 25%, transparent 25%),linear-gradient(45deg, transparent 75%, ${wallpaper.patternColor}30 75%),linear-gradient(-45deg, transparent 75%, ${wallpaper.patternColor}30 75%)`, backgroundSize: '16px 16px', backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0' },
    retro: { backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}70 4px, transparent 4px),radial-gradient(circle, ${(wallpaper as any).accentColor || wallpaper.patternColor}50 3px, transparent 3px)`, backgroundSize: '20px 20px, 20px 20px', backgroundPosition: '0 0, 10px 10px' },
  };
  const ov = overlays[wallpaper.id];
  return (
    <div style={base}>
      {ov && <div className="absolute inset-0" style={ov} />}
      {isActive && <div className="absolute inset-0 border-3 border-electric-blue rounded-xl" style={{ borderWidth: '3px' }} />}
    </div>
  );
}

/* ─── Main component ─── */
export default function RightPanel({ activeTab, onClose }: RightPanelProps) {
  /* Stickers state */
  const [activeCategory, setActiveCategory] = useState('Feelings');
  const [panelSize, setPanelSize] = useState<PanelSize>('md');

  const { addSticker, activeLayerId, stageScale, stageX, stageY,
    layers, addLayer, removeLayer, setActiveLayer, toggleLayerVisibility, renameLayer,
  } = useCanvasStore();

  const {
    selectedWallpaper, setSelectedWallpaper,
    activeTool, setTool,
    wallpaperBrushSize, setWallpaperBrushSize,
  } = useToolStore();

  const handleStickerSelect = (emoji: string) => {
    const stage = Konva.stages?.[0];
    const stageW = stage?.width() ?? 800;
    const stageH = stage?.height() ?? 600;
    const centerX = (stageW / 2 - stageX) / stageScale;
    const centerY = (stageH / 2 - stageY) / stageScale;
    const x = centerX + (Math.random() - 0.5) * 80;
    const y = centerY + (Math.random() - 0.5) * 80;
    addSticker({
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji, x, y, width: 60, height: 60, rotation: 0, scaleX: 1, scaleY: 1,
      layerId: activeLayerId, isAnimating: true,
    });
  };

  const handleWallpaperSelect = (wpId: string) => {
    setSelectedWallpaper(wpId);
    setTool('wallpaperBrush');
  };

  const categories = Object.keys(STICKER_CATEGORIES);
  const isWallpaperActive = activeTool === 'wallpaperBrush';

  const PANEL_WIDTHS: Record<PanelSize, number> = { sm: 300, md: 380, lg: 500 };
  const panelWidth = activeTab === 'layers' ? 300 : PANEL_WIDTHS[panelSize];

  return (
    <div
      className={`
        fixed top-0 right-0 h-full bg-cream/95 backdrop-blur-sm border-l-4 border-gray-300 shadow-2xl z-30
        transition-all duration-300 ease-out select-none
        ${activeTab ? 'translate-x-0' : 'translate-x-full pointer-events-none'}
      `}
      style={{ width: `${panelWidth}px` }}
    >
      {/* ── Header with tabs ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b-3 border-gray-200 gap-2" style={{ borderBottomWidth: '3px' }}>
        {/* Tabs */}
        <div className="flex gap-1">
          {([
            { id: 'stickers' as const, label: '⭐ Stickers', color: 'hot-pink', border: 'pink-600' },
            { id: 'layers' as const, label: '📑 Layers', color: 'lime', border: 'green-600' },
            { id: 'wallpaper' as const, label: '🧱 Wallpaper', color: 'purple-500', border: 'purple-700' },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                /* If we're on the tab already, close; otherwise the parent handles it via the top-bar buttons.
                   But since this is in-panel, just keep it visible. */
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-display transition-colors cursor-default ${
                activeTab === tab.id
                  ? `bg-${tab.color} text-white border-2 border-${tab.border}`
                  : 'bg-gray-100 text-gray-400 border-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Size toggle (stickers only) */}
          {activeTab === 'stickers' && (
            <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden">
              {(['sm', 'md', 'lg'] as PanelSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setPanelSize(s)}
                  className={`px-2 py-0.5 text-[10px] font-bold font-display cursor-pointer transition-colors ${
                    panelSize === s ? 'bg-electric-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ── Tab content ── */}
      <div className="overflow-y-auto panel-scroll" style={{ maxHeight: 'calc(100vh - 52px)' }}>

        {/* ──────── STICKERS ──────── */}
        {activeTab === 'stickers' && (
          <>
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b-2 border-gray-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border-2 cursor-pointer transition-colors font-display
                    ${activeCategory === cat
                      ? cat === 'Feelings'
                        ? 'bg-hot-pink text-white border-pink-600'
                        : 'bg-electric-blue text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeCategory === 'Feelings' && (
              <div className="mx-3 mt-2 px-3 py-2 bg-pink-50 border-2 border-pink-200 rounded-xl">
                <p className="text-xs font-bold text-pink-600 font-display">
                  How are you feeling today? Drag a sticker onto the canvas!
                </p>
              </div>
            )}

            <StickerCategory
              stickers={STICKER_CATEGORIES[activeCategory]}
              size={panelSize}
              onSelect={handleStickerSelect}
            />
          </>
        )}

        {/* ──────── LAYERS ──────── */}
        {activeTab === 'layers' && (
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-500 font-display uppercase tracking-wider">Layers</p>
              <button
                onClick={addLayer}
                disabled={layers.length >= 5}
                className="px-2.5 py-1 text-xs font-bold font-display rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
              >
                + Add Layer
              </button>
            </div>
            <div className="space-y-1">
              {[...layers].reverse().map((layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  isActive={useCanvasStore.getState().activeLayerId === layer.id}
                  onSelect={() => setActiveLayer(layer.id)}
                  onToggleVisibility={() => toggleLayerVisibility(layer.id)}
                  onRename={(name) => renameLayer(layer.id, name)}
                  onRemove={() => removeLayer(layer.id)}
                  canRemove={layers.length > 1}
                />
              ))}
            </div>
            {layers.length >= 5 && (
              <p className="text-[10px] text-gray-400 font-display text-center">Max 5 layers reached</p>
            )}
          </div>
        )}

        {/* ──────── WALLPAPER ──────── */}
        {activeTab === 'wallpaper' && (
          <div className="p-3 space-y-3">
            <div className="px-3 py-2 bg-purple-50 border-2 border-purple-200 rounded-xl">
              <p className="text-xs font-bold text-purple-600 font-display">
                Pick a pattern, then paint it onto the canvas like a roller!
              </p>
            </div>

            {/* Brush size slider */}
            <div className="px-3 py-2 bg-white border-2 border-gray-200 rounded-xl space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-display">
                Roller Size: {wallpaperBrushSize}px
              </label>
              <input
                type="range"
                min={30}
                max={300}
                value={wallpaperBrushSize}
                onChange={(e) => setWallpaperBrushSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {isWallpaperActive && selectedWallpaper && (
              <div className="px-3 py-2 bg-green-50 border-2 border-green-300 rounded-xl">
                <p className="text-xs font-bold text-green-600 font-display">
                  Roller active — draw on the canvas!
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => handleWallpaperSelect(wp.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedWallpaper === wp.id
                      ? 'border-electric-blue bg-blue-50 scale-105 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow'
                  }`}
                >
                  <WallpaperPreview wallpaper={wp} isActive={selectedWallpaper === wp.id} />
                  <span className="text-[10px] font-bold font-display text-gray-700 leading-tight text-center">
                    {wp.emoji} {wp.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
