import { useState } from "react";
import {
  Layout,
  BookOpen,
  HelpCircle,
  MessageCircle,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function LeftTabs({ active, onChange }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabClass = (tab) =>
    `w-10 h-10 rounded-lg flex items-center justify-center transition
     ${active === tab
       ? "bg-[#0f1720] text-teal-300"
       : "text-gray-400 hover:bg-[#0b1114]"}`;

  const toggleProfileMenu = () => setShowProfileMenu((v) => !v);
  const closeProfileMenu = () => setShowProfileMenu(false);

  return (
    <div className="w-14 bg-[#071018] flex flex-col justify-between items-center py-3 border-r border-[#0b1114] gap-3 relative">
      <div className="flex flex-col items-center gap-3">
        <button
          title="Files"
          className={tabClass("files")}
          onClick={() => onChange("files")}
        >
          <Layout size={18} />
        </button>

        <button
          title="Guide"
          className={tabClass("guide")}
          onClick={() => onChange("guide")}
        >
          <BookOpen size={18} />
        </button>

        <button
          title="Help"
          className={tabClass("help")}
          onClick={() => onChange("help")}
        >
          <HelpCircle size={18} />
        </button>

        <button
          title="Chat"
          className={tabClass("chat")}
          onClick={() => onChange("chat")}
        >
          <MessageCircle size={18} />
        </button>
      </div>

      {/* Profile button like VS Code bottom-left */}
      <div className="relative">
        <button
          title="Account"
          onClick={toggleProfileMenu}
          onBlur={() => setTimeout(closeProfileMenu, 120)}
          className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-gray-500 bg-[#0f1720] hover:bg-[#0b1114] focus:outline-none"
        >
          <User size={20} color="gray"/>
        </button>

        {showProfileMenu && (
          <div
            className="absolute left-12 bottom-0 z-20 w-48 rounded-lg border border-[#0b1114] bg-[#0b0f14] shadow-lg overflow-hidden"
            onMouseLeave={closeProfileMenu}
          >
            <div className="px-3 py-2 text-xs text-gray-400 border-b border-[#0f1720]">
              Signed in as <span className="text-gray-200">Jon</span>
            </div>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-[#0f1720]"
              onClick={closeProfileMenu}
            >
              <User size={14} />
              <span>Profile</span>
            </button>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-200 hover:bg-[#0f1720]"
              onClick={closeProfileMenu}
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <button
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-[#1a0f10]"
              onClick={closeProfileMenu}
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
