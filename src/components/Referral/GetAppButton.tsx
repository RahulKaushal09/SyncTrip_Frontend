"use client";

import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { getStoreUrl } from "@/utils/redirectToStore";
import { APP_LINKS } from "@/constants";

/**
 * Plain platform-aware "Get the app" CTA with no referral attribution.
 * Used for the invalid-invite fallback state.
 */
export default function GetAppButton() {
  const [storeUrl, setStoreUrl] = useState<string>(APP_LINKS.WEB_HOME);

  useEffect(() => {
    setStoreUrl(getStoreUrl());
  }, []);

  return (
    <a
      href={storeUrl}
      className="btn btn-primary !h-[56px] !flex items-center justify-center gap-2 shadow-lg shadow-primary-1/20"
    >
      <Download size={18} />
      <span className="b2">Get the app</span>
    </a>
  );
}
