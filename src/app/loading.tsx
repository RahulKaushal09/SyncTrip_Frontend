"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../assets/images/logo_main_withoutBG.png";

export default function Loading() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [dots, setDots] = useState("");

  const travelWords = [
    "Exploring",
    "Socializing",
    "Discovering",
    "Planning",
    "Loading",
  ];

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % travelWords.length);
    }, 2000);

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "" : prev + "."));
    }, 500);

    return () => {
      clearInterval(wordInterval);
      clearInterval(dotsInterval);
    };
  }, []);

  return (
    <div style={styles.overlay}>
      <Image
        alt="SyncTrip"
        src={Logo}
        width={80}
        height={80}
        priority
      />

      <div style={styles.spinner} />

      <div style={styles.text}>
        {travelWords[currentWordIndex]}
        {dots}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #f3f4f6",
    borderTop: "3px solid #3BBEF5",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "24px 0",
  },
  text: {
    fontSize: "18px",
    color: "#6b7280",
    fontWeight: 500,
  },
};