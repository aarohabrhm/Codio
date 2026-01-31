import { RefreshCw, XCircle, Terminal, AlertCircle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function BottomPanel({
  activeTab,
  setActiveTab,
  consoleOutput,
  terminalOutput,
  terminalInput,
  setTerminalInput,
  problems,
  onTerminalExecute,
  onClearAll,
  files,
}) {
  const { isDark } = useTheme();
  
  return (
    <div className={`border-t flex flex-col h-64 ${
      isDark 
        ? 'bg-[#0a0a0a] border-[#1a1a1a]' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      {/* --- Tab Header --- */}
      <div className={`flex items-center justify-between px-4 border-b ${
        isDark 
          ? 'border-[#1a1a1a] bg-[#0f0f0f]' 
          : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("console")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors ${
              activeTab === "console"
                ? `${isDark ? 'text-white' : 'text-gray-900'} border-blue-500`
                : `${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} border-transparent`
            }`}
          >
            OUTPUT
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors ${
              activeTab === "terminal"
                ? `${isDark ? 'text-white' : 'text-gray-900'} border-blue-500`
                : `${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} border-transparent`
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "problems"
                ? `${isDark ? 'text-white' : 'text-gray-900'} border-blue-500`
                : `${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} border-transparent`
            }`}
          >
            PROBLEMS
            {problems.length > 0 && (
              <span className="bg-red-500/20 text-red-400 text-[10px] px-1.5 rounded-full">
                {problems.length}
              </span>
            )}
          </button>
        </div>

        <button
          title="Clear Output"
          onClick={onClearAll}
          className={`p-1.5 rounded transition-colors ${
            isDark 
              ? 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          }`}
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* --- Tab Content Area --- */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* 1. CONSOLE TAB (Output) */}
        {activeTab === "console" && (
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4 font-mono text-sm">
            {consoleOutput.length > 0 ? (
              consoleOutput.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap mb-1 leading-relaxed pb-1 border-b ${
                  isDark 
                    ? 'text-gray-300 border-[#1a1a1a]/50' 
                    : 'text-gray-700 border-gray-200/50'
                }`}>
                  {line}
                </div>
              ))
            ) : (
              <div className={`italic mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No output to show. Run your code to see results here.</div>
            )}
          </div>
        )}

        {/* 2. TERMINAL TAB */}
        {activeTab === "terminal" && (
          <div className="absolute inset-0 flex flex-col p-4 font-mono text-sm">
            {/* Scrollable Logs */}
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-2 space-y-1">
              {terminalOutput.map((line, i) => (
                <div key={i} className={`whitespace-pre-wrap break-words ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {line}
                </div>
              ))}
            </div>
            
            {/* Fixed Input Bar */}
            <div className={`flex items-center gap-2 border rounded-md px-2 py-1.5 focus-within:border-blue-500/50 transition-colors ${
              isDark 
                ? 'bg-[#0f0f0f] border-[#2a2a2a]' 
                : 'bg-white border-gray-300'
            }`}>
              <span className="text-blue-500">❯</span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onTerminalExecute()}
                placeholder="Type command..."
                className={`flex-1 bg-transparent border-none outline-none h-full ${
                  isDark 
                    ? 'text-gray-200 placeholder-gray-600' 
                    : 'text-gray-800 placeholder-gray-400'
                }`}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* 3. PROBLEMS TAB */}
        {activeTab === "problems" && (
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4">
            {problems.length === 0 ? (
              <div className={`flex flex-col items-center justify-center h-full gap-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                 <div className="text-green-500/20"><AlertCircle size={40}/></div>
                 <p>No problems detected.</p>
              </div>
            ) : (
              problems.map((p, idx) => (
                <div key={idx} className={`flex gap-3 p-3 border border-red-500/20 rounded-md mb-2 transition-colors cursor-pointer group ${
                  isDark 
                    ? 'bg-[#1a1a1a]/50 hover:bg-[#1a1a1a]' 
                    : 'bg-red-50/50 hover:bg-red-50'
                }`}>
                  <XCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                  <div>
                    <div className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {p.message}
                    </div>
                    <div className={`text-xs mt-1 ${isDark ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-600'}`}>
                      {files?.[p.file]?.name || "Unknown File"} • Line {p.line}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#2a2a2a' : '#d1d5db'}; border: 3px solid ${isDark ? '#0a0a0a' : '#f9fafb'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#3a3a3a' : '#9ca3af'}; }
      `}</style>
    </div>
  );
}