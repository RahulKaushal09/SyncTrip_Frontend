import React from "react";

type ButtonSpec = {
    text: string;
    onClick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    // optional visual hint: "primary" | "secondary"
    variant?: "primary" | "secondary";
    styleClass?: string;
    // optional aria label
    ariaLabel?: string;
};

type Props = {
    buttons: ButtonSpec[]; // up to 2 items
    // optional z-index if you need to override
    zIndex?: number;
};

const BottomButtonHolder: React.FC<Props> = ({ buttons, zIndex = 1000 }) => {
    if (!buttons || buttons.length === 0) return null;

    // enforce max 2 buttons
    const visible = buttons.slice(0, 2);

    const containerStyle: React.CSSProperties = {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        // horizontal padding 20px as requested; bottom includes safe area inset
        padding: `10px 40px calc(env(safe-area-inset-bottom+10, 12px))`,
        background: "rgba(255,255,255,0.98)",
        boxShadow: "0 -6px 18px rgba(0,0,0,0.08)",
        borderRadius:"32px 32px 0px 0px",
        display: "flex",
        justifyContent: "center",
        zIndex,
    };

    const innerStyle: React.CSSProperties = {
        width: "100%",
        maxWidth: 1100,
        display: "flex",
        gap: visible.length === 2 ? 12 : 0,
        // keep buttons on single row; if screen too small they can wrap
        // flexWrap: "wrap",
    };

    const buttonBase: React.CSSProperties = {
        height: 48,
        borderRadius: 10,
        fontSize: 16,
        lineHeight: "20px",
        cursor: "pointer",
        border: "none",
        padding: "0 16px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: visible.length === 2 ? "1 1 50%" : "1 1 100%",
        // ensure the buttons respect the 20px container padding on left/right
        minWidth: 0,
    };

    const primaryStyle: React.CSSProperties = {
        ...buttonBase,
        background: "var(--primary-1)",
        color: "#fff",
    };

    const secondaryStyle: React.CSSProperties = {
        ...buttonBase,
        background: "#fff",
        color: "var(--primary-1)",
        border: "1px solid var(--primary-1)",
    };

    // small-screen tweak: if layout breaks, stack vertically below 360px
    const mediaStyle = `
        @media (max-width: 360px) {
            .btm-buttons-inner { flex-direction: column; gap: 10px; }
            .btm-buttons-inner button { flex: 1 1 100%; }
        }
    `;

    return (
        <>
            <style>{mediaStyle}</style>
            <div style={containerStyle} role="region" aria-label="Bottom actions">
                <div className="btm-buttons-inner" style={innerStyle}>
                    {visible.map((b, i) => {
                        const variant = b.variant ?? (visible.length === 2 ? (i === 1 ? "primary" : "secondary") : "primary");
                        const style = variant === "primary" ? primaryStyle : secondaryStyle;
                        return (
                            <button
                                key={i}
                                className={b.styleClass ?? ""}
                                style={b.styleClass ? { opacity: b.disabled ? 0.6 : 1,width: "100%" } : { ...style, opacity: b.disabled ? 0.6 : 1 }}
                                onClick={(e) => !b.disabled && b.onClick(e)}
                                disabled={b.disabled}
                                aria-label={b.ariaLabel ?? b.text}
                            >
                                {b.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default BottomButtonHolder;