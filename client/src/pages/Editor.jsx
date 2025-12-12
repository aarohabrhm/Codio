import React, { useEffect, useRef, useState } from "react";
import codioLogo from '../assets/logo.png';
import EditorMonaco from "@monaco-editor/react";
import {
  Folder,
  FileText,
  Settings,
  Trash2,
  Plus,
  CornerUpLeft,
  CornerUpRight,
  MoreVertical,
  Layout,
  HelpCircle,
  BookOpen,
  Share2,
  MessageSquare,
  RefreshCw,
  Box,
  Code as CodeIcon,
  X,
  ChevronDown,
  ChevronRight,
  Terminal,
  Search,
  Zap,
  MessageCircle,
} from "lucide-react";

/**
 * VSCode-like IDE with:
 * - Left vertical tab bar (Files / Guide / Help)
 * - Left content panel that changes depending on selected tab
 * - Center editor (Monaco)
 * - Floating AI Chat button on the right that opens a right drawer
 * - Bottom output/terminal/problems
 *
 * Note: This is a UI-only client-side demo. Replace any simulated logic with real backends as needed.
 */

// ---------- Initial sample files ----------
const INITIAL_CODE_C_SHARP = `/// <summary>
/// Generates unique random codes and inserts them into the database.
/// </summary>
public ICollection<string> GenerateCodes(int numberOfCodes)
{
    var result = new List<string>(numberOfCodes);
    // ...
    return result;
}`;

const INITIAL_FILES = {
  root: { id: "root", name: "Explorer", type: "folder", isOpen: true, children: ["backend", "frontend", "assets"] },
  backend: { id: "backend", name: "backend", type: "folder", isOpen: true, parent: "root", children: ["app-js", "package-json"] },
  "app-js": { id: "app-js", name: "app.js", type: "file", parent: "backend", status: "A", content: INITIAL_CODE_C_SHARP },
  "package-json": { id: "package-json", name: "package.json", type: "file", parent: "backend", content: '{ "name": "demo", "version": "1.0.0" }' },
  frontend: { id: "frontend", name: "frontend", type: "folder", parent: "root", children: ["index-html", "style-css"] },
  "index-html": { id: "index-html", name: "index.html", type: "file", parent: "frontend", content: '<!doctype html>\\n<html></html>' },
  "style-css": { id: "style-css", name: "style.css", type: "file", parent: "frontend", content: "body { background: #0b0f14; color: #c9d1d9 }" },
  assets: { id: "assets", name: "assets", type: "folder", parent: "root", isOpen: true, children: ["logo-png"] },
  "logo-png": { id: "logo-png", name: "logo.png", type: "file", parent: "assets", content: "" },
};

