import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Smile, Copy, Check } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";

const MODELS = [
  { label: "GPT-4o",            value: "gpt-4o",            provider: "openai" },
  { label: "GPT-4",             value: "gpt-4",             provider: "openai" },
  { label: "GPT-3.5",           value: "gpt-3.5-turbo",     provider: "openai" },
  { label: "Claude Sonnet",     value: "claude-3-5-sonnet-20241022", provider: "anthropic" },
  { label: "Claude Haiku",      value: "claude-3-haiku-20240307",    provider: "anthropic" },
  { label: "Gemini 2.5 Flash",  value: "gemini-2.5-flash",  provider: "gemini" },
  { label: "Gemini 2.5 Pro",    value: "gemini-2.5-pro",    provider: "gemini" },
  { label: "Gemini 2.0 Flash",  value: "gemini-2.0-flash",  provider: "gemini" },
  { label: "Gemini 2.0 Lite",   value: "gemini-2.0-flash-lite", provider: "gemini" },
];

const PROVIDER_COLORS = {
  openai:    "text-green-400",
  anthropic: "text-orange-400",
  gemini:    "text-blue-400",
};

function extractCodeBlocks(text) {
  const parts = [];
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", language: match[1] || "plaintext", content: match[2].trimEnd() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", content: text.slice(lastIndex) });
  }

  return parts;
}

function CodeBlock({ language, content, onApply }) {
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);
  const { isDark } = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    onApply?.(content);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  return (
    <div className={`rounded-lg overflow-hidden my-2 border ${isDark ? "border-[#2a2a2a]" : "border-gray-200"}`}>
      <div className={`flex items-center justify-between px-3 py-1.5 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}>
        <span className="text-xs text-gray-400 font-mono">{language}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`text-xs flex items-center gap-1 transition-colors ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"}`}
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          {onApply && (
            <button
              onClick={handleApply}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                applied
                  ? "bg-green-600 text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {applied ? "✓ Applied" : "Apply"}
            </button>
          )}
        </div>
      </div>
      <pre className={`p-3 text-xs font-mono overflow-x-auto ${isDark ? "bg-[#0f0f0f] text-gray-300" : "bg-gray-50 text-gray-800"}`}>
        <code>{content}</code>
      </pre>
    </div>
  );
}

