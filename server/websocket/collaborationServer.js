// server/websocket/collaborationServer.js
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const projects = new Map(); // Map<projectId, Set<clientInfo>>

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ 
    server,
    path: '/ws/collab'
  });

  wss.on('connection', async (ws, req) => {
    let clientInfo = null;

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        // Handle initial join
        if (message.type === 'join') {
          const { projectId, token } = message;

          // Verify token
          let userId, username, avatar;
          try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            userId = decoded.id;
            
            // Get user details
            const user = await User.findById(userId).select('fullname avatar');
            username = user?.fullname || 'Anonymous';
            avatar = user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
          } catch (err) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid token' }));
            ws.close();
            return;
          }

          // Store client info
          clientInfo = {
            ws,
            userId,
            username,
            avatar,
            projectId,
            cursor: null,
            color: generateColor(userId)
          };

          // Add to project room
          if (!projects.has(projectId)) {
            projects.set(projectId, new Set());
          }
          projects.get(projectId).add(clientInfo);

          // Send current users to new client
          const users = Array.from(projects.get(projectId))
            .filter(c => c !== clientInfo)
            .map(c => ({
              userId: c.userId,
              username: c.username,
              avatar: c.avatar,
              cursor: c.cursor,
              color: c.color
            }));

          ws.send(JSON.stringify({
            type: 'users',
            users,
            yourColor: clientInfo.color
          }));

          // Broadcast new user joined
          broadcast(projectId, {
            type: 'user-joined',
            user: {
              userId,
              username,
              avatar,
              color: clientInfo.color
            }
          }, clientInfo);

        }

        // Handle cursor movement
        else if (message.type === 'cursor') {
          if (!clientInfo) return;

          clientInfo.cursor = {
            line: message.line,
            column: message.column,
            fileId: message.fileId
          };

          broadcast(clientInfo.projectId, {
            type: 'cursor',
            userId: clientInfo.userId,
            cursor: clientInfo.cursor,
            color: clientInfo.color
          }, clientInfo);
        }

        // Handle code changes (for cursor position updates)
        else if (message.type === 'code-change') {
          if (!clientInfo) return;

          broadcast(clientInfo.projectId, {
            type: 'code-change',
            userId: clientInfo.userId,
            fileId: message.fileId,
            changes: message.changes
          }, clientInfo);
        }

        // Handle file selection
        else if (message.type === 'file-select') {
          if (!clientInfo) return;

          broadcast(clientInfo.projectId, {
            type: 'file-select',
            userId: clientInfo.userId,
            fileId: message.fileId
          }, clientInfo);
        }

      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (clientInfo) {
        const { projectId, userId, username } = clientInfo;
        
        // Remove from project room
        const projectClients = projects.get(projectId);
        if (projectClients) {
          projectClients.delete(clientInfo);
          
          // Broadcast user left
          broadcast(projectId, {
            type: 'user-left',
            userId
          });

          // Clean up empty projects
          if (projectClients.size === 0) {
            projects.delete(projectId);
          }
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  console.log('✅ WebSocket collaboration server initialized');
}

// Broadcast to all clients in a project except sender
function broadcast(projectId, message, sender = null) {
  const clients = projects.get(projectId);
  if (!clients) return;

  const messageStr = JSON.stringify(message);
  
  clients.forEach(client => {
    if (client !== sender && client.ws.readyState === 1) { // 1 = OPEN
      client.ws.send(messageStr);
    }
  });
}

// Generate consistent color for user based on ID
function generateColor(userId) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', 
    '#98D8C8', '#F7B731', '#5F27CD', '#00D2FF',
    '#FF6348', '#1DD1A1', '#EE5A6F', '#54A0FF'
  ];
  
  // Use userId to generate consistent color
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
}