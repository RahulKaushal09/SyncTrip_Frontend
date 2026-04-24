"use client";

import { useEffect, useState } from "react";
import { UserTripPreview } from "@/types";
import { redirectToStore } from "@/utils/redirectToStore";
import { APP_LINKS } from "@/constants";

interface Props {
  trip: UserTripPreview;
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${s.toLocaleDateString("en-IN", opts)} – ${e.toLocaleDateString("en-IN", opts)}`;
}

export default function TripPreviewClient({ trip }: Props) {
  const [redirectTimer, setRedirectTimer] = useState<number>(3);
  const [isIOS, setIsIOS] = useState(false);
  const spotsLeft = trip.maxParticipants - trip.currentParticipants;

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (redirectTimer <= 0) {
      window.location.href = isIOS
        ? APP_LINKS.APP_STORE
        : APP_LINKS.PLAY_STORE;
    } else {
      const timerId = setTimeout(() => setRedirectTimer(redirectTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [redirectTimer]);

  return (
    <div style={{ fontFamily: "'Instrument Sans', 'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Cormorant+Garamond:wght@500;600&display=swap');
        .serif { font-family: 'Cormorant Garamond', Georgia, serif; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* ── MOBILE ── */}
      {/* Removed the background color here so it doesn't paint over the fixed hero when scrolling */}
      <div className="md:hidden" style={{ marginTop: "52px" }}>

        {/* Fixed hero */}
        <div style={{ position: "fixed", inset: 0, height: "60svh", zIndex: 0, backgroundColor: "#111", marginTop: "85px" }}>
          <img
            src={trip.tripImage}
            alt={trip.tripName}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)" }} />

          {trip.tripStatus === "open" && (
            <div style={{
              position: "absolute", top: 20, left: 20,
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 12px"
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "block", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>Open</span>
            </div>
          )}

          <div style={{ position: "absolute", bottom: "10svh", left: 0, right: 0, padding: "0 24px" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>
              {trip.placeName ? `${trip.placeName}, ` : ""}{trip.locationName}
            </p>
            <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2.2rem, 9vw, 2.8rem)", fontWeight: 600, lineHeight: 1.05, margin: 0 }}>
              {trip.tripName}
            </h1>
          </div>
        </div>

        {/* Scrollable sheet */}
        <div style={{
          position: "relative",
          zIndex: 10,
          marginTop: "60svh",
          height: "85svh",   // Forces the page scroll to stop exactly 10svh from the top
          overflowY: "auto", // Enables internal scrolling once the sheet hits the top limit
          background: "#F5F4F0",
          borderRadius: "24px 24px 0 0",
          padding: "12px 24px 100px", // Adjusted padding to safely clear the fixed CTA
        }}>
          <div style={{ width: 36, height: 4, background: "#D5D4D0", borderRadius: 99, margin: "0 auto 28px" }} />

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 28 }}>
            <Stat value={trip.currentParticipants} label="Joined" />
            <div style={{ width: 1, background: "#E8E7E3", alignSelf: "stretch" }} />
            <Stat value={spotsLeft} label="Spots left" accent={spotsLeft <= 2} />
            <div style={{ width: 1, background: "#E8E7E3", alignSelf: "stretch" }} />
            <Stat value={trip.maxParticipants} label="Total" />
          </div>

          <Divider />
          <Row label="When"><span style={{ fontWeight: 600, color: "#1a1a18", fontSize: 14 }}>{formatDateRange(trip.startDate, trip.endDate)}</span></Row>
          <Divider />
          <Row label="Crew"><span style={{ fontWeight: 500, color: "#1a1a18", fontSize: 14, textTransform: "capitalize" }}>{trip.genderPreference}</span></Row>
          <Divider />
          <Row label="Visibility"><span style={{ fontWeight: 500, color: "#1a1a18", fontSize: 14, textTransform: "capitalize" }}>{trip.privacy}</span></Row>
          {trip.tripType && (<><Divider /><Row label="Type"><span style={{ fontWeight: 500, color: "#1a1a18", fontSize: 14, textTransform: "capitalize" }}>{trip.tripType}</span></Row></>)}

          {trip.tripDescription && (
            <>
              <Divider />
              <div style={{ padding: "20px 0" }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#A09F9C", textTransform: "uppercase", margin: "0 0 10px" }}>About</p>
                <p style={{ color: "#4A4946", fontSize: 15, lineHeight: 1.6, margin: 0, textWrap: "balance" }}>{trip.tripDescription}</p>
              </div>
            </>
          )}

          {trip.interests && trip.interests.length > 0 && (
            <>
              <Divider />
              <div style={{ padding: "20px 0" }}>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#A09F9C", textTransform: "uppercase", margin: "0 0 12px" }}>Vibes</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {trip.interests.map((tag) => (
                    <span key={tag} style={{ fontSize: 13, fontWeight: 500, color: "#4A4946", border: "1px solid #D5D4D0", borderRadius: 100, padding: "6px 14px", background: "#fff" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Fixed CTA */}
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: "linear-gradient(to top, #F5F4F0 70%, transparent)", padding: "20px 20px calc(20px + env(safe-area-inset-bottom))", pointerEvents: "none" }}>
          <button onClick={redirectToStore} style={{ width: "100%", background: "#1a1a18", color: "#fff", border: "none", borderRadius: 14, padding: "18px", fontSize: 15, fontWeight: 600, letterSpacing: "0.02em", cursor: "pointer", fontFamily: "inherit", pointerEvents: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
            Redirecting in {redirectTimer}s
          </button>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block" style={{ background: "#F5F4F0", minHeight: "100vh", marginTop: "24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "56px 32px 80px" }}>

          {/* Hero */}
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "3/2", marginBottom: 32, backgroundColor: "#111" }}>
            <img
              src={trip.tripImage}
              alt={trip.tripName}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9, transition: "transform 0.6s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />

            {trip.tripStatus === "open" && (
              <div style={{ position: "absolute", top: 20, left: 20, display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "7px 14px" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "block", animation: "pulse 2s infinite" }} />
                <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>Accepting Invites</span>
              </div>
            )}

            <div style={{ position: "absolute", bottom: 28, left: 32, right: 32 }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px" }}>
                {trip.placeName ? `${trip.placeName}, ` : ""}{trip.locationName}
              </p>
              <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2.2rem, 4.5vw, 3rem)", fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
                {trip.tripName}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", justifyContent: "space-around", background: "#fff", borderRadius: 16, padding: "22px 16px", marginBottom: 16, border: "1px solid #E8E7E3" }}>
            <Stat value={trip.currentParticipants} label="Joined" large />
            <div style={{ width: 1, background: "#E8E7E3" }} />
            <Stat value={spotsLeft} label="Spots left" accent={spotsLeft <= 2} large />
            <div style={{ width: 1, background: "#E8E7E3" }} />
            <Stat value={trip.maxParticipants} label="Capacity" large />
          </div>

          {/* Detail rows */}
          <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E7E3" }}>
            <DesktopRow label="When" value={formatDateRange(trip.startDate, trip.endDate)} bold />
            <DesktopRow label="Crew" value={trip.genderPreference} capitalize />
            <DesktopRow label="Visibility" value={trip.privacy} capitalize />
            {trip.tripType && <DesktopRow label="Type" value={trip.tripType} capitalize last />}
          </div>

          {trip.tripDescription && (
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#A09F9C", textTransform: "uppercase", margin: "0 0 10px" }}>About</p>
              <p style={{ color: "#4A4946", fontSize: 15, lineHeight: 1.75, margin: 0, textWrap: "balance" }}>{trip.tripDescription}</p>
            </div>
          )}

          {trip.interests && trip.interests.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#A09F9C", textTransform: "uppercase", margin: "0 0 12px" }}>Vibes</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {trip.interests.map((tag) => (
                  <span key={tag}
                    style={{ fontSize: 13, fontWeight: 500, color: "#4A4946", border: "1px solid #D5D4D0", borderRadius: 100, padding: "6px 16px", background: "#fff", transition: "all 0.15s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1a1a18"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#1a1a18"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#4A4946"; e.currentTarget.style.borderColor = "#D5D4D0"; }}
                  >{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #E0DFD9" }}>
            <button
              onClick={redirectToStore}
              style={{ width: "100%", background: "#1a1a18", color: "#fff", border: "none", borderRadius: 14, padding: "18px", fontSize: 15, fontWeight: 600, letterSpacing: "0.03em", cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s, transform 0.15s", boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              Redirecting in {redirectTimer}s
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function Stat({ value, label, accent = false, large = false }: { value: number; label: string; accent?: boolean; large?: boolean }) {
  return (
    <div style={{ textAlign: "center", padding: "0 16px" }}>
      <p className="serif" style={{ fontSize: large ? "2rem" : "1.7rem", fontWeight: 600, color: accent ? "#E5484D" : "#1a1a18", margin: 0, lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: 10, fontWeight: 600, color: "#A09F9C", letterSpacing: "0.12em", textTransform: "uppercase", margin: "6px 0 0" }}>{label}</p>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "#E8E7E3" }} />;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#A09F9C", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
      {children}
    </div>
  );
}

function DesktopRow({ label, value, bold, capitalize, last }: { label: string; value: string; bold?: boolean; capitalize?: boolean; last?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: last ? "none" : "1px solid #E8E7E3" }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "#A09F9C", letterSpacing: "0.12em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: bold ? 600 : 500, color: "#1a1a18", textTransform: capitalize ? "capitalize" : "none" }}>{value}</span>
    </div>
  );
}