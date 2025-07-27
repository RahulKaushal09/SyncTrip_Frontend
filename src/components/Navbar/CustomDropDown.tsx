
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@/types";
import "../../../styles/navbar/navbar.css";
interface CustomDropdownProps {
    user: User;
    show: boolean;
    onToggle: (isOpen: boolean) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ user, show, onToggle }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onToggle(false);
            }
        };

        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show, onToggle]);

    return (
        <div className="custom-dropdown" ref={dropdownRef} style={{ position: "relative" }}>
            <button
                onClick={() => onToggle(!show)}
                style={{
                    padding: "0",
                    border: "none",
                    background: "transparent",
                    boxShadow: "none",
                    display: "flex",
                    alignItems: "center",
                    color: "black",
                    gap: "10px",
                    cursor: "pointer",
                }}
            >
                <Image
                    src={user.profile_picture?.[0] || "https://via.placeholder.com/40"}
                    alt="Profile"
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <span>{user.name}</span>
            </button>
            {show && (
                <div
                    className="dropdown-menu"
                    style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        backgroundColor: "white",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        borderRadius: "4px",
                        minWidth: "150px",
                        zIndex: 1000,
                    }}
                >
                    <Link
                        href={`/user/${user.id}`}
                        className="dropdown-item"
                        style={{
                            display: "block",
                            padding: "8px 16px",
                            color: "black",
                            textDecoration: "none",
                            cursor: "pointer",
                        }}
                        onClick={() => onToggle(false)}
                    >
                        Profile
                    </Link>
                    <button
                        className="dropdown-item"
                        style={{
                            display: "block",
                            padding: "8px 16px",
                            color: "black",
                            background: "none",
                            border: "none",
                            width: "100%",
                            textAlign: "left",
                            cursor: "pointer",
                        }}
                        onClick={() => {
                            onToggle(false);
                            // Assuming logout is passed via context or props; call it here
                            // You'll integrate this with your useLogin context
                            // logout();
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
