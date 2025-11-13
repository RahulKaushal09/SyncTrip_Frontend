import React from "react";

// /d:/DOITBUNNYY/NextJs/SyncTrip_Frontend/src/components/Header/MatchingScreenHeader.tsx

type Props = {
    tripName: string;
    dates?: string;
    onBack?: () => void;
    className?: string;
};

const iconStyle: React.CSSProperties = {
    width: 20,
    height: 20,
    display: "block",
    fill: "currentColor",
};

const buttonStyle: React.CSSProperties = {
    background: "transparent",
    border: "none",
    padding: 8,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
};

const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 16px",
};

const textColumnStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    lineHeight: 1,
};

const titleStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
};

const datesStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#6b7280", // gray
    marginTop: 2,
};

export default function MatchingScreenHeader({
    tripName,
    dates,
    onBack,
    className,
}: Props) {
    const handleBack = () => {
        if (onBack) {
            onBack();
            return;
        }
        if (typeof window !== "undefined" && window.history.length > 1) {
            window.history.back();
        }
    };

    return (
        <header style={containerStyle} className={className}>
            <button
                type="button"
                onClick={handleBack}
                aria-label="Go back"
                style={buttonStyle}
            >
                {/* simple left arrow */}
                <svg viewBox="0 0 24 24" style={iconStyle} aria-hidden>
                    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
            </button>

            <div style={textColumnStyle}>
                <div style={titleStyle}>{tripName}</div>
                {dates ? <div style={datesStyle}>{dates}</div> : null}
            </div>
        </header>
    );
}