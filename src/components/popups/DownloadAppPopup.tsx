"use client";

import React, { useState, useEffect } from "react";
import { X, ShieldCheck, Zap, Users, Lock, User } from "lucide-react";
import Image from "next/image";
import GroupTripImage from "../../assets/images/groupTripDetails.png";
import GroupTripMembers from "../../assets/images/groupTripMembers.png";
import AppBanner from "../../assets/images/appBanner.png";
import "./downloadPopup.css";
import PlayStoreWhite from "../../assets/icons/PlayStoreWhite.png";
import PlayStore from "../../assets/icons/PlayStore.png";
import { useLogin } from "../providers/LoginProvider";
import { triggerLogin } from "@/utils";
import { usePathname } from "next/navigation";

const REAPPEAR_DELAY = 22000;
const INITIAL_DELAY_GUEST = 15000;
const INITIAL_DELAY_LOGGED_IN = 30000;
const APP_DOWNLOAD_URL = "https://play.google.com/store/apps/details?id=com.synctrip";

// Limit rules
const GUEST_LIMIT = 3;
const ANDROID_LOGGED_IN_LIMIT = 2;
const IOS_LOGGED_IN_LIMIT = 1;

type PopupVariantProps = {
  isAuthLock: boolean;
  handleClose: () => void;
  handleLoginRedirect: () => void;
};

// Helper to get a random popup variant (0 to 4)
const getRandomVariant = () => Math.floor(Math.random() * 5);

// VARIANT 0: Original Bottom Sheet (Stacked Cards)
const Variant0StackedCards = ({ isAuthLock, handleClose, handleLoginRedirect }: PopupVariantProps) => (
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
          <button onClick={handleLoginRedirect} className="w-full btn btn-primary py-4 !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
            <User size={20} /> Sign In / Register
          </button>
        ) : (
          <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full btn btn-primary py-4 !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
            <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
              <Image className="mix-blend-multiply" width={30} height={30} src={PlayStoreWhite} alt="Playstore" />
            </div>
            Download the Android App
          </button>
        )}

        {!isAuthLock && (
          <button className="hidden-dismiss-link mt-1.5 block w-full text-center" onClick={handleClose}>
            Continue with limited web features
          </button>
        )}
      </div>
    </div>
  </div>
);

// VARIANT 1: Centered Modal (Edge-to-Edge Image)
const Variant1CenteredModal = ({ isAuthLock, handleClose, handleLoginRedirect }: PopupVariantProps) => (
  <div className="popup-card-base popup-variant-modal shadow-2xl bg-white">
    <div className="w-full leading-none">
      <Image
        src={AppBanner}
        alt="Trip Details"
        className="w-full h-auto object-cover block"
        priority
      />
    </div>

    <div className="px-8 pb-8 pt-6 text-center bg-white">
      {!isAuthLock && (
        <div className="inline-block bg-primary-1/10 text-primary-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Exclusive Access
        </div>
      )}
      <h2 className="text-2xl font-serif text-secondary-1 mb-1">
        {isAuthLock ? "Guest Limit Reached" : "Unlock the Full Features"}
      </h2>
      <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
        {isAuthLock
          ? "Please log in to securely resume your session and access member details."
          : "Web users only see partial details. Download the SyncTrip app to view maps, group discussions, and live updates."}
      </p>

      {isAuthLock ? (
        <button onClick={handleLoginRedirect} className="btn btn-secondary w-full !flex items-center justify-center gap-2 mx-auto hover:bg-secondary-hover transition-colors">
          <User size={18} /> Continue to Login
        </button>
      ) : (
        <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="btn btn-secondary w-full !flex items-center justify-center gap-2 mx-auto hover:bg-secondary-hover transition-colors">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image className="mix-blend-multiply" width={32} height={32} src={PlayStore} alt="Playstore" />
          </div>
          Download App for Android
        </button>
      )}

      {!isAuthLock && (
        <button className="text-neutral-400 text-xs mt-1 underline decoration-neutral-300 hover:text-neutral-600 transition-colors" onClick={handleClose}>
          Maybe next time
        </button>
      )}
    </div>
  </div>
);

