import React, { useRef, useEffect, useState } from 'react';
import { Group, Image as KonvaImage, Transformer } from 'react-konva';
import { useCanvasStore } from '../../stores/canvasStore';
import type { StickerObject } from '../../stores/canvasStore';
import Konva from 'konva';

// Cache emoji images so we don't re-render them every time
const emojiImageCache = new Map<string, HTMLCanvasElement>();

function renderEmojiToCanvas(emoji: string, size: number): HTMLCanvasElement {
  const key = `${emoji}-${size}`;
  if (emojiImageCache.has(key)) return emojiImageCache.get(key)!;

  const canvas = document.createElement('canvas');
  const scale = window.devicePixelRatio || 1;
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.font = `${size * 0.8}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(emoji, size / 2, size / 2);

  emojiImageCache.set(key, canvas);
  return canvas;
}

interface StickerItemProps {
  sticker: StickerObject;
  isSelected: boolean;
  onSelect: () => void;
}

function StickerItem({ sticker, isSelected, onSelect }: StickerItemProps) {
  const shapeRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const updateSticker = useCanvasStore((s) => s.updateSticker);
  const [emojiImage, setEmojiImage] = useState<HTMLCanvasElement | null>(null);

  // Render emoji to offscreen canvas
  useEffect(() => {
    const img = renderEmojiToCanvas(sticker.emoji, Math.max(sticker.width, sticker.height));
    setEmojiImage(img);
  }, [sticker.emoji, sticker.width, sticker.height]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  // Slap animation on mount
  useEffect(() => {
    if (shapeRef.current && sticker.isAnimating) {
      const node = shapeRef.current;
      node.to({
        scaleX: sticker.scaleX * 1.3,
        scaleY: sticker.scaleY * 1.3,
        rotation: sticker.rotation - 5,
        duration: 0.1,
        onFinish: () => {
          node.to({
            scaleX: sticker.scaleX,
            scaleY: sticker.scaleY,
            rotation: sticker.rotation,
            duration: 0.2,
            easing: Konva.Easings.BounceEaseOut,
          });
        },
      });
      updateSticker(sticker.id, { isAnimating: false });
    }
  }, [sticker.isAnimating]);

  if (!emojiImage) return null;

  return (
    <>
      <Group
        ref={shapeRef}
        x={sticker.x}
        y={sticker.y}
        width={sticker.width}
        height={sticker.height}
        scaleX={sticker.scaleX}
        scaleY={sticker.scaleY}
        rotation={sticker.rotation}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          updateSticker(sticker.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          updateSticker(sticker.id, {
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      >
        <KonvaImage
          image={emojiImage}
          width={sticker.width}
          height={sticker.height}
        />
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-left', 'bottom-right',
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
}

interface StickerLayerProps {
  layerId: string;
}

export default function StickerLayer({ layerId }: StickerLayerProps) {
  const stickers = useCanvasStore((s) => s.stickers);
  const selectedStickerId = useCanvasStore((s) => s.selectedStickerId);
  const setSelectedSticker = useCanvasStore((s) => s.setSelectedSticker);

  const layerStickers = stickers.filter((s) => s.layerId === layerId);

  return (
    <>
      {layerStickers.map((sticker) => (
        <StickerItem
          key={sticker.id}
          sticker={sticker}
          isSelected={selectedStickerId === sticker.id}
          onSelect={() => setSelectedSticker(sticker.id)}
        />
      ))}
    </>
  );
}
