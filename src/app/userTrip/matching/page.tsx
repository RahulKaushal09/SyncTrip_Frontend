'use client'

import React, { useEffect, useEffectEvent, useRef, useState } from 'react'
import MatchingScreenHeader from '@/components/Header/MatchingScreenHeader'
import './matching.css'
import apiClient from '@/utils/apiClient'
import { useRouter, useSearchParams } from 'next/navigation'
import TripServices from '@/utils/trip.utils'
import { userTripFields } from '@/constants'

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
export type GetCandidatesResponse = {
    candidates: Candidate[]
    nextCursor: {
        createdAt: string
        id: string
    } | null
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
    const tripId = searchParams?.get('tripId');
    if (!tripId) {
        router.replace('');
    }

    const [profiles, setProfiles] = useState<Candidate[]>([])
    const [cursor, setCursor] = useState<any>(null)
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

    const SWIPE_THRESHOLD = 100
    const current = profiles[index]

    // -------------------------------------
    // FETCH CANDIDATES FROM BACKEND
    // -------------------------------------
    useEffect(() => {
        fetchTripDetails();
        // cleanup RAF if any
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
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
    }, [locationId])
    async function fetchTripDetails() {
        try {
            const tripDetailsFields = [userTripFields.ID, userTripFields.LOCATION_ID, userTripFields.LOCATION_NAME, userTripFields.START_DATE, userTripFields.END_DATE];
            const tripDetails = await TripServices.fetchTripDetails(tripId as string, tripDetailsFields);
            console.log('tripDetails', tripDetails);
            setLocationId(tripDetails.locationId);
            setTripName(tripDetails.locationName as string);
            setStartDate(tripDetails.startDate as string);
            setEndDate(tripDetails.endDate as string);
            setDateString(formatDate(tripDetails.startDate as string) + " - " + formatDate(tripDetails.endDate as string));

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
    function advanceCardAfterAnimation() {
        setTimeout(() => {
            setTransitioning(false)
            setDx(0)
            setRotation(0)
            // safe increment: never go past profiles.length - 1
            setIndex(prev => {
                const next = prev + 1
                return Math.min(next, Math.max(0, profiles.length - 1))
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
    const formatDate = (date: string): string => {
        const d = new Date(date);
        const day = d.getDate();
        const year = d.getFullYear();
        const monthName = d.toLocaleString('en-GB', { month: 'long' });
        return `${day} ${monthName}, ${year}`;
    };

    // -------------------------------------
    // SEND SWIPE TO BACKEND (axios-style)
    // -------------------------------------
    async function sendSwipe(toTripProfileId: string, direction: "like" | "pass") {
        if (!toTripProfileId) return
        try {
            // axios-like client returns { data }
            const res = await apiClient.post<SwipeResponse>('/match/swipe', {
                toTripProfileId,
                direction
            })
            const data = res.data
            if (data?.match && current) {
                // show match popup using the current profile (we already had it)
                setMatchPopupProfile(current)
            }
            return data
        } catch (err: any) {
            // optionally handle specific server errors
            console.error('sendSwipe error', err?.response?.data || err)
            throw err
        }
    }

    function closePopup() {
        setMatchPopupProfile(null);
  // unlock swiping for next interactions and advance past matched card
  swipeLockRef.current = false;
  setIndex(prev => Math.min(prev + 1, Math.max(0, profiles.length - 1)));
  // fetch more if needed
  if (profiles.length - (index + 1) < 3) fetchCandidates();
    }

    // -------------------------------------
    // NO PROFILES LEFT
    // -------------------------------------
    if (!current || locationId === null) {
        return (
            <main className="matchingpage">
                <MatchingScreenHeader tripName={tripName ? tripName : "SyncTrip Travel Match"} dates={dateString} />
                <div className="empty">No more travelers nearby.</div>
            </main>
        )
    }

    // -------------------------------------
    // UI — SWIPE CARDS
    // -------------------------------------
    return (
        <main className="matchingpage">
            <MatchingScreenHeader tripName={tripName} dates={dateString} />

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
                        <div className="meta">
                            <div className="title">
                                <span>{current.userSnapshot.name}, {current.userSnapshot.age}</span>
                            </div>
                            <div className="activities">
                                {current.tripSnapshot.interests?.join(" • ")}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* MATCH POPUP */}
            {matchPopupProfile && (
                <div className="match-overlay" role="dialog" aria-modal="true">
                    <div className="match-card">
                        <h2>It's a Match!</h2>

                        <img className="matchingImg" src={matchPopupProfile.userSnapshot.profile_picture[0]} alt={matchPopupProfile.userSnapshot.name}  />

                        <p className="match-name">
                            {matchPopupProfile.userSnapshot.name}, {matchPopupProfile.userSnapshot.age}
                        </p>
                        <p className="match-activities">
                            {matchPopupProfile.tripSnapshot.interests.join(" • ")}
                        </p>

                        <button onClick={closePopup}>Close</button>
                        <button>Start Chat</button>
                    </div>
                </div>
            )}
        </main>
    )
}
