import React, { useEffect, useRef, useState } from "react";
import ChatApiService from "@/utils/chats.api.utils";
import { Message } from "@/types";

import "../../../styles/chats/chats.css"
type Props = {
  chatId: string;
  currentUserId: string;
};

export default function ChatWindow({ chatId, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // measure composer height so we can add bottom padding to messages container
  const [composerHeight, setComposerHeight] = useState<number>(72); // default

  // fetch messages on chat change
  useEffect(() => {
    if (!chatId) return;
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // attach resize observer to composer to update padding
  useEffect(() => {
    if (!composerRef.current) return;
    const ro = new ResizeObserver(() => {
      setComposerHeight(composerRef.current?.offsetHeight || 72);
    });
    ro.observe(composerRef.current);
    // initial
    setComposerHeight(composerRef.current?.offsetHeight || 72);
    return () => ro.disconnect();
  }, [composerRef.current]);

  useEffect(() => {
    // whenever messages change scroll to bottom
    scrollToBottom();
    // small timeout to ensure browser layouts are done
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await ChatApiService.fetchMessages(chatId);
      setMessages(Array.isArray(msgs) ? msgs : []);
      // ensure bottom visible
      setTimeout(() => scrollToBottom(), 80);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (!msgsRef.current) return;
    // scroll smoothly to bottom (immediate for keyboard)
    msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  };

  // handle textarea autosize (max rows)
  const autoSizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxHeight = 160; // px (approx 5 rows)
    ta.style.height = `50px`;
    // update composer height manually in case observer doesn't fire immediately
    setComposerHeight(composerRef.current?.offsetHeight || 72);
  };

  // run autosize when input changes
  useEffect(() => autoSizeTextarea(), [input]);

  const handleSend = async () => {
    if (!input.trim()) return;
    try {
      const saved: Message = await ChatApiService.sendMessage({ chatId, content: input.trim() });
      setMessages((s) => [...s, saved]);
      setInput("");
      // reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
      setTimeout(() => scrollToBottom(), 40);
    } catch (err) {
      console.error("send failed", err);
    }
  };

  // keyboard / focus helpers for mobile UX
  const onFocusInput = () => {
    // ensure we scroll last message into view when keyboard open
    setTimeout(scrollToBottom, 250);
  };

  return (
    // Use a container that is responsive: on mobile we want nearly full viewport height,
    // on desktop we allow parent to control. If parent sets a height, internal layout remains fine.
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[80vh]"> 
      {/* messages area */}
      <div
        ref={msgsRef}
        className="flex-1 overflow-auto p-4 bg-white"
        // give extra bottom padding equal to composer height so last messages don't hide behind composer
        style={{ paddingBottom: composerHeight + 12 }}
      >
        {loading && <div className="text-sm text-gray-400">Loading messages...</div>}

        <div className="flex flex-col gap-3">
          {messages.map((m) => {
            const mine = m.sender === currentUserId || (m.sender as any)?.id === currentUserId;
            // message bubble classes
            const bubbleBase =
              "";
            const bubbleCls = mine
              ? `${bubbleBase} myMessage`
              : `${bubbleBase} otherPersonMessage`;

            // responsive max widths
            const containerCls = mine ? "flex justify-end" : "flex justify-start";
            const maxW = "max-w-[80%] md:max-w-[60%] lg:max-w-[50%]";

            return (
              <div key={m.id} className={`${containerCls} px-2`}>
                <div className={`${bubbleCls} ${maxW}`}>
                  <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                  <div className={`text-[10px] mt-1 ${mine ? "mineTimeInfoText" : "otherTimeInfoText"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* composer - sticky at bottom of container */}
      <div
        ref={composerRef}
        className="sticky bottom-0 bg-white border-t px-3 py-2 flex items-end gap-2"
        // ensure composer respects iPhone safe area
        style={{ paddingBottom: "env(safe-area-inset-bottom)", zIndex: 10 }}
      >
        {/* optional attachment / emoji button
        <button
          type="button"
          className="p-2 rounded-md hover:bg-gray-100 active:bg-gray-200"
          aria-label="Attach"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
            <path d="M16.5 6.5L7.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M20.5 12.5V18.5C20.5 19.0523 20.0523 19.5 19.5 19.5H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button> */}

        {/* growing textarea */}
        <div className="flex align-items-center flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onInput={autoSizeTextarea}
            onChange={(e) => setInput(e.target.value)}
            onFocus={onFocusInput}
            rows={1}
            placeholder="Type a message"
            className="w-full resize-none overflow-auto text-sm leading-5 rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            style={{ maxHeight: 160 }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSend}
            className={`btn ${
              input.trim() ? "btn-secondary" : "btn-secondary-outline"
            }`}
            disabled={!input.trim()}
            aria-label="Send"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
