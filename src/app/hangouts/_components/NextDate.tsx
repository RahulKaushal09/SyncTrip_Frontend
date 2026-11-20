import { Ico } from "./Shell";
import type { Slot } from "../_lib/api";

/** Hero line with the next bookable date, or "coming soon" when none is open. */
export default function NextDate({ slots }: { slots: Slot[] }) {
  const next = slots.find((s) => !s.full);
  if (!next) {
    return (
      <div className="next-date soon">
        <Ico name="i-calendar" />
        <span><b>Next date coming soon.</b> Follow @synctrips on Instagram to hear first.</span>
      </div>
    );
  }
  const where = [next.venueName, next.area].filter(Boolean).join(", ");
  return (
    <a className="next-date" href="#join">
      <Ico name="i-calendar" />
      <span>
        <b>Next: {next.label}</b>
        {where && <> · {where}</>}
        {next.movie && <> · {next.movie.name}</>}
        {next.ownPrices && next.prices && <> · ₹{next.prices.solo.toLocaleString("en-IN")}</>}
        <small>Book by {next.cutoffLabel}</small>
      </span>
    </a>
  );
}
