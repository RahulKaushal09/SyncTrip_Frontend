'use client'
export const dynamic = "force-dynamic";

import MatchingPage from "@/components/Matching/userMatchingInnerPage";
import React, { Suspense } from "react";

export default function ChatsPage() {
  return (
    <Suspense fallback={<div>Loading chats...</div>}>
      <MatchingPage />
    </Suspense>
  );
}
