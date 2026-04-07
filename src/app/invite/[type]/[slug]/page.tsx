"use client";

import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const InvitePageActivity = () => {
  const { type, slug } = useParams();

  useEffect(() => {
    if (!type || !slug) return;

    debugger;

    const appUrl = `synctrip://invite/${type}/${slug}`;
    const playStoreUrl =
      "https://play.google.com/store/apps/details?id=com.synctrip";
    const appStoreUrl =
      "https://play.google.com/store/apps/details?id=com.synctrip"; // replace this

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

    // Try opening app
    window.location.href = appUrl;

    // Fallback
    const timer = setTimeout(() => {
      if (!hasOpenedApp) {
        if (isAndroid) {
          window.location.href = playStoreUrl;
        } else if (isIOS) {
          window.location.href = appStoreUrl;
        } else {
          // Desktop fallback (optional)
          window.location.href = "https://play.google.com/store/apps/details?id=com.synctrip";
        }
      }
    }, 1800);

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