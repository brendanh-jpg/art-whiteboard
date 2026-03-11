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
        background: 'rgba(0,0,0,0.02)',
        border: '1px solid rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.02)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.06)';
      }}
      title={label}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', emoji); }}
    >
      <span>{emoji}</span>
      {size !== 'sm' && (
        <span className={`${cls.text} font-semibold leading-tight mt-0.5 truncate w-full text-center`}
          style={{ color: '#64748b' }}
        >
          {label}
        </span>
      )}
    </button>
  );
}
