import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { X, MessageCircle, Undo2, Redo2, Play, Loader2 } from "lucide-react";
import axios from "axios";

// Components
import { Sidebar } from "../components/common";
import LeftPanel from "../components/EditorPage/LeftPanel";
import CodeEditor from "../components/EditorPage/editor/CodeEditor";
import BottomPanel from "../components/EditorPage/BottomPanel";
import RightChatPanel from "../components/EditorPage/RightChatPanel";
import OnlineUsers from "../components/EditorPage/OnlineUsers";
import CursorOverlay from "../components/EditorPage/CursorOverlay";

// Hooks
import { useFileManager } from "../components/EditorPage/hooks";
import { useCollaboration } from "../components/EditorPage/hooks/useCollaboration";

const EMPTY_PROJECT_FILES = {
  root: {
    id: "root",
    name: "root",
    type: "folder",
    parent: null,
    children: [],
    isOpen: true,
  },
};
// Helper to map file extensions to backend languages
const getLanguageFromExtension = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript',
    jsx: 'javascript',
    py: 'python',
    c: 'c',
    cpp: 'cpp',
    // Add these if you add Docker images for them later:
    // java: 'java',
    // go: 'go', 
    // rs: 'rust'
  };
  return map[ext] || 'plaintext';
};

export default function Editor() {
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // File management
  const {
    files,
    setFiles,
    openFiles,
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
  } = useFileManager(EMPTY_PROJECT_FILES, []);

  // Collaboration
  const {
    isConnected,
    onlineUsers,
    userCursors,
    myColor,
    sendCursor,
    sendCodeChange,
    sendFileSelect
  } = useCollaboration(projectId);

  const editorRef = useRef(null);
  const saveRef = useRef(null);

  // UI State
  const [activeLeftTab, setActiveLeftTab] = useState("files");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState(["> Ready."]);
  const [terminalInput, setTerminalInput] = useState("");
  const [problems, setProblems] = useState([]);
  const [activeBottomTab, setActiveBottomTab] = useState("problems");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        setIsLoading(true);

        const res = await axios.get(
          `http://localhost:8000/api/projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        if (res.data?.files) {
          setFiles(res.data.files);

          const firstFile = Object.values(res.data.files)
            .find(f => f.type === "file");

          if (firstFile) {
            setActiveFileId(firstFile.id);
          }
        }

      } catch (err) {
        console.error(err);
        setConsoleOutput(prev => [
          ...prev,
          "Error: Failed to load project from backend"
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!projectId) return;

    setIsSaving(true);

    try {
      let updatedFiles = { ...files };

      if (activeFileId && editorRef.current) {
        updatedFiles[activeFileId] = {
          ...updatedFiles[activeFileId],
          content: editorRef.current.getContent(),
        };
      }

      await axios.put(`http://localhost:8000/api/projects/${projectId}`, {
        files: updatedFiles,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setFiles(updatedFiles);
      saveFile();

      setConsoleOutput(prev => [...prev, "✅ Project saved successfully"]);

    } catch (err) {
      console.error(err);
      setConsoleOutput(prev => [...prev, "❌ Error: Save failed"]);
    } finally {
      setIsSaving(false);
    }
  }, [files, activeFileId, projectId]);

  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  // Handle cursor movement
  const handleCursorChange = useCallback((line, column) => {
    if (activeFileId) {
      sendCursor(line, column, activeFileId);
    }
  }, [activeFileId, sendCursor]);

  // Handle content change
  const handleContentChange = useCallback((content) => {
    updateContent(content);
    
    // Optionally send changes to other users
    // sendCodeChange(activeFileId, content);
  }, [updateContent, activeFileId, sendCodeChange]);

  // Notify when file is opened
  useEffect(() => {
    if (activeFileId) {
      sendFileSelect(activeFileId);
    }
  }, [activeFileId, sendFileSelect]);

  // UI Helper functions
  const handleCloseTab = (e, id) => { 
    e.stopPropagation(); 
    closeTab(id); 
  };
  
  const handleUndo = () => editorRef.current?.undo();
  const handleRedo = () => editorRef.current?.redo();
  
  const onTerminalExecute = () => {
    if (!terminalInput.trim()) return;
    setTerminalOutput(prev => [...prev, `> ${terminalInput}`, "Command executed"]);
    setTerminalInput("");
  };
  
  const onChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages(prev => [
      ...prev,
      { role: "user", text: chatInput },
      { role: "assistant", text: "I'm here to help! (Demo response)" }
    ]);
    setChatInput("");
  };

  const handleRunCode = useCallback(async () => {
  if (!activeFile || !editorRef.current) return;

  // 1. Detect language
  const language = getLanguageFromExtension(activeFile.name);
  if (language === "plaintext") {
    setConsoleOutput(["❌ Error: This file type cannot be executed."]);
    setActiveBottomTab("console");
    return;
  }

  // 2. UI reset
  setConsoleOutput([]);
  setTerminalOutput([`> Running ${activeFile.name} (${language})...`]);
  setActiveBottomTab("console");

  try {
    if (!editorRef.current) return;
    // 3. Always trust editor content
    const sourceCode = editorRef.current.getContent();

    const res = await axios.post(
      "http://localhost:8000/api/execute",
      { language, sourceCode },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    const { run } = res.data;

    // 4. ACCUMULATE OUTPUT ONCE (FIX 3)
    const outputLines = [];

    if (run.stdout?.trim()) {
      outputLines.push(...run.stdout.split("\n"));
    }

    if (run.stderr?.trim()) {
      outputLines.push(
        ...run.stderr.split("\n").map((l) => `⚠️ ${l}`)
      );
    }

    if (outputLines.length === 0) {
      outputLines.push("✔ Program finished with no output.");
    }

    // ✅ SINGLE STATE UPDATE
    setConsoleOutput(outputLines);

    setTerminalOutput((prev) => [
      ...prev,
      `> Process exited with code ${run.code}`,
    ]);
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message;

    setConsoleOutput([`❌ Execution Failed: ${errorMessage}`]);
  }
}, [activeFile]);


  // Ctrl+S Listener
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

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center text-gray-400 gap-4">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        <p>Loading project environment...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-200">
      <Sidebar activeTab={activeLeftTab} onTabChange={setActiveLeftTab} />
      
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

      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div className="h-10 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center justify-between px-4">
          {/* Left: Status & Save */}
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {isSaving ? (
                <span className="text-blue-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin"/> Saving...
                </span>
              ) : "Ready"}
            </div>

            <div className="w-px h-5 bg-[#2a2a2a]" />

            {/* Online Users */}
            <OnlineUsers 
              onlineUsers={onlineUsers}
              isConnected={isConnected}
              myColor={myColor}
            />
          </div>

          {/* Center: Editor Actions */}
          <div className="flex items-center gap-1">
            <button 
              onClick={handleUndo} 
              className="p-1.5 text-gray-400 hover:text-white rounded"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16}/>
            </button>
            <button 
              onClick={handleRedo} 
              className="p-1.5 text-gray-400 hover:text-white rounded"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16}/>
            </button>
            <div className="w-px h-5 bg-[#2a2a2a] mx-2" />
            <button 
              onClick={handleRunCode} 
              disabled={!activeFile} 
              className="px-3 py-1 text-xs text-white bg-emerald-600 rounded flex items-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={12}/> Run
            </button>
          </div>
           
          {/* Right: Chat */}
          <div className="flex items-center gap-2">
            {!chatOpen && (
              <button 
                onClick={() => setChatOpen(true)} 
                className="px-3 py-1.5 text-xs bg-[#1a1a1a] rounded-lg flex gap-2 hover:bg-[#2a2a2a]"
              >
                <MessageCircle size={14}/> Chat
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
                  onClick={() => setActiveFileId(id)} 
                  className={`group flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-[#1a1a1a] ${
                    activeFileId === id 
                      ? "bg-[#0a0a0a] text-white" 
                      : "bg-[#0f0f0f] text-gray-500 hover:bg-[#1a1a1a]"
                  }`}
                >
                  {isModified && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
                  <span className="text-sm">{file?.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(e, id)} 
                    className="opacity-0 group-hover:opacity-100 hover:bg-[#2a2a2a] p-0.5 rounded"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex overflow-hidden relative">
          <div className="flex-1 bg-[#0a0a0a]">
            <CodeEditor
              ref={editorRef}
              file={activeFile}
              onChange={handleContentChange}
              onCursorChange={handleCursorChange}
              onSave={() => saveRef.current?.()}
            />
            
            {/* Cursor Overlays */}
            <CursorOverlay 
              userCursors={userCursors}
              activeFileId={activeFileId}
              onlineUsers={onlineUsers}
            />
          </div>
        </div>

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

      <RightChatPanel
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onChatSend={onChatSend}
        onClearChat={() => setChatMessages([])}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        ::selection { background: rgba(34, 211, 238, 0.2); }
      `}</style>
    </div>
  );
}