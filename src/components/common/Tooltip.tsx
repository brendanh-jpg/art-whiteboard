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
        <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap bg-gray-800 text-white text-xs font-body px-2 py-1 rounded-lg border-2 border-gray-600 shadow-lg">
          {text}
          {shortcut && <span className="ml-1 opacity-60">({shortcut})</span>}
        </div>
      )}
    </div>
  );
}
