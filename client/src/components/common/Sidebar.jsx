import { useNavigate, useLocation } from "react-router-dom";
import { FileText, Search, GitBranch, BookOpen, User, Settings, LayoutDashboard } from "lucide-react";
import codioLogo from "../../assets/logo.png";
import { useTheme } from "../../context/ThemeContext";

/**
 * Universal sidebar component for all pages
 * @param {Object} props
 * @param {string} props.activeTab - Currently active tab (files, search, sourceControl, guide) - only used on editor page
 * @param {function} props.onTabChange - Callback when tab changes - only used on editor page
 */
export default function Sidebar({ activeTab, onTabChange, isPanelVisible = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  
  const currentPath = location.pathname;
  const isEditorPage = currentPath.startsWith("/editor") || currentPath === "/";
  const isAccountPage = currentPath === "/account";
  const isSettingsPage = currentPath === "/settings";

  const iconButtonClass = (isActive) =>
    `w-10 h-10 rounded-lg flex items-center justify-center transition ${
      isActive
        ? isDark ? "text-white bg-[#1a1a1a]" : "text-gray-900 bg-gray-200"
        : isDark ? "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
    }`;

  const handleEditorTabClick = (tab) => {
    if (isEditorPage && onTabChange) {
      onTabChange(tab);
    } else {
      navigate("/editor");
    }
  };

  return (
    <div className={`w-14 flex flex-col items-center py-3 border-r ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'}`}>
      {/* Logo */}
      <div className="w-10 h-10 mb-2 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center">
                      <img src={codioLogo} alt="Codio" className="w-6 h-6" />
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
