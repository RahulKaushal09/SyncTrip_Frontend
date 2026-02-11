"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Compass, ArrowRight, ShieldCheck, MapPin, Zap } from "lucide-react";
import { ROUTES } from "@/constants";
import { useRouter } from "next/navigation";
import { triggerLogin } from "@/utils";
import { useLoader } from "../providers/LoaderContext";

// 1. Dynamically import SwipeDemo. This prevents it from loading during initial page load.
const SwipeDemo = dynamic(() => import("./SwipeDemo"), {
  ssr: false,
  loading: () => (
    <div className="w-[280px] h-[580px] bg-white/40 rounded-[3rem] border border-white/50 animate-pulse flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-[#4bbef5] border-t-transparent animate-spin" />
    </div>
  ),
});

const ChoiceFeatureSection = () => {
  const router = useRouter();
  const { showLoader } = useLoader();

  // 2. State to handle the lazy mounting
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  // 3. Native Intersection Observer to detect scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's visible and loading, we can stop observing
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: "200px", // Starts loading 200px before it enters the screen for a smoother experience
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const redirectToUrl = (redirectUrl: string) => {
    showLoader();
    router.push(redirectUrl);
  };

  const activeExplorers = [
    { initial: "AI", bg: "bg-orange-100", text: "text-orange-600" },
    { initial: "PS", bg: "bg-purple-100", text: "text-purple-600" },
    { initial: "MK", bg: "bg-emerald-100", text: "text-emerald-600" },
  ];

  return (
    <section
      ref={containerRef}
      className="relative w-full select-none bg-[#F2FAFF] overflow-hidden pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: The Phone Demo (5 Columns) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative min-h-[600px] flex items-center justify-center">
              
              {/* Floating Elements - Only show when visible or loading */}
              {isVisible && (
                <>
                  <div className="absolute -right-4 top-12 hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-xl border border-white z-20 animate-float">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShieldCheck className="text-green-600" size={18} />
                    </div>
                    <div className="pr-1">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 leading-none mb-1">Status</p>
                      <p className="text-xs font-bold text-secondary-1">Verified Solo</p>
                    </div>
                  </div>

                  <div className="absolute -left-12 bottom-24 hidden xl:flex items-center gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-xl border border-white z-20 animate-bounce-slow">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <MapPin className="text-[#4bbef5]" size={18} />
                    </div>
                    <div className="pr-1">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 leading-none mb-1">Route</p>
                      <p className="text-xs font-bold text-secondary-1">Goa, India</p>
                    </div>
                  </div>
                </>
              )}

              {/* Lazy Loaded Demo */}
              <div
                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                className="relative z-10 scale-90 md:scale-100 transition-all duration-1000"
              >
                {isVisible ? (
                  <SwipeDemo />
                ) : (
                  /* Placeholder box to maintain layout while scrolling */
                  <div className="w-[280px] h-[580px] bg-white/40 rounded-[3rem] border border-white/50 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Content (7 Columns) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-blue-50 shadow-sm">
                <Zap size={14} className="text-[#4bbef5] fill-[#4bbef5]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-1">Community First</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary-1 leading-[1.1] tracking-tight">
                Don&apos;t just dream of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1583b7] to-[#a2d9f3]">
                  the perfect trip.
                </span>
              </h2>

              <p className="text-sm text-neutral-1/70 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Don&apos;t wait for a tour guide. Create your itinerary and let SyncTrip connect you with verified travelers heading the same way. Keep your vibe, share the journey.
              </p>
            </div>

            {/* Centralized Feature Boxes */}
            <div className="grid w-full lg:w-3/4 lg:self-start grid-cols-1 sm:grid-cols-2 gap-1 mx-auto lg:mx-0">
              <div className="p-2 transition-all">
                <div className="flex items-center justify-center gap-2">
                  <Compass aria-label="Direct Connection" className="text-[#4bbef5]" size={30} />
                  <h4 className="font-bold text-lg md:text-lg text-secondary-1">Direct Connection</h4>
                </div>
              </div>
              <div className="p-2 transition-all">
                <div className="flex items-center justify-center gap-2">
                  <ShieldCheck aria-label="Verified Safety" className="text-green-600" size={30} />
                  <h4 className="font-bold text-lg md:text-lg text-secondary-1">100% Verified Profiles</h4>
                </div>
              </div>
            </div>

            {/* CTA & Profile Initials Stack */}
            <div className="flex flex-col sm:flex-row items-center gap-8 pt-4 justify-center">
              <button
                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                className="w-full sm:w-auto px-8 py-3 bg-secondary-1 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#0d344b] hover:shadow-2xl hover:-translate-y-1 transition-all group"
              >
                Get Started
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>

              <div className="flex flex-col items-center lg:items-start">
                <div className="flex -space-x-3 mb-2">
                  {activeExplorers.map((user, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-white ${user.bg} ${user.text} flex items-center justify-center text-[10px] font-bold shadow-sm`}
                    >
                      {user.initial}
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-secondary-5 flex items-center justify-center text-[10px] font-bold text-secondary-1 shadow-sm">
                    +2k
                  </div>
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Travelers hosting trips right now.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -15px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </section>
  );
};

export default ChoiceFeatureSection;