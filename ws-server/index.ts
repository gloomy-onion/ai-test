import { WebSocketServer, WebSocket } from 'ws';

const PORT = 4000;

const connections = new Map<string, Set<WebSocket>>();
const clients = new Map<WebSocket, string>();

const wss = new WebSocketServer({ port: PORT });

const alive = new WeakSet<WebSocket>();

const broadcastPresence = (): void => {
  const online = Array.from(connections.keys());
  const message = JSON.stringify({ type: 'presence', online });

  wss.clients.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
    }
  });
};

const addUser = (socket: WebSocket, userId: string): void => {
  const sockets = connections.get(userId) ?? new Set<WebSocket>();
  sockets.add(socket);
  connections.set(userId, sockets);
  clients.set(socket, userId);
  broadcastPresence();
};

const removeSocket = (socket: WebSocket): void => {
  const userId = clients.get(socket);
  if (!userId) {
    return;
  }

  clients.delete(socket);

  const sockets = connections.get(userId);
  if (!sockets) {
    return;
  }

  sockets.delete(socket);
  if (sockets.size === 0) {
    connections.delete(userId);
  }

  broadcastPresence();
};

wss.on('connection', (socket) => {
  alive.add(socket);

  socket.on('message', (raw) => {
    const message = String(raw);

    try {
      const data = JSON.parse(message) as { type?: string; userId?: string };

      if (data.type === 'join' && data.userId) {
        addUser(socket, data.userId);
      }
    } catch {
      return;
    }
  });

  const heartbeat = setInterval(() => {
    if (!alive.has(socket)) {
      socket.terminate();
      return;
    }

    alive.delete(socket);
    socket.ping();
  }, 30_000);

  socket.on('pong', () => {
    alive.add(socket);
  });

  socket.on('close', () => {
    clearInterval(heartbeat);
    removeSocket(socket);
  });

  socket.on('error', () => {
    clearInterval(heartbeat);
    removeSocket(socket);
  });
});

wss.on('listening', () => {
  console.log(`[ws] presence server listening on ws://localhost:${PORT}`);
});