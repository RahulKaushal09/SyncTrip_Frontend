"use client";

import React from "react";
import Image from "next/image";
import { Users, Shield, MessageCircle, ArrowBigRight } from "lucide-react";
import styles from "./CommunityBento.module.css";
import { useRouter } from "next/navigation";

// Import your existing images
import ridersImage from "@/assets/images/ridersImage.png";
import sportsImage from "@/assets/images/sportsImage.png";
import outingImage from "@/assets/images/outingImage.png";
import moviesImage from "@/assets/images/moviesImage.png";
import { APP_LINKS, ROUTES } from "@/constants";

const CommunityBento = () => {
  const router = useRouter();

  return (
    <section className={`${styles.section} bg-gradient-to-b from-[##F4FAFF] to-white`}>
      {/* ── CLEAR SECTION HEADER ── */}
      <div className={styles.globalHeader}>
        <div className={styles.kickerBadge}>
          <Users size={14} className={styles.kickerIcon} />
          <span>FIND YOUR CREW</span>
        </div>
        <h2 className={styles.mainTitle}>
          Do more of what you love, together.
        </h2>
        <p className={styles.mainSubtitle}>
          Whether it&apos;s a weekend bike ride, a Sunday turf match, or just catching the latest movie - SyncTrip connects you with locals and travelers who share your exact vibe.
        </p>
      </div>

      {/* ── BENTO GRID ── */}
      <div className={styles.bentoGrid}>
        
        {/* Box 1: Rides (Tall - Spans 2 Rows) */}
        <div className={`${styles.bentoCard} ${styles.tallCard}`} onClick={() => router.push(ROUTES.PLANS)}>
          <div className={styles.imageWrapper}>
            <Image src={ridersImage.src} alt="Rides" fill sizes="(max-width: 768px) 100vw, 25vw" className={styles.bgImage} />
            <div className={styles.scrim} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tag}>Bike Rides</div>
            <h3 className={styles.cardTitle}>Find your riding tribe.</h3>
            <p className={styles.cardDesc}>Join rider groups that match your pace, plan routes, and hit the open road to your next adventure.</p>
          </div>
        </div>

        {/* Box 2: Sports (Square) */}
        <div className={`${styles.bentoCard} ${styles.squareCard}`} onClick={() => router.push(ROUTES.PLANS)}>
          <div className={styles.imageWrapper}>
            <Image src={sportsImage.src} alt="Sports" fill sizes="(max-width: 768px) 100vw, 25vw" className={styles.bgImage} />
            <div className={styles.scrim} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tag}>Sports & Games</div>
            <h3 className={styles.cardTitle}>Play with the Community!</h3>
          </div>
        </div>

        {/* Box 3: Hangouts (Wide) */}
        <div className={`${styles.bentoCard} ${styles.wideCard}`} onClick={() => router.push(ROUTES.PLANS)}>
          <div className={styles.imageWrapper}>
            <Image src={outingImage.src} alt="Outings" fill sizes="(max-width: 768px) 100vw, 50vw" className={styles.bgImage} />
            <div className={styles.scrim} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tag}>Social Hangouts</div>
            <h3 className={styles.cardTitle}>Meet your kind of people.</h3>
            <p className={styles.cardDesc}>Find people for cafes, city walks, and chill weekend hangouts.</p>
          </div>
        </div>

        {/* Box 4: Movies (Square) */}
        <div className={`${styles.bentoCard} ${styles.squareCard}`} onClick={() => router.push(ROUTES.PLANS)}>
          <div className={styles.imageWrapper}>
            <Image src={moviesImage.src} alt="Movies" fill sizes="(max-width: 768px) 100vw, 25vw" className={styles.bgImage} />
            <div className={styles.scrim} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.tag}>Movie Nights</div>
            <h3 className={styles.cardTitle}>Find Other Cinephiles!</h3>
          </div>
        </div>

        {/* Box 5: Open Communities (Wide - Specialized Dark Card) */}
        <div className={`${styles.bentoCard} ${styles.wideCard} ${styles.chatCard}`} onClick={() => router.push(APP_LINKS.PLAY_STORE)}>
          {/* Animated Background Elements */}
          <div className={styles.chatBackground}>
            <MessageCircle className={`${styles.floatingBubble} ${styles.bubble1}`} />
            <MessageCircle className={`${styles.floatingBubble} ${styles.bubble2}`} />
            <MessageCircle className={`${styles.floatingBubble} ${styles.bubble3}`} />
          </div>
          
          <div className={styles.cardContent}>
            <div className={styles.chatHeader}>
              <div className={styles.liveIndicator}>
                <span className={styles.liveDot}></span>
                NOW LIVE 
              </div>
              <Shield size={20} className={styles.secureIcon} />
            </div>
            <h3 className={styles.chatTitle}>Open Communities</h3>
            <p className={styles.chatDesc}>
              Jump into secure & open chat rooms. Open up, ask questions, share itineraries, and connect with travelers from across India.
            </p>
            <div className={styles.exploreBtn}>
              Explore Chat Rooms <ArrowBigRight size={14} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CommunityBento;