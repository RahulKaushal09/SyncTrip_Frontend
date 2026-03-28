"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import styles from "./FeatureScroll.module.css";
import { useRouter } from "next/navigation";

import ridersImage from "@/assets/images/ridersImage.png";
import sportsImage from "@/assets/images/sportsImage.png";
import outingImage from "@/assets/images/outingImage.png";
import moviesImage from "@/assets/images/moviesImage.png";

const features = [
  {
    id: "riders",
    kicker: "Motorcycle Communities",
    title: "Find your riding tribe.",
    bullets: [
      { icon: "🏍️", text: "Join rider groups that match your pace & vibe" },
      { icon: "🧭", text: "Create your own crew and plan rides together" },
      { icon: "👥", text: "Connect with bikers who ride like you do" },
    ],
    tag: "Most Active",
    btnText: "Explore Rider Groups",
    imageUrl: ridersImage.src,
    caption: "Weekend Riders • 120+ members",
    accent: "#3b82f6",
    styleVars: { "--rot": "-4deg", "--x": "0px", "--y": "0px", "--tape-rot": "-2deg", zIndex: 1 }
  },
  {
    id: "movies",
    kicker: "Film Circles",
    title: "Watch with people who get it.",
    bullets: [
      { icon: "🎬", text: "Join communities built around film tastes" },
      { icon: "💬", text: "Discuss, review, and share recommendations" },
      { icon: "🍿", text: "Plan screenings together, not alone" },
    ],
    tag: "New",
    btnText: "Join Film Groups",
    imageUrl: moviesImage.src,
    caption: "Bollywood Film Club • 80+ members",
    accent: "#f59e0b",
    styleVars: { "--rot": "3deg", "--x": "12px", "--y": "25px", "--tape-rot": "4deg", zIndex: 2 }
  },
  {
    id: "sports",
    kicker: "Sports Communities",
    title: "Build your squad.",
    bullets: [
      { icon: "⚽", text: "Join teams and groups by skill level" },
      { icon: "📅", text: "Organize matches and practice sessions" },
      { icon: "🏆", text: "Grow together, compete together" },
    ],
    tag: "Trending",
    btnText: "Find Your Team",
    imageUrl: sportsImage.src,
    caption: "Sport Squad • 60+ players",
    accent: "#10b981",
    styleVars: { "--rot": "-2deg", "--x": "-8px", "--y": "50px", "--tape-rot": "-5deg", zIndex: 3 }
  },
  {
    id: "outing",
    kicker: "Social Circles",
    title: "Meet your kind of people.",
    bullets: [
      { icon: "☕", text: "Join small groups for chill hangouts" },
      { icon: "🎵", text: "Find people for gigs, cafes & city walks" },
      { icon: "🌆", text: "Turn casual plans into lasting friendships" },
    ],
    tag: "Editor's Pick",
    btnText: "Discover Circles",
    imageUrl: outingImage.src,
    caption: "City Vibes • 95+ members",
    accent: "#ec4899",
    styleVars: { "--rot": "5deg", "--x": "20px", "--y": "75px", "--tape-rot": "2deg", zIndex: 4 }
  }
];

