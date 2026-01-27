
import {
  FetchChatsResponse,
  FetchChatByIdResponse,
  FetchMessagesResponse,
  SendMessageResponse,
  UnreadCountResponse,
  FetchChatsParams
} from "@/types";
import apiClient from "./apiClient";


const ChatApiService = {

  async fetchUnreadCount(): Promise<UnreadCountResponse>  {
    const { data } = await apiClient.get<{ count: number }>("/chats/unread-count");
    return data as UnreadCountResponse;
  },
  async fetchChats(tripId?: string) {
    const params: FetchChatsParams = {};
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
