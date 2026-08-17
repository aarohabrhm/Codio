import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { RefreshCw, XCircle, AlertCircle, Square } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

// All sixteen ANSI slots, tuned to the terminal surface. The eight bright
// slots used to be unset even though the app emits \x1b[90m, so bright-black
// fell through to an xterm default that didn't match either theme.
function terminalTheme(isDark) {
  return isDark
    ? {
        background: "#0c0f0c",
        foreground: "#c9cfc9",
        cursor: "#8fa7f5",
        cursorAccent: "#0c0f0c",
        selectionBackground: "#2b4bf055",
        black: "#0c0f0c",
        red: "#e2716a",
        green: "#5e9e6e",
        yellow: "#e9a227",
        blue: "#8fa7f5",
        magenta: "#d2506c",
        cyan: "#7fb3ae",
        white: "#c9cfc9",
        brightBlack: "#5e665e",
        brightRed: "#ef8a83",
        brightGreen: "#77b586",
        brightYellow: "#f2b950",
        brightBlue: "#a9bcf8",
        brightMagenta: "#e07a90",
        brightCyan: "#9ac7c2",
        brightWhite: "#efefea",
      }
    : {
        background: "#efefea",
        foreground: "#171a17",
        cursor: "#2b4bf0",
        cursorAccent: "#efefea",
        selectionBackground: "#2b4bf033",
        black: "#171a17",
        red: "#a63a33",
        green: "#2f6b45",
        yellow: "#8a6014",
        blue: "#2b4bf0",
        magenta: "#9c3350",
        cyan: "#2f6b6b",
        white: "#5b615a",
        brightBlack: "#8a8f88",
        brightRed: "#c04a42",
        brightGreen: "#3f7f55",
        brightYellow: "#a5761c",
        brightBlue: "#4a66f3",
        brightMagenta: "#b84663",
        brightCyan: "#3f8585",
        brightWhite: "#171a17",
      };
}

const BottomPanel = forwardRef(function BottomPanel({
  activeTab,
  setActiveTab,
  problems,
  onClearAll,
  files,
  socket,
  activeFile,
  editorRef,
  onRunStart,
}, ref) {
  const { isDark } = useTheme();
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const fitAddonRef = useRef(null);
  const socketRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useImperativeHandle(ref, () => ({
    handleRun,
  }));

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      // Cascadia and Fira were never loaded, so this silently rendered in a
      // generic monospace. JetBrains Mono is the one the app actually ships.
      fontFamily: '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
      lineHeight: 1.4,
      theme: terminalTheme(isDark),
      allowTransparency: true,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    term.onData((data) => {
      socketRef.current?.emit("terminal-input", data);
    });

    term.writeln("\x1b[90mTerminal ready. Hit Run to execute your code.\x1b[0m");

    const observer = new ResizeObserver(() => fitAddon.fit());
    observer.observe(terminalRef.current);

    return () => {
      observer.disconnect();
      term.dispose();
      xtermRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!xtermRef.current) return;
    // Assigning the whole object matters: patching only three keys used to
    // drop the entire ANSI palette on the first light/dark toggle.
    xtermRef.current.options.theme = terminalTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    if (!socket) return;

    const onOutput = (data) => {
      xtermRef.current?.write(data);
    };

    const onExit = ({ code }) => {
      setIsRunning(false);
      xtermRef.current?.writeln(
        `\r\n\x1b[90m[Exited with code ${code}]\x1b[0m`
      );
    };

    socket.on("terminal-output", onOutput);
    socket.on("terminal-exit", onExit);

    return () => {
      socket.off("terminal-output", onOutput);
      socket.off("terminal-exit", onExit);
    };
  }, [socket]);

  const handleRun = () => {
    if (!activeFile || !editorRef?.current) return;

    const ext = activeFile.name.split(".").pop().toLowerCase();
    const langMap = { js: "javascript", jsx: "javascript", py: "python", c: "c", cpp: "cpp" };
    const language = langMap[ext];

    if (!language) {
      xtermRef.current?.writeln("\x1b[31m❌ Unsupported file type\x1b[0m");
      return;
    }

    const sourceCode = editorRef.current.getContent();

    xtermRef.current?.clear();
    xtermRef.current?.writeln(`\x1b[36m▶ Running ${activeFile.name}...\x1b[0m\r\n`);

    setIsRunning(true);
    setActiveTab("terminal");
    socketRef.current?.emit("run-code", { language, sourceCode });
    onRunStart?.();
  };

  const handleKill = () => {
    socketRef.current?.emit("terminal-kill");
    setIsRunning(false);
  };

  const handleClear = () => {
    xtermRef.current?.clear();
    onClearAll?.();
  };

  return (
    <div className={`border-t flex flex-col h-64 bg-surface-page border-line`}>
      <div className={`flex items-center justify-between px-4 border-b border-line bg-surface-panel`}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors ${
              activeTab === "terminal"
                ? `text-primary border-accent`
                : `text-muted hover:text-primary border-transparent`
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "problems"
                ? `text-primary border-accent`
                : `text-muted hover:text-primary border-transparent`
            }`}
          >
            PROBLEMS
            {problems.length > 0 && (
              <span className="bg-danger/20 text-danger text-[10px] px-1.5 rounded-full">
                {problems.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && (
            <button
              onClick={handleKill}
              title="Stop"
              className="flex items-center gap-1 px-2 py-1 text-xs text-danger hover:text-danger rounded"
            >
              <Square size={12} /> Stop
            </button>
          )}
          <button
            onClick={handleClear}
            title="Clear"
            className={`p-1.5 rounded transition-colors text-muted hover:text-primary hover:bg-surface-raised`}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div
          ref={terminalRef}
          className="absolute inset-0 p-2"
          style={{ display: activeTab === "terminal" ? "block" : "none" }}
        />

        {activeTab === "problems" && (
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4">
            {problems.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full gap-2 text-muted`}>
                <div className="text-ok/20"><AlertCircle size={40} /></div>
                <p>No problems detected.</p>
              </div>
            ) : (
              problems.map((p, idx) => (
                <div key={idx} className={`flex gap-3 p-3 border border-danger/20 rounded-md mb-2 cursor-pointer group bg-surface-raised/50 hover:bg-surface-raised`}>
                  <XCircle className="text-danger mt-0.5 shrink-0" size={16} />
                  <div>
                    <div className={`font-medium text-sm text-primary`}>
                      {p.message}
                    </div>
                    <div className={`text-xs mt-1 text-muted group-hover:text-dim`}>
                      {files?.[p.file]?.name || "Unknown File"} • Line {p.line}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--line-strong); border: 3px solid var(--surface-page); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}</style>
    </div>
  );
});

export default BottomPanel;