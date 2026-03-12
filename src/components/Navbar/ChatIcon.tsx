"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";  // NEW: Import socket.io-client
import ChatApiService from "@/utils/chats.api.utils"; // adjust if your service path differs
import { Chat } from "@/types";
import { API_CONFIG } from "@/constants";  // Assuming you have this for SOCKET_URL
import { getSocket } from "@/utils/socket";

type Props = {
  className?: string;
  currentUserId?: string;
  onClickOpen?: () => void; // optional callback
  iconColor?: string; // optional color prop
};

export default function ChatIcon({ className = "", currentUserId, onClickOpen, iconColor = "currentColor" }: Props) {
  const router = useRouter();
  const mountedRef = useRef(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);  // NEW: Socket ref

  // utility: fetch unread count from your API/service.
  const fetchUnread = async () => {
    try {
      setLoading(true);
      // console.log("🔄 Fetching initial chat unread count");  // Debug
      if (ChatApiService && typeof ChatApiService.fetchUnreadCount === "function") {
        const res = await ChatApiService.fetchUnreadCount(); // now { count, byTrip } or number
        if (!mountedRef.current) return;

        if (typeof res === "number") {
          setUnreadCount(res);
        } else if (res && typeof res.count === "number") {
          setUnreadCount(res.count);  // 👈 use total unread chats
        } else {
          setUnreadCount(0);
        }
      } else if (ChatApiService && typeof ChatApiService.fetchChats === "function") {
        // fallback: fetch recent chats and count unread messages (cheap heuristic)
        const chats = await ChatApiService.fetchChats();
        if (!mountedRef.current) return;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unread = Array.isArray(chats)
          ? chats.reduce((acc: number, c: Chat) => acc + (c.unreadCount || 0), 0)
          : 0;
        setUnreadCount(unread);
      } else {
        // fallback to hitting a REST API route (example)
        const r = await fetch("/chats/unread-count");
        const data = await r.json();
        if (!mountedRef.current) return;
        setUnreadCount(data?.count || 0);
      }
      // console.log("📊 Initial unread count set to:", unreadCount);  // Debug
    } catch (err) {
      console.error("ChatIcon: failed to fetch unread count", err);
      if (!mountedRef.current) return;
      setUnreadCount(0);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetchUnread(); // fetch once only

    // NEW: Socket connection for real-time updates
   
    const socket = getSocket();

    socketRef.current = socket;

    

    // NEW: Listen for chat unread events
    socket.on("chat_unread_increment", ({ delta = 1 }) => {
      // console.log("💬 Received increment event:", delta);  // Debug
      setUnreadCount((prev) => {
        const newCount = prev + delta;
        // console.log("➕ Chat unread incremented to:", newCount);
        return newCount;
      });
    });

    socket.on("chat_unread_decrement", ({ delta = 1 }) => {
      // console.log("💬 Received decrement event:", delta);  // Debug
      setUnreadCount((prev) => {
        const newCount = Math.max(0, prev - delta);
        // console.log("➖ Chat unread decremented to:", newCount);
        return newCount;
      });
    });

    // Optional: Visibility sync (refetch if tab hidden during updates)
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        // console.log("👁️ Tab visible — syncing chat count");
        fetchUnread();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", onVisible);
      socket.disconnect();
      // console.log("🧹 Chat socket cleanup");
      socketRef.current = null;
    };
  }, [currentUserId]);

  const openChats = () => {
    // optional callback (e.g., open drawer or custom navigation)
    if (onClickOpen) {
      onClickOpen();
      return;
      // still navigate unless callback handled it
    }
    router.push("/chats");
  };

  return (
    <button
      aria-label="Open chats"
      title="Chats"
      onClick={openChats}
      className={`chat-icon-btn ${className}`}
      style={{ position: "relative", border: "none", background: "transparent", padding: 0, cursor: "pointer" }}
    >
      {/* Chat bubble SVG */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke={iconColor} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* unread badge */}
      {unreadCount > 0 && (
        <span className="chat-unread-badge" aria-live="polite">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}

      {/* small loading dot (optional) */}
      {loading && <span className="chat-loading-dot" />}
    </button>
  );
}