// import React from "react";
// import { useRouter } from "next/navigation";
// import { Chat, ChatUser } from "@/types";
// import { useLogin } from "../providers/LoginProvider";

// export default function ChatHeader({ chat, onBack }: { chat: Chat | null; onBack?: () => void; }) {
//   const router = useRouter();
//   const {user} = useLogin();
//   const other = chat?.users?.find((u) => (u as ChatUser).id !== user?.id) || chat?.users?.[0];
//   if(chat == null ) return null;
//   return (
//     <div className="flex items-center gap-3 p-3 border-b">
//       <button onClick={onBack ?? router.back} className="p-2">
//         <svg width="20" height="20" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
//       </button>
//       <img src={(other as ChatUser)?.profile_picture?.[0] ?? "/user-placeholder.png"} className="w-10 h-10 rounded-full object-cover" />
//       <div>
//         <div className="font-semibold">{(other as ChatUser)?.name || "Chat"}</div>
//         {/* <div className="text-xs text-gray-500">{(other as ChatUser)?.lastSeen ? `Last seen ${new Date((other as ChatUser).lastSeen).toLocaleString()}` : ""}</div> */}
//       </div>
//     </div>
//   );
// }


import React from "react";
import { useRouter } from "next/navigation";
import { Chat, ChatUser } from "@/types";
import { useLogin } from "../providers/LoginProvider";
import { Users } from "lucide-react";
import GumletImage from "../common/GumletImage";

export default function ChatHeader({
  chat,
  onBack,
}: {
  chat: Chat | null;
  onBack?: () => void;
}) {
  const router = useRouter();
  const { user } = useLogin();

  if (!chat) return null;

  const isGroup = chat.isGroupChat;

  const otherUser = !isGroup
    ? chat.users?.find((u) => (u as ChatUser).id !== user?.id) ||
      chat.users?.[0]
    : null;

  const groupUsers = isGroup
    ? (chat.users as ChatUser[] || [])
        // .filter((u) => (u as ChatUser).id !== user?.id)
        .slice(0, 3)
    : [];

  const groupAvatars = groupUsers
    .map((u) => (u as ChatUser).profile_picture?.[0])
    .filter(Boolean);

  return (
    <div className="flex items-center gap-3 p-3 border-b bg-white">
      {/* BACK */}
      <button onClick={onBack ?? router.back} className="p-2">
        <svg width="20" height="20" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
      </button>

      {/* AVATAR */}
      <div className="relative w-10 h-10">
        {isGroup ? (
          groupAvatars.length > 0 ? (
            <div className="relative w-10 h-10 rounded-full bg-primary-4 overflow-hidden">
              {groupAvatars.map((src, index) => (
                <GumletImage
                  key={index}
                  src={src}
                  alt="Group Members"
                  height={20}
                  width={20}
                  className="absolute w-5 h-5 rounded-full object-cover border-2 border-white"
                  style={{
                    top: index === 0 ? 1 : 14,
                    left: index === 0 ? 14 : index === 1 ? 1 : 14,
                    zIndex: 3 - index,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-4 flex items-center justify-center">
              <Users size={18} className="text-primary-1" />
            </div>
          )
        ) : (
          <GumletImage
            src={(otherUser as ChatUser)?.profile_picture?.[0] || "/user-placeholder.png"}
            alt={(otherUser as ChatUser)?.name || "User"}
            height={40}
            width={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
      </div>

      {/* TITLE */}
      <div className="flex flex-col">
        <div className="font-semibold leading-tight">
          {isGroup
            ? chat.chatName || "Group Trip"
            : (otherUser as ChatUser)?.name || "Chat"}
        </div>

        {isGroup && (
          <div className="text-xs text-gray-500">
            {chat.users?.length || 1} members
          </div>
        )}
      </div>
    </div>
  );
}