// VARIANT 2: Light Mode Compact (No Images)
const Variant2CompactSheet = ({ isAuthLock, handleClose, handleLoginRedirect }: PopupVariantProps) => (
  <div className="popup-card-base popup-variant-compact shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
    {!isAuthLock && (
      <button className="popup-close-ghost" onClick={handleClose}>
        <X size={16} />
      </button>
    )}

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-6 sm:p-8">
      <div className="w-14 h-14 shrink-0 bg-primary-1/10 rounded-2xl flex items-center justify-center border border-primary-1/20 text-primary-1">
        {isAuthLock ? <Lock size={28} /> : <Zap size={28} />}
      </div>

      <div className="text-left flex-1">
        <div className="text-[10px] font-bold tracking-widest uppercase text-primary-1 mb-1">
          {isAuthLock ? "Authentication Required" : "SyncTrip Mobile"}
        </div>
        <h2 className="text-xl sm:text-2xl font-sans font-semibold text-secondary-1 mb-1 leading-tight">
          {isAuthLock ? "Sign in to continue" : "Travel solo, but don't miss out!"}
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-4 sm:mb-0">
          {isAuthLock
            ? "You've reached the web limit. Sign in to your account to keep planning."
            : "Over 80% of travelers miss crucial updates because they aren't in the app."}
        </p>
      </div>

      <div className="w-full sm:w-auto flex flex-col gap-1 shrink-0">
        {isAuthLock ? (
          <button onClick={handleLoginRedirect} className="w-full sm:w-auto btn btn-primary py-3 px-8 rounded-xl font-bold !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-sm">
            <User size={18} /> SIGN IN
          </button>
        ) : (
          <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full sm:w-auto btn btn-primary py-3 px-8 rounded-xl font-bold !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-sm">
            <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
              <Image className="mix-blend-multiply" width={32} height={32} src={PlayStoreWhite} alt="Playstore" />
            </div>
            GET APP FOR ANDROID
          </button>
        )}
      </div>
    </div>
  </div>
);

// VARIANT 3: Bottom Sheet (Single Edge-to-Edge Image)
const Variant3SingleImageSheet = ({ isAuthLock, handleClose, handleLoginRedirect }: PopupVariantProps) => (
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
          <button onClick={handleLoginRedirect} className="w-full btn btn-primary py-4 rounded-xl font-bold !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
            <User size={20} /> LOG IN TO CONTINUE
          </button>
        ) : (
          <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full btn btn-primary py-4 rounded-xl font-bold !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
            <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
              <Image className="mix-blend-multiply" width={32} height={32} src={PlayStoreWhite} alt="Playstore" />
            </div>
            GET APP FOR ANDROID
          </button>
        )}

        {!isAuthLock && (
          <button className="hidden-dismiss-link mt-1 block w-full text-center" onClick={handleClose}>
            Continue with limited web features
          </button>
        )}
      </div>
    </div>
  </div>
);

