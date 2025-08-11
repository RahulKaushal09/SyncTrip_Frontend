// Features.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import "../../../styles/home/mobileHeroSection.css"
import { Globe2, Handshake,MapPinCheckInside, ShieldHalfIcon,CalendarCheck } from "lucide-react";

const features = [
  {
    title: "Destination Matching", // was Smart Trip Discovery
    icon: MapPinCheckInside,
    color:"var(--primary-1)"
  },
  {
    title: "Verified Travelers", // was Collaborative Planning
    icon: ShieldHalfIcon,
    color:"var(--error-1)"
  },
  {
    title: "Shared Itineraries", // was Community Connections
    icon: CalendarCheck,
    color:"var(--secondary-1)"
  },
  {
    title: "Social Connections", // was AI Travel Guide
    icon: Handshake,
    color:"var(--success-1)"
  },
];

export default function HomeHeroFeatures({showInMobile}: {showInMobile: boolean}) {
  const refs = useRef<HTMLDivElement[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 768);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-float");
          }
        });
      },
      { threshold: 0.1 }
    );

    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);
    return (
    <div
      className="mobileFeatureWrapper"
      style={{
        backgroundImage: "url('/images/hero-mobile.webp')",
      }}
    >
      {features.map((f, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          className={`feature-card ${i % 2 === 0 ? "left" : "right"}`} style={{top: `${(isMobile?300:100)+i * 100}px`}}
        >
          {f.icon && <f.icon className="feature-icon" style={{color: f.color}} />}
          <p style={{color: f.color}}>{f.title}</p>
        </div>
      ))}
    </div>
  );

  
}
