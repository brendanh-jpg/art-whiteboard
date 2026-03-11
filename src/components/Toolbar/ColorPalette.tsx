import React, { useState } from 'react';
import { useToolStore } from '../../stores/toolStore';
import { CRAYOLA_PALETTE, MOOD_PALETTES } from '../../utils/colors';
import type { ToolbarSize } from './ToolButton';

interface ColorPaletteProps {
  size?: ToolbarSize;
  toolbarWidth?: number;
}

export default function ColorPalette({ size = 'md', toolbarWidth = 140 }: ColorPaletteProps) {
  const { color, setColor, addRecentColor, recentColors } = useToolStore();
  const [showMoods, setShowMoods] = useState(false);
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleColorSelect = (c: string) => {
    setColor(c);
    addRecentColor(c);
  };

  const displayColors = activeMood ? MOOD_PALETTES[activeMood].colors : CRAYOLA_PALETTE;

  // Dynamically compute swatch size and grid columns from toolbar width
  const padding = 16; // px-2 on each side
  const gap = 4;
  const availableWidth = toolbarWidth - padding;
  const swatchPx = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const cols = Math.max(3, Math.floor((availableWidth + gap) / (swatchPx + gap)));
  const previewPx = size === 'sm' ? 24 : size === 'lg' ? 40 : 32;

  return (
    <div className="px-2 py-2 space-y-2">
      {/* Current color preview */}
      <div className="flex items-center gap-2">
        <div
          className="rounded-lg border-3 border-gray-800 shadow-inner"
          style={{ backgroundColor: color, borderWidth: '3px', width: previewPx, height: previewPx }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => handleColorSelect(e.target.value)}
          className="cursor-pointer rounded border-0"
          style={{ width: previewPx, height: previewPx }}
          title="Custom color"
        />
      </div>

      {/* Mood palette toggle */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => { setShowMoods(!showMoods); setActiveMood(null); }}
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border-2 cursor-pointer transition-colors font-display
            ${showMoods ? 'bg-hot-pink text-white border-pink-600' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}
        >
          Moods
        </button>
        {showMoods && Object.entries(MOOD_PALETTES).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => setActiveMood(activeMood === key ? null : key)}
            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border-2 cursor-pointer transition-colors font-display
              ${activeMood === key ? 'bg-electric-blue text-white border-blue-600' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'}`}
          >
            {palette.name}
          </button>
        ))}
      </div>

      {/* Color grid */}
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {displayColors.map((c) => (
          <button
            key={c}
            onClick={() => handleColorSelect(c)}
            className={`rounded-md cursor-pointer transition-transform hover:scale-110 ${
              color === c ? 'ring-2 ring-gray-800 ring-offset-1 scale-110' : ''
            }`}
            style={{
              backgroundColor: c,
              border: c === '#FFFFFF' ? '2px solid #d1d5db' : '2px solid transparent',
              width: '100%',
              aspectRatio: '1',
            }}
            title={c}
          />
        ))}
      </div>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div>
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-display mb-1">Recent</p>
          <div className="flex gap-1 flex-wrap">
            {recentColors.map((c, i) => (
              <button
                key={`${c}-${i}`}
                onClick={() => handleColorSelect(c)}
                className="w-5 h-5 rounded cursor-pointer transition-transform hover:scale-110"
                style={{ backgroundColor: c, border: '2px solid #d1d5db' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
