"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./BentoFeatures.module.css";

/* ── 1. Radar card visual ────────────────────────────────────────────── */
const RadarVisual = () => {
  const [pinging, setPinging] = useState(false);

  const handlePing = () => {
    if (pinging) return;
    setPinging(true);
    setTimeout(() => setPinging(false), 2000);
  };

  return (
    <>
      <div className={`${styles.radarWrap} ${pinging ? styles.radarPingActive : ""}`}>
        <div className={styles.radarGrid} />
        <div className={styles.radarRings}>
          <span className={styles.ring} style={{ ["--d" as string]: "0s" }} />
          <span className={styles.ring} style={{ ["--d" as string]: "0.6s" }} />
          <span className={styles.ring} style={{ ["--d" as string]: "1.2s" }} />
        </div>
        <div className={styles.radarPins}>
          <span className={`${styles.pin} ${styles.pinCenter}`} />
          <span className={`${styles.pin} ${styles.pinA}`} />
          <span className={`${styles.pin} ${styles.pinB}`} />
          <span className={`${styles.pin} ${styles.pinC}`} />
        </div>
        <div className={styles.radarBeam} />
      </div>
      <button className={`${styles.actionBtn} ${styles.btnBlue}`} onClick={handlePing}>
        {pinging ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Scanning...
          </>
        ) : "Scan Area"}
      </button>
    </>
  );
};

/* ── 2. Match card visual ────────────────────────────────────────────── */
const MatchVisual = () => {
  const tags = ["Solo traveller", "Adventure", "Foodie", "Offbeat"];
  const dummyNames = ["Rahul", "Sneha", "Aman", "Kriti", "Vikram", "Neha", "Priya"];
  
  const [phase, setPhase] = useState<"idle" | "searching" | "found">("idle");
  const [displayName, setDisplayName] = useState("?");

  const handleMatch = () => {
    if (phase !== "idle") return;
    setPhase("searching");
    
    let ticks = 0;
    const interval = setInterval(() => {
      setDisplayName(dummyNames[ticks % dummyNames.length].charAt(0));
      ticks++;
      
      if (ticks > 15) {
        clearInterval(interval);
        setPhase("found");
        setDisplayName("P"); // Priya
        setTimeout(() => {
          setPhase("idle");
          setDisplayName("?");
        }, 5000);
      }
    }, 80);
  };

  return (
    <>
      <div className={`${styles.matchWrap} ${phase === 'searching' ? styles.matchStateSearching : phase === 'found' ? styles.matchStateFound : ''}`}>
        <div className={styles.avatarRow}>
          <div className={`${styles.avatar} ${styles.avatarYou}`}>You</div>
          <div className={`${styles.matchLine} ${phase === 'found' ? styles.matchLineActive : ''}`}>
            <span className={styles.matchPulse} />
          </div>
          <div className={`${styles.avatar} ${styles.avatarThem} ${phase === 'found' ? styles.avatarThemActive : ''}`}>
            {displayName}
          </div>
        </div>
        
        <div className={`${styles.tagCloud} ${phase !== 'idle' ? styles.tagCloudHidden : ''}`}>
          {tags.map((t, i) => (
            <span key={t} className={styles.vibeTag}>{t}</span>
          ))}
        </div>

        <div className={`${styles.matchDetailsBox} ${phase === 'found' ? styles.matchDetailsBoxVisible : ''}`}>
          Priya • Manali • Oct 12
        </div>
      </div>
      <button 
        className={`${styles.actionBtn} ${styles.btnPink}`} 
        onClick={handleMatch}
        disabled={phase !== 'idle'}
      >
        {phase === 'searching' ? 'Finding Twin...' : phase === 'found' ? 'Matched!' : 'Find Match'}
      </button>
    </>
  );
};

/* ── 3. Intro message visual ─────────────────────────────────────────── */
const IntroVisual = () => {
  const [status, setStatus] = useState<"idle" | "accepted" | "declined">("idle");

  const handleAction = (type: "accepted" | "declined") => {
    if (status !== "idle") return;
    setStatus(type);
    setTimeout(() => setStatus("idle"), 5000);
  };

  const particles = Array.from({ length: 16 }).map((_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const velocity = 80 + Math.random() * 40;
    return {
      tx: `${Math.cos(angle) * velocity}px`,
      ty: `${Math.sin(angle) * velocity}px`,
    };
  });

  return (
    <div className={`${styles.introWrap} ${status === 'accepted' ? styles.stateAccepted : status === 'declined' ? styles.stateDeclined : ''}`}>
      <div className={styles.introCard}>
        <div className={styles.introAvatar}>A</div>
        <div className={styles.introContent}>
          <div className={styles.introName}>Aryan S.</div>
          <div className={styles.introMsg}>"Hey! Saw you're into morning rides — heading to Kasauli Sunday, wanna join?"</div>
        </div>
      </div>

      <div className={styles.introBtns}>
        <button className={`${styles.introBtn} ${styles.introBtnAccept}`} onClick={() => handleAction("accepted")}>
          Accept ✓
        </button>
        <button className={`${styles.introBtn} ${styles.introBtnDecline}`} onClick={() => handleAction("declined")}>
          Decline ✕
        </button>
      </div>

      <div className={styles.successMsg}>
        Connection Accepted! 🎉
      </div>

      <div className={`${styles.particleOverlay} ${status === 'declined' ? styles.explode : ''}`}>
        {particles.map((p, i) => (
          <span key={i} className={styles.particle} style={{ ["--tx" as string]: p.tx, ["--ty" as string]: p.ty }} />
        ))}
      </div>
    </div>
  );
};

