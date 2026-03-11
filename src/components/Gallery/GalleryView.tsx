import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';

interface GalleryViewProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GalleryView({ isOpen, onClose }: GalleryViewProps) {
  const gallery = useCanvasStore((s) => s.gallery);
  const removeFromGallery = useCanvasStore((s) => s.removeFromGallery);
  const loadFromGallery = useCanvasStore((s) => s.loadFromGallery);

  if (!isOpen) return null;

  const handleLoad = (id: string) => {
    loadFromGallery(id);
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromGallery(id);
    try { localStorage.removeItem(`playspace-save-${id}`); } catch {}
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

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
                className="group relative rounded-xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                onClick={() => handleLoad(item.id)}
              >
                <div className="aspect-square">
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] font-semibold text-white truncate">{item.name}</p>
                  <p className="text-[9px] text-white/60">{formatDate(item.timestamp)}</p>
                </div>
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-black/60"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
