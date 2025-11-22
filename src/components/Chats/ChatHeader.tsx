import React from "react";
import { useRouter } from "next/navigation";
import { Chat, ChatUser } from "@/types";
import { useLogin } from "../providers/LoginProvider";

export default function ChatHeader({ chat, onBack }: { chat: Chat | null; onBack?: () => void; }) {
  const router = useRouter();
  const {user} = useLogin();
  const other = chat?.users?.find((u) => (u as ChatUser).id !== user?.id) || chat?.users?.[0];
  if(chat == null ) return null;
  return (
    <div className="flex items-center gap-3 p-3 border-b">
      <button onClick={onBack ?? router.back} className="p-2">
        <svg width="20" height="20" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
      </button>
      <img src={(other as ChatUser)?.profile_picture?.[0] ?? "/user-placeholder.png"} className="w-10 h-10 rounded-full object-cover" />
      <div>
        <div className="font-semibold">{(other as ChatUser)?.name || "Chat"}</div>
        {/* <div className="text-xs text-gray-500">{(other as ChatUser)?.lastSeen ? `Last seen ${new Date((other as ChatUser).lastSeen).toLocaleString()}` : ""}</div> */}
      </div>
    </div>
  );
}
