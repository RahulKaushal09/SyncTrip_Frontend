"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import MultipleTripSelectionHeader from "@/components/Header/MultipleTripSelectionHeader";
import ChatList from "@/components/Chats/ChatList";
import ChatWindow from "@/components/Chats/ChatWindow";
import ChatApiService from "@/utils/chats.api.utils";
import ChatHeader from "@/components/Chats/ChatHeader";
import TripServices from "@/utils/trip.utils";
import { useLogin } from "@/components/providers/LoginProvider";
import { set } from "lodash";
import { Chat, UserTrip } from "@/types";

/**
 * ChatsPage
 *
 * Rules implemented:
 * - If chatId only in URL -> fetch chat to get tripId -> update url (chatId & tripId) -> open chat window (no chat list)
 * - If tripId only in URL -> load chat list for that trip -> do not add chatId to url until user opens a chat
 * - If both present -> verify chat belongs to trip, if mismatch set tripId from chat -> open chat
 * - If neither -> fetch trips, auto-select first upcoming trip -> set tripId in url and load chats for it
 *
 * This code avoids loops by using `initializedRef` and by carefully sequencing async calls.
 */

export default function ChatsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Raw URL params (strings or null)
    const rawChatId = searchParams?.get("chatId");
    const rawTripId = searchParams?.get("tripId");

    // Local state for selected trip and open chat
    const [tripId, setTripId] = useState<string | null>(rawTripId);
    const [chatId, setChatId] = useState<string | null>(rawChatId);

    const [allTrips, setAllTrips] = useState<any[]>([]);
    const [tripName, setTripName] = useState<string>("Select Trip");
    const [tripDates, setTripDates] = useState<string | undefined>(undefined);

    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);

    const mountedRef = useRef(false);
    const initializedRef = useRef(false); // prevents double-initialization
    const resolvingChatRef = useRef(false); // prevents duplicate chat resolution
    const { user } = useLogin();

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    /* ------------- UTIL: formatDate -------------- */
    function formatDate(dateStr: string) {
        try {
            const d = new Date(dateStr);
            return `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })}, ${d.getFullYear()}`;
        } catch {
            return dateStr;
        }
    }

    /* ------------- Load trips and auto-pick first upcoming -------------- */
    const loadAllTrips = async () => {
        try {
            const trips = await TripServices.fetchUserTrips();
            const now = new Date();
            const futureTrips = trips.filter((t: any) => new Date(t.endDate) >= now);
            const usable = futureTrips.length > 0 ? futureTrips : trips;
            if (!Array.isArray(usable)) {
                router.replace("/");
            }
            // if(usable.length == 0 ) {
            //     router.replace("/");
            // }
            setAllTrips(usable);
            return trips;
        } catch (err) {
            console.error("getAllTrips error:", err);
            return [];
        }
    };
    const loadTripsAndMaybeAutoSelect = async () => {
        try {
            let trips: UserTrip[] = [];
            if (allTrips.length === 0) {
                trips = await loadAllTrips();
            }
            else {
                trips = allTrips;
            }
            if (!Array.isArray(trips)) return;

            // Keep only upcoming (endDate >= today). If none, keep all.
            const now = new Date();
            const futureTrips = trips.filter((t: any) => new Date(t.endDate) >= now);
            const usable = futureTrips.length > 0 ? futureTrips : trips;

            if (!mountedRef.current) return;
            setAllTrips(usable);

            // If there is already a tripId from URL, do not auto-select
            if (rawTripId) {
                setTripId(rawTripId);
                usable.forEach((t) => {
                    if (t.id === rawTripId) {
                        setTripName(t.locationName || "Trip");
                        setTripDates(`${formatDate(t.startDate)} - ${formatDate(t.endDate)}`);
                    }
                });
                return;
            };

            // If no tripId in state and we have trips -> pick first
            if (!tripId && usable.length > 0) {
                const first = usable[0];
                const formattedDates = `${formatDate(first.startDate)} - ${formatDate(first.endDate)}`;
                setTripId(first.id as string);
                setTripName(first.locationName || "Trip");
                setTripDates(formattedDates);

                // Update URL to include tripId (no chatId)
                router.replace(`/chats?tripId=${first.id}`);
                await loadChatsForTrip(first.id);
            }
        } catch (err) {
            console.error("loadTripsAndMaybeAutoSelect error:", err);
        }
    };

    /* ------------- Load chats for a trip -------------- */
    const loadChatsForTrip = async (forTripId?: string | null) => {
        try {
            const data = await ChatApiService.fetchChats(forTripId || undefined);
            if (!mountedRef.current) return;
            setChats(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("loadChatsForTrip error:", err);
            if (mountedRef.current) setChats([]);
        }
    };
    const updateTripNameAndDates = (tId: string) => {
        const trip = allTrips.find((t) => t.id === tId);
        if (trip) {
            setTripName(trip.locationName || "Trip");
            setTripDates(`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`);
        }
    };
    /* ------------- Resolve chatId only case: get tripId from chat and open chat -------------- */
    const resolveChatIdToTripAndOpen = async (incomingChatId: string) => {
        if (resolvingChatRef.current) return;
        resolvingChatRef.current = true;

        try {
            const chatObj = await ChatApiService.getChatById(incomingChatId);
            if (!mountedRef.current) return;

            if (!chatObj) {
                setChatId(null);
                router.replace(`/chats${tripId ? `?tripId=${tripId}` : ""}`);
                resolvingChatRef.current = false;
                return;
            }

            const chatTripId = chatObj.tripId;

            // CASE 1: URL had both tripId + chatId but mismatch
            if (rawTripId && chatTripId && rawTripId !== chatTripId) {
                setTripId(chatTripId);
                updateTripNameAndDates(chatTripId);

                router.replace(`/chats?chatId=${incomingChatId}&tripId=${chatTripId}`);
                await openChatWindowOnly(incomingChatId, chatObj, chatTripId);
                resolvingChatRef.current = false;
                return;
            }

            // CASE 2: No tripId → set it from chat
            if (!tripId && chatTripId) {
                setTripId(chatTripId);
                updateTripNameAndDates(chatTripId);

                router.replace(`/chats?chatId=${incomingChatId}&tripId=${chatTripId}`);
                await openChatWindowOnly(incomingChatId, chatObj, chatTripId);
                resolvingChatRef.current = false;
                return;
            }

            // CASE 3: tripId already correct → just open
            await openChatWindowOnly(incomingChatId, chatObj);
        } catch (err) {
            console.error("resolveChatIdToTripAndOpen error:", err);
        } finally {
            resolvingChatRef.current = false;
        }
    };

    /* ------------- helper: open chat window only (hide list) -------------- */

    const openChatWindowOnly = async (
        cId: string,
        chatObjFromServer?: Chat,
        tripId_arg?: string
    ) => {
        setChatId(cId);

        // Always load chats for the correct trip so we can populate users
        const correctTrip = tripId_arg || tripId;
        if (correctTrip) {
            const allChats = await ChatApiService.fetchChats(correctTrip);
            setChats(allChats);

            const fullChat = allChats.find((c: Chat) => c.id === cId) || null;
            setActiveChat(fullChat);
        } else {
            // fallback
            setActiveChat(chatObjFromServer || chats.find((c) => c.id === cId) || null);
        }

        // update URL
        if (tripId_arg || tripId) {
            router.replace(`/chats?chatId=${cId}&tripId=${tripId_arg || tripId}`);
        } else {
            router.replace(`/chats?chatId=${cId}`);
        }
    };
    // const openChatWindowOnly = (cId: string, chatObjFromServer?: Chat, tripId_arg?: string) => {
    //     setChatId(cId);
    //     setActiveChat((prev) => chatObjFromServer || prev || chats.find((c) => c.id === cId) || null);
    //     // Ensure URL contains both
    //     if (tripId || tripId_arg) router.replace(`/chats?chatId=${cId}&tripId=${tripId_arg || tripId}`);
    //     else router.replace(`/chats?chatId=${cId}`);
    // };

    /* ------------- Open chat from UI (user clicks in ChatList) -------------- */
    const openChatFromList = (cId: string) => {
        // Add chatId to URL (preserve tripId)
        const q = tripId ? `?chatId=${cId}&tripId=${tripId}` : `?chatId=${cId}`;
        router.replace(`/chats${q}`);
        setChatId(cId);
        setActiveChat(chats.find((c) => c.id === cId) || null);
    };

    /* ------------- Change trip from header -------------- */
    const onSelectTripFromHeader = async (id: string, name: string, dates: string) => {
        // set trip and update url; close any open chat
        setTripId(id);
        setTripName(name);
        setTripDates(dates);

        // remove chatId when switching trips
        setChatId(null);
        setActiveChat(null);

        router.replace(`/chats?tripId=${id}`);
        await loadChatsForTrip(id);
    };

    /* ------------- Back from chat (mobile) -------------- */
    const onBackFromChat = () => {
        // remove only chatId from query, keep tripId
        if (tripId) {
            router.replace(`/chats?tripId=${tripId}`);
        } else {
            router.replace(`/chats`);
        }
        setChatId(null);
        setActiveChat(null);
    };

    /* ------------- INITIALIZATION logic: runs once when page loads -------------- */
    useEffect(() => {
        // Ensure we run initialization only once on the client
        if (initializedRef.current) return;
        initializedRef.current = true;

        (async () => {
            await loadAllTrips();
            // If the URL had a chatId (with or without tripId)
            if (rawChatId && !rawTripId) {
                // Defer to resolution function which will also set tripId if needed
                await resolveChatIdToTripAndOpen(rawChatId);
                return;
            }

            // No chatId in URL -> if tripId present, load that trip's chats
            if (rawTripId && !rawChatId) {
                setTripId(rawTripId);
                // Optionally fetch trip meta to show name/dates (if you have an endpoint)
                // We'll still try to get trips for header list
                await loadTripsAndMaybeAutoSelect(); // this will NOT overwrite tripId because rawTripId exists
                await loadChatsForTrip(rawTripId);
                return;
            }
            await loadTripsAndMaybeAutoSelect();

            // Neither chatId nor tripId -> load trips and auto-select first upcoming
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // run once client-side


    useEffect(() => {
        if (!tripId || allTrips.length === 0) return;

        const trip = allTrips.find((t) => t.id === tripId);
        if (trip) {
            setTripName(trip.locationName || "Trip");
            setTripDates(`${formatDate(trip.startDate)} - ${formatDate(trip.endDate)}`);
        }
    }, [tripId, allTrips]);
    /* ------------- When tripId changes due to user interaction after init -------------- */
    useEffect(() => {
        // If the page is initialized and user changed tripId programmatically (e.g., select header),
        // reload chats for that tripId. Do NOT auto-open a chat.
        if (!initializedRef.current) return;
        if (!tripId) return;
        loadChatsForTrip(tripId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tripId]);

    /* ---------- Render ---------- */
    return (
        <div className="chatsPage">
            <div className="min-h-screen bg-white">
                {/* Header: if chat window open -> show small ChatHeader (with back); else show trip selector */}
                {!chatId && !activeChat ? (
                    <MultipleTripSelectionHeader
                        tripName={tripName}
                        dates={tripDates}
                        allTrips={allTrips}
                        onSelectTrip={onSelectTripFromHeader}
                    />
                ) : (
                    activeChat && (
                        <ChatHeader chat={activeChat} onBack={onBackFromChat} />
                    )
                )}

                <div className="flex flex-col md:flex-row">
                    {/* Chat list - visible when no chatId OR on desktop */}
                    <div className={`w-full md:w-1/3 ${chatId ? "hidden md:block" : "block"}`}>
                        <ChatList
                            chats={chats}
                            selectedChatId={chatId}
                            onOpenChat={(id: string) => openChatFromList(id)}
                        />
                    </div>

                    {/* Chat window */}
                    <div className={`w-full md:w-2/3 ${!chatId ? "hidden md:block" : "block"}`}>
                        {chatId ? (
                            <ChatWindow chatId={chatId} currentUserId={user ? user.id : "0"} />
                        ) : (
                            <div className="p-8 text-center text-gray-500">Select a chat to start messaging</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
