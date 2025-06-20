import { useCallback, useEffect, useRef, useState } from 'react';

export enum WebSocketReadyState {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}

export interface UseWebSocketOptions {
    onOpen?: (ws: WebSocket) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent, reconnect: () => void) => void;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    reconnectBackoffFactor?: number;
    maxReconnectInterval?: number;
    protocols?: string | string[];
    shouldReconnect?: (event: CloseEvent) => boolean;
    heartbeatInterval?: number;
    heartbeatMessage?: string | (() => string);
    debug?: boolean;
}

export interface UseWebSocketReturn {
    wsRef: React.MutableRefObject<WebSocket | null>;
    connectWebSocket: () => void;
    disconnect: () => void;
    sendMessage: (message: string | ArrayBuffer | Blob) => boolean;
    readyState: WebSocketReadyState;
    reconnectAttempts: number;
    isConnected: boolean;
}

const useWebSocket = (
    url: string | null,
    options: UseWebSocketOptions = {}
): UseWebSocketReturn => {
    const {
        onOpen,
        onMessage,
        onError,
        onClose,
        reconnectInterval = 1000,
        maxReconnectAttempts = 5,
        reconnectBackoffFactor = 1.5,
        maxReconnectInterval = 30000,
        protocols,
        shouldReconnect = (event) => !event.wasClean && event.code !== 1000,
        heartbeatInterval,
        heartbeatMessage = 'ping',
        debug = false
    } = options;

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const heartbeatTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const isManuallyClosedRef = useRef(false);
    const currentReconnectIntervalRef = useRef(reconnectInterval);

    const [readyState, setReadyState] = useState<WebSocketReadyState>(WebSocketReadyState.CLOSED);
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const log = useCallback((message: string, data?: unknown) => {
        if (debug) {
            console.log(`[useWebSocket] ${message}`, data || '');
        }
    }, [debug]);

    const clearTimeouts = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }
        if (heartbeatTimeoutRef.current) {
            clearTimeout(heartbeatTimeoutRef.current);
            heartbeatTimeoutRef.current = null;
        }
    }, []);

    const startHeartbeat = useCallback(() => {
        if (!heartbeatInterval || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        heartbeatTimeoutRef.current = window.setTimeout(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                const message = typeof heartbeatMessage === 'function' ? heartbeatMessage() : heartbeatMessage;
                wsRef.current.send(message);
                log('Heartbeat sent:', message);
                startHeartbeat();
            }
        }, heartbeatInterval);
    }, [heartbeatInterval, heartbeatMessage, log]);

    const connectWebSocket = useCallback(() => {
        if (!url) {
            log('No URL provided, skipping connection');
            return;
        }

        if (wsRef.current?.readyState === WebSocket.CONNECTING ||
            wsRef.current?.readyState === WebSocket.OPEN) {
            log('WebSocket already connecting or connected');
            return;
        }

        clearTimeouts();
        isManuallyClosedRef.current = false;

        try {
            log('Connecting to:', url);
            setReadyState(WebSocketReadyState.CONNECTING);

            wsRef.current = protocols
                ? new WebSocket(url, protocols)
                : new WebSocket(url);
        } catch (error) {
            log('Could not create WebSocket:', error);
            setReadyState(WebSocketReadyState.CLOSED);
            return;
        }

        const ws = wsRef.current;

        ws.onopen = () => {
            log('WebSocket connected');
            setReadyState(WebSocketReadyState.OPEN);
            reconnectAttemptsRef.current = 0;
            setReconnectAttempts(0);
            currentReconnectIntervalRef.current = reconnectInterval;

            startHeartbeat();
            onOpen?.(ws);
        };

        ws.onmessage = (event) => {
            log('Message received:', event.data);
            onMessage?.(event);
        };

        ws.onerror = (event) => {
            log('WebSocket error:', event);
            onError?.(event);
        };

        ws.onclose = (event) => {
            log('WebSocket disconnected:', `${event.code} ${event.reason}`);
            setReadyState(WebSocketReadyState.CLOSED);
            clearTimeouts();

            if (!isManuallyClosedRef.current && shouldReconnect(event)) {
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current++;
                    setReconnectAttempts(reconnectAttemptsRef.current);

                    log('Reconnecting...', `attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);

                    reconnectTimeoutRef.current = window.setTimeout(() => {
                        connectWebSocket();
                    }, currentReconnectIntervalRef.current);

                    currentReconnectIntervalRef.current = Math.min(
                        currentReconnectIntervalRef.current * reconnectBackoffFactor,
                        maxReconnectInterval
                    );
                } else {
                    log('Max reconnection attempts reached');
                }
            }

            onClose?.(event, connectWebSocket);
        };
    }, [
        url,
        protocols,
        onOpen,
        onMessage,
        onError,
        onClose,
        shouldReconnect,
        maxReconnectAttempts,
        reconnectInterval,
        reconnectBackoffFactor,
        maxReconnectInterval,
        startHeartbeat,
        clearTimeouts,
        log
    ]);

    const disconnect = useCallback(() => {
        log('Manually disconnecting...');
        isManuallyClosedRef.current = true;
        clearTimeouts();

        if (wsRef.current) {
            setReadyState(WebSocketReadyState.CLOSING);
            wsRef.current.close(1000, 'Manual disconnect');
        }
    }, [clearTimeouts, log]);

    const sendMessage = useCallback((message: string | ArrayBuffer | Blob): boolean => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            try {
                wsRef.current.send(message);
                log('Message sent:', message);
                return true;
            } catch (error) {
                log('Failed to send message:', error);
                return false;
            }
        } else {
            log('Cannot send message: WebSocket not connected');
            return false;
        }
    }, [log]);

    useEffect(() => {
        if (url) {
            connectWebSocket();
        }

        return () => {
            log('Cleaning up WebSocket connection...');
            isManuallyClosedRef.current = true;
            clearTimeouts();

            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounting');
            }
        };
    }, [url, connectWebSocket, clearTimeouts, log]);

    return {
        wsRef,
        connectWebSocket,
        disconnect,
        sendMessage,
        readyState,
        reconnectAttempts,
        isConnected: readyState === WebSocketReadyState.OPEN
    };
};

export default useWebSocket;