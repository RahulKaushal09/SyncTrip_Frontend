"use client";

import { Users, Shield, Calendar, MapPin, Heart, Zap } from "lucide-react";
import { useEffect } from "react";
import "../../../styles/home/features.css";
import { triggerLogin } from "@/utils";
import { ROUTES } from "@/constants/config";
import { useLoader } from "../providers/LoaderContext";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: Users,
    title: "Find Your Travel Buddy", // Keyword: Travel Buddy
    description:
      "Host your own trip and find the perfect travel buddy who shares your vibe, budget, and destination goals.",
    color: "#3abef5",
    bgColor: "#f2faff",
    hoverBg: "#e3f5ff",
    hoverColor: "var(--primary-1)"
  },
  {
    icon: Shield,
    title: "Verified Traveler Profiles", // Keyword: Verified Travelers
    description:
      "Your safety is our priority. Connect with travelers through ID-verified profiles, peer reviews, and community ratings.",
    color: "#2b9a66",
    bgColor: "#e6f6eb",
    hoverBg: "#c4e8d1",
    hoverColor: "var(--success-1)"
  },
  {
    icon: Calendar,
    title: "Share Travel Costs", // Keyword: Share travel costs
    description:
      "Plan your journey from scratch. Use collaborative tools to split trip expenses, share itineraries, and lead the way.",
    color: "#16324f",
    bgColor: "#f7fafd",
    hoverBg: "#ecf3fa",
    hoverColor: "var(--secondary-1)"
  },
  {
    icon: MapPin,
    title: "Host Solo Travel Groups", // Keyword: Solo travel groups
    description:
      "Be the architect of your adventure. Create travel groups for any destination in India or worldwide and invite your crew.",
    color: "#ffc53d",
    bgColor: "var(--warning-5)",
    hoverBg: "var(--warning-4)",
    hoverColor: "var(--warning-1)"
  },
  {
    icon: Heart,
    title: "Solo Traveler Community", // Keyword: Solo travel tips
    description:
      "Join India's fastest-growing social network for travelers. Share solo travel tips and build lasting connections on the road.",
    color: "#e5484d",
    bgColor: "#feebec",
    hoverBg: "#ffcdce",
    hoverColor: "var(--error-1)"
  },
  {
    icon: Zap,
    title: "Instant Verified Chat", // Keyword: Secure Travel Chat
    description:
      "Skip the wait. Directly message potential companions and coordinate your next DIY trip with our secure chat tools.",
    color: "#7accf5",
    bgColor: "#b8e8ff",
    hoverBg: "rgba(122, 204, 245, 0.2)",
    hoverColor: "var(--primary-1)"
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
  const { showLoader } = useLoader();
  const router = useRouter();
  const redirectToUrl = (redirectUrl: string) => {
    // Implement your redirect logic here
    showLoader();
    router.push(redirectUrl);
  };
  return (
    <section id="features" className="features-section container-custom" >
      {/* Title */}
      <div className="text-center m-animate m-slide-up">
        <h2 className="features-title">Why Leading Explorers Choose SyncTrip</h2>
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
                  "--title-hover-color": feature.hoverColor
                } as React.CSSProperties
              }
            >
              <div className="feature-icon-section" style={{ backgroundColor: feature.bgColor }}>
                <IconComponent
                  className="icon"
                  style={{ color: feature.color }}
                  aria-label={feature.title}
                />
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
        <div className="cta-btn" onClick={() => { triggerLogin(); redirectToUrl(ROUTES.EXPLORE); }}>
          <span>Create Your Trip & Find Buddies</span>
        </div>
      </div>
    </section>
  );
}
