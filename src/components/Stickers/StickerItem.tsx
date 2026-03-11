import React from 'react';

export type PanelSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<PanelSize, { button: string; text: string }> = {
  sm: { button: 'w-12 h-12 text-2xl', text: 'text-[7px]' },
  md: { button: 'w-14 h-14 text-3xl', text: 'text-[8px]' },
  lg: { button: 'w-18 h-18 text-4xl', text: 'text-[9px]' },
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
      className={`${cls.button} flex flex-col items-center justify-center rounded-xl cursor-pointer select-none transition-all duration-150 hover:scale-110`}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
      }}
      title={label}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', emoji); }}
    >
      <span>{emoji}</span>
      {size !== 'sm' && (
        <span className={`${cls.text} font-semibold leading-tight mt-0.5 truncate w-full text-center`}
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
