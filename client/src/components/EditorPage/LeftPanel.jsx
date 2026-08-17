import { useState } from "react";
import Explorer from "../EditorPage/explorer/Explorer";
import {
  FilePlus, FolderPlus, MoreHorizontal, GitBranch,
  RefreshCw, Check, Plus, Trash2, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";

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
  currentHeadId,          // NEW PROP
  onSelectCheckpoint,
  onCommitCheckpoint,
  onRevertCheckpoint,
  onDeleteCheckpoint,
}) {
  const [creating, setCreating] = useState(null);
  const [renamingId, setRenamingId] = useState(null);

  /* commit form */
  const [commitMessage, setCommitMessage] = useState("");
  const [commitDescription, setCommitDescription] = useState("");
  const [commitFormOpen, setCommitFormOpen] = useState(false);

  /* expanded detail panel for a checkpoint */
  const [expandedCpId, setExpandedCpId] = useState(null);


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
    `p-1 rounded transition-colors hover:bg-surface-raised text-dim hover:text-primary ${extra}`;

  const actionBtn = (extra = "") =>
    `w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors bg-surface-raised hover:bg-surface-hover text-dim ${extra}`;

  const input = (extra = "") =>
    `w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-accent transition-colors bg-surface-raised border-line-strong text-primary placeholder:text-muted ${extra}`;

  return (
    <aside className={`w-64 border-r flex flex-col bg-surface-panel border-line`}>

      {/* ── Header ─────────────────────────────────────── */}
      <div className={`flex items-center justify-between px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted`}>
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
            <div className={`mt-4 text-xs text-center text-muted`}>
              {searchQuery ? "Searching..." : "Type to search in files"}
            </div>
          </div>
        )}

        {/* SOURCE CONTROL TAB */}
        {tab === "sourceControl" && (
          <div className="p-3 space-y-4">

            {/* Branch row */}
            <div className="flex items-center gap-2">
              <GitBranch size={16} className={"text-dim"} />
              <span className={`text-sm text-dim`}>main</span>
              <button className={`ml-auto p-1 rounded hover:bg-surface-raised text-dim`}>
                <RefreshCw size={14} />
              </button>
            </div>

            {/* Changed files */}
            <div>
              <div className={`font-mono text-[10px] font-medium uppercase tracking-[0.08em] mb-2 text-muted`}>Changes</div>
              {modifiedFiles.length > 0 ? (
                modifiedFiles.map((fileId) => (
                  <div key={fileId} className={`flex items-center gap-2 px-2 py-1 text-sm rounded text-dim hover:bg-surface-raised`}>
                    <span className="w-4 h-4 rounded-full bg-danger/20 text-danger text-[10px] flex items-center justify-center">M</span>
                    <span className="truncate">{files[fileId]?.name}</span>
                  </div>
                ))
              ) : (
                <div className={`text-xs text-center py-2 text-muted`}>No changes detected</div>
              )}
            </div>

            {/* ── Commit form (collapsible) ─────────────── */}
            <div className={`rounded-lg border border-line-strong`}>
              <button
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg text-dim hover:bg-surface-raised`}
                onClick={() => setCommitFormOpen((p) => !p)}
              >
                <span className="flex items-center gap-2"><Check size={13} /> New Checkpoint</span>
                {commitFormOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              </button>

              {commitFormOpen && (
                <div className={`px-3 pb-3 space-y-2 border-t border-line-strong`}>
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
                        ? "bg-accent hover:bg-accent text-accent-on"
                        : "bg-surface-raised text-muted cursor-not-allowed"
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
              <div className={`font-mono text-[10px] font-medium uppercase tracking-[0.08em] mb-2 text-muted`}>
                Checkpoints {checkpoints.length > 0 && <span className="normal-case">({checkpoints.length})</span>}
              </div>

              {checkpoints.length === 0 ? (
                <div className={`text-xs text-center py-3 text-muted`}>No checkpoints yet</div>
              ) : (
                <div className="relative ml-2">
                  {/* Vertical timeline line */}
                  {checkpoints.length > 1 && (
                    <span
                      className={`absolute left-[4px] top-[12px] w-px bg-surface-hover`}
                      style={{ bottom: 12 }}
                    />
                  )}

                  {checkpoints.map((cp, index) => {
                    const cpId        = cp._id ?? cp.id;
                    const isSelected  = selectedCheckpointId === cpId;
                    
                    // FIX: Check currentHeadId to dynamically move the "Green Dot" HEAD
                    const isLatest    = currentHeadId ? cpId === currentHeadId : index === 0;
                    
                    const isExpanded  = expandedCpId === cpId;
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
                              ? "bg-accent/10"
                              : "hover:bg-surface-raised"
                          }`}
                        >
                          {/* Node circle */}
                          <span
                            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full shrink-0 ${
                              isLatest
                                ? `w-[9px] h-[9px] bg-ok shadow-[0_0_0_3px_color-mix(in_srgb,var(--ok)_35%,transparent)]`
                                : `w-[9px] h-[9px] border-2 ${
                                    isSelected
                                      ? "bg-accent border-accent"
                                      : "bg-surface-panel border-line-strong"
                                  }`
                            }`}
                          />

                          <div className="flex-1 min-w-0">
                            <div className={`truncate text-xs font-medium text-primary`}>
                              {cp.message}
                              {isLatest && (
                                <span className={`ml-1.5 text-[9px] px-1 py-0.5 rounded bg-ok/15 text-ok`}>
                                  HEAD
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] mt-0.5 text-muted`}>
                              {dateLabel} · {timeLabel}
                              {cp.createdBy?.username && ` · ${cp.createdBy.username}`}
                            </div>
                          </div>

                          {/* Expand caret */}
                          <span className="text-muted shrink-0 mt-0.5">
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </span>
                        </button>

                        {/* Expanded detail panel */}
                        {isExpanded && (
                          <div className={`ml-5 mr-1 mb-2 rounded-lg p-2 text-xs space-y-2 bg-surface-panel border border-line-strong`}>

                            {/* Description */}
                            {cp.description ? (
                              <p className={`leading-relaxed text-dim`}>{cp.description}</p>
                            ) : (
                              <p className={"text-muted italic"}>No description</p>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-2 pt-1">
                              <button
                                className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-[11px] transition-colors bg-accent/10 hover:bg-accent/20 text-accent-fg`}
                                onClick={(e) => { e.stopPropagation(); onRevertCheckpoint?.(cpId); }}
                                title="Restore this checkpoint"
                              >
                                <RotateCcw size={11} /> Revert
                              </button>
                              <button
                                className={`flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] transition-colors bg-danger/10 hover:bg-danger/20 text-danger`}
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
          <div className={`p-4 text-sm space-y-3 text-dim`}>
            <div className={`font-medium text-primary`}>Getting Started</div>
            <p className={`leading-relaxed text-xs text-muted`}>
              Welcome to Codio! Here are some quick tips:
            </p>
            <ul className={`space-y-2 text-xs text-dim`}>
              {[
                "Use the Explorer to navigate your project files",
                "Press Ctrl+S to save your changes",
                "Open the chat panel to get AI assistance",
                "Use Source Control to commit and manage checkpoints",
              ].map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <span className="text-accent-fg">•</span>
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