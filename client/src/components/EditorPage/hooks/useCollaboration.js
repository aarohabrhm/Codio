import { useEffect, useRef, useState, useCallback } from 'react';

export function useCollaboration(projectId) {
  const [teamMessages, setTeamMessages] = useState([]);
const [typingUsers, setTypingUsers] = useState([]);

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

  const decoded = JSON.parse(atob(token.split('.')[1]));
  ws.userId = decoded.id;        // ✅ store userId on socket
  wsRef.current.userId = decoded.id;

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
            // ✅ FIX 4: Safety Check - If the joined user is ME, ignore it.
            // (I already know I'm here, and I got the full list via 'users' event)
            if (message.user.userId === wsRef.current?.userId) return;

            setOnlineUsers(prev => {
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

    
          case 'CHAT_MESSAGE':
  setTeamMessages(prev => [...prev, message.payload]);

  // ✅ Remove sender from typing list
  setTypingUsers(prev =>
    prev.filter(u => u !== message.payload.senderUsername)
  );
  break;
  case "CHAT_SEEN": {
  const { userId, messageIds } = message.payload;

  setTeamMessages(prev =>
    prev.map(msg => {
      // Only update if this message was marked as seen
      if (messageIds.includes(msg._id?.toString() || msg._id)) {
        const currentSeenBy = msg.seenBy || [];
        
        // Add userId if not already present
        if (!currentSeenBy.includes(userId)) {
          return {
            ...msg,
            seenBy: [...currentSeenBy, userId],
          };
        }
      }
      return msg;
    })
  );
  break;
}



          case 'CHAT_TYPING': {
            const { username, typing, userId } = message.payload;

            if (userId === wsRef.current?.userId) return;

            setTypingUsers(prev => {
            if (typing) {
              return [...new Set([...prev, username])];
            }
            return prev.filter(u => u !== username);
            });
            break;
          }




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

  const sendChatTyping = useCallback((typing) => {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({
      type: "CHAT_TYPING",
      payload: { typing }
    }));
  }
}, []);






  const sendChatMessage = useCallback((text) => {
  if (wsRef.current?.readyState === WebSocket.OPEN) {
    wsRef.current.send(JSON.stringify({
      type: 'CHAT_MESSAGE',
      payload: {
        text
      }
    }));
  }
}, []);


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
  teamMessages,
  typingUsers,
  sendCursor,
  sendCodeChange,
  sendFileSelect,
  sendChatMessage,
  sendChatTyping,
};

}
