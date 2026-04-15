"use client";

import React from "react";
import GumletImage from "../common/GumletImage";

import displayImg1 from "@/assets/images/di1.png";
import displayImg2 from "@/assets/images/di2.png";
import displayImg3 from "@/assets/images/di3.png";
import displayImg4 from "@/assets/images/di4.png";

import PlayStoreImg from "@/assets/icons/PlayStoreWhite.png";
import { Download } from "lucide-react";
import { redirectToStore } from "@/utils/redirectToStore";

// ─── SUB-COMPONENTS ───────────────────────────────────────────────────────────

const StoreBadge = ({ href, isDark }: { href?: string; isDark: boolean }) => (
  <div
    onClick={redirectToStore}
    className={`
      group cursor-pointer flex items-center border border-[#0f2439] justify-center gap-2 h-[54px] px-8 rounded-2xl font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 w-fit mx-auto lg:mx-0
      ${isDark
        ? "bg-white text-secondary-1 hover:bg-gray-50 hover:shadow-white/10"
        : "bg-secondary-1 text-white hover:bg-[#0f2439] hover:shadow-secondary-1/20"
      }
    `}
  >
    {/* <img src={PlayStoreImg.src} alt="Google Play" className="h-10" /> */}
    <Download color="black" />
    <span style={{
      color: isDark ? "black" : "white"
    }} className="text-base lg:text-lg tracking-wide">
      Download Now
    </span>
  </div>
);

const FeatureRow = ({ text, isDark }: { text: string; isDark: boolean }) => (
  <div className="flex items-start gap-4 p-3 rounded-xl transition-colors hover:bg-black/5">
    <div className={`w-3 h-3 rounded-full shrink-0 mt-1.5 shadow-sm ${isDark ? "bg-primary-1 shadow-primary-1/50" : "bg-secondary-1 shadow-secondary-1/50"}`} />
    <span className={`text-base lg:text-lg font-medium text-left ${isDark ? "text-white/90" : "text-neutral-800"}`}>
      {text}
    </span>
  </div>
);

const Stat = ({ num, label, isDark }: { num: string; label: string; isDark: boolean }) => (
  <div className={`flex flex-col text-center lg:text-left p-4 rounded-2xl backdrop-blur-md border ${isDark ? "bg-white/5 border-white/10" : "bg-secondary-1/5 border-secondary-1/10"}`}>
    <div className={`text-4xl lg:text-5xl font-extrabold tracking-tight ${isDark ? "text-white" : "text-secondary-1"}`}>
      {num}
    </div>
    <div className={`text-xs lg:text-sm uppercase tracking-[0.2em] mt-2 font-semibold ${isDark ? "text-white/60" : "text-neutral-500"}`}>
      {label}
    </div>
  </div>
);

// ─── CIRCLE DECORATIONS ───────────────────────────────────────────────────────

