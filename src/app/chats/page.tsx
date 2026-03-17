'use client'
export const dynamic = "force-dynamic";

import ChatsPageInner from "@/components/Chats/UserChatsInnerPage";
import ChatLocked from "@/components/Chats/ChatLocked";
import React, { Suspense, useEffect, useState } from "react";

function useIsApple(): boolean | null {
  const [isApple, setIsApple] = useState<boolean | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const apple = /iPhone|iPad|iPod|Macintosh|Mac OS X/.test(ua);
    setIsApple(apple);
  }, []);

  return isApple;
}

export default function ChatsPage() {
  const isApple = useIsApple();

  useEffect(() => {
    document.title = "Chats | SyncTrip";
  }, []);

  // Still determining platform — avoid flash of wrong component
  if (isApple === null) {
    return <div>Loading chats...</div>;
  }

  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      {isApple ? <ChatsPageInner /> : <ChatLocked />}
    </Suspense>
  );
}