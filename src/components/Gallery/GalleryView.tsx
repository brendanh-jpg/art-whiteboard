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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div
        className="relative rounded-2xl p-6 shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto panel-scroll"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800 font-display">My Gallery</h2>
            <p className="text-xs text-slate-400 mt-0.5">{gallery.length} saved artwork{gallery.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-all"
          >
            ✕
          </button>
        </div>

        {gallery.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 opacity-40">🎨</div>
            <p className="text-sm text-slate-500">No artwork saved yet.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Save" to add your masterpieces here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="aspect-square rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
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
