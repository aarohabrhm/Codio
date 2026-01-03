import { useEffect, useRef, useState } from "react";
import FileIcon from "./FileIcon";
import { ChevronDown, ChevronRight, FilePlus, FolderPlus, Trash2 } from "lucide-react";

export default function ExplorerItem({
  node,
  depth,
  active,
  onToggle,
  onOpen,
  isRenaming = false,
  isCreating = false,
  onStartRename,
  onStartCreate,
  onCommitRename,
  onCancelRename,
  onCommitCreate,
  onCancelCreate,
  isModified = false,
  onDelete,
}) {
  const [value, setValue] = useState(node.name || "");
  const inputRef = useRef(null);
  const committedRef = useRef(false);

  useEffect(() => {
    if (isRenaming || isCreating) {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [isRenaming, isCreating]);

  const commit = () => {
    const name = value.trim();
    if (!name) {
      if (isCreating) {
        onCancelCreate?.();
      } else {
        onCancelRename?.();
      }
      return;
    }
    committedRef.current = true;
    if (isCreating) {
      onCommitCreate?.(name);
    } else {
      onCommitRename?.(node.id, name);
    }
  };

  const cancel = () => {
    if (isCreating) {
      onCancelCreate?.();
    } else {
      onCancelRename?.();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancel();
    }
  };

  if (isRenaming || isCreating) {
    return (
      <div
        style={{ paddingLeft: depth * 15 }}
        className="flex items-center gap-2 px-2 py-1 bg-[#111316]"
      >
        {node.type === "folder" && <ChevronRight size={14} />}
        <FileIcon name={node.name || value} type={node.type} />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!committedRef.current) {
              commit();
            }
          }}
          className="flex-1 bg-transparent border border-[#1f2937] rounded px-1 py-0.5 text-xs text-gray-100 outline-none"
        />
      </div>
    );
  }

  return (
    <div
      style={{ paddingLeft: depth * 15 }}
      onClick={() =>
        node.type === "folder" ? onToggle(node.id) : onOpen(node.id)
      }
      onDoubleClick={() => onStartRename?.(node.id)}
      className={`group flex items-center justify-between px-2 py-1 cursor-pointer ${
        active ? "bg-[#1a1a1a]" : "hover:bg-[#151515]"
      }`}
    >
      <div className="flex items-center gap-2">
        {node.type === "folder" &&
          (node.isOpen ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />)}
        <FileIcon name={node.name} type={node.type} isOpen={node.isOpen} />
        <span className="text-xs truncate max-w-[140px] text-gray-300">{node.name}</span>
        {isModified && (
          <span className="w-1 h-1 rounded-full bg-yellow-400 ml-1"></span>
        )}
      </div>
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {node.type === "folder" && (
          <>
            <button
              title="New file"
              className="p-1 rounded hover:bg-[#2a2a2a] text-gray-400"
              onClick={() => {
                if (!node.isOpen) {
                  onToggle?.(node.id);
                }
                onStartCreate?.(node.id, "file");
              }}
            >
              <FilePlus size={12} />
            </button>
            <button
              title="New folder"
              className="p-1 rounded hover:bg-[#2a2a2a] text-gray-400"
              onClick={() => {
                if (!node.isOpen) {
                  onToggle?.(node.id);
                }
                onStartCreate?.(node.id, "folder");
              }}
            >
              <FolderPlus size={12} />
            </button>
          </>
        )}
        <button
          title="Delete"
          className="p-1 rounded hover:bg-[#2a2a2a] text-gray-400 hover:text-red-400"
          onClick={() => onDelete?.(node.id)}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
