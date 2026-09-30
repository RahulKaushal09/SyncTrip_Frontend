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
  fbq("track", "ViewContent", {
    content_ids: [p.eventId], content_type: "product", content_name: p.title, value: p.price, currency: "INR",
  });
}

export function trackInitiateCheckout(p: { eventId: string; value: number; seats: number }) {
  fbq("track", "InitiateCheckout", {
    content_ids: [p.eventId], content_type: "product", value: p.value, currency: "INR", num_items: p.seats,
  });
  gtag("event", "begin_checkout", { value: p.value, currency: "INR" });
}

export function trackPurchase(p: {
  bookingId: string; eventId: string; value: number; seats: number; phone?: string; free?: boolean;
}) {
  if (p.free) {
    fbq("track", "Schedule", { content_ids: [p.eventId] }, { eventID: `rsvp:${p.bookingId || p.eventId}` });
    return;
  }
  fbq(
    "track", "Purchase",
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
