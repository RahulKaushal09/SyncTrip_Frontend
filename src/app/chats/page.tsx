'use client'
export const dynamic = "force-dynamic";

import ChatsPageInner from "@/components/Chats/UserChatsInnerPage";
import React, { Suspense, useEffect } from "react";

export default function ChatsPage() {
  useEffect(() => {
    document.title = "Chats | SyncTrip";
  }, []);
  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      <ChatsPageInner />
    </Suspense>
  );
}
