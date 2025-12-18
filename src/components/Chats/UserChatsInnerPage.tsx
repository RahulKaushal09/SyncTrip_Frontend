"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import MultipleTripSelectionHeader from "@/components/Header/MultipleTripSelectionHeader";
import ChatList from "@/components/Chats/ChatList";
import ChatWindow from "@/components/Chats/ChatWindow";
import ChatApiService from "@/utils/chats.api.utils";
import ChatHeader from "@/components/Chats/ChatHeader";
import TripServices from "@/utils/trip.utils";
import { useLogin } from "@/components/providers/LoginProvider";
import { set } from "lodash";
import { Chat, UserTrip, Message, LatestMessage } from "@/types";
import { CommonServices } from "@/utils";
import toast from "react-hot-toast";
import { useLoader } from "@/components/providers/LoaderContext";
import { StorageUtils } from "@/utils";

export default function ChatsPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const rawChatId = searchParams?.get("chatId");
    const rawTripId = searchParams?.get("tripId");
    const [tripId, setTripId] = useState<string | null>(rawTripId);
    const [chatId, setChatId] = useState<string | null>(rawChatId);
    const [allTrips, setAllTrips] = useState<UserTrip[]>([]);
    const [tripName, setTripName] = useState<string>("Select Trip");
    const [tripDates, setTripDates] = useState<string | undefined>(undefined);
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const mountedRef = useRef(false);
    const initializedRef = useRef(false);
    const resolvingChatRef = useRef(false);
    const [unreadByTrip, setUnreadByTrip] = useState<Record<string, number>>({});
    const { user } = useLogin();
    const { showLoader, hideLoader } = useLoader();

    // Socket ref (single instance)
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    // Socket connection (once on mount)
    useEffect(() => {
        if (typeof window === "undefined" || !user?.id) return;
        const token = StorageUtils.getToken();
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "/", {
            auth: { token },
            autoConnect: true,
            transports: ["websocket"],
        });
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Socket connected globally", socket.id);
        });

        socket.on("connect_error", (err) => {
            console.error("Global socket connect_error", err);
        });

        // Real-time chat list update
        socket.on("chat_update", (data: { chatId: string; latestMessage: LatestMessage }) => {
            if (!tripId || data.chatId === chatId) return; // Ignore if no trip or current chat (handled separately)
            setChats((prevChats) => {
                return prevChats.map((chat) => {
                    if (chat.id !== data.chatId) return chat;
                    const newChat: Chat = { ...chat, latestMessage: data.latestMessage, updatedAt: data.latestMessage.createdAt };
                    // Update unreadByTrip if this message is unread for current user and in current trip
                    if (tripId && !data.latestMessage.readBy?.includes(user.id)) {
                        setUnreadByTrip((prev) => ({
                            ...prev,
                            [tripId]: (prev[tripId] || 0) + 1,
                        }));
                    }
                    return newChat;
                });
            });
        });

        // Handle mark read confirmation (optional, for UI feedback)
        socket.on("read_marked", (data: { chatId: string }) => {
            // Could update local state or show toast
            console.log("Messages marked as read:", data.chatId);
            // Recount unreadByTrip if needed
            fetchUnreadByTrip();
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user?.id, tripId, chatId]); // Reconnect if user changes

    // Existing util functions (formatDate, fetchUnreadByTrip, loadAllTrips, etc.) remain the same...
    function formatDate(dateStr: string) {
        try {
            const d = new Date(dateStr);
            return `${d.getDate()} ${d.toLocaleString("en-GB", { month: "long" })}, ${d.getFullYear()}`;
        } catch {
            return dateStr;
        }
    }

    const fetchUnreadByTrip = async () => {
        try {
            if (ChatApiService && typeof ChatApiService.fetchUnreadCount === "function") {
                const res = await ChatApiService.fetchUnreadCount();
                if (res && typeof res === "object" && "byTrip" in res) {
                    setUnreadByTrip(res.byTrip || {});
                } else {
                    setUnreadByTrip({});
                }
            } else {
                const r = await fetch("/api/chats/unread-count");
                const data = await r.json();
                setUnreadByTrip(data?.byTrip || {});
            }
        } catch (err) {
            console.error("fetchUnreadByTrip error", err);
            setUnreadByTrip({});
        }
    };

    const loadAllTrips = async () => {
        try {
            showLoader();
            const trips = await TripServices.fetchUserTrips();
            const now = new Date();
            const futureTrips = trips.filter((t: UserTrip) => new Date(t.endDate) >= now);
            const usable = futureTrips.length > 0 ? futureTrips : trips;
            if (!Array.isArray(usable)) {
                router.replace("/");
                return [];
            }
            if (usable.length == 0) {
                toast.error("No trips found. Please create a trip first.");
                router.replace("/");
                return [];
            }
            setAllTrips(usable);
            return trips;
        } catch (err) {
            console.error("getAllTrips error:", err);
            return [];
        } finally {
            hideLoader();
        }
    };

    const loadTripsAndMaybeAutoSelect = async () => {
        // ... (existing code unchanged)
        try {
            let trips: UserTrip[] = [];
            if (allTrips.length === 0) {
                trips = await loadAllTrips();
            } else {
                trips = allTrips;
            }
            if (!Array.isArray(trips)) return;
            const now = new Date();
            const futureTrips = trips.filter((t: UserTrip) => new Date(t.endDate) >= now);
            const usable = futureTrips.length > 0 ? futureTrips : trips;
            if (!mountedRef.current) return;
            setAllTrips(usable);
            if (rawTripId) {
                setTripId(rawTripId);
                usable.forEach((t) => {
                    if (t.id === rawTripId) {
                        setTripName(t.locationName || "Trip");
                        setTripDates(CommonServices.formatDateShortHeaderTripSelection(t.startDate, t.endDate));
                    }
                });
                return;
            };
            if (!tripId && usable.length > 0) {
                const first = usable[0];
                setTripId(first.id as string);
                setTripName(first.locationName || "Trip");
                setTripDates(CommonServices.formatDateShortHeaderTripSelection(first.startDate, first.endDate));
                router.replace(`/chats?tripId=${first.id}`);
                await loadChatsForTrip(first.id);
            }
        } catch (err) {
            console.error("loadTripsAndMaybeAutoSelect error:", err);
        }
    };

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
            setTripDates(CommonServices.formatDateShortHeaderTripSelection(trip.startDate, trip.endDate));
        }
    };

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
            if (rawTripId && chatTripId && rawTripId !== chatTripId) {
                setTripId(chatTripId);
                updateTripNameAndDates(chatTripId);
                router.replace(`/chats?chatId=${incomingChatId}&tripId=${chatTripId}`);
                await openChatWindowOnly(incomingChatId, chatObj, chatTripId);
                resolvingChatRef.current = false;
                return;
            }
            if (!tripId && chatTripId) {
                setTripId(chatTripId);
                updateTripNameAndDates(chatTripId);
                router.replace(`/chats?chatId=${incomingChatId}&tripId=${chatTripId}`);
                await openChatWindowOnly(incomingChatId, chatObj, chatTripId);
                resolvingChatRef.current = false;
                return;
            }
            await openChatWindowOnly(incomingChatId, chatObj);
        } catch (err) {
            console.error("resolveChatIdToTripAndOpen error:", err);
        } finally {
            resolvingChatRef.current = false;
        }
    };

    // Polling for unread (fallback, but now less needed due to real-time)
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            await fetchUnreadByTrip();
        };
        run();
        const interval = setInterval(() => {
            if (!cancelled) fetchUnreadByTrip();
        }, 30000); // Increased to 30s since real-time handles most
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (!chatId) return;
        setActiveChat((prev) => {
            if (prev && prev.id === chatId) return prev;
            return chats.find((c) => c.id === chatId) || null;
        });
    }, [chatId, chats]);

    const openChatWindowOnly = async (cId: string, chatObjFromServer?: Chat, tripId_arg?: string) => {
        setChatId(cId);
        const correctTrip = tripId_arg || tripId;
        if (correctTrip) {
            const allChats = await ChatApiService.fetchChats(correctTrip);
            setChats(allChats);
            const fullChat = allChats.find((c: Chat) => c.id === cId) || null;
            setActiveChat(fullChat);
        } else {
            setActiveChat(chatObjFromServer || chats.find((c) => c.id === cId) || null);
        }
        // Update URL
        if (tripId_arg || tripId) {
            router.replace(`/chats?chatId=${cId}&tripId=${tripId_arg || tripId}`);
        } else {
            router.replace(`/chats?chatId=${cId}`);
        }
        // Mark as read via socket
        const socket = socketRef.current;
        if (socket && cId) {
            socket.emit("mark_read", cId);
            // Decrement unreadByTrip if was unread
            if (tripId) {
                setUnreadByTrip((prev) => ({
                    ...prev,
                    [tripId]: Math.max(0, (prev[tripId] || 0) - 1),
                }));
            }
        }
    };

    const openChatFromList = (cId: string) => {
        const q = tripId ? `?chatId=${cId}&tripId=${tripId}` : `?chatId=${cId}`;
        router.replace(`/chats${q}`);
        setChatId(cId);
        setActiveChat(chats.find((c) => c.id === cId) || null);
        // Mark read (same as above)
        const socket = socketRef.current;
        if (socket && cId) {
            socket.emit("mark_read", cId);
        }
    };

    const onSelectTripFromHeader = async (id: string, name: string, dates: string) => {
        setTripId(id);
        setTripName(name);
        setTripDates(dates);
        setChatId(null);
        setActiveChat(null);
        router.replace(`/chats?tripId=${id}`);
        await loadChatsForTrip(id);
        // Join/leave rooms if needed, but since global, no need
    };

    const onBackFromChat = () => {
        if (tripId) {
            router.replace(`/chats?tripId=${tripId}`);
        } else {
            router.replace(`/chats`);
        }
        setChatId(null);
        setActiveChat(null);
    };

    // Initialization useEffect (unchanged)
    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;
        (async () => {
            await loadAllTrips();
            if (rawChatId && !rawTripId) {
                await resolveChatIdToTripAndOpen(rawChatId);
                return;
            }
            if (rawTripId && !rawChatId) {
                setTripId(rawTripId);
                await loadTripsAndMaybeAutoSelect();
                await loadChatsForTrip(rawTripId);
                return;
            }
            await loadTripsAndMaybeAutoSelect();
        })();
    }, []);

    useEffect(() => {
        if (!tripId || allTrips.length === 0) return;
        const trip = allTrips.find((t) => t.id === tripId);
        if (trip) {
            setTripName(trip.locationName || "Trip");
            setTripDates(CommonServices.formatDateShortHeaderTripSelection(trip.startDate, trip.endDate));
        }
    }, [tripId, allTrips]);

    useEffect(() => {
        if (!initializedRef.current) return;
        if (!tripId) return;
        loadChatsForTrip(tripId);
    }, [tripId]);

    // Pass socket to ChatWindow
    const socket = socketRef.current;

    return (
        <div className="chatsPage">
            <div className="min-h-screen bg-white">
                {chatId ? (
                    <ChatHeader chat={activeChat} onBack={onBackFromChat} />
                ) : (
                    <MultipleTripSelectionHeader
                        tripId={tripId || undefined}
                        tripName={tripName}
                        dates={tripDates}
                        allTrips={allTrips}
                        onSelectTrip={onSelectTripFromHeader}
                        unreadByTrip={unreadByTrip}
                    />
                )}
                <div className="flex flex-col md:flex-row">
                    <div className={`w-full md:w-1/3 ${chatId ? "hidden md:block" : "block"}`}>
                        <ChatList
                            chats={chats}
                            selectedChatId={chatId}
                            onOpenChat={openChatFromList}
                            currentUserId={user ? user.id : "0"}
                        />
                    </div>
                    <div className={`w-full md:w-2/3 ${!chatId ? "hidden md:block" : "block"}`}>
                        {chatId ? (
                            <ChatWindow chatId={chatId} currentUserId={user ? user.id : "0"} socket={socket || undefined} />
                        ) : (
                            <div className="p-8 text-center text-gray-500">Select a chat to start messaging</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}