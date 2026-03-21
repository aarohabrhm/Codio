import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import ChatMessage from "../models/ChatMessage.js";
import Docker from "dockerode";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import tar from "tar-stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docker = new Docker();

const RUNTIMES = {
  python: { image: "python:3.10-alpine", cmd: (file) => ["python", "-u", `/app/${file}`], ext: "py" },
  javascript: { image: "node:18-alpine", cmd: (file) => ["node", `/app/${file}`], ext: "js" },
  c: { image: "gcc:latest", cmd: (file) => ["sh", "-c", `gcc /app/${file} -o /app/out && /app/out`], ext: "c" },
  cpp: { image: "gcc:latest", cmd: (file) => ["sh", "-c", `g++ /app/${file} -o /app/out && /app/out`], ext: "cpp" },
};

const activeSessions = new Map();

async function killSession(socketId) {
  const session = activeSessions.get(socketId);
  if (!session) return;
  const { container, filePath } = session;
  activeSessions.delete(socketId);
  try { await container.stop({ t: 2 }); } catch {}
  try { await container.remove({ force: true }); } catch {}
  if (filePath && fs.existsSync(filePath)) {
    fs.promises.unlink(filePath).catch(() => {});
  }
}

const projects = new Map();

export function setupWebSocket(server) {
  const io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
    path: '/socket.io/'
  });

  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);
    let clientInfo = null;

    // ========== COLLABORATION ==========

    socket.on('join-project', async ({ projectId, token }) => {
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId).select('fullname avatar');
        const username = user?.fullname || 'Anonymous';
        const avatar = user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

        clientInfo = {
          socketId: socket.id, userId, username, avatar, projectId,
          cursor: null, selection: null,
          color: generateColor(userId), activeFile: null
        };

        socket.join(projectId);

        if (!projects.has(projectId)) projects.set(projectId, new Map());
        projects.get(projectId).set(socket.id, clientInfo);

        const users = Array.from(projects.get(projectId).values())
          .filter(c => c.socketId !== socket.id)
          .map(c => ({
            socketId: c.socketId, userId: c.userId, username: c.username,
            avatar: c.avatar, cursor: c.cursor, selection: c.selection,
            color: c.color, activeFile: c.activeFile
          }));

        socket.emit('project-users', { users, yourColor: clientInfo.color });
        socket.to(projectId).emit('user-joined', {
          socketId: socket.id, userId, username, avatar, color: clientInfo.color
        });

        console.log(`✅ User ${username} joined project ${projectId}`);
      } catch (err) {
        console.error('❌ Join error:', err);
        socket.emit('error', { message: 'Invalid token' });
        socket.disconnect();
      }
    });

    socket.on('cursor-move', ({ fileId, line, column }) => {
      if (!clientInfo) return;
      clientInfo.cursor = { fileId, line, column };
      clientInfo.activeFile = fileId;
      socket.to(clientInfo.projectId).emit('cursor-update', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, cursor: { fileId, line, column }, color: clientInfo.color
      });
    });

    socket.on('selection-change', ({ fileId, start, end }) => {
      if (!clientInfo) return;
      clientInfo.selection = { fileId, start, end };
      socket.to(clientInfo.projectId).emit('selection-update', {
        socketId: socket.id, userId: clientInfo.userId,
        selection: { fileId, start, end }, color: clientInfo.color
      });
    });

    socket.on('code-change', ({ fileId, changes, content }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('code-update', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, fileId, changes, content
      });
    });

    socket.on('file-created', ({ parentId, fileData }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('file-created', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, parentId, fileData
      });
    });

    socket.on('folder-created', ({ parentId, folderData }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('folder-created', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, parentId, folderData
      });
    });

    socket.on('file-renamed', ({ fileId, newName }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('file-renamed', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, fileId, newName
      });
    });

    socket.on('file-deleted', ({ fileId }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('file-deleted', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, fileId
      });
    });

    socket.on('project-reverted', ({ files, cpId }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('project-reverted', {
        files, cpId, username: clientInfo.username
      });
    });

    socket.on('checkpoint-updated', ({ cpId }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('checkpoint-updated', {
        cpId, username: clientInfo.username
      });
    });

    socket.on('file-select', ({ fileId }) => {
      if (!clientInfo) return;
      clientInfo.activeFile = fileId;
      socket.to(clientInfo.projectId).emit('user-file-change', {
        socketId: socket.id, userId: clientInfo.userId,
        username: clientInfo.username, fileId
      });
    });

    socket.on('chat-message', async ({ text }) => {
      if (!clientInfo) return;
      try {
        const savedMessage = await ChatMessage.create({
          projectId: clientInfo.projectId, sender: clientInfo.userId,
          senderUsername: clientInfo.username, senderAvatar: clientInfo.avatar,
          text, mode: "team", seenBy: [clientInfo.userId]
        });
        io.to(clientInfo.projectId).emit('chat-message', {
          _id: savedMessage._id.toString(), projectId: clientInfo.projectId,
          senderId: clientInfo.userId, senderUsername: clientInfo.username,
          senderAvatar: clientInfo.avatar, text: savedMessage.text,
          createdAt: savedMessage.createdAt, seenBy: [clientInfo.userId]
        });
      } catch (err) {
        console.error('❌ Chat message error:', err);
      }
    });

    socket.on('chat-typing', ({ typing }) => {
      if (!clientInfo) return;
      socket.to(clientInfo.projectId).emit('user-typing', {
        userId: clientInfo.userId, username: clientInfo.username, typing
      });
    });

    socket.on('chat-seen', async ({ messageIds }) => {
      if (!clientInfo) return;
      try {
        await ChatMessage.updateMany(
          { _id: { $in: messageIds }, sender: { $ne: clientInfo.userId }, seenBy: { $ne: clientInfo.userId } },
          { $push: { seenBy: clientInfo.userId } }
        );
        io.to(clientInfo.projectId).emit('messages-seen', {
          userId: clientInfo.userId, messageIds
        });
      } catch (err) {
        console.error('❌ Chat seen error:', err);
      }
    });

    // ========== EXECUTION ==========

    socket.on('run-code', async ({ language, sourceCode }) => {
  await killSession(socket.id);

  const runtime = RUNTIMES[language];
  if (!runtime) {
    socket.emit('terminal-output', '❌ Unsupported language\r\n');
    return;
  }

  const jobId = uuidv4();
  const filename = `${jobId}.${runtime.ext}`;
  const tempDir = path.join(__dirname, '../temp');
  const filePath = path.join(tempDir, filename);

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  let container;
  try {
    await fs.promises.writeFile(filePath, sourceCode);

    // 1. CREATE container (don't start yet)
    container = await docker.createContainer({
      Image: runtime.image,
      Cmd: runtime.cmd(filename),
      WorkingDir: '/app',
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      HostConfig: {
        Memory: 256 * 1024 * 1024,
        MemorySwap: 256 * 1024 * 1024,
        NetworkMode: 'none',
      },
    });

    // 2. COPY file into container before starting
    const fileContent = await fs.promises.readFile(filePath);
    await new Promise((resolve, reject) => {
      const pack = tar.pack();
      pack.entry({ name: filename }, fileContent, (err) => {
        if (err) return reject(err);
        pack.finalize();
      });
      container.putArchive(pack, { path: '/app' }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // 3. ATTACH before starting so we don't miss early output
    const stream = await container.attach({
      stream: true, stdin: true, stdout: true, stderr: true,
    });

    // 4. START container
    await container.start();

    activeSessions.set(socket.id, { container, stream, filePath });

    stream.on('data', (chunk) => {
      socket.emit('terminal-output', chunk.toString('utf8'));
    });

    stream.on('end', () => {
      socket.emit('terminal-output', '\r\n\x1b[90m[Process exited]\x1b[0m\r\n');
      fs.promises.unlink(filePath).catch(() => {});
      activeSessions.delete(socket.id);
    });

    container.wait().then(({ StatusCode }) => {
      socket.emit('terminal-exit', { code: StatusCode });
    }).catch(() => {});

  } catch (err) {
    console.error('❌ Run error:', err.message);
    socket.emit('terminal-output', `❌ Error: ${err.message}\r\n`);
    fs.promises.unlink(filePath).catch(() => {});
    if (container) { try { await container.remove({ force: true }); } catch {} }
  }
});
    socket.on('terminal-input', (data) => {
      const session = activeSessions.get(socket.id);
      if (session?.stream) {
        session.stream.write(data);
      }
    });

    socket.on('terminal-kill', async () => {
      await killSession(socket.id);
      socket.emit('terminal-output', '\r\n\x1b[90m[Killed]\x1b[0m\r\n');
    });

    // ========== DISCONNECT ==========

    socket.on('disconnect', async () => {
      await killSession(socket.id);

      if (clientInfo) {
        const { projectId, username } = clientInfo;
        const projectClients = projects.get(projectId);
        if (projectClients) {
          projectClients.delete(socket.id);
          socket.to(projectId).emit('user-left', {
            socketId: socket.id, userId: clientInfo.userId
          });
          if (projectClients.size === 0) projects.delete(projectId);
        }
        console.log(`👋 User ${username} left project ${projectId}`);
      }
    });

    socket.on('error', ({ message }) => {
      console.error('❌ Socket error:', message);
    });
  });

  console.log('✅ Socket.IO collaboration server initialized');
  return io;
}

function generateColor(userId) {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7B731', '#5F27CD', '#00D2FF',
    '#FF6348', '#1DD1A1', '#EE5A6F', '#54A0FF'
  ];
  const hash = userId.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
  return colors[Math.abs(hash) % colors.length];
}

export function broadcastToProject(io, projectId, event, data) {
  io.to(projectId).emit(event, data);
}