import React from 'react';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function PassTheCanvas() {
  const { isPassTheCanvasMode, setPassTheCanvasMode, currentTurnUserId, localUserId } = useCollaborationStore();

  if (!isPassTheCanvasMode) return null;

  const isMyTurn = currentTurnUserId === localUserId;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-cream/95 backdrop-blur rounded-2xl border-3 border-gray-300 shadow-xl px-6 py-3 flex items-center gap-4" style={{ borderWidth: '3px' }}>
      <div className="text-sm font-display font-bold text-gray-800">
        {isMyTurn ? "🎨 It's your turn to draw!" : "⏳ Waiting for your turn..."}
      </div>
      <button
        onClick={() => setPassTheCanvasMode(false)}
        className="text-xs px-3 py-1 rounded-lg border-2 border-gray-300 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer font-display"
      >
        Exit
      </button>
    </div>
  );
}
