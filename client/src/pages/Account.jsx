import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Edit2, X, LogOut } from "lucide-react";
import { Sidebar } from "../components/common";

export default function Account() {
  const navigate = useNavigate();

  // User data
  const [userData, setUserData] = useState({
    firstName: "Anu",
    lastName: "A",
    email: "anu@email.com",
    phone: "+91 98765 43210",
    status: "Verified User",
    location: "Kallooppara, Kerala",
  });

  

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-200">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="h-12 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center px-4">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm bg-[#1a1a1a] text-white"
            >
              <User size={14} />
              Account
              <button
                onClick={() => navigate("/editor")}
                className="ml-2 p-0.5 rounded hover:bg-[#2a2a2a]"
              >
                <X size={12} className="text-gray-500 hover:text-white" />
              </button>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <h1 className="text-2xl font-semibold text-white mb-8">Account</h1>

          {/* User Profile Card */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-[#0f0f0f] rounded-xl border border-[#1a1a1a]">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-semibold">
              {userData.firstName[0]}
            </div>
            <div>
              <div className="text-lg font-medium text-white">
                {userData.firstName} {userData.lastName}
              </div>
              <div className="text-sm text-gray-500">{userData.location}</div>
            </div>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-[#1a1a1a] rounded-full text-xs text-cyan-400 border border-cyan-400/30">
                {userData.status}
              </span>
            </div>
          </div>

          

          {/* Personal Information */}
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6 mb-6">
            <h2 className="text-lg font-medium text-white mb-6">Personal Information</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                <div>
                  <div className="text-xs text-gray-500 mb-1">First name</div>
                  <div className="text-sm text-white flex items-center gap-2">
                    {userData.firstName}
                    <Edit2 size={12} className="text-gray-500 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Last name</div>
                  <div className="text-sm text-white flex items-center gap-2">
                    {userData.lastName}
                    <Edit2 size={12} className="text-gray-500 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="text-sm text-white">{userData.email}</div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">Edit</button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Phone Number</div>
                  <div className="text-sm text-white flex items-center gap-2">
                    {userData.phone}
                  </div>
                </div>
                <button className="text-xs text-gray-400 hover:text-white">Edit</button>
              </div>
            </div>
          </div>


          {/* Sign Out */}
          <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] p-6">
            <button
              onClick={() => navigate("/login")}
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
