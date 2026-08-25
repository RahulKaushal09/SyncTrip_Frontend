/**
 * Helpers for the metadata a link unfurler reads.
 *
 * WhatsApp, iMessage, Slack and X all fetch the page once, with no cookies and
 * no Accept negotiation, and most of them give up on images that are large,
 * square or served as AVIF. Everything here exists to hand them a plain,
 * correctly-proportioned JPEG at a URL they can reach.
 */

const GUMLET_HOST = "synctrip.gumlet.io";

export const SITE_URL =
  process.env.NEXT_PUBLIC_DOMAIN_BASE_URL?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
  "https://synctrip.in";

/** 1200x630 is what every unfurler crops to; anything else gets letterboxed or dropped. */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export const OG_FALLBACK_IMAGE = `${SITE_URL}/logo_1200.png`;

/**
 * Re-cut a backend image URL to social-preview proportions.
 *
 * The API hands out Gumlet URLs already sized for phone screens (960x960,
 * `format=auto`). Passing that straight to a crawler yields a square image and,
 * for anything negotiating AVIF, one the crawler cannot decode - so the params
 * are rewritten rather than appended. Non-Gumlet URLs (a Google avatar, an
 * external poster) are returned untouched: we cannot transform them, and a
 * working square beats no image at all.
 */
export function toOgImageUrl(url?: string | null): string {
  if (!url) return OG_FALLBACK_IMAGE;

  try {
    const parsed = new URL(url);
    if (parsed.hostname !== GUMLET_HOST) return url;

    parsed.search = "";
    parsed.searchParams.set("w", String(OG_IMAGE_WIDTH));
    parsed.searchParams.set("h", String(OG_IMAGE_HEIGHT));
    parsed.searchParams.set("q", "80");
    // Explicit jpeg, not `auto` - a crawler that sends no Accept header can be
    // served AVIF by `auto`, and AVIF previews silently fail on WhatsApp.
    parsed.searchParams.set("format", "jpeg");
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("sharp", "1");
    return parsed.toString();
  } catch {
    return OG_FALLBACK_IMAGE;
  }
}

/** Absolute canonical URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Trim copy to a length the preview card will actually show, on a word boundary. */
export function toPreviewText(text?: string | null, max = 160): string | undefined {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return undefined;
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
