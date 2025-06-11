import {useCallback, useEffect, useRef} from 'react';

interface UseWebSocketOptions {
    onOpen?: (ws: WebSocket) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent, reconnect: () => void) => void;
    reconnectInterval?: number;
}

const useWebSocket = (url: string, options: UseWebSocketOptions = {}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);

    const connectWebSocket = useCallback(() => {
        const {onOpen, onMessage, onError, onClose, reconnectInterval = 1000} = options;

        try {
            wsRef.current = new WebSocket(url);
        } catch (error) {
            console.error('Could not open the WebSocket:', error);
            return;
        }

        const ws = wsRef.current;

        ws.onopen = () => {
            console.log('WebSocket connected');
            onOpen?.(ws);
        };

        ws.onmessage = (event) => {
            onMessage?.(event);
        };

        ws.onerror = (event) => {
            console.error('WebSocket error:', event);
            onError?.(event);
        };

        ws.onclose = (event) => {
            console.log('WebSocket disconnected:', event);

            if (!event.wasClean) {
                console.log('Reconnecting WebSocket...');
                reconnectTimeoutRef.current = window.setTimeout(connectWebSocket, reconnectInterval);
            }

            onClose?.(event, connectWebSocket);
        };
    }, [url, options]);

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            if (wsRef.current) {
                console.log('Cleaning up WebSocket connection...');
                wsRef.current.close();
            }
        };
    }, [url, options]);

    return { wsRef, connectWebSocket };
};

export default useWebSocket;
