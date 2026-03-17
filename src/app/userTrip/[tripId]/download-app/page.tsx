'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  X,
  Smartphone,
  Monitor,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';

const comparisonFeatures = [
  { feature: "Browse Destinations, Groups & Itineraries", web: true, app: true },
  { feature: "Edit your Trip Details", web: true, app: true },
  { feature: "Connect with other Solo Travelers", web: true, app: true },
  { feature: "Detailed Travel Planner Dashboard", web: true, app: true },
  { feature: "Group Discussions & Chat", web: false, app: true },
  { feature: "Real-time Notifications", web: false, app: true },
  { feature: "Connections Dashboard", web: false, app: true },
  { feature: "Unlimited Matches", web: false, app: true },
];

export default function WebAppComparison() {
  const router = useRouter();
  
  // Handled safely for SSR
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const newPath = path.replace('/download-app', '/travel-mode');

  useEffect(() => {
    document.title = "Platform Comparison | SyncTrip";
  }, []);

  return (
    // min-h-screen for mobile scrolling, strictly h-screen and hidden overflow for desktop
    <div className="bg-[#F4FAFF] flex items-center relative overflow-hidden mt-4 py-12 lg:py-8">

      {/* ── Background circle decorations ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[700px] h-[700px] rounded-full border border-secondary-1/[0.05]" />
        <div className="absolute -top-28 -right-28 w-[460px] h-[460px] rounded-full border border-secondary-1/[0.07]" />
        <div className="absolute -top-10 -right-10 w-[260px] h-[260px] rounded-full border border-secondary-1/[0.06]" />
        <div className="absolute -bottom-48 -left-48 w-[640px] h-[640px] rounded-full border border-secondary-1/[0.04]" />
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full border border-secondary-1/[0.06]" />
      </div>

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center justify-center">

        {/* ── LEFT COLUMN: Content & CTAs ── */}
        <div className="w-full lg:w-[45%] flex flex-col items-center text-center m-animate play m-slide-up">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-secondary-1/10 shadow-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-1 animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-secondary-1/60">
              Platform Comparison
            </span>
          </div>

          <h1 className="h2 text-secondary-1 mb-4 leading-tight">
            Choose your <br className="hidden lg:block"/>
            <span className="text-primary-1">customized experience.</span>
          </h1>
          
          <p className="r1 text-neutral-1 max-w-[500px] leading-relaxed mb-8">
            SyncTrip App offers real-time updates and seamless communication for travelers on the go. For the best experience, we recommend downloading the app to continue.
          </p>

          {/* Safety/Info note moved to left column */}
          <div className="flex gap-3.5 p-4 bg-primary-5 rounded-2xl border border-primary-2 mb-8 max-w-[500px] text-left">
            <p className="text-sm text-secondary-1/80 leading-relaxed">
              For features like <strong className="text-secondary-1 font-semibold">Connections Dashboard</strong> and <strong className="text-secondary-1 font-semibold">Location Based Recommendations</strong>, we highly recommend downloading the mobile app before your trip begins.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row w-full max-w-[500px] gap-3">
            <button
              onClick={() => router.push(newPath)}
              className="btn btn-secondary-border !h-[52px] flex-1 !flex items-center justify-center gap-2 px-5 hover:bg-secondary-5 group"
            >
              <Monitor size={17} className="text-secondary-1/60" />
              <span className="b2 text-secondary-1">Continue on Web</span>
            </button>

            <button
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.synctrip', '_blank')}
              className="btn btn-primary !h-[52px] flex-1 !flex items-center justify-center gap-2 px-5 group shadow-lg shadow-primary-1/20"
            >
              <Download size={17} />
              <span className="b2">Get the App</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform hidden xl:block" />
            </button>
          </div>
        </div>

        {/* ── RIGHT COLUMN: The Table Card ── */}
        <div
          className="w-full lg:w-[55%] bg-white rounded-[28px] border border-neutral-4/70 shadow-[0_8px_40px_rgba(22,50,79,0.07)] overflow-hidden m-animate play m-slide-up"
          style={{ '--i': 1 } as React.CSSProperties}
        >
          {/* Table header */}
          <div className="grid grid-cols-12 gap-3 items-end px-5 md:px-8 pt-6 pb-4 border-b border-neutral-4/60 bg-white/50">
            <div className="col-span-8 md:col-span-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-1/40">Feature</span>
            </div>

            {/* Web header */}
            <div className="col-span-2 md:col-span-2 flex flex-col items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-secondary-5 border border-neutral-4 flex items-center justify-center text-secondary-1/60">
                <Monitor size={16} />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-secondary-1/50">Web</span>
            </div>

            {/* App header */}
            <div className="col-span-2 md:col-span-2 flex flex-col items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-primary-5 border border-primary-2 flex items-center justify-center text-primary-1 relative">
                <Smartphone size={16} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-1 rounded-full border-2 border-white" />
              </div>
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-primary-1">App</span>
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-neutral-4/40 px-5 md:px-8 py-2">
            {comparisonFeatures.map((item, index) => {
              const appOnly = item.app && !item.web;
              return (
                <div
                  key={index}
                  // Slightly reduced vertical padding (py-3) to ensure it stays snug on 13" laptops
                  className={`grid grid-cols-12 gap-3 py-3 items-center rounded-xl transition-colors duration-150 hover:bg-neutral-5/60 -mx-2 px-2 ${appOnly ? 'group' : ''}`}
                >
                  <div className="col-span-8 md:col-span-8 flex items-center gap-2 pr-2">
                    <p className={`text-sm md:b1 leading-snug ${appOnly ? 'text-secondary-1 font-semibold' : 'text-secondary-1/75'}`}>
                      {item.feature}
                    </p>
                    {appOnly && (
                      <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full bg-primary-5 border border-primary-2 text-[9px] font-bold text-primary-1 uppercase tracking-wider shrink-0">
                        App only
                      </span>
                    )}
                  </div>

                  {/* Web */}
                  <div className="col-span-2 md:col-span-2 flex justify-center">
                    {item.web ? (
                      <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-100 border border-green-200 shadow-sm">
                        <Check size={14} strokeWidth={3} className="text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-50 border border-red-100 shadow-sm">
                        <X size={14} strokeWidth={3} className="text-red-400" />
                      </div>
                    )}
                  </div>

                  {/* App */}
                  <div className="col-span-2 md:col-span-2 flex justify-center">
                    {item.app ? (
                      <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-100 border border-green-200 shadow-sm group-hover:scale-110 transition-transform">
                        <Check size={14} strokeWidth={3} className="text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-50 border border-red-100 shadow-sm">
                        <X size={14} strokeWidth={3} className="text-red-400" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>

      </div>
    </div>
  );
}