// VARIANT 4: App Banner Toast (10s Auto-Dismiss, Bottom-Right)
const Variant4AppBannerToast = ({ isAuthLock, handleClose }: PopupVariantProps) => {
  const [show, setShow] = useState(false);
  const DISPLAY_DURATION = 10000;

  useEffect(() => {
    setTimeout(() => setShow(true), 50);
    const autoHideTimer = setTimeout(() => {
      triggerExit();
    }, DISPLAY_DURATION);
    return () => clearTimeout(autoHideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerExit = () => {
    setShow(false);
    setTimeout(() => {
      handleClose();
    }, 500);
  };

  // Toast is never used for auth lock
  if (isAuthLock) return null;

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
        <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full mb-3 btn btn-secondary py-3 rounded-full !flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md text-sm">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image className="mix-blend-multiply" width={32} height={32} src={PlayStoreWhite} alt="Playstore" />
          </div>
          OPEN IN APP
        </button>
      </div>

      <div
        className="toast-progress-track"
        style={{ animationDuration: `${DISPLAY_DURATION}ms` }}
      />
    </div>
  );
};

// MAIN CONTROLLER: DownloadPopup
const DownloadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [isAuthLock, setIsAuthLock] = useState(false);
  const [isIOS, setIsIOS] = useState(true);
  const [variant, setVariant] = useState(0);
  const [cycleCompleted, setCycleCompleted] = useState(false);
  const { isLoggedIn, isLoginPopupOpen } = useLogin();
  const POPUP_RESET_KEY = "popup_last_reset";
  const pathname = usePathname();
  const shouldBlockPopup = isLoginPopupOpen || pathname.includes("/create/trip") || pathname.includes("careers/linkedin/march-2026") || cycleCompleted;

  // console.log("should block popup?", shouldBlockPopup);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

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

  useEffect(() => {

    // ❗ If login popup is open, do not show download popups
    if (shouldBlockPopup) {
      setIsVisible(false);
      return;
    }

    // 1. Device Detection
    resetPopupIfNeeded();

    const userAgent =
      navigator.userAgent ||
      navigator.vendor ||
      (window as { opera?: unknown }).opera;

    const checkIsIOS =
      /iPad|iPhone|iPod/.test(userAgent as string) &&
      !(window as { MSStream?: unknown }).MSStream;

    setIsIOS(checkIsIOS);

    // 2. Check Local Storage based on Auth State
    if (isLoggedIn) {

      setIsAuthLock(false);

      const isComplete =
        localStorage.getItem("popup_cycle_completed") === "true";

      if (isComplete) {
        setCycleCompleted(true);
        setIsVisible(false);
        return;
      }

      const loggedInStrikes = parseInt(
        localStorage.getItem("logged_in_strikes") || "0"
      );

      const maxStrikes = checkIsIOS
        ? IOS_LOGGED_IN_LIMIT
        : ANDROID_LOGGED_IN_LIMIT;

      if (loggedInStrikes >= maxStrikes) {
        localStorage.setItem("popup_cycle_completed", "true");
        setCycleCompleted(true);
        setIsVisible(false);
        return;
      }

      setStrikes(loggedInStrikes);
      setVariant(getRandomVariant());

    } else {

      const guestStrikes = parseInt(
        localStorage.getItem("guest_strikes") || "0"
      );

      setStrikes(guestStrikes);

      if (guestStrikes >= GUEST_LIMIT) {
        setVariant(1);
        setIsAuthLock(true);
        setIsVisible(true);
        return;
      } else {
        setIsAuthLock(false);
        setVariant(getRandomVariant());
      }
    }

    // ⏱ Different delay depending on login state
    const delay = isLoggedIn
      ? INITIAL_DELAY_LOGGED_IN
      : INITIAL_DELAY_GUEST;

    const timer = setTimeout(() => {
      if (!shouldBlockPopup) {
        setIsVisible(true);
      }
    }, delay);

    return () => clearTimeout(timer);

  }, [isLoggedIn, shouldBlockPopup]);

  const handleClose = () => {
    if (isAuthLock) return; // Prevent closing if locked

    const newStrikes = strikes + 1;
    setStrikes(newStrikes);
    setIsVisible(false);

    if (isLoggedIn) {
      const maxStrikes = isIOS ? IOS_LOGGED_IN_LIMIT : ANDROID_LOGGED_IN_LIMIT;
      localStorage.setItem("logged_in_strikes", newStrikes.toString());

      if (newStrikes >= maxStrikes) {
        localStorage.setItem("popup_cycle_completed", "true");
        setCycleCompleted(true);
        return; // Stop cycling, limit reached
      }
    } else {
      localStorage.setItem("guest_strikes", newStrikes.toString());
      if (newStrikes >= GUEST_LIMIT) {
        // Prepare the auth lock screen on the next cycle
        setTimeout(() => {
          setVariant(1); // Force centered modal for auth lock
          setIsAuthLock(true);
          setIsVisible(true);
        }, REAPPEAR_DELAY);
        return;
      }
    }

    // Assign a new random popup for the next appearance
    setTimeout(() => {
      setVariant(getRandomVariant());
    }, 500);

    // Trigger Reappear delay
    setTimeout(() => {
      setIsVisible(true);
    }, REAPPEAR_DELAY);
  };

  // If cycle is complete, or hidden, render nothing
  // ❗ Never show if login popup is open
  if (shouldBlockPopup) return null;

  if (cycleCompleted) return null;
  if (!isVisible && !isAuthLock) return null;

  // Render Toast uniquely
  if (variant === 4 && !isAuthLock) {
    return <Variant4AppBannerToast isAuthLock={isAuthLock} handleClose={handleClose} handleLoginRedirect={() => triggerLogin()} />;
  }

  const overlayAlignment = variant === 1 ? "align-center" : "align-bottom";

  return (
    <div className={`download-popup-overlay ${isVisible ? "active" : ""} ${isAuthLock ? "is-locked" : ""} ${overlayAlignment}`}>
      {variant === 0 && <Variant0StackedCards isAuthLock={isAuthLock} handleClose={handleClose} handleLoginRedirect={() => triggerLogin()} />}
      {variant === 1 && <Variant1CenteredModal isAuthLock={isAuthLock} handleClose={handleClose} handleLoginRedirect={() => triggerLogin()} />}
      {variant === 2 && <Variant2CompactSheet isAuthLock={isAuthLock} handleClose={handleClose} handleLoginRedirect={() => triggerLogin()} />}
      {variant === 3 && <Variant3SingleImageSheet isAuthLock={isAuthLock} handleClose={handleClose} handleLoginRedirect={() => triggerLogin()} />}
    </div>
  );
};

export default DownloadPopup;