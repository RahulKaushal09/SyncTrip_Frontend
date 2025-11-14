import React from "react";
import { useRouter } from "next/navigation";

export default function ChatHeader({ chat, onBack }) {
  const router = useRouter();
  const other = chat?.users?.find((u) => u.id !== chat?.currentUserId) || chat?.users?.[0];
  
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <button onClick={onBack ?? router.back} className="p-2">
        <svg width="20" height="20" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <img src={other?.profile_picture && other?.profile_picture.length > 0 ? other?.profile_picture[0]: "/user-placeholder.png"} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <div className="font-semibold">{other?.name || chat?.chatName || "Chat"}</div>
        <div className="text-xs text-gray-500">{other?.lastSeen ? `Last seen ${new Date(other.lastSeen).toLocaleString()}` : ""}</div>
      </div>
    </div>
  );
}
