import React, { useEffect, useRef, useState } from "react";
import ChatApiService from "@/utils/chats.api.utils";

import { Message } from "@/types";
// export default function ChatWindow({ chatId, tripId, onClose }) {
export default function ChatWindow({ chatId, currentUserId }: { chatId: string, currentUserId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const msgsRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    loadMessages();
    // optionally subscribe to websockets
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await ChatApiService.fetchMessages(chatId);
      setMessages(msgs || []);
      setTimeout(() => scrollToBottom(), 50);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally { setLoading(false); }
  };

  const scrollToBottom = () => {
    if (!msgsRef.current) return;
    msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const saved = await ChatApiService.sendMessage({ chatId, content: input.trim() });
      setMessages((s) => [...s, saved]);
      setInput("");
      setTimeout(() => scrollToBottom(), 30);
    } catch (err) {
      console.error("send failed", err);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] md:h-[80vh]">
      <div ref={msgsRef} className="flex-1 overflow-auto p-4 space-y-3 bg-white">
        {loading && <div className="text-sm text-gray-400">Loading messages...</div>}
        {messages.map((m) => (
          <div key={m.id } className={`max-w-[70%] p-2 rounded ${m.sender === currentUserId ? "ml-auto bg-blue-100" : "bg-gray-100"}`}>
            <div className="text-sm">{m.content}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2 items-center">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
          className="flex-1 border rounded px-3 py-2"
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        />
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
