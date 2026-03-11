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
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleColorSelect = (c: string) => {
    setColor(c);
    addRecentColor(c);
  };

  const displayColors = activeMood ? MOOD_PALETTES[activeMood].colors : CRAYOLA_PALETTE;

  const padding = 24;
  const gap = 4;
  const availableWidth = toolbarWidth - padding;
  const swatchPx = size === 'sm' ? 18 : size === 'lg' ? 28 : 22;
  const cols = Math.max(3, Math.floor((availableWidth + gap) / (swatchPx + gap)));

  return (
    <div className="px-3 py-3 space-y-3">
      {/* Current color + picker */}
      <div className="flex items-center gap-2">
        <div
          className="rounded-lg shadow-inner flex-shrink-0"
          style={{
            backgroundColor: color,
            width: 34, height: 34,
            border: '2px solid rgba(255,255,255,0.15)',
            boxShadow: `0 0 0 1px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
          }}
        />
        <label className="flex-1 relative cursor-pointer group">
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="h-[34px] rounded-lg flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[rgba(255,255,255,0.55)] group-hover:text-[rgba(255,255,255,0.8)] transition-colors border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.04)]">
            <span>✏️</span>
            <span className="font-mono text-[10px]">{color.toUpperCase()}</span>
          </div>
        </label>
      </div>

      {/* Mood palette tabs */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setActiveMood(null)}
          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
            !activeMood
              ? 'bg-accent/30 text-accent border border-accent/40'
              : 'text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
          }`}
        >
          Classic
        </button>
        {Object.entries(MOOD_PALETTES).map(([key, palette]) => (
          <button
            key={key}
            onClick={() => setActiveMood(activeMood === key ? null : key)}
            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-all ${
              activeMood === key
                ? 'bg-pink/30 text-pink border border-pink/40'
                : 'text-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
            }`}
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
            className={`rounded-md cursor-pointer transition-all duration-100 hover:scale-110 hover:z-10 relative ${
              color === c ? 'scale-110 ring-2 ring-white ring-offset-1 ring-offset-[#1E1E2E] z-10' : ''
            }`}
            style={{
              backgroundColor: c,
              width: '100%',
              aspectRatio: '1',
              border: c === '#FFFFFF' ? '1px solid rgba(255,255,255,0.2)' : 'none',
            }}
            title={c}
          />
        ))}
      </div>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[9px] font-semibold text-[rgba(255,255,255,0.28)] uppercase tracking-wider">Recent</p>
          <div className="flex gap-1 flex-wrap">
            {recentColors.map((c, i) => (
              <button
                key={`${c}-${i}`}
                onClick={() => handleColorSelect(c)}
                className={`rounded-md cursor-pointer transition-all hover:scale-110 ${color === c ? 'ring-1 ring-white ring-offset-1 ring-offset-[#1E1E2E]' : ''}`}
                style={{ backgroundColor: c, width: 18, height: 18, border: '1px solid rgba(255,255,255,0.1)' }}
                title={c}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
