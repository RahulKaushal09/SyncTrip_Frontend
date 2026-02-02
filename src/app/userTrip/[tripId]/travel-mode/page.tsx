'use client';

import { useRouter, useParams } from 'next/navigation';
import { Users, User, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import React from 'react';

export default function TravelModePage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;

  return (
    <div className="paddingTopAndSide" >

      {/* Header Section - Using your m-animate and Serif H1 */}
      <div className="m-animate play m-slide-up text-center mb-12 max-w-[800px] mx-auto">
        <h1 className="h2 text-secondary-1">How would you like to explore?</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 m-stagger play">

        {/* PRIMARY CHOICE: GROUP TRIPS (Col-span 7) */}
        <div className="lg:col-span-7 m-animate play m-slide-up">
          <div className="bg-primary-5 border-2 border-primary-1 rounded-3xl p-8 hov-lift h-full flex flex-col relative overflow-hidden">
            {/* "Recommended" Tag using your secondary color */}
            <div className="absolute top-0 right-0 bg-secondary-1 text-white px-6 py-2 rounded-bl-2xl b3">
              RECOMMENDED
            </div>

            <div className="flex mt-4 items-center gap-4 mb-6">
              <div className="bg-primary-1 p-3 rounded-2xl">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <h2 className="h3 text-secondary-1 mb-0">Join or Create a Group</h2>
                <span className="b3 text-primary-1">Best Value & Social Experience</span>
              </div>
            </div>

            <p className="r2 text-secondary-1 mb-8 leading-relaxed">
              Don’t travel alone! Connect with verified explorers heading to the same destination.
              Share the magic, split the costs of transport and stays, and make friends for life.
            </p>

            <ul className="ul-withNoListStyle space-y-4 mb-10">
              <li className="flex items-center gap-3 r2 text-secondary-1">
                <ShieldCheck size={20} className="text-primary-1" />
                <span>Identity-verified travel companions</span>
              </li>
              <li className="flex items-center gap-3 r2 text-secondary-1">
                <CheckCircle2 size={20} className="text-primary-1" />
                <span>Save up to <strong>40% on total trip costs</strong></span>
              </li>
              <li className="flex items-center gap-3 r2 text-secondary-1">
                <Sparkles size={20} className="text-primary-1" />
                <span>Automated group itinerary syncing</span>
              </li>
            </ul>

            <button
              onClick={() => router.push(`/userTrip/${tripId}/groups`)}
              className="btn btn-primary homebtnprimary w-full mt-auto flexbtn h-[60px]"
            >
              <span className="b1">Explore Group Trips</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* SECONDARY CHOICE: SOLO/MATCHING (Col-span 5) */}
        <div className="lg:col-span-5 m-animate play m-slide-up" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="bg-white border border-neutral-4 rounded-3xl p-8 h-full flex flex-col hov-lift relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-neutral-5 text-secondary-1 px-6 py-2 rounded-bl-2xl s2 font-bold uppercase tracking-wider border-l border-b border-neutral-4">
              Default
            </div>

            <div className="bg-neutral-5 w-fit rounded-2xl p-3 border flex items-center justify-center mb-6">
              <User className="text-neutral-1" size={28} />
            </div>

            <h2 className="h3 text-secondary-1">Solo Adventure</h2>
            <p className="r2 text-neutral-1 mb-8">
              Prefer your own pace? You can still find one-on-one travel partners for specific activities.
            </p>

            <div className="mt-auto space-y-4">
              <button
                onClick={() => router.push(`/userTrip/${tripId}/matching`)}
                className="btn btn-secondary w-full flexbtn"
              >
                <Sparkles size={18} />
                <span className="b2">Find Solo Partners</span>
              </button>
              <button
                onClick={() => router.push(`/userTrip/${tripId}/planner`)}
                className="w-full py-2 r3 text-secondary-1 transition-colors hover:underline"
              >
                I want to plan 100% alone
              </button>
            </div>

            <div className="mt-8 p-4 bg-secondary-5 rounded-xl border border-secondary-3">
              <div className="flex gap-3">
                <ShieldCheck className="text-secondary-1 shrink-0" size={22} />
                <p className="text-sm text-secondary-1 leading-snug">
                  Solo travelers are encouraged to enable &quot; Live Location Sharing &quot; with our community safety net.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}