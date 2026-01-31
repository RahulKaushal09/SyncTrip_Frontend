'use client';

import { useRouter, useParams } from 'next/navigation';
import { Users, User } from 'lucide-react';

export default function TravelModePage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;

  return (
    <div className="container-custom min-h-[70vh] flex flex-col">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-secondary-1">
          How do you want to travel?
        </h1>
        <p className="text-neutral-2 mt-2">
          Choose how you’d like to experience this trip.  
          You can change this later.
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">

        {/* GROUP OPTION */}
        <div className="border rounded-xl p-6 flex flex-col justify-between bg-white shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary-4 p-3 rounded-full">
                <Users className="text-primary-1" />
              </div>
              <h2 className="text-lg font-semibold text-secondary-1">
                Join or Create a Group
              </h2>
            </div>

            <p className="text-neutral-2">
              Travel with people heading to the same destination.  
              Plan together, share costs, and explore as a group.
            </p>
          </div>

          <button
            onClick={() => router.push(`/userTrip/${tripId}/groups`)}
            className="mt-6 btn btn-primary w-full"
          >
            Explore Groups
          </button>
        </div>

        {/* SOLO OPTION */}
        <div className="border rounded-xl p-6 flex flex-col justify-between bg-white shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-secondary-3 p-3 rounded-full">
                <User className="text-secondary-1" />
              </div>
              <h2 className="text-lg font-semibold text-secondary-1">
                Travel Solo
              </h2>
            </div>

            <p className="text-neutral-2">
              Plan your trip independently.  
              You can still connect with other solo travelers if you want.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => router.push(`/userTrip/${tripId}/planner`)}
              className="btn btn-primary-border w-full"
            >
              Plan My Trip
            </button>

            <button
              onClick={() => router.push(`/userTrip/${tripId}/matching`)}
              className="text-sm text-primary-1 underline"
            >
              Find solo travelers
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
