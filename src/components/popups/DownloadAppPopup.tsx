"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Zap, Users, User } from "lucide-react";
import Image from "next/image";
import GroupTripImage from "../../assets/images/groupTripDetails.png";
import GroupTripMembers from "../../assets/images/groupTripMembers.png";
import AppBanner from "../../assets/images/appBanner.png";
import "./downloadPopup.css";
import PlayStoreWhite from "../../assets/icons/PlayStoreWhite.png";
import { useLogin } from "../providers/LoginProvider";
import { triggerLogin } from "@/utils";
import { usePathname } from "next/navigation";
import { redirectToStore } from "@/utils/redirectToStore";

const REAPPEAR_DELAY = 35000; // 35s (random between 30-40s handled below)
const INITIAL_DELAY_GUEST = 15000;
const INITIAL_DELAY_LOGGED_IN = 30000;

const LOGGED_IN_LIMIT = 2;
const POPUP_RESET_KEY = "popup_last_reset";

type PopupVariantProps = {
    handleClose: () => void;
    handleLoginRedirect: () => void;
    isAuthLock: boolean;
};

const getRandomVariant = () => {
    const variants = [0, 3, 4];
    return variants[Math.floor(Math.random() * variants.length)];
};

const getRandomReappearDelay = () =>
    Math.floor(Math.random() * (40000 - 30000 + 1)) + 30000; // 30s–40s

// ── VARIANT 0: Stacked Cards ─────────────────────────────────────────────────
const Variant0StackedCards = ({ handleClose, handleLoginRedirect, isAuthLock }: PopupVariantProps) => (
    <div className="popup-card-base download-popup-sheet-xl">
        <div className="popup-visual-static-wrapper">
            <div className="static-stack-container">
                <div className="stack-card card-details-back shadow-lg">
                    <Image src={GroupTripImage} alt="Trip Details" priority />
                </div>
                <div className="stack-card card-members-front shadow-xl">
                    <Image src={GroupTripMembers} alt="Trip Members" />
                </div>
            </div>
            {!isAuthLock && (
                <div className="app-exclusive-tag">
                    <Zap size={12} fill="currentColor" />
                    <span>APP ONLY</span>
                </div>
            )}
        </div>

        <div className="popup-body-content text-center">
            <h2 className="text-[28px] !font-sans !font-semibold text-secondary-1">
                {isAuthLock ? "Sign In Required" : "Ready for the Trip?"}
            </h2>
            <p className="text-neutral-1 px-3 mt-2 mb-4">
                {isAuthLock
                    ? "You've reached the guest preview limit. Sign in to continue exploring full itineraries."
                    : "Get the full experience! Join the group chat and see real-time updates."}
            </p>

            <div className="feature-mini-pill-row">
                <div className="pill-item"><ShieldCheck size={14} className="text-success-1" /> <span className="text-sm font-medium">Verified</span></div>
                <div className="pill-item"><Users size={14} className="text-primary-1" /> <span className="text-sm font-medium">Community</span></div>
            </div>

            <div className="popup-cta-trap mt-6">
                {isAuthLock ? (
                    <button onClick={handleLoginRedirect} className="w-full btn btn-primary py-4 !flex items-center justify-center gap-2">
                        <User size={20} /> Sign In / Register
                    </button>
                ) : (
                    <button onClick={redirectToStore} className="w-full btn btn-primary py-4 !flex items-center justify-center gap-2">
                        {/* <Image className="mix-blend-multiply" width={28} height={28} src={PlayStoreWhite} alt="Store" /> */}
                        Download the App
                    </button>
                )}
                <button className="hidden-dismiss-link mt-1.5 block w-full text-center" onClick={handleClose}>
                    Continue with limited web features
                </button>
            </div>
        </div>
    </div>
);

