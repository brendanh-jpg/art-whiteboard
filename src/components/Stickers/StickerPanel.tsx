import React, { useState } from 'react';
import Konva from 'konva';
import StickerCategory from './StickerCategory';
import { useCanvasStore } from '../../stores/canvasStore';
import type { PanelSize } from './StickerItem';

const STICKER_CATEGORIES: Record<string, Array<{ emoji: string; label: string }>> = {
  'Feelings': [
    { emoji: '😊', label: 'Happy' }, { emoji: '😢', label: 'Sad' }, { emoji: '😠', label: 'Angry' },
    { emoji: '😰', label: 'Anxious' }, { emoji: '😕', label: 'Confused' }, { emoji: '😤', label: 'Frustrated' },
    { emoji: '🥹', label: 'Proud' }, { emoji: '😨', label: 'Scared' }, { emoji: '🤪', label: 'Silly' },
    { emoji: '😌', label: 'Calm' }, { emoji: '🥰', label: 'Loved' }, { emoji: '😴', label: 'Tired' },
    { emoji: '🤔', label: 'Thoughtful' }, { emoji: '😎', label: 'Confident' }, { emoji: '🥺', label: 'Hopeful' },
    { emoji: '😮', label: 'Surprised' },
  ],
  'Emoji': [
    { emoji: '😀', label: 'Grinning' }, { emoji: '😂', label: 'Laughing' }, { emoji: '🥳', label: 'Party' },
    { emoji: '😍', label: 'Heart Eyes' }, { emoji: '🤩', label: 'Star Eyes' }, { emoji: '😜', label: 'Winking' },
    { emoji: '🤗', label: 'Hugging' }, { emoji: '🫡', label: 'Salute' },
  ],
  'Animals': [
    { emoji: '🐶', label: 'Dog' }, { emoji: '🐱', label: 'Cat' }, { emoji: '🐰', label: 'Bunny' },
    { emoji: '🦊', label: 'Fox' }, { emoji: '🐻', label: 'Bear' }, { emoji: '🦋', label: 'Butterfly' },
    { emoji: '🐢', label: 'Turtle' }, { emoji: '🦄', label: 'Unicorn' },
  ],
  'Food': [
    { emoji: '🍕', label: 'Pizza' }, { emoji: '🍦', label: 'Ice Cream' }, { emoji: '🧁', label: 'Cupcake' },
    { emoji: '🍩', label: 'Donut' }, { emoji: '🍓', label: 'Strawberry' }, { emoji: '🌮', label: 'Taco' },
    { emoji: '🍪', label: 'Cookie' }, { emoji: '🎂', label: 'Cake' },
  ],
  'Nature': [
    { emoji: '🌸', label: 'Cherry Blossom' }, { emoji: '🌈', label: 'Rainbow' }, { emoji: '⭐', label: 'Star' },
    { emoji: '🌙', label: 'Moon' }, { emoji: '☀️', label: 'Sun' }, { emoji: '🔥', label: 'Fire' },
    { emoji: '💧', label: 'Water' }, { emoji: '🍀', label: 'Clover' },
  ],
  'Space': [
    { emoji: '🚀', label: 'Rocket' }, { emoji: '🛸', label: 'UFO' }, { emoji: '👽', label: 'Alien' },
    { emoji: '🌍', label: 'Earth' }, { emoji: '💫', label: 'Dizzy Star' }, { emoji: '🪐', label: 'Planet' },
    { emoji: '☄️', label: 'Comet' }, { emoji: '🌟', label: 'Glowing Star' },
  ],
  'Sports': [
    { emoji: '⚽', label: 'Soccer' }, { emoji: '🏀', label: 'Basketball' }, { emoji: '🎾', label: 'Tennis' },
    { emoji: '🏈', label: 'Football' }, { emoji: '⚾', label: 'Baseball' }, { emoji: '🎯', label: 'Target' },
    { emoji: '🏆', label: 'Trophy' }, { emoji: '🥇', label: 'Gold Medal' },
  ],
  'Music': [
    { emoji: '🎵', label: 'Music Note' }, { emoji: '🎸', label: 'Guitar' }, { emoji: '🥁', label: 'Drum' },
    { emoji: '🎤', label: 'Microphone' }, { emoji: '🎹', label: 'Piano' }, { emoji: '🎷', label: 'Saxophone' },
    { emoji: '🎺', label: 'Trumpet' }, { emoji: '🎶', label: 'Notes' },
  ],
};

const PANEL_WIDTHS: Record<PanelSize, number> = {
  sm: 300,
  md: 380,
  lg: 500,
};

interface StickerPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StickerPanel({ isOpen, onClose }: StickerPanelProps) {
  const [activeCategory, setActiveCategory] = useState('Feelings');
  const [panelSize, setPanelSize] = useState<PanelSize>('md');
  const { addSticker, activeLayerId, stageScale, stageX, stageY } = useCanvasStore();

  const handleStickerSelect = (emoji: string) => {
    const stage = Konva.stages?.[0];
    const stageW = stage?.width() ?? 800;
    const stageH = stage?.height() ?? 600;
    const centerX = (stageW / 2 - stageX) / stageScale;
    const centerY = (stageH / 2 - stageY) / stageScale;
    const x = centerX + (Math.random() - 0.5) * 80;
    const y = centerY + (Math.random() - 0.5) * 80;

    addSticker({
      id: `sticker-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      emoji,
      x,
      y,
      width: 60,
      height: 60,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      layerId: activeLayerId,
      isAnimating: true,
    });
  };

  const categories = Object.keys(STICKER_CATEGORIES);
  const panelWidth = PANEL_WIDTHS[panelSize];

  return (
    <div
      className={`
        fixed top-0 right-0 h-full bg-cream/95 backdrop-blur-sm border-l-4 border-gray-300 shadow-2xl z-30
        transition-all duration-300 ease-out select-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      style={{ width: `${panelWidth}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-3 border-gray-200" style={{ borderBottomWidth: '3px' }}>
        <h2 className="text-xl font-bold text-gray-800 font-display">Stickers</h2>
        <div className="flex items-center gap-2">
          {/* Size toggle */}
          <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden">
            {(['sm', 'md', 'lg'] as PanelSize[]).map((s) => (
              <button
                key={s}
                onClick={() => setPanelSize(s)}
                className={`px-2 py-1 text-[10px] font-bold font-display cursor-pointer transition-colors ${
                  panelSize === s
                    ? 'bg-electric-blue text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5 px-3 py-2 border-b-2 border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border-2 cursor-pointer transition-colors font-display
              ${activeCategory === cat
                ? cat === 'Feelings'
                  ? 'bg-hot-pink text-white border-pink-600'
                  : 'bg-electric-blue text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Feelings highlight */}
      {activeCategory === 'Feelings' && (
        <div className="mx-3 mt-2 px-3 py-2 bg-pink-50 border-2 border-pink-200 rounded-xl">
          <p className="text-xs font-bold text-pink-600 font-display">
            How are you feeling today? Pick a sticker!
          </p>
        </div>
      )}

      {/* Stickers grid */}
      <div className="overflow-y-auto panel-scroll" style={{ maxHeight: 'calc(100vh - 170px)' }}>
        <StickerCategory
          stickers={STICKER_CATEGORIES[activeCategory]}
          size={panelSize}
          onSelect={handleStickerSelect}
        />
      </div>
    </div>
  );
}
