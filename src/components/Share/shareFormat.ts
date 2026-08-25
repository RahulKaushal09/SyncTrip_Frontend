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
