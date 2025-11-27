import { WebSocket } from 'ws';
import { GameState, RoomState } from '../../lib/game/gameState';

type WebSocketWithId = WebSocket & { userId?: string; roomId?: string };

export class RoomManager {
    private rooms: Map<string, RoomState>;

    constructor() {
        this.rooms = new Map();
    }

    createRoom(code: string, hostId: string) {
        if (this.rooms.has(code)) return;

        this.rooms.set(code, {
            code,
            hostId,
            players: new Map(),
            gameState: null,
            createdAt: new Date()
        });
        console.log(`[RoomManager] Room created: ${code} by ${hostId}`);
    }

    joinRoom(code: string, userId: string, name: string, ws: WebSocketWithId) {
        let room = this.rooms.get(code);

        // Auto-create room if it doesn't exist (Development convenience / Resilience)
        // In production, we might want to verify with DB first, but for now this fixes the restart issue.
        if (!room) {
            console.log(`[RoomManager] Room ${code} not found, auto-creating for ${userId}`);
            this.createRoom(code, userId); // Temporarily assign this user as host?
            room = this.rooms.get(code)!;
        }

        // Prevent joining if game has already started
        if (room.gameState !== null) {
            console.warn(`[RoomManager] Player ${userId} tried to join room ${code} but game already started`);
            ws.send(JSON.stringify({
                type: 'ERROR',
                data: { message: 'Game has already started' }
            }));
            ws.close();
            return;
        }

        // Add player to room
        room.players.set(userId, {
            ws,
            userId,
            name,
            isReady: false
        });

        // Attach metadata to WS connection
        ws.userId = userId;
        ws.roomId = code;

        console.log(`[RoomManager] Player ${name} (${userId}) joined room ${code}`);

        // Broadcast update
        this.broadcastRoomUpdate(code);
    }

    leaveRoom(code: string, userId: string) {
        const room = this.rooms.get(code);
        if (!room) return;

        room.players.delete(userId);
        console.log(`[RoomManager] Player ${userId} left room ${code}`);

        // If game is active, mark player as disconnected instead of removing
        if (room.gameState && room.gameState.players) {
            const playerState = room.gameState.players.find((p: any) => p.userId === userId);
            if (playerState) {
                playerState.isConnected = false;
                console.log(`[RoomManager] Player ${userId} marked as disconnected in active game`);
            }
        }

        if (room.players.size === 0) {
            // Only delete room if game hasn't started
            if (!room.gameState) {
                this.rooms.delete(code);
                console.log(`[RoomManager] Room ${code} deleted (empty)`);
            } else {
                console.log(`[RoomManager] Room ${code} is empty but game is active, keeping room`);
            }
        } else {
            // If host left, assign new host
            if (room.hostId === userId) {
                const nextPlayer = room.players.keys().next().value;
                if (nextPlayer) {
                    room.hostId = nextPlayer;
                    console.log(`[RoomManager] New host for room ${code}: ${nextPlayer}`);
                }
            }
            this.broadcastRoomUpdate(code);
        }
    }

    handleDisconnect(ws: WebSocketWithId) {
        if (ws.roomId && ws.userId) {
            this.leaveRoom(ws.roomId, ws.userId);
        }
    }

    toggleReady(code: string, userId: string) {
        const room = this.rooms.get(code);
        if (!room) return;

        const player = room.players.get(userId);
        if (player) {
            player.isReady = !player.isReady;
            this.broadcastRoomUpdate(code);
        }
    }

    getRoomState(code: string) {
        const room = this.rooms.get(code);
        if (!room) return null;

        // Convert Map to Array for JSON serialization
        return {
            code: room.code,
            hostId: room.hostId,
            players: Array.from(room.players.values()).map((p: any) => ({
                userId: p.userId,
                name: p.name,
                isReady: p.isReady
            })),
            status: room.gameState ? 'PLAYING' : 'WAITING'
        };
    }

    startGame(code: string, userId: string) {
        const room = this.rooms.get(code);
        if (!room) return;

        if (room.hostId !== userId) {
            console.warn(`[RoomManager] User ${userId} tried to start game in room ${code} but is not host`);
            return;
        }

        // Check if all players are ready
        const allReady = Array.from(room.players.values()).every(p => p.isReady);
        if (!allReady) {
            console.warn(`[RoomManager] Cannot start game in room ${code}: not all players ready`);
            return;
        }

        // Import card creation functions
        const { createGameDeck, createSpaceDeck, shuffle } = require('../../lib/game/cards');

        // Create and shuffle decks
        const gameDeck = createGameDeck();
        const spaceDeck = createSpaceDeck();

        // Randomize player order
        const playerArray = Array.from(room.players.values());
        const shuffledPlayers = shuffle(playerArray);

        // Initialize player states with starting hands
        const initialPlayers = shuffledPlayers.map((p: any, _index: number) => {
            // Starting hand: 4x OXYGEN_1 + 1x OXYGEN_2
            const hand = [];

            // Find and remove 4 OXYGEN_1 cards from deck
            for (let i = 0; i < 4; i++) {
                const oxygenIndex = gameDeck.findIndex((card: any) => card.type === 'OXYGEN_1');
                if (oxygenIndex !== -1) {
                    hand.push(gameDeck.splice(oxygenIndex, 1)[0]);
                }
            }

            // Find and remove 1 OXYGEN_2 card from deck
            const oxygen2Index = gameDeck.findIndex((card: any) => card.type === 'OXYGEN_2');
            if (oxygen2Index !== -1) {
                hand.push(gameDeck.splice(oxygen2Index, 1)[0]);
            }

            return {
                userId: p.userId,
                name: p.name,
                position: 0, // Everyone starts at position 0
                oxygen: 6, // Starting oxygen
                hand: hand,
                isDead: false,
                isReady: p.isReady,
                isConnected: true
            };
        });

        // Initialize game state
        room.gameState = {
            roomCode: code,
            players: initialPlayers,
            gameDeck: gameDeck,
            spaceDeck: spaceDeck,
            gameDiscard: [],
            spaceDiscard: [],

            // Game starts in PLAYING phase
            gamePhase: 'PLAYING',

            // First player starts with DRAW phase
            currentTurn: shuffledPlayers[0].userId,
            turnPhase: 'DRAW',

            // Initialize turn tracking
            currentTurnActions: {
                drawnCard: false,
                playedCards: [],
                movedThisTurn: false
            },

            step: 0
        };

        console.log(`[RoomManager] Game initialized in room ${code}`);
        console.log(`  - Game deck: ${gameDeck.length} cards`);
        console.log(`  - Space deck: ${spaceDeck.length} cards`);
        console.log(`  - Players: ${initialPlayers.map((p: any) => p.name).join(', ')}`);
        console.log(`  - First player: ${shuffledPlayers[0].name}`);
        console.log(`  - Initial phase: ${room.gameState.gamePhase} / ${room.gameState.turnPhase}`);

        // Broadcast game started with initial game state
        this.broadcast(code, JSON.stringify({
            type: 'GAME_STARTED',
            data: {
                roomId: code,
                gameState: room.gameState
            }
        }));
    }

    private broadcastRoomUpdate(code: string) {
        const room = this.rooms.get(code);
        if (!room) return;

        const state = this.getRoomState(code);
        const message = JSON.stringify({
            type: 'ROOM_UPDATE',
            data: state
        });

        this.broadcast(code, message);
    }

    broadcast(code: string, message: string) {
        const room = this.rooms.get(code);
        if (!room) return;

        room.players.forEach(player => {
            if (player.ws.readyState === WebSocket.OPEN) {
                player.ws.send(message);
            }
        });
    }
}
