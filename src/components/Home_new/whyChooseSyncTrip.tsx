"use client";

import { Users, Shield, Calendar, MapPin, Heart, Zap, ArrowRight, LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes, useEffect, useRef, useState } from "react";
import styles from "./FeaturesSection.module.css";
import { triggerLogin } from "@/utils";
import { ROUTES } from "@/constants/config";
import { useLoader } from "../providers/LoaderContext";
import { useRouter } from "next/navigation";

// Define the feature data structure
type Feature = {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> | RefAttributes<SVGSVGElement>>;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  descColor: string;
  gridClass: string;
  large: boolean;
  iconAnimClass: string;
};

// Carefully mapped to a perfect 4x2 Asymmetrical Grid
const features: Feature[] = [
  {
    icon: Users,
    title: "Find Your Travel Buddy",
    description: "Host your own trip and find the perfect companion who shares your exact vibe and budget.",
    color: "#4bbef5",
    bgColor: "linear-gradient(135deg, #0A192F 0%, #060F1D 100%)",
    textColor: "text-white",
    descColor: "text-white/70",
    gridClass: "md:col-span-2 md:row-span-1", // Large Left
    large: true,
    iconAnimClass: styles.iconFloat,
  },
  {
    icon: Shield,
    title: "Verified Profiles",
    description: "100% ID-verified profiles and community reviews.",
    color: "#10B981",
    bgColor: "#F0FDF4",
    textColor: "text-[#064E3B]",
    descColor: "text-[#064E3B]/70",
    gridClass: "md:col-span-1 md:row-span-1", // Small Middle
    large: false,
    iconAnimClass: styles.iconWiggle,
  },
  {
    icon: Zap,
    title: "Secure Chat",
    description: "Directly message potential companions instantly.",
    color: "#0284C7",
    bgColor: "#F0F9FF",
    textColor: "text-[#0C4A6E]",
    descColor: "text-[#0C4A6E]/70",
    gridClass: "md:col-span-1 md:row-span-1", // Small Right
    large: false,
    iconAnimClass: styles.iconFlash,
  },
  {
    icon: Heart,
    title: "Traveler Community",
    description: "Join India's fastest-growing social network.",
    color: "#E11D48",
    bgColor: "#FFF1F2",
    textColor: "text-[#881337]",
    descColor: "text-[#881337]/70",
    gridClass: "md:col-span-1 md:row-span-1", // Small Left
    large: false,
    iconAnimClass: styles.iconPulse,
  },
  {
    icon: MapPin,
    title: "Host Solo Travel Groups",
    description: "Create travel groups for any destination worldwide, set the agenda, and invite your crew.",
    color: "#D97706",
    bgColor: "#FFFBEB",
    textColor: "text-[#78350F]",
    descColor: "text-[#78350F]/70",
    gridClass: "md:col-span-2 md:row-span-1", // Large Middle
    large: true,
    iconAnimClass: styles.iconBounce,
  },
  {
    icon: Calendar,
    title: "Share Costs & Plans",
    description: "Use collaborative tools to split trip expenses seamlessly.",
    color: "#000",
    bgColor: "linear-gradient(135deg, #1583b7 0%, #0d5478 100%)",
    textColor: "text-white",
    descColor: "text-white/85",
    gridClass: "md:col-span-1 md:row-span-1", // Small Right
    large: false,
    iconAnimClass: styles.iconTick,
  }
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const IconComponent = feature.icon;
  const isDark = feature.textColor === "text-white";

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${feature.gridClass} group`}
      style={{ 
        background: feature.bgColor,
        animationDelay: `${index * 80}ms`
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={styles.spotlight}
        style={{ 
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)'}, transparent 40%)`
        }}
      />

      <div
        className={`${styles.blob} group-hover:scale-[1.8] group-hover:opacity-20`}
        style={{ backgroundColor: feature.color }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div 
          className={`${styles.iconWrap} group-hover:shadow-md`} 
          style={{ backgroundColor: feature.large ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)") : "white" }}
        >
          <IconComponent 
            className={`w-6 h-6 md:w-7 md:h-7 group-hover:${feature.iconAnimClass} transition-all duration-300`} 
            style={{ color: feature.color }} 
          />
        </div>
        
        <div className="mt-4">
          <h3 className={`font-extrabold mb-2 ${feature.large ? "text-xl md:text-2xl" : "text-lg md:text-xl"} ${feature.textColor} tracking-tight leading-tight transition-transform duration-300 group-hover:translate-x-1`}>
            {feature.title}
          </h3>
          <p className={`font-medium leading-relaxed ${feature.large ? "text-sm md:text-base" : "text-sm"} ${feature.descColor}`}>
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export function FeaturesSection() {
  const { showLoader } = useLoader();
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const redirectToUrl = (redirectUrl: string) => {
    showLoader();
    router.push(redirectUrl);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className={`w-full max-w-7xl mx-auto px-4 py-12 flex flex-col justify-center min-h-[90vh] ${isVisible ? styles.animateIn : 'opacity-0'}`}
    >
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-4 shadow-sm">
          <Zap size={12} className="text-[#1583b7] fill-[#1583b7] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#1583b7]">
            Built for Travelers
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary-1 tracking-tight leading-[1.05] mb-4">
          Why Leading Explorers <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1583b7] to-[#4bbef5]">
            Choose SyncTrip
          </span>
        </h2>
      </div>

      {/* STRICT 4-COLUMN GRID WITH FIXED ROW HEIGHTS */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 w-full ${styles.strictGrid}`}>
        {features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} index={index} />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => { triggerLogin(() => redirectToUrl(ROUTES.EXPLORE)); }}
          className={styles.ctaButton}
        >
          <span className={styles.ctaShine} />
          <span className="relative flex items-center gap-2">
            Create Your Trip
            <ArrowRight size={18} className={styles.ctaIcon} />
          </span>
        </button>
      </div>
    </section>
  );
}