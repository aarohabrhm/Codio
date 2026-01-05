import React, { useCallback, useEffect, useState, useRef } from "react";
import { X, MessageCircle, Undo2, Redo2, Play } from "lucide-react";
import { useParams } from "react-router-dom"; // Import useParams
import axios from "axios"; // Import axios


// Components
import { Sidebar } from "../components/common";
import LeftPanel from "../components/EditorPage/LeftPanel";
import CodeEditor from "../components/EditorPage/editor/CodeEditor";
import BottomPanel from "../components/EditorPage/BottomPanel";
import RightChatPanel from "../components/EditorPage/RightChatPanel";

// Hooks and Data
import { useFileManager } from "../components/EditorPage/hooks";
import { INITIAL_FILES, DEFAULT_OPEN_FILES } from "../components/EditorPage/data";

export default function Editor() {
  const { projectId } = useParams(); // Get ID from URL
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);


  // File management with custom hook
  const {
    files,
    setFiles,
    openFiles,
    setOpenFiles,
    activeFileId,
    activeFile,
    modifiedFiles,
    setActiveFileId,
    toggleFolder,
    openFile,
    closeTab,
    createFile,
    createFolder,
    renameNode,
    deleteNode,
    updateContent,
    saveFile,
  } = useFileManager(INITIAL_FILES, DEFAULT_OPEN_FILES);

  // Editor ref for undo/redo
  const editorRef = useRef(null);

  // UI State
  const [activeLeftTab, setActiveLeftTab] = useState("files");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // Bottom panel state
  const [activeBottomTab, setActiveBottomTab] = useState("problems");
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState(["Welcome to the integrated terminal."]);
  const [terminalInput, setTerminalInput] = useState("");
  const [problems, setProblems] = useState([]);

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8000/api/projects/${projectId}`, {
           headers: { Authorization: `Bearer ${token}` }
        });
        
        setProjectData(res.data);
        
        // Load the files from the backend into the file manager
        if (res.data.files && Object.keys(res.data.files).length > 0) {
            setFiles(res.data.files);
            // Optionally open the first file found (e.g., main.js)
            const firstFile = Object.values(res.data.files).find(f => f.type === 'file');
            if(firstFile) {
                setOpenFiles([firstFile.id]);
                setActiveFileId(firstFile.id);
            }
        }
      } catch (err) {
        console.error("Failed to load project", err);
        setConsoleOutput(prev => [...prev, "Error: Failed to load project files."]);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
        fetchProject();
    }
  }, [projectId, setFiles, setOpenFiles, setActiveFileId]);
  


  // Handle tab close with event propagation stop
  const handleCloseTab = (e, id) => {
    e.stopPropagation();
    closeTab(id);
  };

  // Handle save
  // Handle save (Updated to persist to backend)
  const handleSave = useCallback(async () => {
    // 1. Local save (updates state in hook)
    const fileName = saveFile(); 
    
    // 2. Persist to Backend
    if (projectId && files) {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.put(`http://localhost:8000/api/projects/${projectId}`, 
                { files: files }, // Send the entire file structure
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (fileName) {
                setConsoleOutput((prev) => [...prev, `Saved ${fileName} to cloud.`]);
            }
        } catch (err) {
             setConsoleOutput((prev) => [...prev, `Error saving to cloud.`]);
        }
    }
  }, [saveFile, projectId, files]);

  // Terminal execute
  const onTerminalExecute = () => {
    const cmd = terminalInput.trim();
    if (!cmd) return;
    setTerminalOutput((prev) => [...prev, `> ${cmd}`, "Command executed (simulated)."]);
    setTerminalInput("");
    setActiveBottomTab("terminal");
  };

  // Chat send
  const onChatSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text },
      {
        role: "assistant",
        text: "I'm your AI coding assistant. I can help with code explanations, debugging, refactoring, and more. This is a simulated response.",
      },
    ]);
    setChatInput("");
  };

  // Undo/Redo handlers
  const handleUndo = () => editorRef.current?.undo();
  const handleRedo = () => editorRef.current?.redo();

  // Run code handler
  const handleRunCode = useCallback(() => {
    if (!activeFile) return;
    
    const language = editorRef.current?.getLanguage() || 'unknown';
    const content = editorRef.current?.getContent() || activeFile.content;
    
    setConsoleOutput(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Running ${activeFile.name}...`,
    ]);
    
    // Simulate code execution based on language
    setTimeout(() => {
      if (language === 'javascript') {
        try {
          // Create a safe console capture
          const logs = [];
          const mockConsole = {
            log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args) => logs.push(`Error: ${args.join(' ')}`),
            warn: (...args) => logs.push(`Warning: ${args.join(' ')}`),
          };
          
          // Execute with mock console
          const fn = new Function('console', content);
          fn(mockConsole);
          
          if (logs.length > 0) {
            setConsoleOutput(prev => [...prev, ...logs]);
          }
          setConsoleOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] Execution completed.`]);
        } catch (err) {
          setConsoleOutput(prev => [...prev, `Error: ${err.message}`]);
        }
      } else {
        setConsoleOutput(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] ${language.toUpperCase()} execution simulated.`,
          `Note: Server-side execution required for ${language} files.`
        ]);
      }
    }, 500);
    
    setActiveBottomTab('console');
  }, [activeFile]);

  // Ctrl/Cmd+S shortcut
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

  if (loading) {
      return (
          <div className="h-screen w-full bg-[#0a0a0a] flex items-center justify-center text-gray-400">
              <Loader2 className="animate-spin mr-2" /> Loading Project Environment...
          </div>
      )
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-200">
      {/* Left Activity Bar */}
      <Sidebar activeTab={activeLeftTab} onTabChange={setActiveLeftTab} />

      {/* Left Panel */}
      <LeftPanel
        tab={activeLeftTab}
        files={files}
        activeFileId={activeFileId}
        onToggle={toggleFolder}
        onOpen={openFile}
        onCreateFile={createFile}
        onCreateFolder={createFolder}
        onRename={renameNode}
        onDelete={deleteNode}
        modifiedFiles={modifiedFiles}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Editor Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div className="h-10 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center justify-end px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16} />
            </button>
            <button
              onClick={handleRedo}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16} />
            </button>
            <div className="w-px h-5 bg-[#2a2a2a] mx-2" />
            <button
              onClick={handleRunCode}
              disabled={!activeFile}
              className="px-3 py-1 text-xs text-white bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 rounded flex items-center gap-1.5 transition-colors"
              title="Run Code"
            >
              <Play size={12} fill="currentColor" />
              Run
            </button>
          </div>
          <div className="flex items-center gap-2">
            {!chatOpen && (
              <button
                className="px-3 py-1.5 text-xs text-gray-300 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] flex items-center gap-2 transition-colors"
                onClick={() => setChatOpen(true)}
              >
                <MessageCircle size={14} />
                Chat
              </button>
            )}
          </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a]">
          <div className="flex items-center">
            {openFiles.map((id) => {
              const file = files[id];
              const isModified = modifiedFiles.includes(id);
              return (
                <div
                  key={id}
                  className={`group flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-[#1a1a1a] ${
                    activeFileId === id
                      ? "bg-[#0a0a0a] text-white"
                      : "bg-[#0f0f0f] text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => setActiveFileId(id)}
                >
                  {isModified && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
                  <span className="text-sm">{file?.name}</span>
                  <button
                    onClick={(e) => handleCloseTab(e, id)}
                    className="p-0.5 text-gray-500 rounded opacity-0 group-hover:opacity-100 hover:text-white hover:bg-[#2a2a2a]"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-[#0a0a0a]">
            <CodeEditor ref={editorRef} file={activeFile} onChange={updateContent} onSave={handleSave} />
          </div>
        </div>

        {/* Bottom Panel */}
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
      </main>

      {/* Right Chat Panel */}
      <RightChatPanel
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onChatSend={onChatSend}
        onClearChat={() => setChatMessages([])}
      />

      {/* Global Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        ::selection { background: rgba(34, 211, 238, 0.2); }
      `}</style>
    </div>
  );
}
