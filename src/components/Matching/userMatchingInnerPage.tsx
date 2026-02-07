'use client'

import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import MultipleTripSelectionHeader from '@/components/Header/MultipleTripSelectionHeader'
import './matching.css'
import apiClient from '@/utils/apiClient'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import TripServices from '@/utils/trip.utils'
import { userTripFields } from '@/constants'
import { UserTrip } from '@/types'
import { CommonServices } from '@/utils'
import toast from 'react-hot-toast'
import NotificationPermissionPrompt from "@/components/popups/NotificationPermissionPrompt"
import GroupTripOnMatchingCard from '../Cards/GroupTripOnMatchingCard'

export type Candidate = {
    id: string
    userSnapshot: {
        name: string
        age: number
        profile_picture: string[]
        languages?: string[]
        persona?: string[]
        bio?: string
        rating?: number | string
        sex?: string
    }
    tripSnapshot: {
        tripName: string
        startDate: string
        endDate: string
        budget?: string
        interests: string[]
        privacy: "public trip" | "invite only"
    }
    locationId: string
    createdAt: string
    locationName: string
}
export type cursorType = {
    createdAt: string
    id: string
}
export type GetCandidatesResponse = {
    candidates: Candidate[]
    nextCursor: cursorType | null
}

export type SwipeResponse =
    | {
        ok: true
        match: false
    }
    | {
        ok: true
        match: true
        matchId: string
        chatId: string
    }

const MatchPopUpBox = ({ matchPopupProfile, closePopup, startChat }) => (
    <div className="match-overlay" role="dialog" aria-modal="true">
        <div className="match-card">
            <h2>It&apos;s a Match!</h2>

            <img className="matchingImg" src={matchPopupProfile.userSnapshot.profile_picture[0]} alt={matchPopupProfile.userSnapshot.name} />

            <p className="match-name">
                {matchPopupProfile.userSnapshot.name}, {matchPopupProfile.userSnapshot.age}
            </p>
            <p className="match-activities">
                {matchPopupProfile.tripSnapshot.interests.join(" • ")}
            </p>

            <button onClick={closePopup}>Close</button>
            <button onClick={startChat}>Start Chat</button>
        </div>
    </div>
)

