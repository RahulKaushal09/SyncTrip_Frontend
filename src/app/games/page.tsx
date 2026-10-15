import type { Metadata } from "next";
import { GAMES } from "@/data/games";
import { getGameNights } from "@/lib/gameNights";
import { GAMES_HUB_FAQS, GamesHubView } from "@/components/Games/GameView";

/**
 * /games: hub for the social deduction and party game guides. Targets "party games",
 * "games to play with friends", "game night", "social deduction games" (Keyword Planner,
 * India, Oct 2026: 18.1k, 14.8k, 12.1k, 2.9k for "social deduction party games").
 */
export const revalidate = 1800;

const SITE = "https://synctrip.in";
const TITLE = "Party Games for Friends: Rules & Game Nights";
const DESCRIPTION =
  "Rules for the best party games to play with friends: Mafia, Werewolf, Secret Hitler, Blood on the Clocktower, Avalon, Coup and Spyfall, plus game nights.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | SyncTrip` },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE}/games` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE}/games`, siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: `${SITE}/og-home.png` }] },
  twitter: { card: "summary_large_image", site: "@synctrip44398", title: TITLE, description: DESCRIPTION, images: [`${SITE}/og-home.png`] },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

export default async function GamesPage() {
  const feed = await getGameNights();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ItemList", name: "Social deduction and party games", itemListElement: GAMES.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/games/${g.slug}`, name: g.name })) },
      { "@type": "FAQPage", mainEntity: GAMES_HUB_FAQS.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GamesHubView feed={feed} />
    </>
  );
}
