/**
 * Remembers the ad click that brought a visitor to the site, so a purchase
 * made later can be credited to it.
 *
 * - Meta:   `fbclid` in the landing URL → the `_fbc` value Meta expects
 *           ("fb.1.<ms>.<fbclid>"); `_fbp` is the pixel's own browser cookie.
 * - Google: `gclid` / `gbraid` / `wbraid`.
 * - UTM tags, landing URL and referrer.
 *
 * First touch wins for 7 days, but a NEW ad click (new fbclid / gclid)
 * replaces it - the latest ad is the one that should get the credit.
 * Stored in localStorage; every access is guarded (private mode, blocked
 * storage) and failure just means no attribution.
 */

const KEY = "st_ad_attribution_v1";
const TTL_MS = 7 * 24 * 3600 * 1000;

export type WebAttribution = {
  fbc?: string;
  fbp?: string;
  gclid?: string;
  gbraid?: string;
  wbraid?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingUrl?: string;
  referrer?: string;
  at?: number;
};

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function load(): WebAttribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as WebAttribution;
    if (!v.at || Date.now() - v.at > TTL_MS) return null;
    return v;
  } catch {
    return null;
  }
}

function save(v: WebAttribution): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(v));
  } catch {
    // storage blocked - attribution is best-effort
  }
}

/** Call on page load. Records a new ad click, keeps an existing one otherwise. */
export function captureWebAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const p = new URLSearchParams(window.location.search);
    const fbclid = p.get("fbclid");
    const gclid = p.get("gclid");
    const gbraid = p.get("gbraid");
    const wbraid = p.get("wbraid");
    const utmSource = p.get("utm_source");
    const existing = load();

    const isNewClick = !!(fbclid || gclid || gbraid || wbraid || utmSource);
    if (!isNewClick && existing) return;

    const next: WebAttribution = {
      ...(isNewClick ? {} : existing || {}),
      fbc: fbclid ? `fb.1.${Date.now()}.${fbclid}` : readCookie("_fbc") || existing?.fbc,
      gclid: gclid || undefined,
      gbraid: gbraid || undefined,
      wbraid: wbraid || undefined,
      utmSource: utmSource || undefined,
      utmMedium: p.get("utm_medium") || undefined,
      utmCampaign: p.get("utm_campaign") || undefined,
      utmContent: p.get("utm_content") || undefined,
      utmTerm: p.get("utm_term") || undefined,
      landingUrl: window.location.href.slice(0, 500),
      referrer: document.referrer ? document.referrer.slice(0, 500) : undefined,
      at: Date.now(),
    };
    save(JSON.parse(JSON.stringify(next)));
  } catch {
    // never break the page
  }
}

/** What to send with a booking. `_fbp` is read fresh - the pixel sets it late. */
export function getWebAttribution(): WebAttribution {
  const v = load() || {};
  return {
    ...v,
    fbc: v.fbc || readCookie("_fbc"),
    fbp: readCookie("_fbp"),
    landingUrl: v.landingUrl || (typeof window !== "undefined" ? window.location.href.slice(0, 500) : undefined),
  };
}
