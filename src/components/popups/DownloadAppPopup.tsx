"use client";

import React, { useState, useEffect } from "react";
import { X, Download, ShieldCheck, Zap, Users } from "lucide-react";
import Image from "next/image";
import GroupTripImage from "@/assets/images/groupTripDetails.png";
import GroupTripMembers from "@/assets/images/groupTripMembers.png";
import "./downloadPopup.css";

const STRIKE_LIMIT = 3;
const REAPPEAR_DELAY = 10000;

const DownloadPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const savedStrikes = localStorage.getItem("app_download_strikes");
    if (savedStrikes) {
      const count = parseInt(savedStrikes);
      setStrikes(count);
      if (count > STRIKE_LIMIT) lockExperience();
    }

    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const lockExperience = () => {
    setIsLocked(true);
    setIsVisible(true);
    document.body.style.overflow = "hidden";
  };

  const handleClose = () => {
    if (isLocked) return;
    const newStrikes = strikes + 1;
    setStrikes(newStrikes);
    localStorage.setItem("app_download_strikes", newStrikes.toString());
    setIsVisible(false);

    setTimeout(() => {
      if (newStrikes > STRIKE_LIMIT) lockExperience();
      else setIsVisible(true);
    }, newStrikes > STRIKE_LIMIT ? 500 : REAPPEAR_DELAY);
  };

  if (!isVisible && !isLocked) return null;

  return (
    <div className={`download-popup-overlay ${isVisible ? "active" : ""} ${isLocked ? "is-locked" : ""}`}>
      <div className="download-popup-sheet-xl">

        {!isLocked && (
          <button className="popup-close-ghost" onClick={handleClose}>
            <X size={16} />
          </button>
        )}

        {/* --- STATIC STACK WITH HOVER EFFECT --- */}
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
          <p className="r2 text-neutral-1 px-3">
            {isLocked
              ? "Your web session has expired. Install the SyncTrip app to access full itineraries and member chats."
              : "Get the full experience! Join the group chat and see real-time member updates on our app."}
          </p>

          <div className="feature-mini-pill-row mt-3">
            <div className="pill-item"><ShieldCheck size={14} className="text-success-1" /> <span className="s2">Verified</span></div>
            <div className="pill-item"><Users size={14} className="text-primary-1" /> <span className="s2">Community</span></div>
          </div>

          {/* Ask for review */}
          {/* <img src="https://logodix.com/logo/1338051.png" alt="" /> */}

          <div className="popup-cta-trap">
            <button className="btn btn-blue w-100 download-xl-btn">
              <Download size={20} className="mr-2" />
              GET THE APP NOW
            </button>

            {!isLocked && (
              <button className="hidden-dismiss-link" onClick={handleClose}>
                Continue with limited web features
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPopup;