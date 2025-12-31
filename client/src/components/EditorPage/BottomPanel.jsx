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
    <div className="bg-[#071014] border-t border-[#0b1114]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#0b1114]">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("output")}
            className={`text-xs ${activeTab === "output" ? "text-white" : "text-gray-400"}`}
          >
            OUTPUT
          </button>
          <button
            onClick={() => setActiveTab("terminal")}
            className={`text-xs ${activeTab === "terminal" ? "text-white" : "text-gray-400"}`}
          >
            TERMINAL
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`text-xs ${activeTab === "problems" ? "text-white" : "text-gray-400"}`}
          >
            PROBLEMS
          </button>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <button
            title="Clear all"
            onClick={onClearAll}
            className="p-1 rounded hover:bg-[#0b1114]"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="h-48 flex">
        <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-sm p-3 text-gray-300 bg-[#071014]">
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
                    className="flex-1 bg-[#061219] px-3 py-2 rounded text-sm text-gray-100 focus:outline-none"
                    onKeyDown={(e) => e.key === "Enter" && onTerminalExecute()}
                  />
                  <button
                    onClick={onTerminalExecute}
                    className="px-3 py-2 bg-[#0f4f4a] rounded text-sm text-white "
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
                  <div key={idx} className="p-2 bg-[#0b1114] rounded mb-2">
                    <div className="text-sm text-gray-200">
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
