import React, { useState } from 'react';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function NameEntryModal() {
  const { needsNameEntry, setLocalUserName, localUserColor, setLocalUserColor } = useCollaborationStore();
  const [name, setName] = useState('');

  const colors = [
    '#926B7F', '#BFA6B3', '#34D399', '#FBBF24', '#F87171',
    '#9E798C', '#60A5FA', '#FB923C', '#2DD4BF', '#EBCCDC',
  ];

  if (!needsNameEntry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim() || 'Anonymous';
    setLocalUserName(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <div
        className="relative rounded-2xl p-6 shadow-2xl w-full max-w-sm mx-4"
        style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="text-center mb-5">
          <div className="text-4xl mb-2">🎨</div>
          <h2 className="text-lg font-bold text-slate-800 font-display">Welcome to PlaySpace!</h2>
          <p className="text-xs text-slate-400 mt-1">Pick a name and color to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={20}
              autoFocus
              className="w-full px-3 py-2 rounded-xl text-sm text-slate-800 placeholder-slate-300 outline-none transition-all"
              style={{ background: '#F8F8FA', border: '1px solid rgba(0,0,0,0.08)' }}
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Your Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setLocalUserColor(c)}
                  className="w-8 h-8 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: c,
                    boxShadow: localUserColor === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                    transform: localUserColor === c ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all hover:opacity-90"
            style={{ background: localUserColor }}
          >
            Start Drawing
          </button>
        </form>
      </div>
    </div>
  );
}