const FeatureScroll = () => {
  const [desktopIndex, setDesktopIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const router = useRouter();

  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mobileTrackRef = useRef<HTMLDivElement | null>(null);

  // Desktop Observer: Triggers when text blocks scroll into view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -40% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = textRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) setDesktopIndex(index);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    textRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  // Mobile Observer: Triggers when horizontal image carousel snaps into view
  useEffect(() => {
    const observerOptions = {
      root: mobileTrackRef.current,
      rootMargin: "0px",
      threshold: 0.6 // Trigger when at least 60% of the card is visible
    };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = mobileImageRefs.current.findIndex((ref) => ref === entry.target);
          if (index !== -1) setMobileIndex(index);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    mobileImageRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  // Scroll to specific mobile slide when clicking dots
  const scrollToMobileSlide = useCallback((index: number) => {
    const track = mobileTrackRef.current;
    const slide = mobileImageRefs.current[index];
    if (track && slide) {
      const scrollLeft = slide.offsetLeft - track.offsetLeft;
      track.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, []);

  const activeMobileFeature = features[mobileIndex];

  return (
    <section className={styles.section}>

      {/* ── DESKTOP LAYOUT (Vertical Scroll) ── */}
      <div className={styles.desktopContainer}>

        {/* Left: Sticky Photo Stack */}
        <div className={styles.visualColumn}>
          <div className={styles.stackWrapper}>
            {features.map((feature, index) => {
              const isVisible = index <= desktopIndex;
              return (
                <div
                  key={`photo-${feature.id}`}
                  className={`${styles.polaroid} ${isVisible ? styles.cardVisible : styles.cardHidden}`}
                  style={{ ...feature.styleVars as React.CSSProperties, "--accent": feature.accent } as React.CSSProperties}
                >
                  <div className={styles.imageContainer}>
                    <img src={feature.imageUrl} alt={feature.title} className={styles.photo} />
                  </div>
                  {feature.caption && <p className={styles.caption}>{feature.caption}</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Scrolling Text */}
        <div className={styles.contentColumn}>
          {features.map((feature, index) => {
            const isActive = index === desktopIndex;
            return (
              <div
                key={`text-${feature.id}`}
                ref={(el) => { textRefs.current[index] = el; }}
                className={`${styles.textBlock} ${isActive ? styles.textBlockActive : ""}`}
                style={{ "--accent": feature.accent } as React.CSSProperties}
              >
                <div className={styles.tagRow}>
                  <span className={styles.kicker}>{feature.kicker}</span>
                  <span className={styles.tag}>{feature.tag}</span>
                </div>
                <h3 className={styles.title}>{feature.title}</h3>

                <ul className={styles.bulletList}>
                  {feature.bullets.map((b, i) => (
                    <li key={i} className={styles.bulletItem} style={{ "--delay": `${i * 0.07 + 0.1}s` } as React.CSSProperties}>
                      <span className={styles.bulletIcon}>{b.icon}</span>
                      <span className={styles.bulletText}>{b.text}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => router.push("https://play.google.com/store/apps/details?id=com.synctrip")} className={styles.actionBtn}>
                  {feature.btnText}
                  <span className={styles.btnArrow}>→</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MOBILE LAYOUT (App-Like Horizontal Snap Carousel) ── */}
      <div className={styles.mobileContainer}>

        {/* Horizontal Scroll Track */}
        <div className={styles.mobileImageTrack} ref={mobileTrackRef}>
          {features.map((feature, index) => (
            <div
              key={`mob-img-${feature.id}`}
              ref={(el) => { mobileImageRefs.current[index] = el; }}
              className={styles.mobileImageSlide}
            >
              <div className={styles.mobilePhotoWrapper}>
                <img src={feature.imageUrl} alt={feature.title} className={styles.mobilePhoto} />
                {feature.caption && <div className={styles.mobileCaption}>{feature.caption}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Pagination Dots */}
        <div className={styles.mobileDots}>
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToMobileSlide(i)}
              className={`${styles.dot} ${i === mobileIndex ? styles.dotActive : ""}`}
              style={{ "--accent": features[i].accent } as React.CSSProperties}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Animated Text Block (Uses `key` to re-trigger CSS animations on change) */}
        <div className={styles.mobileTextWrapper}>
          <div key={mobileIndex} className={styles.mobileTextAnim}>
            <div className={styles.tagRow}>
              <span className={styles.kicker} style={{ "--accent": activeMobileFeature.accent } as React.CSSProperties}>
                {activeMobileFeature.kicker}
              </span>
              <span className={styles.tag}>{activeMobileFeature.tag}</span>
            </div>

            <h3 className={styles.mobileTitle}>{activeMobileFeature.title}</h3>

            <ul className={styles.bulletList}>
              {activeMobileFeature.bullets.map((b, i) => (
                <li key={i} className={styles.bulletItem} style={{ "--delay": `${i * 0.05}s` } as React.CSSProperties}>
                  <span className={styles.bulletIcon}>{b.icon}</span>
                  <span className={styles.bulletText}>{b.text}</span>
                </li>
              ))}
            </ul>

            <button className={styles.actionBtn} style={{ "--accent": activeMobileFeature.accent } as React.CSSProperties}>
              {activeMobileFeature.btnText}
              <span className={styles.btnArrow}>→</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeatureScroll;