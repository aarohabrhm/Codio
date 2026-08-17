import { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Smile, Copy, Check } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

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
  openai:    "text-ok",
  anthropic: "text-danger",
  gemini:    "text-accent-fg",
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
    <div className={`rounded-lg overflow-hidden my-2 border border-line-strong`}>
      <div className={`flex items-center justify-between px-3 py-1.5 bg-surface-raised`}>
        <span className="text-xs text-dim font-mono">{language}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`text-xs flex items-center gap-1 transition-colors text-dim hover:text-primary`}
          >
            {copied ? <Check size={12} className="text-ok" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          {onApply && (
            <button
              onClick={handleApply}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                applied
                  ? "bg-ok text-accent-on"
                  : "bg-ok hover:bg-ok text-accent-on"
              }`}
            >
              {applied ? "✓ Applied" : "Apply"}
            </button>
          )}
        </div>
      </div>
      <pre className={`p-3 text-xs font-mono overflow-x-auto bg-surface-panel text-dim`}>
        <code>{content}</code>
      </pre>
    </div>
  );
}

function MessageBubble({ message, isMine, chatMode, myUserId, onApply }) {
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (chatMode === "ai" && !isMine) {
    const parts = extractCodeBlocks(message.content || message.text || "");
    return (
      <div className="flex items-start gap-2 justify-start">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-surface-raised`}>
          <Sparkles size={14} className="text-accent-fg" />
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
              <p key={i} className={`text-sm whitespace-pre-wrap leading-relaxed text-dim`}>
                {part.content}
              </p>
            )
          )}
          {message.createdAt && (
            <span className="text-[10px] text-muted mt-1 block">
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
            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface-page`} />
          )}
        </div>
      )}
      <div className={`max-w-[75%] px-3 py-2 text-sm whitespace-pre-wrap ${
        isMine
          ? "bg-ok text-accent-on rounded-2xl rounded-br-sm"
          : isUnseen
          ? "bg-accent/30 text-primary rounded-2xl rounded-bl-sm border border-accent/50"
          : `bg-surface-raised text-primary rounded-2xl rounded-bl-sm`
      }`}>
        {!isMine && chatMode === "team" && (
          <div className="font-mono text-[11px] text-ok mb-0.5">{message.senderUsername}</div>
        )}
        <div className="flex items-end gap-1 flex-wrap">
          <span>{message.text || message.content}</span>
          {message.createdAt && (
            <span className="font-mono text-[10px] text-dim ml-2">{formatTime(message.createdAt)}</span>
          )}
          {isMine && chatMode === "team" && (
            <span className={`text-[11px] ml-1 ${(message.seenBy?.length || 0) > 1 ? "text-accent-fg" : "text-dim"}`}>
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
  // still needed: EmojiPicker takes a light/dark theme string, not classes
  const { isDark } = useTheme();
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].value);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);

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
    <div className={`w-96 border-l flex flex-col h-full relative bg-surface-page border-line`}>

      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-line`}>
        <span className={`text-sm font-medium text-primary`}>
          {chatMode === "ai" ? "AI Assistant" : "Team Chat"}
        </span>
        <div className="flex items-center gap-2">
          {chatMode === "ai" && aiMessages.length > 0 && (
            <button
              onClick={() => setAiMessages([])}
              className={`text-xs px-2 py-1 rounded text-dim hover:bg-surface-raised`}
            >
              Clear
            </button>
          )}
          <button
            onClick={onToggle}
            className={`p-1.5 rounded hover:bg-surface-raised text-dim`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className={`px-4 py-3 border-b border-line`}>
        <div className={`flex gap-1 rounded-lg p-1 bg-surface-panel`}>
          <button
            onClick={() => setChatMode("ai")}
            className={`flex-1 px-3 py-1 text-xs rounded-md transition ${
              chatMode === "ai"
                ? "bg-accent/20 text-accent-fg"
                : `text-muted hover:text-primary`
            }`}
          >
            AI
          </button>
          <button
            onClick={() => setChatMode("team")}
            className={`relative flex-1 px-3 py-1 text-xs rounded-md transition ${
              chatMode === "team"
                ? "bg-ok/20 text-ok"
                : `text-muted hover:text-primary`
            }`}
          >
            Team
            {chatMode !== "team" && unseenCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger text-accent-on text-[9px] font-semibold rounded-full flex items-center justify-center">
                {unseenCount > 9 ? "9+" : unseenCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active file indicator */}
      {chatMode === "ai" && activeFile && (
        <div className={`px-4 py-2 border-b flex items-center gap-2 border-line bg-surface-panel`}>
          <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
          <span className={`text-xs truncate text-dim`}>
            Context: <span className={"text-primary"}>{activeFile.name}</span>
          </span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 custom-scrollbar">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-surface-raised to-surface-hover flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-accent-on" />
            </div>
            <div className={`text-lg font-medium mb-2 text-primary`}>
              {chatMode === "ai" ? "How can I help?" : "No messages yet"}
            </div>
            <div className={`text-sm text-muted`}>
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
                onApply={handleApplyCode}
              />
            );
          })
        )}

        {isAiLoading && (
          <div className="flex items-start gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-surface-raised`}>
              <Sparkles size={14} className="text-accent-fg animate-pulse" />
            </div>
            <div className={`px-3 py-2 rounded-2xl rounded-bl-sm text-sm bg-surface-raised text-dim`}>
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: "0ms" }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: "150ms" }}>•</span>
                <span className="animate-bounce" style={{ animationDelay: "300ms" }}>•</span>
              </span>
            </div>
          </div>
        )}

        {typingUsers.length > 0 && chatMode === "team" && (
          <div className={`text-xs italic text-dim`}>
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
      <div className={`border-t p-4 border-line`}>
        <div className={`rounded-xl border overflow-hidden bg-surface-panel border-line`}>
          <div className="px-4 py-3">
            <textarea
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                if (chatMode === "team") onTyping();
              }}
              placeholder={chatMode === "ai" ? "Ask about your code..." : "Message your team..."}
              className={`w-full bg-transparent text-sm focus:outline-none resize-none text-dim placeholder:text-muted`}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <div className={`px-4 py-2 border-t flex items-center justify-between border-line`}>
            <div className="flex items-center gap-2">
              {chatMode === "ai" && (
                <>
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={`text-xs rounded px-1.5 py-1 focus:outline-none bg-surface-raised text-dim border border-line-strong`}
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
                    ? "text-accent-fg bg-accent/10"
                    : "text-dim hover:text-primary hover:bg-surface-raised"
                }`}
              >
                <Smile size={16} />
              </button>
              <button
                onClick={handleSend}
                disabled={isAiLoading}
                className="p-1.5 text-accent-fg hover:text-accent-fg rounded disabled:opacity-50"
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--line-strong); border-radius: 4px; }
      `}</style>
    </div>
  );
}