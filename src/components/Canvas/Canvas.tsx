import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Line } from 'react-konva';
import Konva from 'konva';
import { useCanvasStore } from '../../stores/canvasStore';
import { useToolStore } from '../../stores/toolStore';
import DrawingLayer from './DrawingLayer';
import StickerLayer from './StickerLayer';
import CursorOverlay from './CursorOverlay';
import { generateSprayParticles, generateGlitterParticles, getRainbowColor } from '../../utils/particles';
import { broadcastCursor, broadcastDrawStart, broadcastDrawUpdate, broadcastDrawEnd, broadcastStickerAdd } from '../../utils/multiplayer';

let idCounter = 0;

export default function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const rainbowIndex = useRef(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [textInput, setTextInput] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

  // Measure container with ResizeObserver for reliable sizing
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const {
    canvasWidth, canvasHeight, stageScale, stageX, stageY, background,
    setStageScale, setStagePosition, layers, activeLayerId,
    addLine, setCurrentLine, updateCurrentLine, pushHistory,
    setSelectedSticker, addSticker,
  } = useCanvasStore();

  const {
    activeTool, brushSize, opacity, color, sprayRadius, sprayDensity,
    fontSize, fontFamily, activeShape, addRecentColor,
    selectedWallpaper, wallpaperBrushSize,
  } = useToolStore();

  const getPointerPosition = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;
    const pointer = stage.getPointerPosition();
    if (!pointer) return null;
    return {
      x: (pointer.x - stageX) / stageScale,
      y: (pointer.y - stageY) / stageScale,
    };
  }, [stageScale, stageX, stageY]);

  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;
    const oldScale = stageScale;
    const pointer = stage.getPointerPosition()!;
    const mousePointTo = {
      x: (pointer.x - stageX) / oldScale,
      y: (pointer.y - stageY) / oldScale,
    };
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const clampedScale = Math.max(0.1, Math.min(5, newScale));
    setStageScale(clampedScale);
    setStagePosition(
      pointer.x - mousePointTo.x * clampedScale,
      pointer.y - mousePointTo.y * clampedScale
    );
  }, [stageScale, stageX, stageY, setStageScale, setStagePosition]);

  const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Deselect stickers when clicking on empty area
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.getParent()?.className === 'Layer';
    if (clickedOnEmpty) {
      setSelectedSticker(null);
    }

    if (activeTool === 'pan') return;
    if (activeTool === 'eyedropper') return;

    if (activeTool === 'text') {
      const pos = getPointerPosition();
      if (pos) setTextInput({ x: pos.x, y: pos.y, visible: true });
      return;
    }

    if (activeTool === 'shapeStamp') {
      const pos = getPointerPosition();
      if (!pos) return;
      const id = `line-${++idCounter}`;
      const line = {
        id,
        tool: 'shapeStamp',
        points: [],
        color,
        strokeWidth: brushSize,
        opacity,
        layerId: activeLayerId,
        shapeType: activeShape,
        x: pos.x,
        y: pos.y,
        width: brushSize * 10,
        height: brushSize * 10,
      };
      addLine(line);
      pushHistory();
      broadcastDrawEnd(line);
      addRecentColor(color);
      return;
    }

    isDrawing.current = true;
    const pos = getPointerPosition();
    if (!pos) return;

    const id = `line-${++idCounter}`;

    // Wallpaper brush
    if (activeTool === 'wallpaperBrush' && selectedWallpaper) {
      const line = {
        id,
        tool: 'wallpaperBrush',
        points: [pos.x, pos.y],
        color: '',
        strokeWidth: wallpaperBrushSize,
        opacity,
        layerId: activeLayerId,
        wallpaperId: selectedWallpaper,
      };
      setCurrentLine(line);
      broadcastDrawStart(line);
      return;
    }

    if (activeTool === 'sprayPaint') {
      const particles = generateSprayParticles(pos.x, pos.y, sprayRadius, sprayDensity, color);
      const line = {
        id,
        tool: 'sprayPaint',
        points: [pos.x, pos.y],
        color,
        strokeWidth: brushSize,
        opacity,
        layerId: activeLayerId,
        particles,
      };
      setCurrentLine(line);
      broadcastDrawStart(line);
      return;
    }

    if (activeTool === 'glitterPen') {
      const particles = generateGlitterParticles(pos.x, pos.y, brushSize * 2, color);
      const line = {
        id,
        tool: 'glitterPen',
        points: [pos.x, pos.y],
        color,
        strokeWidth: brushSize,
        opacity,
        layerId: activeLayerId,
        particles,
      };
      setCurrentLine(line);
      broadcastDrawStart(line);
      return;
    }

    const lineColor = activeTool === 'rainbowBrush' ? getRainbowColor(rainbowIndex.current++) : color;

    const line = {
      id,
      tool: activeTool,
      points: [pos.x, pos.y],
      color: lineColor,
      strokeWidth: activeTool === 'highlighter' ? brushSize * 3 : brushSize,
      opacity: activeTool === 'highlighter' ? 0.4 : opacity,
      layerId: activeLayerId,
    };
    setCurrentLine(line);
    broadcastDrawStart(line);
  }, [activeTool, color, brushSize, opacity, activeLayerId, getPointerPosition, sprayRadius, sprayDensity, activeShape, fontSize, fontFamily, selectedWallpaper, wallpaperBrushSize]);

  const handleMouseMove = useCallback(() => {
    const pos = getPointerPosition();
    if (pos) {
      broadcastCursor(pos.x, pos.y);
    }
    if (!isDrawing.current) return;
    if (!pos) return;

    const current = useCanvasStore.getState().currentLine;
    if (!current) return;

    if (current.tool === 'sprayPaint') {
      const newParticles = generateSprayParticles(pos.x, pos.y, sprayRadius, sprayDensity * 0.3, color);
      const newPoints = [...current.points, pos.x, pos.y];
      const allParticles = [...(current.particles || []), ...newParticles];
      updateCurrentLine(newPoints, allParticles);
      broadcastDrawUpdate(current.id, newPoints, allParticles);
      return;
    }

    if (current.tool === 'glitterPen') {
      const newParticles = generateGlitterParticles(pos.x, pos.y, brushSize * 2, color);
      const newPoints = [...current.points, pos.x, pos.y];
      const allParticles = [...(current.particles || []), ...newParticles];
      updateCurrentLine(newPoints, allParticles);
      broadcastDrawUpdate(current.id, newPoints, allParticles);
      return;
    }

    if (current.tool === 'line') {
      const startX = current.points[0];
      const startY = current.points[1];
      const newPoints = [startX, startY, pos.x, pos.y];
      updateCurrentLine(newPoints);
      broadcastDrawUpdate(current.id, newPoints);
      return;
    }

    const newPoints = [...current.points, pos.x, pos.y];
    updateCurrentLine(newPoints);
    broadcastDrawUpdate(current.id, newPoints);
  }, [getPointerPosition, color, brushSize, sprayRadius, sprayDensity]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const current = useCanvasStore.getState().currentLine;
    if (current) {
      addLine(current);
      setCurrentLine(null);
      pushHistory();
      broadcastDrawEnd(current);
      if (current.tool !== 'wallpaperBrush') {
        addRecentColor(color);
      }
    }
  }, [addLine, setCurrentLine, pushHistory, color, addRecentColor]);

  const handleTextSubmit = useCallback((text: string) => {
    if (!text.trim()) {
      setTextInput((p) => ({ ...p, visible: false }));
      return;
    }
    const id = `line-${++idCounter}`;
    const line = {
      id,
      tool: 'text',
      points: [],
      color,
      strokeWidth: 0,
      opacity,
      layerId: activeLayerId,
      text,
      fontSize,
      fontFamily,
      x: textInput.x,
      y: textInput.y,
    };
    addLine(line);
    pushHistory();
    broadcastDrawEnd(line);
    addRecentColor(color);
    setTextInput((p) => ({ ...p, visible: false }));
  }, [color, opacity, activeLayerId, fontSize, fontFamily, textInput.x, textInput.y]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        useCanvasStore.getState().undo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        useCanvasStore.getState().redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cursor style based on tool
  const getCursorStyle = () => {
    switch (activeTool) {
      case 'pencil': return 'crosshair';
      case 'eraser': return 'cell';
      case 'line': return 'crosshair';
      case 'pan': return 'grab';
      case 'eyedropper': return 'crosshair';
      case 'paintBucket': return 'crosshair';
      case 'text': return 'text';
      case 'sprayPaint': return 'crosshair';
      case 'shapeStamp': return 'crosshair';
      case 'wallpaperBrush': return 'crosshair';
      default: return 'crosshair';
    }
  };

  // Draw background pattern
  const renderBackground = () => {
    const elements: React.ReactNode[] = [
      <Rect key="bg" x={0} y={0} width={canvasWidth} height={canvasHeight} fill={background} />,
    ];

    if (background === '#F0F0FF') {
      // Graph paper
      const gridSize = 20;
      for (let i = 0; i <= canvasWidth; i += gridSize) {
        elements.push(
          <Line key={`gv-${i}`} points={[i, 0, i, canvasHeight]} stroke="#D0D0E8" strokeWidth={0.5} />
        );
      }
      for (let i = 0; i <= canvasHeight; i += gridSize) {
        elements.push(
          <Line key={`gh-${i}`} points={[0, i, canvasWidth, i]} stroke="#D0D0E8" strokeWidth={0.5} />
        );
      }
    }

    return elements;
  };

  // Sticker drag-and-drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const emoji = e.dataTransfer.getData('text/plain');
    if (!emoji || emoji.length > 4) return; // only accept emoji-length strings
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const dropX = (e.clientX - rect.left - stageX) / stageScale;
    const dropY = (e.clientY - rect.top - stageY) / stageScale;
    const sticker = {
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji,
      x: dropX,
      y: dropY,
      width: 60,
      height: 60,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      layerId: activeLayerId,
      isAnimating: true,
    };
    addSticker(sticker);
    broadcastStickerAdd(sticker);
  }, [stageX, stageY, stageScale, activeLayerId, addSticker]);

  const visibleLayers = layers.filter((l) => l.visible);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden"
      style={{ cursor: getCursorStyle() }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        draggable={activeTool === 'pan'}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onDragEnd={(e) => {
          if (activeTool === 'pan') {
            setStagePosition(e.target.x(), e.target.y());
          }
        }}
      >
        {/* Background layer */}
        <Layer>{renderBackground()}</Layer>

        {/* Drawing layers */}
        {visibleLayers.map((layer) => (
          <Layer key={layer.id}>
            <DrawingLayer layerId={layer.id} />
            <StickerLayer layerId={layer.id} />
          </Layer>
        ))}

        {/* Collaboration overlay */}
        <Layer>
          <CursorOverlay />
        </Layer>
      </Stage>

      {/* Floating text input */}
      {textInput.visible && (
        <div
          className="absolute z-40"
          style={{
            left: textInput.x * stageScale + stageX,
            top: textInput.y * stageScale + stageY,
          }}
        >
          <input
            autoFocus
            className="bg-white border-3 border-gray-800 rounded-xl px-3 py-2 text-lg font-body outline-none shadow-lg"
            style={{
              borderWidth: '3px',
              fontSize: `${fontSize}px`,
              fontFamily,
              color,
              minWidth: '200px',
            }}
            placeholder="Type here..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTextSubmit(e.currentTarget.value);
              if (e.key === 'Escape') setTextInput((p) => ({ ...p, visible: false }));
            }}
            onBlur={(e) => handleTextSubmit(e.currentTarget.value)}
          />
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur rounded-xl px-3 py-1 border-2 border-gray-300 font-body text-sm text-gray-600">
        {Math.round(stageScale * 100)}%
      </div>

    </div>
  );
}
