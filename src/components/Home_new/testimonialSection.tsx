"use client";

import React, { useEffect } from "react";
import "../../../styles/home/testimonials.css"; // Regular CSS file
// import { UsersRound } from "lucide-react";
import { UsersRound, Globe, CheckCircle,MapPlus } from "lucide-react";
const testimonials = [
  {
    name: "Aarav Singh",
    role: "Backpacker • 18 trips",
    trip: "Rishikesh Yoga Retreat (North)",
    text:
      "I was hesitant about solo travel until I discovered SyncTrip. Now I've explored the Himalayas and made amazing friends along the way!",
    avatar: "avatar-1",
  },
  {
    name: "Priya Sharma",
    role: "Adventure Seeker • 12 trips",
    trip: "Kerala Backwaters (South)",
    text:
      "The collaborative planning feature helped our group save on costs and plan the perfect houseboat trip through Kerala’s beautiful backwaters.",
    avatar: "avatar-2",
  },
  {
    name: "Rahul Mehta",
    role: "Culture Explorer • 20 trips",
    trip: "Jaipur Heritage Walk (West)",
    text:
      "Thanks to SyncTrip’s safety and verification system, I feel confident meeting new travel buddies while exploring Rajasthan’s rich culture.",
    avatar: "avatar-3",
  },
  {
    name: "Neha Das",
    role: "Nature Lover • 15 trips",
    trip: "Sundarbans Mangrove Tour (East)",
    text:
      "Exploring the Sundarbans with SyncTrip was unforgettable! The group was friendly and the wildlife sightings were amazing.",
    avatar: "avatar-4",
  },
  {
    name: "Shivangi",
    role: "Thrill Seeker • 10 trips",
    trip: "Goa Beach Festival (West)",
    text:
      "The beach festivals and parties in Goa were incredible! SyncTrip made it easy to connect with fellow travelers and enjoy the vibe.",
    avatar: "avatar-5",
  },
  {
    name: "Anjali Reddy",
    role: "Spiritual Seeker • 14 trips",
    trip: "Tirupati Temple Visit (South)",
    text:
      "Visiting Tirupati with a group from SyncTrip was peaceful and well organized. The planning tools really helped coordinate timings.",
    avatar: "avatar-6",
  },
  {
    name: "Vikram Chauhan",
    role: "Explorer • 16 trips",
    trip: "Manali Adventure Trek (Himalayas)",
    text:
      "The Manali trek was challenging but rewarding. Thanks to SyncTrip, I found reliable trekking partners and safety was a priority.",
    avatar: "avatar-7",
  },
  {
    name: "Sana Malik",
    role: "Photographer • 18 trips",
    trip: "Udaipur Lakes Tour (West)",
    text:
      "The serene lakes and palaces of Udaipur were breathtaking. SyncTrip helped me find fellow photographers to share the experience.",
    avatar: "avatar-8",
  },
];
const Testimonials: React.FC = () => {
  useEffect(() => {
    // Counter Animation
    const animateCounter = (element: HTMLElement) => {
      const target = parseInt(element.getAttribute("data-target") || "0");
      const increment = target / 100;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        if (target >= 1000) {
          element.textContent = `${Math.floor(current).toLocaleString()}+`;
        } else if (target === 95) {
          element.textContent = `${Math.floor(current)}%`;
        } else {
          element.textContent = `${Math.floor(current)}+`;
        }
      }, 20);
    };

    const observerOptions = {
      threshold: 0.5,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll<HTMLElement>(
            "[data-target]"
          );
          counters.forEach((counter) => {
            if (!counter.classList.contains("animated")) {
              counter.classList.add("animated");
              animateCounter(counter);
            }
          });
        }
      });
    }, observerOptions);

    const statsContainer = document.querySelector(".stats-container");
    if (statsContainer) observer.observe(statsContainer);

    // Hover animation for testimonial cards
    document.querySelectorAll<HTMLElement>(".testimonial-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-8px)";
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="testimonial-section fullwidth paddingSectionLeftRight">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Trusted by Travelers Worldwide</h2>
          <p className="section-subtitle">
            Join thousands of adventurers who've discovered the joy of collaborative travel
          </p>
        </div>

        {/* Stats */}
        <div className="stats-container mb-5">
          <div className="row g-4">
            {[
              { num: 5000, color: "blue", label: "Active Travelers",Icon:UsersRound },
              { num: 1000, color: "red", label: "Trips Planned",Icon:MapPlus },
              { num: 750, color: "green", label: "Locations",Icon:Globe },
              { num: 95, color: "purple", label: "Trip Completion Rate",Icon:CheckCircle },
            ].map((stat, idx) => (
              <div key={idx} className="col-lg-3 col-md-6 col-sm-6">
                <div className="stat-card">
                  <span className={`stat-number ${stat.color}`} data-target={stat.num}>0</span>
                  <div className="stat-label">{stat.label}</div>
                  {stat.Icon && <stat.Icon className= {`stat-number ${stat.color} stat-icon`} size={24} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
         <section className="testimonials-slider-container">
      <h3 className="testimonials-title">Real Stories from Real Indian Travelers</h3>
      <div className="testimonials-slider">
        {/* Duplicate testimonials to create infinite scroll illusion */}
        {[...testimonials, ...testimonials].map((t, idx) => (
          <div key={idx} className="testimonial-card">
            <div className={`testimonial-avatar`} style={{backgroundImage: `url(${"images/avatars/"+t.name.split(" ")[0]}.webp)`}}></div>
            <h4>{t.name}</h4>
            <div className="testimonial-role">{t.role}</div>
            <div className="testimonial-trip">{t.trip}</div>
            <p className="testimonial-text">"{t.text}"</p>
          </div>
        ))}
      </div>
    </section>
        {/* <div className="testimonials-header">
          <h3 className="testimonials-title">Real Stories from Real Travelers</h3>
        </div> */}

        {/* <div className="row g-4">
          {[
            {
              name: "Sarah Chen",
              role: "Backpacker • 28 trips",
              trip: "Thailand Adventure",
              text: "I was nervous about solo travel until I found SyncTrip. Now I've explored 12 countries with amazing people I met through the app!",
              avatar: "avatar-1",
            },
            {
              name: "Marcus Johnson",
              role: "Adventure Seeker • 15 trips",
              trip: "European Road Trip",
              text: "The collaborative planning feature is genius! Our group saved $2500 on our European trip by sharing costs and finding deals together.",
              avatar: "avatar-2",
            },
            {
              name: "Emma Rodriguez",
              role: "Culture Explorer • 22 trips",
              trip: "Japan Cultural Tour",
              text: "I've made lifelong friends through SyncTrip. The safety features and verification system give me peace of mind when meeting new travel buddies.",
              avatar: "avatar-3",
            },
          ].map((t, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className={`testimonial-avatar ${t.avatar}`}></div>
                  <div className="testimonial-info">
                    <h4>{t.name}</h4>
                    <div className="testimonial-meta">{t.role}</div>
                    <div style={{ fontSize: "0.75rem", color: "#10b981" }}>✓ Verified Traveler</div>
                  </div>
                </div>
                <div className="testimonial-rating">
                  {"★★★★★".split("").map((_, i) => (
                    <span key={i} className="star">★</span>
                  ))}
                </div>
                <div className="testimonial-content">"{t.text}"</div>
                <div className="testimonial-trip">Latest: {t.trip}</div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="row g-3">
            {[
              { text: "100% Verified Profiles", iconClass: "trust-verified" },
              { text: "Secure Payments", iconClass: "trust-secure" },
              { text: "24/7 Support", iconClass: "trust-support" },
            //   { text: "Award Winning App", iconClass: "trust-award" },
            ].map((trust, idx) => (
              <div key={idx} className="col-lg-4 col-md-4 indicatorDiv">
                <div className="trust-item">
                  <div className={`trust-icon ${trust.iconClass}`}></div>
                  <div className="trust-text">{trust.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
