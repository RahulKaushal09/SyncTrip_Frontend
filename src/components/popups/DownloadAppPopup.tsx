"use client";

import React, { useState, useEffect } from "react";
import { X, Download, ShieldCheck, Zap, Users, Lock, Smartphone, ChevronRight } from "lucide-react";
import Image from "next/image";
import GroupTripImage from "../../assets/images/groupTripDetails.png";
import GroupTripMembers from "../../assets/images/groupTripMembers.png";
import AppBanner from "../../assets/images/appBanner.png";
import "./downloadPopup.css";
import PlayStoreWhite from "../../assets/icons/PlayStoreWhite.png";
import PlayStore from "../../assets/icons/PlayStore.png";

// const STRIKE_LIMIT = 4;
const REAPPEAR_DELAY = 20000;
const APP_DOWNLOAD_URL = "https://play.google.com/store/apps/details?id=com.synctrip";

type PopupVariantProps = {
  isLocked: boolean;
  handleClose: () => void;
};

// VARIANT 0: Original Bottom Sheet (Stacked Cards)
const Variant0StackedCards = ({ isLocked, handleClose }: PopupVariantProps) => (
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
      <div className="app-exclusive-tag">
        <Zap size={12} fill="currentColor" />
        <span>APP ONLY</span>
      </div>
    </div>

    <div className="popup-body-content text-center">
      <h2 className="text-[28px] !font-sans !font-semibold text-secondary-1">
        {isLocked ? "App Download Required" : "Ready for the Trip?"}
      </h2>
      <p className="text-neutral-1 px-3 mt-2 mb-4">
        {isLocked
          ? "Your web session has expired. Install the SyncTrip app to access full itineraries."
          : "Get the full experience! Join the group chat and see real-time updates."}
      </p>

      <div className="feature-mini-pill-row">
        <div className="pill-item"><ShieldCheck size={14} className="text-success-1" /> <span className="text-sm font-medium">Verified</span></div>
        <div className="pill-item"><Users size={14} className="text-primary-1" /> <span className="text-sm font-medium">Community</span></div>
      </div>

      <div className="popup-cta-trap mt-6">
        <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full btn btn-primary py-4 !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image className="mix-blend-multiply" width={30} height={30} src={PlayStoreWhite} alt="Playstore" />
          </div>
          Download the Android App
        </button>
        {!isLocked && (
          <button className="hidden-dismiss-link mt-1.5 block w-full text-center" onClick={handleClose}>
            Continue with limited web features
          </button>
        )}
      </div>
    </div>
  </div>
);

// VARIANT 1: Centered Modal (Edge-to-Edge Image)
const Variant1CenteredModal = ({ isLocked, handleClose }: PopupVariantProps) => (
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
      <div className="inline-block bg-primary-1/10 text-primary-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
        Exclusive Access
      </div>
      <h2 className="text-2xl font-serif text-secondary-1 mb-1">
        {isLocked ? "Connection Lost" : "Unlock the Full Features"}
      </h2>
      <p className="text-neutral-500 text-sm mb-6 leading-relaxed">
        {isLocked
          ? "Please download the app to securely resume your session and access member chats."
          : "Web users only see partial details. Download the SyncTrip app to view maps, group discussions, and live updates."}
      </p>

      <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="btn btn-secondary w-full !flex items-center justify-center gap-2 mx-auto hover:bg-secondary-hover transition-colors">
        <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
          <Image className="mix-blend-multiply" width={32} height={32} src={PlayStore} alt="Playstore" />
        </div>
        Download App for Android
      </button>

      {!isLocked && (
        <button className="text-neutral-400 text-xs mt-1 underline decoration-neutral-300 hover:text-neutral-600 transition-colors" onClick={handleClose}>
          Maybe next time
        </button>
      )}
    </div>
  </div>
);