// ── VARIANT 3: Single Image Sheet ────────────────────────────────────────────
const Variant3SingleImageSheet = ({ handleClose, handleLoginRedirect, isAuthLock }: PopupVariantProps) => (
    <div className="popup-card-base download-popup-sheet-xl">
        <div className="relative -mt-[60px] -mx-[30px] mb-8 rounded-t-[40px] overflow-hidden bg-neutral-50 shadow-sm">
            <Image
                src={AppBanner}
                alt="Trip Details"
                className="w-full h-auto object-cover block max-h-[240px]"
                priority
            />
        </div>

        <div className="popup-body-content text-center">
            <h2 className="text-[28px] !font-sans !font-semibold text-secondary-1">
                {isAuthLock ? "Please Sign In" : "Ready for the Trip?"}
            </h2>
            <p className="text-neutral-1 px-3 mt-2 mb-6">
                {isAuthLock
                    ? "Your guest session has reached its limit. Sign in to access your full itineraries securely."
                    : "Get the full experience! Join the group chat and see real-time updates."}
            </p>

            <div className="popup-cta-trap mt-2">
                {isAuthLock ? (
                    <button onClick={handleLoginRedirect} className="w-full btn btn-primary py-4 rounded-xl font-bold !flex items-center justify-center gap-2">
                        <User size={20} /> LOG IN TO CONTINUE
                    </button>
                ) : (
                    <button onClick={redirectToStore} className="w-full btn btn-primary py-4 rounded-xl font-bold !flex items-center justify-center gap-2">
                        {/* <Image className="mix-blend-multiply" width={28} height={28} src={PlayStoreWhite} alt="Store" /> */}
                        Download the App
                    </button>
                )}
                <button className="hidden-dismiss-link mt-1 block w-full text-center" onClick={handleClose}>
                    Continue with limited web features
                </button>
            </div>
        </div>
    </div>
);

// ── VARIANT 4: Toast ──────────────────────────────────────────────────────────
const TOAST_DURATION = 10000;

const Variant4AppBannerToast = ({ handleClose }: PopupVariantProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setTimeout(() => setShow(true), 50);
        const timer = setTimeout(() => triggerExit(), TOAST_DURATION);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const triggerExit = () => {
        setShow(false);
        setTimeout(handleClose, 500);
    };

    return (
        <div className={`toast-notification-wrapper ${show ? "is-visible" : ""}`}>
            <button
                onClick={triggerExit}
                className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-neutral-800 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
            >
                <X size={14} />
            </button>

            <div className="w-full leading-none">
                <Image
                    src={AppBanner}
                    alt="App Banner"
                    className="w-full h-auto object-cover block max-h-[160px]"
                    priority
                />
            </div>

            <div className="px-6 pb-2 pt-2 text-center bg-white">
                <div className="inline-block bg-primary-1/10 text-primary-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                    Exclusive Access
                </div>
                <h2 className="text-xl font-serif text-secondary-1 mb-1.5">
                    Unlock the Full Itinerary
                </h2>
                <p className="text-neutral-500 text-xs mb-3 leading-relaxed">
                    Web users only see partial details. Download the SyncTrip app to view maps, group chats, and live updates.
                </p>
                <button
                    onClick={redirectToStore}
                    className="w-full mb-3 btn btn-secondary py-3 rounded-full !flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md text-sm"
                >
                    {/* <Image className="mix-blend-multiply" width={28} height={28} src={PlayStoreWhite} alt="Store" /> */}
                    OPEN IN APP
                </button>
            </div>

            <div className="toast-progress-track" style={{ animationDuration: `${TOAST_DURATION}ms` }} />
        </div>
    );
};

