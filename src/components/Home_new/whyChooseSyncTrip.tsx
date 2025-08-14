"use client";

import { Users, Shield, Calendar, MapPin, Heart, Zap } from "lucide-react";
import { useEffect } from "react";
import "../../../styles/home/features.css";
import { triggerLogin } from "@/utils";

const features = [
  {
    icon: Users,
    title: "Smart Matching",
    description:
      "Connect with travelers who share your interests, budget, and travel style through our intelligent matching algorithm.",
    color: "#3abef5",
    bgColor: "#f2faff",
    hoverBg: "#e3f5ff",
    hoverColor:"var(--primary-1)"

  },
  {
    icon: Shield,
    title: "Safe & Trusted",
    description:
      "Verified profiles, ratings, and reviews ensure you travel with trustworthy companions. Your safety is our priority.",
    color: "#2b9a66",
    bgColor: "#e6f6eb",
    hoverBg: "#c4e8d1",
    hoverColor:"var(--success-1)"

  },
  {
    icon: Calendar,
    title: "Collaborative Planning",
    description:
      "Plan trips together with shared itineraries, expense tracking, and real-time collaboration tools.",
    color: "#16324f",
    bgColor: "#f7fafd",
    hoverBg: "#ecf3fa",
    hoverColor:"var(--secondary-1)"

  },
  {
    icon: MapPin,
    title: "Global Destinations",
    description:
      "Discover amazing destinations worldwide and find travel companions for any location you dream of visiting.",
    color: "#ffc53d",
    bgColor: "var(--warning-5)",
    hoverBg: "var(--warning-4)",
    hoverColor:"var(--warning-1)"

  },
  {
    icon: Heart,
    title: "Shared Experiences",
    description:
      "Create lasting friendships and memories through shared travel experiences and cultural discoveries.",
    color: "#e5484d",
    bgColor: "#feebec",
    hoverBg: "#ffcdce",
    hoverColor:"var(--error-1)"

  },
  {
    icon: Zap,
    title: "Instant Connections",
    description:
      "Chat with potential travel companions instantly and make quick decisions about your next adventure.",
    color: "#7accf5",
    bgColor: "#b8e8ff",
    hoverBg: "rgba(122, 204, 245, 0.2)",
    hoverColor:"var(--primary-1)"
  }
];

export function FeaturesSection() {
  // Intersection Observer for in-view animations
  useEffect(() => {
    const elements = document.querySelectorAll(".m-animate");
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="features-section container-custom" >
        {/* Title */}
        <div className="text-center m-animate m-slide-up">
          <h2 className="features-title">Why Choose Synctrip?</h2>
          <p className="features-subtitle">
            We make it easy to find the perfect travel companion and plan
            unforgettable trips together.
          </p>
        </div>

        {/* Grid */}
        <div className="features-grid m-stagger">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="feature-card-section m-animate m-slide-up hov-lift"
                style={
                  {
                    "--i": index,
                    "--hover-color": feature.hoverBg,
                    "--title-hover-color":feature.hoverColor
                  } as React.CSSProperties
                }
              >
                <div className="feature-icon-section" style={{ backgroundColor: feature.bgColor }}>
                  <IconComponent className="icon" style={{ color: feature.color }} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
                <div className="feature-bar" style={{ backgroundColor: feature.color }} />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="cta-wrapper m-animate m-zoom-in">
          <div className="cta-btn" onClick={() => triggerLogin()}>
            <span>Ready to start your journey?</span> 
          </div>
        </div>
    </section>
  );
}
