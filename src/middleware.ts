import { NextResponse, type NextRequest } from "next/server";

/**
 * Category subdomains, all served by this one Next.js app.
 *
 *   movies.synctrip.in/    → src/app/hangouts/movies
 *   hangouts.synctrip.in/  → src/app/hangouts
 *   events.synctrip.in/    → src/app/hangouts/events
 *   sports.synctrip.in/    → src/app/hangouts/sports
 *
 * Matched on the first host label, so movies.localhost:3001 works in dev too.
 * On the main domain, /hangouts/* 301s to the subdomain so Google sees one URL;
 * on localhost the paths stay reachable for testing.
 */
const SUBDOMAINS: Record<string, string> = {
  movies: "/hangouts/movies",
  events: "/hangouts/events",
  sports: "/hangouts/sports",
  hangouts: "/hangouts",
};

const MAIN_HOSTS = new Set(["synctrip.in", "www.synctrip.in"]);

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  const { pathname } = req.nextUrl;
  const base = SUBDOMAINS[host.split(".")[0]];

  if (base) {
    if (pathname === base || pathname.startsWith(base + "/")) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = base + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }

  if (MAIN_HOSTS.has(host) && (pathname === "/hangouts" || pathname.startsWith("/hangouts/"))) {
    // Longest prefix first, so /hangouts/movies goes to movies., not hangouts.
    const [sub, path] = Object.entries(SUBDOMAINS)
      .sort((a, b) => b[1].length - a[1].length)
      .find(([, p]) => pathname === p || pathname.startsWith(p + "/"))!;
    const rest = pathname.slice(path.length) || "/";
    return NextResponse.redirect(`https://${sub}.synctrip.in${rest}`, 301);
  }

  return NextResponse.next();
}

export const config = {
  // Pages only: skip Next internals, API routes and anything with a file extension.
  matcher: ["/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
