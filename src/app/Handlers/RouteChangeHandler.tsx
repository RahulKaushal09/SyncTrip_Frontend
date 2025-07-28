// Handlers/RouteChangeHandler.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useLoader } from "@/components/providers/LoaderContext";

export const RouteChangeHandler = () => {
    const { showLoader, hideLoader } = useLoader();
    const pathname = usePathname();
    const prevPath = useRef(pathname);
    const loaderTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (prevPath.current !== pathname) {
            // Show loader immediately
            showLoader();

            // Ensure loader is visible for at least 500ms to avoid flicker
            loaderTimeout.current = setTimeout(() => {
                hideLoader();
            }, 500);

            prevPath.current = pathname;
        }

        // Cleanup timeout on unmount or next change
        return () => {
            if (loaderTimeout.current) {
                clearTimeout(loaderTimeout.current);
                hideLoader(); // Ensure loader is hidden if navigation is interrupted
            }
        };
    }, [pathname, showLoader, hideLoader]);

    return null;
};