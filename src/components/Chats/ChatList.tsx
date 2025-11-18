import { Chat, ChatUser } from "@/types";
import React from "react";

type Props = {
  chats: Chat[];
  selectedChatId?: string | null;
  currentUserId?: string | null;
  onOpenChat: (chatId: string) => void;
};
export default function ChatList({ chats = [], selectedChatId, currentUserId, onOpenChat }: Props) {
  if (chats.length === 0) {
    return <div className="p-4 text-gray-400">No chats yet</div>;
  }
  console.log("chats:", chats);
  console.log("currentUserId:", currentUserId);
    return (
    <div className="border-r h-full">
      {chats.map((c) => {
        const other = (c.users || []).find((u) => (u as ChatUser).id !== currentUserId) || c.users?.[0];
<<<<<<< HEAD
=======
        const avatar = (other as ChatUser | undefined)?.profile_picture?.[0] ?? "/user-placeholder.png";
>>>>>>> 99d5121 (changes)
        return (
          <div
            key={c.id}
            className={`p-3 flex gap-3 items-center cursor-pointer hover:bg-gray-50 ${selectedChatId === c.id ? "bg-gray-100" : ""}`}
            onClick={() => onOpenChat(c.id)}
          >
<<<<<<< HEAD
            <img src={(other as ChatUser)?.profile_picture?.[0] || "/user-placeholder.png"} className="w-12 h-12 rounded-full object-cover" />
=======
            <img src={avatar} className="w-12 h-12 rounded-full object-cover" />
>>>>>>> 99d5121 (changes)
            <div className="flex-1">
              <div className="font-semibold">{(other as ChatUser)?.name || c.chatName || "Group"}</div>
              <div className="text-sm text-gray-500 truncate">{c.latestMessage?.content ?? c.chatName ?? ""}</div>
            </div>
            {c.updatedAt && <div className="text-xs text-gray-400">{new Date(c.updatedAt).toLocaleTimeString()}</div>}
          </div>
        );
      })}
      {chats.length === 0 && <div className="p-4 text-gray-400">No chats yet</div>}
    </div>
  );
}
