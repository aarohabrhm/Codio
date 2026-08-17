import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Search, GitBranch, BookOpen, User, Settings, LayoutDashboard } from "lucide-react";
import codioLogo from "../../assets/logo.png";

/**
 * Universal sidebar component for all pages
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab (files, search, sourceControl, guide) - only used on editor page
 * @param {function} props.onTabChange - Callback when tab changes - only used on editor page
 */
export default function Sidebar({ activeTab, onTabChange, isPanelVisible = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPath = location.pathname;
  const isEditorPage = currentPath.startsWith("/editor") || currentPath === "/";
  const isAccountPage = currentPath === "/account";
  const isSettingsPage = currentPath === "/settings";

  const iconButtonClass = (isActive) =>
    `w-10 h-10 rounded-lg flex items-center justify-center transition ${
      isActive
        ? "text-primary bg-surface-raised"
        : "text-muted hover:text-primary hover:bg-surface-hover"
    }`;

  const handleEditorTabClick = (tab) => {
    if (isEditorPage && onTabChange) {
      onTabChange(tab);
    } else {
      navigate("/editor");
    }
  };

  return (
    <div className={`w-14 flex flex-col items-center py-3 border-r bg-surface-page border-line`}>
      {/* Logo */}
      <div className="w-10 h-10 mb-2 rounded-lg bg-gradient-to-br from-surface-raised to-surface-panel border border-line flex items-center justify-center">
                      <img src={codioLogo} alt="Codio" className="w-6 h-6 object-contain dark:invert" />
                    </div>

      {/* Top Navigation icons */}
      <div className="flex flex-col items-center gap-1 px-2">
        <button
          title="Explorer"
          className={iconButtonClass(isEditorPage && isPanelVisible && activeTab === "files")}
          onClick={() => handleEditorTabClick("files")}
        >
          <FileText size={20} />
        </button>
        <button
          title="Search"
          className={iconButtonClass(isEditorPage && isPanelVisible && activeTab === "search")}
          onClick={() => handleEditorTabClick("search")}
        >
          <Search size={20} />
        </button>
        <button
          title="Source Control"
          className={iconButtonClass(isEditorPage && isPanelVisible && activeTab === "sourceControl")}
          onClick={() => handleEditorTabClick("sourceControl")}
        >
          <GitBranch size={20} />
        </button>
        <button
          title="Guide"
          className={iconButtonClass(isEditorPage && isPanelVisible && activeTab === "guide")}
          onClick={() => handleEditorTabClick("guide")}
        >
          <BookOpen size={20} />
        </button>
      </div>

      <div className="flex-1" />

      {/* Bottom icons */}
      <div className="flex flex-col items-center gap-1 px-2 pb-3">
        <button
          title="Dashboard"
          className={iconButtonClass(false)}
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard size={20} />
        </button>
        <button
          title="Account"
          className={iconButtonClass(isAccountPage)}
          onClick={() => navigate("/account")}
        >
          <User size={20} />
        </button>
        <button
          title="Settings"
          className={iconButtonClass(isSettingsPage)}
          onClick={() => navigate("/settings")}
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
}
