'use client'

import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import MultipleTripSelectionHeader from '@/components/Header/MultipleTripSelectionHeader'
import './matching.css'
import apiClient from '@/utils/apiClient'
import { useRouter, useSearchParams } from 'next/navigation'
import TripServices from '@/utils/trip.utils'
import { userTripFields } from '@/constants'
import { UserTrip } from '@/types'
import { CommonServices } from '@/utils'
import toast from 'react-hot-toast'

export type Candidate = {
    id: string
    userSnapshot: {
        name: string
        age: number
        profile_picture: string[]
        languages?: string[]
        persona?: string[]
        bio?: string
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

export default function MatchingPage() {
    // get trip id from query 
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tripId, setTripId] = useState<string | null>(null);
    useEffect(() => {
        const id = searchParams?.get('tripId');
        if (id) {
            setTripId(id);
        } else {
            router.replace('');
        }
    }, [searchParams, router]);
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

    // Refs for smoothness & bookkeeping
    const startXRef = useRef<number | null>(null)
    const deltaRef = useRef(0) // current delta (px)
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

        fetchCandidates();
    }, [locationId]);
    async function loadTrips() {
        try {
            debugger;
            let trips: UserTrip[] = await TripServices.fetchUserTrips();
            // show only those trip which have end date in future
            const now = new Date();
            trips = trips.filter(trip => new Date(trip.endDate) > now);
            if( trips.length === 0 ) {
                router.back();
                toast.error("Your trips have ended. Please create a new trip to use Matching feature.");
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
            // read from ref
            const d = deltaRef.current
            const rot = (d / window.innerWidth) * 18
            // update React state only if changed (reduce updates)
            setDx(prev => (prev === d ? prev : d))
            setRotation(prev => (prev === rot ? prev : rot))
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
        deltaRef.current = 0
        setIsDragging(true)
        setTransitioning(false)
        startRafLoop()
    }

    function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        if (!isDragging || startXRef.current === null) return
        // update delta ref (don't set React state here)
        deltaRef.current = e.clientX - startXRef.current
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
            setTransitioning(false)
            setDx(0)
            setRotation(0)
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

        const delta = deltaRef.current
        // reset ref
        deltaRef.current = 0
        startXRef.current = null

        // if a swipe is already in-flight don't process another
        if (swipeLockRef.current) {
            // snap back safely
            setTransitioning(true)
            setDx(0)
            setRotation(0)
            setTimeout(() => setTransitioning(false), 200)
            return
        }

        if (Math.abs(delta) > SWIPE_THRESHOLD && current) {
            swipeLockRef.current = true // lock until animation + response handled
            const direction = delta > 0 ? 'like' : 'pass'

            // animate off-screen quickly
            const offscreenX = delta > 0 ? window.innerWidth * 1.2 : -window.innerWidth * 1.2
            setTransitioning(true)
            // set final transform immediately
            setDx(offscreenX)
            setRotation((offscreenX / window.innerWidth) * 18)

            // send swipe to backend (don’t await to avoid blocking UI, but handle result)
            // sendSwipe(current.id, direction)
            //     .catch(err => {
            //         console.error('sendSwipe failed', err)
            //     })
            //     .finally(() => {
            //         // after server call (or even if it failed) advance card after animation
            //         setTimeout(() => {
            //             setTransitioning(false)
            //             setDx(0)
            //             setRotation(0)
            //             setIndex(i => {
            //                 const next = i + 1
            //                 // ensure we never go past array length
            //                 return Math.min(next, Math.max(profiles.length, next))
            //             })
            //             swipeLockRef.current = false
            //             // prefetch if low
            //             if (profiles.length - (index + 1) < 3) fetchCandidates()
            //         }, 300)
            //     })
            try {
                // await the result so we can decide what to do next
                const data = await sendSwipe(current.id, direction)

                if (data?.match) {
                    // show popup and DO NOT advance index.
                    // Keep swipeLock true so user can't swipe again while popup is open
                    setMatchPopupProfile(current)
                    // keep the matched card state as-is; user will close popup manually
                    // (if you want you can also move it to a "matched" stack, but not necessary)
                    swipeLockRef.current = true
                    setTransitioning(false)
                    setDx(0)
                    setRotation(0)
                    return
                } else {
                    // not a match -> proceed to advance card
                    advanceCardAfterAnimation()
                }
            } catch (err) {
                console.error('sendSwipe failed', err)
                // attempt to recover by advancing card (or snap back). Here we advance.
                advanceCardAfterAnimation()
            } finally {
                // nothing here; advanceCardAfterAnimation / match branch handles unlock
            }
        } else {
            // not a big swipe → snap back
            setTransitioning(true)
            setDx(0)
            setRotation(0)
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
            startXRef.current = null
            setTransitioning(true)
            setDx(0)
            setRotation(0)
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
        // allow index to move one past last so UI shows "No more travelers"
        setIndex(prev => Math.min(prev + 1, profiles.length));
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

    // -------------------------------------
    // NO PROFILES LEFT
    // -------------------------------------
    if (!current || locationId === null) {
        return (
            <main className="matchingpage">
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
                {/* <MultipleTripSelectionHeader tripName={tripName ? tripName : "SyncTrip Travel Match"} dates={dateString} setDates={setDateString} tripId={tripId as string} setSelectedTripId={setTripId} setSelectedTripName={setTripName} /> */}
                {/* <div className="empty">No more travelers nearby.</div> */}
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
            </main>
        )
    }

    // -------------------------------------
    // UI — SWIPE CARDS
    // -------------------------------------
    return (
        <main className="matchingpage">
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
            {/* <MultipleTripSelectionHeader tripName={tripName} dates={dateString} setDates={setDateString} tripId={tripId as string} setSelectedTripId={setTripId} setSelectedTripName={setTripName} /> */}

            <section className="stage">
                <div className="card-wrap">
                    {/* NEXT CARD PREVIEW */}
                    {profiles[index + 1] && (
                        <div className="next-card" aria-hidden>
                            <img src={profiles[index + 1].userSnapshot.profile_picture[0]} alt={profiles[index + 1].userSnapshot.name} />
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
                            transform: `translateX(${dx}px) rotate(${rotation}deg)`,
                            transition: transitioning ? 'transform 0.28s ease' : isDragging ? 'none' : 'transform 0.18s ease',
                            touchAction: 'none' // ensure pointer capture works and prevents scrolling while swiping
                        }}
                        role="button"
                        aria-label={`Profile ${current.userSnapshot.name}`}
                        tabIndex={0}
                    >
                        <img src={current.userSnapshot.profile_picture[0]} alt={current.userSnapshot.name} />
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

                </div>
            </section>

            {/* MATCH POPUP */}
            {matchPopupProfile && (
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
            )}
        </main>
    )
}
