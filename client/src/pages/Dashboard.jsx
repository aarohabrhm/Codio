import React, { useState, useRef, useEffect } from 'react';
import codioLogo from '../assets/logo.png'; 
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Search,
  Home,
  LayoutGrid,
  Folder,
  Settings,
  HelpCircle,
  Plus,
  Palette,
  UserPlus,
  Building,
  MoreVertical,
  Link as LinkIcon,
  Share2,
  Shield,
  Bell,
  FolderGit2,
} from 'lucide-react';

const SAMPLE_PROJECTS = [
  {
    id: '1',
    title: 'Personal Expense Tracker',
    meta: '92 MB',
    img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    users: [1, 2, 3],
    favorite: false,
    archived: false,
    shared: true,
    external: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
  },
  {
    id: '2',
    title: 'Basic Calculator App',
    meta: '188 MB',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    users: [4, 5, 6, 7, 8],
    favorite: true,
    archived: false,
    shared: false,
    external: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
  },
  {
    id: '3',
    title: 'Weather App',
    meta: '286 MB',
    img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    users: [1, 4],
    favorite: false,
    archived: false,
    shared: true,
    external: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40,
  },
  {
    id: '4',
    title: 'Chat Application',
    meta: '1.28 GB',
    img: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    users: [2, 3, 5, 6, 7],
    favorite: false,
    archived: false,
    shared: false,
    external: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: '5',
    title: 'E-commerce Website',
    meta: '126 MB',
    img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    users: [8],
    favorite: false,
    archived: true,
    shared: false,
    external: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
  },
  {
    id: '6',
    title: 'Library Management System',
    meta: '96 MB',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    users: [1, 3],
    favorite: true,
    archived: false,
    shared: false,
    external: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
];

const cn = (...args) => args.filter(Boolean).join(' ');

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

const Header = ({ searchValue, setSearchValue, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q') || '';
    setSearchValue(q);
  }, [location.search, setSearchValue]);

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
          {/* UPDATED AVATAR SECTION */}
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
          <MoreVertical size={18} className="cursor-pointer hover:text-white" />
        </div>
      </div>
    </header>
  );
};

const QuickAction = ({ icon, label, to }) => (
  <Link to={to} className="flex flex-col items-start gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition cursor-pointer">
    <div className="p-2 rounded-lg border border-neutral-700 bg-neutral-800/50 text-neutral-400">{icon}</div>
    <span className="text-sm font-medium text-white">{label}</span>
  </Link>
);

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
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
    }
  };

  const shareProject = async (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/projects/${project.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: project.title, url });
      } catch (err) {
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
      } catch (err) { }
    }
  };

  const managePermission = (e) => {
    e.stopPropagation();
    navigate(`/projects/${project.id}?modal=permissions`);
  };

  return (
    <div
      className="group relative bg-[#161616] rounded-xl p-3 border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
      onClick={() => navigate(`/projects/${project.id}`)}
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
          {project.users.slice(0, 3).map((u, i) => (
            <img key={i} src={`https://i.pravatar.cc/150?img=${10 + u}`} alt="User" className="w-6 h-6 rounded-full border-2 border-[#161616]" />
          ))}
          {project.users.length > 3 && (
            <div className="w-6 h-6 rounded-full border-2 border-[#161616] bg-neutral-700 flex items-center justify-center text-[10px] text-white">
              +{project.users.length - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [projects] = useState(SAMPLE_PROJECTS);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'all';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
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

  if (loading) {
    return <div className="h-screen w-full bg-[#0F0F0F] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-neutral-400 font-sans overflow-hidden">
      <Sidebar projects={projects} currentTab={tab} />

      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-black">
        <Header searchValue={searchValue} setSearchValue={setSearchValue} user={user} />

        <div className="px-8 pb-8">
          <div className="grid grid-cols-4 gap-4 mb-8">
            <QuickAction icon={<Plus size={20} />} label="New Project" to="/projects/new" />
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
    </div>
  );
}