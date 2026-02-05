"use client";

import React from "react";
import Link from "next/link";

export default function NotificationCard({ notif }) {
  const { id, actor, title, message, createdAt, clickAction } = notif;

  const timeAgo = new Date(createdAt).toLocaleString();

  // compute click link
  let href = "#";

  if (clickAction?.type === "OPEN_CHAT") {
    href = `/chats?chatId=${clickAction.payload.conversationId}`;
  }
  if (clickAction?.type === "GROUP_DETAILS") {
    href = `/userTrip/${clickAction.payload.tripId}/groups/${clickAction.payload.groupTripId}`;
  }
  // if (clickAction?.type === "OPEN_PROFILE") {
  //   href = `/profile/${clickAction.payload.profileId}`;
  // }
  if (clickAction?.type === "OPEN_TRIP") {
    href = `/userTrip/${clickAction.payload.tripId}/details`;
  }

  return (
    <Link href={href}>
      <div className="w-full flex items-start gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer">
        <img
          src={actor?.avatar || "/user-placeholder.png"}
          className="w-12 h-12 rounded-full object-cover"
        />
        
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className="text-gray-600 text-sm">{message}</div>
          <div className="text-xs text-gray-400 mt-1">{timeAgo}</div>
        </div>
      </div>
    </Link>
  );
}
