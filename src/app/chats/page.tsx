"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MultipleTripSelectionHeader from "@/components/Header/MultipleTripSelectionHeader";
import ChatList from "@/components/Chats/ChatList";
import ChatWindow from "@/components/Chats/ChatWindow";
import ChatApiService from "@/utils/chats.api.utils";
import ChatHeader from "@/components/Chats/ChatHeader";
import TripServices from "@/utils/trip.utils";
import { useLogin } from "@/components/providers/LoginProvider";

export default function ChatsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const queryChatId = searchParams?.get("chatId");
    const queryTripId = searchParams?.get("tripId");

    const [tripId, setTripId] = useState<string | null>(queryTripId);
    const [chatId, setChatId] = useState<string | null>(queryChatId);

    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [tripName, setTripName] = useState("Select Trip");
    const [tripDates, setTripDates] = useState<string | undefined>(undefined);

    const [chats, setChats] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any | null>(null);
    const mounted = useRef(false);
      const { user} = useLogin(); // ⬅️ use context directly
    console.log(user);
    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    /* -----------------------------------------
       STEP 1: Load User Trips → Select first trip if none selected
    -------------------------------------------*/
    const loadTrips = async () => {
        try {
            const trips = await TripServices.fetchUserTrips(); // YOU MUST IMPLEMENT
            if (!Array.isArray(trips)) return;

            const futureTrips = trips.filter(
                (t: any) => new Date(t.endDate) >= new Date()
            );

            setAllTrips(futureTrips);

            // If no tripId exists in URL → auto-select first trip
            if (!tripId && futureTrips.length > 0) {
                const first = futureTrips[0];
                const formattedDates = `${formatDate(first.startDate)} - ${formatDate(first.endDate)}`;

                setTripId(first.id as string);
                setTripName(first.locationName + " Trip");
                setTripDates(formattedDates);

                router.replace(`/chats?tripId=${first.id}`);

                await loadChats(first.id);
            }
        } catch (err) {
            console.error("Failed to load trips", err);
        }
    };

    /* -----------------------------------------
       STEP 2: Load Chats for selected Trip
    -------------------------------------------*/
    const loadChats = async (forTripId?: string | null) => {
        try {
            const data = await ChatApiService.fetchChats(forTripId || undefined);
            setChats(data || []);
        } catch (err) {
            console.error("Failed to load chats", err);
        }
    };

    /* -----------------------------------------
       STEP 3: On Page Load → load trips & chats
    -------------------------------------------*/
    useEffect(() => {
        loadTrips();

        if (tripId) loadChats(tripId);
        else loadChats(undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripId]);

    /* -----------------------------------------
       STEP 4: Handle notification click (chatId but no tripId)
    -------------------------------------------*/
    useEffect(() => {
        async function resolveChat() {
            if (!chatId) return;
            if (tripId) return openChat(chatId);

            // fetch chat and get trip id
            try {
                const resp = await ChatApiService.getChatById(chatId);
                if (!resp) return;

                setTripId(resp.tripId);

                router.replace(`/chats?chatId=${chatId}&tripId=${resp.tripId}`);

                await loadChats(resp.tripId);
                await openChat(chatId);
            } catch (err) {
                console.error("Failed resolving chatId", err);
            }
        }

        resolveChat();
    }, [chatId]);

    /* -----------------------------------------
       SELECT TRIP (Header Bottom Sheet)
    -------------------------------------------*/
    const handleSelectTrip = async (id: string, name: string, dates: string) => {
        setTripId(id);
        setTripName(name);
        setTripDates(dates);

        router.replace(`/chats?tripId=${id}`);

        await loadChats(id);

        // close chat if switching trips
        setChatId(null);
        setActiveChat(null);
    };

    /* -----------------------------------------
        OPEN CHAT
    -------------------------------------------*/
    const openChat = async (cId: string) => {
        router.replace(`/chats?chatId=${cId}${tripId ? `&tripId=${tripId}` : ""}`);
        setChatId(cId);

        const found = chats.find((c) => c.id === cId) || null;
        setActiveChat(found);
    };

    /* -----------------------------------------
        BACK FROM CHAT (Mobile)
    -------------------------------------------*/
    const onBackFromChat = () => {
        router.replace(tripId ? `/chats?tripId=${tripId}` : `/chats`);
        setChatId(null);
        setActiveChat(null);
    };

    return (
        <div className="chatsPage">
            <div className="min-h-screen bg-white">

                {/* Trip selector shown ONLY in chat list view */}
                {!chatId ? (
                    <MultipleTripSelectionHeader
                        tripName={tripName}
                        dates={tripDates}
                        allTrips={allTrips}
                        onSelectTrip={handleSelectTrip}
                    />
                ) : (
                    <ChatHeader chat={activeChat} onBack={onBackFromChat} />
                )}

                <div className="flex flex-col md:flex-row">

                    {/* LEFT SIDE = CHAT LIST */}
                    <div className={`w-full md:w-1/3 ${chatId ? "hidden md:block" : "block"}`}>
                        <ChatList
                            chats={chats}
                            selectedChatId={chatId}
                            onOpenChat={(id) => openChat(id)}
                        />
                    </div>

                    {/* RIGHT SIDE = CHAT WINDOW */}
                    <div className={`w-full md:w-2/3 ${!chatId ? "hidden md:block" : "block"}`}>
                        {chatId ? (
                            <ChatWindow chatId={chatId} currentUserId={user? user.id:"0"} />
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ------------ UTIL --------------- */
function formatDate(date: string): string {
    const d = new Date(date);
    return `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })}, ${d.getFullYear()}`;
}
