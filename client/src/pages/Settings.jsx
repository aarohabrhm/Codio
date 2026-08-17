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
  const { theme, setTheme } = useTheme();
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
        enabled ? "bg-accent" : "bg-surface-hover"
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
              <h3 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Editor Settings</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Font Size</div>
                    <div className={`text-xs text-dim`}>Set the editor font size</div>
                  </div>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                    className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none bg-surface-raised text-primary border-line-strong`}
                  >
                    {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Tab Size</div>
                    <div className={`text-xs text-dim`}>Number of spaces for indentation</div>
                  </div>
                  <select
                    value={settings.tabSize}
                    onChange={(e) => setSettings({ ...settings, tabSize: Number(e.target.value) })}
                    className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none bg-surface-raised text-primary border-line-strong`}
                  >
                    {[2, 4, 8].map((size) => (
                      <option key={size} value={size}>{size} spaces</option>
                    ))}
                  </select>
                </div>

                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Word Wrap</div>
                    <div className={`text-xs text-dim`}>Wrap long lines of code</div>
                  </div>
                  <Toggle
                    enabled={settings.wordWrap}
                    onChange={(v) => setSettings({ ...settings, wordWrap: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Minimap</div>
                    <div className={`text-xs text-dim`}>Show code minimap on the side</div>
                  </div>
                  <Toggle
                    enabled={settings.minimap}
                    onChange={(v) => setSettings({ ...settings, minimap: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Line Numbers</div>
                    <div className={`text-xs text-dim`}>Show line numbers in the editor</div>
                  </div>
                  <Toggle
                    enabled={settings.lineNumbers}
                    onChange={(v) => setSettings({ ...settings, lineNumbers: v })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Auto Save & Format</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Auto Save</div>
                    <div className={`text-xs text-dim`}>Automatically save files</div>
                  </div>
                  <Toggle
                    enabled={settings.autoSave}
                    onChange={(v) => setSettings({ ...settings, autoSave: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Format On Save</div>
                    <div className={`text-xs text-dim`}>Format code when saving</div>
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
              <h3 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Theme</h3>
              <p className={`text-xs mb-4 text-dim`}>
                Choose how Codio looks to you. Select a single theme, or sync with your system.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                      theme === t.id
                        ? "bg-accent/10 border-accent"
                        : "bg-surface-panel border-line hover:border-line-strong"
                    }`}
                  >
                    <t.icon size={24} className={theme === t.id ? "text-accent-fg" : "text-dim"} />
                    <span className={`text-sm text-primary`}>{t.label}</span>
                    {theme === t.id && (
                      <Check size={14} className="text-accent-fg" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">Editor Appearance</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Bracket Pair Colorization</div>
                    <div className={`text-xs text-dim`}>Colorize matching brackets</div>
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
              <h3 className="mb-4 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-muted">AI Assistant</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>AI Suggestions</div>
                    <div className={`text-xs text-dim`}>Show AI-powered code suggestions</div>
                  </div>
                  <Toggle
                    enabled={settings.aiSuggestions}
                    onChange={(v) => setSettings({ ...settings, aiSuggestions: v })}
                  />
                </div>

                <div className={`flex items-center justify-between py-3 border-b border-line`}>
                  <div>
                    <div className={`text-sm text-primary`}>Code Completion</div>
                    <div className={`text-xs text-dim`}>Enable AI code completion</div>
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
            <div className={"text-dim"}>Settings for {activeSection} coming soon...</div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen w-full bg-surface-page text-primary`}>
      
      {/* Settings Sidebar */}
      <div className={`w-64 bg-surface-panel border-line border-r flex flex-col`}>
        {/* Search */}
        <div className={`px-4 py-4 border-b border-line`}>
          <div className={`flex items-center gap-2 px-3 py-2 bg-surface-raised text-dim rounded-lg text-sm`}>
            <Search size={14} />
            <span>Search settings</span>
            <span className={`ml-auto text-xs text-muted`}>⌘K</span>
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
                  ? "bg-surface-raised text-primary"
                  : "text-dim hover:bg-surface-hover hover:text-primary"
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
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition bg-transparent text-primary border border-line-strong`}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className={`h-12 bg-surface-page border-line border-b flex items-center px-4`}>
          <div className="flex items-center gap-1">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm bg-surface-raised text-primary`}
            >
              <Settings size={14} />
              Settings
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
          <h1 className="mb-2 font-display text-[28px] leading-[1.08] tracking-[-0.022em] text-primary [font-optical-sizing:auto]">
            {menuItems.find((m) => m.id === activeSection)?.label || "Settings"}
          </h1>
          <p className={`text-sm mb-8 text-dim`}>
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
