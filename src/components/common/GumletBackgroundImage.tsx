"use client";

import Image from "next/image";
import { useMemo } from "react";

function normalizeUrl(url: string) {
    if (!url) return "";

    // Fix missing slash after protocol
    if (url.startsWith("https:/") && !url.startsWith("https://")) {
        return url.replace("https:/", "https://");
    }

    if (url.startsWith("http:/") && !url.startsWith("http://")) {
        return url.replace("http:/", "http://");
    }

    return url;
}
function extractHostname(url: string) {
    if (!url) return "";
    if (typeof url !== "string") return "";
    return url.replace(/^https?:\/\//, "").split("/")[0];
}

const GUMLET_HOST = "synctrip.gumlet.io";

const ORIGIN_HOSTS = [
    "synctrip.in",
    "www.synctrip.in",
    "synctrip-image-storage.s3.amazonaws.com",
];

interface GumletBackgroundImageProps {
    src: string;
    width?: number;
    height?: number;
    className?: string;
    children?: React.ReactNode;
    priority?: boolean;
}

export default function GumletBackgroundImage({
    src,
    width,
    height,
    className,
    children,
    priority = false,
}: GumletBackgroundImageProps) {

    const optimizedSrc = useMemo(() => {
        if (!src) return "";

        let uri = normalizeUrl(src);
        const hostname = extractHostname(uri);
        const matchedHost = ORIGIN_HOSTS.find((h) => hostname === h);

        if (matchedHost) {
            if (matchedHost !== ORIGIN_HOSTS[2]) {
                uri = uri.replace(matchedHost + "/AllImages", GUMLET_HOST);
            } else {
                uri = uri.replace(matchedHost, GUMLET_HOST);
            }

            const finalWidth = width || 1600;
            const finalHeight = height || 900;

            uri += uri.includes("?")
                ? `&w=${finalWidth}&h=${finalHeight}&q=85&format=auto&fit=crop`
                : `?w=${finalWidth}&h=${finalHeight}&q=85&format=auto&fit=crop`;
        }

        return uri;
    }, [src, width, height]);

    if (!optimizedSrc) {
        return (
            <div
                className="flex items-center justify-center bg-gray-200 text-gray-500"
                style={{ width: width || 300, height: height || 200 }}
            >
                SyncTrip User
                {children}
            </div>
        );
    }

    return (
        <div
            className={`relative overflow-hidden ${className || ""}`}
            style={{ width: width || "100%", ...(height ? { height: height } : {}) }}
        >
            <Image
                src={optimizedSrc}
                alt="Background"
                fill
                priority={priority}
                className="object-cover"
                sizes="100vw"
            />

            {/* Overlay Content */}
            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </div>
    );
}