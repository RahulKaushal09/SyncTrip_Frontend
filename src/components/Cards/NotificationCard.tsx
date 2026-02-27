"use client";

import React from "react";
import Link from "next/link";
import GumletImage from "../common/GumletImage";

export default function NotificationCard({ notif }) {
  const { id, actor, title, message, createdAt, clickAction } = notif;

  const timeAgo = new Date(createdAt).toLocaleString();

  // compute click link
  let href = "#";

  if (clickAction?.type === "OPEN_CHAT") {
    href = `/chats?chatId=${clickAction.payload.conversationId}`;
  }
  if (clickAction?.type === "GROUP_DETAILS") {
    href = `/userTrip/${clickAction.payload.tripId}/groups/${clickAction.payload.groupId}`;
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
        <div className="h-12 w-12">
          <GumletImage
            src={actor?.avatar || "/user-placeholder.png"}
            alt="SyncTrip User"
            height={48}
            width={48}
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          <div className="text-gray-600 text-sm">{message}</div>
          <div className="text-xs text-gray-400 mt-1">{timeAgo}</div>
        </div>
      </div>
    </Link>
  );
}
