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
  { id: 'pencil', icon: '\u270F\uFE0F', label: 'Pencil', shortcut: 'P' },
  { id: 'eraser', icon: '\uD83E\uDDF9', label: 'Eraser', shortcut: 'E' },
  { id: 'line', icon: '\u2796', label: 'Line', shortcut: 'L' },
  { id: 'sprayPaint', icon: '\uD83C\uDFA8', label: 'Spray Paint', shortcut: 'S' },
  { id: 'paintBucket', icon: '\uD83E\uDEE3', label: 'Paint Bucket', shortcut: 'G' },
  { id: 'shapeStamp', icon: '\u2B50', label: 'Shape Stamp', shortcut: 'U' },
  { id: 'text', icon: '\uD83C\uDD70\uFE0F', label: 'Text', shortcut: 'T' },
  { id: 'highlighter', icon: '\uD83D\uDD8D\uFE0F', label: 'Highlighter', shortcut: 'H' },
  { id: 'glitterPen', icon: '\u2728', label: 'Glitter Pen', shortcut: 'I' },
  { id: 'rainbowBrush', icon: '\uD83C\uDF08', label: 'Rainbow Brush', shortcut: 'R' },
  { id: 'eyedropper', icon: '\uD83D\uDCA7', label: 'Eyedropper', shortcut: 'K' },
  { id: 'pan', icon: '\u270B', label: 'Pan / Move', shortcut: 'V' },
];

const MIN_WIDTH = 64;
const MAX_WIDTH = 300;

const PRESET_WIDTHS: Record<ToolbarSize, number> = {
  sm: 72,
  md: 140,
  lg: 220,
};

/** Derive a ToolbarSize from the current pixel width for child components. */
function sizeFromWidth(w: number): ToolbarSize {
  if (w < 100) return 'sm';
  if (w < 180) return 'md';
  return 'lg';
}

export default function Toolbar() {
  const { activeTool, setTool } = useToolStore();
  const { undo, redo, clearCanvas, historyIndex, history } = useCanvasStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [toolbarWidth, setToolbarWidth] = useState(PRESET_WIDTHS.md);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(0);

  const toolbarSize = sizeFromWidth(toolbarWidth);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard shortcuts
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

  // Drag-to-resize handlers
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

  const showLabels = toolbarWidth >= 150;
  const toolsInRow = toolbarWidth >= 170;

  const undoBtnSize = toolbarSize === 'sm' ? 'w-8 h-7 text-xs' : toolbarSize === 'lg' ? 'w-14 h-10 text-lg' : 'w-11 h-9 text-sm';

  return (
    <>
      <div
        className="relative flex flex-col shrink-0 bg-cream/95 backdrop-blur-sm border-r-4 border-gray-300 shadow-xl z-30 overflow-y-auto panel-scroll select-none transition-[width] duration-150"
        style={{ width: `${toolbarWidth}px` }}
      >
        {/* Logo + size presets */}
        <div className="py-2 px-2 text-center border-b-3 border-gray-200" style={{ borderBottomWidth: '3px' }}>
          <h1 className={`${toolbarSize === 'sm' ? 'text-xs' : toolbarSize === 'lg' ? 'text-lg' : 'text-sm'} font-bold text-electric-blue font-display leading-tight`}>
            {toolbarWidth >= 120 ? 'PlaySpace' : <>Play<br/>Space</>}
          </h1>
          {/* Size presets */}
          <div className="flex justify-center mt-1.5">
            <div className="flex rounded-md border-2 border-gray-300 overflow-hidden">
              {(['sm', 'md', 'lg'] as ToolbarSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setToolbarWidth(PRESET_WIDTHS[s])}
                  className={`px-1.5 py-0.5 text-[8px] font-bold font-display cursor-pointer transition-colors ${
                    toolbarSize === s
                      ? 'bg-electric-blue text-white'
                      : 'bg-white text-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className={`flex ${toolsInRow ? 'flex-row flex-wrap justify-center' : 'flex-col items-center'} gap-1.5 py-3 px-2`}>
          {TOOLS.map((tool, i) => (
            <div
              key={tool.id}
              className={mounted ? 'toolbar-enter' : ''}
              style={{ animationDelay: `${i * 40}ms` }}
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

        {/* Divider */}
        <div className="mx-3 border-t-2 border-gray-200" />

        {/* Brush settings */}
        <BrushSettings size={toolbarSize} toolbarWidth={toolbarWidth} />

        {/* Divider */}
        <div className="mx-3 border-t-2 border-gray-200" />

        {/* Color palette */}
        <ColorPalette size={toolbarSize} toolbarWidth={toolbarWidth} />

        {/* Divider */}
        <div className="mx-3 border-t-2 border-gray-200" />

        {/* Undo/Redo/Clear */}
        <div className={`flex ${toolbarWidth >= 160 ? 'flex-row justify-center' : 'flex-col items-center'} gap-1.5 py-3 px-2`}>
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className={`${undoBtnSize} flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 disabled:opacity-30 hover:bg-gray-50 cursor-pointer font-display`}
            title="Undo (Ctrl+Z)"
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className={`${undoBtnSize} flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 disabled:opacity-30 hover:bg-gray-50 cursor-pointer font-display`}
            title="Redo (Ctrl+Y)"
          >
            ↪
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            className={`${undoBtnSize} flex items-center justify-center rounded-lg border-2 border-red-300 bg-red-50 text-red-500 hover:bg-red-100 cursor-pointer`}
            title="Clear Canvas"
          >
            🗑
          </button>
        </div>

        {/* Width indicator */}
        <div className="text-center pb-2">
          <span className="text-[9px] text-gray-400 font-display">{Math.round(toolbarWidth)}px</span>
        </div>

        {/* Drag handle on right edge */}
        <div
          onMouseDown={handleDragStart}
          className="absolute top-0 right-0 w-2 h-full cursor-col-resize group z-40"
          title="Drag to resize"
        >
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-12 rounded-full bg-gray-300 group-hover:bg-electric-blue group-hover:w-1.5 transition-all" />
        </div>
      </div>

      {/* Clear confirmation modal */}
      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear Canvas?">
        <div className="text-center">
          <div className="text-6xl mb-4">🧹✨</div>
          <p className="text-gray-600 font-body mb-6">
            Erase everything and start fresh? This can't be undone!
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-6 py-2 rounded-xl border-3 border-gray-300 bg-white text-gray-700 font-bold font-display hover:bg-gray-50 cursor-pointer"
              style={{ borderWidth: '3px' }}
            >
              Keep It
            </button>
            <button
              onClick={() => { clearCanvas(); setShowClearConfirm(false); }}
              className="px-6 py-2 rounded-xl border-3 border-red-400 bg-red-500 text-white font-bold font-display hover:bg-red-600 cursor-pointer"
              style={{ borderWidth: '3px' }}
            >
              Clear It! 💥
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
