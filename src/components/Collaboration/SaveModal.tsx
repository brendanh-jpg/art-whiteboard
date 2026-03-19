import React, { useState } from 'react';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveModal({ isOpen, onClose, onSave }: SaveModalProps) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim() || `Artwork ${new Date().toLocaleString()}`;
    onSave(trimmed);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div
        className="relative rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 font-display">Save Artwork</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 cursor-pointer transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My masterpiece..."
              maxLength={50}
              autoFocus
              className="w-full px-3 py-2 rounded-xl text-sm text-slate-800 placeholder-slate-300 outline-none transition-all"
              style={{ background: '#F8F8FA', border: '1px solid rgba(0,0,0,0.08)' }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-slate-500 cursor-pointer transition-all hover:bg-slate-50"
              style={{ border: '1px solid rgba(0,0,0,0.08)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90"
              style={{ background: '#926B7F' }}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
