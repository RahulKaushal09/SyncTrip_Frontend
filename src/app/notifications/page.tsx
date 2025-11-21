"use client";

import React, { useEffect, useState } from "react";
import NotificationCard from "@/components/Cards/NotificationCard";
import apiClient from "@/utils/apiClient";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    
    const res = await apiClient.get("/notifications");
    if (!res || res.status !== 200) {
      console.error("Failed to fetch notifications");
      return;
    }
    const data = res.data;
    setNotifications(data.items || []);
  };

  const markAllRead = async () => {
    await apiClient.post("/notifications/read-all");
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page max-w-2xl mx-auto py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Notifications</h1>

        <button
          className="text-blue-500 underline"
          onClick={markAllRead}
        >
          Mark all read
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        {notifications.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            No notifications yet.
          </div>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {notifications.map((notif: any) => (
          <NotificationCard key={notif.id} notif={notif} />
        ))}
      </div>

      {/* STYLE JSX MUST BE INSIDE RETURN */}
      <style jsx>{`
        .notifications-page {
          min-height: 100vh;
          padding: 20px;
        }
      `}</style>
    </div>
  );
}
