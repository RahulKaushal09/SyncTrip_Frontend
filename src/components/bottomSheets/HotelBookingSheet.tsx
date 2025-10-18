'use client';

import React, { useEffect, useRef } from "react";

type Props = {
  visible: boolean;
  onClose: () => void;
  hotelName: string;
  hotelLinks?: string[];
};

const SCREEN_PERCENT = 0.55; // sheet height fraction of viewport

export default function HotelBookingSheet({ visible, onClose, hotelName, hotelLinks = [] }: Props) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && visible) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible, onClose]);

  const extractPlatform = (url: string) => {
    try {
      const host = new URL(url).host.toLowerCase();
      if (host.includes("booking.com")) return "BOOKING.COM";
      if (host.includes("agoda.com")) return "AGODA";
      if (host.includes("ixigo.com")) return "IXIGO";
      if (host.includes("makemytrip")) return "MAKE MY TRIP";
      if (host.includes("tripadvisor")) return "TRIPADVISOR";
      if (host.includes("bluepillow")) return "BLUEPILLOW";
      let hostName = host.replace(/^www\./, "");
      hostName = hostName.replace(/\.(com|in|net|co|org).*$/, "");
      if (hostName.length > 20) hostName = hostName.slice(0, 20) + "...";
      return hostName.toUpperCase();
    } catch {
      return "LINK";
    }
  };

  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!visible}
        onClick={onClose}
        style={{
          ...sheetStyles.backdrop,
          opacity: visible ? 0.5 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 240ms ease",
        }}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal
        style={{
          ...sheetStyles.sheet,
          transform: visible ? "translateY(0)" : `translateY(calc(100vh - ${SCREEN_PERCENT * 100}vh))`,
          transition: "transform 300ms ease",
          height: `${Math.round(SCREEN_PERCENT * 100)}vh`,
        }}
      >
        <div style={sheetStyles.content}>
          <div style={sheetStyles.title}>{hotelName}</div>
          <div style={sheetStyles.subtitle}>Book this hotel from</div>

          <div style={sheetStyles.linksList}>
            {hotelLinks.length === 0 && <div style={sheetStyles.empty}>No booking links available</div>}
            {hotelLinks.map((link, idx) => {
              const platform = extractPlatform(link);
              return (
                <div key={idx} style={sheetStyles.linkRow}>
                  <div style={sheetStyles.platformText}>{platform}</div>
                  <button style={sheetStyles.bookButton} onClick={() => openLink(link)}>
                    <span style={sheetStyles.bookButtonText}>Book Now</span>
                  </button>
                </div>
              );
            })}
          </div>

          <button style={sheetStyles.closeBtn} onClick={onClose}>
            <span style={{ ...sheetStyles.closeText }}>Close</span>
          </button>
        </div>
      </div>
    </>
  );
}

/* const styles for sheet */
const sheetStyles: { [k: string]: React.CSSProperties } = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "#000",
    zIndex: 1200,
  },
  sheet: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "var(--card-bg, #fff)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 1300,
    boxShadow: "0 -8px 24px rgba(0,0,0,0.12)",
    overflow: "auto",
    display: "flex",
    alignItems: "flex-start",
  },
  content: {
    padding: 20,
    width: "100%",
    boxSizing: "border-box",
  },
  title: { fontSize: 18, fontWeight: 700, textAlign: "center", marginBottom: 4 },
  subtitle: { textAlign: "center", color: "#666", marginBottom: 18 },
  linksList: { display: "flex", flexDirection: "column", gap: 10 },
  empty: { color: "#666", textAlign: "center", padding: 12 },
  linkRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#eee",
    borderRadius: 10,
    padding: "10px 14px",
    background: "transparent",
  },
  platformText: { fontWeight: 700, fontSize: 15, color: "var(--text, #111)" },
  bookButton: {
    backgroundColor: "var(--primary-1)",
    borderRadius: 8,
    padding: "6px 12px",
    border: "none",
    cursor: "pointer",
  },
  bookButtonText: { color: "#fff", fontWeight: 700 },
  closeBtn: { display: "block", margin: "12px auto 0", background: "transparent", border: "none", cursor: "pointer" },
  closeText: { color: "var(--primary-1)", fontWeight: 600 },
};
