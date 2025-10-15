import React from "react";

interface SwitchButtonOption {
    text: string;
    value: string;
    onClick?: () => void;
}

interface SwitchButtonsProps {
    options: SwitchButtonOption[];
    selectedValue: string;
    setSelectedValue: (value: string) => void;
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        marginBottom: 20,
    } as React.CSSProperties,
    spacer: {
        flex: 1,
    } as React.CSSProperties,
    buttons: {
        display: "flex",
        gap: 12,
    } as React.CSSProperties,
    button: {
        padding: "6px 16px",
        borderRadius: 999,
        border: "1px solid var(--secondary-1)",
        background: "white",
        color: "var(--secondary-1)",
        cursor: "pointer",
        fontWeight: 500,
        outline: "none",
        transition: "all 0.2s",
    } as React.CSSProperties,
    buttonActive: {
        background: "var(--secondary-1)",
        color: "white",
        borderColor: "var(--secondary-1)",
        
    } as React.CSSProperties,
};

export const SwitchButtons: React.FC<SwitchButtonsProps> = ({
    options,
    selectedValue,
    setSelectedValue,
}) => {
    return (
        <div style={styles.container}>
            <div style={styles.spacer} />
            <div style={styles.buttons}>
                {options.map((option) => {
                    const isActive = selectedValue === option.value;
                    return (
                        <button
                            key={option.value}
                            type="button"
                            style={{
                                ...styles.button,
                                ...(isActive ? styles.buttonActive : {}),
                            }}
                            onClick={() => {
                                setSelectedValue(option.value);
                                option.onClick?.();
                            }}
                        >
                            {option.text}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};