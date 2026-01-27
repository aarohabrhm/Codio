// components/EditorPage/OnlineUsers.jsx
import React from 'react';
import { Users, Wifi, WifiOff } from 'lucide-react';

export default function OnlineUsers({ onlineUsers, isConnected, myColor }) {
  const totalUsers = onlineUsers.length + 1; // +1 for current user

  return (
    <div className="flex items-center gap-3">
      {/* Connection Status */}
      <div className="flex items-center gap-1.5">
        {isConnected ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Live</span>
          </>
        ) : (
          <>
            <WifiOff size={12} className="text-gray-500" />
            <span className="text-xs text-gray-500">Offline</span>
          </>
        )}
      </div>

      <div className="w-px h-5 bg-[#2a2a2a]" />

      {/* User Count */}
      <div className="flex items-center gap-2">
        <Users size={14} className="text-gray-400" />
        <span className="text-xs text-gray-400">{totalUsers}</span>
      </div>

      {/* User Avatars */}
      <div className="flex items-center -space-x-2">
        {/* Current User (You) */}
        <div 
          className="relative w-7 h-7 rounded-full border-2 bg-[#1a1a1a] flex items-center justify-center overflow-hidden"
          style={{ borderColor: myColor }}
          title="You"
        >
          <div 
            className="absolute inset-0 opacity-20"
            style={{ backgroundColor: myColor }}
          />
          <span className="relative text-xs font-medium text-white">You</span>
        </div>

        {/* Online Users */}
        {onlineUsers.slice(0, 4).map((user) => (
          <div
            key={user.userId}
            className="relative w-7 h-7 rounded-full border-2 overflow-hidden hover:z-10 transition-transform hover:scale-110"
            style={{ borderColor: user.color }}
            title={user.username}
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
              }}
            />
            {/* Active indicator */}
            <div 
              className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-[#0a0a0a]"
              style={{ backgroundColor: user.color }}
            />
          </div>
        ))}

        {/* More users indicator */}
        {onlineUsers.length > 4 && (
          <div
            className="relative w-7 h-7 rounded-full border-2 border-[#2a2a2a] bg-[#1a1a1a] flex items-center justify-center text-[10px] text-gray-400 font-medium"
            title={`${onlineUsers.length - 4} more users`}
          >
            +{onlineUsers.length - 4}
          </div>
        )}
      </div>

      {/* Expanded User List on Hover */}
      {onlineUsers.length > 0 && (
        <div className="relative group">
          <button className="text-xs text-gray-500 hover:text-gray-300 transition">
            View all
          </button>
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-64 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="p-3 border-b border-[#2a2a2a]">
              <div className="text-xs font-medium text-white">
                Online ({totalUsers})
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {/* You */}
              <div className="flex items-center gap-3 px-3 py-2 hover:bg-[#1a1a1a]">
                <div 
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium text-white"
                  style={{ 
                    borderColor: myColor,
                    backgroundColor: `${myColor}20`
                  }}
                >
                  You
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white">You (editing)</div>
                </div>
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: myColor }}
                />
              </div>

              {/* Other Users */}
              {onlineUsers.map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-[#1a1a1a]"
                >
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full border-2 object-cover"
                    style={{ borderColor: user.color }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">
                      {user.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.cursor ? 'Editing' : 'Viewing'}
                    </div>
                  </div>
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: user.color }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}