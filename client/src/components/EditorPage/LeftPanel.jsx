import { useState } from "react";
import Explorer from "../EditorPage/explorer/Explorer";
import { FilePlus, FolderPlus, MoreHorizontal, ChevronDown, ChevronRight, GitBranch, RefreshCw, Check, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function LeftPanel({
  tab,
  files,
  activeFileId,
  onToggle,
  onOpen,
  onCreateFile,
  onCreateFolder,
  onRename,
  onDelete,
  modifiedFiles = [],
  searchQuery = "",
  setSearchQuery,
}) {
  const [creating, setCreating] = useState(null);
  const [renamingId, setRenamingId] = useState(null);

  const startCreate = (parentId, type) => {
    setCreating({ parentId, type });
    setRenamingId(null);
  };

  const handleCommitCreate = (parentId, type, name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setCreating(null);
      return;
    }
    if (type === "folder") {
      onCreateFolder?.(parentId, trimmed);
    } else {
      onCreateFile?.(parentId, trimmed);
    }
    setCreating(null);
  };

  const handleCancelCreate = () => {
    setCreating(null);
  };

  const handleCommitRename = (id, name) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setRenamingId(null);
      return;
    }
    onRename?.(id, trimmed);
    setRenamingId(null);
  };

  const handleCancelRename = () => {
    setRenamingId(null);
  };

  const { isDark } = useTheme();

  return (
    <aside className={`w-64 border-r flex flex-col ${
      isDark 
        ? 'bg-[#0f0f0f] border-[#1a1a1a]' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <span>{tab === "files" ? "Explorer" : tab === "search" ? "Search" : tab === "sourceControl" ? "Source Control" : "Guide"}</span>
        <div className="flex items-center gap-1">
          {tab === "files" && (
            <>
              <button
                className={`p-1 rounded ${
                  isDark 
                    ? 'hover:bg-[#1a1a1a] text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
                title="New file"
                onClick={() => startCreate("root", "file")}
              >
                <FilePlus size={14} />
              </button>
              <button
                className={`p-1 rounded ${
                  isDark 
                    ? 'hover:bg-[#1a1a1a] text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
                title="New folder"
                onClick={() => startCreate("root", "folder")}
              >
                <FolderPlus size={14} />
              </button>
            </>
          )}
          <button className={`p-1 rounded ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-100'}`}>
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {tab === "files" && (
          <div className="pt-1">
            <Explorer
              files={files}
              activeFileId={activeFileId}
              onToggle={onToggle}
              onOpen={onOpen}
              creating={creating}
              renamingId={renamingId}
              onStartRename={setRenamingId}
              onStartCreate={startCreate}
              onCommitCreate={handleCommitCreate}
              onCancelCreate={handleCancelCreate}
              onCommitRename={handleCommitRename}
              onCancelRename={handleCancelRename}
              modifiedFiles={modifiedFiles}
              onDelete={onDelete}
            />
          </div>
        )}

        {tab === "search" && (
          <div className="p-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              placeholder="Search"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 ${
                isDark 
                  ? 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-100 placeholder:text-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <div className={`mt-4 text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {searchQuery ? "Searching..." : "Type to search in files"}
            </div>
          </div>
        )}

        {tab === "sourceControl" && (
          <div className="p-3">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>main</span>
              <button className={`ml-auto p-1 rounded ${isDark ? 'hover:bg-[#1a1a1a] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                <RefreshCw size={14} />
              </button>
            </div>

            <div className="space-y-2">
              <div className={`text-xs uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Changes</div>
              {modifiedFiles.length > 0 ? (
                modifiedFiles.map((fileId) => (
                  <div key={fileId} className={`flex items-center gap-2 px-2 py-1 text-sm rounded ${
                    isDark 
                      ? 'text-gray-300 hover:bg-[#1a1a1a]' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}>
                    <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] flex items-center justify-center">M</span>
                    <span className="truncate">{files[fileId]?.name}</span>
                  </div>
                ))
              ) : (
                <div className={`text-xs text-center py-4 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  No changes detected
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <button className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isDark 
                  ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                <Check size={14} />
                Commit
              </button>
              <button className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                isDark 
                  ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}>
                <Plus size={14} />
                Stage All
              </button>
            </div>
          </div>
        )}

        {tab === "guide" && (
          <div className={`p-4 text-sm space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            <div className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Getting Started</div>
            <div className={`leading-relaxed text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Welcome to Codio! Here are some quick tips to get you started:
            </div>
            <ul className={`space-y-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                Use the Explorer to navigate your project files
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                Press Ctrl+S to save your changes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                Open the chat panel to get AI assistance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                Use Source Control to manage your git changes
              </li>
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
