import React from "react";
import { MapPin, Lock, Bell, Users } from "lucide-react";

type Props = {
  onNotify?: () => void;
};

export default function MoreLocationsUnlocking({ onNotify }: Props) {
  const cities = [
    "Leh-Ladakh",
    "Andaman",
    "Jaipur",
    "Udaipur",
    "Shimla",
    "Darjeeling",
    "Coorg",
    "Pondicherry",
  ];

  function handleNotifyClick() {
    if (onNotify) onNotify();
    // lightweight local feedback for the static component
    const el = document.getElementById("notify-btn");
    if (!el) return;
    const original = el.innerHTML;
    el.innerHTML = `✓ You'll be notified`;
    el.classList.remove("bg-gradient-to-r", "from-indigo-500", "to-purple-600");
    el.classList.add("bg-green-500", "hover:translate-y-0");
    setTimeout(() => {
      el.innerHTML = original;
      el.classList.remove("bg-green-500");
      el.classList.add("bg-gradient-to-r", "from-indigo-500", "to-purple-600");
    }, 2200);
  }

  return (
    <section className="w-full max-w-6xl mx-auto rounded-2xl bg-white/95 p-8 md:p-12 shadow-2xl relative overflow-hidden">
      {/* top animated gradient bar */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-pink-400 to-indigo-500 animate-[gradient_3s_ease_infinite]" />

      <div className="flex flex-col items-center text-center">
        {/* icons row */}
        <div className="flex gap-4 flex-wrap justify-center mb-6">
          {new Array(5).fill(null).map((_, i) => (
            <div
              key={i}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg shadow-lg flex items-center justify-center transform transition-transform duration-500 hover:-translate-y-1 animate-[float_3s_ease_in_out_infinite]`}
              style={{
                background: `linear-gradient(135deg, rgba(102,126,234,1) 0%, rgba(118,75,162,1) 100%)`,
                animationDelay: `${i * 150}ms`,
              }}
              aria-hidden
            >
              <MapPin className="w-6 h-6 text-white" />
              <span className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full shadow-sm flex items-center justify-center">
                <Lock className="w-3.5 h-3.5 text-indigo-600" />
              </span>
            </div>
          ))}
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">More locations unlocking soon</h3>
        <p className="text-slate-500 max-w-2xl mb-6">Our community grows city by city — be the first to explore new destinations.</p>

        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {cities.map((c) => (
            <span
              key={c}
              className="px-4 py-2 rounded-full bg-slate-50 border border-transparent text-slate-700 text-sm font-medium cursor-default transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            id="notify-btn"
            onClick={handleNotifyClick}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg transform transition-all hover:-translate-y-1"
            aria-label="Notify me when locations are available"
          >
            <Bell className="w-4 h-4" />
            <span>Notify me when available</span>
          </button>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-full">
              <Users className="w-4 h-4 text-slate-600" />
              <span className="font-semibold">5K+</span>
            </div>
            <div className="text-slate-500">travelers waiting</div>
          </div>
        </div>

        <div className="w-full border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-center gap-8 text-center text-slate-600">
          <div>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">15+</div>
            <div className="text-sm">Cities in pipeline</div>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">5K+</div>
            <div className="text-sm">Travelers waiting</div>
          </div>

          <div>
            <div className="text-2xl font-extrabold">Q2 2025</div>
            <div className="text-sm">Next launch</div>
          </div>
        </div>
      </div>

      {/* small style tags for the animations (Tailwind doesn't ship these by default) */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-\[float_3s_ease_in_out_infinite\] { animation: float 3s ease-in-out infinite; }
        .animate-\[gradient_3s_ease_infinite\] { background-size: 200% 100%; animation: gradient 3s ease infinite; }
      `}</style>
    </section>
  );
}
