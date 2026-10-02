import { APP_LINKS } from "@/constants/config";

/**
 * App-store links tagged with the page that sent the user, so installs can be
 * attributed back to individual SEO pages.
 *
 * Android: the UTM tags go in Play's `referrer` parameter. The app reads them on
 * first launch through the Play Install Referrer API, and the backend stores
 * utmSource / utmMedium / utmCampaign / utmTerm on user.installAttribution
 * (utm_content survives in installAttribution.rawReferrer).
 *
 * iOS: Apple never hands UTM tags to the app. App Store Connect reports installs
 * per campaign token (`ct`) once a provider token (`pt`) is set, in aggregate
 * only. Set NEXT_PUBLIC_APPLE_PROVIDER_TOKEN to enable it.
 *
 * Only page identifiers go into these URLs, never anything about the visitor.
 */
export type StoreTrack = {
  /** Page group, e.g. "city_guide_chandigarh", "friendship_app", "site_footer". */
  campaign: string;
  /** The page, e.g. "chandigarh/fun-activities" or a path. */
  term?: string;
  /** Where on the page, e.g. "hero", "plan_sheet", "cta_band". */
  content?: string;
};

const clean = (v: string, max: number) =>
  v.toLowerCase().replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9/_-]+/g, "_").slice(0, max);

export function playStoreUrl(track: StoreTrack): string {
  const referrer = new URLSearchParams({
    utm_source: "synctrip.in",
    utm_medium: "website",
    utm_campaign: clean(track.campaign, 60),
    ...(track.term ? { utm_term: clean(track.term, 80) || "home" } : {}),
    ...(track.content ? { utm_content: clean(track.content, 40) } : {}),
  }).toString();
  return `${APP_LINKS.PLAY_STORE}&referrer=${encodeURIComponent(referrer)}`;
}

const APPLE_PT = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN;

export function appStoreUrl(track: StoreTrack): string {
  if (!APPLE_PT) return APP_LINKS.APP_STORE;
  // Apple's campaign token is limited to 40 characters.
  const ct = clean(`${track.campaign}${track.term ? `-${track.term}` : ""}`, 40);
  return `${APP_LINKS.APP_STORE}?pt=${encodeURIComponent(APPLE_PT)}&ct=${encodeURIComponent(ct)}&mt=8`;
}
