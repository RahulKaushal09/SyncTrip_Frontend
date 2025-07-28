import React, { useEffect, useState } from "react";

interface FullScreenLoaderProps {
    isVisible: boolean;
}

const FullScreenLoader: React.FC<FullScreenLoaderProps> = ({ isVisible }) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [dots, setDots] = useState("");

    const travelWords = ["Exploring", "Socializing", "Discovering", "Planning", "Loading"];

    useEffect(() => {
        if (!isVisible) return;

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
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) {
            setCurrentWordIndex(0);
            setDots("");
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div style={styles.overlay}>
            {/* Logo */}
            <div style={styles.logo}>ST</div>

            {/* Spinner */}
            <div style={styles.spinner} />

            {/* Loading Text */}
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
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    logo: {
        width: "60px",
        height: "60px",
        borderRadius: "16px",
        background: "linear-gradient(135deg,rgb(15, 209, 234) 0%, #00bcd4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
        fontWeight: "bold",
        color: "white",
        marginBottom: "32px",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
    },
    spinner: {
        width: "40px",
        height: "40px",
        border: "3px solid #f3f4f6",
        borderTop: "3px solid #00bcd4",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "24px",
    },
    text: {
        fontSize: "18px",
        color: "#6b7280",
        fontWeight: 500,
        textAlign: "center",
        minHeight: "24px",
    },
};

export default FullScreenLoader;
