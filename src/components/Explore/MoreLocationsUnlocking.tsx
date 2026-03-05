import React from "react";
import { MapPin, Lock, Hourglass, Star } from "lucide-react";
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
    { city: "Udaipur", count: 1450 },
    // { city: "Shimla", count: 900 },
    { city: "Darjeeling", count: 350 },
    { city: "Coorg", count: 300 },
    { city: "Pondicherry", count: 500 },
  ];

  // SVG circle config
  const nextLaunchProgress = 56;
  const size = 120;
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (nextLaunchProgress / 100) * circumference;

  const [feedBackFormOpen, setFeedbackFormOpen] = React.useState(false);
  const { user, isLoggedIn } = useLogin();
  
  const handleNotify = () => {
     if (onNotify) onNotify();
     else setFeedbackFormOpen(true);
  };

  return (
    <section
      aria-labelledby="more-locations-heading"
      className="container-custom flex flex-col items-center text-center relative overflow-hidden"
      style={{ padding: "60px 20px" }}
    >
      {/* VIBRANT AMBIENT BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary-1/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-1/5 blur-[100px] rounded-full pointer-events-none" />

      {feedBackFormOpen && (
        <FeedbackModal
          feedBackFormOpen={feedBackFormOpen}
          setFeedbackFormOpen={setFeedbackFormOpen}
          isLoggedIn={isLoggedIn}
          user={user}
        />
      )}

      {/* Header Group */}
      <div className="max-w-2xl mx-auto mb-10 relative z-10">
        {/* Colorful Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-1/10 border border-primary-1/20 text-primary-1 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
          <Hourglass className="w-3 h-3" />
          SyncTrip Milestones
        </div>
        
        <h2
          id="more-locations-heading"
          className="font-serif text-3xl md:text-4xl text-secondary-1 mb-4"
        >
          Unlocking New Horizons
        </h2>
        
        <p className="text-neutral-600 text-base max-w-lg mx-auto leading-relaxed">
          We unlock cities individually to ensure quality matches. 
          These locations are currently in <span className="font-semibold text-primary-1">staging</span>.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 relative z-10">
        
        {/* Left Col: The Progress Status */}
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-primary-1/10 relative">
          <div className="relative w-[120px] h-[120px] mb-4">
             {/* Progress SVG */}
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90 drop-shadow-md">
              {/* Track */}
              <circle cx={size / 2} cy={size / 2} r={radius} stroke="var(--primary-1)" strokeOpacity="0.1" strokeWidth={stroke} fill="transparent" />
              {/* Progress */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="var(--primary-1)"
                strokeWidth={stroke}
                fill="transparent"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-bold text-secondary-1">{nextLaunchProgress}%</span>
                <span className="text-[10px] uppercase text-primary-1/80 font-bold tracking-widest">Loaded</span>
            </div>
          </div>
          
          <div className="text-center">
             <div className="text-lg font-serif font-semibold text-secondary-1">Next: Udaipur</div>
             <div className="text-sm text-primary-1/70 mt-1 font-medium">Estimated Launch: April 2026</div>
          </div>
        </div>

        {/* Right Col: The Tinted Locked Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {waitlist.map(({ city, count }) => (
            <div
              key={city}
              // Layering opacities: 3% background, 20% border. Gives it a soft tint without looking like a button.
              className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-primary-1/20 bg-primary-1/[0.03] backdrop-blur-sm shadow-sm select-none cursor-default"
            >
              {/* 10% background for the lock circle */}
              <div className="mb-2 p-1.5 rounded-full bg-primary-1/10">
                {/* 60% opacity for the lock icon itself */}
                <Lock className="w-4 h-4 text-primary-1/60" />
              </div>
              <span className="text-sm font-semibold text-secondary-1/90">{city}</span>
              
              {/* 10% background, 20% border for the waitlist pill */}
              <span className="text-[10px] mt-1 bg-primary-1/10 border border-primary-1/20 px-2 py-0.5 rounded-full text-primary-1 font-medium">
                {count > 999 ? `${(count / 1000).toFixed(1)}k` : count} waiting
              </span>
            </div>
          ))}
          {/* Placeholder for "More" */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl border-2 border-dashed border-primary-1/20 bg-primary-1/[0.02] opacity-70 cursor-default select-none">
             <span className="text-xs font-medium text-primary-1/50">...and more</span>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="flex flex-col items-center relative z-10">
        <button
          onClick={handleNotify}
          className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-secondary-1 rounded-full hover:bg-secondary-hover hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-1"
        >
           <span>Notify me when they unlock</span>
           <Star className="w-4 h-4 ml-2 fill-current text-white/90" />
        </button>
        
        <p className="mt-5 text-sm text-neutral-600 flex items-center gap-2 font-medium">
           <MapPin className="w-4 h-4 text-primary-1" /> 
           <span>Join <span className="font-bold text-secondary-1">5,000+</span> travelers on the waitlist</span>
        </p>
      </div>

    </section>
  );
}