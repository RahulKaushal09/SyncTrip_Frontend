'use client'
export const dynamic = "force-dynamic";

import ChatsPageInner from "@/components/Chats/UserChatsInnerPage";
import React, { Suspense } from "react";

export default function ChatsPage() {
  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      <ChatsPageInner />
    </Suspense>
  );
}
