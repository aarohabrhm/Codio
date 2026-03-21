import Docker from "dockerode";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docker = new Docker();

const RUNTIMES = {
  python: {
    image: "python:3.10-alpine",
    cmd: (file) => ["python", "-u", `/app/${file}`],
    ext: "py",
  },
  javascript: {
    image: "node:18-alpine",
    cmd: (file) => ["node", `/app/${file}`],
    ext: "js",
  },
  c: {
    image: "gcc:latest",
    cmd: (file) => ["sh", "-c", `gcc /app/${file} -o /app/out && /app/out`],
    ext: "c",
  },
  cpp: {
    image: "gcc:latest",
    cmd: (file) => ["sh", "-c", `g++ /app/${file} -o /app/out && /app/out`],
    ext: "cpp",
  },
};

// Track active sessions: socketId -> { container, stream, filePath }
const activeSessions = new Map();

export function setupExecutionSocket(io) {
  io.on("connection", (socket) => {

    socket.on("run-code", async ({ language, sourceCode }) => {
      // Kill any existing session for this socket
      await killSession(socket.id);

      const runtime = RUNTIMES[language];
      if (!runtime) {
        socket.emit("terminal-output", "❌ Unsupported language\r\n");
        return;
      }

      const jobId = uuidv4();
      const filename = `${jobId}.${runtime.ext}`;
      const tempDir = path.join(__dirname, "../temp");
      const filePath = path.join(tempDir, filename);

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      let container;

      try {
        await fs.promises.writeFile(filePath, sourceCode);
        const absolutePath = path.resolve(filePath).replace(/\\/g, "/");

        container = await docker.createContainer({
          Image: runtime.image,
          Cmd: runtime.cmd(filename),
          WorkingDir: "/app",
          Tty: true,        // Enable TTY for interactive
          OpenStdin: true,  // Keep stdin open
          StdinOnce: false,
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          HostConfig: {
            Binds: [`${absolutePath}:/app/${filename}:ro`],
            Memory: 128 * 1024 * 1024,
            NetworkMode: "none",
          },
        });

        await container.start();

        // Attach to container streams
        const stream = await container.attach({
          stream: true,
          stdin: true,
          stdout: true,
          stderr: true,
        });

        // Store session
        activeSessions.set(socket.id, { container, stream, filePath });

        // Stream output to client
        stream.on("data", (chunk) => {
          socket.emit("terminal-output", chunk.toString("utf8"));
        });

        stream.on("end", () => {
          socket.emit("terminal-output", "\r\n\x1b[90m[Process exited]\x1b[0m\r\n");
          cleanupFile(filePath);
          activeSessions.delete(socket.id);
        });

        // Wait for container to finish
        container.wait().then(({ StatusCode }) => {
          socket.emit("terminal-exit", { code: StatusCode });
        }).catch(() => {});

      } catch (err) {
        console.error("❌ Run error:", err.message);
        socket.emit("terminal-output", `❌ Error: ${err.message}\r\n`);
        cleanupFile(filePath);
        if (container) {
          try { await container.remove({ force: true }); } catch {}
        }
      }
    });

    // Receive input from user and pipe into container stdin
    socket.on("terminal-input", (data) => {
      const session = activeSessions.get(socket.id);
      if (session?.stream) {
        session.stream.write(data);
      }
    });

    // Kill running process
    socket.on("terminal-kill", async () => {
      await killSession(socket.id);
      socket.emit("terminal-output", "\r\n\x1b[90m[Killed]\x1b[0m\r\n");
    });

    socket.on("disconnect", async () => {
      await killSession(socket.id);
    });
  });
}

async function killSession(socketId) {
  const session = activeSessions.get(socketId);
  if (!session) return;

  const { container, filePath } = session;
  activeSessions.delete(socketId);

  try { await container.stop({ t: 2 }); } catch {}
  try { await container.remove({ force: true }); } catch {}
  cleanupFile(filePath);
}

function cleanupFile(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    fs.promises.unlink(filePath).catch(() => {});
  }
}
export const executeCode = async (req, res) => {
  const { language, sourceCode } = req.body;

  const languageMap = {
    javascript: "javascript",
    python: "python",
    c: "c",
    cpp: "c++",
  };

  const versionMap = {
    python: "3.10.0",
    javascript: "18.15.0",
    c: "10.2.0",
    cpp: "10.2.0",
  };

  try {
    const response = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: languageMap[language] || language,
        version: versionMap[language] || "*",
        files: [{ content: sourceCode }],
      }),
    });

    const data = await response.json();
    return res.json(data);
  } catch (err) {
    console.error("Execute error:", err.message);
    return res.status(500).json({ message: "Execution failed", detail: err.message });
  }
};