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
      className={`flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer transition-colors ${
        isActive ? 'bg-electric-blue/10 border-2 border-electric-blue' : 'border-2 border-transparent hover:bg-gray-50'
      }`}
    >
      {/* Visibility toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
        className="w-6 h-6 flex items-center justify-center text-sm cursor-pointer"
        title={layer.visible ? 'Hide layer' : 'Show layer'}
      >
        {layer.visible ? '👁' : '👁‍🗨'}
      </button>

      {/* Layer name */}
      {isEditing ? (
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={() => { onRename(editName); setIsEditing(false); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { onRename(editName); setIsEditing(false); } }}
          className="flex-1 text-xs font-body bg-white border-2 border-gray-300 rounded px-1 py-0.5 outline-none"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span
          className="flex-1 text-xs font-bold font-display text-gray-700 truncate"
          onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
        >
          {layer.name}
        </span>
      )}

      {/* Remove button */}
      {canRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="w-5 h-5 flex items-center justify-center text-[10px] text-red-400 hover:text-red-600 cursor-pointer"
          title="Remove layer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
