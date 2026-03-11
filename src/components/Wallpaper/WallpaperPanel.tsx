import React from 'react';
import { WALLPAPERS } from '../../utils/wallpapers';
import { useToolStore } from '../../stores/toolStore';

interface WallpaperPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

/** CSS-based mini preview for each wallpaper thumbnail. */
function WallpaperPreview({ wallpaper, isActive }: { wallpaper: typeof WALLPAPERS[number]; isActive: boolean }) {
  const previewStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    borderRadius: '12px',
    backgroundColor: wallpaper.baseColor || '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  };

  const getPatternOverlay = (): React.CSSProperties | null => {
    switch (wallpaper.id) {
      case 'polkaDots':
        return {
          backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}90 4px, transparent 4px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 8px 8px',
        };
      case 'checkerboard':
        return {
          backgroundImage: `
            linear-gradient(45deg, ${wallpaper.patternColor}22 25%, transparent 25%),
            linear-gradient(-45deg, ${wallpaper.patternColor}22 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${wallpaper.patternColor}22 75%),
            linear-gradient(-45deg, transparent 75%, ${wallpaper.patternColor}22 75%)
          `,
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 0 6px, 6px -6px, -6px 0',
        };
      case 'stripes':
        return {
          backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 5px, ${wallpaper.patternColor}40 5px, ${wallpaper.patternColor}40 10px)`,
        };
      case 'zigzag':
        return {
          backgroundImage: `
            linear-gradient(135deg, ${wallpaper.patternColor}60 25%, transparent 25%),
            linear-gradient(225deg, ${wallpaper.patternColor}60 25%, transparent 25%)
          `,
          backgroundSize: '12px 12px',
        };
      case 'stars':
        return {
          backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}AA 2px, transparent 2px)`,
          backgroundSize: '18px 18px',
        };
      case 'hearts':
        return {
          backgroundImage: `radial-gradient(circle, ${wallpaper.patternColor}80 3px, transparent 3px)`,
          backgroundSize: '14px 14px',
        };
      case 'bubbles':
        return {
          backgroundImage: `radial-gradient(circle, transparent 5px, ${wallpaper.patternColor}30 5px, ${wallpaper.patternColor}30 7px, transparent 7px)`,
          backgroundSize: '20px 20px',
        };
      case 'confetti':
        return {
          backgroundImage: `
            radial-gradient(circle, #FF572280 2px, transparent 2px),
            radial-gradient(circle, #9C27B080 2px, transparent 2px),
            radial-gradient(circle, #2196F380 2px, transparent 2px)
          `,
          backgroundSize: '14px 14px, 18px 18px, 10px 10px',
          backgroundPosition: '0 0, 7px 9px, 3px 5px',
        };
      case 'waves':
        return {
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 10px, ${wallpaper.patternColor}30 10px, ${wallpaper.patternColor}30 12px)`,
        };
      case 'diamonds':
        return {
          backgroundImage: `
            linear-gradient(45deg, ${wallpaper.patternColor}30 25%, transparent 25%),
            linear-gradient(-45deg, ${wallpaper.patternColor}30 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, ${wallpaper.patternColor}30 75%),
            linear-gradient(-45deg, transparent 75%, ${wallpaper.patternColor}30 75%)
          `,
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0',
        };
      case 'retro':
        return {
          backgroundImage: `
            radial-gradient(circle, ${wallpaper.patternColor}70 4px, transparent 4px),
            radial-gradient(circle, ${wallpaper.accentColor || wallpaper.patternColor}50 3px, transparent 3px)
          `,
          backgroundSize: '20px 20px, 20px 20px',
          backgroundPosition: '0 0, 10px 10px',
        };
      default:
        return null;
    }
  };

  const overlay = getPatternOverlay();

  return (
    <div style={previewStyle}>
      {overlay && <div className="absolute inset-0" style={overlay} />}
      {isActive && (
        <div className="absolute inset-0 border-3 border-electric-blue rounded-xl" style={{ borderWidth: '3px' }} />
      )}
    </div>
  );
}

export default function WallpaperPanel({ isOpen, onClose }: WallpaperPanelProps) {
  const {
    selectedWallpaper, setSelectedWallpaper,
    activeTool, setTool,
    wallpaperBrushSize, setWallpaperBrushSize,
  } = useToolStore();

  const handleSelect = (wpId: string) => {
    setSelectedWallpaper(wpId);
    setTool('wallpaperBrush');
  };

  const isActive = activeTool === 'wallpaperBrush';

  return (
    <div
      className={`
        fixed top-0 right-0 h-full bg-cream/95 backdrop-blur-sm border-l-4 border-gray-300 shadow-2xl z-30
        transition-all duration-300 ease-out select-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      style={{ width: '340px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-3 border-gray-200" style={{ borderBottomWidth: '3px' }}>
        <h2 className="text-xl font-bold text-gray-800 font-display">Wallpapers</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
        >
          ✕
        </button>
      </div>

      {/* Tip */}
      <div className="mx-3 mt-3 px-3 py-2 bg-purple-50 border-2 border-purple-200 rounded-xl">
        <p className="text-xs font-bold text-purple-600 font-display">
          Pick a pattern, then paint it onto the canvas like a roller!
        </p>
      </div>

      {/* Brush size slider */}
      <div className="mx-3 mt-3 px-3 py-2 bg-white border-2 border-gray-200 rounded-xl space-y-1">
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

      {/* Active indicator */}
      {isActive && selectedWallpaper && (
        <div className="mx-3 mt-2 px-3 py-2 bg-green-50 border-2 border-green-300 rounded-xl">
          <p className="text-xs font-bold text-green-600 font-display">
            Roller active — draw on the canvas!
          </p>
        </div>
      )}

      {/* Wallpaper grid */}
      <div className="overflow-y-auto panel-scroll p-3" style={{ maxHeight: 'calc(100vh - 230px)' }}>
        <div className="grid grid-cols-3 gap-3">
          {WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => handleSelect(wp.id)}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-xl border-2 cursor-pointer transition-all
                ${selectedWallpaper === wp.id
                  ? 'border-electric-blue bg-blue-50 scale-105 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-400 hover:shadow'
                }
              `}
            >
              <WallpaperPreview wallpaper={wp} isActive={selectedWallpaper === wp.id} />
              <span className="text-[10px] font-bold font-display text-gray-700 leading-tight text-center">
                {wp.emoji} {wp.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
