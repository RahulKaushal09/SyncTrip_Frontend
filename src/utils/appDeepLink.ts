import { APP_LINKS } from "@/constants";
import { getStoreUrl } from "./redirectToStore";

/**
 * "Open the app if it is installed, otherwise the right store."
 *
 * Worth being precise about what each platform can actually do:
 *
 * ANDROID - an `intent://` URL does the whole job in one navigation. Chrome
 * hands the intent to SyncTrip when the package is installed and follows
 * `browser_fallback_url` when it is not. No timers, no guessing, and no error
 * page in either case.
 *
 * iOS - there is no equivalent. The App Store is the honest destination: a page
 * reached over an https URL under `/share/*` means the Universal Link did NOT
 * fire, which nearly always means the app is not installed. The pages also
 * carry the `apple-itunes-app` smart banner, which is Apple's own answer here -
 * it renders "OPEN" for someone who has the app and "GET" for someone who does
 * not, without us having to detect anything.
 *
 * The custom `synctrip://` scheme is deliberately NOT used. It is documented as
 * unconfirmed on the app side, and Safari answers an unregistered scheme with a
 * blocking "cannot open the page" alert - worse than going straight to the
 * store. Flip IOS_CUSTOM_SCHEME on once the mobile team confirms the scheme is
 * registered in Info.plist.
 */

const ANDROID_PACKAGE = "com.synctrip";
const UNIVERSAL_HOST = "synctrip.in";
const IOS_CUSTOM_SCHEME: string | null = null; // e.g. "synctrip" once confirmed

export type DevicePlatform = "ios" | "android" | "desktop";

export function detectPlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || navigator.vendor || "";
  if (/android/i.test(ua)) return "android";
  if (/iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
    return "ios";
  }
  return "desktop";
}

/**
 * Crawlers and link unfurlers must never be bounced to a store.
 *
 * Googlebot renders JavaScript, so a timed redirect it follows turns an
 * indexable event page into a redirect to the Play Store. Everything else here
 * (WhatsApp, Slack, Twitter, Facebook) is fetching the page purely to build the
 * preview card. Only the timer is skipped - the HTML they receive is identical
 * to what a person receives, so this is not cloaking.
 */
export function isCrawler(): boolean {
  if (typeof navigator === "undefined") return true;
  const ua = navigator.userAgent || "";
  return /bot|crawler|spider|crawling|googlebot|bingbot|yandex|duckduck|baidu|facebookexternalhit|whatsapp|slackbot|twitterbot|linkedinbot|telegrambot|discordbot|embedly|quora|pinterest|preview|headlesschrome|lighthouse/i.test(
    ua
  );
}

/** The Android intent that opens SyncTrip, or the Play Store when it is absent. */
function androidIntentUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return [
    `intent://${UNIVERSAL_HOST}${clean}`,
    "#Intent",
    "scheme=https",
    `package=${ANDROID_PACKAGE}`,
    `S.browser_fallback_url=${encodeURIComponent(APP_LINKS.PLAY_STORE)}`,
    "end",
  ].join(";");
}

/**
 * Best destination for a "get / open the app" tap, resolved for this device.
 *
 * Returned rather than navigated so callers can put it in a real `href` - long
 * press, open-in-new-tab and the OS share sheet all keep working, and the link
 * is not dead if JavaScript fails.
 */
export function appOpenUrl(path: string): string {
  const platform = detectPlatform();

  if (platform === "android") return androidIntentUrl(path);
  if (platform === "ios") {
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return IOS_CUSTOM_SCHEME ? `${IOS_CUSTOM_SCHEME}://${clean}` : APP_LINKS.APP_STORE;
  }
  return getStoreUrl();
}

/** Navigate now - used by the countdown, which has no anchor to click. */
export function openApp(path: string): void {
  if (typeof window === "undefined") return;
  window.location.href = appOpenUrl(path);
}
