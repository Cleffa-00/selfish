import { WebSocketServer, WebSocket } from 'ws';
import { RoomManager } from './websocket/RoomManager';
import { parse } from 'url';

const wss = new WebSocketServer({
    port: 3001,
});

const roomManager = new RoomManager();

console.log('✅ WebSocket Server listening on ws://localhost:3001');

wss.on('connection', (ws, req) => {
    const { query } = parse(req.url || '', true);
    // console.log('New connection', query);

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());

            switch (data.type) {
                case 'JOIN_ROOM':
                    // data: { code, userId, name }
                    // Ensure room exists (or create it if it's the first join? 
                    // Usually room is created via API first. 
                    // For simplicity, we'll auto-create if it doesn't exist in memory but should exist in DB)
                    // For now, just create it if missing to sync with DB
                    if (data.isHost) { // Or just always try to create
                        roomManager.createRoom(data.code, data.userId);
                    }
                    roomManager.joinRoom(data.code, data.userId, data.name, ws as any);
                    break;

                case 'TOGGLE_READY':
                    if ((ws as any).roomId && (ws as any).userId) {
                        roomManager.toggleReady((ws as any).roomId, (ws as any).userId);
                    }
                    break;

                case 'START_GAME':
                    if ((ws as any).roomId && (ws as any).userId) {
                        roomManager.startGame((ws as any).roomId, (ws as any).userId);
                    }
                    break;

                case 'PING':
                    ws.send(JSON.stringify({ type: 'PONG' }));
                    break;
            }
        } catch (e) {
            console.error('Error handling message:', e);
        }
    });

    ws.on('close', () => {
        roomManager.handleDisconnect(ws as any);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM');
    wss.close();
});

