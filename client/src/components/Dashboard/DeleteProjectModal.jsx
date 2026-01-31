import { Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DeleteProjectModal({ isOpen, onClose, onConfirm, isDeleting, projectTitle }) {
  const { isDark } = useTheme();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden ${
        isDark 
          ? 'bg-[#0f0f0f] border border-[#1a1a1a]' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Delete Project</h3>
              <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>This action cannot be undone</p>
            </div>
          </div>
          
          <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Are you sure you want to delete <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>"{projectTitle}"</span>?
          </p>
          <p className={`text-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            All project files, settings, and collaboration data will be permanently removed.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className={`px-5 py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark 
                  ? 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Delete Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
