import React, { useState, useRef, useEffect } from 'react';
import codioLogo from '../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Search, Home, LayoutGrid, Folder, Settings, HelpCircle,
  Plus, Palette, UserPlus, Building, MoreVertical,
  Link as LinkIcon, Share2, Shield, Bell, FolderGit2, LogOut,
} from 'lucide-react';

const SAMPLE_PROJECTS = []; // Empty default, will load from API

const cn = (...args) => args.filter(Boolean).join(' ');

// --- Sidebar Component ---
const Sidebar = ({ projects, currentTab }) => {
  const counts = {
    all: projects.length,
    recent: projects.filter((p) => p.createdAt > Date.now() - 1000 * 60 * 60 * 24 * 30).length,
    favorites: projects.filter((p) => p.favorite).length,
    shared: projects.filter((p) => p.shared).length,
    external: projects.filter((p) => p.external).length,
    archived: projects.filter((p) => p.archived).length,
  };

  const navigate = useNavigate();

  const setTab = (tabValue) => {
    const params = new URLSearchParams(window.location.search);
    if (tabValue === 'all') params.set('tab', 'all');
    else params.set('tab', tabValue);
    navigate({ pathname: window.location.pathname, search: params.toString() });
  };

  const FolderNavItem = ({ label, tabValue, icon, count }) => {
    const active = currentTab === tabValue;
    return (
      <button
        onClick={() => setTab(tabValue)}
        className={cn(
          'w-full flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition text-sm text-left',
          active ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900 text-neutral-400',
          'pl-9'
        )}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        <span className="bg-neutral-800 text-xs px-2 py-0.5 rounded-full text-neutral-500">{count}</span>
      </button>
    );
  };

  return (
    <aside className="w-72 flex flex-col border-r border-neutral-800 h-full p-4 bg-[#0F0F0F]">
      <div className="flex items-center justify-between px-2 py-2 mb-4 rounded-lg">
        <div className="flex items-center gap-3">
          <img src={codioLogo} alt="Codio" className="w-8 h-8 rounded-lg object-cover" />
          <div className="flex flex-col leading-tight">
            <h3 className="text-white text-2xl font-semibold">Codio</h3>
          </div>
        </div>
      </div>

      <nav className="space-y-1 mb-8">
        <Link to="/dashboard" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400">
          <Home size={18} /> <span>Home</span>
        </Link>
        <Link to="/projects" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400">
          <LayoutGrid size={18} /> <span>My projects</span>
        </Link>
      </nav>

      <div className="mb-4">
        <div className="flex items-center justify-between px-2 mb-2 group cursor-pointer">
          <div className="flex items-center gap-2 text-neutral-500 hover:text-white">
            <Folder size={16} />
            <span className="font-medium">Folders</span>
          </div>
        </div>

        <div className="space-y-1 mt-2">
          <FolderNavItem label="All" tabValue="all" icon={null} count={counts.all} />
          <FolderNavItem label="Recent" tabValue="recent" icon={null} count={counts.recent} />
          <FolderNavItem label="Favorites" tabValue="favorites" icon={null} count={counts.favorites} />
          <FolderNavItem label="Shared" tabValue="shared" icon={null} count={counts.shared} />
          <FolderNavItem label="External" tabValue="external" icon={null} count={counts.external} />
          <FolderNavItem label="Archived" tabValue="archived" icon={null} count={counts.archived} />
        </div>
      </div>

      <div className="mt-auto space-y-1">
        <Link to="/version-control" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400">
          <FolderGit2 size={18} /> <span>Version Control</span>
        </Link>
        <Link to="/appearance" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400">
          <Palette size={18} /> <span>Appearance</span>
        </Link>

        <div className="border-t border-neutral-800 my-4"></div>

        <Link to="/support" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400">
          <HelpCircle size={18} /> <span>Support</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-neutral-900 text-neutral-400">
          <Settings size={18} /> <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
};

// --- Header Component ---
const Header = ({ searchValue, setSearchValue, user, onLogoutClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchValue(q);
  }, [location.search, setSearchValue]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchValue) params.set('q', searchValue);
    else params.delete('q');
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <header className="flex items-center justify-between p-8 pb-4">
      <h1 className="text-2xl font-bold text-white">
        Welcome back, {user ? user.fullname.split(' ')[0] : 'Developer'}
      </h1>

      <div className="flex items-center gap-4">
        <form onSubmit={onSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search"
            className="bg-neutral-900 border border-neutral-800 text-sm rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-neutral-600 text-white"
          />
        </form>

        <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
          <Link to="/settings" title="Go to Settings">
            <img
              src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full border border-neutral-700 object-cover cursor-pointer hover:opacity-80 transition"
            />
          </Link>

          <span className="text-sm font-medium text-white">
            {user ? user.fullname : 'Loading...'}
          </span>
          <Bell size={18} className="cursor-pointer hover:text-white" />
          
          {/* Three Dots Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="cursor-pointer hover:text-white transition"
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <div className="absolute top-8 right-0 w-48 bg-[#1A1A1A] border border-neutral-700 rounded-lg shadow-2xl z-50 flex flex-col py-1 text-sm">
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <Link
                  to="/support"
                  className="flex items-center gap-3 px-4 py-2.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <HelpCircle size={16} />
                  <span>Help & Support</span>
                </Link>
                <div className="border-t border-neutral-800 my-1"></div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogoutClick();
                  }}
                  className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-neutral-800 hover:text-red-300 transition text-left w-full"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Helper Components ---
const QuickAction = ({ icon, label, onClick, to }) => {
  if (to) {
    return (
      <Link to={to} className="flex flex-col items-start gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition cursor-pointer">
        <div className="p-2 rounded-lg border border-neutral-700 bg-neutral-800/50 text-neutral-400">{icon}</div>
        <span className="text-sm font-medium text-white">{label}</span>
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="flex flex-col items-start gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition text-left cursor-pointer">
      <div className="p-2 rounded-lg border border-neutral-700 bg-neutral-800/50 text-neutral-400">{icon}</div>
      <span className="text-sm font-medium text-white">{label}</span>
    </button>
  );
};

const Tab = ({ label, value, active }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onClick = () => {
    const params = new URLSearchParams(location.search);
    params.set('tab', value);
    navigate({ pathname: location.pathname, search: params.toString() });
  };

  return (
    <button onClick={onClick} className={cn('pb-2 relative transition', active ? 'text-white font-medium' : 'text-neutral-500 hover:text-neutral-300')}>
      {label}
      {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-600 rounded-t-full"></div>}
    </button>
  );
};

// --- ProjectCard Component ---
const ProjectCard = ({ project, activeMenuId, toggleMenu }) => {
  const isMenuOpen = activeMenuId === project?.id;
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    function handle(e) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) toggleMenu && toggleMenu(null);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [toggleMenu]);

  const copyLink = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects/${project.id}`;
    try { await navigator.clipboard.writeText(url); } catch (err) {}
  };

  const shareProject = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects/${project.id}`;
    if (navigator.share) {
      try { await navigator.share({ title: project.title, url }); } catch (err) {}
    } else {
      try { await navigator.clipboard.writeText(url); } catch (err) {}
    }
  };

  const managePermission = (e) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}?modal=permissions`);
  };

  return (
    <div
      className="group relative bg-[#161616] rounded-xl p-3 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
      onClick={() => navigate(`/editor/${project.id}`)}
    >
      <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
        <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMenu && toggleMenu(project.id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-md text-white backdrop-blur-sm transition"
        >
          <MoreVertical size={16} />
        </button>

        {isMenuOpen && (
          <div ref={menuRef} className="absolute top-10 right-2 w-48 bg-[#1A1A1A] border border-neutral-700 rounded-lg shadow-2xl z-20 flex flex-col py-1 text-sm">
            <button onClick={copyLink} className="flex items-center gap-2 px-3 py-2 text-white hover:bg-neutral-800 text-left">
              <LinkIcon size={14} /> Copy link
            </button>
            <button onClick={shareProject} className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white text-left">
              <Share2 size={14} /> Share project
            </button>
            <button onClick={managePermission} className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white text-left">
              <Shield size={14} /> Manage permission
            </button>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between px-1">
        <div>
          <h3 className="text-white font-medium mb-1">{project.title}</h3>
          <p className="text-xs text-neutral-500 mb-2">{project.meta}</p>
        </div>

        <div className="flex -space-x-2" onClick={(e) => e.stopPropagation()}>
          {Array.isArray(project.userAvatars) && project.userAvatars.length > 0 ? (
            project.userAvatars.slice(0, 3).map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`User avatar ${i}`}
                className="w-6 h-6 rounded-full border-2 border-[#161616] object-cover"
                onError={(e) => { e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png'; }}
              />
            ))
          ) : (
            project.users.slice(0, 3).map((u, i) => (
              <img
                key={i}
                src={`https://i.pravatar.cc/150?img=${10 + u}`}
                alt="User"
                className="w-6 h-6 rounded-full border-2 border-[#161616]"
              />
            ))
          )}

          {((Array.isArray(project.userAvatars) && project.userAvatars.length > 3 && project.userAvatars.length - 3 > 0)
            ? project.userAvatars.length - 3
            : (project.users.length > 3 ? project.users.length - 3 : 0)) > 0 && (
            <div className="w-6 h-6 rounded-full border-2 border-[#161616] bg-neutral-700 flex items-center justify-center text-[10px] text-white">
              {Array.isArray(project.userAvatars) && project.userAvatars.length > 3
                ? `+${project.userAvatars.length - 3}`
                : `+${project.users.length - 3}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Logout Confirmation Modal ---
const LogoutModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[420px] bg-[#0B0B0B] p-6 rounded-2xl border border-neutral-800 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full bg-red-500/10 border border-red-500/20">
            <LogOut size={24} className="text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-white">Logout</h3>
        </div>
        
        <p className="text-neutral-400 mb-6">
          Are you sure you want to logout? You'll need to sign in again to access your projects.
        </p>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="px-5 py-2.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoggingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
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
  );
};

// --- Dashboard Component ---
export default function Dashboard() {
  const openProject = (projectId) => {
    navigate(`/editor/${projectId}`);
  };
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'all';

  const mapServerProjectToUI = (p) => {
    try {
      const id = p._id || p.id || String(Math.random()).slice(2, 10);
      const title = p.title || 'Untitled project';
      const meta = p.meta || (p.size ? `${p.size} MB` : '');
      const img = p.image || p.img || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';

      const ownerAvatar = p.owner && (p.owner.avatar || p.owner.profilePic || null);
      const collaboratorAvatars = Array.isArray(p.collaborators)
        ? p.collaborators.map((c) => c?.avatar || c?.profilePic || null).filter(Boolean)
        : [];

      const userAvatars = [];
      if (ownerAvatar) userAvatars.push(ownerAvatar);
      userAvatars.push(...collaboratorAvatars);

      const collaboratorsCount = Array.isArray(p.collaborators) ? p.collaborators.length : 0;
      const usersPlaceholders = [1, ...Array.from({ length: collaboratorsCount }, (_, i) => i + 2)];

      const favorite = !!p.favorite;
      const archived = !!p.archived;
      const shared = !!(p.isPublic || collaboratorsCount > 0);
      const external = !!p.external;

      let createdAtVal = Date.now();
      if (p.createdAt) {
        const parsed = Date.parse(p.createdAt);
        if (!isNaN(parsed)) createdAtVal = parsed;
        else if (typeof p.createdAt === 'number') createdAtVal = p.createdAt;
      } else if (p.updatedAt) {
        const parsed2 = Date.parse(p.updatedAt);
        if (!isNaN(parsed2)) createdAtVal = parsed2;
      }

      return {
        id, title, meta, img, userAvatars, users: usersPlaceholders,
        favorite, archived, shared, external, createdAt: createdAtVal, raw: p,
      };
    } catch (err) {
      console.error('mapServerProjectToUI error', err, p);
      return {
        id: p._id || p.id || String(Math.random()).slice(2, 10),
        title: p.title || 'Untitled',
        meta: '', img: '', userAvatars: [], users: [1],
        favorite: false, archived: false, shared: false, external: false,
        createdAt: Date.now(), raw: p,
      };
    }
  };

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }
        try {
          const resUser = await axios.get('http://localhost:8000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(resUser.data);
        } catch (err) {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/login');
            return;
          }
          setLoading(false);
          return;
        }
        try {
          const res = await axios.get('http://localhost:8000/api/projects', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const arr = Array.isArray(res.data) ? res.data : [];
          const uiProjects = arr.map(mapServerProjectToUI);
          setProjects(uiProjects.length > 0 ? uiProjects : []);
        } catch (err) {
           // Handle Error
        }
      } catch (error) {
        console.error('[Dashboard] unexpected error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndProjects();
  }, [navigate]);

  const filtered = projects.filter((p) => {
    if (tab === 'favorites' && !p.favorite) return false;
    if (tab === 'shared' && !p.shared) return false;
    if (tab === 'external' && !p.external) return false;
    if (tab === 'archived' && !p.archived) return false;
    if (tab === 'recent' && !(p.createdAt > Date.now() - 1000 * 60 * 60 * 24 * 30)) return false;
    if (searchValue && !p.title.toLowerCase().includes(searchValue.toLowerCase())) return false;
    return true;
  });

  const toggleMenu = (id) => setActiveMenuId((s) => (s === id ? null : id));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Simulate logout delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Clear all auth data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    
    // Redirect to login
    navigate('/login');
  };

  if (loading) {
    return <div className="h-screen w-full bg-[#0F0F0F] flex items-center justify-center text-white">Loading...</div>;
  }

  // --- NewProjectModal ---
  const NewProjectModal = ({ isOpen, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [collaboratorEmails, setCollaboratorEmails] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
      if (!isOpen) {
        setTitle(''); setDescription(''); setCollaboratorEmails(''); setError(null);
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
          title, description,
          collaboratorEmails: collaboratorEmails.split(',').map(s => s.trim()).filter(Boolean),
        };
        const res = await axios.post('http://localhost:8000/api/projects', body, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const newUIProject = mapServerProjectToUI(res.data);
        setProjects((prev) => [newUIProject, ...prev]);
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
        <div className="absolute inset-0 bg-black/60" onClick={onClose} />
        <div className="relative w-[520px] bg-[#0B0B0B] p-6 rounded-2xl border border-neutral-800 z-10">
          <h3 className="text-lg font-semibold text-white mb-4">Create new project</h3>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="text-sm text-neutral-300">Title</label>
              <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white" placeholder="Project title" />
            </div>
            <div>
              <label className="text-sm text-neutral-300">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white" placeholder="Short description" rows={3} />
            </div>
            <div>
              <label className="text-sm text-neutral-300">Share with (emails, comma separated)</label>
              <input value={collaboratorEmails} onChange={(e) => setCollaboratorEmails(e.target.value)} placeholder="alice@example.com, bob@example.com" className="w-full mt-1 p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white" />
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-neutral-800 text-white">Cancel</button>
              <button disabled={creating} type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white">{creating ? 'Creating...' : 'Create project'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-neutral-400 font-sans overflow-hidden">
      <Sidebar projects={projects} currentTab={tab} />
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-black">
        <Header 
          searchValue={searchValue} 
          setSearchValue={setSearchValue} 
          user={user}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />
        <div className="px-8 pb-8">
          <div className="grid grid-cols-4 gap-4 mb-8">
            <QuickAction icon={<Plus size={20} />} label="New Project" onClick={() => setIsModalOpen(true)} />
            <QuickAction icon={<Folder size={20} />} label="Upload project" to="/upload" />
            <QuickAction icon={<UserPlus size={20} />} label="New team" to="/teams/new" />
            <QuickAction icon={<Building size={20} />} label="New organization" to="/orgs/new" />
          </div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">All folders</h2>
            <div className="flex gap-6 border-b border-neutral-800 pb-2 text-sm">
              <Tab label="All" value="all" active={tab === 'all'} />
              <Tab label="Recent" value="recent" active={tab === 'recent'} />
              <Tab label="Favorites" value="favorites" active={tab === 'favorites'} />
              <Tab label="Shared" value="shared" active={tab === 'shared'} />
              <Tab label="External" value="external" active={tab === 'external'} />
              <Tab label="Archived" value="archived" active={tab === 'archived'} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <ProjectCard key={p.id} project={p} activeMenuId={activeMenuId} toggleMenu={toggleMenu} />
            ))}
          </div>
        </div>
      </main>
      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}