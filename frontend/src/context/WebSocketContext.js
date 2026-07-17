import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children, user }) => {
    const [isConnected,           setIsConnected]           = useState(false);
    const [scanLogs,              setScanLogs]              = useState([]);
    const [scanProgress,          setScanProgress]          = useState(0);
    const [activeScan,            setActiveScan]            = useState(null);
    const [scanResults,           setScanResults]           = useState(null);
    const [scheduledScanNotice,   setScheduledScanNotice]   = useState(null);
    const socketRef = useRef(null);

    const dismissNotice = useCallback(() => setScheduledScanNotice(null), []);

    useEffect(() => {
        if (!user) return;

        socketRef.current = io('http://localhost:5000', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            setIsConnected(true);
            const token = localStorage.getItem('token');
            if (token) {
                socket.emit('authenticate', { token, user_id: user.id });
            }
        });

        socket.on('authenticated', () => {
        });

        socket.on('scan_log', (data) => {
            setScanLogs(prev => [{
                msg:  data.message,
                type: data.type,
                time: data.timestamp,
            }, ...prev]);
        });

        socket.on('scan_progress', (data) => {
            setScanProgress(data.progress);
        });

        socket.on('scan_started', (data) => {
            setActiveScan(data);
            setScanLogs([]);
            setScanProgress(0);
            setScanResults(null);
        });

        socket.on('scan_complete', (data) => {
            setScanResults(data.results);
            setActiveScan(null);
        });

        socket.on('scan_error', (data) => {
            console.error('Scan error:', data.error);
            setActiveScan(null);
        });

        socket.on('scheduled_scan_started', (data) => {
            setScheduledScanNotice({ url: data.url, scanId: data.scan_id });
        });

        socket.on('disconnect', (reason) => {
            setIsConnected(false);
            if (reason === 'io server disconnect') socket.connect();
        });

        socket.on('connect_error', () => setIsConnected(false));

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [user]);

    const startScan = (url) => {
        if (!socketRef.current || !isConnected) {
            alert('WebSocket not connected. Please refresh the page.');
            return;
        }
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Not authenticated. Please login again.');
            return;
        }
        socketRef.current.emit('start_scan', { url, user_id: user.id, token });
    };

    const clearLogs = () => setScanLogs([]);

    return (
        <WebSocketContext.Provider value={{
            isConnected,
            scanLogs,
            scanProgress,
            activeScan,
            scanResults,
            scheduledScanNotice,
            dismissNotice,
            startScan,
            clearLogs,
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};