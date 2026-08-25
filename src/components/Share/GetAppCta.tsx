"use client";

import React, { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { APP_LINKS } from "@/constants";
import { appOpenUrl, detectPlatform, isCrawler, openApp } from "@/utils/appDeepLink";

type Props = {
  /** Path of this page, e.g. "/share/club-event/evt_1" - what the app should open. */
  appPath: string;
  label?: string;
  note?: string;
  /** Seconds before the phone is sent to the app / store. 0 disables the timer. */
  redirectSeconds?: number;
};

/**
 * The "open the app" CTA, with the same timed hand-off PlanPreviewClient uses
 * on invite links - five seconds here instead of three.
 *
 * Three differences from that one, each deliberate:
 *
 * - It is an anchor, not a button. Long-press, open-in-new-tab and the OS share
 *   sheet all work, and the link is not dead if JavaScript fails.
 * - The timer only runs on phones. These pages are meant to rank, and a desktop
 *   visitor - or Googlebot, which executes JS - being thrown at the Play Store
 *   turns an indexable event page into a redirect.
 * - There is a way out. An auto-redirect with no escape hatch is why people
 *   bounce back to the chat they came from.
 */
export default function GetAppCta({
  appPath,
  label = "Get the SyncTrip app",
  note,
  redirectSeconds = 5,
}: Props) {
  const [href, setHref] = useState<string>(APP_LINKS.PLAY_STORE);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    setHref(appOpenUrl(appPath));
    if (redirectSeconds > 0 && detectPlatform() !== "desktop" && !isCrawler()) {
      setCountdown(redirectSeconds);
    }
  }, [appPath, redirectSeconds]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      openApp(appPath);
      return;
    }
    const timerId = setTimeout(() => setCountdown((value) => (value === null ? null : value - 1)), 1000);
    return () => clearTimeout(timerId);
  }, [countdown, appPath]);

  return (
    <>
      <a
        href={href}
        rel="noopener"
        onClick={() => setCountdown(null)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "15px 28px",
          borderRadius: "100px",
          background: "linear-gradient(135deg, #4bbef5, #F3359E)",
          color: "#ffffff",
          fontSize: "0.95rem",
          fontWeight: 800,
          textDecoration: "none",
          boxShadow: "0 12px 30px rgba(75, 190, 245, 0.3)",
        }}
      >
        {countdown !== null && countdown > 0 ? `${label} · ${countdown}s` : label}
        <ArrowRight size={18} aria-hidden="true" />
      </a>

      {countdown !== null && countdown > 0 && (
        <button
          type="button"
          onClick={() => setCountdown(null)}
          style={{
            display: "block",
            margin: "0.75rem auto 0",
            background: "none",
            border: "none",
            padding: 0,
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.8rem",
            fontWeight: 600,
            textDecoration: "underline",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Stay on this page
        </button>
      )}

      {note && (
        <p style={{ margin: "0.85rem 0 0", fontSize: "0.82rem", lineHeight: 1.55, color: "rgba(255,255,255,0.6)" }}>
          {note}
        </p>
      )}
    </>
  );
}
