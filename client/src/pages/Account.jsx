import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit2, X, LogOut, Loader2 } from "lucide-react";
import axios from "axios";

export default function Account() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:8000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        const nameParts = (user.fullname || '').split(' ');
        
        setUserData({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || '',
          phone: user.phone || 'Not provided',
          status: user.isVerified ? 'Verified User' : 'Unverified',
          location: user.location || 'Not provided',
          avatar: user.avatar || user.profilePic || null,
        });
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('rememberMe');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={`flex h-screen w-full items-center justify-center bg-surface-page`}>
        <Loader2 className="animate-spin w-8 h-8 text-accent-fg" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`flex h-screen w-full items-center justify-center bg-surface-page text-dim`}>
        <p>Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full bg-surface-page text-primary`}>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className={`h-12 border-b flex items-center px-4 bg-surface-page border-line`}>
          <div className="flex items-center gap-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm bg-surface-raised text-primary`}
            >
              <User size={14} />
              Account
              <button
                onClick={() => navigate(-1)}
                className={`ml-2 p-0.5 rounded hover:bg-surface-hover`}
              >
                <X size={12} className={`text-muted hover:text-primary`} />
              </button>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="mb-8 font-display text-[28px] leading-[1.08] tracking-[-0.022em] text-primary [font-optical-sizing:auto]">Account</h1>

          {/* User Profile Card */}
          <div className={`flex items-center gap-4 mb-8 p-4 rounded-xl border bg-surface-panel border-line`}>
            <img 
              src={userData.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="Profile" 
              className={`w-16 h-16 rounded-full object-cover border border-line-strong`}
            />
            <div>
              <div className={`text-lg font-medium text-primary`}>
                {userData.firstName} {userData.lastName}
              </div>
              <div className={`text-sm text-dim`}>{userData.location}</div>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1 rounded-full text-xs text-accent-fg border border-accent/30 bg-accent/10`}>
                {userData.status}
              </span>
            </div>
          </div>

          

          {/* Personal Information */}
          <div className={`rounded-xl border p-6 mb-6 bg-surface-panel border-line`}>
            <h2 className="mb-6 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Personal Information</h2>

            <div className="space-y-4">
              <div className={`flex items-center justify-between py-3 border-b border-line`}>
                <div>
                  <div className={`text-xs mb-1 text-dim`}>First name</div>
                  <div className={`text-sm flex items-center gap-2 text-primary`}>
                    {userData.firstName}
                    <Edit2 size={12} className={`cursor-pointer text-muted hover:text-primary`} />
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between py-3 border-b border-line`}>
                <div>
                  <div className={`text-xs mb-1 text-dim`}>Last name</div>
                  <div className={`text-sm flex items-center gap-2 text-primary`}>
                    {userData.lastName}
                    <Edit2 size={12} className={`cursor-pointer text-muted hover:text-primary`} />
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between py-3 border-b border-line`}>
                <div>
                  <div className={`text-xs mb-1 text-dim`}>Email</div>
                  <div className={`text-sm text-primary`}>{userData.email}</div>
                </div>
                <button className={`text-xs text-dim hover:text-primary`}>Edit</button>
              </div>

              <div className={`flex items-center justify-between py-3 border-b border-line`}>
                <div>
                  <div className={`text-xs mb-1 text-dim`}>Phone Number</div>
                  <div className={`text-sm flex items-center gap-2 text-primary`}>
                    {userData.phone}
                  </div>
                </div>
                <button className={`text-xs text-dim hover:text-primary`}>Edit</button>
              </div>
            </div>
          </div>


          {/* Sign Out */}
          <div className={`rounded-xl border p-6 bg-surface-panel border-line`}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-danger hover:text-danger transition"
            >
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
