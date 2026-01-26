import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom"; // 1. Import useParams
import { X, MessageCircle, Undo2, Redo2, Play, Loader2 } from "lucide-react";
import axios from "axios"; // 2. Import Axios

// Components (Keep existing imports)
import { Sidebar } from "../components/common";
import LeftPanel from "../components/EditorPage/LeftPanel";
import CodeEditor from "../components/EditorPage/editor/CodeEditor";
import BottomPanel from "../components/EditorPage/BottomPanel";
import RightChatPanel from "../components/EditorPage/RightChatPanel";

// Hooks and Data
import { useFileManager } from "../components/EditorPage/hooks";
// Structural root folder (NOT demo data)
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


export default function Editor() {
  const { projectId } = useParams(); // Get Project ID from URL
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // File management
  const {
    files,
    setFiles, // Ensure this is exported from your hook
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
    saveFile, // This saves to local state
  } = useFileManager(EMPTY_PROJECT_FILES, []);


  const editorRef = useRef(null);

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

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
  const fetchProject = async () => {
    if (!projectId) return;

    try {
      setIsLoading(true);

      const res = await axios.get(
        `http://localhost:8000/api/projects/${projectId}`
      );

      if (res.data?.files) {
        setFiles(res.data.files);

        // Open first file automatically
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


const saveRef = useRef(null);



  // --- 2. HANDLE SAVE (Local + Database) ---
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

    await axios.put("http://localhost:8000/api/projects/save", {
      projectId,
      files: updatedFiles,
    });

    // Sync local state after backend success
    setFiles(updatedFiles);
    saveFile();

    setConsoleOutput(prev => [...prev, "Project saved successfully"]);

  } catch (err) {
    console.error(err);
    setConsoleOutput(prev => [...prev, "Error: Save failed"]);
  } finally {
    setIsSaving(false);
  }
}, [files, activeFileId, projectId]);

useEffect(() => {
  saveRef.current = handleSave;
}, [handleSave]);
  // UI Helper functions (Keep these exactly as they were)
  const handleCloseTab = (e, id) => { e.stopPropagation(); closeTab(id); };
  const handleUndo = () => editorRef.current?.undo();
  const handleRedo = () => editorRef.current?.redo();
  const onTerminalExecute = () => { /* ... keep existing logic ... */ };
  const onChatSend = () => { /* ... keep existing logic ... */ };
  
  // Run Code logic (Simplified for brevity, keep your full version)
  const handleRunCode = useCallback(() => {
    if (!activeFile) return;
    setConsoleOutput(prev => [...prev, `Running ${activeFile.name}...`]);
    // ... your existing run logic ...
    setActiveBottomTab('console');
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

  // LOADING SCREEN
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
           {/* Add a small status indicator */}
           <div className="text-xs text-gray-500 flex items-center gap-2">
              {isSaving ? <span className="text-blue-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Saving...</span> : "Ready"}
           </div>

           <div className="flex items-center gap-1">
             <button onClick={handleUndo} className="p-1.5 text-gray-400 hover:text-white rounded"><Undo2 size={16}/></button>
             <button onClick={handleRedo} className="p-1.5 text-gray-400 hover:text-white rounded"><Redo2 size={16}/></button>
             <div className="w-px h-5 bg-[#2a2a2a] mx-2" />
             <button onClick={handleRunCode} disabled={!activeFile} className="px-3 py-1 text-xs text-white bg-emerald-600 rounded flex items-center gap-1.5"><Play size={12}/> Run</button>
           </div>
           
           <div className="flex items-center gap-2">
             {!chatOpen && <button onClick={() => setChatOpen(true)} className="px-3 py-1.5 text-xs bg-[#1a1a1a] rounded-lg flex gap-2"><MessageCircle size={14}/> Chat</button>}
           </div>
        </div>

        {/* Tab Bar */}
        <div className="bg-[#0f0f0f] border-b border-[#1a1a1a]">
          <div className="flex items-center">
            {openFiles.map((id) => {
              const file = files[id];
              const isModified = modifiedFiles.includes(id);
              return (
                <div key={id} onClick={() => setActiveFileId(id)} className={`group flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-[#1a1a1a] ${activeFileId === id ? "bg-[#0a0a0a] text-white" : "bg-[#0f0f0f] text-gray-500"}`}>
                  {isModified && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
                  <span className="text-sm">{file?.name}</span>
                  <button onClick={(e) => handleCloseTab(e, id)} className="opacity-0 group-hover:opacity-100 hover:bg-[#2a2a2a] p-0.5 rounded"><X size={12} /></button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 bg-[#0a0a0a]">
            <CodeEditor
  ref={editorRef}
  file={activeFile}
  onChange={updateContent}
  onSave={() => saveRef.current?.()}
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
          onClearAll={() => { setConsoleOutput([]); setTerminalOutput([]); setProblems([]); }}
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