export default function MatchingPage() {
    // get trip id from query 
    const params = useParams();
    const [tripId, setTripId] = useState<string | null>(null);

    // const tripId_Params = params.tripId as string;
    const router = useRouter();
    // const searchParams = useSearchParams();
    useEffect(() => {
        const id = params.tripId;
        if (id) {
            setTripId(id as string);
        } else {
            router.replace('');
        }
    }, [params]);
    // const tripId = searchParams?.get('tripId');
    // if (!tripId) {
    //     router.replace('');
    // }

    const [profiles, setProfiles] = useState<Candidate[]>([])
    const [cursor, setCursor] = useState<cursorType | null>(null)
    const [index, setIndex] = useState(0)

    // Visible transform state (kept in React so UI reacts)
    const [dx, setDx] = useState(0)
    const [rotation, setRotation] = useState(0)
    const [transitioning, setTransitioning] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // Expansion states
    const [isExpanded, setIsExpanded] = useState(false)
    const [expandDy, setExpandDy] = useState(0)

    // Refs for smoothness & bookkeeping
    const [showSwipeGuide, setShowSwipeGuide] = useState(false)

    const startXRef = useRef<number | null>(null)
    const startYRef = useRef<number | null>(null)
    const deltaRef = useRef(0) // current deltaX (px)
    const deltaYRef = useRef(0) // current deltaY (px)
    const rafRef = useRef<number | null>(null)
    const pointerIdRef = useRef<number | null>(null)
    const swipeLockRef = useRef(false) // prevents double-swipes/inflight
    const [locationId, setLocationId] = useState<string | null>(null)
    const [tripName, setTripName] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [dateString, setDateString] = useState<string>("");
    const [matchPopupProfile, setMatchPopupProfile] = useState<Candidate | null>(null)
    const [allTrips, setAllTrips] = useState<UserTrip[]>([]);
    const [matchChatId, setMatchChatId] = useState<string | null>(null);
    const [reviewMode, setReviewMode] = useState(false);

    const SWIPE_THRESHOLD = 100
    const EXPAND_THRESHOLD = 120
    // const current = profiles[index]
    const current = index >= 0 && index < profiles.length ? profiles[index] : undefined
    async function loadPassedProfiles() {
        if (!tripId) return;

        try {
            const res = await apiClient.get(`/match/passed?tripId=${tripId}`);
            const data = res.data;

            if (data?.candidates?.length) {
                setProfiles(data.candidates);
                setIndex(0);
                setReviewMode(true);
                // Reset expansion on load
                setIsExpanded(false);
                setExpandDy(0);
            } else {
                // no passes
                setProfiles([]);
                setReviewMode(true);
            }
        } catch (err) {
            console.error("Failed to load passed profiles:", err);
        }
    }

    // -------------------------------------
    // FETCH CANDIDATES FROM BACKEND
    // -------------------------------------
    useEffect(() => {
        const seen = localStorage.getItem("synctrip_swipe_guide_seen")
        if (!seen) {
            setShowSwipeGuide(true)
        }
    }, [])
    useEffect(() => {
        let mounted = true;
        (async () => {
            await loadTrips();
            if (!mounted) return;
            fetchTripDetails();
        })();
        // cleanup RAF if any
        return () => {
            mounted = false;
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!tripId) return;
        loadTrips();
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [tripId]);

    useEffect(() => {
        if (tripId && allTrips.length > 0) {
            fetchTripDetails();
        }
    }, [tripId, allTrips]);
    function closeSwipeGuide() {
        localStorage.setItem("synctrip_swipe_guide_seen", "true")
        setShowSwipeGuide(false)
    }
    async function fetchCandidates() {
        try {
            let url = `/match/candidates?limit=10&locationId=${locationId}`
            if (cursor) url += `&cursor=${encodeURIComponent(JSON.stringify(cursor))}`

            // assuming apiClient is axios-like
            const res = await apiClient.get<GetCandidatesResponse>(url)
            const data = res.data
            if (data?.candidates?.length) {
                setProfiles(prev => [...prev, ...data.candidates])
                setCursor(data.nextCursor)
            }
        } catch (err) {
            console.error('fetchCandidates error', err)
        }

    }
    useEffect(() => {
        const currentTrip = allTrips.find(trip => trip.id === tripId);
        if (currentTrip && currentTrip.groupContext && currentTrip.groupContext.isInGroup) {
        } else {
            fetchCandidates();
        }
    }, [locationId]);
    async function loadTrips() {
        try {
            let trips: UserTrip[] = await TripServices.fetchUserTrips();
            // show only those trip which have end date in future
            const now = new Date().toISOString().split('T')[0];
            trips = trips.filter(trip => trip.endDate.split('T')[0] >= now);
            if (trips.length === 0) {
                toast.error("Your trips have ended. Please create a new trip to match with others.");
                router.replace('/');
                return;
            }
            setAllTrips(trips);
        } catch (err) {
            console.error('Failed to fetch trips', err);
        }
    }
    async function fetchTripDetails() {
        try {
            // const tripDetailsFields = [userTripFields.ID, userTripFields.LOCATION_ID, userTripFields.LOCATION_NAME, userTripFields.START_DATE, userTripFields.END_DATE];
            // const userTrips: UserTrip[] = await TripServices.fetchUserTrips();
            // setAllTrips(userTrips);
            if (!tripId) return;
            allTrips.forEach((trip) => {
                if (trip.id === tripId) {
                    setLocationId(trip.locationId);
                    setTripName(trip.locationName as string);
                    setStartDate(trip.startDate as string);
                    setEndDate(trip.endDate as string);
                    setDateString(CommonServices.formatDateShortHeaderTripSelection(trip.startDate as string, trip.endDate as string));
                }
            });
            // const tripDetails: UserTrip = await TripServices.fetchTripDetails(tripId);
            // console.log('tripDetails', tripDetails);
            // setLocationId(tripDetails.locationId);
            // setTripName(tripDetails.locationName as string);
            // setStartDate(tripDetails.startDate as string);
            // setEndDate(tripDetails.endDate as string);
            // setDateString(formatDate(tripDetails.startDate as string) + " - " + formatDate(tripDetails.endDate as string));

        }
        catch (err) {
            console.error('fetchCandidates error', err)
        }

    }


    // -------------------------------------
    // RAF loop for smooth transform application
    // -------------------------------------
    function startRafLoop() {
        if (rafRef.current) return
        const loop = () => {
            // read from refs
            const d = deltaRef.current
            const dy_ = deltaYRef.current
            const absD = Math.abs(d)
            const absDy = Math.abs(dy_)
            const rot = (absD / window.innerWidth) * 18 * (absD > absDy ? 1 : 0)
            if (absD > absDy) {
                // horizontal dominant
                setDx(prev => (prev === d ? prev : d))
                setRotation(prev => (prev === rot ? prev : rot))
                setExpandDy(0)
            } else {
                // vertical dominant
                setDx(0)
                setRotation(0)
                setExpandDy(dy_ < 0 ? dy_ : 0)
            }
            rafRef.current = requestAnimationFrame(loop)
        }
        rafRef.current = requestAnimationFrame(loop)
    }

    function stopRafLoop() {
        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
    }

    // -------------------------------------
    // SWIPE HANDLING (pointer capture + RAF)
    // -------------------------------------
    function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        if (transitioning || swipeLockRef.current) return
        try {
            (e.currentTarget as Element).setPointerCapture(e.pointerId)
            pointerIdRef.current = e.pointerId
        } catch (err) {
            // Some browsers / element combos may throw; ignore gracefully
        }
        startXRef.current = e.clientX
        startYRef.current = e.clientY
        deltaRef.current = 0
        deltaYRef.current = 0
        setIsDragging(true)
        setTransitioning(false)
        startRafLoop()
    }

    function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging || startXRef.current === null || startYRef.current === null) return
        // update delta refs (don't set React state here)
        deltaRef.current = e.clientX - startXRef.current
        deltaYRef.current = e.clientY - startYRef.current
        // we let RAF loop push updates
    }
    // function advanceCardAfterAnimation() {
    //     setTimeout(() => {
    //         setTransitioning(false)
    //         setDx(0)
    //         setRotation(0)
    //         // safe increment: never go past profiles.length - 1
    //         setIndex(prev => {
    //             const next = prev + 1
    //             return Math.min(next, Math.max(0, profiles.length - 1))
    //         })
    //         swipeLockRef.current = false
    //         // prefetch using the latest index (use functional check)
    //         setTimeout(() => {
    //             // small delay ensures state updated; you could also compute with refs
    //             if (profiles.length - (index + 1) < 3) fetchCandidates()
    //         }, 0)
    //     }, 300)
    // }
    function advanceCardAfterAnimation() {
        setTimeout(() => {
            stopRafLoop() // 🔥 IMPORTANT
            setTransitioning(false)
            setDx(0)
            setRotation(0)
            setIsExpanded(false)
            setExpandDy(0)
            // advance index — allow it to become profiles.length (one past last)
            setIndex(prev => {
                const next = prev + 1
                // clamp between 0 and profiles.length (not profiles.length - 1)
                return Math.min(Math.max(0, next), profiles.length)
            })
            swipeLockRef.current = false
            // prefetch using the latest index (use functional check)
            setTimeout(() => {
                // small delay ensures state updated; you could also compute with refs
                if (profiles.length - (index + 1) < 3) fetchCandidates()
            }, 0)
        }, 300)
    }
    async function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging) return
        setIsDragging(false)
        stopRafLoop()

        // release capture if we set it
        try {
            if (pointerIdRef.current !== null) (e.currentTarget as Element).releasePointerCapture(pointerIdRef.current)
        } catch (err) {
            // ignore
        }
        pointerIdRef.current = null

        const deltaX = deltaRef.current
        const deltaY = deltaYRef.current
        // reset refs
        deltaRef.current = 0
        deltaYRef.current = 0
        startXRef.current = null
        startYRef.current = null

        // if a swipe is already in-flight don't process another
        if (swipeLockRef.current) {
            // snap back safely
            setTransitioning(true)
            setDx(0)
            setRotation(0)
            setExpandDy(0)
            setTimeout(() => setTransitioning(false), 200)
            return
        }

        const absX = Math.abs(deltaX)
        const absY = Math.abs(deltaY)
        const isHorizontalSwipe = absX > SWIPE_THRESHOLD && absX >= absY
        const isVerticalUp = !isExpanded && deltaY < -EXPAND_THRESHOLD && absY > absX
        const isVerticalDown = isExpanded && deltaY > EXPAND_THRESHOLD && absY > absX

        if (isHorizontalSwipe && current) {
            swipeLockRef.current = true // lock until animation + response handled
            const direction = deltaX > 0 ? 'like' : 'pass'

            // animate off-screen quickly
            const offscreenX = deltaX > 0 ? window.innerWidth * 1.2 : -window.innerWidth * 1.2
            setTransitioning(true)
            // set final transform immediately
            setDx(offscreenX)
            setRotation((offscreenX / window.innerWidth) * 18)
            setExpandDy(0)

            advanceCardAfterAnimation()

            // 🔹 send swipe in background
            sendSwipe(current.id, direction)
                .then((data) => {
                    debugger;
                    if (data?.match) {
                        setMatchPopupProfile(current)
                        setMatchChatId(data.chatId)
                        swipeLockRef.current = true // lock while popup open
                    }
                })
                .catch(console.error)
        } else if (isVerticalUp && current) {
            // expand
            setIsExpanded(true)
            setExpandDy(-EXPAND_THRESHOLD)
            setTransitioning(true)
            setTimeout(() => {
                setTransitioning(false)
            }, 280)
        } else if (isVerticalDown && current) {
            // collapse
            setIsExpanded(false)
            setExpandDy(0)
            setTransitioning(true)
            setTimeout(() => {
                setTransitioning(false)
            }, 280)
        } else {
            // not a big swipe → snap back
            setTransitioning(true)
            setDx(0)
            setRotation(0)
            setExpandDy(0)
            setTimeout(() => setTransitioning(false), 200)
        }
    }

    function onPointerCancel(e: React.PointerEvent<HTMLDivElement>) {
        // treat like pointer up but do not send swipe
        if (isDragging) {
            stopRafLoop()
            setIsDragging(false)
            try {
                if (pointerIdRef.current !== null) (e.currentTarget as Element).releasePointerCapture(pointerIdRef.current)
            } catch (err) { }
            pointerIdRef.current = null
            deltaRef.current = 0
            deltaYRef.current = 0
            startXRef.current = null
            startYRef.current = null
            setTransitioning(true)
            setDx(0)
            setRotation(0)
            setExpandDy(0)
            setTimeout(() => setTransitioning(false), 200)
        }
    }

    // -------------------------------------
    // SEND SWIPE TO BACKEND (axios-style)
    // -------------------------------------
    async function sendSwipe(toTripProfileId: string, direction: "like" | "pass") {
        if (!toTripProfileId) return
        if (!tripId) return
        try {
            // axios-like client returns { data }
            const res = await apiClient.post<SwipeResponse>('/match/swipe', {
                toTripProfileId,
                direction,
                tripId
            })
            const data = res.data
            if (data?.match && current) {
                // show match popup using the current profile (we already had it)
                setMatchPopupProfile(current)
                setMatchChatId(data.chatId);
            }
            return data
        } catch (err: unknown) {
            // optionally handle specific server errors
            console.error('sendSwipe error', err);
            throw err
        }
    }
    function closePopup() {
        setMatchPopupProfile(null);
        setMatchChatId(null);
        // unlock swiping for next interactions and advance past matched card
        swipeLockRef.current = false;
        setIsExpanded(false)
        setExpandDy(0)
        // allow index to move one past last so UI shows "No more travelers"
        // setIndex(prev => Math.min(prev + 1, profiles.length));
        // fetch more if needed
        if (profiles.length - (index + 1) < 3) fetchCandidates();
    }
    // function closePopup() {
    //     setMatchPopupProfile(null);
    //     setMatchChatId(null);
    //     // unlock swiping for next interactions and advance past matched card

    //     swipeLockRef.current = false;
    //     setIndex(prev => Math.min(prev + 1, Math.max(0, profiles.length - 1)));
    //     // fetch more if needed
    //     if (profiles.length - (index + 1) < 3) fetchCandidates();
    // }
    function startChat() {
        // navigate to chat using matchPopupProfile.matchId or chatId
        if (matchChatId) {
            // assuming you have chatId from the swipe response stored somewhere
            router.push(`/chats?chatId=${matchChatId}`);
        }
    }

    const currentTrip = allTrips.find(trip => trip.id === tripId);
    // -------------------------------------
    // NO PROFILES LEFT
    // -------------------------------------
    if (!current || locationId === null) {
        return (
            <main className="matchingpage">
                {/* Ensure notification prompt is here for consistency */}
                <NotificationPermissionPrompt />

                <MultipleTripSelectionHeader
                    tripName={tripName}
                    dates={dateString}
                    tripId={tripId as string}
                    allTrips={allTrips}
                    onSelectTrip={(id, name, dates) => {
                        setTripId(id);
                        setTripName(name);
                        setDateString(dates);
                        fetchTripDetails();
                    }}
                />
                {currentTrip && currentTrip.groupContext && currentTrip.groupContext.isInGroup ? (
                    <GroupTripOnMatchingCard trip={currentTrip as UserTrip} />
                ) : (
                    <>
                        <div className="empty">
                            <div className='empty-innerBox'>
                                <p>No more travelers nearby.</p>

                                <button
                                    className="btn btn-secondary"
                                    style={{ marginTop: "16px" }}
                                    onClick={loadPassedProfiles}
                                >
                                    View Previously Skipped Travellers
                                </button>

                                {reviewMode && profiles.length === 0 && (
                                    <p style={{ marginTop: 10, color: "#777" }}>
                                        You haven’t skipped anyone yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {matchPopupProfile && <MatchPopUpBox startChat={startChat} matchPopupProfile={matchPopupProfile} closePopup={closePopup} />}
                    </>
                )}
            </main>
        )
    }

    // -------------------------------------
    // UI — SWIPE CARDS
    // -------------------------------------
    const bottomRadius = (isExpanded || expandDy < -20) ? 0 : 18
    return (
        <main className="matchingpage">
            <NotificationPermissionPrompt />

            <MultipleTripSelectionHeader
                tripName={tripName}
                dates={dateString}
                tripId={tripId as string}
                allTrips={allTrips}
                onSelectTrip={(id, name, dates) => {
                    setTripId(id);
                    setTripName(name);
                    setDateString(dates);
                    // re-fetch trip details + candidates
                    fetchTripDetails();
                }}
            />
            {currentTrip && currentTrip.groupContext && currentTrip.groupContext.isInGroup ? (
                <GroupTripOnMatchingCard trip={currentTrip as UserTrip} />
            ) : (
                <>
                    {/* GUIDELINES */}
                    {showSwipeGuide && (
                        <div className="swipe-guide-overlay">
                            <div className="swipe-guide-card">
                                <div className="swipe-guide-arrows">
                                    <div className="arrow left">←</div>
                                    <div className="arrow up">↑</div>
                                    <div className="arrow right">→</div>
                                </div>

                                <h3>Swipe to connect</h3>

                                <p>
                                    <strong>Swipe right</strong> to connect<br />
                                    <strong>Swipe left</strong> to skip<br />
                                    <strong>Swipe up</strong> to view full details
                                </p>


                                <button onClick={closeSwipeGuide}>Got it</button>
                            </div>
                        </div>
                    )}
                    {/* <MultipleTripSelectionHeader tripName={tripName} dates={dateString} setDates={setDateString} tripId={tripId as string} setSelectedTripId={setTripId} setSelectedTripName={setTripName} /> */}

                    <section className="stage">
                        <div className="card-wrap">
                            {/* NEXT CARD PREVIEW */}
                            {profiles[index + 1] && (
                                <div className="next-card" aria-hidden>
                                    <img src={profiles[index + 1].userSnapshot.profile_picture?.[0]} alt={profiles[index + 1].userSnapshot.name} />
                                </div>
                            )}

                            {/* ACTIVE CARD */}
                            <div
                                className="card"
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                                onPointerCancel={onPointerCancel}
                                style={{
                                    transform: `translate3d(${dx}px, ${expandDy}px, 0) rotate(${rotation}deg)`,
                                    borderRadius: `18px 18px ${bottomRadius}px ${bottomRadius}px`,
                                    transition: transitioning ? 'all 0.28s ease' : isDragging ? 'none' : 'all 0.18s ease',
                                    touchAction: 'none' // ensure pointer capture works and prevents scrolling while swiping
                                }}
                                role="button"
                                aria-label={`Profile ${current.userSnapshot.name}`}
                                tabIndex={0}
                            >
                                <img src={current.userSnapshot?.profile_picture?.[0]} alt={current.userSnapshot.name} />
                                <div className="MatchingCardMeta">
                                    <div className='MatchingCardBottom'>
                                        <div className="MatchingCardTitle">
                                            <span>{current.userSnapshot.name}, {current.userSnapshot.age}</span>
                                        </div>
                                        <div className="MatchingCardActivities">
                                            {current.tripSnapshot.interests?.join(" • ")}
                                        </div>
                                        <div className="MatchingCardTripDates">
                                            <span>{CommonServices.formatDateShortHeaderTripSelection(current.tripSnapshot.startDate, current.tripSnapshot.endDate)}</span>
                                        </div>
                                    </div>
                                </div>
                                {reviewMode && <div className="badge-previouslySkipped">Previously Skipped</div>}

                            </div>

                            {/* DETAILS PANEL (revealed on swipe up) */}
                            {/* DETAILS PANEL (revealed on swipe up) */}
                            {(expandDy < 0 || isExpanded) && current && (
                                <div
                                    className="card-details"
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        height: isExpanded ? '320px' : `${Math.max(0, -expandDy)}px`,
                                        backgroundColor: 'rgba(255, 255, 255, 0.96)',
                                        backdropFilter: 'blur(12px)',
                                        transition: transitioning ? 'height 0.28s ease-out' : 'none',
                                        overflow: 'hidden',
                                        zIndex: 1,
                                        borderRadius: '0 0 18px 18px', // optional: keep bottom rounded if you want
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: '20px 20px 0',
                                            height: '100%',
                                            overflowY: 'auto',
                                            paddingBottom: '20px',
                                        }}
                                    >
                                        {/* Close Button */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                                            <button
                                                onClick={() => {
                                                    setIsExpanded(false)
                                                    setExpandDy(0)
                                                    setTransitioning(true)
                                                    setTimeout(() => setTransitioning(false), 280)
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    fontSize: '28px',
                                                    cursor: 'pointer',
                                                    color: '#444',
                                                    padding: '0',
                                                    width: '36px',
                                                    height: '36px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* Multiple Profile Pictures */}
                                        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                            {current.userSnapshot.profile_picture
                                                .filter((url: string) => url.includes('synctrip.in'))
                                                .map((url: string, i: number) => (
                                                    <img
                                                        key={i}
                                                        src={url}
                                                        alt={`${current.userSnapshot.name}'s photo ${i + 1}`}
                                                        style={{
                                                            width: '100px',
                                                            height: '100px',
                                                            borderRadius: '12px',
                                                            objectFit: 'cover',
                                                            flexShrink: 0,
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        }}
                                                    />
                                                ))}
                                            {current.userSnapshot.profile_picture.filter((url: string) => url.includes('synctrip.in')).length === 0 && (
                                                <img
                                                    src={current.userSnapshot?.profile_picture?.[0]}
                                                    alt={current.userSnapshot.name}
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        borderRadius: '12px',
                                                        objectFit: 'cover',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* User Info Section */}
                                        <div style={{ marginTop: '20px' }}>
                                            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#222' }}>
                                                About {current.userSnapshot.name}
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#444' }}>
                                                <div><strong>Age:</strong> {current.userSnapshot.age}  {current.userSnapshot.sex && <>• <strong>Sex:</strong> {current.userSnapshot.sex}</>}</div>
                                                {current.userSnapshot.rating && (
                                                    <div><strong>Rating:</strong> ⭐ {current.userSnapshot.rating}/5</div>
                                                )}
                                                {current.userSnapshot.languages && current.userSnapshot.languages.length > 0 && (
                                                    <div><strong>Languages:</strong> {current.userSnapshot.languages.join(', ')}</div>
                                                )}
                                            </div>

                                            {current.userSnapshot.persona && current.userSnapshot.persona.length > 0 && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <strong style={{ fontSize: '15px', color: '#333' }}>Travel Style</strong>
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                                                        {current.userSnapshot.persona.map((trait: string, i: number) => (
                                                            <span
                                                                key={i}
                                                                style={{
                                                                    background: '#f0f0f0',
                                                                    padding: '6px 12px',
                                                                    borderRadius: '20px',
                                                                    fontSize: '13px',
                                                                    color: '#333',
                                                                }}
                                                            >
                                                                {trait}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {current.userSnapshot.bio && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <strong style={{ fontSize: '15px', color: '#333' }}>Bio</strong>
                                                    <p style={{ marginTop: '6px', lineHeight: '1.5', color: '#555' }}>
                                                        {current.userSnapshot.bio}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Trip Details Section */}
                                        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                                            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#222' }}>
                                                Trip to {current.tripSnapshot.tripName || current.locationName}
                                            </h3>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '15px', color: '#444' }}>
                                                <div>
                                                    <strong>Dates:</strong>{' '}
                                                    {CommonServices.formatDateShortHeaderTripSelection(
                                                        current.tripSnapshot.startDate,
                                                        current.tripSnapshot.endDate
                                                    )}
                                                </div>
                                                {current.tripSnapshot.budget && (
                                                    <div><strong>Budget:</strong> {current.tripSnapshot.budget}</div>
                                                )}
                                                <div><strong>Privacy:</strong> {current.tripSnapshot.privacy === "public trip" ? "Public" : "Invite Only"}</div>
                                                {current.tripSnapshot.interests?.length > 0 && (
                                                    <div style={{ marginTop: '12px' }}>
                                                        <strong>Interests:</strong>
                                                        <div style={{ marginTop: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                            {current.tripSnapshot.interests.map((interest: string, i: number) => (
                                                                <span
                                                                    key={i}
                                                                    style={{
                                                                        background: '#e6f7ff',
                                                                        color: '#0066cc',
                                                                        padding: '4px 10px',
                                                                        borderRadius: '16px',
                                                                        fontSize: '13px',
                                                                    }}
                                                                >
                                                                    {interest}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </section>

                    {/* MATCH POPUP */}
                    {matchPopupProfile && (<MatchPopUpBox startChat={startChat} matchPopupProfile={matchPopupProfile} closePopup={closePopup} />)}

                </>
            )}
        </main>
    )
}