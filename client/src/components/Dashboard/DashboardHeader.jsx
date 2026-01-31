import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, MoreVertical, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function DashboardHeader({ searchValue, setSearchValue, user, onLogoutClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
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
    <header className={`h-20 border-b flex items-center justify-between px-6 ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-white border-gray-200'}`}>
      {/* Welcome Message */}
      <div>
        <h1 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Welcome back, {user ? user.fullname.split(' ')[0] : 'Developer'}
        </h1>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
          Manage your projects and collaborate with your team
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={onSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search projects..."
            className={`text-sm rounded-lg pl-9 pr-4 py-2 w-64 focus:outline-none transition ${
              isDark 
                ? 'bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#3a3a3a] text-white placeholder:text-gray-600' 
                : 'bg-gray-100 border border-gray-200 focus:border-gray-300 text-gray-900 placeholder:text-gray-400'
            }`}
          />
        </form>

        <div className={`w-px h-8 ${isDark ? 'bg-[#2a2a2a]' : 'bg-gray-200'}`} />

        {/* User Section */}
        <div className="flex items-center gap-3">
          <button className={`p-2 rounded-lg transition relative ${isDark ? 'hover:bg-[#1a1a1a] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}>
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
          </button>

          <Link to="/account" title="Go to Account" className="flex items-center gap-3">
            <img
              src={user?.avatar || user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className={`w-8 h-8 rounded-full border object-cover cursor-pointer transition ${isDark ? 'border-[#2a2a2a] hover:border-[#3a3a3a]' : 'border-gray-200 hover:border-gray-300'}`}
            />
            <span className={`text-sm font-medium hidden md:block transition ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'}`}>
              {user ? user.fullname : 'Loading...'}
            </span>
          </Link>
          
          {/* Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition ${isDark ? 'hover:bg-[#1a1a1a] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 overflow-hidden ${isDark ? 'bg-[#141414] border border-[#2a2a2a]' : 'bg-white border border-gray-200'}`}>
                <div className="py-1">
                  <Link
                    to="/settings"
                    className={`flex items-center gap-3 px-4 py-2.5 transition ${isDark ? 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={16} />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <Link
                    to="/support"
                    className={`flex items-center gap-3 px-4 py-2.5 transition ${isDark ? 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <HelpCircle size={16} />
                    <span className="text-sm">Help & Support</span>
                  </Link>
                  <div className={`border-t my-1 ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`} />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogoutClick();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 transition text-left w-full ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-100'}`}
                  >
                    <LogOut size={16} />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
