"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Copy, Check, Smartphone, Download } from "lucide-react";
import { getStoreUrl } from "@/utils/redirectToStore";
import { APP_LINKS } from "@/constants";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || navigator.vendor || "";
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";
  if (/android/i.test(ua)) return "android";
  return "desktop";
}

interface ReferralCTAProps {
  /** Raw 8-char referral code — written verbatim to the clipboard. */
  code: string;
  /** Full invite URL, encoded into the desktop QR. */
  inviteUrl: string;
  /** Pre-rendered QR data URL (generated server-side, shown on desktop only). */
  qrDataUrl: string | null;
}

export default function ReferralCTA({ code, inviteUrl, qrDataUrl }: ReferralCTAProps) {
  // SSR-safe defaults; resolved on mount once navigator is available.
  const [platform, setPlatform] = useState<Platform>("desktop");
  const [storeUrl, setStoreUrl] = useState<string>(APP_LINKS.WEB_HOME);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPlatform(detectPlatform());
    setStoreUrl(getStoreUrl());
  }, []);

  const writeCode = () => {
    // Raw code only — must match byte-for-byte what the app reads on signup.
    navigator.clipboard?.writeText(code).catch(() => {
      // Silent fail — the code is shown on-screen for manual entry.
    });
  };

  const handleCopy = () => {
    writeCode();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // CTA is a real <a href> so it works even if JS fails. On tap we also write
  // the code to the clipboard (inside the user gesture, so iOS Safari allows
  // it); the store opens as a separate app, leaving this page to finish the
  // clipboard write.
  return (
    <div className="flex flex-col gap-4">
      {/* Code display + copy */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-1/50 mb-2">
          Your referral code
        </p>
        <div className="flex items-stretch gap-2">
          <div className="flex-1 flex items-center justify-center rounded-2xl bg-secondary-5 border border-neutral-4 px-4 py-4">
            <span className="font-mono text-2xl md:text-3xl font-extrabold tracking-[0.25em] text-secondary-1 select-all">
              {code}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy referral code"
            className="shrink-0 flex items-center gap-2 rounded-2xl border border-primary-2 bg-primary-5 px-4 text-primary-1 font-semibold hover:bg-primary-2/30 transition-colors"
          >
            {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
            <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      {platform === "desktop" ? (
        /* Desktop: can't install here — show QR to continue on phone. */
        <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-neutral-4 bg-white p-5">
          {qrDataUrl ? (
            <Image
              src={qrDataUrl}
              alt="Scan to open this invite on your phone"
              width={160}
              height={160}
              unoptimized
              className="rounded-xl"
            />
          ) : null}
          <p className="text-sm text-secondary-1/75 leading-relaxed max-w-[260px]">
            Scan this with your phone to install SyncTrip and claim your invite.
          </p>
          <div className="flex gap-3">
            <a
              href={APP_LINKS.APP_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary-1 underline"
            >
              App Store
            </a>
            <a
              href={APP_LINKS.PLAY_STORE}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-primary-1 underline"
            >
              Google Play
            </a>
          </div>
        </div>
      ) : (
        /* Mobile: primary install CTA. */
        <a
          href={storeUrl}
          onClick={writeCode}
          className="btn btn-primary !h-[56px] !flex items-center justify-center gap-2 shadow-lg shadow-primary-1/20"
        >
          {platform === "ios" ? <Smartphone size={18} /> : <Download size={18} />}
          <span className="b2">Get the app</span>
        </a>
      )}

      {/* Manual entry hint — clipboard can silently fail on some browsers. */}
      <p className="text-center text-xs text-neutral-1/70 leading-relaxed">
        After installing, your code is copied automatically. If it isn&apos;t
        filled in, enter <span className="font-mono font-semibold">{code}</span>{" "}
        on the signup screen.
      </p>

      {/* Hidden but present for screen readers / fallback. */}
      <span className="sr-only">Invite link: {inviteUrl}</span>
    </div>
  );
}
