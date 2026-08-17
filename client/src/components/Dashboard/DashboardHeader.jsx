import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, MoreVertical, Settings, HelpCircle, LogOut } from 'lucide-react';

export default function DashboardHeader({ searchValue, setSearchValue, user, onLogoutClick }) {
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
    <header className={`h-20 border-b flex items-center justify-between px-6 bg-surface-page border-line`}>
      {/* Welcome Message */}
      <div>
        <h1 className="font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-primary [font-optical-sizing:auto]">
          Welcome back, {user ? user.fullname.split(' ')[0] : 'Developer'}
        </h1>
        <p className="mt-1 text-[13px] text-dim">
          Manage your projects and collaborate with your team
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={onSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={16} />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
            placeholder="Search projects..."
            className={`text-sm rounded-lg pl-9 pr-4 py-2 w-64 focus:outline-none transition bg-surface-raised border border-line-strong focus:border-accent text-primary placeholder:text-muted`}
          />
        </form>

        <div className={`w-px h-8 bg-surface-hover`} />

        {/* User Section */}
        <div className="flex items-center gap-3">
          <button className={`p-2 rounded-lg transition relative hover:bg-surface-hover text-dim hover:text-primary`}>
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </button>

          <Link to="/account" title="Go to Account" className="flex items-center gap-3">
            <img
              src={user?.avatar || user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt="Profile"
              className={`w-8 h-8 rounded-full border object-cover cursor-pointer transition border-line-strong hover:border-accent`}
            />
            <span className={`text-sm font-medium hidden md:block transition text-primary hover:text-dim`}>
              {user ? user.fullname : 'Loading...'}
            </span>
          </Link>
          
          {/* Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-lg transition hover:bg-surface-hover text-dim hover:text-primary`}
            >
              <MoreVertical size={18} />
            </button>

            {isMenuOpen && (
              <div className={`absolute top-full right-0 mt-2 w-48 rounded-xl shadow-2xl z-50 overflow-hidden bg-surface-panel border border-line-strong`}>
                <div className="py-1">
                  <Link
                    to="/settings"
                    className={`flex items-center gap-3 px-4 py-2.5 transition text-dim hover:bg-surface-hover hover:text-primary`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={16} />
                    <span className="text-sm">Settings</span>
                  </Link>
                  <div className={`border-t my-1 border-line-strong`} />
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogoutClick();
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 text-danger hover:text-danger transition text-left w-full hover:bg-surface-hover`}
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
