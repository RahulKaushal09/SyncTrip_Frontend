import React from "react";
import d1 from "../../assets/images/di1.png";
import d2 from "../../assets/images/di4.png";
import PlaystoreBtn from "../../assets/icons/GetOnPlayStoreSVG.svg";
import AppstoreBtn from "../../assets/icons/GetOnAppStore.svg";
import { APP_LINKS } from "@/constants";

const SyncTripPromo = () => {
  return (
    <section className="w-full max-w-8xl mx-auto px-4 py-6 md:px-8 md:py-10 font-sans">
      <div
        className="relative rounded-[2.5rem] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a9de0 0%, #4BBEF5 45%, #7dd4fa 100%)",
          boxShadow: "0 32px 80px rgba(75, 190, 245, 0.35), 0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* ── Decorative background layers ── */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-60px",
            right: "-60px",
            width: "420px",
            height: "420px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: "-120px",
            right: "-100px",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            top: "-80px",
            left: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.09)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 28px)",
          }}
        />

        {/* ── Inner layout ── */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-4 min-h-[500px] md:min-h-[460px]">

          {/* ── LEFT: Text content ── */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 pt-12 pb-0 md:py-12 gap-4 text-center md:!text-left max-w-2xl mx-auto md:mx-0 items-center md:items-start">

            {/* Pill badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.25)",
                letterSpacing: "0.12em",
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse bg-white" />
              Trending Now
            </div>

            {/* Headline */}
            <h2
              className="font-extrabold leading-[1.1] tracking-tight text-white"
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                textShadow: "0 2px 12px rgba(0,0,0,0.12)",
              }}
            >
              Download SyncTrip and start your travel journey{" "}
              <span className="relative inline-block">
                today
                <svg
                  viewBox="0 0 120 12"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute -bottom-1.5 left-0 w-full h-2.5"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 Q30 2 60 8 Q90 14 118 6"
                    stroke="rgba(255,255,255,0.6)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              !
            </h2>

            {/* Sub-copy */}
            <p
              className="leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.88)",
                fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                maxWidth: "420px",
              }}
            >
              Join{" "}
              <strong className="text-white font-semibold">5,000+ verified travelers</strong>{" "}
              enjoying a safe, social, and seamless experience with SyncTrip.
            </p>

            {/* CTA */}
            <div className="mt-4 pb-8 flex gap-6 md:pb-0">
              <a
                href={APP_LINKS.PLAY_STORE} 
                className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
              >
                <img
                  src={PlaystoreBtn.src}
                  alt="Get it on Google Play"
                  className="h-8 md:h-12 w-auto object-contain"
                />
              </a>
              <a
                href={APP_LINKS.APP_STORE}
                className="inline-block transition-transform duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 drop-shadow-[0_6px_16px_rgba(0,0,0,0.2)]"
              >
                <img
                  src={AppstoreBtn.src}
                  alt="Get it on App Store"
                  className="h-8 md:h-12 w-auto object-contain"
                />
              </a>
            </div>
          </div>

          {/* ── RIGHT: Overlapping phone mockups ── */}
          <div className="relative hidden w-full md:w-[45%] h-[380px] md:h-auto md:flex justify-center items-end self-end overflow-visible pointer-events-none px-4 md:px-0">
            
            {/* Soft glow behind phones */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[40%] rounded-full bg-white/20 blur-[32px] z-0" />

            {/* Back phone (d2) — shifted right, rotated right, sits lower in z-index */}
            <img
              src={d2.src}
              alt="SyncTrip App Screen 2"
              className="absolute bottom-[-5%] right-[10%] md:right-[15%] w-[45%] md:w-[48%] max-w-[240px] object-contain z-10 
                         rotate-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)] 
                         pointer-events-auto transition-transform duration-500 hover:-translate-y-4 hover:rotate-3 origin-bottom"
            />

            {/* Front phone (d1) — larger, rotated left, higher z-index, overlapping */}
            <img
              src={d1.src}
              alt="SyncTrip App Screen 1"
              className="absolute bottom-[-2%] left-[10%] md:left-[15%] w-[52%] md:w-[55%] max-w-[280px] object-contain z-20 
                         -rotate-3 drop-shadow-[0_32px_48px_rgba(0,0,0,0.35)] 
                         pointer-events-auto transition-transform duration-500 hover:-translate-y-5 hover:rotate-0 origin-bottom"
            />

          </div>
        </div>
      </div>
    </section>
  );
};

export default SyncTripPromo;