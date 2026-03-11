import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useToolStore } from '../../stores/toolStore';
import type { ToolType } from '../../stores/toolStore';
import { useCanvasStore } from '../../stores/canvasStore';
import ToolButton from './ToolButton';
import type { ToolbarSize } from './ToolButton';
import BrushSettings from './BrushSettings';
import ColorPalette from './ColorPalette';
import Modal from '../common/Modal';

const TOOLS: Array<{ id: ToolType; icon: string; label: string; shortcut: string }> = [
  { id: 'pencil', icon: '✏️', label: 'Pencil', shortcut: 'P' },
  { id: 'eraser', icon: '🧹', label: 'Eraser', shortcut: 'E' },
  { id: 'line', icon: '➖', label: 'Line', shortcut: 'L' },
  { id: 'sprayPaint', icon: '🎨', label: 'Spray Paint', shortcut: 'S' },
  { id: 'paintBucket', icon: '🫗', label: 'Paint Bucket', shortcut: 'G' },
  { id: 'shapeStamp', icon: '⭐', label: 'Shape Stamp', shortcut: 'U' },
  { id: 'text', icon: '🅰️', label: 'Text', shortcut: 'T' },
  { id: 'highlighter', icon: '🖍️', label: 'Highlighter', shortcut: 'H' },
  { id: 'glitterPen', icon: '✨', label: 'Glitter Pen', shortcut: 'I' },
  { id: 'rainbowBrush', icon: '🌈', label: 'Rainbow Brush', shortcut: 'R' },
  { id: 'eyedropper', icon: '💧', label: 'Eyedropper', shortcut: 'K' },
  { id: 'pan', icon: '✋', label: 'Pan / Move', shortcut: 'V' },
];

const MIN_WIDTH = 58;
const MAX_WIDTH = 280;

const PRESET_WIDTHS: Record<ToolbarSize, number> = {
  sm: 64,
  md: 136,
  lg: 220,
};

function sizeFromWidth(w: number): ToolbarSize {
  if (w < 100) return 'sm';
  if (w < 175) return 'md';
  return 'lg';
}

export default function Toolbar() {
  const { activeTool, setTool } = useToolStore();
  const { undo, redo, clearCanvas, historyIndex, history } = useCanvasStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toolbarWidth, setToolbarWidth] = useState(PRESET_WIDTHS.lg);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const toolbarSize = sizeFromWidth(toolbarWidth);
  const showLabels = toolbarWidth >= 150;
  const toolsInRow = toolbarWidth >= 168;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.ctrlKey || e.metaKey) return;
      const tool = TOOLS.find((t) => t.shortcut.toLowerCase() === e.key.toLowerCase());
      if (tool) setTool(tool.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = toolbarWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [toolbarWidth]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = e.clientX - dragStartX.current;
      const newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, dragStartWidth.current + delta));
      setToolbarWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const btnBase = 'flex items-center justify-center rounded-lg transition-all duration-150 cursor-pointer font-semibold text-sm';
  const undoSize = toolbarSize === 'sm' ? 'w-7 h-7 text-sm' : 'w-9 h-9 text-base';

  return (
    <>
      <div
        className="relative flex flex-col shrink-0 z-30 overflow-y-auto panel-scroll select-none transition-[width] duration-150"
        style={{
          width: `${toolbarWidth}px`,
          background: '#FFFFFF',
          borderRight: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div className="py-3 px-3 border-b border-slate-200">
          <div className="flex items-center justify-between gap-2">
            {toolbarWidth >= 90 && (
              <h1 className="text-sm font-bold text-slate-800 font-display leading-none tracking-wide">
                {toolbarWidth >= 130 ? 'PlaySpace' : 'PS'}
              </h1>
            )}
            <div className="flex rounded-lg overflow-hidden border border-slate-200 ml-auto">
              {(['sm', 'md', 'lg'] as ToolbarSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setToolbarWidth(PRESET_WIDTHS[s])}
                  className={`px-1.5 py-0.5 text-[8px] font-bold cursor-pointer transition-colors ${
                    toolbarSize === s
                      ? 'bg-accent/20 text-accent'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={`${s.toUpperCase()} toolbar`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`flex ${toolsInRow ? 'flex-row flex-wrap justify-center' : 'flex-col items-center'} gap-1 py-3 px-2`}>
          {TOOLS.map((tool, i) => (
            <div
              key={tool.id}
              className={mounted ? 'toolbar-enter' : ''}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <ToolButton
                icon={tool.icon}
                label={tool.label}
                shortcut={tool.shortcut}
                active={activeTool === tool.id}
                size={toolbarSize}
                showLabel={showLabels && !toolsInRow}
                toolbarWidth={toolbarWidth}
                onClick={() => setTool(tool.id)}
              />
            </div>
          ))}
        </div>

        <div className="mx-3 border-t border-slate-200" />

        <BrushSettings size={toolbarSize} toolbarWidth={toolbarWidth} />

        <div className="mx-3 border-t border-slate-200" />

        <ColorPalette size={toolbarSize} toolbarWidth={toolbarWidth} />

        <div className="mx-3 border-t border-slate-200" />

        <div className={`flex ${toolbarWidth >= 155 ? 'flex-row justify-center' : 'flex-col items-center'} gap-1.5 py-3 px-2`}>
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`${btnBase} ${undoSize} ${
              canUndo
                ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                : 'text-slate-300'
            }`}
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`${btnBase} ${undoSize} ${
              canRedo
                ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                : 'text-slate-300'
            }`}
            title="Redo (Ctrl+Y)"
          >
            ↪
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className={`${btnBase} ${undoSize} text-red-400/60 hover:text-red-500 hover:bg-red-50`}
            title="Clear Canvas"
          >
            🗑
          </button>
        </div>

        <div
          onMouseDown={handleDragStart}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize group z-40"
          title="Drag to resize"
        >
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0.5 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-accent" />
        </div>
      </div>

      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear Canvas?">
        <div className="text-center">
          <div className="text-5xl mb-4">🧹</div>
          <p className="text-slate-500 text-sm mb-6">
            This will erase everything. This action can't be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => { clearCanvas(); setShowClearConfirm(false); }}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-red-500/80 text-white hover:bg-red-500 cursor-pointer transition-all"
            >
              Clear Canvas
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