function MessageBubble({ message, isMine, chatMode, myUserId, isDark, onApply }) {
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (chatMode === "ai" && !isMine) {
    const parts = extractCodeBlocks(message.content || message.text || "");
    return (
      <div className="flex items-start gap-2 justify-start">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}>
          <Sparkles size={14} className="text-cyan-400" />
        </div>
        <div className="max-w-[85%]">
          {parts.map((part, i) =>
            part.type === "code" ? (
              <CodeBlock
                key={i}
                language={part.language}
                content={part.content}
                onApply={onApply}
              />
            ) : (
              <p key={i} className={`text-sm whitespace-pre-wrap leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {part.content}
              </p>
            )
          )}
          {message.createdAt && (
            <span className="text-[10px] text-gray-500 mt-1 block">
              {formatTime(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    );
  }

  const isUnseen = !isMine && !message.seenBy?.includes(myUserId);
  return (
    <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}>
      {!isMine && chatMode === "team" && (
        <div className="relative">
          <img
            src={message.senderAvatar}
            alt={message.senderUsername}
            className="w-7 h-7 rounded-full object-cover"
          />
          {isUnseen && (
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${isDark ? "border-[#0a0a0a]" : "border-white"}`} />
          )}
        </div>
      )}
      <div className={`max-w-[75%] px-3 py-2 text-sm whitespace-pre-wrap ${
        isMine
          ? "bg-emerald-600 text-white rounded-2xl rounded-br-sm"
          : isUnseen
          ? "bg-blue-600/30 text-gray-100 rounded-2xl rounded-bl-sm border border-blue-500/50"
          : `${isDark ? "bg-[#1a1a1a] text-gray-200" : "bg-gray-100 text-gray-800"} rounded-2xl rounded-bl-sm`
      }`}>
        {!isMine && chatMode === "team" && (
          <div className="text-[11px] text-emerald-400 mb-0.5">{message.senderUsername}</div>
        )}
        <div className="flex items-end gap-1 flex-wrap">
          <span>{message.text || message.content}</span>
          {message.createdAt && (
            <span className="text-[10px] text-gray-300 ml-2">{formatTime(message.createdAt)}</span>
          )}
          {isMine && chatMode === "team" && (
            <span className={`text-[11px] ml-1 ${(message.seenBy?.length || 0) > 1 ? "text-blue-400" : "text-gray-400"}`}>
              {(message.seenBy?.length || 0) > 1 ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RightChatPanel({
  isOpen,
  onToggle,
  chatMode,
  setChatMode,
  chatMessages,
  setChatMessages,
  chatInput,
  setChatInput,
  onChatSend,
  onTyping,
  typingUsers,
  onClearChat,
  myUserId,
  unseenCount,
  activeFile,
  editorRef,
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmoji &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) setShowEmoji(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiMessages, chatMessages]);

  const selectedModelMeta = MODELS.find(m => m.value === selectedModel);

  const handleApplyCode = (code) => {
    if (!editorRef?.current) return;
    if (typeof editorRef.current.applyDiff === "function") {
      editorRef.current.applyDiff(code);
    }
  };

  const handleAiSend = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const userMessage = {
      role: "user",
      content: chatInput.trim(),
      createdAt: new Date(),
    };

    const updatedMessages = [...aiMessages, userMessage];
    setAiMessages(updatedMessages);
    setChatInput("");
    setIsAiLoading(true);

    try {
      const activeFileContext = activeFile && editorRef?.current
        ? {
            name: activeFile.name,
            language: activeFile.name.split(".").pop(),
            content: editorRef.current.getContent?.() || activeFile.content || "",
          }
        : null;

      const res = await axios.post(
        "http://localhost:8000/api/ai/chat",
        {
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          model: selectedModel,
          activeFile: activeFileContext,
        },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem("accessToken") ||
              sessionStorage.getItem("accessToken")
            }`,
          },
        }
      );

      setAiMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: res.data.reply,
          createdAt: new Date(),
        },
      ]);
    } catch (err) {
      setAiMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: `❌ Error: ${err.response?.data?.message || err.message}`,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSend = () => {
    if (chatMode === "ai") handleAiSend();
    else onChatSend();
  };

  const displayMessages = chatMode === "ai" ? aiMessages : chatMessages;

  if (!isOpen) return null;

  return (
    <div className={`w-96 border-l flex flex-col h-full relative ${isDark ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-white border-gray-200"}`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}>
        <span className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
          {chatMode === "ai" ? "AI Assistant" : "Team Chat"}
        </span>
        <div className="flex items-center gap-2">
          {chatMode === "ai" && aiMessages.length > 0 && (
            <button
              onClick={() => setAiMessages([])}
              className={`text-xs px-2 py-1 rounded ${isDark ? "text-gray-400 hover:bg-[#1a1a1a]" : "text-gray-500 hover:bg-gray-100"}`}
            >
              Clear
            </button>
          )}
          <button
            onClick={onToggle}
            className={`p-1.5 rounded ${isDark ? "hover:bg-[#1a1a1a] text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className={`px-4 py-3 border-b ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}>
        <div className={`flex gap-1 rounded-lg p-1 ${isDark ? "bg-[#0f0f0f]" : "bg-gray-100"}`}>
          <button
            onClick={() => setChatMode("ai")}
            className={`flex-1 px-3 py-1 text-xs rounded-md transition ${
              chatMode === "ai"
                ? "bg-cyan-500/20 text-cyan-400"
                : `${isDark ? "text-gray-500 hover:text-white" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setChatMode("team")}
            className={`relative flex-1 px-3 py-1 text-xs rounded-md transition ${
              chatMode === "team"
                ? "bg-emerald-500/20 text-emerald-400"
                : `${isDark ? "text-gray-500 hover:text-white" : "text-gray-500 hover:text-gray-700"}`
            }`}
          >
            Team
            {chatMode !== "team" && unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-semibold rounded-full flex items-center justify-center">
                {unseenCount > 9 ? "9+" : unseenCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active file indicator */}
      {chatMode === "ai" && activeFile && (
        <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? "border-[#1a1a1a] bg-[#0f0f0f]" : "border-gray-200 bg-gray-50"}`}>
          <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
          <span className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Context: <span className={isDark ? "text-gray-200" : "text-gray-700"}>{activeFile.name}</span>
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className={`text-lg font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
              {chatMode === "ai" ? "How can I help?" : "No messages yet"}
            </div>
            <div className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
              {chatMode === "ai"
                ? activeFile
                  ? `I can see ${activeFile.name} — ask me anything about it`
                  : "Open a file for code-aware assistance"
                : "Start a conversation with your team"}
            </div>
          </div>
        ) : (
          displayMessages.map((m, i) => {
            const isMine = chatMode === "ai"
              ? m.role === "user"
              : m.senderId === myUserId;
            return (
              <MessageBubble
                key={m._id || i}
                message={m}
                isMine={isMine}
                chatMode={chatMode}
                myUserId={myUserId}
                isDark={isDark}
                onApply={handleApplyCode}
              />
            );
          })
        )}

        {isAiLoading && (
          <div className="flex items-start gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isDark ? "bg-[#1a1a1a]" : "bg-gray-100"}`}>
              <Sparkles size={14} className="text-cyan-400 animate-pulse" />
            </div>
            <div className={`px-3 py-2 rounded-2xl rounded-bl-sm text-sm ${isDark ? "bg-[#1a1a1a] text-gray-400" : "bg-gray-100 text-gray-500"}`}>
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
              </span>
            </div>
          </div>
        )}

        {typingUsers.length > 0 && chatMode === "team" && (
          <div className={`text-xs italic ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {typingUsers[0]} is typing…
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      {showEmoji && (
        <div ref={emojiPickerRef} className="absolute bottom-24 left-4 z-50 shadow-xl rounded-lg">
          <EmojiPicker
            theme={isDark ? "dark" : "light"}
            width={300}
            height={350}
            searchPlaceHolder="Search emoji..."
            previewConfig={{ showPreview: false }}
            onEmojiClick={(emojiData) => setChatInput(prev => prev + emojiData.emoji)}
          />
        </div>
      )}

      {/* Input */}
      <div className={`border-t p-4 ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}>
        <div className={`rounded-xl border overflow-hidden ${isDark ? "bg-[#0f0f0f] border-[#1a1a1a]" : "bg-gray-50 border-gray-200"}`}>
          <div className="px-4 py-3">
            <textarea
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                if (chatMode === "team") onTyping();
              }}
              placeholder={chatMode === "ai" ? "Ask about your code..." : "Message your team..."}
              className={`w-full bg-transparent text-sm focus:outline-none resize-none ${isDark ? "text-gray-300 placeholder:text-gray-600" : "text-gray-700 placeholder:text-gray-400"}`}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <div className={`px-4 py-2 border-t flex items-center justify-between ${isDark ? "border-[#1a1a1a]" : "border-gray-200"}`}>
            <div className="flex items-center gap-2">
              {chatMode === "ai" && (
                <>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={`text-xs rounded px-1.5 py-1 focus:outline-none ${isDark ? "bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]" : "bg-white text-gray-600 border border-gray-200"}`}
                  >
                    {MODELS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                  {selectedModelMeta && (
                    <span className={`text-[10px] ${PROVIDER_COLORS[selectedModelMeta.provider]}`}>
                      {selectedModelMeta.provider}
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                ref={emojiButtonRef}
                onClick={() => setShowEmoji(prev => !prev)}
                className={`p-1.5 rounded transition-colors ${
                  showEmoji
                    ? "text-cyan-400 bg-cyan-400/10"
                    : isDark
                    ? "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Smile size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={isAiLoading}
                className="p-1.5 text-cyan-400 hover:text-cyan-300 rounded disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? "#2a2a2a" : "#d1d5db"}; border-radius: 4px; }
      `}</style>
    </div>
  );
}