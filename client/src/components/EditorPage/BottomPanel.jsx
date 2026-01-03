import { RefreshCw } from "lucide-react";

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
    <div className="bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("output")}
            className={`text-xs tracking-wide pb-1 border-b-2 ${activeTab === "output" ? "text-white border-cyan-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}
          >
            OUTPUT
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`text-xs tracking-wide pb-1 border-b-2 ${activeTab === "terminal" ? "text-white border-cyan-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`text-xs tracking-wide pb-1 border-b-2 ${activeTab === "problems" ? "text-white border-cyan-400" : "text-gray-500 border-transparent hover:text-gray-300"}`}
          >
            PROBLEMS
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <button
            title="Clear all"
            onClick={onClearAll}
            className="p-2 rounded-md hover:bg-[#1a1a1a]"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="h-48 flex">
        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-sm p-4 text-gray-200 bg-[#0a0a0a]">
          {activeTab === "output" && (
            <div className="space-y-1">
              {consoleOutput.length ? (
                consoleOutput.map((l, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {l}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No output yet</div>
              )}
            </div>
          )}

          {activeTab === "terminal" && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-auto space-y-1">
                {terminalOutput.map((line, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Run a command..."
                    className="flex-1 bg-[#0f0f0f] px-3 py-2 rounded-md text-sm text-gray-100 border border-[#2a2a2a] focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                    onKeyDown={(e) => e.key === "Enter" && onTerminalExecute()}
                  />
                  <button
                    onClick={onTerminalExecute}
                    className="px-3 py-2 bg-gradient-to-r from-cyan-500 to-teal-400 rounded-md text-sm font-semibold text-black shadow hover:opacity-90 transition-opacity"
                  >
                    Run
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "problems" && (
            <div>
              {problems.length === 0 ? (
                <div className="text-gray-500">No problems found</div>
              ) : (
                problems.map((p, idx) => (
                  <div key={idx} className="p-3 bg-[#0f0f0f] rounded-lg mb-2 border border-[#2a2a2a]">
                    <div className="text-sm text-gray-100">
                      {files?.[p.file]?.name || "unknown"}
                    </div>
                    <div className="text-xs text-gray-400">
                      Line {p.line} • {p.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="w-0" />
      </div>
    </div>
  );
}
