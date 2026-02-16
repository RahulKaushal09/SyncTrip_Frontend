"use client";

import { useEffect } from "react";

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


export const AuthSessionSync = () => {
    useEffect(() => {
        syncSessionLogin();
    }, []);

    return null;
};
