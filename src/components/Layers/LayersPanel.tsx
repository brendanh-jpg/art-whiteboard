import React from 'react';
import { useCanvasStore } from '../../stores/canvasStore';
import LayerItem from './LayerItem';

interface LayersPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LayersPanel({ isOpen, onClose }: LayersPanelProps) {
  const { layers, activeLayerId, addLayer, removeLayer, setActiveLayer, toggleLayerVisibility, renameLayer } = useCanvasStore();

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-4 w-56 bg-cream/95 backdrop-blur-sm rounded-2xl border-3 border-gray-300 shadow-2xl z-30 select-none" style={{ borderWidth: '3px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b-2 border-gray-200">
        <h3 className="text-sm font-bold text-gray-800 font-display">Layers</h3>
        <div className="flex gap-1">
          <button
            onClick={addLayer}
            disabled={layers.length >= 5}
            className="w-6 h-6 flex items-center justify-center rounded-md border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 cursor-pointer text-xs font-bold"
            title="Add layer (max 5)"
          >
            +
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md border-2 border-gray-300 bg-white text-gray-500 hover:bg-gray-50 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Layer list */}
      <div className="p-2 space-y-1 max-h-60 overflow-y-auto panel-scroll">
        {[...layers].reverse().map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            isActive={activeLayerId === layer.id}
            onSelect={() => setActiveLayer(layer.id)}
            onToggleVisibility={() => toggleLayerVisibility(layer.id)}
            onRename={(name) => renameLayer(layer.id, name)}
            onRemove={() => removeLayer(layer.id)}
            canRemove={layers.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
