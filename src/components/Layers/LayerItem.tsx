import React, { useState } from 'react';
import type { Layer } from '../../stores/canvasStore';

interface LayerItemProps {
  layer: Layer;
  isActive: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onRename: (name: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export default function LayerItem({
  layer, isActive, onSelect, onToggleVisibility, onRename, onRemove, canRemove,
}: LayerItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(layer.name);

  return (
    <div
      onClick={onSelect}
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
      style={{
        background: isActive ? 'rgba(146,107,127,0.1)' : 'rgba(0,0,0,0.02)',
        border: isActive ? '1px solid rgba(146,107,127,0.35)' : '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        className="w-6 h-6 flex items-center justify-center text-sm cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        title={layer.visible ? 'Hide layer' : 'Show layer'}
      >
        {layer.visible ? '👁' : '🙈'}
      </button>

      {isEditing ? (
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => { onRename(editName); setIsEditing(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { onRename(editName); setIsEditing(false); } }}
          className="flex-1 text-xs rounded px-1.5 py-0.5 outline-none font-semibold"
          style={{ background: 'rgba(0,0,0,0.05)', color: '#1e293b', border: '1px solid rgba(0,0,0,0.12)' }}
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="flex-1 text-xs font-semibold truncate"
          style={{ color: isActive ? 'rgba(146,107,127,0.9)' : '#475569' }}
          onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          title="Double-click to rename"
        >
          {layer.name}
        </span>
      )}

      {canRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-5 h-5 flex items-center justify-center text-[10px] rounded cursor-pointer transition-colors text-slate-400 hover:text-red-500"
          title="Remove layer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
