import React, { useState } from 'react';
import codioLogo from '../assets/logo.png';
import { 
  Search, 
  Home, 
  LayoutGrid, 
  Folder, 
  Users, 
  Settings, 
  HelpCircle, 
  Plus, 
  FileText, 
  Briefcase, 
  UserPlus, 
  Building,
  MoreVertical,
  Link,
  Share2,
  Shield,
  Bell,
  ChevronDown,
  ChevronRight, 
  ExternalLink,
  Minus
} from 'lucide-react';

const Dashboard = () => {
  // State to simulate the dropdown menu being open on a specific card
  const [activeMenuId, setActiveMenuId] = useState(0);

  const toggleMenu = (id) => {
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="flex h-screen w-full bg-[#0F0F0F] text-neutral-400 font-sans overflow-hidden">
      
      {/* --- Sidebar --- */}
      <aside className="w-72 flex flex-col border-r border-neutral-800 h-full p-4 bg-[#0F0F0F]">
        
        {/* Team Header */}
        <div className="flex items-start justify-start rounded-lg ">
          <div className="flex items-center">
            <img
              src={codioLogo}
              alt="Codio logo"
              className="w-15 h-15 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-white text-lg font-medium">Codio</h3>
            </div>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="space-y-1 mb-8">
          <NavItem icon={<Home size={20} />} label="Home" active />
          <NavItem icon={<LayoutGrid size={20} />} label="My projects" />
        </nav>

        {/* Folders Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-2 group cursor-pointer">
            <div className="flex items-center gap-2 text-neutral-500 hover:text-white">
              <Folder size={18} />
              <span className="font-medium">Folders</span>
            </div>
            <Minus size={16} className="text-neutral-500" />
          </div>
          
          <div className="space-y-1 mt-2">
            <NavItem label="View all" count="48" indented />
            <NavItem label="Recent" count="6" indented />
            <NavItem label="Favorites" count="4" indented />
            <NavItem label="Shared" count="22" indented />
            <NavItem label="Archived" count="14" indented />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto space-y-1">
          <NavItem icon={<LayoutGrid size={20} />} label="All files" />
          <NavItem icon={<Users size={20} />} label="Team members" />
          <NavItem icon={<ExternalLink size={20} />} label="Open in browser" />
          
          <div className="border-t border-neutral-800 my-4"></div>
          
          <NavItem icon={<HelpCircle size={20} />} label="Support" />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-black">
        
        {/* Header */}
        <header className="flex items-center justify-between p-8 pb-4">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" size={18} />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-neutral-900 border border-neutral-800 text-sm rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:border-neutral-600 text-white"
              />
            </div>
            
            <div className="flex items-center gap-3 pl-4 border-l border-neutral-800">
              <img 
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-neutral-700"
              />
              <span className="text-sm font-medium text-white">Nickolas Gibbons</span>
              <Bell size={18} className="cursor-pointer hover:text-white" />
              <MoreVertical size={18} className="cursor-pointer hover:text-white" />
            </div>
          </div>
        </header>

        <div className="px-8 pb-8">
          
          {/* Quick Actions Row */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <QuickAction icon={<Plus size={20} />} label="New document" />
            <QuickAction icon={<Folder size={20} />} label="New project" />
            <QuickAction icon={<UserPlus size={20} />} label="New team" />
            <QuickAction icon={<Building size={20} />} label="New organization" />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">All folders</h2>
            <div className="flex gap-6 border-b border-neutral-800 pb-2 text-sm">
              <Tab label="Recent" active />
              <Tab label="Favorites" />
              <Tab label="Shared" />
              <Tab label="External" />
              <Tab label="Archived" />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <ProjectCard 
              id={1}
              title="3D renders"
              meta="18 images | 92 MB"
              img="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              users={[1,2,3]}
              activeMenuId={activeMenuId}
              toggleMenu={toggleMenu}
            />

            {/* Card 2 */}
            <ProjectCard 
              id={2}
              title="Team photos"
              meta="32 images | 188 MB"
              img="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              users={[4,5,6,7,8]}
              activeMenuId={activeMenuId}
              toggleMenu={toggleMenu}
            />

            {/* Card 3 (With Active Dropdown) */}
            <ProjectCard 
              id={3}
              title="UI presentations"
              meta="6 files | 286 MB"
              img="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              users={[1,4]}
              activeMenuId={activeMenuId}
              toggleMenu={toggleMenu}
            />

            {/* Card 4 */}
            <ProjectCard 
              id={4}
              title="Company retreat"
              meta="246 images | 1.28 GB"
              img="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              users={[2,3,5,6,7]}
              activeMenuId={activeMenuId}
              toggleMenu={toggleMenu}
            />

            {/* Card 5 */}
            <ProjectCard 
              id={5}
              title="Dark mode ideas"
              meta="42 images | 126 MB"
              img="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              users={[8]}
              activeMenuId={activeMenuId}
              toggleMenu={toggleMenu}
            />

            {/* Card 6 */}
            <ProjectCard 
              id={6}
              title="Dashboard 3.0 inspo"
              meta="22 images | 96 MB"
              img="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              users={[1,3]}
              activeMenuId={activeMenuId}
              toggleMenu={toggleMenu}
            />

          </div>
        </div>
      </main>
    </div>
  );
};

// --- Reusable Components ---

const NavItem = ({ icon, label, count, active, indented }) => (
  <div 
    className={`
      flex items-center justify-between px-2 py-2 rounded-lg cursor-pointer transition text-sm
      ${active ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900 text-neutral-400'}
      ${indented ? 'pl-9' : ''}
    `}
  >
    <div className="flex items-center gap-3">
      {icon}
      <span>{label}</span>
    </div>
    {count && (
      <span className="bg-neutral-800 text-xs px-2 py-0.5 rounded-full text-neutral-500">
        {count}
      </span>
    )}
  </div>
);

const QuickAction = ({ icon, label }) => (
  <div className="flex flex-col items-start gap-4 p-5 rounded-xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition cursor-pointer">
    <div className="p-2 rounded-lg border border-neutral-700 bg-neutral-800/50 text-neutral-400">
      {icon}
    </div>
    <span className="text-sm font-medium text-white">{label}</span>
  </div>
);

const Tab = ({ label, active }) => (
  <button 
    className={`
      pb-2 relative transition
      ${active ? 'text-white font-medium' : 'text-neutral-500 hover:text-neutral-300'}
    `}
  >
    {label}
    {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neutral-600 rounded-t-full"></div>}
  </button>
);

const ProjectCard = ({ id, title, meta, img, users, activeMenuId, toggleMenu }) => {
  const isMenuOpen = activeMenuId === id;

  return (
    <div className="group relative bg-[#161616] rounded-xl p-3 border border-neutral-800 hover:border-neutral-700 transition">
      
      {/* Thumbnail */}
      <div className="relative h-48 w-full mb-4 overflow-hidden rounded-lg">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        
        {/* Menu Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleMenu(id); }}
          className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-md text-white backdrop-blur-sm transition"
        >
          <MoreVertical size={16} />
        </button>

        {/* --- Dropdown Menu (Conditionally Rendered) --- */}
        {isMenuOpen && (
          <div className="absolute top-10 right-2 w-48 bg-[#1A1A1A] border border-neutral-700 rounded-lg shadow-2xl z-20 flex flex-col py-1 text-sm animate-in fade-in zoom-in-95 duration-100">
            <button className="flex items-center gap-2 px-3 py-2 text-white hover:bg-neutral-800 text-left">
              <Link size={14} /> Copy link
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white text-left">
              <Share2 size={14} /> Share project
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-neutral-400 hover:bg-neutral-800 hover:text-white text-left">
              <Shield size={14} /> Manage permission
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h3 className="text-white font-medium mb-1">{title}</h3>
          <p className="text-xs text-neutral-500 mb-2">{meta}</p>
        </div>
        
        {/* Avatars */}
        <div className="flex -space-x-2">
           {users.slice(0, 3).map((u, i) => (
             <img 
              key={i}
              src={`https://i.pravatar.cc/150?img=${10 + u}`} 
              alt="User" 
              className="w-6 h-6 rounded-full border-2 border-[#161616]" 
             />
           ))}
           {users.length > 3 && (
             <div className="w-6 h-6 rounded-full border-2 border-[#161616] bg-neutral-700 flex items-center justify-center text-[10px] text-white">
               +{users.length - 3}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;