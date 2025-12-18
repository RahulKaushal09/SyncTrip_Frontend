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
  const openChatAfterAddingReadBy = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat || !chat.latestMessage) return;
    if (!chat.latestMessage.readBy) {
      chat.latestMessage.readBy = [];
    }
    if (currentUserId && !chat.latestMessage.readBy.includes(currentUserId)) {
      chat.latestMessage.readBy.push(currentUserId);
    }
    onOpenChat(chatId);
  };
    return (
    <div className="border-r h-full">
      {chats.map((c) => {
        const other = (c.users || []).find((u) => (u as ChatUser).id !== currentUserId) || c.users?.[0];
        const isUnread = c.latestMessage?.readBy?.includes(currentUserId || "") === false;
        return (
          <div
            key={c.id}
            className={`p-3 flex gap-3 items-center cursor-pointer hover:bg-gray-50 ${selectedChatId === c.id ? "bg-gray-100" : ""} ${isUnread ? "unreadChatRow" : ""}`}
            onClick={() => openChatAfterAddingReadBy(c.id)}
          >

            <img src={(other as ChatUser)?.profile_picture?.[0] || "/user-placeholder.png"} className="w-12 h-12 rounded-full object-cover" />
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
