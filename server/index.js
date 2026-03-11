import { WebSocketServer } from 'ws';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

const rooms = new Map();

wss.on('connection', (ws) => {
  let currentRoom = null;
  let userId = null;

  ws.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }

    if (msg.type === 'join') {
      currentRoom = msg.room;
      userId = msg.userId;

      if (!rooms.has(currentRoom)) {
        rooms.set(currentRoom, new Map());
      }
      const room = rooms.get(currentRoom);
      room.set(ws, { userId: msg.userId, name: msg.name, color: msg.color });

      const existingUsers = [];
      for (const [client, info] of room.entries()) {
        if (client !== ws && client.readyState === 1) {
          existingUsers.push(info);
          client.send(JSON.stringify({
            type: 'user-joined',
            userId: msg.userId,
            name: msg.name,
            color: msg.color,
          }));
        }
      }

      ws.send(JSON.stringify({
        type: 'room-state',
        users: existingUsers,
      }));
      return;
    }

    if (!currentRoom || !rooms.has(currentRoom)) return;

    const room = rooms.get(currentRoom);
    for (const [client] of room.entries()) {
      if (client !== ws && client.readyState === 1) {
        client.send(raw.toString());
      }
    }
  });

  ws.on('close', () => {
    if (currentRoom && rooms.has(currentRoom)) {
      const room = rooms.get(currentRoom);
      room.delete(ws);

      if (room.size === 0) {
        rooms.delete(currentRoom);
      } else if (userId) {
        for (const [client] of room.entries()) {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'user-left', userId }));
          }
        }
      }
    }
  });
});

console.log(`[PlaySpace] WebSocket server running on port ${PORT}`);
