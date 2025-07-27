// app/robots.txt/route.ts

import { NextResponse } from 'next/server';

export function GET() {
    const robotsTxt = `
User-agent: *
Allow: /logo_main_withoutBG.png
Allow: /favicon.ico
Allow: /apple-touch-icon.png
Sitemap: https://synctrip.in/sitemap.xml
  `.trim();

    return new NextResponse(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
