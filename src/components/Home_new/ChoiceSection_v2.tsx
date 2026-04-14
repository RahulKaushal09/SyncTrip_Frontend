"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, ShieldCheck, MapPin, Zap, Globe, Sparkles } from "lucide-react";
import { APP_LINKS, ROUTES } from "@/constants";
import { useRouter } from "next/navigation";
import { triggerLogin } from "@/utils";
import { useLoader } from "../providers/LoaderContext";

const SwipeDemo = dynamic(() => import("./SwipeDemo"), {
  ssr: false,
  loading: () => (
    <div className="w-[280px] h-[580px] bg-white/40 rounded-[3rem] border border-white/50 animate-pulse flex items-center justify-center shadow-2xl">
      <div className="w-12 h-12 rounded-full border-4 border-[#4bbef5] border-t-transparent animate-spin" />
    </div>
  ),
});

const features = [
  {
    icon: <Globe size={18} strokeWidth={2} />,
    iconBg: "bg-blue-50 group-hover:bg-blue-100",
    iconColor: "text-[#1583b7]",
    title: "Direct Route Matching",
    desc: "Swipe and connect with travelers on your exact itinerary. No middlemen, just direct chat.",
  },
  {
    icon: <ShieldCheck size={18} strokeWidth={2} />,
    iconBg: "bg-emerald-50 group-hover:bg-emerald-100",
    iconColor: "text-emerald-600",
    title: "Verified Travel Buddies",
    desc: "Safety first. Every user undergoes strict identity verification before messaging unlocks.",
  },
];

const activeExplorers = [
  { initial: "AI", bg: "bg-orange-100", text: "text-orange-700" },
  { initial: "PS", bg: "bg-purple-100", text: "text-purple-700" },
  { initial: "MK", bg: "bg-emerald-100", text: "text-emerald-700" },
];

