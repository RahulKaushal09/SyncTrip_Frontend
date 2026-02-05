// import { Chat, ChatUser } from "@/types";
// import React from "react";

// type Props = {
//   chats: Chat[];
//   selectedChatId?: string | null;
//   currentUserId?: string | null;
//   onOpenChat: (chatId: string) => void;
// };
// export default function ChatList({ chats = [], selectedChatId, currentUserId, onOpenChat }: Props) {
//   if (chats.length === 0) {
//     return <div className="p-4 text-gray-400">No chats yet</div>;
//   }
//     return (
//     <div className="border-r h-full">
//       {chats.map((c) => {
//         const other = (c.users || []).find((u) => (u as ChatUser).id !== currentUserId) || c.users?.[0];
//         const isUnread = c.latestMessage?.readBy?.includes(currentUserId || "") === false;
//         return (
//           <div
//             key={c.id}
//             className={`p-3 flex gap-3 items-center cursor-pointer hover:bg-gray-50 ${selectedChatId === c.id ? "bg-gray-100" : ""} ${isUnread ? "unreadChatRow" : ""}`}
//             onClick={() => onOpenChat(c.id)}
//           >

//             <img src={(other as ChatUser)?.profile_picture?.[0] || "/user-placeholder.png"} className="w-12 h-12 rounded-full object-cover" />
//             <div className="flex-1">
//               <div className="font-semibold">{(other as ChatUser)?.name || c.chatName || "Group"}</div>
//               <div className={`text-sm text-gray-500 truncate ${isUnread ? "font-bold" : ""}`}>{c.latestMessage?.content ?? c.chatName ?? ""}</div>
//             </div>
//             {c.updatedAt && <div className="text-xs text-gray-400">{new Date(c.updatedAt).toLocaleTimeString()}</div>}
//           </div>
//         );
//       })}
//       {chats.length === 0 && <div className="p-4 text-gray-400">No chats yet</div>}
//     </div>
//   );
// }



import { Chat, ChatUser } from "@/types";
import React from "react";
import { Users } from "lucide-react";

type Props = {
  chats: Chat[];
  selectedChatId?: string | null;
  currentUserId?: string | null;
  onOpenChat: (chatId: string) => void;
};

export default function ChatList({
  chats = [],
  selectedChatId,
  currentUserId,
  onOpenChat,
}: Props) {
  if (chats.length === 0) {
    return <div className="p-4 text-gray-400">No chats yet</div>;
  }


  return (
    <div className="border-r h-full">
      {chats.map((c) => {
        const isGroup = c.isGroupChat;

        // ---------- UNREAD ----------
        const isUnread =
          c.latestMessage &&
          !c.latestMessage.readBy?.includes(currentUserId || "");

        // ---------- DIRECT CHAT ----------
        const otherUser = !isGroup
          ? (c.users || []).find((u) => (u as ChatUser).id !== currentUserId)
          : null;

        // ---------- AVATAR ----------
        const avatarSrc = isGroup
          ? "/group-placeholder.png" // later you can use group image
          : (otherUser as ChatUser)?.profile_picture?.[0] || "/user-placeholder.png";

        // ---------- TITLE ----------
        const title = isGroup
          ? c.chatName || "Group Trip"
          : (otherUser as ChatUser)?.name || "Chat";

        // ---------- SUBTITLE ----------
        console.log(c);
        const subtitle =
          c.latestMessageText ||
          (isGroup
            ? `Group • ${(c.users?.length || 1)} members`
            : "Say hi 👋");
        const groupUsers = (c.users as ChatUser[] || [])
          // .filter((u) => (u as ChatUser).id !== currentUserId)
          .slice(0, 3);

        const groupAvatars = groupUsers
          .map((u:ChatUser) => (u).profile_picture?.[0])
          .filter(Boolean);
        return (
          <div
            key={c.id}
            onClick={() => onOpenChat(c.id)}
            className={`p-3 flex gap-3 items-center cursor-pointer hover:bg-gray-50
              ${selectedChatId === c.id ? "bg-gray-100" : ""}
              ${isUnread ? "unreadChatRow" : ""}
            `}
          >
            {/* AVATAR */}
            <div className="relative">
              {isGroup ? (
                // <div className="w-12 h-12 rounded-full bg-primary-4 flex items-center justify-center">
                //   <Users className="text-primary-1" size={22} />
                // </div>
                <div className="relative w-12 h-12">
                  {isGroup ? (
                    groupAvatars.length > 0 ? (
                      <div className="relative w-12 h-12 rounded-full bg-primary-4 overflow-hidden">
                        {groupAvatars.slice(0, 3).map((src, index) => (
                          <img
                            key={index}
                            src={src}
                            className={`absolute w-6 h-6 rounded-full object-cover border-2 border-white`}
                            style={{
                              top: index === 0 ? 2 : index === 1 ? 18 : 18,
                              left: index === 0 ? 18 : index === 1 ? 2 : 18,
                              zIndex: 3 - index,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-4 flex items-center justify-center">
                        <Users className="text-primary-1" size={22} />
                      </div>
                    )
                  ) : (
                    <img
                      src={avatarSrc}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                </div>
              ) : (
                <img
                  src={avatarSrc}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>

            {/* TEXT */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{title}</div>
              <div
                className={`text-sm truncate ${isUnread ? "font-semibold text-black" : "text-gray-500"
                  }`}
              >
                {subtitle}
              </div>
            </div>

            {/* TIME */}
            {c.updatedAt && (
              <div className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(c.updatedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
