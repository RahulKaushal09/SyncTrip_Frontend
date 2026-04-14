"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, MapPin, Fingerprint } from "lucide-react";
import { APP_LINKS, ROUTES } from "@/constants";
import { useRouter } from "next/navigation";
import { triggerLogin } from "@/utils";
import { useLoader } from "../providers/LoaderContext";

// Dynamically import your SwipeDemo safely
const SwipeDemo = dynamic(() => import("./SwipeDemo"), {
  ssr: false,
  loading: () => (
    <div className="w-[330px] h-[660px] bg-white/40 rounded-[45px] border border-white/50 animate-pulse flex items-center justify-center shadow-2xl">
      <div className="w-12 h-12 rounded-full border-4 border-[#4bbef5] border-t-transparent animate-spin" />
    </div>
  ),
});

const activeExplorers = [
  { initial: "AI", bg: "bg-orange-100", text: "text-orange-700" },
  { initial: "PS", bg: "bg-purple-100", text: "text-purple-700" },
  { initial: "MK", bg: "bg-emerald-100", text: "text-emerald-700" },
];

const ChoiceFeatureSectionV3 = () => {
  const router = useRouter();
  const { showLoader } = useLoader();
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  // Intersection Observer for the smooth initial fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Safe 2D Parallax for floating badges and background glow
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 30; // Mild sensitivity
    const y = (e.clientY - top - height / 2) / 30;
    setMousePos({ x, y });
  };

  const redirectToUrl = (redirectUrl: string) => {
    showLoader();
    router.push(redirectUrl);
  };

  return (
    <section
      id="swipedemo"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
      className="relative w-full min-h-[90vh] flex items-center select-none bg-[#F2FAFF] overflow-hidden py-24"
    >
      {/* Dynamic Cursor Glow Background - Moves smoothly with mouse */}
      <div 
        className="absolute w-[600px] h-[600px] bg-[#4bbef5]/15 rounded-full blur-[100px] pointer-events-none transition-transform duration-700 ease-out z-0"
        style={{ transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 8}px)` }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* LEFT: Immersive Minimal Typography */}
          

          {/* RIGHT: Safe Area for SwipeDemo */}
          {/* We strictly avoided 3D transforms here so your component's absolute positioning works flawlessly. */}
          <div className="flex justify-center relative min-h-[700px] w-full">
            <div className={`relative flex items-center justify-center w-full max-w-[400px] transition-all duration-1000 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              {/* Floating Badge 1 - Safe 2D Parallax (Moves opposite to mouse) */}
              <div 
                className="absolute -right-8 lg:-right-12 top-24 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/60 z-30 transition-transform duration-200 ease-out"
                style={{ transform: `translate(${-mousePos.x * 1.5}px, ${-mousePos.y * 1.5}px)` }}
              >
                <div className="bg-emerald-100 p-2.5 rounded-xl">
                  <Fingerprint className="text-emerald-600" size={22} />
                </div>
                <div className="pr-3">
                  <p className="text-[13px] font-black text-secondary-1">100% Verified</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Real Travelers</p>
                </div>
              </div>

              {/* Floating Badge 2 - Safe 2D Parallax (Moves with mouse) */}
              <div 
                className="absolute -left-8 lg:-left-16 bottom-32 hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/60 z-30 transition-transform duration-200 ease-out"
                style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
              >
                <div className="bg-[#4bbef5]/20 p-2.5 rounded-xl">
                  <MapPin className="text-[#1583b7]" size={22} />
                </div>
                <div className="pr-3">
                  <p className="text-[13px] font-black text-secondary-1">Route Match</p>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Bali, Indonesia</p>
                </div>
              </div>

              {/* Core Phone App - Rendered completely untouched */}
              <div
                onClick={() => triggerLogin(() => redirectToUrl(ROUTES.CREATE_TRIP))}
                className="relative scale-90 z-20 cursor-pointer drop-shadow-2xl transition-transform duration-500 hover:-translate-y-2"
              >
                {isVisible ? (
                  <SwipeDemo />
                ) : (
                  <div className="w-[330px] h-[660px]" /> /* Placeholder matches your actual size */
                )}
              </div>
              
              {/* Static ambient glow behind the phone to make it pop */}
              {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[550px] bg-gradient-to-tr from-[#1583b7]/30 to-[#4bbef5]/30 blur-[80px] -z-10 rounded-full" /> */}
            </div>
          </div>

          <div className={`space-y-10 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            
            <div className="space-y-2">
              <h2 className="text-5xl md:text-6xl lg:text-[5rem] font-black text-secondary-1 leading-[0.9] tracking-tighter drop-shadow-sm">
                Match.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1583b7] to-[#4bbef5]">
                  Meet.
                </span>
                <br />
                Wander.
              </h2>
            </div>

            <p className="text-lg md:text-xl text-neutral-500 leading-relaxed font-medium">
              No forced itineraries. Swipe on verified travelers crossing your exact path. Keep your freedom, share the adventure.
            </p>

            {/* Micro-interaction CTA */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4">
              <button
                onClick={() => redirectToUrl(APP_LINKS.PLAY_STORE)}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-secondary-1 rounded-full hover:bg-[#0d344b] hover:-translate-y-1 active:scale-95 shadow-[0_10px_30px_-10px_rgba(21,131,183,0.5)] overflow-hidden"
              >
                {/* Liquid hover effect expanding from the center */}
                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                <span className="relative flex items-center gap-3">
                  Start Swiping
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-2" size={18} />
                </span>
              </button>

              {/* Minimal Social Proof */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="flex -space-x-3 transition-transform duration-300 group-hover:scale-105">
                  {activeExplorers.map((user, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-[3px] border-[#F2FAFF] ${user.bg} ${user.text} flex items-center justify-center text-xs font-black shadow-sm relative z-${30 - i * 10}`}>
                      {user.initial}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-secondary-1">2k+ Active</p>
                  <p className="text-xs text-neutral-400 font-medium">matching now</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ChoiceFeatureSectionV3;