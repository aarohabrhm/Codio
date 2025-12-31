import React, { useCallback, useEffect, useRef, useState } from "react";
import { CornerUpLeft, CornerUpRight, MoreVertical, X } from "lucide-react";
import LeftTabs from "../components/EditorPage/LeftTabs";
import LeftPanel from "../components/EditorPage/LeftPanel";
import CodeEditor from "../components/EditorPage/editor/CodeEditor";
import BottomPanel from "../components/EditorPage/BottomPanel";

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
  root: {
    id: "root",
    name: "Explorer",
    type: "folder",
    isOpen: true,
    children: ["backend", "frontend", "assets"],
  },
  backend: {
    id: "backend",
    name: "backend",
    type: "folder",
    isOpen: true,
    parent: "root",
    children: ["app-js", "package-json"],
  },
  "app-js": {
    id: "app-js",
    name: "app.js",
    type: "file",
    parent: "backend",
    status: "A",
    content: INITIAL_CODE_C_SHARP,
  },
  "package-json": {
    id: "package-json",
    name: "package.json",
    type: "file",
    parent: "backend",
    content: '{ "name": "demo", "version": "1.0.0" }',
  },
  frontend: {
    id: "frontend",
    name: "frontend",
    type: "folder",
    parent: "root",
    children: ["index-html", "style-css"],
  },
  "index-html": {
    id: "index-html",
    name: "index.html",
    type: "file",
    parent: "frontend",
    content: "<!doctype html>\\n<html></html>",
  },
  "style-css": {
    id: "style-css",
    name: "style.css",
    type: "file",
    parent: "frontend",
    content: "body { background: #0b0f14; color: #c9d1d9 }",
  },
  assets: {
    id: "assets",
    name: "assets",
    type: "folder",
    parent: "root",
    isOpen: true,
    children: ["logo-png"],
  },
  "logo-png": {
    id: "logo-png",
    name: "logo.png",
    type: "file",
    parent: "assets",
    content: "",
  },
};