/* ── 4. Safety card visual ───────────────────────────────────────────── */
const SafetyVisual = () => {
  const [secure, setSecure] = useState(false);

  const toggleShield = () => {
    if (secure) return;
    setSecure(true);
    setTimeout(() => setSecure(false), 4000);
  };

  return (
    <>
      <div className={`${styles.safetyWrap} ${secure ? styles.shieldActive : ''}`}>
        <div className={styles.shieldOuter}>
          <div className={styles.shieldInner}>
            <svg width="40" height="44" viewBox="0 0 36 40" fill="none">
              <path d="M18 2L3 8.5V20C3 29 10.5 37 18 39C25.5 37 33 29 33 20V8.5L18 2Z"
                fill="currentColor" fillOpacity={secure ? "1" : "0.1"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 20l4 4 8-8" stroke={secure ? "#fff" : "currentColor"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className={styles.safetyChips}>
          <span className={styles.safetyChip}>Block</span>
          <span className={styles.safetyChip}>Report</span>
          <span className={styles.safetyChip}>Verify</span>
        </div>
      </div>
      <button className={`${styles.actionBtn} ${styles.btnRed}`} onClick={toggleShield}>
        {secure ? "Shield Active" : "Activate Shield"}
      </button>
    </>
  );
};

/* ── Main Section ────────────────────────────────────────────────────── */
const BentoFeatures = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={`container-custom ${styles.section}`}>
      <div className={styles.contentWrap}>
        <header className={styles.header}>
          <span className={styles.kicker}>The Startup Way</span>
          <h2 className={styles.title}>
            Everything you need<br />to sync up.
          </h2>
          <p className={styles.subtitle}>
            No endless group chats. No cold intros. Just seamless planning, real connections, and the freedom to explore.
          </p>
        </header>

        <div className={styles.bentoGrid} ref={ref}>
          {/* Card 1 */}
          <article className={`${styles.bentoCard} ${styles.span2} ${styles.cardRadar} ${visible ? styles.cardVisible : ""}`} style={{ ["--delay" as string]: "0s" }}>
            <div className={styles.cardInfo}>
              <span className={`${styles.cardAccent} ${styles.accentPrimary}`}>Explore</span>
              <h3 className={styles.cardTitle}>Plans Nearby, Right Now</h3>
              <p className={styles.cardDesc}>See what's happening around you in real-time. Tap to ping and join instantly.</p>
            </div>
            <div className={styles.visualContainer}>
              <RadarVisual />
            </div>
          </article>

          {/* Card 2 */}
          <article className={`${styles.bentoCard} ${styles.cardMatch} ${visible ? styles.cardVisible : ""}`} style={{ ["--delay" as string]: "0.1s" }}>
            <div className={styles.cardInfo}>
              <span className={`${styles.cardAccent} ${styles.accentPink}`}>Match</span>
              <h3 className={styles.cardTitle}>Find Your Travel Twin</h3>
              <p className={styles.cardDesc}>Interests, travel style, vibe — see who gets it.</p>
            </div>
            <div className={styles.visualContainer}>
              <MatchVisual />
            </div>
          </article>

          {/* Card 3 */}
          <article className={`${styles.bentoCard} ${styles.cardSafety} ${visible ? styles.cardVisible : ""}`} style={{ ["--delay" as string]: "0.18s" }}>
            <div className={styles.cardInfo}>
              <span className={`${styles.cardAccent} ${styles.accentDanger}`}>Safe</span>
              <h3 className={styles.cardTitle}>Your Safety, Always First</h3>
              <p className={styles.cardDesc}>Zero tolerance, zero friction. Instantly secure your space.</p>
            </div>
            <div className={styles.visualContainer}>
              <SafetyVisual />
            </div>
          </article>

          {/* Card 4 */}
          <article className={`${styles.bentoCard} ${styles.span2} ${styles.cardIntro} ${visible ? styles.cardVisible : ""}`} style={{ ["--delay" as string]: "0.26s" }}>
            <div className={styles.cardInfo}>
              <span className={`${styles.cardAccent} ${styles.accentSuccess}`}>Connect</span>
              <h3 className={styles.cardTitle}>Intro First, Then Connect</h3>
              <p className={styles.cardDesc}>Every request comes with context so you never have to guess.</p>
            </div>
            <div className={styles.visualContainer}>
              <IntroVisual />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;