// ---------- Helpers ----------
const FileIcon = ({ name, type }) => {
  if (type === "folder") return <Folder size={14} className="text-gray-400" />;
  if (name.endsWith(".js")) return <span className="text-yellow-400 text-xs font-bold">JS</span>;
  if (name.endsWith(".css")) return <span className="text-blue-400 text-xs font-bold">#</span>;
  if (name.endsWith(".html")) return <span className="text-orange-400 text-xs font-bold">&lt;&gt;</span>;
  return <FileText size={14} className="text-gray-400" />;
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  const colors = {
    M: "text-yellow-400 bg-yellow-500/8 border border-yellow-700/10",
    D: "text-red-400 bg-red-500/8 border border-red-700/10",
    A: "text-emerald-400 bg-emerald-500/8 border border-emerald-700/10",
  };
  return <span className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded ${colors[status] || ""}`}>{status}</span>;
};

// ---------- Component ----------
export default function IdeWithSideTabsAndChat() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openFiles, setOpenFiles] = useState(["app-js", "style-css"]);
  const [activeFileId, setActiveFileId] = useState("app-js");

  // bottom panel
  const [activeBottomTab, setActiveBottomTab] = useState("output"); // output | terminal | problems
  const [consoleOutput, setConsoleOutput] = useState([
    "vite v5.2.1 ready in 3.47s",
    "➜  Local: http://localhost:5173/",
    "Server running — watching for file changes ...",
  ]);
  const [terminalOutput, setTerminalOutput] = useState(["Welcome to the integrated terminal."]);
  const [terminalInput, setTerminalInput] = useState("");
  const [problems, setProblems] = useState([]);

  // right chat
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", text: "Hello — I'm your coding assistant. Ask me anything about this workspace." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // left tabs (Files / Guide / Help)
  const [activeLeftTab, setActiveLeftTab] = useState("files"); // "files" | "guide" | "help"

  // editor
  const monacoRef = useRef(null);
  const editorRef = useRef(null);
  const untitledCounter = useRef(1);

  // Monaco theme setup
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("vscode-clone-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [{ token: "", foreground: "c9d1d9", background: "0b0f14" }],
      colors: {
        "editor.background": "#0b0f14",
        "editorLineNumber.foreground": "#4b5563",
        "editorLineNumber.activeForeground": "#9ca3af",
        "editorCursor.foreground": "#9AE6B4",
        "editor.selectionBackground": "#2dd4bf33",
      },
    });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    monaco.editor.setTheme("vscode-clone-dark");
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => onSave());
  };

  // language mapping
  const getLanguageFromName = (name = "") => {
    const n = name.toLowerCase();
    if (n.endsWith(".js") || n.endsWith(".jsx")) return "javascript";
    if (n.endsWith(".ts") || n.endsWith(".tsx")) return "typescript";
    if (n.endsWith(".css")) return "css";
    if (n.endsWith(".json")) return "json";
    if (n.endsWith(".html")) return "html";
    if (n.endsWith(".cs")) return "csharp";
    return "plaintext";
  };
  const language = activeFileId ? getLanguageFromName(files[activeFileId]?.name) : "javascript";

  // Explorer actions
  const toggleFolder = (id) => setFiles((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: !prev[id].isOpen } }));
  const openFile = (fileId) => {
    const node = files[fileId];
    if (!node) return;
    if (node.type === "folder") {
      toggleFolder(fileId);
      return;
    }
    if (!openFiles.includes(fileId)) setOpenFiles((p) => [...p, fileId]);
    setActiveFileId(fileId);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    setOpenFiles((prev) => {
      const next = prev.filter((p) => p !== id);
      if (id === activeFileId) setActiveFileId(next.length ? next[next.length - 1] : null);
      return next;
    });
  };

  const activeContent = activeFileId ? files[activeFileId]?.content ?? "" : "";

  const onEditorChange = (v) => {
    if (!activeFileId) return;
    setFiles((prev) => ({ ...prev, [activeFileId]: { ...prev[activeFileId], content: v, status: prev[activeFileId].status === "A" ? "A" : "M" } }));
  };

  // Save / Create / Delete
  const onSave = () => {
    if (!activeFileId) return;
    setFiles((prev) => {
      const f = prev[activeFileId] || {};
      const newStatus = f.status === "A" ? "A" : undefined;
      return { ...prev, [activeFileId]: { ...f, status: newStatus } };
    });
    setConsoleOutput((p) => [...p, `> Saved ${files[activeFileId]?.name || activeFileId}`]);
  };

  const createFile = (parent = "root") => {
    const id = `untitled-${Date.now()}`;
    const name = `untitled-${untitledCounter.current}.js`;
    untitledCounter.current += 1;
    setFiles((prev) => ({ ...prev, [id]: { id, name, type: "file", parent, content: "", status: "A" }, [parent]: { ...prev[parent], children: [...(prev[parent]?.children || []), id] } }));
    setOpenFiles((p) => [...p, id]);
    setActiveFileId(id);
    setConsoleOutput((p) => [...p, `> Created ${name}`]);
  };

  const deleteActive = () => {
    if (!activeFileId) return;
    const file = files[activeFileId];
    if (!file) return;
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    setFiles((prev) => {
      const copy = { ...prev };
      const parent = copy[file.parent];
      if (parent) copy[file.parent] = { ...parent, children: (parent.children || []).filter((c) => c !== activeFileId) };
      delete copy[activeFileId];
      return copy;
    });
    setOpenFiles((prev) => prev.filter((id) => id !== activeFileId));
    setActiveFileId(null);
    setConsoleOutput((p) => [...p, `> Deleted ${file.name}`]);
  };

  // Run tests -> output & problems
  const runTests = () => {
    setConsoleOutput((p) => [...p, "", `> Running tests on ${files[activeFileId]?.name || "workspace"}...`, "> All tests passed ✅"]);
    if (Math.random() > 0.8) {
      const prob = { file: activeFileId, line: 4, message: "Possible undefined variable" };
      setProblems((prev) => [...prev, prob]);
    }
    setActiveBottomTab("output");
  };

  // Terminal execution (simulated)
  const onTerminalExecute = () => {
    if (!terminalInput.trim()) return;
    setTerminalOutput((p) => [...p, `> ${terminalInput}`, `Echo: ${terminalInput}`]);
    setTerminalInput("");
    setActiveBottomTab("terminal");
  };

  // Chat actions (simulated)
  const onChatSend = () => {
    if (!chatInput.trim()) return;
    const msg = { role: "user", text: chatInput };
    setChatMessages((m) => [...m, msg]);
    setChatInput("");
    // simulated assistant answer
    setTimeout(() => {
      setChatMessages((m) => [...m, { role: "assistant", text: `I saw: "${msg.text}". Suggestion: try running tests or ask for refactor.` }]);
    }, 600);
  };

  // global save shortcut (for non-monaco focus)
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeFileId, files]);

  // explorer renderer
  const renderExplorer = (id, depth = 0) => {
    const node = files[id];
    if (!node) return null;
    const isFolder = node.type === "folder";
    const selected = activeFileId === id;
    return (
      <div key={id}>
        <div
          onClick={() => (isFolder ? toggleFolder(id) : openFile(id))}
          style={{ paddingLeft: 12 + depth * 12 }}
          className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer select-none ${selected ? "bg-[#1f2937] text-white" : "text-gray-400 hover:bg-[#111316] hover:text-gray-200"}`}
          title={node.name}
        >
          <div className="w-4">{isFolder ? (node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <div style={{ width: 14 }} />}</div>
          <div className="w-4">{isFolder ? <Folder size={14} /> : <FileIcon name={node.name} type={node.type} />}</div>
          <div className="flex-1 truncate">{node.name}</div>
          <div>{node.status ? <StatusBadge status={node.status} /> : null}</div>
        </div>
        {isFolder && node.isOpen && (node.children || []).map((c) => renderExplorer(c, depth + 1))}
      </div>
    );
  };

  // small helper for left content panels (Guide/Help)
  const LeftGuide = () => (
    <div className="p-3 text-sm text-gray-300">
      <div className="font-medium mb-2">Guide</div>
      <div className="text-gray-400">Quick tips and documentation live here. Use this space to show your project's README, helpful links, or onboarding steps.</div>
    </div>
  );

  const LeftHelp = () => (
    <div className="p-3 text-sm text-gray-300">
      <div className="font-medium mb-2">Help</div>
      <div className="text-gray-400">Search docs or open a support ticket. Add FAQs or shortcuts here.</div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#0b0f14] text-gray-300">
      {/* Left vertical tab bar + left panel */}
      <div className="flex">
        {/* Vertical tab icons */}
        <div className="w-14 bg-[#071018] flex flex-col items-center py-3 border-r border-[#0b1114] gap-3">
          <button
            title="Files"
            onClick={() => setActiveLeftTab("files")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeLeftTab === "files" ? "bg-[#0f1720] text-teal-300" : "hover:bg-[#0b1114] text-gray-400"}`}
          >
            <Layout size={18} />
          </button>

          <button
            title="Guide"
            onClick={() => setActiveLeftTab("guide")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeLeftTab === "guide" ? "bg-[#0f1720] text-teal-300" : "hover:bg-[#0b1114] text-gray-400"}`}
          >
            <BookOpen size={18} />
          </button>

          <button
            title="Help"
            onClick={() => setActiveLeftTab("help")}
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeLeftTab === "help" ? "bg-[#0f1720] text-teal-300" : "hover:bg-[#0b1114] text-gray-400"}`}
          >
            <HelpCircle size={18} />
          </button>
        </div>

        {/* Left content panel (files / guide / help) */}
        <aside className="w-72 bg-[#0f1720] border-r border-[#111318] flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between px-3 py-3 border-b border-[#0b1114]">
            <div className="flex items-center gap-2">
              <img src={codioLogo} alt="Codio" className="w-6 h-6 rounded-lg object-cover" />
              <div>
                <div className="text-sm font-medium">CODIO</div>
                <div className="text-xs text-gray-400">Workspace</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button title="Search" className="p-1 rounded hover:bg-[#0b1114] text-gray-300"><Search size={16} /></button>
              <button title="New file" onClick={() => createFile("root")} className="p-1 rounded hover:bg-[#0b1114] text-gray-300"><Plus size={16} /></button>
            </div>
          </div>

          {/* content based on selected left tab */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeLeftTab === "files" && (
              <div className="p-2">
                {renderExplorer("root")}
              </div>
            )}

            {activeLeftTab === "guide" && <LeftGuide />}

            {activeLeftTab === "help" && <LeftHelp />}
          </div>

          {/* footer */}
          <div className="px-3 py-2 border-t border-[#0b1114] bg-[#071014] text-xs text-gray-400">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div>index.js updated 2m ago</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="A" />
                <StatusBadge status="M" />
                <StatusBadge status="D" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jon" className="w-8 h-8 rounded-full" alt="user" />
              <div>
                <div className="text-sm text-gray-200">Jon</div>
                <div className="text-xs text-gray-500">Owner</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Center Editor area */}
      <main className="flex-1 flex flex-col">
        {/* top tabs + toolbar */}
        <div className="bg-[#071014] border-b border-[#0b1114]">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-end gap-1 overflow-x-auto no-scrollbar">
              {openFiles.map((id) => (
                <div key={id} className={`min-w-[140px] px-4 py-2 rounded-t-md flex items-center gap-3 cursor-pointer ${activeFileId === id ? "bg-[#081019] text-white border-b-2 border-teal-500" : "bg-[#071014] text-gray-400 hover:bg-[#0b1013]"}`} onClick={() => setActiveFileId(id)}>
                  <div className="flex-1 truncate text-sm">{files[id]?.name}</div>
                  <button onClick={(e) => closeTab(e, id)} className="p-1 text-gray-400 hover:bg-[#0b1114] rounded"><X size={12} /></button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button title="Undo" className="p-2 rounded hover:bg-[#0b1114] text-gray-400"><CornerUpLeft size={16} /></button>
              <button title="Redo" className="p-2 rounded hover:bg-[#0b1114] text-gray-400"><CornerUpRight size={16} /></button>
              <button title="Run" onClick={runTests} className="px-3 py-1 bg-[#12151b] rounded text-xs">Run</button>
              <button title="More" className="p-2 rounded hover:bg-[#0b1114] text-gray-400"><MoreVertical size={16} /></button>
              <button onClick={onSave} className="ml-2 px-3 py-1 bg-gradient-to-br from-[#8ef3e9] via-[#27f8f1] to-[#49f0a8] text-black rounded text-sm font-semibold shadow">Save</button>
            </div>
          </div>
        </div>

        {/* editor */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-[#0b0f14]">
            <EditorMonaco
              height="100%"
              language={language}
              value={activeContent}
              theme="vscode-clone-dark"
              beforeMount={(monaco) => handleEditorWillMount(monaco)}
              onMount={(editor, monaco) => handleEditorDidMount(editor, monaco)}
              onChange={onEditorChange}
              options={{
                fontFamily: "Fira Code, Menlo, Monaco, monospace",
                fontSize: 13,
                minimap: { enabled: false },
                folding: true,
                lineNumbers: "on",
                automaticLayout: true,
                renderLineHighlight: "line",
                wordWrap: "off",
              }}
            />
          </div>
        </div>

        {/* bottom (full-width) panel placed AFTER editor */}
        <div className="bg-[#071014] border-t border-[#0b1114]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#0b1114]">
            <div className="flex items-center gap-6">
              <button onClick={() => setActiveBottomTab("output")} className={`text-xs ${activeBottomTab === "output" ? "text-white" : "text-gray-400"}`}>OUTPUT</button>
              <button onClick={() => setActiveBottomTab("terminal")} className={`text-xs ${activeBottomTab === "terminal" ? "text-white" : "text-gray-400"}`}>TERMINAL</button>
              <button onClick={() => setActiveBottomTab("problems")} className={`text-xs ${activeBottomTab === "problems" ? "text-white" : "text-gray-400"}`}>PROBLEMS</button>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <button title="Clear all" onClick={() => { setConsoleOutput([]); setTerminalOutput([]); setProblems([]); }} className="p-1 rounded hover:bg-[#0b1114]"><RefreshCw size={16} /></button>
              
            </div>
          </div>

          <div className="h-48 flex">
            {/* output / terminal / problems content area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-sm p-3 text-gray-300 bg-[#071014]">
              {activeBottomTab === "output" && (
                <div className="space-y-1">
                  {consoleOutput.length ? consoleOutput.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>) : <div className="text-gray-500">No output yet</div>}
                </div>
              )}

              {activeBottomTab === "terminal" && (
                <div className="flex flex-col h-full">
                  <div className="flex-1 overflow-auto space-y-1">
                    {terminalOutput.map((line, i) => <div key={i} className="whitespace-pre-wrap">{line}</div>)}
                  </div>

                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input value={terminalInput} onChange={(e) => setTerminalInput(e.target.value)} placeholder="Run a command..." className="flex-1 bg-[#061219] px-3 py-2 rounded text-sm text-gray-100 focus:outline-none" onKeyDown={(e) => e.key === "Enter" && onTerminalExecute()} />
                      <button onClick={onTerminalExecute} className="px-3 py-2 bg-[#0f4f4a] rounded text-sm text-white ">Run</button>
                    </div>
                  </div>
                </div>
              )}

              {activeBottomTab === "problems" && (
                <div>
                  {problems.length === 0 ? <div className="text-gray-500">No problems found</div> : problems.map((p, idx) => (
                    <div key={idx} className="p-2 bg-[#0b1114] rounded mb-2">
                      <div className="text-sm text-gray-200">{files[p.file]?.name || "unknown"}</div>
                      <div className="text-xs text-gray-400">Line {p.line} • {p.message}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-0" />
          </div>
        </div>

        {/* bottom small straight status strip */}
        <div className="h-10 bg-[#061217] border-t border-[#0b1114] flex items-center px-4 text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="text-xs text-gray-200">Server: running</div>
            </div>
            <div className="text-xs text-gray-400">Ln 1, Col 1 • UTF-8</div>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-400">RECENT</div>
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-[#0b1114] rounded text-xs">Edited app.js</div>
              <div className="px-2 py-1 bg-[#0b1114] rounded text-xs">Saved package.json</div>
            </div>
          </div>
        </div>
      </main>

      {/* VS Code–style Chat overlay panel */}
      {chatOpen && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#0b1120] border-l border-[#1e293b] z-40 shadow-xl flex flex-col">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#1f2937] bg-[#020617]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-[#22c55e] via-[#22d3ee] to-[#6366f1] flex items-center justify-center text-[10px] font-semibold text-black">
                  AI
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-100">Chat</div>
                  <div className="text-[11px] text-gray-500">Codio Assistant</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <button
                  title="Clear"
                  className="px-2 py-1 text-[11px] rounded hover:bg-[#020617]"
                  onClick={() =>
                    setChatMessages([
                      { role: "assistant", text: "Chat cleared. Ask a new question about this workspace." },
                    ])
                  }
                >
                  Clear
                </button>
                <button title="Settings" className="p-1 rounded hover:bg-[#020617]"><Settings size={14} /></button>
                <button
                  title="Close"
                  className="p-1 rounded hover:bg-[#020617]"
                  onClick={() => setChatOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar space-y-3 bg-[#020617]">
              {chatMessages.map((m, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="text-[11px] font-medium text-gray-500">
                    {m.role === "assistant" ? "Assistant" : "You"}
                  </div>
                  <div
                    className={`text-sm leading-relaxed rounded-md border px-3 py-2 max-w-full whitespace-pre-wrap ${
                      m.role === "assistant"
                        ? "bg-[#020617] border-[#1f2937] text-gray-100"
                        : "bg-[#020617] border-[#334155] text-sky-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t border-[#1f2937] bg-[#020617] px-3 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask anything about this workspace..."
                  className="flex-1 bg-[#020617] border border-[#1f2937] rounded-md px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder:text-gray-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onChatSend();
                    }
                  }}
                />
                <button
                  onClick={onChatSend}
                  className="px-3 py-2 bg-sky-500 hover:bg-sky-400 rounded-md text-sm font-medium text-black flex items-center gap-1"
                >
                  <Zap size={14} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Chat button (opens overlay) - hidden when chat is open */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          title="Open AI Assistant"
          className="fixed right-6 bottom-15 z-50 bg-gradient-to-br from-[#92FDFA] via-[#27F8F1] to-[#49F0A8] text-black p-3 rounded-full shadow-lg hover:scale-105 transform transition"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {/* global styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; } 
        .no-scrollbar::-webkit-scrollbar { display: none; }
        ::selection { background: rgba(45, 212, 191, 0.16); }
      `}</style>
    </div>
  );
}
