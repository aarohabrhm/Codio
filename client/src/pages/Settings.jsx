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
} from "lucide-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("general");

  // Settings state
  const [settings, setSettings] = useState({
    theme: "dark",
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

  const renderSettingsContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-4">Editor Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Font Size</div>
                    <div className="text-xs text-gray-500">Set the editor font size</div>
                  </div>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: Number(e.target.value) })}
                    className="bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded-lg border border-[#2a2a2a] focus:outline-none"
                  >
                    {[12, 13, 14, 15, 16, 18, 20].map((size) => (
                      <option key={size} value={size}>{size}px</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Tab Size</div>
                    <div className="text-xs text-gray-500">Number of spaces for indentation</div>
                  </div>
                  <select
                    value={settings.tabSize}
                    onChange={(e) => setSettings({ ...settings, tabSize: Number(e.target.value) })}
                    className="bg-[#1a1a1a] text-white text-sm px-3 py-1.5 rounded-lg border border-[#2a2a2a] focus:outline-none"
                  >
                    {[2, 4, 8].map((size) => (
                      <option key={size} value={size}>{size} spaces</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Word Wrap</div>
                    <div className="text-xs text-gray-500">Wrap long lines of code</div>
                  </div>
                  <Toggle
                    enabled={settings.wordWrap}
                    onChange={(v) => setSettings({ ...settings, wordWrap: v })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Minimap</div>
                    <div className="text-xs text-gray-500">Show code minimap on the side</div>
                  </div>
                  <Toggle
                    enabled={settings.minimap}
                    onChange={(v) => setSettings({ ...settings, minimap: v })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Line Numbers</div>
                    <div className="text-xs text-gray-500">Show line numbers in the editor</div>
                  </div>
                  <Toggle
                    enabled={settings.lineNumbers}
                    onChange={(v) => setSettings({ ...settings, lineNumbers: v })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-4">Auto Save & Format</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Auto Save</div>
                    <div className="text-xs text-gray-500">Automatically save files</div>
                  </div>
                  <Toggle
                    enabled={settings.autoSave}
                    onChange={(v) => setSettings({ ...settings, autoSave: v })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Format On Save</div>
                    <div className="text-xs text-gray-500">Format code when saving</div>
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
              <h3 className="text-sm font-medium text-white mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSettings({ ...settings, theme: theme.id })}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition ${
                      settings.theme === theme.id
                        ? "bg-[#1a1a1a] border-cyan-500"
                        : "bg-[#0f0f0f] border-[#1a1a1a] hover:border-[#2a2a2a]"
                    }`}
                  >
                    <theme.icon size={24} className={settings.theme === theme.id ? "text-cyan-400" : "text-gray-400"} />
                    <span className="text-sm text-white">{theme.label}</span>
                    {settings.theme === theme.id && (
                      <Check size={14} className="text-cyan-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-4">Editor Appearance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Bracket Pair Colorization</div>
                    <div className="text-xs text-gray-500">Colorize matching brackets</div>
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
              <h3 className="text-sm font-medium text-white mb-4">AI Assistant</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">AI Suggestions</div>
                    <div className="text-xs text-gray-500">Show AI-powered code suggestions</div>
                  </div>
                  <Toggle
                    enabled={settings.aiSuggestions}
                    onChange={(v) => setSettings({ ...settings, aiSuggestions: v })}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[#1a1a1a]">
                  <div>
                    <div className="text-sm text-white">Code Completion</div>
                    <div className="text-xs text-gray-500">Enable AI code completion</div>
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
            <div className="text-gray-500">Settings for {activeSection} coming soon...</div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0a] text-gray-200">
      
      {/* Settings Sidebar */}
      <div className="w-64 bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col">
        {/* Search */}
        <div className="px-4 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#1a1a1a] rounded-lg text-gray-400 text-sm">
            <Search size={14} />
            <span>Search settings</span>
            <span className="ml-auto text-xs text-gray-600">⌘K</span>
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
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="h-12 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center px-4">
          <div className="flex items-center gap-1">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm bg-[#1a1a1a] text-white"
            >
              <Settings size={14} />
              Settings
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
          <h1 className="text-2xl font-semibold text-white mb-2">
            {menuItems.find((m) => m.id === activeSection)?.label || "Settings"}
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Customize your Codio experience
          </p>

          <div className="max-w-2xl">
            {renderSettingsContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
