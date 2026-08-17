import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Link as LinkIcon, Shield, Calendar, Trash2 } from 'lucide-react';

export default function ProjectCard({ project, activeMenuId, toggleMenu, onDelete }) {
  const isMenuOpen = activeMenuId === project?.id;
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    function handle(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) toggleMenu?.(null);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [toggleMenu]);

  const copyLink = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/editor/${project.id}`;
    try { 
      await navigator.clipboard.writeText(url); 
    } catch (err) {
      console.error('Failed to copy link', err);
    }
    toggleMenu?.(null);
  };

  const managePermission = (e) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}?modal=permissions`);
    toggleMenu?.(null);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    toggleMenu?.(null);
    onDelete?.(project.id);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-200 cursor-pointer bg-surface-panel border-line hover:border-line-strong`}
      onClick={() => navigate(`/editor/${project.id}`)}
    >
      {/* Project Image */}
      <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
        <img 
          src={project.img} 
          alt={project.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />

        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu?.(project.id);
          }}
          className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-black/60 rounded-lg text-accent-on backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* Dropdown Menu - Outside image container to avoid overflow clipping */}
      {isMenuOpen && (
        <div 
          ref={menuRef} 
          className={`absolute top-14 right-3 w-44 rounded-xl shadow-2xl z-50 bg-surface-panel border border-line-strong`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="py-1.5">
            <button 
              onClick={copyLink} 
              className={`flex items-center gap-3 w-full px-3 py-2 transition text-left text-sm text-dim hover:bg-surface-hover hover:text-primary`}
            >
              <LinkIcon size={15} className={"text-muted"} />
              Copy link
            </button>
            <button 
              onClick={managePermission} 
              className={`flex items-center gap-3 w-full px-3 py-2 transition text-left text-sm text-dim hover:bg-surface-hover hover:text-primary`}
            >
              <Shield size={15} className={"text-muted"} />
              Manage access
            </button>
            <div className={`border-t my-1.5 border-line-strong`} />
            <button 
              onClick={handleDelete} 
              className="flex items-center gap-3 w-full px-3 py-2 text-danger hover:bg-danger/10 hover:text-danger transition text-left text-sm"
            >
              <Trash2 size={15} />
              Delete project
            </button>
          </div>
        </div>
      )}

      {/* Project Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className={`font-medium truncate text-primary`}>{project.title}</h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Calendar size={12} className={"text-muted"} />
              <span className={`text-xs text-muted`}>{formatDate(project.createdAt)}</span>
              {project.meta && (
                <>
                  <span className={"text-muted"}>•</span>
                  <span className={`text-xs text-muted`}>{project.meta}</span>
                </>
              )}
            </div>
          </div>

          {/* User Avatars */}
          <div className="flex -space-x-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {Array.isArray(project.userAvatars) && project.userAvatars.length > 0 ? (
              project.userAvatars.slice(0, 3).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`User avatar ${i}`}
                  className={`w-7 h-7 rounded-full border-2 object-cover border-surface-panel`}
                  onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
                />
              ))
            ) : (
              project.users.slice(0, 3).map((u, i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/150?img=${10 + u}`}
                  alt="User"
                  className={`w-7 h-7 rounded-full border-2 border-surface-panel`}
                />
              ))
            )}

            {((Array.isArray(project.userAvatars) && project.userAvatars.length > 3)
              ? project.userAvatars.length - 3
              : (project.users.length > 3 ? project.users.length - 3 : 0)) > 0 && (
              <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-medium border-surface-panel bg-surface-hover text-dim`}>
                +{Array.isArray(project.userAvatars) && project.userAvatars.length > 3
                  ? project.userAvatars.length - 3
                  : project.users.length - 3}
              </div>
            )}
          </div>
        </div>

        {/* Tags/Badges */}
        <div className="flex items-center gap-2 mt-3">
          {project.favorite && (
            <span className="px-2 py-0.5 bg-accent/10 text-accent-fg text-[10px] rounded-full border border-accent/20">
              Favorite
            </span>
          )}
          {project.shared && (
            <span className="px-2 py-0.5 bg-accent/10 text-accent-fg text-[10px] rounded-full border border-accent/20">
              Shared
            </span>
          )}
          {project.archived && (
            <span className="px-2 py-0.5 bg-surface-hover text-dim text-[10px] rounded-full border border-line">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
