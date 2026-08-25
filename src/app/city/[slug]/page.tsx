import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CityLanding from "@/components/City/CityLanding";
import { CITY_PAGES, CityPage, getCityPage } from "@/data/cityPages";

/**
 * /city/:slug — the Delhi NCR launch cluster.
 *
 * Separate from /location/* on purpose. /location answers "what is there to see
 * in <place>" (travel intent); this answers "who do I do things with in <city>"
 * (social intent). Same city, different query, different page — pointing both at
 * one URL is how sites end up ranking for neither.
 */

export const revalidate = 86400;
export const dynamicParams = false;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return CITY_PAGES.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityPage(slug);
  if (!city) return { title: "City not found | SyncTrip", robots: { index: false, follow: true } };

  const canonical = `https://synctrip.in/city/${city.slug}`;

  return {
    title: city.seoTitle,
    description: city.seoDescription,
    keywords: city.keywords.join(", "),
    alternates: { canonical },
    openGraph: {
      title: city.seoTitle,
      description: city.seoDescription,
      url: canonical,
      siteName: "SyncTrip",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: "https://synctrip.in/og-home.png",
          width: 1200,
          height: 630,
          alt: `${city.name} plans and meetups on SyncTrip`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@synctrip44398",
      title: city.seoTitle,
      description: city.seoDescription,
      images: ["https://synctrip.in/og-home.png"],
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  };
}

function buildJsonLd(city: CityPage) {
  const canonical = `https://synctrip.in/city/${city.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#page`,
        name: city.seoTitle,
        description: city.seoDescription,
        url: canonical,
        inLanguage: "en-IN",
        about: {
          "@type": "City",
          name: city.altName ? `${city.name} (${city.altName})` : city.name,
          address: {
            "@type": "PostalAddress",
            addressLocality: city.name,
            addressRegion: city.state,
            addressCountry: "IN",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.geo.lat,
            longitude: city.geo.lng,
          },
        },
        isPartOf: { "@type": "WebSite", name: "SyncTrip", url: "https://synctrip.in" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://synctrip.in" },
          { "@type": "ListItem", position: 2, name: `Plans in ${city.name}`, item: canonical },
        ],
      },
      /**
       * FAQPage markup, for the AI answer engines rather than for Google rich
       * results — Google restricted FAQ rich results to government and health
       * sites in 2023. ChatGPT, Perplexity and AI Overviews still read it, and
       * these questions are exactly the ones being asked there.
       */
      {
        "@type": "FAQPage",
        "@id": `${canonical}#faq`,
        mainEntity: city.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

export default async function CitySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityPage(slug);
  if (!city) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(city)) }}
      />
      <CityLanding city={city} />
    </>
  );
}
