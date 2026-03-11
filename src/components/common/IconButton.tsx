import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  active?: boolean;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

export default function IconButton({ onClick, active, title, className = '', children }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        relative w-11 h-11 flex items-center justify-center rounded-xl
        border-3 transition-all duration-150 font-display text-lg
        ${active
          ? 'bg-electric-blue text-white border-blue-700 shadow-lg scale-105'
          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }
        tool-wiggle cursor-pointer
        ${className}
      `}
      style={{ borderWidth: '3px' }}
    >
      {children}
    </button>
  );
}
