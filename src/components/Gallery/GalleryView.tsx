import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

interface GalleryViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryView({ isOpen, onClose }: GalleryViewProps) {
  const gallery = useCanvasStore((s) => s.gallery);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cream rounded-3xl border-4 border-gray-800 p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 font-display">My Gallery 🖼</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🎨</div>
            <p className="text-gray-500 font-body">
              No artwork saved yet! Click "Save to Gallery" to add your masterpieces here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-xl border-3 border-gray-300 overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow"
                style={{ borderWidth: '3px' }}
              >
                <img
                  src={item.thumbnail}
                  alt="Saved artwork"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
