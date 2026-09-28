const WS_URL = 'ws://localhost:4000';

type PresenceMessage = { type: string; online?: string[] };

export const connectWsPresence = (
  userId: string,
  onOnline: (userIds: string[]) => void,
): (() => void) => {
  const socket = new WebSocket(WS_URL);

  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'join', userId }));
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(String(event.data)) as PresenceMessage;

    if (message.type === 'presence') {
      onOnline(message.online ?? []);
    }
  });

  return () => socket.close();
};
