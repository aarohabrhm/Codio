import { useState, useCallback } from "react";
import axios from "axios"; // or replace with your fetch wrapper

const BASE = "/api/projects"; // adjust if your API base differs

/**
 * useCheckpoints
 * Manages checkpoint state and exposes handlers that your EditorPage
 * can pass straight down to LeftPanel.
 *
 * Usage:
 *   const cp = useCheckpoints(projectId, setFiles);
 *   <LeftPanel
 *     checkpoints={cp.checkpoints}
 *     selectedCheckpointId={cp.selectedId}
 *     onSelectCheckpoint={cp.select}
 *     onCommitCheckpoint={cp.commit}
 *     onRevertCheckpoint={cp.revert}
 *     onDeleteCheckpoint={cp.remove}
 *     ...
 *   />
 */
export function useCheckpoints(projectId, setFiles) {
  const [checkpoints, setCheckpoints]   = useState([]);
  const [selectedId, setSelectedId]     = useState(null);
  const [loading, setLoading]           = useState(false);

  /* ── load list (call on mount) ─────────────────────────────── */
  const load = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data } = await axios.get(`${BASE}/${projectId}/checkpoints`);
      setCheckpoints(data);
    } catch (err) {
      console.error("Failed to load checkpoints:", err);
    }
  }, [projectId]);

  /* ── commit ─────────────────────────────────────────────────── */
  const commit = useCallback(async (message, description = "") => {
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE}/${projectId}/checkpoints`, { message, description });
      setCheckpoints((prev) => [data, ...prev]); // prepend — newest first
      setSelectedId(data._id);
    } catch (err) {
      console.error("Commit failed:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  /* ── revert ─────────────────────────────────────────────────── */
  const revert = useCallback(async (cpId) => {
    if (!window.confirm("Revert all files to this checkpoint?")) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE}/${projectId}/checkpoints/${cpId}/revert`);
      setFiles?.(data.files); // update the editor's file tree
      setSelectedId(cpId);
    } catch (err) {
      console.error("Revert failed:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, setFiles]);

  /* ── delete ─────────────────────────────────────────────────── */
  const remove = useCallback(async (cpId) => {
    if (!window.confirm("Delete this checkpoint? This cannot be undone.")) return;
    try {
      await axios.delete(`${BASE}/${projectId}/checkpoints/${cpId}`);
      setCheckpoints((prev) => prev.filter((c) => c._id !== cpId));
      if (selectedId === cpId) setSelectedId(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }, [projectId, selectedId]);

  /* ── select (UI only, no network) ──────────────────────────── */
  const select = useCallback((cpId) => {
    setSelectedId((prev) => (prev === cpId ? null : cpId));
  }, []);

  return { checkpoints, selectedId, loading, load, commit, revert, remove, select };
}