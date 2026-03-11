import { useCallback, useEffect, useRef } from 'react';
import { useCollaborationStore } from '../stores/collaborationStore';
import { useCanvasStore } from '../stores/canvasStore';
import { setMultiplayerSocket, setMultiplayerUserId } from '../utils/multiplayer';
import type { Reaction } from '../stores/collaborationStore';

let globalWs: WebSocket | null = null;

export function useCollaboration() {
  const wsRef = useRef<WebSocket | null>(null);
  const {
    addUser, removeUser, updateUserCursor, addReaction,
    localUserId, localUserName, localUserColor,
    setConnected, setRoomId, setUsers,
  } = useCollaborationStore();

  const {
    addRemoteLine, addRemoteSticker, updateRemoteSticker, removeRemoteSticker,
    setBackground: setCanvasBackground,
    setRemoteCurrentLine, updateRemoteCurrentLine, removeRemoteCurrentLine,
  } = useCanvasStore();

  useEffect(() => {
    setMultiplayerUserId(localUserId);
  }, [localUserId]);

  const connect = useCallback((roomId: string) => {
    if (globalWs && globalWs.readyState <= 1) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const wsUrl = `${protocol}//${host}:8080`;

    const ws = new WebSocket(wsUrl);
    globalWs = ws;
    wsRef.current = ws;
    setMultiplayerSocket(ws);

    ws.onopen = () => {
      setConnected(true);
      setRoomId(roomId);
      ws.send(JSON.stringify({
        type: 'join',
        room: roomId,
        userId: localUserId,
        name: localUserName || 'Anonymous',
        color: localUserColor,
      }));
    };

    ws.onmessage = (event) => {
      let msg;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }

      switch (msg.type) {
        case 'room-state':
          if (msg.users && Array.isArray(msg.users)) {
            const collabUsers = msg.users.map((u: { userId: string; name: string; color: string }) => ({
              id: u.userId,
              name: u.name,
              color: u.color,
              cursorX: 0,
              cursorY: 0,
            }));
            setUsers(collabUsers);
          }
          break;

        case 'user-joined':
          addUser({
            id: msg.userId,
            name: msg.name,
            color: msg.color,
            cursorX: 0,
            cursorY: 0,
          });
          break;

        case 'user-left':
          removeUser(msg.userId);
          removeRemoteCurrentLine(msg.userId);
          break;

        case 'cursor':
          updateUserCursor(msg.userId, msg.x, msg.y);
          break;

        case 'draw-start':
          if (msg.line && msg.userId) {
            setRemoteCurrentLine(msg.userId, msg.line);
          }
          break;

        case 'draw-update':
          if (msg.lineId && msg.userId && msg.points) {
            updateRemoteCurrentLine(msg.userId, msg.lineId, msg.points, msg.particles);
          }
          break;

        case 'draw-end':
          if (msg.line && msg.userId) {
            removeRemoteCurrentLine(msg.userId);
            addRemoteLine(msg.line);
          }
          break;

        case 'sticker-add':
          if (msg.sticker) {
            addRemoteSticker(msg.sticker);
          }
          break;

        case 'sticker-update':
          if (msg.stickerId && msg.props) {
            updateRemoteSticker(msg.stickerId, msg.props);
          }
          break;

        case 'sticker-remove':
          if (msg.stickerId) {
            removeRemoteSticker(msg.stickerId);
          }
          break;

        case 'background-change':
          if (msg.background) {
            setCanvasBackground(msg.background);
          }
          break;

        case 'reaction':
          if (msg.reaction) {
            addReaction(msg.reaction);
          }
          break;
      }
    };

    ws.onclose = () => {
      setConnected(false);
      globalWs = null;
      wsRef.current = null;
      setMultiplayerSocket(null);
    };

    ws.onerror = () => {
      setConnected(false);
    };
  }, [localUserId, localUserName, localUserColor, setConnected, setRoomId,
      addUser, removeUser, updateUserCursor, addRemoteLine, addRemoteSticker,
      updateRemoteSticker, removeRemoteSticker, setCanvasBackground, addReaction, setUsers,
      setRemoteCurrentLine, updateRemoteCurrentLine, removeRemoteCurrentLine]);

  const disconnect = useCallback(() => {
    if (globalWs) {
      globalWs.close();
      globalWs = null;
    }
    wsRef.current = null;
    setMultiplayerSocket(null);
    setConnected(false);
    setRoomId(null);
    setUsers([]);
  }, [setConnected, setRoomId, setUsers]);

  const send = useCallback((data: unknown) => {
    const ws = globalWs;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }, []);

  const broadcastBackground = useCallback((background: string) => {
    send({ type: 'background-change', userId: localUserId, background });
  }, [send, localUserId]);

  const sendReaction = useCallback((emoji: string, x: number, y: number) => {
    const reaction: Reaction = {
      id: `reaction-${Date.now()}`,
      emoji,
      x,
      y,
      userId: localUserId,
    };
    addReaction(reaction);
    send({ type: 'reaction', userId: localUserId, reaction });
  }, [addReaction, send, localUserId]);

  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (!localUserName || hasConnectedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    let room = params.get('room');
    if (!room) {
      room = Math.random().toString(36).slice(2, 10);
      const url = new URL(window.location.href);
      url.searchParams.set('room', room);
      window.history.replaceState({}, '', url.toString());
    }
    hasConnectedRef.current = true;
    connect(room);
  }, [localUserName, connect]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    connect,
    disconnect,
    broadcastBackground,
    sendReaction,
  };
}
