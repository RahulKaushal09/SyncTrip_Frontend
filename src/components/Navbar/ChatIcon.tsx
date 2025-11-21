"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatApiService from "@/utils/chats.api.utils"; // adjust if your service path differs
import { Chat } from "@/types";
// import useSWR from "swr"; // optional — you can remove if not using SWR
// no image import needed — using inline SVG for crispness

type Props = {
  className?: string;
  currentUserId?: string;
  onClickOpen?: () => void; // optional callback
};

export default function ChatIcon({ className = "", currentUserId, onClickOpen }: Props) {
  const router = useRouter();
  const mountedRef = useRef(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // utility: fetch unread count from your API/service.
  // If you have ChatApiService.fetchUnreadCount or similar, use that.
  const fetchUnread = async () => {
    try {
      setLoading(true);
      // Preferred: use a dedicated endpoint
      // if (ChatApiService && typeof ChatApiService.fetchUnreadCount === "function") {
      //   const res = await ChatApiService.fetchUnreadCount(); // expect number
      //   if (!mountedRef.current) return;
      //   setUnreadCount(typeof res === "number" ? res : 0);
      // }
      if (ChatApiService && typeof ChatApiService.fetchUnreadCount === "function") {
        const res = await ChatApiService.fetchUnreadCount(); // now { count, byTrip } or number
        if (!mountedRef.current) return;

        if (typeof res === "number") {
          setUnreadCount(res);
        } else if (res && typeof res.count === "number") {
          setUnreadCount(res.count);              // 👈 use total unread chats
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
        const r = await fetch("/api/chats/unread-count");
        const data = await r.json();
        if (!mountedRef.current) return;
        setUnreadCount(data?.count || 0);
      }
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
    // initial fetch
    fetchUnread();

    // poll every 20s for unread updates (adjust as needed) — optional
    const interval = setInterval(() => {
      fetchUnread();
    }, 20000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
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
