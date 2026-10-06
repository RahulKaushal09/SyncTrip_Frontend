import type { Metadata } from "next";
import ChatLocked from "@/components/Chats/ChatLocked";

/**
 * /share/chat/:chatId - where chat links land when SyncTrip isn't installed.
 *
 * WhatsApp / email outreach ("Aman mentioned you…") and shared chat links use
 * this URL. With the app installed the OS opens the chat directly and this
 * page is never seen; otherwise chats live only in the app, so it asks them
 * to get it. Private - never indexed, and it shows nothing from the chat.
 */

export const metadata: Metadata = {
  title: "Open this chat in the SyncTrip app",
  description: "Your SyncTrip chats are in the mobile app.",
  robots: { index: false, follow: false },
};

export default function SharedChatPage() {
  return <ChatLocked />;
}
