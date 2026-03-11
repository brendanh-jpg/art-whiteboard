import React from 'react';

export type PanelSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<PanelSize, { button: string; text: string }> = {
  sm: { button: 'w-14 h-14 text-2xl', text: 'text-[8px]' },
  md: { button: 'w-16 h-16 text-3xl', text: 'text-[9px]' },
  lg: { button: 'w-20 h-20 text-4xl', text: 'text-[10px]' },
};

interface StickerItemProps {
  emoji: string;
  label: string;
  size?: PanelSize;
  onSelect: (emoji: string) => void;
}

export default function StickerItemUI({ emoji, label, size = 'md', onSelect }: StickerItemProps) {
  const cls = SIZE_CLASSES[size];

  return (
    <button
      onClick={() => onSelect(emoji)}
      className={`${cls.button} flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:scale-110 hover:border-electric-blue transition-all duration-150 cursor-pointer select-none`}
      title={label}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', emoji);
      }}
    >
      <span>{emoji}</span>
      {size !== 'sm' && (
        <span className={`${cls.text} font-display text-gray-400 leading-tight mt-0.5 truncate w-full text-center`}>
          {label}
        </span>
      )}
    </button>
  );
}
