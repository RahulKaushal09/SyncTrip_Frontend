'use client';

import { useRouter, useParams, redirect } from 'next/navigation';
import { Users, User, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, MapPin, Calendar, Info, MessageSquare, UserCheck, ChevronRight, Group } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import TripServices from '@/utils/trip.utils';
import { tripPrivacyOptions, userTripFields } from '@/constants';
import toast from 'react-hot-toast';
import { useLoader } from '@/components/providers/LoaderContext';
import { groupContextTrip, UserTrip } from '@/types';

export default function TravelModePage() {
  const router = useRouter();
  const params = useParams();
  const tripId = params.tripId as string;
  const [isChecking, setIsChecking] = useState(true);
  const [isGroupTrip, setIsGroupTrip] = useState(false);
  const [groupData, setGroupData] = useState<groupContextTrip>();
  const [tripData, setTripData] = useState<Partial<UserTrip>>();
  const { showLoader } = useLoader();

  useEffect(() => {
    const checkPrivacy = async () => {
      try {
        const tripDetailsRes = await TripServices.fetchTripWithGroupDetails(tripId, [userTripFields.ID, userTripFields.PRIVACY, userTripFields.START_DATE, userTripFields.END_DATE, userTripFields.LOCATION_NAME, userTripFields.LOCATION_ID]);

        const tripDetails = tripDetailsRes.trip;
        // const groupDetails = tripDetailsRes.groupContext;

        // if (groupDetails) setGroupData(groupDetails);

        if (!tripDetails.id) {
          router.replace('/');
          return;
        }

        setTripData(tripDetails);

        // if (groupDetails.isInGroup) {
        //   setIsGroupTrip(true);
        // }

        if (tripDetails.privacy?.toLowerCase() === tripPrivacyOptions.PRIVATE) {
          router.replace(`/userTrip/${tripId}/private-trip`);
          return;
        }
        setIsChecking(false);
      } catch (err) {
        router.replace('/');
      }
    };

    checkPrivacy();
  }, [tripId, router]);

  // If we are still checking, don't show ANYTHING
  if (isChecking) {
    showLoader();
    return <></>;
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isGroupTrip) {
    return (
      <div className="paddingTopAndSide !max-w-[800px] lg:pt-10 mx-auto m-animate play m-fade-in !pb-20">
        <div className="bg-white border border-neutral-4 rounded-[24px] md:rounded-[32px] shadow-sm overflow-hidden flex flex-col lg:flex-row">

          {/* LEFT COLUMN: Trip Context & Status */}
          <div className="lg:w-[50%] bg-secondary-5 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-neutral-5">
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-success-4 rounded-full mb-6">
                  <ShieldCheck size={14} className="text-success-1" />
                  <span className="s2 text-success-1 font-bold uppercase tracking-wider">
                    Confirmed Trip
                  </span>
                </div>

                <h1 className="h2 text-secondary-1 mb-3">Group Voyage</h1>
                <p className="r2 text-secondary-1 mb-8 leading-relaxed">
                  You&apos;re currently synced with your travel group. Individual modifications are locked to maintain the collective itinerary.
                </p>

                {/* Status Chips */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-neutral-4">
                    <div className="text-primary-1 bg-primary-5 p-2 rounded-lg">
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <p className="s1 text-neutral-1 font-semibold">Your Role</p>
                      <p className="b2 text-secondary-1 capitalize">{groupData?.role || "Member"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-neutral-4">
                    <div className="text-primary-1 bg-primary-5 p-2 rounded-lg">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="s1 text-neutral-1 font-semibold">Group Capacity</p>
                      <p className="b2 text-secondary-1">
                        {groupData?.membersCount} of {groupData?.maxMembers} Explorers
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Capacity Progress */}
              <div className="mt-10 lg:mt-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="s1 text-secondary-1 font-bold">Sync Status</span>
                  <span className="b3 text-secondary-1 font-bold">{groupData?.groupStatus?.toUpperCase()}</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-1 transition-all duration-1000"
                    style={{
                      width: `${((groupData?.membersCount ?? 0) / (groupData?.maxMembers ?? 1)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Details & Actions */}
          <div className="lg:w-[50%] p-6 md:p-10 flex flex-col">
            <div className="flex-1">
              <h2 className="s1 text-neutral-1 font-bold uppercase tracking-widest mb-6">Itinerary Overview</h2>

              <div className="grid grid-cols-1 gap-6 mb-8">
                <div className="flex gap-4">
                  <MapPin size={22} className="text-secondary-1 shrink-0" />
                  <div>
                    <p className="s1 text-neutral-1 font-semibold">Destination</p>
                    <p className="b1 text-secondary-1">{tripData?.locationName}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Calendar size={22} className="text-secondary-1 shrink-0" />
                  <div>
                    <p className="s1 text-neutral-1 font-semibold">Dates</p>
                    <p className="b1 text-secondary-1">
                      {formatDate(tripData?.startDate)} - {formatDate(tripData?.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-neutral-4 mb-8" />

              <h2 className="s1 text-neutral-1 font-bold uppercase tracking-widest mb-6">Management</h2>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push(`/userTrip/${tripId}/groups/${groupData?.groupId}`)}
                  className="btn btn-primary !h-[56px] w-full !flex items-center justify-between px-6 hover:bg-secondary-5"
                >
                  <div className="flex items-center gap-3"> 
                    <Users size={18} />
                    <span className="b2">View Group Details</span>
                  </div>
                  <ChevronRight size={18} className="text-secondary-1" />
                </button>
                <button
                  onClick={() => router.push(`/userTrip/${tripId}/groups`)}
                  className="btn btn-secondary-border !h-[56px] w-full !flex items-center justify-between px-6 hover:bg-secondary-5"
                >
                  <div className="flex items-center gap-3">
                    <Group size={18} />
                    <span className="b2">Explore More Discussions</span>
                  </div>
                  <ChevronRight size={18} className="text-secondary-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paddingTopAndSide !pb-20">

      {/* Header Section */}
      <div className="m-animate play m-slide-up text-center mb-12 max-w-[800px] mx-auto">
        <h1 className="h2 text-secondary-1">How would you like to explore?</h1>
      </div>

      {/* Grid updated to perfect 50/50 split (col-span-6 each) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 m-stagger play">

        {/* PRIMARY CHOICE: GROUP DISCUSSIONS (Col-span 6) */}
        <div className="lg:col-span-6 m-animate play m-slide-up">
          <div className="bg-primary-5 border-2 border-primary-1 rounded-3xl p-8 hov-lift h-full flex flex-col relative overflow-hidden">
            
            <div className="flex mt-2 items-center gap-4 mb-6">
              <div className="bg-primary-1 p-3 rounded-2xl">
                <MessageSquare className="text-white" size={28} />
              </div>
              <div>
                <h2 className="h3 text-secondary-1 mb-0">Group Discussions</h2>
                <span className="b3 text-primary-1">Connect & Plan Together</span>
              </div>
            </div>

            <p className="r2 text-secondary-1 mb-8 leading-relaxed">
              Jump into active conversations with verified explorers heading to the same destination. 
              Share itineraries, ask questions, and form organic connections before you travel.
            </p>

            <ul className="ul-withNoListStyle space-y-4 mb-10">
              <li className="flex items-center gap-3 r2 text-secondary-1">
                <ShieldCheck size={20} className="text-primary-1" />
                <span>Interact with <strong>verified travelers</strong></span>
              </li>
              <li className="flex items-center gap-3 r2 text-secondary-1">
                <CheckCircle2 size={20} className="text-primary-1" />
                <span>Ask questions & get local recommendations</span>
              </li>
              <li className="flex items-center gap-3 r2 text-secondary-1">
                <Sparkles size={20} className="text-primary-1" />
                <span>Find travel buddies organically</span>
              </li>
            </ul>

            <button
              onClick={() => router.push(`/userTrip/${tripId}/groups`)}
              className="btn btn-primary homebtnprimary w-full mt-auto flexbtn h-[60px]"
            >
              <span className="b1">Join Discussions</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* SECONDARY CHOICE: SOLO ADVENTURE (Col-span 6) */}
        <div className="lg:col-span-6 m-animate play m-slide-up" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="bg-white border-2 border-neutral-4 rounded-3xl p-8 h-full flex flex-col hov-lift relative overflow-hidden">
            
            <div className="flex mt-2 items-center gap-4 mb-6">
              <div className="bg-neutral-5 w-fit rounded-2xl p-3 border flex items-center justify-center">
                <User className="text-neutral-1" size={28} />
              </div>
              <div>
                <h2 className="h3 text-secondary-1 mb-0">Solo Adventure</h2>
                <span className="b3 text-neutral-1">Plan at your own pace</span>
              </div>
            </div>

            <p className="r2 text-neutral-1 mb-8">
              Prefer your own pace? Build your private itinerary from scratch. You can still find one-on-one travel partners for specific activities if you want.
            </p>

            <div className="mt-auto space-y-4">
              <button
                onClick={() => router.push(`/userTrip/${tripId}/matching`)}
                className="btn btn-secondary w-full flexbtn !h-[60px]"
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
                  Solo travelers are encouraged to enable &quot;Live Location Sharing&quot; with our community safety net.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}