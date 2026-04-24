"use client";

import { use, useEffect, useState } from "react";
import { PlanPreview } from "@/types";
import { redirectToStore } from "@/utils/redirectToStore";
import { APP_LINKS } from "@/constants";

interface Props {
    plan: PlanPreview;
    type: string; // "sports" | "riders" | "outing" | "hangout" | "movies" | etc.
}

const TYPE_META: Record<string, { label: string; icon: string; color: string; fallbackBg: string; fallbackEmoji: string }> = {
    sports: { label: "Sports", icon: "⚡", color: "#3B82F6", fallbackBg: "#22c55e", fallbackEmoji: "⚽" }, // Green
    riders: { label: "Ride", icon: "🏍", color: "#F59E0B", fallbackBg: "#1a1a18", fallbackEmoji: "🏍️" },
    outing: { label: "Outing", icon: "✦", color: "#8B5CF6", fallbackBg: "#eab308", fallbackEmoji: "🍵" }, // Yellow
    hangout: { label: "Hangout", icon: "🤝", color: "#F59E0B", fallbackBg: "#eab308", fallbackEmoji: "👋" }, // Yellow
    movies: { label: "Movie", icon: "◈", color: "#EC4899", fallbackBg: "#1a1a18", fallbackEmoji: "🍿" },
};

function getMeta(type: string) {
    return TYPE_META[type.toLowerCase()] ?? {
        label: type,
        icon: "●",
        color: "#6B7280",
        fallbackBg: "#1a1a18",
        fallbackEmoji: "✨"
    };
}

function formatSchedule(date: string | Date | null, time: string | null) {
    if (!date) return null;
    const d = new Date(date);
    const datePart = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    if (!time) return datePart;

    // time is like "evening", "morning", etc. Capitalize the first letter.
    const formattedTime = time.charAt(0).toUpperCase() + time.toLowerCase().slice(1);
    return `${datePart} · ${formattedTime}`;
}

