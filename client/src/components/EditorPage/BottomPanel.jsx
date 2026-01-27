import { RefreshCw, XCircle, Terminal, AlertCircle } from "lucide-react";

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
  return (
    <div className="bg-[#0a0a0a] border-t border-[#1a1a1a] flex flex-col h-64">
      {/* --- Tab Header --- */}
      <div className="flex items-center justify-between px-4 border-b border-[#1a1a1a] bg-[#0f0f0f]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("console")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors ${
              activeTab === "console"
                ? "text-white border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            OUTPUT
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors ${
              activeTab === "terminal"
                ? "text-white border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`text-xs tracking-wide py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "problems"
                ? "text-white border-blue-500"
                : "text-gray-500 border-transparent hover:text-gray-300"
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
          className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1a1a1a] rounded transition-colors"
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
                <div key={i} className="whitespace-pre-wrap text-gray-300 mb-1 leading-relaxed border-b border-[#1a1a1a]/50 pb-1">
                  {line}
                </div>
              ))
            ) : (
              <div className="text-gray-600 italic mt-2">No output to show. Run your code to see results here.</div>
            )}
          </div>
        )}

        {/* 2. TERMINAL TAB */}
        {activeTab === "terminal" && (
          <div className="absolute inset-0 flex flex-col p-4 font-mono text-sm">
            {/* Scrollable Logs */}
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-2 space-y-1">
              {terminalOutput.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap text-gray-300 break-words">
                  {line}
                </div>
              ))}
            </div>
            
            {/* Fixed Input Bar */}
            <div className="flex items-center gap-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-md px-2 py-1.5 focus-within:border-blue-500/50 transition-colors">
              <span className="text-blue-500">❯</span>
              <input
                value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onTerminalExecute()}
                placeholder="Type command..."
                className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-600 h-full"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* 3. PROBLEMS TAB */}
        {activeTab === "problems" && (
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-4">
            {problems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                 <div className="text-green-500/20"><AlertCircle size={40}/></div>
                 <p>No problems detected.</p>
              </div>
            ) : (
              problems.map((p, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-[#1a1a1a]/50 border border-red-500/20 rounded-md mb-2 hover:bg-[#1a1a1a] transition-colors cursor-pointer group">
                  <XCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                  <div>
                    <div className="text-gray-200 font-medium text-sm">
                      {p.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-400">
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2a2a; border: 3px solid #0a0a0a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3a3a3a; }
      `}</style>
    </div>
  );
}