import React from 'react';
import { useToolStore } from '../../stores/toolStore';
import type { ToolbarSize } from './ToolButton';

interface BrushSettingsProps {
  size?: ToolbarSize;
  toolbarWidth?: number;
}

function SliderRow({ label, value, display, min, max, onChange, trackClass }: {
  label: string; value: number; display: string; min: number; max: number;
  onChange: (v: number) => void; trackClass?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-[11px] font-semibold text-slate-600 tabular-nums">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${trackClass ?? 'track-accent'}`}
      />
    </div>
  );
}

export default function BrushSettings({ size = 'md' }: BrushSettingsProps) {
  const { brushSize, setBrushSize, opacity, setOpacity, activeTool,
    sprayRadius, setSprayRadius, sprayDensity, setSprayDensity, fontSize, setFontSize } = useToolStore();

  return (
    <div className="px-3 py-3 space-y-3">
      {activeTool !== 'text' && activeTool !== 'eyedropper' && activeTool !== 'paintBucket' && (
        <SliderRow label="Size" value={brushSize} display={`${brushSize}px`} min={1} max={40} onChange={setBrushSize} trackClass="track-accent" />
      )}
      {activeTool !== 'eyedropper' && activeTool !== 'rainbowBrush' && (
        <SliderRow label="Opacity" value={Math.round(opacity * 100)} display={`${Math.round(opacity * 100)}%`} min={10} max={100} onChange={(v) => setOpacity(v / 100)} trackClass="track-pink" />
      )}
      {activeTool === 'sprayPaint' && (
        <>
          <SliderRow label="Radius" value={sprayRadius} display={`${sprayRadius}`} min={5} max={60} onChange={setSprayRadius} trackClass="track-orange" />
          <SliderRow label="Density" value={sprayDensity} display={`${sprayDensity}`} min={5} max={80} onChange={setSprayDensity} trackClass="track-orange" />
        </>
      )}
      {activeTool === 'text' && (
        <SliderRow label="Font Size" value={fontSize} display={`${fontSize}px`} min={12} max={72} onChange={setFontSize} trackClass="track-teal" />
      )}
    </div>
  );
}
