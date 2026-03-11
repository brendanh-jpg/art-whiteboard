import React from 'react';
import Tooltip from '../common/Tooltip';

export type ToolbarSize = 'sm' | 'md' | 'lg';

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

export default function ToolButton({ icon, label, shortcut, active, size = 'md', showLabel, onClick }: ToolButtonProps) {
  const iconSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const btnH = size === 'sm' ? 'h-8 min-w-[32px]' : size === 'lg' ? 'h-12 min-w-[48px]' : 'h-10 min-w-[40px]';
  const squareSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';

  if (showLabel) {
    return (
      <Tooltip text={label} shortcut={shortcut}>
        <button
          onClick={onClick}
          className={`
            ${btnH} w-full flex items-center gap-2.5 px-3 rounded-xl
            ${iconSize} transition-all duration-150 select-none cursor-pointer
            ${active
              ? 'bg-accent/20 text-accent shadow-[0_0_0_1px_rgba(129,140,248,0.5)] tool-bounce'
              : 'text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-[rgba(255,255,255,0.9)]'
            }
          `}
        >
          <span className="leading-none">{icon}</span>
          <span className={`${size === 'lg' ? 'text-sm' : 'text-xs'} font-semibold truncate`}>
            {label}
          </span>
          {shortcut && (
            <span className="ml-auto text-[9px] opacity-30 font-mono bg-white/10 px-1 py-0.5 rounded">{shortcut}</span>
          )}
        </button>
      </Tooltip>
    );
  }

  return (
    <Tooltip text={label} shortcut={shortcut}>
      <button
        onClick={onClick}
        className={`
          ${squareSize} flex items-center justify-center rounded-xl
          ${iconSize} transition-all duration-150 select-none cursor-pointer
          ${active
            ? 'bg-accent/20 text-accent shadow-[0_0_0_1px_rgba(129,140,248,0.4)] tool-bounce tool-active-glow'
            : 'text-[rgba(255,255,255,0.6)] hover:bg-[rgba(255,255,255,0.07)] hover:text-[rgba(255,255,255,0.9)]'
          }
        `}
        title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      >
        {icon}
      </button>
    </Tooltip>
  );
}
