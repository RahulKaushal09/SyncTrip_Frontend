"use client";

import React from "react";
import Image, { type StaticImageData } from "next/image";
import sports from "@/assets/images/sportsButton.png";
import movies from "@/assets/images/moviesButton.png";
import bikes from "@/assets/images/bikeButton.png";
import outing from "@/assets/images/outingButton.png";
import styles from "./CommunityShowcase.module.css";

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
    accent: "var(--primary-1)",
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
    accent: "var(--success-1)",
    heading: "Get Your Game On",
    description: "Missing a player for your turf match? Or morning badminton rally? Build your ultimate squad here.",
    stats: ["800+ Athletes", "Weekly Tournaments"]
  },
  {
    id: "rides",
    title: "Bike Rides",
    image: bikes,
    accent: "var(--warning-1)",
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
    <article className={`${styles.card} cursor-pointer select-none`} style={{ ["--community-accent" as string]: community.accent }}>
      <div className={styles.cardImageWrap} aria-hidden="true">
        <Image
          src={community.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 767px) 90vw, (max-width: 1280px) 45vw, 560px"
          className={styles.cardImage}
        />
      </div>

      <div className={styles.cardContent}>
        <h3 className={`h3 ${styles.cardTitle}`}>{community.title}</h3>
        <h4 className={`h4 ${styles.cardHeading}`}>{community.heading}</h4>
        <p className={`r2 ${styles.cardDescription}`}>{community.description}</p>

        <div className={styles.statList}>
          {community.stats.map((stat) => (
            <span key={stat} className={`s1 ${styles.statChip}`}>
              {stat}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

const CommunityShowcase = () => {

  return (
    <section className={`container-custom ${styles.section}`}>
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.contentWrap}>
        <header className={styles.header}>
          <span className={`s1 ${styles.kicker}`}>
            SYNC YOUR VIBE
          </span>
          <h2 className={`h2 ${styles.title}`}>
            Find Your Community and Get Connected Nearby
          </h2>
          <p className={`r2 ${styles.subtitle}`}>
            Join vibrant local groups, discover shared interests, and turn nearby moments into meaningful connections. Available only on <strong>SyncTrip Mobile App!</strong>
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

        <div className={`${styles.liveChip} m-float`}>
          <span className={styles.liveDot} aria-hidden="true" />
          <span className="b3">7+ New plans nearby</span>
        </div>
      </div>
    </section>
  );
};

export default CommunityShowcase;