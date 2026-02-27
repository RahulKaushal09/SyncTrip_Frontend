'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserTrip } from '@/types';
import { CommonServices } from '@/utils';
import "../Matching/matching.css";
import { Lock, Globe2 } from 'lucide-react';
import GumletImage from '../common/GumletImage';

type Props = {
  trip: UserTrip;
  onMakePublic?: () => void; // optional callback if you want to control flow
};

export default function PrivateTripCard({ trip, onMakePublic }: Props) {
  const router = useRouter();

  const { image, locationName, startDate, endDate } = trip;

  const handleMakePublic = () => {
    if (onMakePublic) {
      onMakePublic();
    } else {
      // fallback navigation if needed
      router.push(`/userTrip/${trip.id}/privacy`);
    }
  };

  return (
    <section className="stage">
      <div className="card-wrap">
        <div className="card group-card">
          
          {/* Background image */}
          <GumletImage src={image} alt={locationName as string} />

          {/* Dark overlay */}
          <div
            className="MatchingCardMeta"
            style={{ background: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="group-card-centerText">
              <div className="MatchingCardTitle">
                <span>{locationName}</span>
              </div>

              <div className="MatchingCardTripDates">
                {CommonServices.formatDateShortHeaderTripSelection(
                  startDate!,
                  endDate!
                )}
              </div>

              <div className="MatchingCardActivities">
                This trip is currently private. Matching and group discovery
                are available only for public trips.
              </div>
            </div>
          </div>

          {/* PRIVATE badge */}
          <div className="badge-group flex items-center gap-1 bg-black/70">
            <Lock size={14} /> PRIVATE TRIP
          </div>

          {/* Disabled matching hint */}
          <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
            <Globe2 size={14} />
            Matching disabled
          </div>

          {/* Bottom CTA */}
          <div className="group-cta">
            <button
              className="btn btn-primary !flex items-center justify-center gap-2"
              onClick={handleMakePublic}
            >
              <Globe2 size={16} />
              Make Trip Public
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
