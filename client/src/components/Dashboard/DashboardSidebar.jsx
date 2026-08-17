import { Link, useNavigate } from 'react-router-dom';
import {
  Home, LayoutGrid, Folder, Settings, HelpCircle,
  Palette, FolderGit2, Star, Clock, Users, Archive, ExternalLink
} from 'lucide-react';
import codioLogo from '../../assets/logo.png';

const cn = (...args) => args.filter(Boolean).join(' ');

export default function DashboardSidebar({ projects, currentTab, currentView, onViewChange }) {
  const navigate = useNavigate();

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
            ? 'bg-surface-raised text-primary'
            : 'hover:bg-surface-hover text-dim hover:text-primary'
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon size={16} className={active ? 'text-accent-fg' : 'text-muted'} />}
          {!Icon && <span className="w-4" />}
          <span>{label}</span>
        </div>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          active 
            ? "bg-surface-hover text-dim"
            : "bg-surface-raised text-muted"
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
          ? "bg-surface-raised text-primary"
          : "hover:bg-surface-hover text-dim hover:text-primary"
      )}
    >
      <Icon size={18} className={isActive ? "text-accent-fg" : "text-muted"} />
      <span>{label}</span>
    </Link>
  );

  const handleViewChange = (view) => {
    onViewChange?.(view);
  };

  return (
    <aside className={`w-64 border-r flex flex-col h-full bg-surface-page border-line`}>
      {/* Logo Header */}
      <div className={`px-4 py-4 border-b h-20 flex items-center border-line`}>
        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-surface-raised to-surface-panel border border-line flex items-center justify-center">
            <img src={codioLogo} alt="Codio" className="w-6 h-6 object-contain dark:invert" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-[19px] leading-none tracking-[-0.02em] text-primary [font-optical-sizing:auto]">Codio</span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">Collaborative IDE</span>
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
                ? "bg-surface-raised text-primary"
                : "hover:bg-surface-hover text-dim hover:text-primary"
            )}
          >
            <Home size={18} className={currentView === 'dashboard' ? "text-accent-fg" : "text-muted"} />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => handleViewChange('projects')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-sm text-left",
              currentView === 'projects'
                ? "bg-surface-raised text-primary"
                : "hover:bg-surface-hover text-dim hover:text-primary"
            )}
          >
            <LayoutGrid size={18} className={currentView === 'projects' ? "text-accent-fg" : "text-muted"} />
            <span>My Projects</span>
          </button>
        </nav>

        {/* Folders Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-3 mb-3">
            <Folder size={14} className="text-muted" />
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Folders</span>
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
        
      </div>

      {/* Bottom Navigation */}
      <div className={`px-3 py-4 border-t border-line`}>
        <nav className="space-y-0.5">
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
