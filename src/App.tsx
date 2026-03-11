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
      link.download = `playspace-${Date.now()}.png`;
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

  const topBtnBase = `
    flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
    transition-all duration-150 cursor-pointer select-none
    border border-[rgba(255,255,255,0.12)]
    bg-[rgba(30,30,46,0.75)] text-[rgba(255,255,255,0.75)]
    hover:bg-[rgba(30,30,46,0.95)] hover:text-white hover:border-[rgba(255,255,255,0.2)]
    backdrop-blur-xl
  `;

  const panelBtnActive = (active: boolean, activeColor: string) =>
    active
      ? `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer select-none border ${activeColor} backdrop-blur-xl`
      : topBtnBase;

  return (
    <div className="w-full h-full flex overflow-hidden" style={{ background: '#F7F6F3' }}>
      <Toolbar />

      <div className="flex-1 relative">
        <Canvas />

        {/* Top bar — floating glass pill */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">

          {/* Left — Background selector */}
          <div className="relative pointer-events-auto">
            <button
              onClick={() => setBgMenuOpen(!bgMenuOpen)}
              className={topBtnBase}
            >
              <span>🎨</span>
              <span>Background</span>
            </button>
            {bgMenuOpen && (
              <div
                className="absolute top-full mt-2 left-0 rounded-xl shadow-2xl p-2 space-y-0.5 min-w-[140px]"
                style={{
                  background: '#1E1E2E',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {BACKGROUND_PRESETS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => { setBackground(bg.color); setBgMenuOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      background === bg.color
                        ? 'bg-accent/20 text-accent'
                        : 'text-[rgba(255,255,255,0.65)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded flex-shrink-0"
                      style={{ backgroundColor: bg.color, border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                    {bg.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Center — Panel toggles */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={() => togglePanel('stickers')}
              className={panelBtnActive(
                activePanel === 'stickers',
                'border-pink/40 bg-pink/20 text-pink'
              )}
            >
              <span>⭐</span> Stickers
            </button>
            <button
              onClick={() => togglePanel('layers')}
              className={panelBtnActive(
                activePanel === 'layers',
                'border-teal/40 bg-teal/20 text-teal'
              )}
            >
              <span>📑</span> Layers
            </button>
            <button
              onClick={() => togglePanel('wallpaper')}
              className={panelBtnActive(
                activePanel === 'wallpaper',
                'border-accent-2/40 bg-accent-2/20 text-accent-2'
              )}
            >
              <span>🧱</span> Wallpaper
            </button>
          </div>

          {/* Right — Reactions + Actions + Presence */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Reactions */}
            <div
              className="flex items-center gap-1 px-1.5 py-1 rounded-xl"
              style={{ background: 'rgba(30,30,46,0.75)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
            >
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji, Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2, window.innerHeight * 0.3)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 hover:scale-125 transition-all cursor-pointer text-sm"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.1)' }} />

            {/* Actions */}
            <button onClick={handleSaveToGallery} className={topBtnBase} title="Save to Gallery">
              <span>💾</span> Save
            </button>
            <button onClick={handleExportPNG} className={topBtnBase} title="Export as PNG">
              <span>📥</span> Export
            </button>
            <button onClick={() => setGalleryOpen(true)} className={topBtnBase} title="View Gallery">
              <span>🖼</span> Gallery
            </button>

            <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.1)' }} />

            <UserPresence />
          </div>
        </div>
      </div>

      <RightPanel activeTab={activePanel} onClose={() => setActivePanel(null)} />
      <GalleryView isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />

      <ReactionOverlay />
      <PassTheCanvas />
    </div>
  );
}
