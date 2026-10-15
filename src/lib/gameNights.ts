import { CITY_GUIDES } from "@/data/cityGuides";
import { GAME_NIGHT_FILTER } from "@/data/games";
import { getCityFeed, type GuideFeed } from "@/lib/cityGuideApi";

/** Upcoming board-game / social deduction nights across every city guide, soonest first. */
export async function getGameNights(limitPerCity = 8): Promise<GuideFeed> {
  const feeds = await Promise.all(CITY_GUIDES.map((c) => getCityFeed(c.citySlug, GAME_NIGHT_FILTER, limitPerCity).catch(() => ({ events: [], plans: [] }))));
  const seen = new Set<string>();
  const events = feeds.flatMap((f) => f.events).filter((e) => (seen.has(e.url) ? false : (seen.add(e.url), true)));
  const plans = feeds.flatMap((f) => f.plans).filter((p) => (seen.has(p.url) ? false : (seen.add(p.url), true)));
  events.sort((a, b) => +new Date(a.startsAt) - +new Date(b.startsAt));
  plans.sort((a, b) => +new Date(a.date) - +new Date(b.date));
  return { events: events.slice(0, 12), plans: plans.slice(0, 8) };
}
