import React, { useState } from 'react';
import Konva from 'konva';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import RightPanel from './components/RightPanel/RightPanel';
import type { PanelTab } from './components/RightPanel/RightPanel';
import GalleryView from './components/Gallery/GalleryView';
import UserPresence from './components/Collaboration/UserPresence';
import ReactionOverlay from './components/Collaboration/ReactionOverlay';
import PassTheCanvas from './components/Collaboration/PassTheCanvas';
import { useCanvasStore } from './stores/canvasStore';
import { useCollaboration } from './hooks/useCollaboration';
import { BACKGROUND_PRESETS } from './utils/colors';

export default function App() {
  const [activePanel, setActivePanel] = useState<PanelTab>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bgMenuOpen, setBgMenuOpen] = useState(false);

  const { background, setBackground, addToGallery } = useCanvasStore();
  const { sendReaction } = useCollaboration();

  const togglePanel = (tab: PanelTab) => {
    setActivePanel((prev) => (prev === tab ? null : tab));
  };

  const handleExportPNG = () => {
    const konvaStage = Konva.stages[0];
    if (konvaStage) {
      const uri = konvaStage.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `playspace-canvas-${Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSaveToGallery = () => {
    const konvaStage = Konva.stages[0];
    if (konvaStage) {
      const thumbnail = konvaStage.toDataURL({ pixelRatio: 0.3 });
      addToGallery(thumbnail);
    }
  };

  const REACTION_EMOJIS = ['👏', '🎨', '✨', '😂'];

  return (
    <div className="w-full h-full flex overflow-hidden bg-cream">
      {/* Left toolbar */}
      <Toolbar />

      {/* Main canvas area */}
      <div className="flex-1 relative">
        <Canvas />

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 z-20">
          {/* Background selector */}
          <div className="relative">
            <button
              onClick={() => setBgMenuOpen(!bgMenuOpen)}
              className="px-3 py-1.5 rounded-xl border-3 border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-bold font-display text-gray-700 hover:bg-white cursor-pointer shadow"
              style={{ borderWidth: '3px' }}
            >
              🎨 Background
            </button>
            {bgMenuOpen && (
              <div className="absolute top-full mt-1 left-0 bg-white rounded-xl border-3 border-gray-300 shadow-xl p-2 space-y-1" style={{ borderWidth: '3px' }}>
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => { setBackground(bg.color); setBgMenuOpen(false); }}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs font-display font-bold cursor-pointer transition-colors ${
                      background === bg.color ? 'bg-electric-blue/10 text-electric-blue' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-5 h-5 rounded border-2 border-gray-300" style={{ backgroundColor: bg.color }} />
                    {bg.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center panel toggle buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => togglePanel('stickers')}
              className={`px-3 py-1.5 rounded-xl border-3 text-xs font-bold font-display cursor-pointer shadow transition-colors ${
                activePanel === 'stickers'
                  ? 'bg-hot-pink text-white border-pink-600'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 hover:bg-white'
              }`}
              style={{ borderWidth: '3px' }}
            >
              ⭐ Stickers
            </button>
            <button
              onClick={() => togglePanel('layers')}
              className={`px-3 py-1.5 rounded-xl border-3 text-xs font-bold font-display cursor-pointer shadow transition-colors ${
                activePanel === 'layers'
                  ? 'bg-lime text-white border-green-600'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 hover:bg-white'
              }`}
              style={{ borderWidth: '3px' }}
            >
              📑 Layers
            </button>
            <button
              onClick={() => togglePanel('wallpaper')}
              className={`px-3 py-1.5 rounded-xl border-3 text-xs font-bold font-display cursor-pointer shadow transition-colors ${
                activePanel === 'wallpaper'
                  ? 'bg-purple-500 text-white border-purple-700'
                  : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-300 hover:bg-white'
              }`}
              style={{ borderWidth: '3px' }}
            >
              🧱 Wallpaper
            </button>
          </div>

          {/* Right side - users & actions */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji, Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2, window.innerHeight * 0.3)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-gray-200 bg-white/90 hover:scale-125 transition-transform cursor-pointer text-sm"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300" />

            <button
              onClick={handleSaveToGallery}
              className="px-3 py-1.5 rounded-xl border-3 border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-bold font-display text-gray-700 hover:bg-white cursor-pointer shadow"
              style={{ borderWidth: '3px' }}
              title="Save to Gallery"
            >
              💾 Save
            </button>
            <button
              onClick={handleExportPNG}
              className="px-3 py-1.5 rounded-xl border-3 border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-bold font-display text-gray-700 hover:bg-white cursor-pointer shadow"
              style={{ borderWidth: '3px' }}
              title="Export as PNG"
            >
              📥 Export
            </button>
            <button
              onClick={() => setGalleryOpen(true)}
              className="px-3 py-1.5 rounded-xl border-3 border-gray-300 bg-white/90 backdrop-blur-sm text-xs font-bold font-display text-gray-700 hover:bg-white cursor-pointer shadow"
              style={{ borderWidth: '3px' }}
              title="View Gallery"
            >
              🖼 Gallery
            </button>

            <div className="w-px h-6 bg-gray-300" />

            <UserPresence />
          </div>
        </div>
      </div>

      {/* Unified right panel */}
      <RightPanel activeTab={activePanel} onClose={() => setActivePanel(null)} />
      <GalleryView isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />

      {/* Overlays */}
      <ReactionOverlay />
      <PassTheCanvas />
    </div>
  );
}
