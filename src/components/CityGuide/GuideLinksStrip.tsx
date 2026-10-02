import React from "react";
import Link from "next/link";
import { CITY_GUIDES } from "@/data/cityGuides";

/**
 * Internal links from older content (blogs, location pages) into the city guides,
 * so link equity flows to the pages we're trying to rank. Self-styled because it
 * is dropped into pages with their own CSS.
 */

const CITY_MATCHERS: Record<string, RegExp> = {
  chandigarh: /\b(chandigarh|mohali|panchkula|zirakpur|tricity)\b/i,
  gurgaon: /\b(gurgaon|gurugram|delhi[\s-]?ncr)\b/i,
};

/** Guide city slugs mentioned in a piece of text, in CITY_GUIDES order. */
export function guideCitiesIn(text: string): string[] {
  return CITY_GUIDES.map((c) => c.citySlug).filter((slug) => CITY_MATCHERS[slug]?.test(text));
}

const wrap: React.CSSProperties = {
  maxWidth: 1080,
  margin: "2.5rem auto",
  padding: "1.4rem 1.5rem",
  borderRadius: 20,
  background: "linear-gradient(135deg, #f0f7ff, #fdf2f8)",
  border: "1px solid #e2e8f0",
  color: "#0f172a",
};
const chip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 14px",
  borderRadius: 999,
  background: "#fff",
  border: "1px solid #e2e8f0",
  color: "#0f172a",
  fontWeight: 700,
  fontSize: "0.88rem",
  textDecoration: "none",
};

export default function GuideLinksStrip({ citySlugs }: { citySlugs: string[] }) {
  const cities = citySlugs
    .map((slug) => CITY_GUIDES.find((c) => c.citySlug === slug))
    .filter((c): c is (typeof CITY_GUIDES)[number] => !!c);
  if (!cities.length) return null;

  return (
    <aside style={wrap} aria-label="Plan it with people">
      {cities.map((city) => (
        <div key={city.citySlug} style={{ marginBottom: "0.9rem" }}>
          <h2 style={{ margin: "0 0 0.35rem", fontSize: "1.15rem", fontWeight: 800 }}>
            Things to do in {city.cityName} with people
          </h2>
          <p style={{ margin: "0 0 0.8rem", color: "#475569", fontSize: "0.93rem" }}>
            Places to go and SyncTrip plans you can join, by activity.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <Link href={`/city/${city.citySlug}`} style={{ ...chip, background: "#0f172a", color: "#fff", borderColor: "#0f172a" }}>
              All of {city.cityName}
            </Link>
            {city.activities.slice(0, 6).map((a) => (
              <Link key={a.slug} href={`/city/${city.citySlug}/${a.slug}`} style={chip}>
                {a.navLabel}
              </Link>
            ))}
          </div>
        </div>
      ))}
      <Link href="/friendship-app" style={{ color: "#2785e7", fontWeight: 700, fontSize: "0.9rem" }}>
        New in town? How SyncTrip helps you make friends offline →
      </Link>
    </aside>
  );
}
