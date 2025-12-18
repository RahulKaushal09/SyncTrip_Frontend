// ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import ChatApiService from "@/utils/chats.api.utils";
import { Message } from "@/types";
import { StorageUtils } from "@/utils";
import { getSocket } from "@/utils/socket";

import "../../../styles/chats/chats.css";

type Props = {
  chatId: string;
  currentUserId: string;
};

export default function ChatWindow({ chatId, currentUserId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState<{ userId: string } | null>(null);

  const msgsRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const stopTypingTimerRef = useRef<number | null>(null);
  const lastMessageIds = useRef<Set<string>>(new Set());

  // measure composer height so we can add bottom padding to messages container
  const [composerHeight, setComposerHeight] = useState<number>(72); // default

  /* ------------------ Socket: connect once ------------------ */
  useEffect(() => {
  const socket = getSocket();

  const onReceiveMessage = (message: Message) => {
    if (!message?.id) return;
    if (message.chat !== chatId) return;

    if (lastMessageIds.current.has(message.id)) return;
    lastMessageIds.current.add(message.id);

    setMessages((prev) => [...prev, message]);
    setTimeout(scrollToBottom, 40);
  };

  const onTyping = ({ chatId: cId, userId }) => {
    if (cId === chatId && userId !== currentUserId) {
      setRemoteTyping({ userId });
    }
  };

  const onStopTyping = ({ chatId: cId }) => {
    if (cId === chatId) setRemoteTyping(null);
  };

  socket.on("receive_message", onReceiveMessage);
  socket.on("typing", onTyping);
  socket.on("stop_typing", onStopTyping);

  return () => {
    socket.off("receive_message", onReceiveMessage);
    socket.off("typing", onTyping);
    socket.off("stop_typing", onStopTyping);
  };
}, [chatId, currentUserId]);


  /* ------------------ Join/leave chat when chatId changes ------------------ */
  useEffect(() => {
  const socket = getSocket();

  lastMessageIds.current = new Set();

  if (chatId) {
    socket.emit("join_chat", chatId);
    loadMessages();

    // 🔥 mark messages read
    // socket.emit("mark_read", { chatId });
  }

  return () => {
    if (chatId) socket.emit("leave_chat", chatId);
    setRemoteTyping(null);
  };
}, [chatId]);

  /* ------------------ Typing emitter (debounced stop) ------------------ */
  const emitTyping = () => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("typing", chatId);
    if (stopTypingTimerRef.current) {
      window.clearTimeout(stopTypingTimerRef.current);
    }
    stopTypingTimerRef.current = window.setTimeout(() => {
      socket.emit("stop_typing", chatId);
      stopTypingTimerRef.current = null;
    }, 1500);
  };

  /* ------------------ Messages loading & dedupe init ------------------ */
  const loadMessages = async () => {
    setLoading(true);
    try {
      const msgs = await ChatApiService.fetchMessages(chatId);
      getSocket().emit("mark_read", { chatId });
      const arr = Array.isArray(msgs) ? msgs : [];
      setMessages(arr);

      // init dedupe with loaded messages' ids
      const ids = new Set(arr.map((m) => m.id));
      lastMessageIds.current = ids;

      // give UI time to layout
      setTimeout(() => scrollToBottom(), 80);

      // optional: tell server we have read messages on open (you can implement mark-read endpoint or socket)
      // e.g., socketRef.current?.emit('mark_read', { chatId });
    } catch (err) {
      console.error("Failed to load messages", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Send message (REST) + dedupe update ------------------ */
  // const handleSend = async () => {
  //   if (!input.trim() || !chatId) return;

  //   const content = input.trim();
  //   try {
  //     // Option A (recommended): use REST endpoint (server will persist and emit via req.io)
  //     const saved: Message = await ChatApiService.sendMessage({ chatId, content });

  //     // add saved.id to dedupe set immediately so socket broadcast doesn't duplicate
  //     // if (saved && saved.id) lastMessageIds.current.add(saved.id);
  //     if (saved && saved.id) {
  //     if (!lastMessageIds.current.has(saved.id)) {
  //       lastMessageIds.current.add(saved.id);
  //       setMessages((s) => [...s, saved]);
  //     } else {
  //       // socket already handled it — nothing to do (optional: update existing pending state)
  //       // console.debug("message already received via socket, skipping append", saved.id);
  //     }
  //   }

  //     // append saved message to UI
  //     // setMessages((s) => [...s, saved]);

  //     // clear composer
  //     setInput("");
  //     if (textareaRef.current) {
  //       textareaRef.current.style.height = "auto";
  //     }

  //     setTimeout(() => scrollToBottom(), 40);
  //   } catch (err) {
  //     console.error("send failed", err);
  //     // you could show a toast here
  //   }
  // };
  const handleSend = () => {
  if (!input.trim() || !chatId) return;

  getSocket().emit("send_message", {
    chatId,
    content: input.trim(),
  });

  setInput("");
  textareaRef.current!.style.height = "auto";
};

  /* ------------------ Scroll helpers ------------------ */
  const scrollToBottom = () => {
    if (!msgsRef.current) return;
    // immediate scroll
    msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  };

  /* ------------------ Composer autosize ------------------ */
  const autoSizeTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxHeight = 160; // px
    // set to scrollHeight but cap to maxHeight
    const newHeight = Math.min(ta.scrollHeight, maxHeight);
    ta.style.height = `${newHeight}px`;
    // update composer height manually in case observer doesn't fire immediately
    setComposerHeight(composerRef.current?.offsetHeight || 72);
  };

  useEffect(() => autoSizeTextarea(), [input]);

  /* ------------------ Composer ResizeObserver to update padding ------------------ */
  useEffect(() => {
    const el = composerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setComposerHeight(el.offsetHeight || 72);
    });
    ro.observe(el);
    // initial
    setComposerHeight(el.offsetHeight || 72);
    return () => ro.disconnect();
  }, []); // run once

  /* ------------------ Scroll when messages change ------------------ */
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ------------------ Keyboard / mobile helpers ------------------ */
  const onFocusInput = () => {
    setTimeout(scrollToBottom, 250);
  };

  /* ------------------ Render ------------------ */
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[80vh]">
      {/* messages area */}
      <div
        ref={msgsRef}
        className="flex-1 overflow-auto p-4 bg-white"
        style={{ paddingBottom: composerHeight + 12 }}
      >
        {loading && <div className="text-sm text-gray-400">Loading messages...</div>}

        <div className="flex flex-col gap-3">
          {messages.map((m) => {
            const mine =
              m.sender === currentUserId;
            const bubbleCls = mine ? "myMessage" : "otherPersonMessage";
            const containerCls = mine ? "flex justify-end" : "flex justify-start";
            const maxW = "max-w-[80%] md:max-w-[60%] lg:max-w-[50%]";

            return (
              <div key={m.id} className={`${containerCls} px-2`}>
                <div className={`${bubbleCls} ${maxW}`}>
                  <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                  <div
                    className={`text-[10px] mt-1 ${mine ? "mineTimeInfoText" : "otherTimeInfoText"}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* typing indicator (simple) */}
      {remoteTyping && (
        <div className="px-4 py-1 text-xs text-gray-500">{`typing...`}</div>
      )}

      {/* composer */}
      <div
        ref={composerRef}
        className="sticky bottom-0 bg-white border-t px-3 py-2 flex items-end gap-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)", zIndex: 10 }}
      >
        <div className="flex align-items-center flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onInput={autoSizeTextarea}
            onChange={(e) => {
              setInput(e.target.value);
              emitTyping();
            }}
            onFocus={onFocusInput}
            rows={1}
            placeholder="Type a message"
            className="w-full resize-none overflow-auto text-sm leading-5 rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
            style={{ maxHeight: 160, height: 50, }}
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
            className={`btn ${input.trim() ? "btn-secondary" : "btn-secondary-outline"}`}
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
