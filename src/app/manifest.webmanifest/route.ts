// src/app/manifest.webmanifest/route.ts
import { NextResponse } from "next/server";

export function GET() {
    const manifest = {
        name: "SyncTrip",
        short_name: "SyncTrip",
        description: "A Next.js app for trip synchronization.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#0070f3",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any"
            }
        ]
    };

    return new NextResponse(JSON.stringify(manifest), {
        headers: {
            "Content-Type": "application/manifest+json"
        }
    });
}



