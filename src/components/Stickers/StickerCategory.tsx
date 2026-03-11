import React from 'react';
import StickerItemUI from './StickerItem';
import type { PanelSize } from './StickerItem';

const GRID_COLS: Record<PanelSize, string> = {
  sm: 'grid-cols-4',
  md: 'grid-cols-5',
  lg: 'grid-cols-6',
};

interface StickerCategoryProps {
  stickers: Array<{ emoji: string; label: string }>;
  size?: PanelSize;
  onSelect: (emoji: string) => void;
}

export default function StickerCategory({ stickers, size = 'md', onSelect }: StickerCategoryProps) {
  return (
    <div className={`grid ${GRID_COLS[size]} gap-2 p-3`}>
      {stickers.map((s) => (
        <StickerItemUI key={s.emoji + s.label} emoji={s.emoji} label={s.label} size={size} onSelect={onSelect} />
      ))}
    </div>
  );
}