// VARIANT 2: Light Mode Compact (No Images)
const Variant2CompactSheet = ({ isLocked, handleClose }: PopupVariantProps) => (
  <div className="popup-card-base popup-variant-compact shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
    {!isLocked && (
      <button className="popup-close-ghost" onClick={handleClose}>
        <X size={16} />
      </button>
    )}

    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-6 sm:p-8">
      <div className="w-14 h-14 shrink-0 bg-primary-1/10 rounded-2xl flex items-center justify-center border border-primary-1/20 text-primary-1">
        {isLocked ? <Lock size={28} /> : <Zap size={28} />}
      </div>

      <div className="text-left flex-1">
        <div className="text-[10px] font-bold tracking-widest uppercase text-primary-1 mb-1">
          SyncTrip Mobile
        </div>
        <h2 className="text-xl sm:text-2xl font-sans font-semibold text-secondary-1 mb-1 leading-tight">
          {isLocked ? "Session Locked" : "Travel solo, but don't miss out!"}
        </h2>
        <p className="text-neutral-500 text-sm sm:text-base leading-relaxed mb-4 sm:mb-0">
          {isLocked
            ? "You've reached the web limit. Install our free app to continue planning."
            : "Over 80% of travelers miss crucial updates because they aren't in the app."}
        </p>
      </div>

      <div className="w-full sm:w-auto flex flex-col gap-1 shrink-0">
        <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full sm:w-auto btn btn-primary py-3 px-8 rounded-xl font-bold !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors shadow-sm">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image className="mix-blend-multiply" width={32} height={32} src={PlayStoreWhite} alt="Playstore" />
          </div>
          GET APP FOR ANDROID
        </button>
      </div>
    </div>
  </div>
);

// VARIANT 3: Bottom Sheet (Single Edge-to-Edge Image)
const Variant3SingleImageSheet = ({ isLocked, handleClose }: PopupVariantProps) => (
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
        {isLocked ? "App Download Required" : "Ready for the Trip?"}
      </h2>
      <p className="text-neutral-1 px-3 mt-2 mb-6">
        {isLocked
          ? "Your web session has expired. Install the SyncTrip app to access full itineraries."
          : "Get the full experience! Join the group chat and see real-time updates."}
      </p>

      <div className="feature-mini-pill-row mb-6">
        <div className="pill-item"><ShieldCheck size={14} className="text-success-1" /> <span className="text-sm font-medium">Verified</span></div>
        <div className="pill-item"><Users size={14} className="text-primary-1" /> <span className="text-sm font-medium">Community</span></div>
      </div>

      <div className="popup-cta-trap mt-2">
        <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full btn btn-primary py-4 rounded-xl font-bold !flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image className="mix-blend-multiply" width={32} height={32} src={PlayStoreWhite} alt="Playstore" />
          </div>
          GET APP FOR ANDROID
        </button>
        {!isLocked && (
          <button className="hidden-dismiss-link mt-1 block w-full text-center" onClick={handleClose}>
            Continue with limited web features
          </button>
        )}
      </div>
    </div>
  </div>
);

