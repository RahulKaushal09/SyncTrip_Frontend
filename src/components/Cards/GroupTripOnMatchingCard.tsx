'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UserTrip } from '@/types';
import { CommonServices } from '@/utils';
import "../Matching/matching.css"
import { MessageCircle, Users2 } from 'lucide-react';
import GumletImage from '../common/GumletImage';
type Props = {
    trip: UserTrip;
};

export default function GroupTripOnMatchingCard({ trip }: Props) {
    const router = useRouter();

    const { image, locationName, startDate, endDate, groupContext, id } = trip;

    if (!groupContext?.isInGroup) return null;
    const openGroupChat = () => {
        if (groupContext.chatId) {
            // console.log('Navigating to group chat for chatId:', groupContext.chatId);
            router.push(`/chats?chatId=${groupContext.chatId}&tripId=${trip.id}`);
        }
    };
    const openGroupDetails = () => {
        // console.log('Navigating to group details for groupId:', groupContext.groupId);
        router.push(`/userTrip/${trip.id}/groups/${groupContext.groupId}`);
    }
    const openAllGroups = () => {
        router.push(`/userTrip/${trip.id}/groups`);
    }

    return (
        <section className="stage">
            <div className="card-wrap">
                <div className="card group-card">
                    {/* Background image */}
                    <GumletImage src={image} alt={locationName as string} />

                    {/* Gradient overlay */}
                    <div className="MatchingCardMeta" style={{ background: "rgba(0, 0, 0, 0.6)" }}>
                        <div className="group-card-centerText">
                            <div className="MatchingCardTitle">
                                <span>{locationName}</span>
                            </div>

                            <div className="MatchingCardTripDates">
                                {CommonServices.formatDateShortHeaderTripSelection(startDate!, endDate!)}
                            </div>

                            <div className="MatchingCardActivities">
                                You&apos;re traveling as part of a group - connect with travelers inside the group chat.

                            </div>
                        </div>
                    </div>

                    {/* Group badge */}
                    <div className="badge-group flex items-center gap-1">
                        <Users2 size={16} /> GROUP TRIP
                    </div>

                    {/* Chat button */}
                    {groupContext.chatId && (
                        <button
                            className="group-chat-btn flex items-center justify-center"
                            onClick={openGroupChat}
                        >
                            <MessageCircle size={16} />
                        </button>
                    )}

                    {/* Bottom CTA */}
                    <div className="group-cta">
                        <button
                            className="btn btn-primary"
                            onClick={openGroupDetails}
                        >
                            View Group Details
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={openAllGroups}
                        >
                            All Groups
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
