import { useState } from "react";
import codioLogo from "../../assets/logo.png";
import Explorer from "../EditorPage/explorer/Explorer";
import { FilePlus, FolderPlus, Search, Settings, Zap } from "lucide-react";

export default function LeftPanel({
  tab,
  files,
  activeFileId,
  onToggle,
  onOpen,
  onCreateFile,
  onCreateFolder,
  onRename,
  chatMessages,
  chatInput,
  setChatInput,
  onChatSend,
  onClearChat,
}) {
  const [creating, setCreating] = useState(null); // { parentId, type }
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

  return (
    <aside className="w-72 bg-[#0f1720] border-r border-[#111318] flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-[#0b1114]">
        <div className="flex items-center gap-2">
          <img
            src={codioLogo}
            alt="Codio"
            className="w-6 h-6 rounded-lg object-cover"
          />
          <div>
            <div className="text-sm font-medium text-gray-200">CODIO</div>
            <div className="text-xs text-gray-400">Workspace</div>
          </div>
        </div>

        {tab === "files" && (
          <div className="flex items-center gap-2">
            <button className="p-1 rounded hover:bg-[#0b1114] text-gray-300">
              <Search size={16} />
            </button>
            <button
              className="p-1 rounded hover:bg-[#0b1114] text-gray-300"
              title="New file"
              onClick={() => startCreate("root", "file")}
            >
              <FilePlus size={16} />
            </button>
            <button
              className="p-1 rounded hover:bg-[#0b1114] text-gray-300"
              title="New folder"
              onClick={() => startCreate("root", "folder")}
            >
              <FolderPlus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {tab === "files" && (
          <div className="p-2">
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
            />
          </div>
        )}

        {tab === "guide" && (
          <div className="p-3 text-sm text-gray-300">
            <div className="font-medium mb-2">Guide</div>
            <div className="text-gray-400">
              Quick tips and documentation live here. Use this space to show your project's README, helpful links, or onboarding steps.
            </div>
          </div>
        )}

        {tab === "help" && (
          <div className="p-3 text-sm text-gray-300">
            <div className="font-medium mb-2">Help</div>
            <div className="text-gray-400">
              Search docs or open a support ticket. Add FAQs or shortcuts here.
            </div>
          </div>
        )}

        {tab === "chat" && (
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#0b1114] bg-[#071018]">
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
                  onClick={onClearChat}
                >
                  Clear
                </button>
                <button title="Settings" className="p-1 rounded hover:bg-[#020617]"><Settings size={14} /></button>
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
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t border-[#0b1114] bg-[#071014] text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400" />
          <div>index.js updated 2m ago</div>
        </div>
      </div>
    </aside>
  );
}
