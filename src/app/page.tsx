// src/app/page.tsx
import "../../styles/home/home.css";
import HomeHeroSection from "@/components/Home_new/HomeHeroSection";
import Testimonials from "@/components/Home_new/testimonialSection";
import BlogsHomePage from "../components/Home_new/homeBlogsSection";
import { FeaturesSection } from "@/components/Home_new/whyChooseSyncTrip";
// import ExploreNearbySection from "@/components/Home_new/exploreNearyBySection";
// import { HowItWorksSectionHome } from "@/components/Home_new/howItWorksHomeSection";
import SoftLoginTrigger from "@/components/Auth/SoftLoginTrigger";

import { getThemeClass } from "@/utils/getThemeClassForBlogs";
import { BlogsApiServices } from "@/utils/blogs.api.utils";
import { BlogPost } from "@/types";
import { Metadata } from "next";
import Script from "next/script";
import ActiveDestinations from "@/components/Home_new/ActiveDestinations";
import ChoiceSection from "@/components/Home_new/ChoiceSection";
import { usePathname } from "next/navigation";
import DownloadPopup from "@/components/popups/DownloadAppPopup";
import HomeWrapper from "@/components/Home_new/HomeWrapper";

// export const metadata: Metadata = {
//   title: 'SyncTrip – Travel Planning & Solo Travel Groups in India',
//   description: 'SyncTrip helps solo travelers, friends, and groups plan trips, find travel groups, and explore India together. Create trips, connect with travelers, and travel your way.',
//   keywords: 'solo travel groups, travel for solo travelers, solo trips India, solo trips for women, travel groups for solo travelers, group travel India, travel planning, travel communities, SyncTrip',
//   authors: [{ name: 'SyncTrip' }],
//   robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
//   openGraph: {
//     title: 'SyncTrip – Travel Planning & Solo Travel Groups in India',
//     description: 'Discover destinations, plan trips, and connect with fellow travelers. Start your journey with SyncTrip today!',
//     type: 'website',
//     url: 'https://synctrip.in',
//     siteName: 'SyncTrip',
//     locale: 'en_IN',
//     images: [
//       {
//         url: 'https://synctrip.in/logo_main_withoutBG.png',
//         width: 1200,
//         height: 630,
//         alt: 'SyncTrip Home Page',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: '@synctrip',
//     creator: '@synctrip',
//     title: 'SyncTrip – Travel Planning & Solo Travel Groups in India',
//     description: 'Find trips, destinations, itineraries, and fellow travelers with SyncTrip.',
//     images: ['https://synctrip.in/logo_main_withoutBG.png'],
//   },
//   alternates: {
//     canonical: 'https://synctrip.in',
//   },
// };
export const metadata: Metadata = {
  title: 'SyncTrip | Create Trips & Find Verified Travel Buddies in India',
  description: 'The first social travel platform where YOU lead. Create a trip, find 1-on-1 travel buddies, or join traveler groups. Connect safely with verified explorers and design your own adventure.',
  keywords: 'solo travel groups, travel for solo travelers, solo trips India, solo trips for women, travel groups for solo travelers, group travel India, travel planning, travel communities, SyncTrip, create travel groups India, find a travel buddy, solo trip planner, travel social network, join travel community, verified traveler profiles, group trip coordination',
  authors: [{ name: 'SyncTrip' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: 'SyncTrip | Create Trips & Find Verified Travel Buddies in India',
    description: 'Discover destinations, plan trips, and connect with fellow travelers. Start your journey with SyncTrip today!',
    type: 'website',
    url: 'https://synctrip.in',
    siteName: 'SyncTrip',
    locale: 'en_IN',
    images: [
      {
        url: 'https://synctrip.in/logo_main_withoutBG.png',
        width: 1200,
        height: 630,
        alt: 'SyncTrip Home Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@synctrip',
    creator: '@synctrip',
    title: 'SyncTrip | Create Trips & Find Verified Travel Buddies in India',
    description: 'Find trips, destinations, itineraries, and fellow travelers with SyncTrip.',
    images: ['https://synctrip.in/logo_main_withoutBG.png'],
  },
  alternates: {
    canonical: 'https://synctrip.in',
  },
};
export default async function Home() {
  const data = await BlogsApiServices.fetchAllBlogs();
  const limitedData = data.slice(0, 8);
  const enriched = limitedData.map((post: BlogPost) => ({
    ...post,
    themeClass: getThemeClass(post.filterTags?.[0] || ""),
    liked: false,
    // likes: Math.floor(Math.random() * 900) + 100,
    // comments: Math.floor(Math.random() * 50) + 5,
    // shares: Math.floor(Math.random() * 20) + 2
  }));
  const uniqueTags = Array.from(
    new Set(
      enriched
        .map((p) => p.filterTags?.[0])
        .filter((tag): tag is string => Boolean(tag && tag.trim()))
    )
  );

  const categories = [
    { key: "all", label: "All Content" },
    ...uniqueTags.map((tag) => ({
      key: tag.toLowerCase().replace(/\s+/g, "-"),
      label: tag
    }))
  ];

  return (
    <>
      <script
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
        id="google-maps"
        strategy="beforeInteractive"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`}
      />
      <script
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
      {/* <DownloadPopup /> */}
      <HomeWrapper version="v2" />
      <ChoiceSection />
      <HomeWrapper version="v1" />
      <FeaturesSection />
      <ActiveDestinations />
      {/* <ExploreNearbySection /> */}
      {/* <HowItWorksSectionHome /> */}
      <SoftLoginTrigger>
        <Testimonials />
      </SoftLoginTrigger>
      <BlogsHomePage posts={enriched} categories={categories} />
    </>
  );
}
