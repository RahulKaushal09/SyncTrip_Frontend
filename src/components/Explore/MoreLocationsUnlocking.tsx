import React from "react";
import { MapPin, Users, Star } from "lucide-react";
import FeedbackModal from "../common/FeedbackModal";
import { useLogin } from "../providers/LoginProvider";

type Props = {
  onNotify?: () => void;
};

export default function MoreLocationsUnlocking({ onNotify }: Props) {
  const waitlist = [
    { city: "Leh-Ladakh", count: 1200 },
    { city: "Andaman", count: 400 },
    { city: "Jaipur", count: 600 },
    { city: "Udaipur", count: 450 },
    { city: "Shimla", count: 900 },
    { city: "Darjeeling", count: 350 },
    { city: "Coorg", count: 300 },
    { city: "Pondicherry", count: 500 },
  ];

  // Progress for the next launch (0-100)
  const nextLaunchProgress = 66;
  // SVG circle config
  const size = 150; // viewBox size
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (nextLaunchProgress / 100) * circumference;

  const [feedBackFormOpen, setFeedbackFormOpen] = React.useState(false);
  const {user, isLoggedIn} =  useLogin();
  onNotify = onNotify || (() => setFeedbackFormOpen(true));
  return (
    <section
      aria-labelledby="more-locations-heading"
      className="container-custom  flex flex-col items-center text-center"
      style={{padding:0,marginTop:"50px",marginBottom:"50px"}}
    >
      {feedBackFormOpen && (
              <FeedbackModal
                feedBackFormOpen={feedBackFormOpen}
                setFeedbackFormOpen={setFeedbackFormOpen}
                isLoggedIn={false}
                user={null}
              />
            )}
      {/* Heading */}
      <h2
        id="more-locations-heading"
        className="font-serif text-[26px] sm:text-[30px] mb-2 text-secondary-1"
      >
        More locations — unlocking soon
      </h2>

      <p className="text-neutral-1 max-w-xl mb-6 text-[15px] font-sans">
        We open cities one-by-one to make sure every location has real travellers
        and good matches. Join the waitlist to get early access when your city
        goes live.
      </p>

      {/* Roadmap — Circular Progress */}
      <div className="relative mb-6 flex flex-col items-center">
        <div
          role="img"
          aria-label={`Next launch progress ${nextLaunchProgress} percent`}
          className="w-[150px] h-[150px] rounded-full flex items-center justify-center relative"
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0"
            aria-hidden
          >
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--neutral-4)"
              strokeWidth={stroke}
              fill="transparent"
            />
            {/* Progress arc (rotated -90deg via transform) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="var(--primary-1)"
              strokeWidth={stroke}
              fill="transparent"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </svg>

          <div className="z-10 flex flex-col items-center">
            <div className="p-3 rounded-full bg-primary-1/10">
              <MapPin className="w-7 h-7 text-primary-1" />
            </div>
            <div className="mt-2 text-xs text-neutral-1">
              <span className="font-semibold text-secondary-1">Next launch:</span>{" "}
              Shimla — March 2026
            </div>
            <div className="text-[12px] text-neutral-1 mt-1">{nextLaunchProgress}%</div>
          </div>
        </div>
      </div>

      {/* Floating icons row */}
      <div className="flex gap-4 flex-wrap justify-center mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            style={{ animationDelay: `${i * 150}ms` }}
            className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary-1 shadow-md flex items-center justify-center animate-float transition-transform hover:-translate-y-1 hover:shadow-lg"
            aria-hidden
          >
            <MapPin className="w-6 h-6 text-white" />
            <span
              className="absolute -bottom-2 -right-2 bg-neutral-5 text-secondary-1 text-[10px] px-2 py-[2px] rounded-full border border-neutral-3"
              aria-hidden
            >
              Soon
            </span>
          </div>
        ))}
      </div>

      {/* Waitlist pills */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        {waitlist.map(({ city, count }) => (
          <span
            key={city}
            className="px-4 py-2 rounded-full border border-neutral-4 bg-primary-5 text-neutral-1 hover:bg-primary-1 hover:text-black transition-all cursor-default text-sm font-medium flex items-center gap-2"
          >
            <span className="sr-only">Waitlist count for</span>
            <span>{city}</span>
            <span className="bg-white text-secondary-1 border border-neutral-3 text-[11px] px-2 py-[1px] rounded-full shadow-sm">
              {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
            </span>
          </span>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onNotify && onNotify()}
        className="px-6 py-3 rounded-full font-semibold text-white bg-secondary-1 hover:bg-secondary-hover shadow-sm transition-all font-sans mb-6 focus:outline-none focus:ring-2 focus:ring-primary-1/40"
        aria-label="Join early access"
      >
        Join Early Access
      </button>

      {/* Micro Testimonials */}
      <div className="max-w-xl text-neutral-1 text-[14px] font-sans mb-8 space-y-3">
        <div className="flex items-center gap-2 justify-center">
          <Star className="w-4 h-4 text-primary-1" />
          “I want Udaipur next!” — <span className="font-semibold ml-1">213 travelers</span>
        </div>
        <div className="flex items-center gap-2 justify-center">
          <Star className="w-4 h-4 text-primary-1" />
          “Jaipur is perfect for solo trips!” —{" "}
          <span className="font-semibold ml-1">140 requests</span>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="w-full border-t border-neutral-4 pt-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-neutral-1 text-center font-sans">
        <div>
          <div className="text-2xl font-bold text-primary-1">15+</div>
          <div className="text-sm">Cities in pipeline</div>
        </div>

        <div>
          <div className="text-2xl font-bold text-primary-1">5K+</div>
          <div className="text-sm">Travelers waiting</div>
        </div>

        {/* <div>
          <div className="text-2xl font-bold text-secondary-1">Q2 2025</div>
          <div className="text-sm">Next launch</div>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
