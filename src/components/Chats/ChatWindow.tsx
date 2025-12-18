import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import ChatApiService from "@/utils/chats.api.utils";
import { Message } from "@/types";
import { StorageUtils } from "@/utils";
import "../../../styles/chats/chats.css";
import toast from "react-hot-toast";

type Props = {
    chatId: string;
    currentUserId: string;
    socket?: Socket; // Passed from parent
};

export default function ChatWindow({ chatId, currentUserId, socket }: Props) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [remoteTyping, setRemoteTyping] = useState<{ userId: string } | null>(null);
    const msgsRef = useRef<HTMLDivElement | null>(null);
    const composerRef = useRef<HTMLDivElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const typingTimeoutRef = useRef<number | null>(null);
    const stopTypingTimerRef = useRef<number | null>(null);
    const lastMessageIds = useRef<Set<string>>(new Set());
    const [composerHeight, setComposerHeight] = useState<number>(72);

    // Socket listeners (using passed socket)
    useEffect(() => {
        if (!socket) return;

        // Join/leave on chatId change (moved from separate effect)
        if (chatId) {
            socket.emit("join_chat", chatId);
        }

        // Receive messages (filtered by chatId)
        const handleReceiveMessage = (message: Message) => {
            try {
                if (!message || !message.id || message.chat !== chatId) return;
                if (lastMessageIds.current.has(message.id)) return;
                lastMessageIds.current.add(message.id);
                setMessages((prev) => [...prev, message]);
                setTimeout(scrollToBottom, 40);
            } catch (e) {
                console.error("receive_message handler error", e);
            }
        };

        socket.on("receive_message", handleReceiveMessage);

        // Typing
        socket.on("typing", ({ chatId: cId, userId }: { chatId: string; userId: string }) => {
            if (cId === chatId && userId !== currentUserId) {
                setRemoteTyping({ userId });
            }
        });

        socket.on("stop_typing", ({ chatId: cId, userId }: { chatId: string; userId: string }) => {
            if (cId === chatId && userId !== currentUserId) {
                setRemoteTyping(null);
            }
        });

        // Error handling
        socket.on("error_message", (err: { reason: string }) => {
            console.error("Socket error:", err);
            toast.error("Message send failed");
        });

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("typing");
            socket.off("stop_typing");
            socket.off("error_message");
            if (chatId) {
                socket.emit("leave_chat", chatId);
            }
            setRemoteTyping(null);
            lastMessageIds.current.clear();
        };
    }, [chatId, currentUserId, socket]);

    // Load messages on chatId change
    useEffect(() => {
        lastMessageIds.current = new Set();
        if (chatId) {
            loadMessages();
        } else {
            setMessages([]);
        }
    }, [chatId]);

    const emitTyping = () => {
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

    const loadMessages = async () => {
        setLoading(true);
        try {
            const msgs = await ChatApiService.fetchMessages(chatId);
            const arr = Array.isArray(msgs) ? msgs : [];
            setMessages(arr);
            lastMessageIds.current = new Set(arr.map((m) => m.id));
            setTimeout(() => scrollToBottom(), 80);
        } catch (err) {
            console.error("Failed to load messages", err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = () => {
        if (!input.trim() || !chatId || !socket) return;
        socket.emit("send_message", {
            chatId,
            content: input.trim(),
        });
        setInput("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    };

    const scrollToBottom = () => {
        if (!msgsRef.current) return;
        msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    };

    const autoSizeTextarea = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        const maxHeight = 160;
        const newHeight = Math.min(ta.scrollHeight, maxHeight);
        ta.style.height = `${newHeight}px`;
        setComposerHeight(composerRef.current?.offsetHeight || 72);
    };

    useEffect(() => autoSizeTextarea(), [input]);

    useEffect(() => {
        const el = composerRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => {
            setComposerHeight(el.offsetHeight || 72);
        });
        ro.observe(el);
        setComposerHeight(el.offsetHeight || 72);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const onFocusInput = () => {
        setTimeout(scrollToBottom, 250);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] md:h-[80vh]">
            <div
                ref={msgsRef}
                className="flex-1 overflow-auto p-4 bg-white"
                style={{ paddingBottom: composerHeight + 12 }}
            >
                {loading && <div className="text-sm text-gray-400">Loading messages...</div>}
                <div className="flex flex-col gap-3">
                    {messages.map((m) => {
                        const mine = m.sender === currentUserId;
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
            {remoteTyping && (
                <div className="px-4 py-1 text-xs text-gray-500">{`typing...`}</div>
            )}
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
                        style={{ maxHeight: 160, height: 50 }}
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