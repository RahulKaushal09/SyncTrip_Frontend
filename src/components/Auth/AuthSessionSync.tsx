"use client";

import { useEffect, useState } from "react";

const syncSessionLogin = () => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("isLoggedIn") === "true") return; 

    try {
        const user = localStorage.getItem("user");

        if (user) {
            sessionStorage.setItem("isLoggedIn", "true");
        } else {
            sessionStorage.removeItem("isLoggedIn");
        }
    } catch (err) {
        console.error("Session sync error:", err);
    }
};

export const AuthSessionSync = ({ children }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        syncSessionLogin();
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return children;
};