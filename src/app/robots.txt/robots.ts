// app/robots.txt/route.ts

import { NextResponse } from 'next/server';

export function GET() {
    const robotsTxt = `
User-agent: *
Disallow:

Sitemap: https://synctrip.in/sitemap.xml
  `.trim();

    return new NextResponse(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
