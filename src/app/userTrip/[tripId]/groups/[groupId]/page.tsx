'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Users, Star, Crown, MessageCircle, ArrowLeft, ShieldCheck, MapPin, ChevronDown, ChevronUp, UserCircle } from 'lucide-react';
import { GroupDetails } from '@/utils/group/group.types';
import { GroupApiServices, GroupDetailsResponse } from '@/utils/group/group.api';
import { useLoader } from '@/components/providers/LoaderContext';
import Image from 'next/image';
import Link from 'next/link';
// import { CommonServices } from '@/utils';

export default function GroupDetailsPage() {
  const { tripId, groupId } = useParams() as { tripId: string; groupId: string };
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const [group, setGroup] = useState<GroupDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFullList, setShowFullList] = useState(false);

  const MAX_VISIBLE = 3;
  const visibleMembers = group && group.members.slice(0, MAX_VISIBLE);
  const remainingCount = group && group.members.length - MAX_VISIBLE;

  useEffect(() => {
    showLoader();
    const load = async () => {
      try {
        const res: GroupDetailsResponse = await GroupApiServices.getGroupDetails(groupId);
        setGroup(res.group);
        // if (!res.tripId) {
        //   tripId = res.tripId;
        // }
      } finally {
        hideLoader();
      }
    };
    load();
  }, [groupId]);

  if (!group) return <div className="paddingTopAndSide text-center py-20 r1">Group not found</div>;

  return (
    <div style={{
      width: "56rem"
    }} className="paddingTopAndSide  mx-auto !pb-32">
      {/* Navigation */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-neutral-2 hover:text-secondary-1 mb-6 transition-colors b3 uppercase tracking-wider"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero Header Section */}
      <div className="m-animate play m-slide-up relative aspect-[16/10] w-full rounded-[32px] overflow-hidden mb-8 shadow-md border border-neutral-5">
        {group.groupImageUrl ? (
          <Image src={group.groupImageUrl} alt={group.groupName} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-primary-5 flex items-center justify-center">
            <Users size={60} className="text-primary-2" />
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full s1 font-bold text-secondary-1 flex items-center gap-2 shadow-sm">
          <ShieldCheck size={16} className="text-success-1" />
          Verified Plan
        </div>
      </div>

      {/* Group Title & Tags */}
      <div className="m-animate play m-slide-up mb-8">
        <h1 className="h2 text-secondary-1 mb-3 font-bold">{group.groupName}</h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex border py-1 px-2 rounded-full items-center gap-2 text-secondary-1 s1 font-bold">
            <Users size={16} className="text-primary-1" />
            {group.membersCount} / {group.maxMembers} Members
          </div>
          <div className="flex border py-1 px-2 rounded-full items-center gap-1 text-neutral-1 s1">
            <MapPin size={16} className="text-neutral-3" />
            {group.isMember ? 'Joined trip' : 'Open for joiners'}
          </div>
        </div>

        <div className="chipsBox">
          {group.tags?.map(tag => (
            <span key={tag} className="chip  !py-1.5 !px-4 s2 font-bold">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Description Box */}
      {group.description && (
        <div className="m-animate play m-slide-up mb-10 bg-secondary-5 p-6 rounded-[24px] border border-secondary-4">
          <p className="r2 text-secondary-1 leading-relaxed opacity-90">{group.description}</p>
        </div>
      )}

      {/* Techy Members Section */}
      <div className="m-animate play m-slide-up mb-16">
        <div className="flex items-center justify-between mb-6">
          <h3 className="b1 text-secondary-1 mb-0 uppercase tracking-widest text-[12px] font-black">Group Roster</h3>
          <span className="s2 text-neutral-2 font-bold uppercase">{group.maxMembers - group.membersCount} slots remaining</span>
        </div>

        {/* Overlapping Avatar Stack (The Trigger) */}
        <div
          className="flex items-center gap-4 cursor-pointer group hover:bg-neutral-5 p-3 rounded-2xl transition-all"
          onClick={() => setShowFullList(!showFullList)}
        >
          <div className="flex -space-x-4">
            {visibleMembers && visibleMembers.map((m, idx) => (
              <div
                key={m.userId}
                className="relative h-14 w-14 rounded-full border-4 border-white overflow-hidden bg-neutral-5 shadow-sm flex-shrink-0"
                style={{ zIndex: MAX_VISIBLE - idx }}
              >
                {m.userDetails?.profile_picture?.[0] ? (
                  <Image
                    src={m.userDetails.profile_picture[0]}
                    alt={m.userDetails.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-4 text-primary-1 font-bold">
                    {m.userDetails?.name?.charAt(0) ?? "U"}
                  </div>
                )}
              </div>
            ))}

            {remainingCount && remainingCount > 0 && (
              <div className="relative h-14 w-14 rounded-full border-4 border-white bg-gray-100 text-gray-700 flex items-center justify-center font-semibold shadow-sm flex-shrink-0">
                +{remainingCount}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 s1 text-secondary-1 font-bold">
            {showFullList ? 'Hide details' : 'View all profiles'}
            {showFullList ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        {/* Expanded Direct-View Members List */}
        {showFullList && (
          <div className="my-6 grid grid-cols-1 md:grid-cols-2 gap-3 m-animate play m-fade-in">
            {group.members.map(m => (
              !m || !m.userDetails ? (null) : (
                <Link
                  key={m.userId}
                  href={`/user/${m.userId}`}
                  className="flex items-center justify-between p-3 bg-white rounded-2xl border border-neutral-5 shadow-sm hover:border-primary-3 transition-colors"
                >
                  {/* Left: Avatar & Primary Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative h-11 w-11 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-5 bg-neutral-5">
                      {m.userDetails?.profile_picture && m.userDetails?.profile_picture ? (
                        <Image
                          src={m.userDetails?.profile_picture[0]}
                          alt={m.userDetails?.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <UserCircle size={20} className="m-auto text-neutral-3 h-full w-full p-2" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="b3 text-secondary-1 truncate font-bold">
                          {/* {m.userDetails?.name} {m.userDetails.sex ? ` | ${m.userDetails.sex}` : ''} */}
                          {m.userDetails?.name} {m.userDetails.sex && m.userDetails.sex.toLowerCase() === 'male' ? '| Male' : m.userDetails.sex?.toLowerCase() === 'female' ? '| Female' : '| Other'}
                        </p>
                        {m.role === 'admin' && <Crown size={12} className="text-warning-1 flex-shrink-0" />}
                      </div>
                      <p className="s1 text-neutral-1 font-bold uppercase tracking-tighter truncate">
                        {m.userDetails.age ? ` ${m.userDetails.age} YEARS` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Right: Technical Stats */}
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0 ml-2">
                    {m.userDetails.rating !== undefined && (
                      <div className="flex items-center gap-1 s2 font-bold text-secondary-1">
                        <Star size={11} fill="#FFC53D" className="text-warning-1" />
                        {m.userDetails.rating}
                      </div>
                    )}
                    <div className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase ${m.role === 'admin'
                      ? 'bg-[var(--warning-5)] text-neutral-1 border border-warning-4'
                      : 'bg-[var(--neutral-5)] text-neutral-1'
                      }`}>
                      {m.role === 'admin' ? 'Host' : 'Member'}
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/70 backdrop-blur-lg border-t border-neutral-5 z-50">
        <div className="max-w-2xl mx-auto">
          {isLoading ?
            <button disabled className={`btn ${group.isMember ? 'btn-secondary' : 'btn-primary'} opacity-60 w-full !h-14 !rounded-full shadow-lg flexbtn animate-pulse duration-300`}>
              <span className="b1 font-bold tracking-tight">Loading...</span>
            </button> :
            !group.isMember ? (
              <button
                onClick={async () => {
                  setIsLoading(true);
                  const res = await GroupApiServices.joinGroupTrip(group.id, tripId);
                  router.push(`/chats?tripId=${tripId}&chatId=${res.chatId}`);
                }}
                className="btn btn-primary w-full !h-14 !rounded-full shadow-lg flexbtn transition-transform active:scale-95"
              >
                <span className="b1 font-bold tracking-tight">Join Group</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsLoading(true);
                  router.push(`/chats?tripId=${tripId}&chatId=${group.chatId}`)
                }
                }
                className="btn btn-secondary w-full !h-14 !rounded-full shadow-lg flexbtn"
              >
                <MessageCircle size={20} />
                <span className="b1 font-bold tracking-tight">Open group chat</span>
              </button>
            )}
        </div>
      </div>
    </div>
  );
}

