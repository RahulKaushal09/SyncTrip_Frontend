"use client";

import React, { useEffect, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";
import ImageNotFound from "../../assets/images/ImageNotFound.png";

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

// 1. ADD CUSTOM PROPS HERE
interface GumletImageProps extends Omit<ImageProps, "src"> {
    src?: string;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
}

export default function GumletImage({
    src,
    alt = "Image",
    containerStyle,       // 2. DESTRUCTURE THEM HERE
    containerClassName,
    ...rest
}: GumletImageProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [finalUrl, setFinalUrl] = useState<string | null>(null);
    // const [boxWidth, setBoxWidth] = useState(0);
    // const [boxHeight, setBoxHeight] = useState(0);

    useEffect(() => {
        if (!src) {
            return;
        }

        const cleanSrc = normalizeUrl(src);

        const hostname = extractHostname(cleanSrc);
        const matchedHost = ORIGIN_HOSTS.find((h) => hostname === h);

        let updatedUrl = cleanSrc;

        if (matchedHost) {
            updatedUrl =
                matchedHost !== ORIGIN_HOSTS[2]
                    ? cleanSrc.replace(`${matchedHost}/AllImages`, GUMLET_HOST)
                    : cleanSrc.replace(matchedHost, GUMLET_HOST);
        }

        const updateSize = () => {
            if (!containerRef.current) return;

            const rect = containerRef.current.getBoundingClientRect();
            const width = rect.width || window.innerWidth;
            const height = rect.height || width;
            // setBoxWidth(width);
            // setBoxHeight(height);

            const dpr = Math.ceil(window.devicePixelRatio || 1);

            let quality = 80;
            if (width > 600) quality = 90;
            if (width < 200) quality = 60;

            const params = `w=${Math.round(width)}&h=${Math.round(
                height
            )}&dpr=${dpr}&q=${quality}&format=auto&fit=crop&sharp=1`;

            const final = updatedUrl.includes("?")
                ? `${updatedUrl}&${params}`
                : `${updatedUrl}?${params}`;

            setFinalUrl(final);
        };

        updateSize();

        const observer = new ResizeObserver(updateSize);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [src]);

    const { width, height, ...otherProps } = rest;
    if (!finalUrl) return (
        <div
            ref={containerRef}
            className={containerClassName}
            style={{ width: "100%", position: "relative", ...containerStyle }}
        >

        </div>
    );

    return (
        // 3. APPLY THEM TO THE PARENT DIV
        <div
            ref={containerRef}
            className={containerClassName}
            style={{ width: "100%", position: "relative", ...containerStyle }}
        >
            {!finalUrl ? (
                <Image
                    src={ImageNotFound}
                    alt="Placeholder"
                    style={{ objectFit: "cover" }}
                    fill // Note: Added fill here too so the placeholder matches behavior!
                />
            ) : (
                <Image
                    src={finalUrl}
                    alt={alt}
                    // width={boxWidth}
                    // height={boxHeight}
                    {...(width ? {} : { fill: true })}
                    sizes="100vw"
                    unoptimized
                    style={{ objectFit: "cover" }} // Good default when using fill: true
                    {...rest}
                />
            )}
        </div>
    );
}