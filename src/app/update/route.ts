import { NextResponse, type NextRequest } from "next/server";
import { APP_LINKS } from "@/constants/config";

/**
 * GET /update → the right app store for this phone.
 *
 * "New version available" notifications point here (OPEN_URL), so one link
 * works for both platforms - including app versions that predate the
 * OPEN_APP_STORE notification action. Not an app link on iOS or Android, so
 * the app hands it to the browser, which lands here and bounces to the store.
 * Anything that isn't a phone (a desktop, a crawler) gets the home page.
 */
export function GET(req: NextRequest) {
  const ua = req.headers.get("user-agent") || "";
  const target = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && /Mobile/i.test(ua))
    ? APP_LINKS.APP_STORE
    : /Android/i.test(ua)
      ? APP_LINKS.PLAY_STORE
      : new URL("/", req.url).toString();
  const res = NextResponse.redirect(target, 302);
  // Per user-agent - never cache one platform's answer for the other.
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
