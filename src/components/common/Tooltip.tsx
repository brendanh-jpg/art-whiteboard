import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  shortcut?: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, shortcut, children }: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="absolute left-full ml-2.5 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none"
          style={{
            background: 'rgba(15,15,30,0.95)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.85)',
            animation: 'tooltipIn 0.12s ease-out',
          }}
        >
          {text}
          {shortcut && (
            <span
              className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-mono"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}
            >
              {shortcut}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
