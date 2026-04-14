"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { UsersRound, Globe, CheckCircle, MapPlus, Star, Apple, Play } from "lucide-react";
import styles from "./Testimonials.module.css";
import { APP_LINKS } from "@/constants"; // Assuming you have this from your first component
import { useRouter } from "next/navigation";

const testimonials = [
  {
    name: "Aarav Singh",
    role: "Backpacker • 18 trips",
    trip: "Rishikesh Yoga Retreat",
    text: "I was hesitant about solo travel until I discovered SyncTrip. Now I've explored the Himalayas and made amazing friends along the way!",
    rating: 5,
  },
  {
    name: "Priya Sharma",
    role: "Adventure Seeker • 12 trips",
    trip: "Kerala Backwaters",
    text: "The collaborative planning feature helped our group save on costs and plan the perfect houseboat trip through Kerala’s beautiful backwaters.",
    rating: 5,
  },
  {
    name: "Rahul Mehta",
    role: "Culture Explorer • 20 trips",
    trip: "Jaipur Heritage Walk",
    text: "Thanks to SyncTrip’s safety and verification system, I feel confident meeting new travel buddies while exploring Rajasthan’s rich culture.",
    rating: 5,
  },
  {
    name: "Neha Das",
    role: "Nature Lover • 15 trips",
    trip: "Sundarbans Tour",
    text: "Exploring the Sundarbans with SyncTrip was unforgettable! The group was friendly and the wildlife sightings were amazing.",
    rating: 4,
  },
  {
    name: "Shivangi",
    role: "Thrill Seeker • 10 trips",
    trip: "Goa Beach Festival",
    text: "The beach festivals and parties in Goa were incredible! SyncTrip made it easy to connect with fellow travelers and enjoy the vibe.",
    rating: 5,
  },
  {
    name: "Vikram Chauhan",
    role: "Explorer • 16 trips",
    trip: "Manali Adventure Trek",
    text: "The Manali trek was challenging but rewarding. Thanks to SyncTrip, I found reliable trekking partners and safety was a priority.",
    rating: 5,
  },
];

const TestimonialsV2: React.FC = () => {
  const router = useRouter();
  const statsRef = useRef<HTMLDivElement>(null);

  // Clean, React-friendly counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll<HTMLElement>("[data-target]");
            counters.forEach((counter) => {
              const target = parseInt(counter.getAttribute("data-target") || "0");
              const duration = 2000; // 2 seconds
              const step = target / (duration / 16); // 60fps
              let current = 0;

              const updateCounter = () => {
                current += step;
                if (current < target) {
                  counter.textContent = Math.ceil(current).toLocaleString();
                  requestAnimationFrame(updateCounter);
                } else {
                  counter.textContent = target.toLocaleString() + (target === 95 ? "%" : "+");
                }
              };
              updateCounter();
              counter.removeAttribute("data-target"); // Prevent re-animating
            });
            observer.disconnect(); // Run once
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Duplicating for the infinite scroll effect
  const marqueeCards = [...testimonials, ...testimonials];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        
        {/* Header & Stats */}
        <div className={styles.header}>
          <span className={styles.kicker}>THE SYNCTRIP COMMUNITY</span>
          <h2 className={styles.title}>Don&apos;t just take our word for it.</h2>
          <p className={styles.subtitle}>
            Join thousands of verified adventurers who have already discovered the joy of community-first travel.
          </p>
        </div>

        <div className={styles.statsGrid} ref={statsRef}>
          {[
            { num: 5000, label: "Active Travelers", Icon: UsersRound, color: "#4bbef5" },
            { num: 1000, label: "Trips Planned", Icon: MapPlus, color: "#F3359E" },
            { num: 500, label: "Locations", Icon: Globe, color: "#10B981" },
            { num: 95, label: "Completion Rate", Icon: CheckCircle, color: "#8B5CF6" },
          ].map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.statIconWrap} style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                <stat.Icon size={28} strokeWidth={2.5} />
              </div>
              <div className={styles.statContent}>
                <span className={styles.statNumber} data-target={stat.num}>0</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Testimonial Marquee */}
      <div className={styles.marqueeContainer}>
        <div className={styles.fadeLeft} aria-hidden="true" />
        <div className={styles.fadeRight} aria-hidden="true" />
        
        <div className={styles.marqueeTrack}>
          {marqueeCards.map((t, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <div 
                  className={styles.avatar} 
                  style={{ backgroundImage: `url(/images/avatars/${t.name.split(" ")[0]}.webp)` }} 
                />
                <div>
                  <h4 className={styles.name}>{t.name}</h4>
                  <p className={styles.role}>{t.role}</p>
                </div>
              </div>
              
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < t.rating ? styles.starFilled : styles.starEmpty} />
                ))}
              </div>
              
              <p className={styles.quote}>&quot;{t.text}&quot;</p>
              
              <div className={styles.tripTag}>
                📍 {t.trip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsV2;