import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

export default function NewProjectModal({ isOpen, onClose, onProjectCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collaboratorEmails, setCollaboratorEmails] = useState('');
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const { isDark } = useTheme();

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden ${
        isDark 
          ? 'bg-[#0f0f0f] border border-[#1a1a1a]' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`px-6 py-4 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Create New Project</h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Set up a new project and invite collaborators</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-6 space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Project Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-blue-500/50 ${
                isDark 
                  ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border transition resize-none focus:outline-none focus:border-blue-500/50 ${
                isDark 
                  ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
              placeholder="Brief description of your project..."
              rows={3}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Collaborators
              <span className={`font-normal ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>(optional)</span>
            </label>
            <input
              value={collaboratorEmails}
              onChange={(e) => setCollaboratorEmails(e.target.value)}
              placeholder="alice@example.com, bob@example.com"
              className={`w-full px-4 py-3 rounded-xl border transition focus:outline-none focus:border-blue-500/50 ${
                isDark 
                  ? 'bg-[#1a1a1a] border-[#2a2a2a] text-white placeholder:text-gray-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400'
              }`}
            />
            <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Separate multiple emails with commas</p>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={creating}
              className={`px-5 py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-50 ${
                isDark 
                  ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              disabled={creating}
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
