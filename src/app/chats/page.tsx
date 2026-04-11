'use client'
export const dynamic = "force-dynamic";

import ChatsPageInner from "@/components/Chats/UserChatsInnerPage";
import ChatLocked from "@/components/Chats/ChatLocked";
import React, { Suspense, useEffect, useState } from "react";

export default function ChatsPage() {

  useEffect(() => {
    document.title = "Chats | SyncTrip";
  }, []);

  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      <ChatLocked />
    </Suspense>
  );
}