/**
 * Formatting shared by the club / event share pages.
 *
 * Every date is rendered in IST explicitly. These pages are server-rendered on
 * infrastructure running in UTC, so leaving the timezone to the runtime would
 * print "9:30 PM" as "4:00 PM" for an Indian event.
 */

const IST = "Asia/Kolkata";

type DateInput = string | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDate(value: DateInput): string | null {
  const d = toDate(value);
  if (!d) return null;
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: IST,
  });
}

export function formatTime(value: DateInput): string | null {
  const d = toDate(value);
  if (!d) return null;
  return d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: IST,
  });
}

/** "Sat, 12 Apr 2026 · 7:00 PM - 10:00 PM" - collapsed when the end is on the same day. */
export function formatWhen(startsAt: DateInput, endsAt?: DateInput): string | null {
  const start = toDate(startsAt);
  if (!start) return null;

  const startLabel = `${formatDate(start)} · ${formatTime(start)}`;
  const end = toDate(endsAt);
  if (!end) return startLabel;

  const sameDay =
    start.toLocaleDateString("en-IN", { timeZone: IST }) ===
    end.toLocaleDateString("en-IN", { timeZone: IST });

  return sameDay ? `${startLabel} - ${formatTime(end)}` : `${startLabel} - ${formatDate(end)} · ${formatTime(end)}`;
}

/** Day + month for the little calendar tile on an event row. */
export function formatDayTile(value: DateInput): { day: string; month: string } {
  const d = toDate(value);
  if (!d) return { day: "–", month: "TBA" };
  return {
    day: d.toLocaleDateString("en-IN", { day: "numeric", timeZone: IST }),
    month: d.toLocaleDateString("en-IN", { month: "short", timeZone: IST }).toUpperCase(),
  };
}

export function formatPrice(isFree?: boolean, ticketPrice?: number | null, currency = "INR"): string {
  if (isFree) return "Free entry";
  if (typeof ticketPrice === "number" && ticketPrice > 0) {
    const symbol = currency === "INR" ? "₹" : `${currency} `;
    return `${symbol}${ticketPrice.toLocaleString("en-IN")}`;
  }
  return "Free entry";
}

/** ISO 8601 for schema.org, which wants the machine-readable form, not the pretty one. */
export function toIsoString(value: DateInput): string | undefined {
  return toDate(value)?.toISOString();
}

export function isPast(value: DateInput): boolean {
  const d = toDate(value);
  return !!d && d.getTime() < Date.now();
}

/** Turn "sports", "live_music" or "bike-rides" into "Sports", "Live Music", "Bike Rides". */
export function humanize(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ── Urgency ────────────────────────────────────────────────────────────────
// Low stock and close deadlines only. Never "N going" or "N of M left": a
// near-empty room scares people off, a nearly gone ticket gets them to buy.

/** "Only N left" shows at this many or fewer. */
export const LOW_STOCK = 5;

/** A deadline closer than this is worth showing. */
const SOON_MS = 3 * 86400e3;

/**
 * Tickets of one type that can still be sold: its own stock, capped by the
 * seats left in the event (a pass with 7 left can't sell 7 into 3 seats).
 * null = no limit we know of.
 */
export function passesLeft(
  pass: { remaining?: number | null; admits?: number | null },
  event: { capacity?: number | null; seatsLeft?: number | null },
): number | null {
  let n = pass.remaining ?? Infinity;
  if ((event.capacity ?? 0) > 0 && event.seatsLeft != null) {
    n = Math.min(n, Math.floor(Math.max(0, event.seatsLeft) / Math.max(1, pass.admits ?? 1)));
  }
  return Number.isFinite(n) ? n : null;
}

export const isLowStock = (n: number | null | undefined): n is number => n != null && n > 0 && n <= LOW_STOCK;

/**
 * "today, 7:30 pm" / "tomorrow, 7:30 pm" / "Thu, 7:30 pm" when the deadline is
 * within 3 days of `now`, else null. Takes `now` so callers render it only
 * after mount (see useNow) - the server's clock must never reach the HTML.
 */
export function deadlineLabel(value: DateInput, now: number): string | null {
  const d = toDate(value);
  if (!d) return null;
  const ms = d.getTime() - now;
  if (ms <= 0 || ms > SOON_MS) return null;
  const day = (t: number) => new Date(t).toLocaleDateString("en-IN", { timeZone: IST });
  const when = day(d.getTime()) === day(now)
    ? "today"
    : day(d.getTime()) === day(now + 86400e3)
      ? "tomorrow"
      : d.toLocaleDateString("en-IN", { weekday: "short", timeZone: IST });
  return `${when}, ${formatTime(d)}`;
}

type PassLike = { price: number; admits: number; state: string; remaining?: number | null; salesEndAt?: string | null };

/**
 * The cheapest ticket type still buyable - the one urgency is worded around
 * ("Only 1 left at ₹249, then ₹349") - and the next price up for the same
 * group size. null when nothing is on sale.
 */
export function leadPass<P extends PassLike>(
  passes: P[] | null | undefined,
  event: { capacity?: number | null; seatsLeft?: number | null },
): { pass: P; left: number | null; next: P | null } | null {
  const buyable = (passes ?? []).filter((p) => p.state === "on_sale" && passesLeft(p, event) !== 0);
  if (!buyable.length) return null;
  const pass = buyable.reduce((a, b) => (b.price < a.price ? b : a));
  const next = buyable.filter((p) => p.admits === pass.admits && p.price > pass.price).sort((a, b) => a.price - b.price)[0] ?? null;
  return { pass, left: passesLeft(pass, event), next };
}

/**
 * Reservation tickets: when a pass description says "Total price: ₹4,999 per
 * person" (or "for 3 people") and that is more than the pass price, the price
 * is only the advance paid now. Pages must then say "to reserve" and show the
 * full total, or people read the advance as the whole cost.
 */
export type PassReserve = { total: number; per: string | null };

export function passReserve(p: { price: number; description?: string | null }): PassReserve | null {
  const m = p.description?.match(/total(?:\s+price)?\s*:?\s*(?:₹|rs\.?|inr)\s*([\d,]+)(?:\s*(per person|for \d+ people|for \d+))?/i);
  if (!m) return null;
  const total = Number(m[1].replace(/,/g, ""));
  if (!Number.isFinite(total) || total <= p.price) return null;
  return { total, per: m[2] ? m[2].toLowerCase() : null };
}

/** True when any ticket on the event is a reservation (advance now, rest later). */
export function hasReservePasses(passes: { price: number; description?: string | null }[] | null | undefined): boolean {
  return !!passes?.some((p) => passReserve(p));
}