// ── MAIN CONTROLLER ───────────────────────────────────────────────────────────
const DownloadPopup = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAuthLock, setIsAuthLock] = useState(false);
    const [variant, setVariant] = useState<0 | 3 | 4>(0);
    const [cycleCompleted, setCycleCompleted] = useState(false);
    const { isLoggedIn, isLoginPopupOpen, isCompleteProfilePopupOpen } = useLogin();
    const pathname = usePathname();

    const shouldBlockPopup =
        isLoginPopupOpen ||
        isCompleteProfilePopupOpen ||
        pathname.includes("/create/trip") ||
        pathname.includes("careers/linkedin/march-2026");

    // Lock scroll only for auth-lock state (not for regular popups)
    useEffect(() => {
        if (isAuthLock) {
            document.body.classList.add("popup-locked");
        } else {
            document.body.classList.remove("popup-locked");
        }
    }, [isAuthLock]);

    const resetPopupIfNeeded = () => {
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem(POPUP_RESET_KEY);
        if (lastReset !== today) {
            localStorage.removeItem("logged_in_strikes");
            localStorage.removeItem("guest_strikes");
            localStorage.removeItem("popup_cycle_completed");
            localStorage.setItem(POPUP_RESET_KEY, today);
        }
    };

    const scheduleNext = (delay?: number) => {
        const wait = delay ?? getRandomReappearDelay();
        setTimeout(() => {
            if (!shouldBlockPopup) {
                setVariant(getRandomVariant() as 0 | 3 | 4);
                setIsVisible(true);
            }
        }, wait);
    };

    useEffect(() => {
        if (shouldBlockPopup) {
            setIsVisible(false);
            return;
        }

        resetPopupIfNeeded();

        const ua = navigator.userAgent || navigator.vendor || "";

        if (isLoggedIn) {
            setIsAuthLock(false);

            const isDone = localStorage.getItem("popup_cycle_completed") === "true";
            if (isDone) { setCycleCompleted(true); return; }

            const strikes = parseInt(localStorage.getItem("logged_in_strikes") || "0");
            // if (strikes >= LOGGED_IN_LIMIT) {
            //     localStorage.setItem("popup_cycle_completed", "true");
            //     setCycleCompleted(true);
            //     return;
            // }

            setVariant(getRandomVariant() as 0 | 3 | 4);
            setTimeout(() => { if (!shouldBlockPopup) setIsVisible(true); }, INITIAL_DELAY_LOGGED_IN);

        } else {
            const guestStrikes = parseInt(localStorage.getItem("guest_strikes") || "0");

            // if (guestStrikes >= 3) {
            //     // Auth lock — show immediately, no auto-dismiss
            //     setIsAuthLock(true);
            //     setVariant(0);
            //     setIsVisible(true);
            //     return;
            // }

            setIsAuthLock(false);
            setVariant(getRandomVariant() as 0 | 3 | 4);
            setTimeout(() => { if (!shouldBlockPopup) setIsVisible(true); }, INITIAL_DELAY_GUEST);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, shouldBlockPopup]);

    const handleClose = () => {
        setIsVisible(false);

        if (isLoggedIn) {
            const newStrikes = parseInt(localStorage.getItem("logged_in_strikes") || "0") + 1;
            localStorage.setItem("logged_in_strikes", newStrikes.toString());
            if (newStrikes >= LOGGED_IN_LIMIT) {
                localStorage.setItem("popup_cycle_completed", "true");
                setCycleCompleted(true);
                return;
            }
        } else {
            const newStrikes = parseInt(localStorage.getItem("guest_strikes") || "0") + 1;
            localStorage.setItem("guest_strikes", newStrikes.toString());
            if (newStrikes >= 3) {
                // Next appearance is auth lock
                setTimeout(() => {
                    setIsAuthLock(true);
                    setVariant(0);
                    setIsVisible(true);
                }, getRandomReappearDelay());
                return;
            }
        }

        // Schedule next popup after random 30–40s
        scheduleNext();
    };

    if (shouldBlockPopup || cycleCompleted) return null;
    if (!isVisible) return null;

    // Toast renders outside overlay
    if (variant === 4) {
        return (
            <Variant4AppBannerToast
                isAuthLock={isAuthLock}
                handleClose={handleClose}
                handleLoginRedirect={() => triggerLogin()}
            />
        );
    }

    return (
        <div className={`download-popup-overlay active align-bottom ${isAuthLock ? "is-locked" : ""}`}>
            {variant === 0 && (
                <Variant0StackedCards
                    isAuthLock={isAuthLock}
                    handleClose={handleClose}
                    handleLoginRedirect={() => triggerLogin()}
                />
            )}
            {variant === 3 && (
                <Variant3SingleImageSheet
                    isAuthLock={isAuthLock}
                    handleClose={handleClose}
                    handleLoginRedirect={() => triggerLogin()}
                />
            )}
        </div>
    );
};

export default DownloadPopup;