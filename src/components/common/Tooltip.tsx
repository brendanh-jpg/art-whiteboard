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
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.1)',
            color: '#1e293b',
            animation: 'tooltipIn 0.12s ease-out',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {text}
          {shortcut && (
            <span
              className="ml-1.5 px-1 py-0.5 rounded text-[9px] font-mono"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#94a3b8' }}
            >
              {shortcut}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
