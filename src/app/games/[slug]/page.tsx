import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, getGame } from "@/data/games";
import { getGameNights } from "@/lib/gameNights";
import { GameView } from "@/components/Games/GameView";

export const revalidate = 1800;
export const dynamicParams = false;

const SITE = "https://synctrip.in";
type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const game = getGame((await params).slug);
  if (!game) return { title: "Game not found", robots: { index: false, follow: true } };
  const url = `${SITE}/games/${game.slug}`;
  const image = `${SITE}/og-home.png`;
  return {
    title: game.seoTitle,
    description: game.seoDescription,
    keywords: game.keywords,
    alternates: { canonical: url },
    openGraph: { title: game.seoTitle, description: game.seoDescription, url, siteName: "SyncTrip", locale: "en_IN", type: "article", images: [{ url: image, alt: game.name }] },
    twitter: { card: "summary_large_image", site: "@synctrip44398", title: game.seoTitle, description: game.seoDescription, images: [image] },
    robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  };
}

export default async function GamePage({ params }: PageProps) {
  const game = getGame((await params).slug);
  if (!game) notFound();
  const feed = await getGameNights();
  const url = `${SITE}/games/${game.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: game.h1,
        description: game.seoDescription,
        url,
        inLanguage: "en-IN",
        about: { "@type": "Game", name: game.name, numberOfPlayers: game.players },
        publisher: { "@type": "Organization", name: "SyncTrip", url: SITE, logo: `${SITE}/logo_main_withoutBG.png` },
      },
      { "@type": "FAQPage", mainEntity: game.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Games", item: `${SITE}/games` },
          { "@type": "ListItem", position: 3, name: game.name, item: url },
        ],
      },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <GameView game={game} feed={feed} />
    </>
  );
}
