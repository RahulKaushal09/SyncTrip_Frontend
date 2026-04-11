"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const InvitePageActivity = () => {
  const { type, slug } = useParams();

  useEffect(() => {
    if (!type || !slug) return;

    const appUrl = `synctrip://invite/${type}/${slug}`;
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.synctrip";
    const appStoreUrl =
      "https://apps.apple.com/app/synctrip/id6761762665";

    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    let hasOpenedApp = false;

    // Detect if app opened (page hidden)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hasOpenedApp = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Try opening app via standard browser location assignment
    window.location.href = appUrl;

    // Fallback
    const timer = setTimeout(() => {
      if (!hasOpenedApp) {
        // Use replace() for the fallback so the redirect page doesn't get stuck in browser back history
        if (isAndroid) {
          window.location.replace(playStoreUrl);
        } else if (isIOS) {
          window.location.replace(appStoreUrl);
        } else {
          // Desktop fallback
          window.location.replace("https://play.google.com/store/apps/details?id=com.synctrip");
        }
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [type, slug]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div>
        <h2>Opening SyncTrip...</h2>
        <p>If nothing happens, you’ll be redirected shortly 🚀</p>
      </div>
    </div>
  );
};

export default InvitePageActivity;