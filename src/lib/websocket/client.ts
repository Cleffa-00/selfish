import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

type MessageHandler = (data: any) => void;

export function useWebSocket(roomCode: string, userId?: string, userName?: string) {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef<WebSocket | null>(null);
    const handlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        // Don't connect if essential data is missing
        if (!userId || !roomCode || !userName) {
            console.log('Waiting for session data...');
            return;
        }

        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        console.log('Connecting to WebSocket...', { userId, userName, roomCode });
        const ws = new WebSocket(WS_URL);

        ws.onopen = () => {
            console.log('✅ WebSocket Connected');
            setIsConnected(true);

            // Send join message immediately
            const joinMessage = {
                type: 'JOIN_ROOM',
                code: roomCode,
                userId,
                name: userName,
                isHost: false
            };
            console.log('Sending JOIN_ROOM message:', joinMessage);
            ws.send(JSON.stringify(joinMessage));
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('📨 Received message:', message);
                const handlers = handlersRef.current.get(message.type);
                if (handlers) {
                    handlers.forEach(handler => handler(message.data));
                }
            } catch (e) {
                console.error('Failed to parse WebSocket message', e);
            }
        };

        ws.onclose = () => {
            console.log('🔴 WebSocket Disconnected');
            setIsConnected(false);
            wsRef.current = null;

            // Auto reconnect
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('🔄 Attempting to reconnect...');
                connect();
            }, 3000);
        };

        ws.onerror = (error) => {
            console.error('❌ WebSocket Error:', error);
            console.error('WebSocket URL:', WS_URL);
            console.error('WebSocket readyState:', ws.readyState);
            ws.close();
        };

        wsRef.current = ws;
    }, [roomCode, userId, userName]);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendMessage = useCallback((type: string, data: any = {}) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type, ...data }));
        } else {
            console.warn('WebSocket not connected, cannot send message', type);
        }
    }, []);

    const on = useCallback((type: string, handler: MessageHandler) => {
        if (!handlersRef.current.has(type)) {
            handlersRef.current.set(type, new Set());
        }
        handlersRef.current.get(type)?.add(handler);

        return () => {
            handlersRef.current.get(type)?.delete(handler);
        };
    }, []);

    return { isConnected, sendMessage, on };
}