export default function IdeWithSideTabsAndChat() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [openFiles, setOpenFiles] = useState(["app-js", "style-css"]);
  const [activeFileId, setActiveFileId] = useState("app-js");

  // bottom panel
  const [activeBottomTab, setActiveBottomTab] = useState("output");
  const [consoleOutput, setConsoleOutput] = useState([
    "vite v5.2.1 ready in 3.47s",
    "➜  Local: http://localhost:5173/",
    "Server running — watching for file changes ...",
  ]);
  const [terminalOutput, setTerminalOutput] = useState([
    "Welcome to the integrated terminal.",
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [problems, setProblems] = useState([]);

  // chat
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      text: "Hello — I'm your coding assistant. Ask me anything about this workspace.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // left tabs (Files / Guide / Help / Chat)
  const [activeLeftTab, setActiveLeftTab] = useState("files");

  // editor
  const untitledCounter = useRef(1);

  const activeFile = activeFileId ? files[activeFileId] : null;

  // Explorer actions
  const toggleFolder = (id) => {
    setFiles((prev) => ({
      ...prev,
      [id]: { ...prev[id], isOpen: !prev[id].isOpen },
    }));
  };

  const openFile = (fileId) => {
    const node = files[fileId];
    if (!node) return;
    if (node.type === "folder") {
      toggleFolder(fileId);
      return;
    }

    setOpenFiles((prev) =>
      prev.includes(fileId) ? prev : [...prev, fileId]
    );
    setActiveFileId(fileId);
  };

  const createNode = (parentId, name, type) => {
    const idNumber = untitledCounter.current++;
    const newId = `node-${idNumber}`;

    const newNode = {
      id: newId,
      name,
      type,
      parent: parentId,
      ...(type === "folder"
        ? { children: [], isOpen: true }
        : { content: "" }),
    };

    setFiles((prev) => {
      const updated = { ...prev, [newId]: newNode };
      const parent = prev[parentId];
      if (parent) {
        const children = Array.isArray(parent.children) ? parent.children : [];
        updated[parentId] = {
          ...parent,
          children: [...children, newId],
          isOpen: true,
        };
      }
      return updated;
    });

    if (type === "file") {
      setOpenFiles((prev) => [...prev, newId]);
      setActiveFileId(newId);
      setActiveLeftTab("files");
    }
  };

  const handleCreateFile = (parentId, name) => {
    createNode(parentId || "root", name, "file");
  };

  const handleCreateFolder = (parentId, name) => {
    createNode(parentId || "root", name, "folder");
  };

  const handleRename = (id, newName) => {
    setFiles((prev) => {
      const node = prev[id];
      if (!node) return prev;
      return {
        ...prev,
        [id]: { ...node, name: newName },
      };
    });
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    setOpenFiles((prev) => {
      const next = prev.filter((fid) => fid !== id);
      if (activeFileId === id) {
        setActiveFileId(next.length ? next[next.length - 1] : null);
      }
      return next;
    });
  };

  const onEditorChange = (value) => {
    if (!activeFileId) return;
    const content = typeof value === "string" ? value : "";
    setFiles((prev) => ({
      ...prev,
      [activeFileId]: {
        ...prev[activeFileId],
        content,
      },
    }));
  };

  const handleSave = useCallback(() => {
    if (!activeFileId) return;
    const name = files[activeFileId]?.name || "file";
    setConsoleOutput((prev) => [...prev, `Saved ${name}`]);
  }, [activeFileId, files]);

  const runTests = () => {
    setActiveBottomTab("output");
    setConsoleOutput((prev) => [
      ...prev,
      "",
      "> npm test",
      "Test suite starting...",
      "All tests passed (simulated).",
    ]);
    setProblems([
      {
        file: "app-js",
        line: 4,
        message: "Example warning: 'result' is assigned but never used.",
      },
    ]);
  };

  const onTerminalExecute = () => {
    const cmd = terminalInput.trim();
    if (!cmd) return;
    setTerminalOutput((prev) => [
      ...prev,
      `> ${cmd}`,
      "Command executed (simulated).",
    ]);
    setTerminalInput("");
    setActiveBottomTab("terminal");
  };

  const onChatSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text },
      {
        role: "assistant",
        text:
          "This is a simulated response. Hook this up to your backend AI to answer questions about the workspace.",
      },
    ]);
    setChatInput("");
    setActiveLeftTab("chat");
  };

  // Ctrl/Cmd+S global shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  return (
    <div className="flex h-screen w-full bg-[#0b0f14] text-gray-300">
      {/* Left vertical tab bar + left panel */}
      <div className="flex">
        <LeftTabs active={activeLeftTab} onChange={setActiveLeftTab} />

        <LeftPanel
          tab={activeLeftTab}
          files={files}
          activeFileId={activeFileId}
          onToggle={toggleFolder}
          onOpen={openFile}
          onCreateFile={handleCreateFile}
          onCreateFolder={handleCreateFolder}
          onRename={handleRename}
          chatMessages={chatMessages}
          chatInput={chatInput}
          setChatInput={setChatInput}
          onChatSend={onChatSend}
          onClearChat={() =>
            setChatMessages([
              {
                role: "assistant",
                text: "Chat cleared. Ask a new question about this workspace.",
              },
            ])
          }
        />
      </div>

      {/* Center Editor area */}
      <main className="flex-1 flex flex-col">
        {/* top tabs + toolbar */}
        <div className="bg-[#071014] border-b border-[#0b1114]">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-end gap-1 overflow-x-auto no-scrollbar">
              {openFiles.map((id) => (
                <div
                  key={id}
                  className={`min-w-[140px] px-4 py-2 rounded-t-md flex items-center gap-3 cursor-pointer ${
                    activeFileId === id
                      ? "bg-[#081019] text-white border-b-2 border-teal-500"
                      : "bg-[#071014] text-gray-400 hover:bg-[#0b1013]"
                  }`}
                  onClick={() => setActiveFileId(id)}
                >
                  <div className="flex-1 truncate text-sm">{files[id]?.name}</div>
                  <button
                    onClick={(e) => closeTab(e, id)}
                    className="p-1 text-gray-400 hover:bg-[#0b1114] rounded"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                title="Undo"
                className="p-2 rounded hover:bg-[#0b1114] text-gray-400"
              >
                <CornerUpLeft size={16} />
              </button>
              <button
                title="Redo"
                className="p-2 rounded hover:bg-[#0b1114] text-gray-400"
              >
                <CornerUpRight size={16} />
              </button>
              <button
                title="Run"
                onClick={runTests}
                className="px-3 py-1 bg-[#12151b] rounded text-xs"
              >
                Run
              </button>
              <button
                title="More"
                className="p-2 rounded hover:bg-[#0b1114] text-gray-400"
              >
                <MoreVertical size={16} />
              </button>
              <button
                onClick={handleSave}
                className="ml-2 px-3 py-1 bg-gradient-to-br from-[#8ef3e9] via-[#27f8f1] to-[#49f0a8] text-black rounded text-sm font-semibold shadow"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* editor */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-[#0b0f14]">
            <CodeEditor
              file={activeFile}
              onChange={onEditorChange}
              onSave={handleSave}
            />
          </div>
        </div>

        {/* bottom (full-width) panel placed AFTER editor */}
        <BottomPanel
          activeTab={activeBottomTab}
          setActiveTab={setActiveBottomTab}
          consoleOutput={consoleOutput}
          terminalOutput={terminalOutput}
          terminalInput={terminalInput}
          setTerminalInput={setTerminalInput}
          problems={problems}
          onTerminalExecute={onTerminalExecute}
          onClearAll={() => {
            setConsoleOutput([]);
            setTerminalOutput([]);
            setProblems([]);
          }}
          files={files}
        />

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
              <div className="px-2 py-1 bg-[#0b1114] rounded text-xs">
                Edited app.js
              </div>
              <div className="px-2 py-1 bg-[#0b1114] rounded text-xs">
                Saved package.json
              </div>
            </div>
          </div>
        </div>
      </main>

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
