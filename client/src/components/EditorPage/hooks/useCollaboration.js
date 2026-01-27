import { useEffect, useRef, useState, useCallback } from 'react';

export function useCollaboration(projectId) {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userCursors, setUserCursors] = useState({}); // Map of userId -> cursor position
  const [myColor, setMyColor] = useState('#4ECDC4');
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(() => {
    if (!projectId) return;

    // 1. Prevent duplicate connections if already connected or connecting
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    // 2. Get Token (Check Session first, then Local for "Remember Me")
    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
        console.warn("No access token found, skipping WebSocket connection.");
        return;
    }

    // 3. Initialize WebSocket
    const ws = new WebSocket('ws://localhost:8000/ws/collab');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);

      // Send join message
      ws.send(JSON.stringify({
        type: 'join',
        projectId,
        token
      }));
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'users':
            // Initial load of all users
            setOnlineUsers(message.users);
            setMyColor(message.yourColor);
            break;

          case 'user-joined':
            // Add new user (Deduping check to be safe)
            setOnlineUsers(prev => {
                // If user already exists in list, don't add again
                if (prev.some(u => u.userId === message.user.userId)) return prev;
                return [...prev, message.user];
            });
            break;

          case 'user-left':
            // Remove user
            setOnlineUsers(prev => prev.filter(u => u.userId !== message.userId));
            // Remove their cursor
            setUserCursors(prev => {
              const next = { ...prev };
              delete next[message.userId];
              return next;
            });
            break;

          case 'cursor':
            // Update specific user's cursor
            setUserCursors(prev => ({
              ...prev,
              [message.userId]: { 
                ...message.cursor, 
                color: message.color 
              }
            }));
            break;

          case 'code-change':
            // Optional: Handle incoming code changes here
            break;

          case 'file-select':
            // Optional: Handle file selection events
            break;

          case 'error':
            console.error('WebSocket backend error:', message.message);
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
      setOnlineUsers([]);
      setUserCursors({});
      
      // Only attempt reconnect if the socket wasn't manually closed (ref still exists)
      if (wsRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connect();
          }, 3000);
      }
    };

    ws.onerror = (error) => {
      // WebSocket errors are often silent in JS, console log helps debugging
      console.error('WebSocket connection error:', error);
    };

  }, [projectId]);

  // --- SEND FUNCTIONS ---

  const sendCursor = useCallback((line, column, fileId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'cursor',
        line,
        column,
        fileId
      }));
    }
  }, []);

  const sendCodeChange = useCallback((fileId, changes) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'code-change',
        fileId,
        changes
      }));
    }
  }, []);

  const sendFileSelect = useCallback((fileId) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'file-select',
        fileId
      }));
    }
  }, []);

  // --- CLEANUP EFFECT ---

  useEffect(() => {
    connect();

    return () => {
      // 1. Clear any pending reconnection timer
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // 2. Close WebSocket properly
      if (wsRef.current) {
        wsRef.current.onclose = null; 
        
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  return {
    isConnected,
    onlineUsers,
    userCursors,
    myColor,
    sendCursor,
    sendCodeChange,
    sendFileSelect
  };
}