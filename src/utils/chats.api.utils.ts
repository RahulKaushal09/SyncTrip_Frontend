// import axios from "axios";
// import apiClient from "./apiClient";


// const ChatApiService = {
//   currentUserId: null as string | null,

//   async fetchChats(tripId?: string) {
//     const params: any = {};
//     if (tripId) params.tripId = tripId;
//     const { data } = await apiClient.get("/chats", { params });
//     // set currentUserId if available (backend could return it)
//     return data; // assume array of chats
//   },

//   async getChatById(chatId: string) {
//     const { data } = await apiClient.get(`/chats/${chatId}`);
//     // data: chat object with tripId and optionally latest messages
//     return data;
//   },

//   async accessChat(friendUserId: string, tripId: string) {
//     const { data } = await apiClient.post("/chats", { userId: friendUserId, tripId });
//     return data;
//   },

//   async fetchMessages(chatId: string) {
//     const { data } = await apiClient.get(`/messages/${chatId}`);
//     return data;
//   },

//   async sendMessage({ chatId, content }: { chatId: string; content: string; }) {
//     const { data } = await apiClient.post("/messages", { chatId, content });
//     return data;
//   },

//   // helper if you later integrate sockets
//   connectSocket(token: string) {
//     // optional: return a socket client if you enable Socket.IO on server
//     // import io from "socket.io-client";
//     // const socket = io(process.env.NEXT_PUBLIC_WS_URL || "/", { query: { token }});
//     // return socket;
//   }
// };

// export default ChatApiService;


import {
  FetchChatsResponse,
  FetchChatByIdResponse,
  FetchMessagesResponse,
  SendMessageResponse,
  UnreadCountResponse
} from "@/types";
import apiClient from "./apiClient";


const ChatApiService = {

  async fetchUnreadCount(): Promise<UnreadCountResponse>  {
    const { data } = await apiClient.get<{ count: number }>("/chats/unread-count");
    return data as UnreadCountResponse;
  },
  async fetchChats(tripId?: string) {
    const params: any = {};
    if (tripId) params.tripId = tripId;

    const { data } = await apiClient.get<FetchChatsResponse>("/chats", { params });
    return data;
  },

  async getChatById(chatId: string) {
    const { data } = await apiClient.get<FetchChatByIdResponse>(`/chats/${chatId}`);
    return data;
  },

  async fetchMessages(chatId: string) {
    const { data } = await apiClient.get<FetchMessagesResponse>(`/messages/${chatId}`);
    return data;
  },

  async sendMessage(body: { content: string; chatId: string }) {
    const { data } = await apiClient.post<SendMessageResponse>("/messages", body);
    return data;
  },
};

export default ChatApiService;
