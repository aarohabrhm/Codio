import { useState, useRef, useEffect } from "react";
import { X, ChevronRight, MessageCircle, Send, Plus, Sparkles } from "lucide-react";

export default function RightChatPanel({
  isOpen,
  onToggle,
  chatMessages,
  chatInput,
  setChatInput,
  onChatSend,
  onClearChat,
}) {
  const messagesEndRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState("GPT-5");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  // When closed, render nothing (chat opens from toolbar button)
  if (!isOpen) {
    return null;
  }

  // Expanded state - full chat panel
  return (
    <div className="w-96 bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">New chat</span>
          <X size={14} className="text-gray-500" />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-[#1a1a1a] rounded text-gray-400">
            <Plus size={16} />
          </button>
          <button
            className="p-1.5 hover:bg-[#1a1a1a] rounded text-gray-400"
            onClick={onToggle}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {chatMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="text-lg font-medium text-white mb-2">How can I help you?</div>
            <div className="text-sm text-gray-500">Ask me anything about your code</div>
          </div>
        ) : (
          chatMessages.map((m, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="text-[11px] font-medium text-gray-500">
                {m.role === "assistant" ? "Codio AI" : "You"}
              </div>
              <div
                className={`text-sm leading-relaxed rounded-lg px-3 py-2 max-w-full whitespace-pre-wrap ${
                  m.role === "assistant"
                    ? "bg-[#1a1a1a] text-gray-200"
                    : "bg-[#0f2a1a] text-green-100 border border-[#1a3a2a]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-[#1a1a1a] p-4">
        <div className="bg-[#0f0f0f] rounded-xl border border-[#1a1a1a] overflow-hidden">
          
          <div className="px-4 py-3">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Plan, search, build anything..."
              className="w-full bg-transparent text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onChatSend();
                }
              }}
            />
          </div>
          <div className="px-4 py-2 border-t border-[#1a1a1a] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                Agent
              </span>
              
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-transparent text-gray-400 text-xs focus:outline-none cursor-pointer"
              >
                <option value="GPT-5">GPT-5</option>
                <option value="GPT-4">GPT-4</option>
                <option value="Claude">Claude</option>
                <option value="Gemini">Gemini</option>
              </select>
              
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-[#1a1a1a]"
                onClick={onClearChat}
                title="Clear chat"
              >
                <MessageCircle size={14} />
              </button>
              <button
                className="p-1.5 text-cyan-400 hover:text-cyan-300 rounded hover:bg-[#1a1a1a]"
                onClick={onChatSend}
                title="Send message"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
