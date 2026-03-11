let ws: WebSocket | null = null;
let localUserId = '';

export function setMultiplayerSocket(socket: WebSocket | null) {
  ws = socket;
}

export function setMultiplayerUserId(userId: string) {
  localUserId = userId;
}

export function broadcast(data: Record<string, unknown>) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ ...data, userId: localUserId }));
  }
}

export function broadcastCursor(x: number, y: number) {
  broadcast({ type: 'cursor', x, y });
}

export function broadcastDrawEnd(line: unknown) {
  broadcast({ type: 'draw-end', line });
}

export function broadcastStickerAdd(sticker: unknown) {
  broadcast({ type: 'sticker-add', sticker });
}

export function broadcastStickerUpdate(stickerId: string, props: unknown) {
  broadcast({ type: 'sticker-update', stickerId, props });
}

export function broadcastStickerRemove(stickerId: string) {
  broadcast({ type: 'sticker-remove', stickerId });
}
