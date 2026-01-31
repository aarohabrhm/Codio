import { Link, useNavigate } from 'react-router-dom';
import {
  Home, LayoutGrid, Folder, Settings, HelpCircle,
  Palette, FolderGit2, Star, Clock, Users, Archive, ExternalLink
} from 'lucide-react';
import codioLogo from '../../assets/logo.png';
import { useTheme } from '../../context/ThemeContext';

const cn = (...args) => args.filter(Boolean).join(' ');

export default function DashboardSidebar({ projects, currentTab, currentView, onViewChange }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const counts = {
    all: projects.length,
    recent: projects.filter((p) => p.createdAt > Date.now() - 1000 * 60 * 60 * 24 * 30).length,
    favorites: projects.filter((p) => p.favorite).length,
    shared: projects.filter((p) => p.shared).length,
    external: projects.filter((p) => p.external).length,
    archived: projects.filter((p) => p.archived).length,
  };

  const setTab = (tabValue) => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tabValue);
    navigate({ pathname: window.location.pathname, search: params.toString() });
  };

  const FolderNavItem = ({ label, tabValue, icon: Icon, count }) => {
    const active = currentTab === tabValue;
    return (
      <button
        onClick={() => setTab(tabValue)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition text-sm',
          active 
            ? isDark ? 'bg-[#1a1a1a] text-white' : 'bg-gray-200 text-gray-900'
            : isDark ? 'hover:bg-[#141414] text-gray-400 hover:text-gray-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className={active ? 'text-blue-400' : 'text-gray-500'} />}
          {!Icon && <span className="w-4" />}
          <span>{label}</span>
        </div>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          active 
            ? isDark ? "bg-[#2a2a2a] text-gray-300" : "bg-gray-300 text-gray-700"
            : isDark ? "bg-[#1a1a1a] text-gray-500" : "bg-gray-100 text-gray-500"
        )}>
          {count}
        </span>
      </button>
    );
  };

  const NavLink = ({ to, icon: Icon, label, isActive }) => (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm",
        isActive 
          ? isDark ? "bg-[#1a1a1a] text-white" : "bg-gray-200 text-gray-900"
          : isDark ? "hover:bg-[#141414] text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
      )}
    >
      <Icon size={18} className={isActive ? "text-blue-400" : "text-gray-500"} />
      <span>{label}</span>
    </Link>
  );

  const handleViewChange = (view) => {
    onViewChange?.(view);
  };

  return (
    <aside className={`w-64 border-r flex flex-col h-full ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'}`}>
      {/* Logo Header */}
      <div className={`px-4 py-4 border-b h-20 flex items-center ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 flex items-center justify-center">
            <img src={codioLogo} alt="Codio" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Codio</span>
            <span className={`text-[10px] -mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Collaborative IDE</span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <nav className="space-y-1 mb-6">
          <button
            onClick={() => handleViewChange('dashboard')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm text-left",
              currentView === 'dashboard'
                ? isDark ? "bg-[#1a1a1a] text-white" : "bg-gray-200 text-gray-900"
                : isDark ? "hover:bg-[#141414] text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            )}
          >
            <Home size={18} className={currentView === 'dashboard' ? "text-blue-400" : "text-gray-500"} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleViewChange('projects')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm text-left",
              currentView === 'projects'
                ? isDark ? "bg-[#1a1a1a] text-white" : "bg-gray-200 text-gray-900"
                : isDark ? "hover:bg-[#141414] text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            )}
          >
            <LayoutGrid size={18} className={currentView === 'projects' ? "text-blue-400" : "text-gray-500"} />
            <span>My Projects</span>
          </button>
        </nav>

        {/* Folders Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 mb-3">
            <Folder size={14} className="text-gray-500" />
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Folders</span>
          </div>

          <div className="space-y-0.5">
            <FolderNavItem label="All Projects" tabValue="all" icon={LayoutGrid} count={counts.all} />
            <FolderNavItem label="Recent" tabValue="recent" icon={Clock} count={counts.recent} />
            <FolderNavItem label="Favorites" tabValue="favorites" icon={Star} count={counts.favorites} />
            <FolderNavItem label="Shared with me" tabValue="shared" icon={Users} count={counts.shared} />
            <FolderNavItem label="External" tabValue="external" icon={ExternalLink} count={counts.external} />
            <FolderNavItem label="Archived" tabValue="archived" icon={Archive} count={counts.archived} />
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-3">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Tools</span>
          </div>

          <nav className="space-y-0.5">
            <NavLink to="/version-control" icon={FolderGit2} label="Version Control" />
            <NavLink to="/appearance" icon={Palette} label="Appearance" />
          </nav>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className={`px-3 py-4 border-t ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
        <nav className="space-y-0.5">
          <NavLink to="/support" icon={HelpCircle} label="Help & Support" />
          <NavLink to="/settings" icon={Settings} label="Settings" />
        </nav>
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </aside>
  );
}
