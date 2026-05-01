import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Search,
  BookOpen,
  MessageCircle,
  Zap,
  Globe,
  Shield,
  Database,
  FileText,
  X,
  Moon,
  Sun,
  Monitor,
  Check,
  LogOut,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { LogoutModal } from "../components/Dashboard";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, setTheme, isDark } = useTheme();
  const [activeSection, setActiveSection] = useState("general");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    fontSize: 14,
    tabSize: 2,
    wordWrap: true,
    minimap: true,
    lineNumbers: true,
    autoSave: true,
    formatOnSave: true,
    bracketPairs: true,
    aiSuggestions: true,
    codeCompletion: true,
    language: "English",
  });

  const menuItems = [
    { id: "general", icon: Settings, label: "General" },
    { id: "appearance", icon: Monitor, label: "Appearance" },
    { id: "chat", icon: MessageCircle, label: "Chat" },
    { id: "docs", icon: BookOpen, label: "Docs" },
  ];

  const themes = [
    { id: "light", icon: Sun, label: "Light" },
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ];

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-10 h-6 rounded-full transition-colors ${
        enabled ? "bg-cyan-500" : "bg-[#2a2a2a]"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-transform mx-1 ${
          enabled ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("rememberMe");

    navigate("/login");
  };

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Editor Settings</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Font Size</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Set the editor font size</div>
                  </div>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                    className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none ${
                      isDark 
                        ? 'bg-[#1a1a1a] text-white border-[#2a2a2a]' 
                        : 'bg-gray-100 text-gray-900 border-gray-200'
                    }`}
                  >
                    {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Tab Size</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Number of spaces for indentation</div>
                  </div>
                  <select
                    value={settings.tabSize}
                    onChange={(e) => setSettings({ ...settings, tabSize: Number(e.target.value) })}
                    className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none ${
                      isDark 
                        ? 'bg-[#1a1a1a] text-white border-[#2a2a2a]' 
                        : 'bg-gray-100 text-gray-900 border-gray-200'
                    }`}
                  >
                    {[2, 4, 8].map((size) => (
                      <option key={size} value={size}>{size} spaces</option>
                    ))}
                  </select>
                </div>

                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Word Wrap</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Wrap long lines of code</div>
                  </div>
                  <Toggle
                    enabled={settings.wordWrap}
                    onChange={(v) => setSettings({ ...settings, wordWrap: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Minimap</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Show code minimap on the side</div>
                  </div>
                  <Toggle
                    enabled={settings.minimap}
                    onChange={(v) => setSettings({ ...settings, minimap: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Line Numbers</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Show line numbers in the editor</div>
                  </div>
                  <Toggle
                    enabled={settings.lineNumbers}
                    onChange={(v) => setSettings({ ...settings, lineNumbers: v })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Auto Save & Format</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Auto Save</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Automatically save files</div>
                  </div>
                  <Toggle
                    enabled={settings.autoSave}
                    onChange={(v) => setSettings({ ...settings, autoSave: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Format On Save</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Format code when saving</div>
                  </div>
                  <Toggle
                    enabled={settings.formatOnSave}
                    onChange={(v) => setSettings({ ...settings, formatOnSave: v })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Theme</h3>
              <p className={`text-xs mb-4 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                Choose how Codio looks to you. Select a single theme, or sync with your system.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                      theme === t.id
                        ? isDark 
                          ? "bg-[#1a1a1a] border-cyan-500" 
                          : "bg-blue-50 border-blue-500"
                        : isDark 
                          ? "bg-[#0f0f0f] border-[#1a1a1a] hover:border-[#2a2a2a]"
                          : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <t.icon size={24} className={theme === t.id ? "text-cyan-400" : isDark ? "text-gray-400" : "text-gray-500"} />
                    <span className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.label}</span>
                    {theme === t.id && (
                      <Check size={14} className="text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Editor Appearance</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Bracket Pair Colorization</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Colorize matching brackets</div>
                  </div>
                  <Toggle
                    enabled={settings.bracketPairs}
                    onChange={(v) => setSettings({ ...settings, bracketPairs: v })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "chat":
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Assistant</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>AI Suggestions</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Show AI-powered code suggestions</div>
                  </div>
                  <Toggle
                    enabled={settings.aiSuggestions}
                    onChange={(v) => setSettings({ ...settings, aiSuggestions: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
                  <div>
                    <div className={`text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>Code Completion</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Enable AI code completion</div>
                  </div>
                  <Toggle
                    enabled={settings.codeCompletion}
                    onChange={(v) => setSettings({ ...settings, codeCompletion: v })}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className={isDark ? 'text-gray-500' : 'text-gray-600'}>Settings for {activeSection} coming soon...</div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen w-full ${isDark ? 'bg-[#0a0a0a] text-gray-200' : 'bg-white text-gray-900'}`}>
      
      {/* Settings Sidebar */}
      <div className={`w-64 ${isDark ? 'bg-[#0f0f0f] border-[#1a1a1a]' : 'bg-gray-50 border-gray-200'} border-r flex flex-col`}>
        {/* Search */}
        <div className={`px-4 py-4 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 ${isDark ? 'bg-[#1a1a1a] text-gray-400' : 'bg-gray-100 text-gray-500'} rounded-lg text-sm`}>
            <Search size={14} />
            <span>Search settings</span>
            <span className={`ml-auto text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>⌘K</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                activeSection === item.id
                  ? isDark 
                    ? "bg-[#1a1a1a] text-white" 
                    : "bg-gray-200 text-gray-900"
                  : isDark 
                    ? "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="px-2 pb-4 border-t border-transparent">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
              isDark
                ? "bg-transparent text-white border border-gray-700/50"
                : "bg-transparent text-black border border-gray-700/50"
            }`}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className={`h-12 ${isDark ? 'bg-[#0a0a0a] border-[#1a1a1a]' : 'bg-white border-gray-200'} border-b flex items-center px-4`}>
          <div className="flex items-center gap-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-gray-100 text-gray-900'}`}
            >
              <Settings size={14} />
              Settings
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
          <h1 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {menuItems.find((m) => m.id === activeSection)?.label || "Settings"}
          </h1>
          <p className={`text-sm mb-8 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Customize your Codio experience
          </p>

          <div className="max-w-2xl">
            {renderSettingsContent()}
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}
