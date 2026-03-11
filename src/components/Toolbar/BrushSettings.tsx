import React from 'react';
import { useToolStore } from '../../stores/toolStore';
import type { ToolbarSize } from './ToolButton';

const LABEL_SIZE: Record<ToolbarSize, string> = {
  sm: 'text-[8px]',
  md: 'text-[10px]',
  lg: 'text-xs',
};

interface BrushSettingsProps {
  size?: ToolbarSize;
  toolbarWidth?: number;
}

export default function BrushSettings({ size = 'md', toolbarWidth = 140 }: BrushSettingsProps) {
  const { brushSize, setBrushSize, opacity, setOpacity, activeTool, sprayRadius, setSprayRadius, sprayDensity, setSprayDensity, fontSize, setFontSize } = useToolStore();

  const labelCls = `${LABEL_SIZE[size]} font-bold text-gray-500 uppercase tracking-wider font-display`;

  return (
    <div className="px-3 py-2 space-y-2">
      {/* Brush size */}
      {activeTool !== 'text' && activeTool !== 'eyedropper' && activeTool !== 'paintBucket' && (
        <div>
          <label className={labelCls}>
            Size: {brushSize}
          </label>
          <input
            type="range"
            min={1}
            max={40}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-electric-blue"
          />
        </div>
      )}

      {/* Opacity */}
      {activeTool !== 'eyedropper' && activeTool !== 'rainbowBrush' && (
        <div>
          <label className={labelCls}>
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min={10}
            max={100}
            value={opacity * 100}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-hot-pink"
          />
        </div>
      )}

      {/* Spray paint settings */}
      {activeTool === 'sprayPaint' && (
        <>
          <div>
            <label className={labelCls}>
              Radius: {sprayRadius}
            </label>
            <input
              type="range"
              min={5}
              max={60}
              value={sprayRadius}
              onChange={(e) => setSprayRadius(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange"
            />
          </div>
          <div>
            <label className={labelCls}>
              Density: {sprayDensity}
            </label>
            <input
              type="range"
              min={5}
              max={80}
              value={sprayDensity}
              onChange={(e) => setSprayDensity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange"
            />
          </div>
        </>
      )}

      {/* Font size for text tool */}
      {activeTool === 'text' && (
        <div>
          <label className={labelCls}>
            Font Size: {fontSize}
          </label>
          <input
            type="range"
            min={12}
            max={72}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-lime"
          />
        </div>
      )}
    </div>
  );
}
