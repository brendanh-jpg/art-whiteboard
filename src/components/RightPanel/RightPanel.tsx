import React, { useState } from 'react';
import Konva from 'konva';
import { useCanvasStore } from '../../stores/canvasStore';
import { useToolStore } from '../../stores/toolStore';
import { WALLPAPERS } from '../../utils/wallpapers';
import StickerCategory from '../Stickers/StickerCategory';
import LayerItem from '../Layers/LayerItem';
import type { PanelSize } from '../Stickers/StickerItem';
import { broadcastStickerAdd } from '../../utils/multiplayer';

export type PanelTab = 'stickers' | 'layers' | 'wallpaper' | null;

const STICKER_CATEGORIES: Record<string, Array<{ emoji: string; label: string }>> = {
  'Feelings': [
    { emoji: '😊', label: 'Happy' }, { emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' }, { emoji: '🥹', label: 'Proud' }, { emoji: '😨', label: 'Scared' },
    { emoji: '🤪', label: 'Silly' }, { emoji: '😌', label: 'Calm' }, { emoji: '🥰', label: 'Loved' },
    { emoji: '😴', label: 'Tired' }, { emoji: '🤔', label: 'Thoughtful' }, { emoji: '😎', label: 'Confident' },
  ],
  'Emoji': [
    { emoji: '😀', label: 'Grinning' }, { emoji: '😂', label: 'Laughing' }, { emoji: '🥳', label: 'Party' },
    { emoji: '😍', label: 'Heart Eyes' }, { emoji: '🤩', label: 'Star Eyes' }, { emoji: '😜', label: 'Winking' },
    { emoji: '🤗', label: 'Hugging' }, { emoji: '🫡', label: 'Salute' }, { emoji: '🙄', label: 'Eye Roll' },
    { emoji: '😏', label: 'Smirk' }, { emoji: '🤯', label: 'Mind Blown' }, { emoji: '🥶', label: 'Freezing' },
  ],
  'Animals': [
    { emoji: '🐶', label: 'Dog' }, { emoji: '🐱', label: 'Cat' }, { emoji: '🐰', label: 'Bunny' },
    { emoji: '🦊', label: 'Fox' }, { emoji: '🐻', label: 'Bear' }, { emoji: '🦋', label: 'Butterfly' },
    { emoji: '🐢', label: 'Turtle' }, { emoji: '🦄', label: 'Unicorn' }, { emoji: '🐬', label: 'Dolphin' },
    { emoji: '🦁', label: 'Lion' }, { emoji: '🐧', label: 'Penguin' }, { emoji: '🦉', label: 'Owl' },
  ],
  'Food': [
    { emoji: '🍕', label: 'Pizza' }, { emoji: '🍦', label: 'Ice Cream' }, { emoji: '🧁', label: 'Cupcake' },
    { emoji: '🍩', label: 'Donut' }, { emoji: '🍓', label: 'Strawberry' }, { emoji: '🌮', label: 'Taco' },
    { emoji: '🍪', label: 'Cookie' }, { emoji: '🎂', label: 'Cake' }, { emoji: '🍔', label: 'Burger' },
    { emoji: '🍿', label: 'Popcorn' }, { emoji: '🧋', label: 'Boba Tea' }, { emoji: '🥑', label: 'Avocado' },
  ],
  'Nature': [
    { emoji: '🌸', label: 'Cherry Blossom' }, { emoji: '🌈', label: 'Rainbow' }, { emoji: '⭐', label: 'Star' },
    { emoji: '🌙', label: 'Moon' }, { emoji: '☀️', label: 'Sun' }, { emoji: '🔥', label: 'Fire' },
    { emoji: '💧', label: 'Water' }, { emoji: '🍀', label: 'Clover' }, { emoji: '🌻', label: 'Sunflower' },
    { emoji: '🌊', label: 'Wave' }, { emoji: '🍂', label: 'Fallen Leaf' }, { emoji: '❄️', label: 'Snowflake' },
  ],
  'Space': [
    { emoji: '🚀', label: 'Rocket' }, { emoji: '🛸', label: 'UFO' }, { emoji: '👽', label: 'Alien' },
    { emoji: '🌍', label: 'Earth' }, { emoji: '💫', label: 'Dizzy Star' }, { emoji: '🪐', label: 'Planet' },
    { emoji: '☄️', label: 'Comet' }, { emoji: '🌟', label: 'Glowing Star' }, { emoji: '🔭', label: 'Telescope' },
    { emoji: '👨‍🚀', label: 'Astronaut' },
  ],
  'Sports': [
    { emoji: '⚽', label: 'Soccer' }, { emoji: '🏀', label: 'Basketball' }, { emoji: '🎾', label: 'Tennis' },
    { emoji: '🏈', label: 'Football' }, { emoji: '⚾', label: 'Baseball' }, { emoji: '🎯', label: 'Target' },
    { emoji: '🏆', label: 'Trophy' }, { emoji: '🥇', label: 'Gold Medal' }, { emoji: '🏓', label: 'Ping Pong' },
    { emoji: '🥊', label: 'Boxing' }, { emoji: '🏄', label: 'Surfing' }, { emoji: '⛷️', label: 'Skiing' },
  ],
  'Music': [
    { emoji: '🎵', label: 'Music Note' }, { emoji: '🎸', label: 'Guitar' }, { emoji: '🥁', label: 'Drum' },
    { emoji: '🎤', label: 'Microphone' }, { emoji: '🎹', label: 'Piano' }, { emoji: '🎷', label: 'Saxophone' },
    { emoji: '🎺', label: 'Trumpet' }, { emoji: '🎶', label: 'Notes' }, { emoji: '🎻', label: 'Violin' },
    { emoji: '🎧', label: 'Headphones' },
  ],
  'Travel': [
    { emoji: '✈️', label: 'Airplane' }, { emoji: '🚗', label: 'Car' }, { emoji: '🚂', label: 'Train' },
    { emoji: '⛵', label: 'Sailboat' }, { emoji: '🏖️', label: 'Beach' }, { emoji: '🗽', label: 'Statue of Liberty' },
    { emoji: '🗼', label: 'Tokyo Tower' }, { emoji: '🏔️', label: 'Mountain' }, { emoji: '🌴', label: 'Palm Tree' },
    { emoji: '🧳', label: 'Luggage' },
  ],
  'Weather': [
    { emoji: '🌤️', label: 'Sunny' }, { emoji: '⛈️', label: 'Storm' }, { emoji: '🌧️', label: 'Rain' },
    { emoji: '🌩️', label: 'Lightning' }, { emoji: '🌪️', label: 'Tornado' }, { emoji: '🌫️', label: 'Fog' },
    { emoji: '☁️', label: 'Cloud' }, { emoji: '🌡️', label: 'Thermometer' }, { emoji: '☔', label: 'Umbrella' },
    { emoji: '⛄', label: 'Snowman' },
  ],
  'Flags': [
    { emoji: '🏳️‍🌈', label: 'Rainbow Flag' }, { emoji: '🚩', label: 'Red Flag' }, { emoji: '🏴‍☠️', label: 'Pirate' },
    { emoji: '🏁', label: 'Checkered' }, { emoji: '🎌', label: 'Crossed Flags' }, { emoji: '🏳️', label: 'White Flag' },
    { emoji: '🏴', label: 'Black Flag' }, { emoji: '🇺🇸', label: 'USA' }, { emoji: '🇬🇧', label: 'UK' },
    { emoji: '🇯🇵', label: 'Japan' },
  ],
  'Tech': [
    { emoji: '💻', label: 'Laptop' }, { emoji: '📱', label: 'Phone' }, { emoji: '🖥️', label: 'Desktop' },
    { emoji: '⌨️', label: 'Keyboard' }, { emoji: '🖱️', label: 'Mouse' }, { emoji: '🤖', label: 'Robot' },
    { emoji: '🎮', label: 'Game Controller' }, { emoji: '📷', label: 'Camera' }, { emoji: '💡', label: 'Light Bulb' },
    { emoji: '🔋', label: 'Battery' },
  ],
  'Holidays': [
    { emoji: '🎄', label: 'Christmas Tree' }, { emoji: '🎃', label: 'Pumpkin' }, { emoji: '🎆', label: 'Fireworks' },
    { emoji: '🎁', label: 'Gift' }, { emoji: '🎊', label: 'Confetti' }, { emoji: '🎉', label: 'Party Popper' },
    { emoji: '🧨', label: 'Firecracker' }, { emoji: '🕎', label: 'Menorah' }, { emoji: '🐣', label: 'Baby Chick' },
    { emoji: '💝', label: 'Heart Gift' },
  ],
  'Fantasy': [
    { emoji: '🧙', label: 'Wizard' }, { emoji: '🧚', label: 'Fairy' }, { emoji: '🧛', label: 'Vampire' },
    { emoji: '🧜', label: 'Merperson' }, { emoji: '🐉', label: 'Dragon' }, { emoji: '👻', label: 'Ghost' },
    { emoji: '👹', label: 'Ogre' }, { emoji: '🧞', label: 'Genie' }, { emoji: '🔮', label: 'Crystal Ball' },
    { emoji: '⚔️', label: 'Swords' },
  ],
  'Vehicles': [
    { emoji: '🚒', label: 'Fire Truck' }, { emoji: '🚑', label: 'Ambulance' }, { emoji: '🚁', label: 'Helicopter' },
    { emoji: '🏎️', label: 'Race Car' }, { emoji: '🚲', label: 'Bicycle' }, { emoji: '🛵', label: 'Scooter' },
    { emoji: '🚀', label: 'Rocket' }, { emoji: '🛶', label: 'Canoe' }, { emoji: '🚌', label: 'Bus' },
    { emoji: '🚜', label: 'Tractor' },
  ],
  'Love': [
    { emoji: '❤️', label: 'Red Heart' }, { emoji: '💕', label: 'Two Hearts' }, { emoji: '💖', label: 'Sparkling Heart' },
    { emoji: '💘', label: 'Heart Arrow' }, { emoji: '💗', label: 'Growing Heart' }, { emoji: '💞', label: 'Revolving Hearts' },
    { emoji: '💌', label: 'Love Letter' }, { emoji: '🫶', label: 'Heart Hands' }, { emoji: '💐', label: 'Bouquet' },
    { emoji: '🌹', label: 'Rose' },
  ],
  'Activities': [
    { emoji: '🎨', label: 'Art Palette' }, { emoji: '🧩', label: 'Puzzle' }, { emoji: '🎲', label: 'Dice' },
    { emoji: '♟️', label: 'Chess' }, { emoji: '🪁', label: 'Kite' }, { emoji: '🎭', label: 'Theater' },
    { emoji: '🎪', label: 'Circus' }, { emoji: '🏕️', label: 'Camping' }, { emoji: '🎣', label: 'Fishing' },
    { emoji: '🧗', label: 'Climbing' },
  ],
};

interface RightPanelProps {
  activeTab: PanelTab;
  onClose: () => void;
}

function WallpaperPreview({ wallpaper, isActive }: { wallpaper: typeof WALLPAPERS[number]; isActive: boolean }) {
  const base: React.CSSProperties = {
    width: '100%', aspectRatio: '1', borderRadius: '10px',
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
      {isActive && (
        <div className="absolute inset-0 rounded-[10px]" style={{ border: '2px solid #926B7F', boxShadow: 'inset 0 0 0 1px rgba(146,107,127,0.4)' }} />
      )}
    </div>
  );
}

export default function RightPanel({ activeTab, onClose }: RightPanelProps) {
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
    const sticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji, x, y, width: 60, height: 60, rotation: 0, scaleX: 1, scaleY: 1,
      layerId: activeLayerId, isAnimating: true,
    };
    addSticker(sticker);
    broadcastStickerAdd(sticker);
  };

  const handleWallpaperSelect = (wpId: string) => {
    setSelectedWallpaper(wpId);
    setTool('wallpaperBrush');
  };

  const categories = Object.keys(STICKER_CATEGORIES);
  const isWallpaperActive = activeTool === 'wallpaperBrush';
  const PANEL_WIDTHS: Record<PanelSize, number> = { sm: 280, md: 360, lg: 480 };
  const panelWidth = activeTab === 'layers' ? 280 : PANEL_WIDTHS[panelSize];

  const panelStyle: React.CSSProperties = {
    background: '#FFFFFF',
    borderLeft: '1px solid rgba(0,0,0,0.08)',
  };

  return (
    <div
      className={`
        fixed top-0 right-0 h-full z-30 panel-scroll
        transition-all duration-300 ease-out select-none
        ${activeTab ? 'translate-x-0' : 'translate-x-full pointer-events-none'}
      `}
      style={{ width: `${panelWidth}px`, ...panelStyle }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div className="flex gap-1.5">
          {([
            { id: 'stickers' as const, label: '⭐ Stickers', active: 'bg-pink/20 text-pink border-pink/30' },
            { id: 'layers' as const, label: '📑 Layers', active: 'bg-teal/20 text-teal border-teal/30' },
            { id: 'wallpaper' as const, label: '🧱 Wallpaper', active: 'bg-accent-2/20 text-accent-2 border-accent-2/30' },
          ]).map((tab) => (
            <div
              key={tab.id}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                activeTab === tab.id
                  ? tab.active
                  : 'text-slate-400 border-transparent'
              }`}
            >
              {tab.label}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {activeTab === 'stickers' && (
            <div className="flex rounded-lg overflow-hidden border border-slate-200">
              {(['sm', 'md', 'lg'] as PanelSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setPanelSize(s)}
                  className={`px-2 py-0.5 text-[9px] font-bold cursor-pointer transition-colors ${
                    panelSize === s
                      ? 'bg-accent/20 text-accent'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-all text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="overflow-y-auto panel-scroll" style={{ height: 'calc(100vh - 52px)' }}>

        {activeTab === 'stickers' && (
          <div className="panel-animate">
            <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border cursor-pointer transition-all ${
                    activeCategory === cat
                      ? 'bg-accent/20 text-accent border-accent/40'
                      : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {activeCategory === 'Feelings' && (
              <div className="mx-4 mt-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(146,107,127,0.08)', border: '1px solid rgba(146,107,127,0.2)' }}>
                <p className="text-xs font-semibold text-pink">How are you feeling today? Tap a sticker to add it!</p>
              </div>
            )}

            <StickerCategory
              stickers={STICKER_CATEGORIES[activeCategory]}
              size={panelSize}
              onSelect={handleStickerSelect}
            />
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="p-4 space-y-3 panel-animate">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Layers</span>
              <button
                onClick={addLayer}
                disabled={layers.length >= 5}
                className="px-3 py-1 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-30 cursor-pointer transition-all"
              >
                + Add Layer
              </button>
            </div>
            <div className="space-y-1.5">
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
              <p className="text-[10px] text-slate-400 text-center">Maximum 5 layers</p>
            )}
          </div>
        )}

        {activeTab === 'wallpaper' && (
          <div className="p-4 space-y-4 panel-animate">
            <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(158,121,140,0.08)', border: '1px solid rgba(158,121,140,0.2)' }}>
              <p className="text-xs font-semibold text-accent-2">Pick a pattern, then paint it onto the canvas like a roller!</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Roller Size</span>
                <span className="text-[11px] font-semibold text-slate-600 tabular-nums">{wallpaperBrushSize}px</span>
              </div>
              <input
                type="range" min={30} max={300} value={wallpaperBrushSize}
                onChange={(e) => setWallpaperBrushSize(Number(e.target.value))}
                className="w-full track-accent"
              />
            </div>

            {isWallpaperActive && selectedWallpaper && (
              <div className="px-3 py-2.5 rounded-xl" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <p className="text-xs font-semibold text-teal">Roller active — draw on the canvas!</p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2.5">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => handleWallpaperSelect(wp.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl cursor-pointer transition-all ${
                    selectedWallpaper === wp.id
                      ? 'scale-105 shadow-lg'
                      : 'opacity-75 hover:opacity-100'
                  }`}
                  style={{
                    border: selectedWallpaper === wp.id
                      ? '1px solid rgba(146,107,127,0.5)'
                      : '1px solid rgba(0,0,0,0.06)',
                    background: selectedWallpaper === wp.id
                      ? 'rgba(146,107,127,0.08)'
                      : 'rgba(0,0,0,0.02)',
                  }}
                >
                  <WallpaperPreview wallpaper={wp} isActive={selectedWallpaper === wp.id} />
                  <span className="text-[9px] font-semibold text-slate-500 leading-tight text-center">
                    {wp.name}
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
