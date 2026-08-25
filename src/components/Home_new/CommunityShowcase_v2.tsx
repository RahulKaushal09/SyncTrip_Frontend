"use client";

import React from "react";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import sports from "@/assets/images/sportsButton.png";
import movies from "@/assets/images/moviesButton.png";
import bikes from "@/assets/images/bikeButton.png";
import outing from "@/assets/images/outingButton.png";
import { ROUTES } from "@/constants";
import styles from "./CommunityShowcaseV2.module.css";

type Community = {
  id: string;
  title: string;
  icon: string;
  image: StaticImageData;
  imageAlt: string;
  accent: string;
  heading: string;
  description: string;
  stats: string[];
};

const COMMUNITIES: Community[] = [
  {
    id: "sports",
    title: "Sports & Games",
    icon: "🏏",
    image: sports,
    imageAlt: "Find sports partners for turf cricket, football and badminton games near you",
    accent: "#10B981",
    heading: "Missing a Player for Turf or Badminton?",
    description: "Build your squad, join pickup games and weekly matches with athletes near you.",
    stats: ["800+ Athletes", "Weekly Tournaments"]
  },
  {
    id: "rides",
    title: "Bike Rides",
    icon: "🏍️",
    image: bikes,
    imageAlt: "Join group motorcycle rides and weekend bike trips with riders near you",
    accent: "#F59E0B",
    heading: "Hit the Open Road",
    description: "Join breakfast rides, weekend loops, and long-haul motorcycle trips with riders who match your pace.",
    stats: ["2K+ Riders", "Breakfast Rides"]
  },
  {
    id: "movies",
    title: "Movie Nights",
    icon: "🎬",
    image: movies,
    imageAlt: "Find a movie buddy for the latest releases and watch parties near you",
    accent: "#F3359E",
    heading: "Match on the Film, Plan the Night",
    description: "Find horror buffs, Marvel geeks, and indie lovers to share the popcorn with.",
    stats: ["500+ Cinephiles", "Watch Parties"]
  },
  {
    id: "outings",
    title: "Outings & Hangouts",
    icon: "☕",
    image: outing,
    imageAlt: "Discover cafe hangouts, city walks and weekend meetups near you",
    accent: "#4bbef5", // Used hex for better color-mix compatibility if variables fail
    heading: "Something New Near You, Every Day",
    description: "Discover cafes, city walks, and weekend meetups with people who share your interests.",
    stats: ["1.2K+ Explorers", "Daily Meetups"]
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
          <span className={styles.cardBadge}>
            <span className={styles.cardIcon} aria-hidden="true">{community.icon}</span>
            {community.title}
          </span>
          {/* Stretched link keeps the whole card clickable while giving crawlers real anchor text */}
          <Link
            href={ROUTES.PLANS}
            className={styles.cardLink}
            aria-label={`Explore ${community.title} plans near you`}
          >
            <h3 className={styles.cardHeading}>{community.heading}</h3>
          </Link>
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
      <div className={styles.cardImageWrap}>
        <Image
          src={community.image}
          alt={community.imageAlt}
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
            <span className={styles.kicker}>ACTIVITIES NEAR YOU</span>
          </div>
          <h2 className={styles.title}>
            Do more of what you love, together.
            {/* <br className="hidden !sm:block" /> */}

          </h2>
          <p className={styles.subtitle}>
            Find activity partners near you for sports, bike rides, movie nights and cafe hangouts. Join local plans, meet people who share your interests, and turn nearby moments into real connections on <strong>SyncTrip.</strong>
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

        <div className={styles.footerActions}>
          <Link href={ROUTES.PLANS} className={styles.ctaButton}>
            Explore Activities
          </Link>

          <div className={styles.liveChip}>
            <div className={styles.livePulseWrap}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span className={styles.livePing} aria-hidden="true" />
            </div>
            <span className={styles.liveText}>4 New plans nearby</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityShowcaseV2;
