import { useState } from "react";
import Explorer from "../EditorPage/explorer/Explorer";
import {
  FilePlus, FolderPlus, MoreHorizontal, GitBranch,
  RefreshCw, Check, Plus, Trash2, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";
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
  checkpoints = [],
  selectedCheckpointId,
  onSelectCheckpoint,
  onCommitCheckpoint,   // fn(message, description) → void
  onRevertCheckpoint,   // fn(cpId) → void
  onDeleteCheckpoint,   // fn(cpId) → void
}) {
  const [creating, setCreating] = useState(null);
  const [renamingId, setRenamingId] = useState(null);

  /* commit form */
  const [commitMessage, setCommitMessage] = useState("");
  const [commitDescription, setCommitDescription] = useState("");
  const [commitFormOpen, setCommitFormOpen] = useState(false);

  /* expanded detail panel for a checkpoint */
  const [expandedCpId, setExpandedCpId] = useState(null);

  const { isDark } = useTheme();

  /* ── file explorer helpers ──────────────────────────── */
  const startCreate = (parentId, type) => { setCreating({ parentId, type }); setRenamingId(null); };
  const handleCommitCreate = (parentId, type, name) => {
    const t = name.trim(); if (!t) { setCreating(null); return; }
    type === "folder" ? onCreateFolder?.(parentId, t) : onCreateFile?.(parentId, t);
    setCreating(null);
  };
  const handleCancelCreate  = () => setCreating(null);
  const handleCommitRename  = (id, name) => { const t = name.trim(); if (!t) { setRenamingId(null); return; } onRename?.(id, t); setRenamingId(null); };
  const handleCancelRename  = () => setRenamingId(null);

  /* ── commit submit ──────────────────────────────────── */
  const handleCommitSubmit = () => {
    const msg = commitMessage.trim();
    if (!msg) return;
    onCommitCheckpoint?.(msg, commitDescription.trim());
    setCommitMessage("");
    setCommitDescription("");
    setCommitFormOpen(false);
  };

  /* ── shared className helpers ───────────────────────── */
  const btn = (extra = "") =>
    `p-1 rounded transition-colors ${isDark ? "hover:bg-[#1a1a1a] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-500 hover:text-gray-700"} ${extra}`;

  const actionBtn = (extra = "") =>
    `w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
      isDark ? "bg-[#1a1a1a] hover:bg-[#2a2a2a] text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    } ${extra}`;

  const input = (extra = "") =>
    `w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 transition-colors ${
      isDark ? "bg-[#1a1a1a] border-[#2a2a2a] text-gray-100 placeholder:text-gray-600" : "bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
    } ${extra}`;

  return (
    <aside className={`w-64 border-r flex flex-col ${isDark ? "bg-[#0f0f0f] border-[#1a1a1a]" : "bg-white border-gray-200"}`}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className={`flex items-center justify-between px-4 py-3 text-xs uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        <span>
          {tab === "files" ? "Explorer" : tab === "search" ? "Search" : tab === "sourceControl" ? "Source Control" : "Guide"}
        </span>
        <div className="flex items-center gap-1">
          {tab === "files" && (
            <>
              <button className={btn()} title="New file"   onClick={() => startCreate("root", "file")}>   <FilePlus size={14} />   </button>
              <button className={btn()} title="New folder" onClick={() => startCreate("root", "folder")}> <FolderPlus size={14} /> </button>
            </>
          )}
          <button className={btn()}><MoreHorizontal size={14} /></button>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">

        {/* FILES TAB */}
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

        {/* SEARCH TAB */}
        {tab === "search" && (
          <div className="p-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery?.(e.target.value)}
              placeholder="Search"
              className={input()}
            />
            <div className={`mt-4 text-xs text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              {searchQuery ? "Searching..." : "Type to search in files"}
            </div>
          </div>
        )}

        {/* SOURCE CONTROL TAB */}
        {tab === "sourceControl" && (
          <div className="p-3 space-y-4">

            {/* Branch row */}
            <div className="flex items-center gap-2">
              <GitBranch size={16} className={isDark ? "text-gray-400" : "text-gray-500"} />
              <span className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>main</span>
              <button className={`ml-auto p-1 rounded ${isDark ? "hover:bg-[#1a1a1a] text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}>
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Changed files */}
            <div>
              <div className={`text-xs uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>Changes</div>
              {modifiedFiles.length > 0 ? (
                modifiedFiles.map((fileId) => (
                  <div key={fileId} className={`flex items-center gap-2 px-2 py-1 text-sm rounded ${isDark ? "text-gray-300 hover:bg-[#1a1a1a]" : "text-gray-700 hover:bg-gray-100"}`}>
                    <span className="w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] flex items-center justify-center">M</span>
                    <span className="truncate">{files[fileId]?.name}</span>
                  </div>
                ))
              ) : (
                <div className={`text-xs text-center py-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>No changes detected</div>
              )}
            </div>

            {/* ── Commit form (collapsible) ─────────────── */}
            <div className={`rounded-lg border ${isDark ? "border-[#2a2a2a]" : "border-gray-200"}`}>
              <button
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg ${isDark ? "text-gray-300 hover:bg-[#1a1a1a]" : "text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setCommitFormOpen((p) => !p)}
              >
                <span className="flex items-center gap-2"><Check size={13} /> New Checkpoint</span>
                {commitFormOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {commitFormOpen && (
                <div className={`px-3 pb-3 space-y-2 border-t ${isDark ? "border-[#2a2a2a]" : "border-gray-200"}`}>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    placeholder="Commit title *"
                    className={input("mt-2")}
                  />
                  <textarea
                    value={commitDescription}
                    onChange={(e) => setCommitDescription(e.target.value)}
                    placeholder="Description (optional)"
                    rows={3}
                    className={input("resize-none")}
                  />
                  <button
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      commitMessage.trim()
                        ? "bg-cyan-600 hover:bg-cyan-500 text-white"
                        : isDark ? "bg-[#1a1a1a] text-gray-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleCommitSubmit}
                    disabled={!commitMessage.trim()}
                  >
                    <Check size={13} /> Commit Checkpoint
                  </button>
                </div>
              )}
            </div>

            {/* ── Checkpoint graph ─────────────────────── */}
            <div>
              <div className={`text-xs uppercase tracking-wider mb-2 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                Checkpoints {checkpoints.length > 0 && <span className="normal-case">({checkpoints.length})</span>}
              </div>

              {checkpoints.length === 0 ? (
                <div className={`text-xs text-center py-3 ${isDark ? "text-gray-500" : "text-gray-500"}`}>No checkpoints yet</div>
              ) : (
                <div className="relative ml-2">
                  {/* Vertical timeline line */}
                  {checkpoints.length > 1 && (
                    <span
                      className={`absolute left-[4px] top-[12px] w-px ${isDark ? "bg-[#2a2a2a]" : "bg-gray-300"}`}
                      style={{ bottom: 12 }}
                    />
                  )}

                  {checkpoints.map((cp, index) => {
                    const isSelected  = selectedCheckpointId === (cp._id ?? cp.id);
                    const isLatest    = index === 0;
                    const isExpanded  = expandedCpId === (cp._id ?? cp.id);
                    const cpId        = cp._id ?? cp.id;
                    const timeLabel   = new Date(cp.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                    const dateLabel   = new Date(cp.createdAt).toLocaleDateString([], { month: "short", day: "numeric" });

                    return (
                      <div key={cpId} className="relative mb-1">
                        {/* Main row — click to select */}
                        <button
                          type="button"
                          onClick={() => { onSelectCheckpoint?.(cpId); setExpandedCpId(isExpanded ? null : cpId); }}
                          className={`relative w-full flex items-start gap-3 text-left pl-5 pr-2 py-2 rounded-lg transition-colors ${
                            isSelected
                              ? isDark ? "bg-[#1a2a2a]" : "bg-cyan-50"
                              : isDark ? "hover:bg-[#1a1a1a]" : "hover:bg-gray-50"
                          }`}
                        >
                          {/* Node circle */}
                          <span
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shrink-0 ${
                              isLatest
                                ? `w-[9px] h-[9px] ${isDark ? "bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.25)]" : "bg-emerald-500 shadow-[0_0_0_3px_rgba(16,185,129,0.25)]"}`
                                : `w-[9px] h-[9px] border-2 ${
                                    isSelected
                                      ? isDark ? "bg-cyan-400 border-cyan-400" : "bg-cyan-500 border-cyan-500"
                                      : isDark ? "bg-[#0f0f0f] border-[#444]" : "bg-white border-gray-400"
                                  }`
                            }`}
                          />

                          <div className="flex-1 min-w-0">
                            <div className={`truncate text-xs font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                              {cp.message}
                              {isLatest && (
                                <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded ${isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-700"}`}>
                                  HEAD
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] mt-0.5 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                              {dateLabel} · {timeLabel}
                              {cp.createdBy?.username && ` · ${cp.createdBy.username}`}
                            </div>
                          </div>

                          {/* Expand caret */}
                          <span className={`text-gray-500 shrink-0 mt-0.5 ${isDark ? "" : ""}`}>
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </span>
                        </button>

                        {/* Expanded detail panel */}
                        {isExpanded && (
                          <div className={`ml-5 mr-1 mb-2 rounded-lg p-2 text-xs space-y-2 ${isDark ? "bg-[#111] border border-[#2a2a2a]" : "bg-gray-50 border border-gray-200"}`}>

                            {/* Description */}
                            {cp.description ? (
                              <p className={`leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>{cp.description}</p>
                            ) : (
                              <p className={isDark ? "text-gray-600 italic" : "text-gray-400 italic"}>No description</p>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-2 pt-1">
                              <button
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] transition-colors ${
                                  isDark ? "bg-[#1a2a2a] hover:bg-[#1a3a3a] text-cyan-400" : "bg-cyan-50 hover:bg-cyan-100 text-cyan-700"
                                }`}
                                onClick={(e) => { e.stopPropagation(); onRevertCheckpoint?.(cpId); }}
                                title="Restore this checkpoint"
                              >
                                <RotateCcw size={11} /> Revert
                              </button>
                              <button
                                className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                                  isDark ? "bg-[#2a1a1a] hover:bg-[#3a1a1a] text-red-400" : "bg-red-50 hover:bg-red-100 text-red-600"
                                }`}
                                onClick={(e) => { e.stopPropagation(); onDeleteCheckpoint?.(cpId); }}
                                title="Delete this checkpoint"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* GUIDE TAB */}
        {tab === "guide" && (
          <div className={`p-4 text-sm space-y-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Getting Started</div>
            <p className={`leading-relaxed text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              Welcome to Codio! Here are some quick tips:
            </p>
            <ul className={`space-y-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {[
                "Use the Explorer to navigate your project files",
                "Press Ctrl+S to save your changes",
                "Open the chat panel to get AI assistance",
                "Use Source Control to commit and manage checkpoints",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-cyan-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}