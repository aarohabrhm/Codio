import { Trash2 } from 'lucide-react';

export default function DeleteProjectModal({ isOpen, onClose, onConfirm, isDeleting, projectTitle }) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden bg-surface-panel border border-line`}>
        <div className="p-6">
          {/* Icon & Title */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center">
              <Trash2 size={24} className="text-danger" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold text-primary`}>Delete Project</h3>
              <p className={`text-sm text-muted`}>This action cannot be undone</p>
            </div>
          </div>
          
          <p className={`mb-2 text-dim`}>
            Are you sure you want to delete <span className={`font-medium text-primary`}>"{projectTitle}"</span>?
          </p>
          <p className={`text-sm mb-6 text-muted`}>
            All project files, settings, and collaboration data will be permanently removed.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className={`px-5 py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-surface-raised text-dim hover:bg-surface-hover hover:text-primary`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-danger text-accent-on hover:brightness-110 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-line-strong border-t-white rounded-full animate-spin" />
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
