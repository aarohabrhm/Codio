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

export const executeCode = async (req, res) => {
  const { language, sourceCode } = req.body;

  if (!language || !sourceCode) {
    return res.status(400).json({ message: "Missing code or language" });
  }

  const runtime = RUNTIMES[language];
  if (!runtime) {
    return res.status(400).json({ message: "Unsupported language" });
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
      Tty: false,
      HostConfig: {
        Binds: [`${absolutePath}:/app/${filename}:ro`],
        Memory: 128 * 1024 * 1024,
        NetworkMode: "none",
      },
    });

    await container.start();

    const result = await container.wait();

    const logsBuffer = await container.logs({
      stdout: true,
      stderr: true,
      follow: false,
    });

    const output = decodeDockerStream(logsBuffer);

    await container.remove({ force: true });

    return res.json({
      run: {
        stdout: output.trim(),
        stderr: "",
        code: result.StatusCode,
      },
    });
  } catch (error) {
    console.error("❌ Execution Failed:", error.message);
    return res.status(500).json({
      message: "Execution failed",
      error: error.message,
    });
  } finally {
    if (container) {
      try {
        await container.remove({ force: true });
      } catch {}
    }
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
};

// ✅ Correct Docker log decoder
function decodeDockerStream(buffer) {
  let offset = 0;
  let output = "";

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset + 4);
    offset += 8;
    output += buffer.toString("utf8", offset, offset + length);
    offset += length;
  }

  return output;
}