// ============================================================================
// VARIANT 4: App Banner Toast (10s Auto-Dismiss, Bottom-Right)
// ============================================================================
const Variant4AppBannerToast = ({ isLocked, handleClose }: PopupVariantProps) => {
  const [show, setShow] = useState(false);
  const DISPLAY_DURATION = 10000; // 10 seconds

  useEffect(() => {
    // Slight delay to allow DOM to render before triggering CSS transition
    setTimeout(() => setShow(true), 50);

    const autoHideTimer = setTimeout(() => {
      triggerExit();
    }, DISPLAY_DURATION);

    return () => clearTimeout(autoHideTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const triggerExit = () => {
    setShow(false); // Trigger slide-out CSS
    setTimeout(() => {
      handleClose(); // Notify parent to cycle to the next variant
    }, 500);
  };

  return (
    // Uses the toast wrapper for bottom-right positioning and slide-in animation
    <div className={`toast-notification-wrapper ${show ? "is-visible" : ""}`}>

      {/* Floating Close Button */}
      {!isLocked && (
        <button
          onClick={triggerExit}
          className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm text-neutral-800 w-7 h-7 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
        >
          <X size={14} />
        </button>
      )}

      {/* Image Container - Flush Edge-to-Edge (Just like Variant 1) */}
      <div className="w-full leading-none">
        <Image
          src={AppBanner}
          alt="App Banner"
          // max-h restricts it from getting too tall in the corner
          className="w-full h-auto object-cover block max-h-[160px]"
          priority
        />
      </div>

      {/* Centered Content Area (Just like Variant 1) */}
      <div className="px-6 pb-2 pt-2 text-center bg-white">
        <div className="inline-block bg-primary-1/10 text-primary-1 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          Exclusive Access
        </div>

        <h2 className="text-xl font-serif text-secondary-1 mb-1.5">
          {isLocked ? "Connection Lost" : "Unlock the Full Itinerary"}
        </h2>

        <p className="text-neutral-500 text-xs mb-3 leading-relaxed">
          {isLocked
            ? "Please download the app to securely resume your session and access member chats."
            : "Web users only see partial details. Download the SyncTrip app to view maps, group chats, and live updates."}
        </p>

        <button onClick={() => window.open(APP_DOWNLOAD_URL, "_blank")} className="w-full mb-3 btn btn-secondary py-3 rounded-full !flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md text-sm">
          <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center">
            <Image className="mix-blend-multiply" width={32} height={32} src={PlayStoreWhite} alt="Playstore" />
          </div>
          OPEN IN APP
        </button>
      </div>

      {/* 10-Second Shrinking Progress Track */}
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
  const [isLocked, setIsLocked] = useState(false);
  const [isIOS, setIsIOS] = useState(true); // Default true to prevent hydration flicker
  const [hasSeenIOSPopup, setHasSeenIOSPopup] = useState(false);

  const [variant, setVariant] = useState(0);

  useEffect(() => {
    // 1. Device Detection
    const userAgent = navigator.userAgent || navigator.vendor || (window as { opera?: unknown }).opera;
    const checkIsIOS = /iPad|iPhone|iPod/.test(userAgent as string) && !(window as { MSStream?: unknown }).MSStream;

    setIsIOS(checkIsIOS);

    // 2. Check Local Storage
    const savedStrikes = localStorage.getItem("app_download_strikes");
    if (savedStrikes) {
      const count = parseInt(savedStrikes);
      setStrikes(count);
      // if (count > STRIKE_LIMIT) lockExperience();
    }

    const iosPopupSeen = localStorage.getItem("ios_popup_seen");
    if (iosPopupSeen === "true") {
      setHasSeenIOSPopup(true);
    }

    // 3. Logic for iOS Users
    if (checkIsIOS) {
      if (iosPopupSeen !== "true") {
        // If they are on iOS and haven't seen it, force Variant 1 and show it
        setVariant(1);
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      } else {
        // If they are on iOS and HAVE seen it, do nothing (it will remain invisible)
        return;
      }
    }

    // 4. Logic for Android/Other Users
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const lockExperience = () => {
    setIsLocked(true);
    setIsVisible(true);
    // document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    if (isLocked) return;

    // Handle closing for iOS
    if (isIOS) {
      setIsVisible(false);
      setHasSeenIOSPopup(true);
      localStorage.setItem("ios_popup_seen", "true");
      return; // Stop here so it doesn't cycle or set a reappearance timer
    }

    // Handle closing for Android/Other (Cycle behavior)
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);
    localStorage.setItem("app_download_strikes", newStrikes.toString());

    // Hide the popup
    setIsVisible(false);

    // Cycle to the next variant design (0 -> 1 -> 2 -> 3 -> 4 -> 0)
    setTimeout(() => {
      setVariant((prev) => (prev + 1) % 5);
    }, 500);

    // Trigger the reappearance delay
    setTimeout(() => {
      // if (newStrikes > STRIKE_LIMIT) lockExperience();
      setIsVisible(true);
    }, REAPPEAR_DELAY);
  };

  // If hidden and not locked, render nothing
  if (!isVisible && !isLocked) return null;
  
  // Extra safety net: If it's iOS and they've already seen it, render nothing.
  if (isIOS && hasSeenIOSPopup) return null;

  // Variant 4 (Toast) floats independently without the dark overlay
  if (variant === 4) {
    return <Variant4AppBannerToast isLocked={isLocked} handleClose={handleClose} />;
  }

  // Variants 0, 1, 2, 3 use the dark overlay backdrop
  const overlayAlignment = variant === 1 ? "align-center" : "align-bottom";

  return (
    <div className={`download-popup-overlay ${isVisible ? "active" : ""} ${isLocked ? "is-locked" : ""} ${overlayAlignment}`}>
      {variant === 0 && <Variant0StackedCards isLocked={isLocked} handleClose={handleClose} />}
      {variant === 1 && <Variant1CenteredModal isLocked={isLocked} handleClose={handleClose} />}
      {variant === 2 && <Variant2CompactSheet isLocked={isLocked} handleClose={handleClose} />}
      {variant === 3 && <Variant3SingleImageSheet isLocked={isLocked} handleClose={handleClose} />}
    </div>
  );
};

export default DownloadPopup;