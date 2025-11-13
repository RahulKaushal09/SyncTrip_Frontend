"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/utils/apiClient";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await apiClient.get("/notifications/unread-count");
      setCount(res.data.count || 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    fetchCount();

    // optional: refresh every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/notifications" className="relative cursor-pointer flex items-center">
      <Bell size={22} />

      {count > 0 && (
        <span
          className="
            absolute -top-1 -right-1 
            bg-red-500 text-white 
            text-xs font-bold 
            w-5 h-5 flex items-center justify-center 
            rounded-full
          "
        >
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
