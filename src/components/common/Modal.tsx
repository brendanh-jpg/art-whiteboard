import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Modal({ isOpen, onClose, children, title }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div
        className="relative rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}
      >
        {title && (
          <h2 className="text-base font-bold text-slate-800 mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
