import React from 'react';
import Tooltip from '../common/Tooltip';

export type ToolbarSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<ToolbarSize, { icon: string }> = {
  sm: { icon: 'text-lg' },
  md: { icon: 'text-2xl' },
  lg: { icon: 'text-3xl' },
};

interface ToolButtonProps {
  icon: string;
  label: string;
  shortcut?: string;
  active?: boolean;
  size?: ToolbarSize;
  showLabel?: boolean;
  toolbarWidth?: number;
  onClick: () => void;
}

export default function ToolButton({ icon, label, shortcut, active, size = 'md', showLabel, toolbarWidth = 140, onClick }: ToolButtonProps) {
  const cls = SIZE_CLASSES[size];

  // Button dimensions scale with toolbar width
  const btnSize = size === 'sm' ? 'h-9 min-w-[36px]' : size === 'lg' ? 'h-14 min-w-[56px]' : 'h-11 min-w-[44px]';

  // When showing label, render as a wider row button
  if (showLabel) {
    return (
      <Tooltip text={label} shortcut={shortcut}>
        <button
          onClick={onClick}
          className={`
            ${btnSize} w-full flex items-center gap-2 px-3 rounded-xl
            ${cls.icon} transition-all duration-150 select-none
            ${active
              ? 'bg-electric-blue text-white shadow-lg scale-[1.03] tool-bounce'
              : 'bg-white text-gray-700 hover:bg-gray-50 tool-wiggle'
            }
            cursor-pointer
          `}
          style={{ borderWidth: '3px', borderColor: active ? '#2563eb' : '#d1d5db', borderStyle: 'solid' }}
          title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
        >
          <span>{icon}</span>
          <span className={`${size === 'lg' ? 'text-sm' : 'text-xs'} font-bold font-display truncate`}>
            {label}
          </span>
          {shortcut && (
            <span className="ml-auto text-[9px] opacity-50 font-mono">{shortcut}</span>
          )}
        </button>
      </Tooltip>
    );
  }

  // Icon-only square button
  const squareSize = size === 'sm' ? 'w-9 h-9' : size === 'lg' ? 'w-14 h-14' : 'w-11 h-11';

  return (
    <Tooltip text={label} shortcut={shortcut}>
      <button
        onClick={onClick}
        className={`
          ${squareSize} flex items-center justify-center rounded-xl
          ${cls.icon} transition-all duration-150 select-none
          ${active
            ? 'bg-electric-blue text-white shadow-lg scale-110 tool-bounce'
            : 'bg-white text-gray-700 hover:bg-gray-50 tool-wiggle'
          }
          cursor-pointer
        `}
        style={{ borderWidth: '3px', borderColor: active ? '#2563eb' : '#d1d5db', borderStyle: 'solid' }}
        title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
