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
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-cream rounded-3xl border-4 border-gray-800 p-6 shadow-2xl max-w-md w-full mx-4 font-display">
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-4 font-display">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
}
