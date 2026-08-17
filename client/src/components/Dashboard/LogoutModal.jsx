import { LogOut } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  
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
              <LogOut size={24} className="text-danger" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold text-primary`}>Logout</h3>
              <p className={`text-sm text-muted`}>End your current session</p>
            </div>
          </div>
          
          <p className={`mb-6 leading-relaxed text-dim`}>
            Are you sure you want to logout? You'll need to sign in again to access your projects and continue collaborating.
          </p>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoggingOut}
              className={`px-5 py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-surface-raised text-dim hover:bg-surface-hover hover:text-primary`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoggingOut}
              className="px-5 py-2.5 rounded-xl bg-danger text-accent-on hover:brightness-110 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoggingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-line-strong border-t-white rounded-full animate-spin" />
                  <span>Logging out...</span>
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  <span>Logout</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
