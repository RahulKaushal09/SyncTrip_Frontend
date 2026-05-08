// src/app/page.tsx
import "../../styles/home/home.css";
import { FeaturesSection } from "@/components/Home_new/whyChooseSyncTrip";
import { Metadata } from "next";
import Script from "next/script";
import HomeHeroSectionNew from "@/components/Home_new/NewHome";
import AppFeatures from "@/components/Home_new/AppFeatures";
import SyncTripPromo from "@/components/AppPushingComponents/SyncTripPromo";
import ChoiceFeatureSectionV2 from "@/components/Home_new/ChoiceSection_v2";
import CommunityShowcaseV2 from "@/components/Home_new/CommunityShowcase_v2";
import InfiniteTripMarquee from "@/components/Home_new/InfinteTripMarquee";
import TestimonialsV2 from "@/components/Home_new/Testimonials_V2";
import CommunityBento from "@/components/Home_new/CommunityBento";


export const metadata: Metadata = {
  title: 'Find Travel Buddies in India – Solo Travel Companion App | SyncTrip',
  // ↑ Primary keyword "find travel buddies in India" front-loaded
  // ↑ "Solo Travel Companion App" = exact transactional query
  // ↑ 60 chars exactly — fits Google title display

  description: 'Connect with 5,000+ verified Indian travelers heading your way. Find trip companions, join bike rides, sports groups, movie plans & weekend hangouts. Free on Android & iOS.',
  // ↑ 175 chars — includes primary kw, social proof (5000+), all 4 activity
  // ↑ categories, CTA (Free), platform (Android & iOS)

  keywords: [
    'find travel buddy India',
    'solo travel companion app',
    'travel partner India',
    'solo travel groups India',
    'trip planning app India',
    'find people for trips India',
    'bike ride groups India',
    'weekend plans India',
    'sports group near me',
    'find movie partner',
    'SyncTrip',
  ].join(', '),

  authors: [{ name: 'SyncTrip', url: 'https://synctrip.in' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: { canonical: 'https://synctrip.in' },

  openGraph: {
    title: 'Find Your Travel Buddy in India | SyncTrip',
    description: 'Join 5,000+ verified travelers. Match with companions for trips, rides, sports & movies across India.',
    type: 'website',
    url: 'https://synctrip.in',
    siteName: 'SyncTrip',
    locale: 'en_IN',
    images: [{
      url: 'https://synctrip.in/og-home.png',
      // ↑ Create this: 1200×630, dark navy bg, app screenshot left,
      // ↑ "Find Your Travel Buddy in India" white text right, SyncTrip logo
      width: 1200,
      height: 630,
      alt: 'SyncTrip – Find Travel Buddies & Plan Trips in India',
    }],
  },

  twitter: {
    card: 'summary_large_image',
    site: '@synctrip44398',
    creator: '@synctrip44398',
    title: 'Find Your Travel Buddy in India | SyncTrip',
    description: 'Verified solo travel matching + local activity groups across India. Free app.',
    images: ['https://synctrip.in/og-home.png'],
  },
};

export default async function Home() {


  return (
    <>
      <Script
        id="ld-1"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "SyncTrip",
            url: "https://synctrip.in",
            logo: "https://synctrip.in/logo_main_withoutBG.png",
            sameAs: [
              // "https://www.facebook.com/synctrip",
              // "https://twitter.com/synctrip",
              "https://www.instagram.com/synctrips"
            ]
          }),
        }}
      />
      <Script
        id="ld-2"

        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://synctrip.in"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Explore",
                item: "https://synctrip.in/explore"
              }
            ]
          }),
        }}
      />
      <Script
        id="ld-3"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MobileApplication",
            "name": "SyncTrip",
            "operatingSystem": "Android, iOS",
            "applicationCategory": "TravelApplication",
            "description": "Find verified travel buddies, plan group trips, and join local activity plans across India. Connect for rides, sports, movies and weekend hangouts.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "INR"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "5000",
              "bestRating": "5"
            },
            "author": {
              "@type": "Organization",
              "name": "SyncTrip",
              "url": "https://synctrip.in"
            },
            "url": "https://synctrip.in",
            "downloadUrl": "https://play.google.com/store/apps/details?id=com.synctrip",
            "installUrl": "https://play.google.com/store/apps/details?id=com.synctrip",
            "screenshot": "https://synctrip.in/og-home.png"
          })
        }}
      />

      <Script
        id="ld-4"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SyncTrip",
            "url": "https://synctrip.in",
            "description": "India's solo travel companion app — find travel buddies, plan trips, join local activity groups.",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://synctrip.in/explore?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {/* <HomeWrapper version="v2" /> */}
      <HomeHeroSectionNew />
      {/* <ChoiceSection /> */}
      {/* <ChoiceFeatureSectionV2 /> */}
      <InfiniteTripMarquee />
      {/* <ChoiceFeatureSectionV3 /> */}
      {/* <CommunityShowcase /> */}
      <CommunityShowcaseV2 />
      <AppFeatures />
      <CommunityBento />
      {/* <FeatureScroll /> */}
      {/* <FeatureHighlight /> */}
      {/* <HomeWrapper version="v1" /> */}
      {/* <ActiveDestinations /> */}
      {/* <ExploreNearbySection /> */}
      {/* <HowItWorksSectionHome /> */}
      {/* <SoftLoginTrigger> */}
      {/* <Testimonials /> */}
      <TestimonialsV2 />
      <FeaturesSection />
      {/* </SoftLoginTrigger> */}
      {/* <BlogsHomePage posts={enriched} categories={categories} /> */}
      <SyncTripPromo />
    </>
  );
}
