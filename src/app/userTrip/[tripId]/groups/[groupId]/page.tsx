'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { GroupDetails } from '@/utils/group/group.types';
import { GroupApiServices } from '@/utils/group/group.api';
import { useLoader } from '@/components/providers/LoaderContext';
import Image from 'next/image';
import { CommonServices } from '@/utils';

export default function GroupDetailsPage() {
  const { tripId, groupId } = useParams() as {
    tripId: string;
    groupId: string;
  };
  const router = useRouter();

  const [group, setGroup] = useState<GroupDetails | null>(null);
//   const [loading, setLoading] = useState(true);
  const {showLoader,hideLoader} = useLoader();
  useEffect(() => {
    showLoader();
    const load = async () => {
      try {
        const res = await GroupApiServices.getGroupDetails(groupId);
        console.log(res);
        setGroup(res);
      } finally {
        // setLoading(false);
        hideLoader();
      }
    };
    load();
  }, [groupId]);

//   if (loading) {
//     return <div className="container-custom">Loading...</div>;
//   }

  if (!group) {
    return <div className="container-custom">Group not found</div>;
  }

  return (
    <div className="container-custom">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-secondary-1">
          {group.groupName}
        </h1>
        <p className="text-neutral-2 mt-1">
          {group.membersCount} / {group.maxMembers} members
        </p>
      </div>

      {/* Description */}
      {group.description && (
        <div className="mb-6 text-neutral-2">
          {group.description}
        </div>
      )}

      {/* Members */}
      <div className="mb-10">
        <h3 className="font-semibold mb-3 text-secondary-1">
          Members
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {group.members.map(m => (
            <div
              key={m.userId}
              className="flex items-center gap-3 border rounded-lg p-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary-4 flex items-center justify-center">
                {/* <Users size={18} className="text-primary-1" /> */}
                {m.userDetails.profile_picture ?<Image
                  src={m.userDetails.profile_picture[0]}
                  alt={m.userDetails.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />: <Users size={18} className="text-primary-1" />}
              </div>
              <div>
                <p className="font-medium">
                  {m.userDetails.name}, {m.userDetails.dateOfBirth && CommonServices.computeAge(m.userDetails.dateOfBirth)}
                </p>
                {m.userDetails.sex && (
                  <p className="text-xs text-neutral-2">
                    {m.userDetails.sex}
                  </p>
                )}
                {m.role === 'admin' && (
                  <p className="text-xs text-neutral-2">
                    Group admin
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {!group.isMember ? (
        <button
          onClick={async () => {
            const res = await GroupApiServices.joinGroupTrip(group.id);
            router.push(`/chat/${res.chatId}`);
          }}
          className="btn btn-primary w-full"
        >
          Join Group
        </button>
      ) : (
        <button
          onClick={() => router.push(`/chat/${group.chatId}`)}
          className="btn btn-primary w-full"
        >
          Open Group Chat
        </button>
      )}
    </div>
  );
}
