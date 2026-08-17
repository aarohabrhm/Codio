import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collaboratorEmails, setCollaboratorEmails] = useState('');
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTitle('');
      setDescription('');
      setCollaboratorEmails('');
      setError(null);
    }
  }, [isOpen]);

  const submit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('No access token');
      
      const body = {
        title,
        description,
        collaboratorEmails: collaboratorEmails.split(',').map(s => s.trim()).filter(Boolean),
      };
      
      const res = await axios.post('http://localhost:8000/api/projects', body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      onProjectCreated?.(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden bg-surface-panel border border-line`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b border-line`}>
          <h3 className={`text-lg font-semibold text-primary`}>Create New Project</h3>
          <p className={`text-sm mt-1 text-muted`}>Set up a new project and invite collaborators</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 text-dim`}>Project Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-accent/50 bg-surface-raised border-line-strong text-primary placeholder:text-muted`}
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 text-dim`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition resize-none focus:outline-none focus:border-accent/50 bg-surface-raised border-line-strong text-primary placeholder:text-muted`}
              placeholder="Brief description of your project..."
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 text-dim`}>
              Collaborators
              <span className={`font-normal ml-1 text-muted`}>(optional)</span>
            </label>
            <input
              value={collaboratorEmails}
              onChange={(e) => setCollaboratorEmails(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              className={`w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-accent/50 bg-surface-raised border-line-strong text-primary placeholder:text-muted`}
            />
            <p className={`text-xs mt-2 text-muted`}>Separate multiple emails with commas</p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-danger/10 border border-danger/20 rounded-xl">
              <p className="text-sm text-danger">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className={`px-5 py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-50 bg-surface-raised text-dim hover:bg-surface-hover hover:text-primary`}
            >
              Cancel
            </button>
            <button
              disabled={creating}
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-accent text-accent-on hover:brightness-110 transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-line-strong border-t-white rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
