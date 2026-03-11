import { useCallback } from 'react';
import { useCollaborationStore } from '../stores/collaborationStore';
import type { Reaction } from '../stores/collaborationStore';

/**
 * Collaboration hook - stubbed interface for real-time transport.
 * Replace the internals with Socket.IO / Liveblocks / etc.
 */
export function useCollaboration() {
  const { addUser, removeUser, updateUserCursor, addReaction, removeReaction, setPassTheCanvasMode, setCurrentTurn } = useCollaborationStore();

  const connect = useCallback((_roomId: string) => {
    // Stub: connect to real-time service
    console.log('[Collab] Connect stub');
  }, []);

  const disconnect = useCallback(() => {
    // Stub: disconnect from real-time service
    console.log('[Collab] Disconnect stub');
  }, []);

  const broadcastCursor = useCallback((_x: number, _y: number) => {
    // Stub: send cursor position to other users
  }, []);

  const broadcastDrawing = useCallback((_lineData: unknown) => {
    // Stub: broadcast drawing data to other users
  }, []);

  const sendReaction = useCallback((emoji: string, x: number, y: number) => {
    const reaction: Reaction = {
      id: `reaction-${Date.now()}`,
      emoji,
      x,
      y,
      userId: useCollaborationStore.getState().localUserId,
    };
    addReaction(reaction);
    // Stub: broadcast reaction to other users
  }, [addReaction]);

  return {
    connect,
    disconnect,
    broadcastCursor,
    broadcastDrawing,
    sendReaction,
  };
}
