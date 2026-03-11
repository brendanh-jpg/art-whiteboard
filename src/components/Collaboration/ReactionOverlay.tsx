import React, { useEffect } from 'react';
import { useCollaborationStore } from '../../stores/collaborationStore';

export default function ReactionOverlay() {
  const reactions = useCollaborationStore((s) => s.reactions);
  const removeReaction = useCollaborationStore((s) => s.removeReaction);

  useEffect(() => {
    // Auto-remove reactions after 2 seconds
    reactions.forEach((r) => {
      const timer = setTimeout(() => removeReaction(r.id), 2000);
      return () => clearTimeout(timer);
    });
  }, [reactions, removeReaction]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {reactions.map((r) => (
        <div
          key={r.id}
          className="absolute text-3xl reaction-float"
          style={{ left: r.x, top: r.y }}
        >
          {r.emoji}
        </div>
      ))}
    </div>
  );
}
