"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  tripId?: string | null;
  count?: number; // number of matching users (badge)
  loading?: boolean;
  onClickOpen?: () => void; // callback — if provided, component will call and NOT navigate
  tooltipText?: string; // override tooltip
  ariaLabel?: string;
};

export default function MatchingUsersIcon({
  className = "",
  tripId = null,
  count = 0,
  loading = false,
  onClickOpen,
  tooltipText = "It's about matching",
  ariaLabel = "Open matching",
}: Props) {
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  const openMatching = () => {
    if (onClickOpen) {
      onClickOpen();
      return;
    }

    // default behaviour: navigate to matching page for the current trip
    if (tripId) {
      router.push(`/matching?tripId=${tripId}`);
    } else {
      router.push(`/matching`);
    }
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }} className={className}>
      <button
        aria-label={ariaLabel}
        title={tooltipText}
        onClick={openMatching}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        style={{
          position: "relative",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* 3-person group icon (accessible, simple SVG) */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM8 11c1.657 0 3-1.343 3-3S9.657 5 8 5 5 6.343 5 8s1.343 3 3 3zM8 13c-2.667 0-8 1.333-8 4v2h9.5c-.334-.667-.5-1.333-.5-2 0-1.333.667-2.667 2.5-3.5C12.167 13.667 10.167 13 8 13z" fill="currentColor"/>
          <path d="M22 17c0-1.667-5.333-4-8-4  -2.167 0-4.167.667-4.5 3.5 1.833.833 2.5 2.167 2.5 3.5 0 .667-.167 1.333-.5 2H22v-5z" fill="currentColor"/>
        </svg>

        {/* badge */}
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              minWidth: 18,
              height: 18,
              padding: "0 4px",
              borderRadius: 9,
              fontSize: 11,
              lineHeight: "18px",
              textAlign: "center",
              background: "#ef4444",
              color: "#fff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
              pointerEvents: "none",
            }}
            aria-hidden
          >
            {count > 99 ? "99+" : count}
          </span>
        )}

        {/* small loading dot */}
        {loading && (
          <span
            style={{
              position: "absolute",
              bottom: -3,
              right: -3,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: "#10b981",
              boxShadow: "0 0 6px rgba(16,185,129,0.7)",
            }}
            aria-hidden
          />
        )}
      </button>

      {/* Tooltip — simple, no external libs */}
      <div
        role="tooltip"
        aria-hidden={!showTooltip}
        style={{
          pointerEvents: "none",
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.85)",
          color: "#fff",
          padding: "6px 8px",
          borderRadius: 6,
          fontSize: 12,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          opacity: showTooltip ? 1 : 0,
          transition: "opacity 120ms ease, transform 120ms ease",
          transformOrigin: "center bottom",
          zIndex: 1000,
        }}
      >
        {tooltipText}
      </div>
    </div>
  );
}
