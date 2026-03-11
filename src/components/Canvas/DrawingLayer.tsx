import React from 'react';
import { Line, Circle, Text as KonvaText, Star, Rect, Shape } from 'react-konva';
import { useCanvasStore } from '../../stores/canvasStore';
import type { DrawLine } from '../../stores/canvasStore';
import { getWallpaperTile } from '../../utils/wallpapers';

/** Cache of CanvasPattern objects keyed by wallpaper id, per 2d context. */
const patternCache = new Map<string, CanvasPattern>();

function getOrCreatePattern(ctx: CanvasRenderingContext2D, wallpaperId: string): CanvasPattern | null {
  if (patternCache.has(wallpaperId)) return patternCache.get(wallpaperId)!;
  const tile = getWallpaperTile(wallpaperId);
  if (!tile) return null;
  const pattern = ctx.createPattern(tile, 'repeat');
  if (!pattern) return null;
  patternCache.set(wallpaperId, pattern);
  return pattern;
}

function renderLine(line: DrawLine) {
  const key = line.id;

  if (line.tool === 'text' && line.text) {
    return (
      <KonvaText
        key={key}
        x={line.x || 0}
        y={line.y || 0}
        text={line.text}
        fontSize={line.fontSize || 24}
        fontFamily={line.fontFamily || "'Comic Neue', cursive"}
        fill={line.color}
        opacity={line.opacity}
      />
    );
  }

  if (line.tool === 'shapeStamp') {
    const cx = line.x || 0;
    const cy = line.y || 0;
    const w = line.width || 60;
    const h = line.height || 60;
    if (line.shapeType === 'star') {
      return (
        <Star
          key={key}
          x={cx}
          y={cy}
          numPoints={5}
          innerRadius={w * 0.4}
          outerRadius={w * 0.8}
          fill={line.color}
          opacity={line.opacity}
        />
      );
    }
    return (
      <Rect
        key={key}
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        fill={line.color}
        opacity={line.opacity}
        cornerRadius={line.shapeType === 'cloud' ? 20 : 0}
      />
    );
  }

  if ((line.tool === 'sprayPaint' || line.tool === 'glitterPen') && line.particles) {
    return (
      <React.Fragment key={key}>
        {line.particles.map((p, i) => (
          <Circle
            key={`${key}-p-${i}`}
            x={p.x}
            y={p.y}
            radius={p.size}
            fill={p.color}
            opacity={p.opacity}
          />
        ))}
      </React.Fragment>
    );
  }

  // Wallpaper brush — thick stroke filled with tiling pattern
  if (line.tool === 'wallpaperBrush' && line.wallpaperId && line.points.length >= 4) {
    return (
      <Shape
        key={key}
        sceneFunc={(ctx, shape) => {
          const pattern = getOrCreatePattern(ctx._context, line.wallpaperId!);
          if (!pattern) return;

          // Build the thick stroke path
          ctx.beginPath();
          ctx.moveTo(line.points[0], line.points[1]);
          for (let i = 2; i < line.points.length; i += 2) {
            ctx.lineTo(line.points[i], line.points[i + 1]);
          }
          ctx.lineWidth = line.strokeWidth;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = pattern;
          ctx.globalAlpha = line.opacity;
          ctx.stroke();

          // Don't call fillStrokeShape — we did our own custom drawing
        }}
      />
    );
  }

  // Single-point wallpaper brush (dot on initial click)
  if (line.tool === 'wallpaperBrush' && line.wallpaperId && line.points.length === 2) {
    return (
      <Shape
        key={key}
        sceneFunc={(ctx) => {
          const pattern = getOrCreatePattern(ctx._context, line.wallpaperId!);
          if (!pattern) return;
          ctx.beginPath();
          ctx.arc(line.points[0], line.points[1], line.strokeWidth / 2, 0, Math.PI * 2);
          ctx.fillStyle = pattern;
          ctx.globalAlpha = line.opacity;
          ctx.fill();
        }}
      />
    );
  }

  const isEraser = line.tool === 'eraser';
  const isHighlighter = line.tool === 'highlighter';

  return (
    <Line
      key={key}
      points={line.points}
      stroke={isEraser ? '#FFFFFF' : line.color}
      strokeWidth={line.strokeWidth}
      tension={0.5}
      lineCap="round"
      lineJoin="round"
      globalCompositeOperation={isEraser ? 'destination-out' : 'source-over'}
      opacity={isHighlighter ? 0.4 : line.opacity}
    />
  );
}

interface DrawingLayerProps {
  layerId: string;
}

export default function DrawingLayer({ layerId }: DrawingLayerProps) {
  const lines = useCanvasStore((s) => s.lines);
  const currentLine = useCanvasStore((s) => s.currentLine);

  const layerLines = lines.filter((l) => l.layerId === layerId);

  return (
    <>
      {layerLines.map(renderLine)}
      {currentLine && currentLine.layerId === layerId && renderLine(currentLine)}
    </>
  );
}
