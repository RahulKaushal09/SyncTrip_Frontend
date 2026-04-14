"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import sports from "@/assets/images/sportsButton.png";
import movies from "@/assets/images/moviesButton.png";
import bikes from "@/assets/images/bikeButton.png";
import outing from "@/assets/images/outingButton.png";
import styles from "./CommunityShowcaseV2.module.css";

type Community = {
  id: string;
  title: string;
  image: StaticImageData;
  accent: string;
  heading: string;
  description: string;
  stats: string[];
};

const COMMUNITIES: Community[] = [
  {
    id: "outings",
    title: "Outings",
    image: outing,
    accent: "#4bbef5", // Used hex for better color-mix compatibility if variables fail
    heading: "Explore the Unseen",
    description: "Discover hidden gems, weekend getaways, and local cafes with people who share your vibe.",
    stats: ["1.2K+ Explorers", "Daily Meetups"]
  },
  {
    id: "movies",
    title: "Movies",
    image: movies,
    accent: "#F3359E", 
    heading: "Catch the Latest Flicks",
    description: "Find horror buffs, Marvel geeks, or indie film lovers to share the popcorn with.",
    stats: ["500+ Cinephiles", "Watch Parties"]
  },
  {
    id: "sports",
    title: "Sports",
    image: sports,
    accent: "#10B981",
    heading: "Get Your Game On",
    description: "Missing a player for your turf match? Or morning badminton rally? Build your ultimate squad here.",
    stats: ["800+ Athletes", "Weekly Tournaments"]
  },
  {
    id: "rides",
    title: "Bike Rides",
    image: bikes,
    accent: "#F59E0B",
    heading: "Hit the Open Road",
    description: "Feel the breeze and conquer new terrains. Connect with fellow riders and plan scenic routes.",
    stats: ["2K+ Riders", "Breakfast Rides"]
  }
];

type CommunityCardProps = {
  community: Community;
  priority?: boolean;
};

const CommunityCard = ({ community, priority = false }: CommunityCardProps) => {
  return (
    <article 
      className={styles.card} 
      style={{ "--accent": community.accent } as React.CSSProperties}
    >
      {/* Decorative background blob matched to the accent color */}
      {/* <div className={styles.cardGlow} aria-hidden="true" /> */}
      
      <div className={styles.cardContent}>
        <div className={styles.textWrap}>
          <span className={styles.cardBadge}>{community.title}</span>
          <h4 className={styles.cardHeading}>{community.heading}</h4>
          <p className={styles.cardDescription}>{community.description}</p>
        </div>

        <div className={styles.statList}>
          {community.stats.map((stat) => (
            <span key={stat} className={styles.statChip}>
              {stat}
            </span>
          ))}
        </div>
      </div>

      {/* Floating Image Wrapper */}
      <div className={styles.cardImageWrap} aria-hidden="true">
        <Image
          src={community.image}
          alt={community.title}
          fill
          priority={priority}
          sizes="(max-width: 767px) 140px, 220px"
          className={styles.cardImage}
        />
      </div>
    </article>
  );
};

const CommunityShowcaseV2 = () => {
  return (
    <section className={`${styles.section} bg-gradient-to-br from-[#c2e3f7] via-[#F2FAFF] to-[#F7FAFC]`}>
      {/* Ambient Animated Background */}
      {/* <div className={styles.ambientBackground}>
        <div className={styles.ambientBlob1} />
        <div className={styles.ambientBlob2} />
      </div> */}

      <div className={styles.contentWrap}>
        <header className={styles.header}>
          <div className={styles.kickerWrap}>
            <span className={styles.kickerDot} />
            <span className={styles.kicker}>SYNC YOUR VIBE</span>
          </div>
          <h2 className={styles.title}>
            Find Your Community.<br/>
            Get Connected Nearby.
          </h2>
          <p className={styles.subtitle}>
            Join vibrant local groups, discover shared interests, and turn nearby moments into meaningful connections. Available only on <strong>SyncTrip.</strong>
          </p>
        </header>

        <div className={styles.grid}>
          {COMMUNITIES.map((community, index) => (
            <CommunityCard
              key={community.id}
              community={community}
              priority={index < 2}
            />
          ))}
        </div>

        <div className={styles.liveChip}>
          <div className={styles.livePulseWrap}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span className={styles.livePing} aria-hidden="true" />
          </div>
          <span className={styles.liveText}>4 New plans nearby</span>
        </div>
      </div>
    </section>
  );
};

export default CommunityShowcaseV2;