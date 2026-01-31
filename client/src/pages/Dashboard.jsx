import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, FolderOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Components
import {
  DashboardHeader,
  DashboardSidebar,
  ProjectCard,
  QuickActions,
  ProjectTabs,
  NewProjectModal,
  LogoutModal,
  DeleteProjectModal,
} from '../components/Dashboard';

// Map server project data to UI format
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

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'all';
  const view = params.get('view') || 'dashboard';

  const handleViewChange = (newView) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set('view', newView);
    navigate({ pathname: location.pathname, search: newParams.toString() });
  };

  // Fetch user and projects on mount
  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch user
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

        // Fetch projects
        try {
          const res = await axios.get('http://localhost:8000/api/projects', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const arr = Array.isArray(res.data) ? res.data : [];
          const uiProjects = arr.map(mapServerProjectToUI);
          setProjects(uiProjects);
        } catch (err) {
          console.error('Failed to fetch projects', err);
        }
      } catch (error) {
        console.error('[Dashboard] unexpected error', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProjects();
  }, [navigate]);

  // Filter projects based on tab and search
  const filteredProjects = projects.filter((p) => {
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    
    navigate('/login');
  };

  const handleProjectCreated = (serverProject) => {
    const newUIProject = mapServerProjectToUI(serverProject);
    setProjects((prev) => [newUIProject, ...prev]);
  };

  const handleDeleteClick = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:8000/api/projects/${projectToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setProjects((prev) => prev.filter(p => p.id !== projectToDelete.id));
      setDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (err) {
      console.error('Failed to delete project', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const { isDark } = useTheme();

  // Loading state
  if (loading) {
    return (
      <div className={`h-screen w-full flex flex-col items-center justify-center gap-4 ${isDark ? 'bg-[#0a0a0a] text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDark ? 'bg-[#0a0a0a] text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <DashboardSidebar 
        projects={projects} 
        currentTab={tab} 
        currentView={view}
        onViewChange={handleViewChange}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <DashboardHeader
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          user={user}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Quick Actions - Only show in dashboard view */}
            {view === 'dashboard' && (
              <QuickActions onNewProject={() => setIsModalOpen(true)} />
            )}

            {/* Projects Section */}
            <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-[#0f0f0f] border border-[#1a1a1a]' : 'bg-white border border-gray-200 shadow-sm'}`}>
              {/* Section Header */}
              <div className={`px-6 py-4 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {view === 'projects' ? 'My Projects' : 'Your Projects'}
                </h2>
                <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
                </p>
              </div>

              {/* Tabs */}
              <div className="px-6">
                <ProjectTabs currentTab={tab} />
              </div>

              {/* Projects Grid */}
              <div className="p-6">
                {filteredProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredProjects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        activeMenuId={activeMenuId}
                        toggleMenu={toggleMenu}
                        onDelete={handleDeleteClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-100'}`}>
                      <FolderOpen size={32} className="text-gray-600" />
                    </div>
                    <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No projects found</h3>
                    <p className={`max-w-sm mb-6 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                      {searchValue 
                        ? `No projects match "${searchValue}". Try a different search term.`
                        : "You don't have any projects yet. Create your first project to get started."
                      }
                    </p>
                    {!searchValue && (
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Create your first project
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
      
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <DeleteProjectModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProjectToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        projectTitle={projectToDelete?.title || ''}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .overflow-y-auto::-webkit-scrollbar { width: 8px; height: 8px; }
        .overflow-y-auto::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
        .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}