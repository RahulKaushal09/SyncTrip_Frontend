// ChatWindow.tsx
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import ChatApiService from "@/utils/chats.api.utils";
import { Chat, Message } from "@/types";
// import { StorageUtils } from "@/utils";

import "../../../styles/chats/chats.css";
// import { debug } from "console";
import { getSocket } from "@/utils/socket";
import ChatInstructions from "./ChatInstructions";

type Props = {
  chatId: string;
  currentUserId: string;
  chat: Chat | null;
};

export default function ChatWindow({ chatId, currentUserId, chat }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState<{ userId: string } | null>(null);
  const msgsRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const stopTypingTimerRef = useRef<number | null>(null);
  const lastMessageIds = useRef<Set<string>>(new Set());

  // measure composer height so we can add bottom padding to messages container
  const [composerHeight, setComposerHeight] = useState<number>(72); // default

  /* ------------------ Socket: connect once ------------------ */
  // useEffect(() => {
  //   // only run on client
  //   if (typeof window === "undefined") return;

  //   // const token = StorageUtils.getToken();
  //   const socket = getSocket();

  //   socketRef.current = socket;

  //   // on connect: if chatId already present, join it (avoids join-before-connect race)
  // socket.on("connect", () => {
  //   console.log("socket connected", socket.id);
  //   if (chatId) {
  //     socket.emit("join_chat", chatId);
  //   }
  // });

  //   socket.on("connect_error", (err: unknown) => {
  //     console.error("socket connect_error", err);
  //   });

  //   // receive messages broadcast from server
  //   socket.on("receive_message", (message: Message) => {
  //     try {
  //       if (!message || !message.id) return;
  //       // if message belongs to another chat (just in case), ignore
  //       // server normally emits only to the room, but sanity check:
  //       if ((message as Message).chat && chatId && (message as Message).chat !== chatId) return;

  //       if (lastMessageIds.current.has(message.id)) return;
  //       lastMessageIds.current.add(message.id);

  //       setMessages((prev) => [...prev, message]);
  //       setTimeout(scrollToBottom, 40);
  //     } catch (e) {
  //       console.error("receive_message handler error", e);
  //     }
  //   });

  //   // typing indicators from other users
  //   socket.on("typing", ({ chatId: cId, userId }: { chatId: string; userId: string }) => {
  //     if (cId === chatId && userId !== currentUserId) {
  //       setRemoteTyping({ userId });
  //     }
  //   });

  //   socket.on("stop_typing", ({ chatId: cId, userId }: { chatId: string; userId: string }) => {
  //     if (cId === chatId && userId !== currentUserId) {
  //       setRemoteTyping(null);
  //     }
  //   });

  //   return () => {
  //     if (chatId) {
  //       socket.emit("leave_chat", chatId);
  //     }
  //     setRemoteTyping(null);
  //   };
  // }, [chatId, currentUserId]);  //
  useEffect(() => {
    if (typeof window === "undefined") return;

    const socket = getSocket();
    if (!socket) console.error("Socket is null");
    if (!socket) return;

    // on connect: if chatId already present, join it (avoids join-before-connect race)
    socket.on("connect", () => {
      console.log("socket connected", socket.id);
      if (chatId) {
        socket.emit("join_chat", chatId);
      }
    });

    socket.on("connect_error", (err: unknown) => {
      console.error("socket connect_error", err);
    });

    socketRef.current = socket;

    const onReceiveMessage = (message: Message) => {
      if (message.chat !== chatId) return;
      if (lastMessageIds.current.has(message.id)) return;

      lastMessageIds.current.add(message.id);
      setMessages(prev => [...prev, message]);
      setTimeout(scrollToBottom, 40);
    };

    socket.on("receive_message", onReceiveMessage);

    socket.on("typing", ({ chatId: cId, userId }) => {
      if (cId === chatId && userId !== currentUserId) {
        setRemoteTyping({ userId });
      }
    });

    socket.on("stop_typing", ({ chatId: cId, userId }) => {
      if (cId === chatId && userId !== currentUserId) {
        setRemoteTyping(null);
      }
    });

    return () => {
      socket.off("receive_message", onReceiveMessage);
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [chatId, currentUserId]);

  /* ------------------ Join/leave chat when chatId changes ------------------ */
  useEffect(() => {
    const socket = socketRef.current;

    // reset dedupe BEFORE we load messages to avoid mixing old/new
    lastMessageIds.current = new Set();

    // leave previous handled by server when socket emits leave
    // if socket already connected -> join now
    if (socket) {
      // leave all rooms first (optional, safe)
      // join new chat
      if (chatId) {
        socket.emit("join_chat", chatId);
      }
    }

    // load messages for this chat AFTER resetting dedupe
    if (chatId) {
      loadMessages();
    } else {
      // no chat selected -> clear UI
      setMessages([]);
    }

    return () => {
      if (socket && chatId) {
        socket.emit("leave_chat", chatId);
      }
      // clear typing state when switching/closing
      setRemoteTyping(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  /* ------------------ Typing emitter (debounced stop) ------------------ */
  const emitTyping = () => {
    const socket = socketRef.current;
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

  const senderMap = React.useMemo(() => {
    const map: Record<string, { name: string; avatar?: string }> = {};
    if (!chat?.users) return map;

    console.log("Building sender map for users:", chat.users);

    chat.users.forEach(u => {
      map[u.id] = {
        name: u.name,
        avatar: u.profile_picture?.[0],
      };
    });

    console.log("Sender map:", map);

    return map;
  }, [chat]);
  /* ------------------ Send message (REST) + dedupe update ------------------ */
  const handleSend = async () => {
    if (!input.trim() || !chatId) return;

    const content = input.trim();
    try {
      // Option A (recommended): use REST endpoint (server will persist and emit via req.io)
      const saved: Message = await ChatApiService.sendMessage({ chatId, content });

      // add saved.id to dedupe set immediately so socket broadcast doesn't duplicate
      // if (saved && saved.id) lastMessageIds.current.add(saved.id);
      if (saved && saved.id) {
        if (!lastMessageIds.current.has(saved.id)) {
          lastMessageIds.current.add(saved.id);
          setMessages((s) => [...s, saved]);
        } else {
          // socket already handled it — nothing to do (optional: update existing pending state)
          // console.debug("message already received via socket, skipping append", saved.id);
        }
      }

      // append saved message to UI
      // setMessages((s) => [...s, saved]);

      // clear composer
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      setTimeout(() => scrollToBottom(), 40);
    } catch (err) {
      console.error("send failed", err);
      // you could show a toast here
    }
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
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {chat && chat.isGroupChat && <ChatInstructions />}
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
            const system = m.type === "system";
            const bubbleCls = mine ? "myMessage" : system ? "systemMessage" : "otherPersonMessage";
            const containerCls = mine ? "flex justify-end" : system ? "flex justify-center" : "flex justify-start";
            const maxW = "max-w-[80%] md:max-w-[60%] lg:max-w-[50%]";

            return (
              <div key={m.id} className={`${containerCls} px-2`}>
                <div className={`${bubbleCls} ${maxW}`}>
                  {!mine && !system && chat?.isGroupChat && (
                    <div className="text-xs font-semibold text-secondary-1 mb-1">
                      {senderMap[m.sender]?.name.split(" ")[0] || "Synctrip User"}
                    </div>
                  )}

                  <div className="text-sm whitespace-pre-wrap">
                    {system ? (
                      <>
                        <strong className={m.systemAction === "user_joined" ? "text-primary-1" : m.systemAction === "user_left" ? "text-error-1" : "text-gray-500"}>{m.content}</strong> {m.systemAction === "user_joined" ? "joined the group" : m.systemAction === "user_left" ? "left the group" : ""}
                      </>
                    ) : m.content}
                  </div>
                  {/* <div className="text-sm whitespace-pre-wrap">{m.content}</div> */}
                  {!system && <div
                    className={`text-[10px] mt-1 ${mine ? "mineTimeInfoText" : "otherTimeInfoText"}`}
                  >
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* typing indicator (simple) */}
      {
        remoteTyping && (
          <div className="px-4 py-1 text-xs text-gray-500">{`typing...`}</div>
        )
      }

      {/* composer */}
      <div
        ref={composerRef}
        className="sticky bottom-0 bg-white border-t px-3 py-2 flex items-end gap-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom)", zIndex: 10 }}
      >
        <div className="flex align-items-center flex-1" style={{ height: '100%' }}>
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
            className="w-full resize-none overflow-auto text-sm leading-5 rounded-lg border px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-400 textBoxForChat"
            // style={{ height: 100 }}
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
    </div >
  );
}