export default function PlanPreviewClient({ plan, type }: Props) {
    const [redirectTimer, setRedirectTimer] = useState<number>(3);
    const [isIOS, setIsIOS] = useState<boolean>(false);
    const meta = getMeta(type);
    const spotsLeft = plan.maxMembers != null && plan.membersCount != null
        ? plan.maxMembers - plan.membersCount
        : null;
    const scheduleStr = formatSchedule(plan.scheduleDate, plan.scheduleTime);

    useEffect(() => {
        const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as { opera?: string }).opera || "";
        setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as { MSStream?: unknown }).MSStream);
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
            <div className="md:hidden" style={{ marginTop: "52px" }}>

                {/* Fixed hero */}
                <div style={{ position: "fixed", inset: 0, height: "60svh", zIndex: 0, backgroundColor: meta.fallbackBg, marginTop: "85px" }}>
                    {plan.image ? (
                        <img
                            src={plan.image}
                            alt={plan.title}
                            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9 }}
                        />
                    ) : (
                        <div style={{ width: "100%", height: "100%", background: meta.fallbackBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: "6rem", filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))" }}>
                                {meta.fallbackEmoji}
                            </span>
                        </div>
                    )}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.75) 100%)" }} />

                    {/* Type badge */}
                    <div style={{
                        position: "absolute", top: 20, left: 20,
                        display: "flex", alignItems: "center", gap: 6,
                        background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "6px 12px"
                    }}>
                        <span style={{ fontSize: 12 }}>{meta.icon}</span>
                        <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>{meta.label}</span>
                    </div>

                    <div style={{ position: "absolute", bottom: "10svh", left: 0, right: 0, padding: "0 24px" }}>
                        {plan.locationName && (
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 6px" }}>
                                {plan.venueName ? `${plan.venueName}, ` : ""}{plan.locationName}
                            </p>
                        )}
                        <h1 className="uppercase font-sans" style={{ color: "#fff", fontSize: "clamp(2.2rem, 9vw, 2.8rem)", fontWeight: 600, lineHeight: 1.05, margin: 0 }}>
                            {plan.title}
                        </h1>
                    </div>
                </div>

                {/* Scrollable sheet */}
                <div style={{
                    position: "relative",
                    zIndex: 10,
                    marginTop: "60svh",
                    height: "85svh",
                    overflowY: "auto",
                    background: "#F5F4F0",
                    borderRadius: "24px 24px 0 0",
                    padding: "12px 24px 100px",
                }}>
                    <div style={{ width: 36, height: 4, background: "#D5D4D0", borderRadius: 99, margin: "0 auto 28px" }} />

                    {/* Stats */}
                    {(plan.membersCount != null || plan.maxMembers != null) && (
                        <>
                            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: 28 }}>
                                {plan.membersCount != null && <Stat value={plan.membersCount} label="Joined" />}
                                {plan.membersCount != null && spotsLeft != null && <div style={{ width: 1, background: "#E8E7E3", alignSelf: "stretch" }} />}
                                {spotsLeft != null && <Stat value={spotsLeft} label="Spots left" accent={spotsLeft <= 2} />}
                                {plan.maxMembers != null && spotsLeft != null && <div style={{ width: 1, background: "#E8E7E3", alignSelf: "stretch" }} />}
                                {plan.maxMembers != null && <Stat value={plan.maxMembers} label="Total" />}
                            </div>
                            <Divider />
                        </>
                    )}

                    {scheduleStr && (
                        <>
                            <Row label="When"><span style={{ fontWeight: 600, color: "#1a1a18", fontSize: 14 }}>{scheduleStr}</span></Row>
                            <Divider />
                        </>
                    )}
                    {plan.venueName && (
                        <>
                            <Row label="Venue"><span style={{ fontWeight: 500, color: "#1a1a18", fontSize: 14 }}>{plan.venueName}</span></Row>
                            <Divider />
                        </>
                    )}
                    {plan.genderPreference && (
                        <>
                            <Row label="Crew"><span style={{ fontWeight: 500, color: "#1a1a18", fontSize: 14, textTransform: "capitalize" }}>{plan.genderPreference}</span></Row>
                        </>
                    )}

                    {plan.description && (
                        <>
                            <Divider />
                            <div style={{ padding: "20px 0" }}>
                                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#A09F9C", textTransform: "uppercase", margin: "0 0 10px" }}>About</p>
                                <p style={{ color: "#4A4946", fontSize: 15, lineHeight: 1.6, margin: 0 }}>{plan.description}</p>
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
                    <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", aspectRatio: "3/2", marginBottom: 32, backgroundColor: meta.fallbackBg }}>
                        {plan.image ? (
                            <img
                                src={plan.image}
                                alt={plan.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: 0.9, transition: "transform 0.6s ease" }}
                                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                            />
                        ) : (
                            <div style={{ width: "100%", height: "100%", background: meta.fallbackBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <span style={{ fontSize: "8rem", filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))" }}>
                                    {meta.fallbackEmoji}
                                </span>
                            </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)" }} />

                        {/* Type badge */}
                        <div style={{ position: "absolute", top: 20, left: 20, display: "flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 100, padding: "7px 14px" }}>
                            <span style={{ fontSize: 13 }}>{meta.icon}</span>
                            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>{meta.label}</span>
                        </div>

                        <div style={{ position: "absolute", bottom: 28, left: 32, right: 32 }}>
                            {plan.locationName && (
                                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 8px" }}>
                                    {plan.venueName ? `${plan.venueName}, ` : ""}{plan.locationName}
                                </p>
                            )}
                            <h1 className="serif" style={{ color: "#fff", fontSize: "clamp(2.2rem, 4.5vw, 3rem)", fontWeight: 600, lineHeight: 1.1, margin: 0 }}>
                                {plan.title}
                            </h1>
                        </div>
                    </div>

                    {/* Stats */}
                    {(plan.membersCount != null || plan.maxMembers != null) && (
                        <div style={{ display: "flex", justifyContent: "space-around", background: "#fff", borderRadius: 16, padding: "22px 16px", marginBottom: 16, border: "1px solid #E8E7E3" }}>
                            {plan.membersCount != null && <Stat value={plan.membersCount} label="Joined" large />}
                            {plan.membersCount != null && spotsLeft != null && <div style={{ width: 1, background: "#E8E7E3" }} />}
                            {spotsLeft != null && <Stat value={spotsLeft} label="Spots left" accent={spotsLeft <= 2} large />}
                            {plan.maxMembers != null && spotsLeft != null && <div style={{ width: 1, background: "#E8E7E3" }} />}
                            {plan.maxMembers != null && <Stat value={plan.maxMembers} label="Capacity" large />}
                        </div>
                    )}

                    {/* Detail rows */}
                    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: "1px solid #E8E7E3" }}>
                        {scheduleStr && <DesktopRow label="When" value={scheduleStr} bold />}
                        {plan.venueName && <DesktopRow label="Venue" value={plan.venueName} />}
                        {plan.locationName && <DesktopRow label="Location" value={plan.locationName} />}
                        {plan.genderPreference && <DesktopRow label="Crew" value={plan.genderPreference} capitalize last />}
                    </div>

                    {plan.description && (
                        <div style={{ marginTop: 28 }}>
                            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", color: "#A09F9C", textTransform: "uppercase", margin: "0 0 10px" }}>About</p>
                            <p style={{ color: "#4A4946", fontSize: 15, lineHeight: 1.75, margin: 0 }}>{plan.description}</p>
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