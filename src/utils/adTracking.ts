/**
 * Browser-side ad events: Meta Pixel (fbq) and Google Ads (gtag).
 * Both tags are loaded in app/layout.tsx. Every call is a no-op when a tag
 * is missing (ad blockers, env not set) - tracking never breaks checkout.
 *
 * Purchase dedup: the backend sends the same Purchase through Meta's
 * Conversions API with event_id "purchase:<bookingId>", which is exactly
 * the eventID used here, so Meta counts it once.
 */

type Tag = (...args: unknown[]) => void;

// window.gtag is typed elsewhere in the app with a narrower signature; read
// both tags through a loose view so the extra gtag shapes used here compile.
const tags = () => window as unknown as { fbq?: Tag; gtag?: Tag };

const GADS_PURCHASE_SEND_TO = process.env.NEXT_PUBLIC_GADS_PURCHASE_SEND_TO; // "AW-17836239160/<label>"
const OUR_PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * A club's own Meta Pixel (clubs that connected one in the SyncTrip panel).
 * Loaded only on that club's event + checkout pages (useClubPixel), and every
 * event goes to each pixel explicitly with trackSingle - so after leaving the
 * page nothing reaches the club's pixel, and our pixel gets exactly what it
 * always did. The server sends the same Purchase / Lead with the same
 * event_id, so Meta counts each once.
 */
let clubPixel: string | null = null;
const initedPixels = new Set<string>();
const clubViewSent = new Set<string>();

export function setClubPixel(id: string | null, view?: { eventId: string; title: string; price: number }) {
  if (!id) { clubPixel = null; return; }
  if (!initedPixels.has(id)) {
    fbq("set", "autoConfig", false, id); // no automatic button / page events to the club
    fbq("init", id);
    initedPixels.add(id);
  }
  clubPixel = id;
  fbq("trackSingle", id, "PageView");
  if (view && !clubViewSent.has(`${id}:${view.eventId}`)) {
    clubViewSent.add(`${id}:${view.eventId}`);
    fbq("trackSingle", id, "ViewContent", {
      content_ids: [view.eventId], content_type: "product", content_name: view.title, value: view.price, currency: "INR",
    });
  }
}

/** Our pixel (as before), plus the club's when one is loaded on this page. */
function meta(name: string, data: Record<string, unknown>, opts?: Record<string, unknown>, club?: { name?: string; skip?: boolean }) {
  if (OUR_PIXEL) fbq("trackSingle", OUR_PIXEL, name, data, ...(opts ? [opts] : []));
  else fbq("track", name, data, ...(opts ? [opts] : []));
  if (clubPixel && !club?.skip) fbq("trackSingle", clubPixel, club?.name || name, data, ...(opts ? [opts] : []));
}

function fbq(...args: unknown[]) {
  try {
    tags().fbq?.(...args);
  } catch {
    // ignore
  }
}

function gtag(...args: unknown[]) {
  try {
    tags().gtag?.(...args);
  } catch {
    // ignore
  }
}

export function trackViewContent(p: { eventId: string; title: string; price: number }) {
  const club = clubPixel ? `${clubPixel}:${p.eventId}` : null;
  meta("ViewContent", {
    content_ids: [p.eventId], content_type: "product", content_name: p.title, value: p.price, currency: "INR",
  }, undefined, { skip: !club || clubViewSent.has(club) });
  if (club) clubViewSent.add(club);
}

export function trackInitiateCheckout(p: { eventId: string; value: number; seats: number }) {
  meta("InitiateCheckout", {
    content_ids: [p.eventId], content_type: "product", value: p.value, currency: "INR", num_items: p.seats,
  });
  gtag("event", "begin_checkout", { value: p.value, currency: "INR" });
}

export function trackPurchase(p: {
  bookingId: string; eventId: string; value: number; seats: number; phone?: string; free?: boolean;
}) {
  if (p.free) {
    // Ours: "Schedule" as before. The club's pixel gets a Lead from the server
    // (event_id lead:<bookingId>); here only when we know the booking id.
    meta("Schedule", { content_ids: [p.eventId] }, { eventID: `rsvp:${p.bookingId || p.eventId}` }, { skip: true });
    if (clubPixel && p.bookingId) fbq("trackSingle", clubPixel, "Lead", { content_ids: [p.eventId], content_type: "product", value: 0, currency: "INR" }, { eventID: `lead:${p.bookingId}` });
    return;
  }
  meta(
    "Purchase",
    { content_ids: [p.eventId], content_type: "product", value: p.value, currency: "INR", num_items: p.seats },
    { eventID: `purchase:${p.bookingId}` },
  );
  // Google enhanced conversions: the phone is hashed by gtag before it leaves.
  if (p.phone) gtag("set", "user_data", { phone_number: p.phone });
  if (GADS_PURCHASE_SEND_TO) {
    gtag("event", "conversion", {
      send_to: GADS_PURCHASE_SEND_TO, value: p.value, currency: "INR", transaction_id: p.bookingId,
    });
  }
  gtag("event", "purchase", { transaction_id: p.bookingId, value: p.value, currency: "INR" });
}
