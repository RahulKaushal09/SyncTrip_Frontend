'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, Plus } from 'lucide-react';
import { GroupApiServices } from '@/utils/group/group.api';
import { GroupCard } from '@/utils/group/group.types';
import TripServices from '@/utils/trip.utils';
import { userTripFields } from '@/constants';

export default function GroupsPage() {
  const { tripId } = useParams() as { tripId: string };
  const router = useRouter();

  const [groups, setGroups] = useState<GroupCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const tripFields = [userTripFields.ID, userTripFields.LOCATION_ID,userTripFields.START_DATE];
        const tripDetails = await TripServices.fetchTripDetails(tripId,tripFields);
        // month should ideally come from trip details
        // const month = new Date().toISOString().slice(0, 7);
        const month = new Date(tripDetails.startDate).toISOString().slice(0, 7);
        const res = await GroupApiServices.getGroupsByLocationAndMonth(
          tripDetails.locationId,
          month
        );
        setGroups(res);
      } catch {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    };
    loadGroups();
  }, []);

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-1">
          Groups for your trip
        </h1>
        <p className="text-neutral-2 mt-1">
          Join an existing group or create one if none fit your plan.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-28 bg-neutral-5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Groups List */}
      {!loading && groups.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {groups.map(group => (
            <div
              key={group.id}
              className="border rounded-xl p-4 flex gap-4 bg-white shadow-sm"
              onClick={() =>
                router.push(`/userTrip/${tripId}/groups/${group.id}`)
              }
            >
              <div className="w-20 h-20 rounded-lg bg-primary-4 flex items-center justify-center">
                <Users className="text-primary-1" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-secondary-1">
                  {group.groupName}
                </h3>

                <p className="text-sm text-neutral-2 mt-1">
                  {group.membersCount} / {group.maxMembers} members
                </p>

                <div className="flex gap-2 mt-2 flex-wrap">
                  {group.tags?.map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-primary-5 text-primary-1 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && groups.length === 0 && (
        <div className="flex flex-col items-center text-center mt-20">
          <Users className="w-12 h-12 text-neutral-3 mb-4" />
          <h3 className="font-semibold text-secondary-1">
            No groups yet
          </h3>
          <p className="text-neutral-2 mt-2 max-w-sm">
            Be the first to create a group for this trip and invite others to join.
          </p>

          <button
            onClick={() =>
              router.push(`/userTrip/${tripId}/groups/create`)
            }
            className="mt-6 btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Create a Group
          </button>
        </div>
      )}
    </div>
  );
}