const CirclesBg = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute opacity-10 inset-0 overflow-hidden pointer-events-none z-0">
    <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full border ${isDark ? "border-white/[0.04]" : "border-secondary-1"}`} />
    <div className={`absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full border ${isDark ? "border-white/[0.05]" : "border-secondary-1"}`} />
    <div className={`absolute -top-8 -right-8 w-[220px] h-[220px] rounded-full border ${isDark ? "border-white/[0.06]" : "border-secondary-1"}`} />
    <div className={`absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full border ${isDark ? "border-white/[0.03]" : "border-secondary-1/[0.05]"}`} />
    <div className={`absolute -bottom-20 -left-20 w-[340px] h-[340px] rounded-full border ${isDark ? "border-white/[0.05]" : "border-secondary-1/[0.07]"}`} />
    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border ${isDark ? "border-white/[0.02]" : "border-secondary-1/[0.03]"}`} />
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const AppDownloadStack = () => {
  return (
    <section id="app-download" className="w-full relative bg-gradient-to-bl from-[#F6F9FB] via-[#F2FAFF] to-[#F6F9FB] flex flex-col gap-8 lg:gap-16 pt-8 lg:pt-16">

      {/* ==========================================
          SLIDE 1: Now on Mobile
          ========================================== */}
      <div className="
        w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl mx-auto
        flex items-center justify-center
        py-8 lg:py-0
        rounded-[2rem] lg:rounded-t-[3rem]
        lg:rounded-b-none lg:border-b-0
        lg:h-[calc(100dvh-7rem)] lg:sticky lg:top-28
        border border-white/10
        bg-gradient-to-br from-[#16324F] to-[#0c1c2e] text-white
        z-[10] overflow-hidden group
      ">
        <CirclesBg isDark={true} />
        <div className="w-full px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 py-10 lg:py-0">

          <div className="w-full flex-1 flex flex-col gap-5 lg:gap-8 text-center lg:text-left z-10">
            <div className="flex justify-center ">
              <div className="inline-flex items-center px-5 py-2 rounded-full border backdrop-blur-md bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <span className="text-xs lg:text-sm uppercase tracking-[0.25em] font-bold text-white/90">
                  Now on Mobile
                </span>
              </div>
            </div>
            <h2 className="text-3xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Get Exclusive Access, <br />
              <span className="text-primary-1 bg-clip-text text-transparent bg-gradient-to-r from-primary-1 to-blue-400">only on SyncTrip Mobile App.</span>
            </h2>
            <div className="flex flex-col gap-5 lg:gap-8 w-full">
              <p className="text-base lg:text-xl text-white/80 max-w-md m-0 mx-auto lg:mx-0 font-light leading-relaxed">
                Connect with travelers. Free Access to Chats. Share the journey — all from one app.
              </p>
              <StoreBadge isDark={true} href="https://play.google.com/store/apps/details?id=com.synctrip" />
            </div>
          </div>

          {/* Image: no aspect ratio on mobile, constrained on desktop */}
          <div className="w-full rotate-3 flex-1 flex justify-center items-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-1/30 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative w-full max-w-[220px] lg:max-w-[420px] lg:aspect-[3/4] transition-transform duration-[800ms] group-hover:-translate-y-4">
              <GumletImage
                src={displayImg1.src}
                alt="SyncTrip App"
                fill
                containerStyle={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          SLIDE 2: Swipe. Match.
          ========================================== */}
      <div className="hidden lg:flex
        w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl mx-auto
        items-center justify-center
        py-8 lg:py-0
        rounded-[2rem] lg:rounded-t-[3rem]
        lg:rounded-b-none lg:border-b-0
        lg:h-[calc(100dvh-8rem)] lg:sticky lg:top-32
        border border-black/5
        bg-[#F4FAFF] text-secondary-1
        z-[20] overflow-hidden group
      ">
        <CirclesBg isDark={false} />
        <div className="w-full px-6 lg:px-16 flex flex-col lg:flex-row-reverse items-center justify-center gap-8 lg:gap-20 py-10 lg:py-0">

          <div className="w-full flex-1 flex flex-col gap-5 lg:gap-8 text-center lg:text-left z-10">
            <div className="flex justify-center">
              <div className="inline-flex items-center px-5 py-2 rounded-full border backdrop-blur-md bg-white/80 border-primary-3/30 shadow-sm">
                <span className="text-xs lg:text-sm uppercase tracking-[0.25em] font-bold text-primary-1">
                  Swipe. Match.
                </span>
              </div>
            </div>
            <h2 className="text-3xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-secondary-1">
              All your connections <br />
              <span className="text-primary-1">at one Place.</span>
            </h2>
            <div className="flex flex-col gap-1 mx-auto lg:mx-0 w-full max-w-md">
              <FeatureRow text="Swipe through verified profiles" isDark={false} />
              <FeatureRow text="Matches, Received and Sent Connections" isDark={false} />
              <FeatureRow text="Chat instantly when you match" isDark={false} />
            </div>
          </div>

          <div className="w-full -rotate-3 flex-1 flex justify-center items-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-secondary-1/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative w-full max-w-[220px] lg:max-w-[420px] lg:aspect-[4/6] transition-transform duration-[800ms] group-hover:-translate-y-4">
              <GumletImage
                src={displayImg2.src}
                alt="SyncTrip App Match"
                fill
                containerStyle={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          SLIDE 3: Community
          ========================================== */}
      <div className="
        w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl mx-auto
        hidden lg:flex items-center justify-center
        py-8 lg:py-0
        rounded-[2rem] lg:rounded-t-[3rem]
        lg:rounded-b-none lg:border-b-0
        lg:h-[calc(100dvh-9rem)] lg:sticky lg:top-36
        border border-white/10
        bg-gradient-to-tr from-[#16324F] to-[#1a3b5c] text-white
        z-[30] overflow-hidden group
      ">
        <CirclesBg isDark={true} />
        <div className="w-full px-6 lg:px-16 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 py-10 lg:py-0">

          <div className="w-full flex-1 flex flex-col gap-5 lg:gap-8 text-center lg:text-left z-10">
            <div className="flex justify-center ">
              <div className="inline-flex items-center px-5 py-2 rounded-full border backdrop-blur-md bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <span className="text-xs lg:text-sm uppercase tracking-[0.25em] font-bold text-white/90">
                  Available on Playstore
                </span>
              </div>
            </div>
            <h2 className="text-3xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
              5000+ travelers <br />
              <span className="text-primary-1">already exploring.</span>
            </h2>
            <div className="flex flex-col gap-6 lg:gap-10 w-full">
              <div className="grid grid-cols-3 lg:flex lg:gap-6 gap-3">
                <Stat num="4.9★" label="Rating" isDark={true} />
                <Stat num="500+" label="Trips" isDark={true} />
                <Stat num="100%" label="Verified" isDark={true} />
              </div>
              <p className="text-base lg:text-xl text-white/70 max-w-md m-0 mx-auto lg:mx-0 font-light leading-relaxed">
                Real travelers. Real journeys. Join a thriving community where every connection is a new adventure waiting to unfold.
              </p>
            </div>
          </div>

          <div className="w-full rotate-3 flex-1 flex justify-center items-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative w-full max-w-[220px] lg:max-w-[420px] lg:aspect-[3/4] transition-transform duration-[800ms] group-hover:-translate-y-4">
              <GumletImage
                src={displayImg3.src}
                alt="SyncTrip Community"
                fill
                containerStyle={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ==========================================
          SLIDE 4: Download Now
          ========================================== */}
      <div className="
        w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] max-w-7xl mx-auto
        hidden lg:flex items-center justify-center
        py-8 lg:py-0
        rounded-[2rem] lg:rounded-t-[3rem]
        lg:rounded-b-none lg:border-b-0
        lg:min-h-[calc(100dvh-10rem)] lg:sticky lg:top-40
        bg-[#F4FAFF] text-secondary-1
        z-[40] overflow-hidden group
      ">
        <CirclesBg isDark={false} />
        <div className="w-full px-6 lg:px-16 flex flex-col lg:flex-row-reverse items-center justify-center gap-8 lg:gap-20 py-10 lg:py-0">

          <div className="w-full flex-1 flex flex-col gap-5 lg:gap-8 text-center lg:text-left z-10">
            <div className="flex justify-center ">
              <div className="inline-flex items-center px-5 py-2 rounded-full border backdrop-blur-md bg-white/80 border-primary-3/30 shadow-sm">
                <span className="text-xs lg:text-sm uppercase tracking-[0.25em] font-bold text-primary-1">
                  Download Now
                </span>
              </div>
            </div>
            <h2 className="text-3xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-secondary-1">
              Your next adventure <br />
              <span className="text-secondary-1">starts here.</span>
            </h2>
            <div className="flex flex-col gap-5 lg:gap-8 w-full">
              <p className="text-base lg:text-xl text-neutral-600 max-w-md m-0 mx-auto lg:mx-0 font-light leading-relaxed">
                Free to download. No subscription. Just trips, companions, and memories waiting to be made.
              </p>
              <StoreBadge isDark={true} href="https://play.google.com/store/apps/details?id=com.synctrip" />
            </div>
          </div>

          <div className="w-full -rotate-3 flex-1 flex justify-center items-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-1/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative w-full max-w-[220px] lg:max-w-[420px] lg:aspect-[3/4] transition-transform duration-[800ms] group-hover:-translate-y-4">
              <GumletImage
                src={displayImg4.src}
                alt="SyncTrip Download"
                fill
                containerStyle={{ height: "100%", width: "100%", objectFit: "contain" }}
              />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default AppDownloadStack;