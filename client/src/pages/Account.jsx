import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit2, X, LogOut, Loader2 } from "lucide-react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

export default function Account() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
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
      <div className={`flex h-screen w-full items-center justify-center ${isDark ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className={`flex h-screen w-full items-center justify-center ${isDark ? 'bg-[#0a0a0a] text-gray-400' : 'bg-white text-gray-600'}`}>
        <p>Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className={`flex h-screen w-full ${isDark ? 'bg-[#0a0a0a] text-gray-200' : 'bg-white text-gray-900'}`}>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className={`h-12 border-b flex items-center px-4 ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              <User size={14} />
              Account
              <button
                onClick={() => navigate(-1)}
                className={`ml-2 p-0.5 rounded ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-200'}`}
              >
                <X size={12} className={`${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`} />
              </button>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className={`text-2xl font-semibold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Account</h1>

          {/* User Profile Card */}
          <div className={`flex items-center gap-4 mb-8 p-4 rounded-xl border ${isDark ? 'bg-[#0f0f0f] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'}`}>
            <img 
              src={userData.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="Profile" 
              className={`w-16 h-16 rounded-full object-cover border ${isDark ? 'border-[#2a2a2a]' : 'border-gray-200'}`}
            />
            <div>
              <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {userData.firstName} {userData.lastName}
              </div>
              <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{userData.location}</div>
            </div>
            <div className="ml-auto">
              <span className={`px-3 py-1 rounded-full text-xs text-cyan-400 border border-cyan-400/30 ${isDark ? 'bg-[#1a1a1a]' : 'bg-cyan-50'}`}>
                {userData.status}
              </span>
            </div>
          </div>

          

          {/* Personal Information */}
          <div className={`rounded-xl border p-6 mb-6 ${isDark ? 'bg-[#0f0f0f] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'}`}>
            <h2 className={`text-lg font-medium mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Personal Information</h2>

            <div className="space-y-4">
              <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                <div>
                  <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>First name</div>
                  <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userData.firstName}
                    <Edit2 size={12} className={`cursor-pointer ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`} />
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                <div>
                  <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Last name</div>
                  <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userData.lastName}
                    <Edit2 size={12} className={`cursor-pointer ${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`} />
                  </div>
                </div>
              </div>

              <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                <div>
                  <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Email</div>
                  <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{userData.email}</div>
                </div>
                <button className={`text-xs ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Edit</button>
              </div>

              <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                <div>
                  <div className={`text-xs mb-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Phone Number</div>
                  <div className={`text-sm flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {userData.phone}
                  </div>
                </div>
                <button className={`text-xs ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>Edit</button>
              </div>
            </div>
          </div>


          {/* Sign Out */}
          <div className={`rounded-xl border p-6 ${isDark ? 'bg-[#0f0f0f] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'}`}>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition"
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
