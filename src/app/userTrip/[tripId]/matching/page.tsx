'use client'
export const dynamic = "force-dynamic";

import MatchingPage from "@/components/Matching/userMatchingInnerPage";
import React, { Suspense, useEffect } from "react";

export default function ChatsPage() {
  useEffect(() => {
    document.title = "Connections | SyncTrip";
  }, [])
  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      <MatchingPage />
    </Suspense>
  );
}
