// client/src/components/EditorPage/hooks/useCollaboration.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

export function useCollaboration(projectId) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userCursors, setUserCursors] = useState({});
  const [userSelections, setUserSelections] = useState({});
  const [myColor, setMyColor] = useState('#4ECDC4');
  const [teamMessages, setTeamMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    if (!projectId) return;

    const token = sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
    if (!token) {
      console.warn("No access token found");
      return;
    }

    const socket = io('http://localhost:8000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
      setIsConnected(true);
      socket.emit('join-project', { projectId, token });
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected');
      setIsConnected(false);
      setOnlineUsers([]);
      setUserCursors({});
      setUserSelections({});
    });

    socket.on('project-users', ({ users, yourColor }) => {
      console.log('📋 Current users:', users);
      setOnlineUsers(users);
      setMyColor(yourColor);

      const cursors = {};
      const selections = {};
      users.forEach(user => {
        if (user.cursor) cursors[user.socketId] = { ...user.cursor, color: user.color, username: user.username };
        if (user.selection) selections[user.socketId] = { ...user.selection, color: user.color };
      });
      setUserCursors(cursors);
      setUserSelections(selections);
    });

    socket.on('user-joined', (user) => {
      console.log('👋 User joined:', user.username);
      setOnlineUsers(prev => {
        if (prev.some(u => u.socketId === user.socketId)) return prev;
        return [...prev, user];
      });
    });

    socket.on('user-left', ({ socketId }) => {
      console.log('👋 User left:', socketId);
      setOnlineUsers(prev => prev.filter(u => u.socketId !== socketId));
      setUserCursors(prev => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });
      setUserSelections(prev => {
        const next = { ...prev };
        delete next[socketId];
        return next;
      });
    });

    socket.on('cursor-update', ({ socketId, cursor, color, username }) => {
      setUserCursors(prev => ({
        ...prev,
        [socketId]: { ...cursor, color, username }
      }));
    });

    socket.on('selection-update', ({ socketId, selection, color }) => {
      setUserSelections(prev => ({
        ...prev,
        [socketId]: { ...selection, color }
      }));
    });

    socket.on('code-update', ({ socketId, userId, username, fileId, changes, content }) => {
      console.log(`📝 Received code update for file ${fileId} from ${username}`);
      
      window.dispatchEvent(new CustomEvent('remote-code-update', {
        detail: { socketId, userId, username, fileId, changes, content }
      }));
    });

    // ========== FILE OPERATIONS ==========
    socket.on('file-created', ({ socketId, userId, username, parentId, fileData }) => {
      console.log(`📄 ${username} created file:`, fileData.name);
      window.dispatchEvent(new CustomEvent('remote-file-created', {
        detail: { socketId, userId, username, parentId, fileData }
      }));
    });

    socket.on('folder-created', ({ socketId, userId, username, parentId, folderData }) => {
      console.log(`📁 ${username} created folder:`, folderData.name);
      window.dispatchEvent(new CustomEvent('remote-folder-created', {
        detail: { socketId, userId, username, parentId, folderData }
      }));
    });

    socket.on('file-renamed', ({ socketId, userId, username, fileId, newName }) => {
      console.log(`✏️ ${username} renamed file to:`, newName);
      window.dispatchEvent(new CustomEvent('remote-file-renamed', {
        detail: { socketId, userId, username, fileId, newName }
      }));
    });

    socket.on('file-deleted', ({ socketId, userId, username, fileId }) => {
      console.log(`🗑️ ${username} deleted file:`, fileId);
      window.dispatchEvent(new CustomEvent('remote-file-deleted', {
        detail: { socketId, userId, username, fileId }
      }));
    });
    socket.on('project-reverted', ({ files, cpId, username }) => {
      console.log(`⏪ ${username} reverted the project!`);
      window.dispatchEvent(new CustomEvent('remote-project-reverted', {
        detail: { files, cpId, username }
      }));
    });

    socket.on('user-file-change', ({ socketId, userId, username, fileId }) => {
      console.log(`📄 ${username} opened file:`, fileId);
    });

    socket.on('checkpoint-updated', ({ cpId, username }) => {
      console.log(`🔖 ${username} updated checkpoints`);
      window.dispatchEvent(new CustomEvent('remote-checkpoint-updated', {
        detail: { cpId, username }
      }));
    });

    socket.on('chat-message', (message) => {
      setTeamMessages(prev => [...prev, message]);
      setTypingUsers(prev => prev.filter(u => u !== message.senderUsername));
    });

    socket.on('user-typing', ({ userId, username, typing }) => {
      setTypingUsers(prev => {
        if (typing) {
          return [...new Set([...prev, username])];
        }
        return prev.filter(u => u !== username);
      });
    });

    socket.on('messages-seen', ({ userId, messageIds }) => {
      setTeamMessages(prev =>
        prev.map(msg => {
          if (messageIds.includes(msg._id?.toString() || msg._id)) {
            const currentSeenBy = msg.seenBy || [];
            if (!currentSeenBy.includes(userId)) {
              return { ...msg, seenBy: [...currentSeenBy, userId] };
            }
          }
          return msg;
        })
      );
    });

    socket.on('error', ({ message }) => {
      console.error('❌ Socket error:', message);
    });

    return () => {
      console.log('🧹 Cleaning up socket connection');
      socket.disconnect();
    };
  }, [projectId]);

  // ========== SEND FUNCTIONS ==========
  
  const sendCursor = useCallback((line, column, fileId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('cursor-move', { fileId, line, column });
    }
  }, []);

  const sendSelection = useCallback((start, end, fileId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('selection-change', { fileId, start, end });
    }
  }, []);

  const sendCodeChange = useCallback((fileId, changes, content) => {
    if (socketRef.current?.connected) {
      console.log(`📤 Sending code update for file ${fileId}`);
      socketRef.current.emit('code-change', { fileId, changes, content });
    }
  }, []);

  const sendFileSelect = useCallback((fileId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('file-select', { fileId });
    }
  }, []);

  const sendFileCreated = useCallback((parentId, fileData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('file-created', { parentId, fileData });
    }
  }, []);

  const sendFolderCreated = useCallback((parentId, folderData) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('folder-created', { parentId, folderData });
    }
  }, []);

  const sendFileRenamed = useCallback((fileId, newName) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('file-renamed', { fileId, newName });
    }
  }, []);

  const sendFileDeleted = useCallback((fileId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('file-deleted', { fileId });
    }
  }, []);
  const sendProjectReverted = useCallback((files, cpId) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('project-reverted', { files, cpId });
    }
  }, []);

  const sendChatMessage = useCallback((text) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat-message', { text });
    }
  }, []);

  const sendChatTyping = useCallback((typing) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('chat-typing', { typing });
    }
  }, []);
  const sendCheckpointUpdated = useCallback((cpId) => {
  if (socketRef.current?.connected) {
    socketRef.current.emit('checkpoint-updated', { cpId });
  }
}, []);

  const markMessagesAsSeen = useCallback((messageIds) => {
    if (socketRef.current?.connected && messageIds.length > 0) {
      socketRef.current.emit('chat-seen', { messageIds });
    }
  }, []);

  return {
    isConnected,
    onlineUsers,
    userCursors,
    userSelections,
    myColor,
    teamMessages,
    typingUsers,
    sendCursor,
    sendSelection,
    sendCodeChange,
    sendFileSelect,
    sendFileCreated,
    sendFolderCreated,
    sendFileRenamed,
    sendFileDeleted,
    sendChatMessage,
    sendChatTyping,
    markMessagesAsSeen,
    sendProjectReverted,
    sendCheckpointUpdated,
  };
}