const ChoiceFeatureSectionV2 = () => {
  const router = useRouter();
  const { showLoader } = useLoader();
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optional: Keep observing if you want it to trigger multiple times, 
          // but unobserving is better for performance.
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -100px 0px", threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const redirectToUrl = (redirectUrl: string) => {
    showLoader();
    router.push(redirectUrl);
  };

  return (
    <section
      id="swipedemo"
      ref={containerRef}
      aria-label="SyncTrip solo travel matching and companion finder"
      itemScope
      itemType="https://schema.org/MobileApplication"
      className="relative w-full select-none bg-gradient-to-br from-[#F2FAFF] via-[#F2FAFF] to-[#c2e3f7] overflow-hidden"
    >
      {/* Hidden schema.org metadata for SEO/AEO context */}
      <meta itemProp="name" content="SyncTrip Travel Companion App" />
      <meta itemProp="applicationCategory" content="TravelApplication" />
      <meta itemProp="operatingSystem" content="Android, iOS" />
      <meta
        itemProp="description"
        content="Find travel buddies easily. SyncTrip matches verified solo travelers and backpackers heading the same way. Swipe, connect, and share the journey."
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 items-center">
          
          {/* LEFT: Phone Demo (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative min-h-[600px] flex items-center justify-center w-full max-w-[320px]">
              
              {/* Floating Badges */}
              <div className={`absolute -right-6 top-16 hidden xl:flex items-center gap-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white z-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} animate-float`}>
                <div className="bg-green-100 p-2 rounded-xl">
                  <ShieldCheck className="text-green-600" size={18} />
                </div>
                <div className="pr-2">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 leading-none mb-1 tracking-wider">Status</p>
                  <p className="text-xs font-bold text-secondary-1">ID Verified</p>
                </div>
              </div>

              <div className={`absolute -left-10 bottom-28 hidden xl:flex items-center gap-3 bg-white/95 backdrop-blur-sm p-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white z-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} animate-bounce-slow`}>
                <div className="bg-blue-100 p-2 rounded-xl">
                  <MapPin className="text-[#4bbef5]" size={18} />
                </div>
                <div className="pr-2">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 leading-none mb-1 tracking-wider">Matched Route</p>
                  <p className="text-xs font-bold text-secondary-1">Goa, India</p>
                </div>
              </div>

              <div
                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                className={`relative z-10 scale-90 hover:scale-95 transition-all duration-1000 cursor-pointer drop-shadow-2xl ${isVisible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
              >
                {isVisible ? (
                  <SwipeDemo />
                ) : (
                  <div className="w-[280px] h-[580px] bg-white/40 rounded-[3rem] border border-white/50" />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Content (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left mt-12 lg:mt-0">
            
            {/* Pill tag */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Zap size={14} className="text-[#4bbef5] fill-[#4bbef5] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1583b7]">
                Solo Travel Companion App
              </span>
            </div>

            {/* Heading */}
            <div className={`space-y-4 transition-all duration-700 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-secondary-1 leading-[1.1] tracking-tight"
                itemProp="headline"
              >
                Find your travel buddy.{" "}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#1583b7] via-[#4bbef5] to-[#a2d9f3] pb-2">
                  Never explore alone.
                </span>
              </h2>

              {/* <p className="text-[15px] md:text-base text-neutral-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Skip the rigid group tours. Build your custom itinerary, and let SyncTrip match you with verified solo travelers heading the exact same way. 
                <strong className="font-semibold text-secondary-1">Keep your freedom, share the memories.</strong>
              </p> */}
            </div>

            {/* Stats row */}
            {/* <div className={`grid grid-cols-3 gap-3 max-w-lg mx-auto lg:mx-0 transition-all duration-700 delay-200 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="group rounded-2xl transition-all duration-300 p-4 text-center lg:text-left cursor-default"
                >
                  <p className="text-2xl font-extrabold text-secondary-1 leading-none group-hover:scale-105 transition-transform origin-left">{s.value}</p>
                  <p className="text-[11px] text-neutral-500 font-bold uppercase tracking-wider mt-2">
                    {s.label}
                  </p>
                </div>
              ))}
            </div> */}

            {/* Feature cards */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0 transition-all duration-700 delay-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {features.map((f) => (
                <div
                  key={f.title}
                  className="group bg-white rounded-2xl border border-transparent hover:border-blue-100 shadow-sm hover:shadow-lg transition-all duration-300 p-3 flex items-start gap-4 text-left hover:-translate-y-1 cursor-default"
                >
                  <div className={`${f.iconBg} ${f.iconColor} p-2.5 rounded-xl flex-shrink-0 transition-colors duration-300 group-hover:scale-110`}>
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-secondary-1 mb-1 group-hover:text-[#1583b7] transition-colors">{f.title}</h3>
                    <p className="text-[13px] text-neutral-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA + Social proof */}
            <div className={`flex flex-col sm:flex-row items-center gap-6 pt-4 justify-center transition-all duration-700 delay-400 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <button
                onClick={() => redirectToUrl(APP_LINKS.PLAY_STORE)}
                aria-label="Download SyncTrip on Google Play"
                className="relative overflow-hidden w-full sm:w-auto px-8 py-3.5 bg-secondary-1 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#0d344b] hover:shadow-[0_8px_25px_rgba(21,131,183,0.3)] hover:-translate-y-0.5 transition-all group"
              >
                {/* Shine effect on hover */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                <span className="relative flex items-center gap-2">
                  Get the app
                  <ArrowRight
                    className="group-hover:translate-x-1.5 transition-transform duration-300"
                    size={18}
                  />
                </span>
              </button>

              <div className="flex items-center gap-3 bg-white/50 py-2 px-3 rounded-full border border-blue-50/50 backdrop-blur-sm">
                <div className="flex -space-x-2.5">
                  {activeExplorers.map((user, i) => (
                    <div
                      key={i}
                      className={`w-9 h-9 rounded-full border-2 border-white ${user.bg} ${user.text} flex items-center justify-center text-[10px] font-bold shadow-sm hover:-translate-y-1 transition-transform cursor-pointer relative z-${30 - i * 10}`}
                    >
                      {user.initial}
                    </div>
                  ))}
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-[#4bbef5] flex items-center justify-center text-[10px] font-bold text-white shadow-sm hover:-translate-y-1 transition-transform cursor-pointer z-0">
                    <Sparkles size={12} fill="currentColor" />
                  </div>
                </div>
                <div className="text-left pr-2">
                  <p className="text-[13px] font-bold text-secondary-1 leading-tight">2,000+ travelers</p>
                  <p className="text-[11px] text-neutral-500 font-medium leading-tight">matching right now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes shine {
          100% { transform: translateX(100%); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 5s ease-in-out infinite; }
        .animate-shine { animation: shine 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </section>
  );
};

export default ChoiceFeatureSectionV2;