import { useState, useRef, useEffect } from "react";
import { X, ChevronRight, MessageCircle, Send, Plus, Sparkles } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function RightChatPanel({
  isOpen,
  onToggle,
  chatMode,
  setChatMode,
  chatMessages,
  chatInput,
  setChatInput,
  onChatSend,
  onTyping,
  typingUsers,
  onClearChat,
  myUserId,
  unseenCount,
}) {
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [selectedModel, setSelectedModel] = useState("GPT-5");
  const { isDark } = useTheme();

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showEmoji &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmoji]);
  
  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

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
    <div className={`w-96 border-l flex flex-col h-full relative ${
      isDark 
        ? 'bg-[#0a0a0a] border-[#1a1a1a]' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDark ? 'border-[#1a1a1a]' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {chatMode === "ai" ? "AI Assistant" : "Team Chat"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className={`p-1.5 rounded ${isDark ? 'hover:bg-[#1a1a1a] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <Plus size={16} />
          </button>
          <button
            className={`p-1.5 rounded ${isDark ? 'hover:bg-[#1a1a1a] text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            onClick={onToggle}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat Mode Toggle */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
        <div className={`flex gap-1 rounded-lg p-1 ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-100'}`}>
          <button
            onClick={() => setChatMode("ai")}
            className={`px-3 py-1 text-xs rounded-md transition ${
              chatMode === "ai"
                ? "bg-cyan-500/20 text-cyan-400"
                : `${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
            }`}
          >
            AI
          </button>

          <button
  onClick={() => setChatMode("team")}
  className={`relative px-3 py-1 text-xs rounded-md transition ${
    chatMode === "team"
      ? "bg-emerald-500/20 text-emerald-400"
      : `${isDark ? 'text-gray-500 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
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

      {/* Messages Area */}
      {/* Messages Area */}
<div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
  {chatMessages.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4">
        <Sparkles size={24} className="text-white" />
      </div>
      <div className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        How can I help you?
      </div>
      <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
        Ask me anything about your code
      </div>
    </div>
  ) : (
    chatMessages.map((m, i) => {
      const isMine =
        chatMode === "ai"
          ? m.role === "user"
          : m.senderId === myUserId;

      const isUnseen = !isMine && !m.seenBy?.includes(myUserId);

      return (
        <div
          key={m._id || i}
          className={`flex items-end gap-2 ${
            isMine ? "justify-end" : "justify-start"
          }`}
        >
          {/* Avatar (others only) */}
          {!isMine && chatMode === "team" && (
            <div className="relative">
              <img
                src={m.senderAvatar}
                alt={m.senderUsername}
                className="w-7 h-7 rounded-full object-cover"
              />
              {isUnseen && (
                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 ${isDark ? 'border-[#0a0a0a]' : 'border-white'}`}></span>
              )}
            </div>
          )}

          {/* Bubble */}
          <div
            className={`max-w-[75%] px-3 py-2 text-sm whitespace-pre-wrap ${
              isMine
                ? "bg-emerald-600 text-white rounded-2xl rounded-br-sm"
                : isUnseen
                ? "bg-blue-600/30 text-gray-100 rounded-2xl rounded-bl-sm border border-blue-500/50"
                : `${isDark ? 'bg-[#1a1a1a] text-gray-200' : 'bg-gray-100 text-gray-800'} rounded-2xl rounded-bl-sm`
            }`}
          >
            {/* Username (others only) */}
            {!isMine && chatMode === "team" && (
              <div className="text-[11px] text-emerald-400 mb-0.5">
                {m.senderUsername}
              </div>
            )}

            <div className="flex items-end gap-1">
              <span>{m.text}</span>

              {m.createdAt && (
                <span className="text-[10px] text-gray-300 ml-2">
                  {formatTime(m.createdAt)}
                </span>
              )}
              
              {/* Checkmarks for sent messages in team mode */}
              {isMine && chatMode === "team" && (
                <span
                  className={`text-[11px] ml-1 ${
                    (m.seenBy?.length || 0) > 1
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {(m.seenBy?.length || 0) > 1 ? "✓✓" : "✓"}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    })
  )}
  <div ref={messagesEndRef} />
</div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && chatMode === "team" && (
        <div className={`px-4 pb-2 text-xs italic ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {typingUsers[0]} is typing…
        </div>
      )}

      {/* Emoji Picker - Positioned outside the input container */}
      {showEmoji && (
        <div 
          ref={emojiPickerRef}
          className="absolute bottom-24 left-4 z-50 shadow-xl rounded-lg"
        >
          <EmojiPicker
            theme={isDark ? "dark" : "light"}
            width={300}
            height={350}
            searchPlaceHolder="Search emoji..."
            previewConfig={{ showPreview: false }}
            onEmojiClick={(emojiData) => {
              setChatInput(prev => prev + emojiData.emoji);
            }}
          />
        </div>
      )}

      {/* Input Area */}
      <div className={`border-t p-4 ${isDark ? 'border-[#1a1a1a]' : 'border-gray-200'}`}>
        <div className={`rounded-xl border overflow-hidden ${
          isDark 
            ? 'bg-[#0f0f0f] border-[#1a1a1a]' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="px-4 py-3">
            <textarea
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                onTyping();
              }}
              placeholder="Plan, search, build anything..."
              className={`w-full bg-transparent text-sm focus:outline-none resize-none ${
                isDark 
                  ? 'text-gray-300 placeholder:text-gray-600' 
                  : 'text-gray-700 placeholder:text-gray-400'
              }`}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onChatSend();
                }
              }}
            />
          </div>
          
          <div className={`px-4 py-2 border-t flex items-center justify-between ${
            isDark ? 'border-[#1a1a1a]' : 'border-gray-200'
          }`}>
            <div className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              {chatMode === "ai" && (
                <>
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                    Agent
                  </span>
                  
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className={`bg-transparent text-xs focus:outline-none cursor-pointer ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    <option value="GPT-5">GPT-5</option>
                    <option value="GPT-4">GPT-4</option>
                    <option value="Claude">Claude</option>
                    <option value="Gemini">Gemini</option>
                  </select>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                ref={emojiButtonRef}
                className={`p-1.5 rounded transition-colors ${
                  showEmoji 
                    ? 'text-cyan-400 bg-cyan-400/10' 
                    : isDark 
                      ? 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setShowEmoji(prev => !prev)}
                title="Emoji"
              >
                <Smile size={16} />
              </button>

              <button
                className={`p-1.5 text-cyan-400 hover:text-cyan-300 rounded ${isDark ? 'hover:bg-[#1a1a1a]' : 'hover:bg-gray-200'}`}
                onClick={onChatSend}
                title="Send"
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