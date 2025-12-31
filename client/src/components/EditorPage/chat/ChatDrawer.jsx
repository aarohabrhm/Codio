import { X } from "lucide-react";
import { useState } from "react";

export default function ChatDrawer({ open, messages, onSend, onClose }) {
  const [input, setInput] = useState("");

  if (!open) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-[#020617]">
      <div className="flex justify-between p-3">
        <span>AI Assistant</span>
        <X onClick={onClose} />
      </div>

      <div className="p-3 space-y-2">
        {messages.map((m, i) => <div key={i}>{m.text}</div>)}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend(input)}
        className="w-full p-2 bg-black"
      />
    </div>
  );
}
