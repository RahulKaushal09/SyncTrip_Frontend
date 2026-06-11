"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { io, Socket } from "socket.io-client";
import apiClient from "@/utils/apiClient";
import { Bell } from "lucide-react";
// import { API_CONFIG } from "@/constants";
import { getSocket } from "@/utils/socket";

export default function NotificationBell({ iconColor = "black" }: { iconColor?: string }) {
  const [count, setCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const fetchCount = async () => {
    try {
      const res = await apiClient.get("/notifications/unread-count");
      // console.log("🔄 Fetched count via API:", res.data.count); // Debug log
      setCount(res.data.count || 0);
    } catch (err) {
      // console.error("❌ API fetch failed:", err);
      setCount(0);
    }
  };

  useEffect(() => {

    fetchCount(); // Initial load


    const socket = getSocket();

    socketRef.current = socket;


    // Listen for new unread notification → increment
    socket.on("new_unread_notification", (data) => {
      // console.log("📢 Received new notification event:", data); // Debug: Confirm receipt
      setCount((prev) => {
        const newCount = prev + 1;
        // console.log("➕ Count incremented to:", newCount); // Debug
        return newCount;
      });
    });

    // Listen for decrement
    socket.on("unread_count_decrement", ({ delta = 1 }) => {
      // console.log("📉 Received decrement event:", delta); // Debug
      setCount((prev) => {
        const newCount = Math.max(0, prev - delta);
        // console.log("➖ Count decremented to:", newCount);
        return newCount;
      });
    });

    // Visibility refresh (keep, but log)
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        // console.log("👁️ Tab visible - syncing count");
        fetchCount();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      socket.disconnect();
      // console.log("🧹 Socket cleanup");
      socketRef.current = null;
    };
  }, []);

  // Redundant cleanup (remove this useEffect - first one handles it)
  // useEffect(() => { return () => { if (socketRef.current) socketRef.current.disconnect(); }; }, []);

  return (
    <Link href="/notifications" className="relative cursor-pointer flex items-center">
      <Bell color={iconColor} size={22} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}