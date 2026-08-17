import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { RefreshCw, XCircle, AlertCircle, Square } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";

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
      fontFamily: '"Cascadia Code", "Fira Code", monospace',
      theme: {
        background: isDark ? "#0a0a0a" : "#ffffff",
        foreground: isDark ? "#d4d4d4" : "#1a1a1a",
        cursor:     isDark ? "#ffffff" : "#000000",
        black:      "#000000",
        red:        "#cd3131",
        green:      "#0dbc79",
        yellow:     "#e5e510",
        blue:       "#2472c8",
        magenta:    "#bc3fbc",
        cyan:       "#11a8cd",
        white:      "#e5e5e5",
      },
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
    xtermRef.current.options.theme = {
      background: isDark ? "#0a0a0a" : "#ffffff",
      foreground: isDark ? "#d4d4d4" : "#1a1a1a",
      cursor:     isDark ? "#ffffff" : "#000000",
    };
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? "#2a2a2a" : "#d1d5db"}; border: 3px solid ${isDark ? "#0a0a0a" : "#f9fafb"}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? "#3a3a3a" : "#9ca3af"}; }
      `}</style>
    </div>
  );
});

export default BottomPanel;