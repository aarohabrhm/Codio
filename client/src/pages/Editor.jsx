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
import { useTheme } from "../context/ThemeContext";

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
  };
  return map[ext] || 'plaintext';
};

const getMyUserId = () => {
  const token =
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken");

  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
};

export default function Editor() {
  const { projectId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isDark } = useTheme();

  // --- Checkpoint State ---
  const [checkpoints, setCheckpoints] = useState([]);
  const [selectedCheckpointId, setSelectedCheckpointId] = useState(null);
  const [currentHeadId, setCurrentHeadId] = useState(null); // Tracks the "Green Dot"

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
    updateContent,
    saveFile,
  } = useFileManager(EMPTY_PROJECT_FILES, []);

  const {
    isConnected,
    onlineUsers,
    userCursors,
    userSelections,
    myColor,
    teamMessages,
    typingUsers,
    sendCursor,
    sendSelection,
    sendCodeChange,
    sendFileSelect,
    sendFileCreated,
    sendFolderCreated,
    sendFileRenamed,
    sendFileDeleted,
    sendProjectReverted,
    sendChatMessage,
    sendChatTyping,
    markMessagesAsSeen
  } = useCollaboration(projectId);

  const editorRef = useRef(null);
  const saveRef = useRef(null);
  const myUserId = getMyUserId();

  // UI State
  const [unseenCount, setUnseenCount] = useState(0);
  const [chatMode, setChatMode] = useState("ai");
  const [activeLeftTab, setActiveLeftTab] = useState("files");
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [terminalOutput, setTerminalOutput] = useState(["> Ready."]);
  const [terminalInput, setTerminalInput] = useState("");
  const [problems, setProblems] = useState([]);
  const [activeBottomTab, setActiveBottomTab] = useState("problems");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const deleteNode = useCallback((fileId) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      const file = newFiles[fileId];
      
      if (file && file.parent) {
        const parent = newFiles[file.parent];
        if (parent) {
          parent.children = parent.children.filter(id => id !== fileId);
        }
      }
      
      delete newFiles[fileId];
      return newFiles;
    });
    
    sendFileDeleted(fileId);
  }, [setFiles, sendFileDeleted]);

  // --- Checkpoint Functions ---
  const fetchCheckpoints = useCallback(async () => {
  if (!projectId) return;
  try {
    const res = await axios.get(`http://localhost:8000/api/projects/${projectId}/checkpoints`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}` }
    });

    // Response is now { checkpoints: [...], currentCheckpointId: "..." }
    setCheckpoints(res.data.checkpoints);

    if (res.data.currentCheckpointId) {
      setCurrentHeadId(res.data.currentCheckpointId);
    }
  } catch (err) {
    console.error("Failed to load checkpoints", err);
  }
}, [projectId]);

  useEffect(() => {
    fetchCheckpoints();
  }, [fetchCheckpoints]);

  const handleCommitCheckpoint = async (message, description) => {
  try {
    await handleSave();
    
    const res = await axios.post(
      `http://localhost:8000/api/projects/${projectId}/checkpoints`,
      { message, description },
      { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}` } }
    );
    
    setCurrentHeadId(res.data._id);
    fetchCheckpoints(); 
    setConsoleOutput(prev => [...prev, `✅ Checkpoint saved: ${message}`]);
  } catch (err) {
    console.error(err);
    setConsoleOutput(prev => [...prev, "❌ Failed to save checkpoint."]);
  }
};

const handleRevertCheckpoint = async (cpId) => {
  try {
    const res = await axios.post(
      `http://localhost:8000/api/projects/${projectId}/checkpoints/${cpId}/revert`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}` } }
    );
    
    const newFiles = res.data.files;
    
    console.log("Reverted files:", JSON.stringify(newFiles, null, 2));
    
    setFiles(newFiles);
    setCurrentHeadId(cpId);
    
    Object.keys(newFiles).forEach(fileId => {
      if (newFiles[fileId].type === 'file') {
        window.dispatchEvent(new CustomEvent('remote-code-update', {
          detail: { 
            fileId, 
            content: newFiles[fileId].content ?? ''
          }
        }));
      }
    });

    sendProjectReverted(newFiles, cpId);
    setConsoleOutput(prev => [...prev, "⏪ Successfully reverted to checkpoint."]);
  } catch (err) {
    console.error(err);
    setConsoleOutput(prev => [...prev, "❌ Failed to revert checkpoint."]);
  }
};

  const handleDeleteCheckpoint = async (cpId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/projects/${projectId}/checkpoints/${cpId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken')}` } }
      );
      fetchCheckpoints(); 
      setConsoleOutput(prev => [...prev, "🗑️ Checkpoint deleted."]);
    } catch (err) {
      console.error(err);
      setConsoleOutput(prev => [...prev, "❌ Failed to delete checkpoint."]);
    }
  };
  // ----------------------------

  const createFile = useCallback((parentId, name) => {
    const fileData = {
      id: `file-${Date.now()}`,
      name,
      type: 'file',
      parent: parentId,
      content: ''
    };
    
    setFiles(prev => ({
      ...prev,
      [fileData.id]: fileData,
      [parentId]: {
        ...prev[parentId],
        children: [...(prev[parentId]?.children || []), fileData.id]
      }
    }));
    
    sendFileCreated(parentId, fileData);
  }, [setFiles, sendFileCreated]);

  const createFolder = useCallback((parentId, name) => {
    const folderData = {
      id: `folder-${Date.now()}`,
      name,
      type: 'folder',
      parent: parentId,
      children: [],
      isOpen: false
    };
    
    setFiles(prev => ({
      ...prev,
      [folderData.id]: folderData,
      [parentId]: {
        ...prev[parentId],
        children: [...(prev[parentId]?.children || []), folderData.id]
      }
    }));
    
    sendFolderCreated(parentId, folderData);
  }, [setFiles, sendFolderCreated]);

  const renameNode = useCallback((fileId, newName) => {
    setFiles(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        name: newName
      }
    }));
    
    sendFileRenamed(fileId, newName);
  }, [setFiles, sendFileRenamed]);

  // Sync team messages to chat
  useEffect(() => {
    if (chatMode !== "team") return;
    setChatMessages(teamMessages);
  }, [teamMessages, chatMode]);

  // Listen for remote file operations
  useEffect(() => {
  const handleFileCreated = (event) => {
    const { parentId, fileData } = event.detail;
    setFiles(prev => ({
      ...prev,
      [fileData.id]: fileData,
      [parentId]: {
        ...prev[parentId],
        children: [...(prev[parentId]?.children || []), fileData.id]
      }
    }));
  };

  const handleFolderCreated = (event) => {
    const { parentId, folderData } = event.detail;
    setFiles(prev => ({
      ...prev,
      [folderData.id]: folderData,
      [parentId]: {
        ...prev[parentId],
        children: [...(prev[parentId]?.children || []), folderData.id]
      }
    }));
  };

  const handleProjectReverted = (event) => {
    const { files: revertedFiles, cpId, username } = event.detail;
    
    setFiles(revertedFiles);
    setCurrentHeadId(cpId);

    Object.keys(revertedFiles).forEach(fileId => {
      if (revertedFiles[fileId].type === 'file') {
        window.dispatchEvent(new CustomEvent('remote-code-update', {
          detail: {
            fileId,
            content: revertedFiles[fileId].content ?? ''
          }
        }));
      }
    });

    setConsoleOutput(prev => [...prev, `⏪ ${username} reverted the project.`]);
  };

  const handleFileRenamed = (event) => {
    const { fileId, newName } = event.detail;
    setFiles(prev => ({
      ...prev,
      [fileId]: {
        ...prev[fileId],
        name: newName
      }
    }));
  };

  const handleFileDeleted = (event) => {
    const { fileId } = event.detail;
    setFiles(prev => {
      const newFiles = { ...prev };
      const file = newFiles[fileId];
      
      if (file && file.parent) {
        const parent = newFiles[file.parent];
        if (parent) {
          parent.children = parent.children.filter(id => id !== fileId);
        }
      }
      
      delete newFiles[fileId];
      return newFiles;
    });
  };

  window.addEventListener('remote-file-created', handleFileCreated);
  window.addEventListener('remote-folder-created', handleFolderCreated);
  window.addEventListener('remote-file-renamed', handleFileRenamed);
  window.addEventListener('remote-file-deleted', handleFileDeleted);
  window.addEventListener('remote-project-reverted', handleProjectReverted);

  return () => {
    window.removeEventListener('remote-file-created', handleFileCreated);
    window.removeEventListener('remote-folder-created', handleFolderCreated);
    window.removeEventListener('remote-file-renamed', handleFileRenamed);
    window.removeEventListener('remote-file-deleted', handleFileDeleted);
    window.removeEventListener('remote-project-reverted', handleProjectReverted);
  };
}, [setFiles, activeFileId]);

  // Mark messages as seen
  useEffect(() => {
    if (!projectId || chatMode !== "team" || !chatOpen) return;

    const unseenMessages = teamMessages.filter(
      msg => msg.senderId !== myUserId && !msg.seenBy?.includes(myUserId)
    );

    if (unseenMessages.length > 0) {
      const messageIds = unseenMessages.map(m => m._id);
      markMessagesAsSeen(messageIds);
    }
  }, [projectId, chatMode, chatOpen, teamMessages, myUserId, markMessagesAsSeen]);

  // Track unseen messages
  useEffect(() => {
    if (chatMode !== "team") return;

    if (chatOpen) {
      setUnseenCount(0);
    } else {
      const unseen = teamMessages.filter(
        msg => msg.senderId !== myUserId && !msg.seenBy?.includes(myUserId)
      ).length;
      setUnseenCount(unseen);
    }
  }, [teamMessages, chatOpen, chatMode, myUserId]);

  // Load chat history
  useEffect(() => {
    if (!projectId || chatMode !== "team") return;

    const loadChatHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/chat/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${
                localStorage.getItem("accessToken") ||
                sessionStorage.getItem("accessToken")
              }`,
            },
          }
        );

        setChatMessages(res.data);
        
        if (!chatOpen) {
          const unseen = res.data.filter(
            msg => msg.senderId !== myUserId && !msg.seenBy?.includes(myUserId)
          ).length;
          setUnseenCount(unseen);
        }
      } catch (err) {
        console.error("❌ Failed to load chat history", err);
      }
    };

    loadChatHistory();
  }, [projectId, chatMode, myUserId, chatOpen]);

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
  }, [projectId, setFiles, setActiveFileId]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!projectId) return;

    setIsSaving(true);

    try {
      let updatedFiles = { ...files };

      if (activeFileId && editorRef.current) {
        const currentContent = editorRef.current.getContent();
        updatedFiles[activeFileId] = {
          ...updatedFiles[activeFileId],
          content: currentContent,
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
  }, [files, activeFileId, projectId, setFiles, saveFile]);

  useEffect(() => {
    saveRef.current = handleSave;
  }, [handleSave]);

  // Handle cursor movement
  const handleCursorChange = useCallback((line, column) => {
    if (activeFileId) {
      sendCursor(line, column, activeFileId);
    }
  }, [activeFileId, sendCursor]);

  const handleContentChange = useCallback((content) => {
    if (!activeFileId) return;
    updateContent(content);
    sendCodeChange(activeFileId, null, content);
  }, [activeFileId, updateContent, sendCodeChange]);

  useEffect(() => {
    if (activeFileId) {
      sendFileSelect(activeFileId);
    }
  }, [activeFileId, sendFileSelect]);

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

  const typingTimeoutRef = useRef(null);
  const handleTyping = () => {
    if (chatMode !== "team") return;

    sendChatTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendChatTyping(false);
    }, 2000);
  };

  const onChatSend = () => {
    if (!chatInput.trim()) return;

    if (chatMode === "team") {
      sendChatTyping(false);
      sendChatMessage(chatInput.trim());
    } else {
      setChatMessages(prev => [
        ...prev,
        { role: "user", text: chatInput.trim() }
      ]);
    }

    setChatInput("");
  };

  const handleRunCode = useCallback(async () => {
    if (!activeFile || !editorRef.current) return;

    const language = getLanguageFromExtension(activeFile.name);
    if (language === "plaintext") {
      setConsoleOutput(["❌ Error: This file type cannot be executed."]);
      setActiveBottomTab("console");
      return;
    }

    setConsoleOutput([]);
    setTerminalOutput([`> Running ${activeFile.name} (${language})...`]);
    setActiveBottomTab("console");

    try {
      if (!editorRef.current) return;
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
      <div className={`h-screen w-full flex flex-col items-center justify-center gap-4 ${
        isDark ? 'bg-[#0a0a0a] text-gray-400' : 'bg-gray-50 text-gray-500'
      }`}>
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        <p>Loading project environment...</p>
      </div>
    );
  }

  const handleTabChange = (tab) => {
    if (tab === activeLeftTab) {
      setLeftPanelVisible((prev) => !prev);
    } else {
      setActiveLeftTab(tab);
      setLeftPanelVisible(true);
    }
  };

  return (
    <div className={`flex h-screen w-full ${isDark ? 'bg-[#0a0a0a] text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      <Sidebar 
        activeTab={activeLeftTab} 
        onTabChange={handleTabChange}
        isPanelVisible={leftPanelVisible}
      />
      
      {leftPanelVisible && (
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
          checkpoints={checkpoints}
          selectedCheckpointId={selectedCheckpointId}
          currentHeadId={currentHeadId}               // NEW: Passing down HEAD
          onSelectCheckpoint={setSelectedCheckpointId}
          onCommitCheckpoint={handleCommitCheckpoint}
          onRevertCheckpoint={handleRevertCheckpoint}
          onDeleteCheckpoint={handleDeleteCheckpoint} 
        />
      )}

      <main className="flex-1 flex flex-col min-w-0">
        <div className={`h-10 border-b flex items-center justify-between px-4 ${
          isDark 
            ? 'bg-[#0a0a0a] border-[#1a1a1a]' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`text-xs flex items-center gap-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {isSaving ? (
                <span className="text-blue-400 flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin"/> Saving...
                </span>
              ) : "Ready"}
            </div>

            <div className={`w-px h-5 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />

            <OnlineUsers 
              onlineUsers={onlineUsers}
              isConnected={isConnected}
              myColor={myColor}
            />
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={handleUndo} 
              className={`p-1.5 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={16}/>
            </button>
            <button 
              onClick={handleRedo} 
              className={`p-1.5 rounded ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={16}/>
            </button>
            <div className={`w-px h-5 mx-2 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />
            <button 
              onClick={handleRunCode} 
              disabled={!activeFile} 
              className="px-3 py-1 text-xs text-white bg-emerald-600 rounded flex items-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play size={12}/> Run
            </button>
          </div>
            
          <div className="flex items-center gap-2">
            {!chatOpen && (
              <button 
                onClick={() => setChatOpen(true)} 
                className={`relative px-3 py-1.5 text-xs rounded-lg flex gap-2 ${
                  isDark 
                    ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <MessageCircle size={14}/> Chat
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center animate-pulse">
                    {unseenCount > 9 ? "9+" : unseenCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        <div className={`border-b ${isDark ? 'bg-[#0f0f0f] border-[#1a1a1a]' : 'bg-gray-100 border-gray-200'}`}>
          <div className="flex items-center">
            {openFiles.map((id) => {
              const file = files[id];
              const isModified = modifiedFiles.includes(id);
              return (
                <div 
                  key={id} 
                  onClick={() => setActiveFileId(id)} 
                  className={`group flex items-center gap-2 px-4 py-2 cursor-pointer border-r ${
                    isDark ? 'border-[#1a1a1a]' : 'border-gray-200'
                  } ${
                    activeFileId === id 
                      ? `${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-white text-gray-900'}` 
                      : `${isDark ? 'bg-[#0f0f0f] text-gray-500 hover:bg-[#1a1a1a]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`
                  }`}
                >
                  {isModified && <span className="w-2 h-2 rounded-full bg-yellow-400" />}
                  <span className="text-sm">{file?.name}</span>
                  <button 
                    onClick={(e) => handleCloseTab(e, id)} 
                    className={`opacity-0 group-hover:opacity-100 p-0.5 rounded ${
                      isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-300'
                    }`}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          <div className={`flex-1 relative ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
            <CodeEditor
              ref={editorRef}
              file={activeFile}
              onChange={handleContentChange}
              onCursorChange={handleCursorChange}
              onSave={() => saveRef.current?.()}
            />
            
            <CursorOverlay 
              userCursors={userCursors}
              userSelections={userSelections}
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
        chatMode={chatMode}
        setChatMode={setChatMode}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        onChatSend={onChatSend}
        onTyping={handleTyping}
        typingUsers={typingUsers}
        onClearChat={() => setChatMessages([])}
        myUserId={myUserId}
        unseenCount={unseenCount}
      />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#2a2a2a' : '#d1d5db'}; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        ::selection { background: rgba(34, 211, 238, 0.2); }
      `}</style>
    </div>
  );
}