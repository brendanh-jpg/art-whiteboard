import React, { useState, useCallback } from 'react';
import Konva from 'konva';
import Canvas from './components/Canvas/Canvas';
import Toolbar from './components/Toolbar/Toolbar';
import RightPanel from './components/RightPanel/RightPanel';
import type { PanelTab } from './components/RightPanel/RightPanel';
import GalleryView from './components/Gallery/GalleryView';
import UserPresence from './components/Collaboration/UserPresence';
import ReactionOverlay from './components/Collaboration/ReactionOverlay';
import PassTheCanvas from './components/Collaboration/PassTheCanvas';
import NameEntryModal from './components/Collaboration/NameEntryModal';
import SaveModal from './components/Collaboration/SaveModal';
import { useCanvasStore } from './stores/canvasStore';
import { useCollaborationStore } from './stores/collaborationStore';
import { useCollaboration } from './hooks/useCollaboration';
import { BACKGROUND_PRESETS } from './utils/colors';

export default function App() {
  const [activePanel, setActivePanel] = useState<PanelTab>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [bgMenuOpen, setBgMenuOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);

  const { background, setBackground, addToGallery, newCanvas, lines, stickers } = useCanvasStore();
  const { isConnected, roomId } = useCollaborationStore();
  const { sendReaction, broadcastBackground } = useCollaboration();

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

  const handleSave = useCallback((name: string) => {
    const konvaStage = Konva.stages[0];
    if (konvaStage) {
      const thumbnail = konvaStage.toDataURL({ pixelRatio: 0.3 });
      addToGallery(name, thumbnail);
    }
  }, [addToGallery]);

  const handleNewCanvas = () => {
    if (lines.length === 0 && stickers.length === 0) {
      newCanvas();
      return;
    }
    if (window.confirm('Start a new canvas? Your current work is auto-saved, but unsaved gallery items will be lost.')) {
      newCanvas();
    }
  };

  const handleBackgroundChange = (color: string) => {
    setBackground(color);
    broadcastBackground(color);
    setBgMenuOpen(false);
  };

  const handleShare = () => {
    const url = new URL(window.location.href);
    if (roomId) {
      url.searchParams.set('room', roomId);
    }
    navigator.clipboard.writeText(url.toString()).then(() => {
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }).catch(() => {});
  };

  const REACTION_EMOJIS = ['👏', '🎨', '✨', '😂'];

  const topBtnBase = `
    flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold
    transition-all duration-150 cursor-pointer select-none
    border border-slate-200
    bg-white/80 text-slate-700
    hover:bg-white hover:text-slate-900 hover:border-slate-300
    backdrop-blur-xl shadow-sm
  `;

  const panelBtnActive = (active: boolean, activeColor: string) =>
    active
      ? `flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer select-none border ${activeColor} backdrop-blur-xl shadow-sm`
      : topBtnBase;

  return (
    <div className="w-full h-full flex overflow-hidden" style={{ background: '#FFFFFF' }}>
      <Toolbar />

      <div className="flex-1 h-full relative">
        <Canvas />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-20 pointer-events-none">

          <div className="flex items-center gap-1.5 pointer-events-auto">
            <div className="relative">
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
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                  }}
                >
                  {BACKGROUND_PRESETS.map((bg) => (
                    <button
                      key={bg.id}
                      onClick={() => handleBackgroundChange(bg.color)}
                      className={`flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        background === bg.color
                          ? 'bg-accent/20 text-accent'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded flex-shrink-0"
                        style={{ backgroundColor: bg.color, border: '1px solid rgba(0,0,0,0.1)' }}
                      />
                      {bg.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleNewCanvas} className={topBtnBase} title="New Canvas">
              <span>📄</span> New
            </button>
          </div>

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

          <div className="flex items-center gap-2 pointer-events-auto">
            <div
              className="flex items-center gap-1 px-1.5 py-1 rounded-xl shadow-sm"
              style={{ background: 'rgba(255,255,255,0.80)', border: '1px solid rgba(0,0,0,0.08)', backdropFilter: 'blur(20px)' }}
            >
              {REACTION_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji, Math.random() * window.innerWidth * 0.6 + window.innerWidth * 0.2, window.innerHeight * 0.3)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 hover:scale-125 transition-all cursor-pointer text-sm"
                  title={`React with ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="w-px h-5" style={{ background: 'rgba(0,0,0,0.1)' }} />

            <button onClick={() => setSaveModalOpen(true)} className={topBtnBase} title="Save to Gallery">
              <span>💾</span> Save
            </button>
            <button onClick={handleExportPNG} className={topBtnBase} title="Export as PNG">
              <span>📥</span> Export
            </button>
            <button onClick={() => setGalleryOpen(true)} className={topBtnBase} title="View Gallery">
              <span>🖼</span> Gallery
            </button>

            <div className="w-px h-5" style={{ background: 'rgba(0,0,0,0.1)' }} />

            <div className="relative">
              <button onClick={handleShare} className={topBtnBase} title="Share room link">
                <span>🔗</span> Share
              </button>
              {shareTooltip && (
                <div
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white whitespace-nowrap"
                  style={{ background: '#34D399' }}
                >
                  Link copied!
                </div>
              )}
            </div>

            {isConnected && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold text-emerald-600" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live
              </div>
            )}

            <UserPresence />
          </div>
        </div>
      </div>

      <RightPanel activeTab={activePanel} onClose={() => setActivePanel(null)} />
      <GalleryView isOpen={galleryOpen} onClose={() => setGalleryOpen(false)} />
      <SaveModal isOpen={saveModalOpen} onClose={() => setSaveModalOpen(false)} onSave={handleSave} />

      <ReactionOverlay />
      <PassTheCanvas />
      <NameEntryModal />
    </div>
  );
}
