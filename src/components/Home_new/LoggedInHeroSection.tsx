"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, MapPin, ArrowRight } from "lucide-react";
import "./LoggedInHero.css";
import { LocationServices } from "@/utils/location.utils";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";

import GoaBanner from "../../assets/images/BannerImageGoaCompressed.jpeg";
import ManaliBanner from "../../assets/images/BannerImageManaliCompressed.jpeg";
import RishikeshBanner from "../../assets/images/BannerImageRishikeshCompressed.jpeg";

const bannerMap: Record<string, StaticImageData> = {
  goa: GoaBanner,
  manali: ManaliBanner,
  rishikesh: RishikeshBanner,
};

interface SlideData {
  id: number;
  location: string;
  count: number;
  month?: string;
  initials: string[];
  bgClass: string;
  profile_picture?: string[];
}

interface FetchedData {
  id: number;
  title: string;
  enrolledUsers: {
    totalUsers: number;
    users: Partial<User>[];
  } | null;
}

const LoggedInHeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselData, setCarouselData] = useState<SlideData[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 500);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const findPeoplePlanningTrips = async () => {
    try {
      const res = await LocationServices.getEnrolledUsersForEveryLocation();
      setCarouselData(res.map((item: FetchedData) => ({
        id: item.id,
        location: item.title,
        count: item.enrolledUsers && item.enrolledUsers.totalUsers,
        initials: item.enrolledUsers && item.enrolledUsers.users.map((user: Partial<User>) => {
          return user.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '';
        }),
        bgClass: `slide-bg-${item.title.toLowerCase()}`,
        profile_picture: item.enrolledUsers && item.enrolledUsers.users.map((user: Partial<User>) => user.profile_picture?.[0] || '')
      })));
    } catch (error) {
      console.error('Error fetching users planning trips to location:', error);
    }
  };

  useEffect(() => {
    carouselData.forEach((slide) => {
      slide.initials = (window.innerWidth > 500) ? slide.initials : slide.initials.slice(0, 2);
    });
  }, [carouselData])

  useEffect(() => {
    findPeoplePlanningTrips();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselData.length > 0) {
        setCurrentIndex((prev) => (prev + 1) % carouselData.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselData.length]);

  const handleScrollDown = () => {
    router.replace("/#swipedemo");
  };


  return (
    <section className="homeHeroSection">
      <div className="heroOverlay bg-gradient-to-br from-[#f2faff] via-[#e3f5ff] to-[#b8e8ff]">
        <div className="logged-in-content-container container-custom">

          <div className="carousel-viewport">
            <div
              className="carousel-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {carouselData.map((slide, index) => (
                <div key={slide.id} className="carousel-slide">
                  <div className="slide-bg-layer">
                    <Image
                      src={bannerMap[slide.location.toLowerCase()] || GoaBanner}
                      alt={`Travel to ${slide.location}`}
                      fill
                      priority={index === 0}
                      sizes="100vw"
                      style={{ objectFit: 'cover' }}
                      quality={85}
                    />
                  </div>
                  <div className="slide-content">
                    <div className="location-badge">
                      <MapPin className="w-3 h-3" />
                      <span>Trending</span>
                    </div>
                    <h3 className="slide-heading">
                      <span className="text-primary-1">{slide.count}+ people</span> are planning a trip to {slide.location}{slide.month ? ` in ${slide.month}` : ""}
                    </h3>
                    <div className="banner-bottom-row">
                      <div className="avatar-group">
                        {(slide.profile_picture?.length
                          ? slide.profile_picture
                          : slide.initials
                        )
                          ?.slice(0, isMobile ? 2 : 3)
                          .map((item, idx) => (
                            <div key={idx} className="avatar-circle">
                              {item ? (
                                <Image
                                  src={item}
                                  alt="profile"
                                  width={36}
                                  height={36}
                                  sizes="36px"
                                  quality={60}
                                />

                              ) : (
                                <span className="avatar-initials">{slide.initials[idx] || slide.initials[0]}</span>
                              )}
                            </div>
                          ))
                        }
                        {slide.count > 3 && (
                          <div className="avatar-circle-count">
                            +{slide.count - 3}
                          </div>
                        )}
                      </div>
                      <button onClick={() => router.push(`/create/trip?locationId=${slide.id}`)} className="banner-cta-btn cursor-pointer">
                        Plan in {slide.location} <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-indicators-external">
            {carouselData.map((_, idx) => (
              <button
                key={idx}
                className={`indicator-dot-external ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="center-text-section">
            <h2 className="hero-main-title">
              Make Friends <br className="mobile-break" />
              <span>Before You Go.</span>
            </h2>
            <p className="hero-subtitle">
              If your group chat went silent, don&apos;t let the trip die with it.
              Meet new travel buddies and keep the plan alive.
            </p>

            {/* Floating Badges */}
            <div className="floating-badge-wrapper wrapper-left">
              <div className="floating-badge badge-left">
                <div className="avatar-group-small">
                  <div className="avatar-mini bg-primary-3">SJ</div>
                  <div className="avatar-mini bg-primary-1">RK</div>
                </div>
                <span>Searching travel buddies!</span>
              </div>
            </div>

            <div className="floating-badge-wrapper wrapper-right">
              <div className="floating-badge badge-right">
                <MapPin className="w-4 h-4 text-primary-1" />
                <span>Goa Itinerary Finalized</span>
              </div>
            </div>
          </div>

          <div className="scroll-cta-section" onClick={handleScrollDown}>
            <div className="scroll-highlight-box">
              <p className="create-trip-text">How It Works?</p>
              <div className="scroll-arrow-wrapper bounce-animation">
                <ChevronDown size={28} strokeWidth={3} />
              </div>
            </div>
          </div>

        </div>
      </div>
      <Image className="heroVectorBottom" src="/images/heroVectorBottom.png" alt="Hero Vector Bottom" width={isMobile ? 500 : 1440} height={120} />
    </section>
  );
};

export default LoggedInHeroSection;