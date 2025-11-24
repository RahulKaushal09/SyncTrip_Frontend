// src/app/page.tsx
import "../../styles/home/home.css";
import HomeHeroSection from "@/components/Home_new/HomeHeroSection";
import Testimonials from "@/components/Home_new/testimonialSection";
import BlogsHomePage from "../components/Home_new/homeBlogsSection";
import { FeaturesSection } from "@/components/Home_new/whyChooseSyncTrip";
import ExploreNearbySection from "@/components/Home_new/exploreNearyBySection";
import { HowItWorksSectionHome } from "@/components/Home_new/howItWorksHomeSection";
import { getThemeClass } from "@/utils/getThemeClassForBlogs";
import { BlogsApiServices } from "@/utils/blogs.api.utils";
import { BlogPost } from "@/types";
import { Metadata } from "next";
import Script from "next/script";

// export const metadata: Metadata = {
//   title: 'SyncTrip — Group Travel & Travel Buddies in India',
//   description: 'Find verified travel companions, join curated group trips and create shared itineraries across India. Discover trips, hotels and local guides with SyncTrip.',
//   keywords: 'group travel India, travel companions, shared itineraries, SyncTrip, group tours, travel community India',
//   authors: [{ name: 'SyncTrip' }],
//   robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
//   openGraph: {
//     title: 'SyncTrip — Group Travel & Travel Buddies in India',
//     description: 'Find verified travel companions, join curated group trips and create shared itineraries across India.',
//     url: 'https://synctrip.in',
//     siteName: 'SyncTrip',
//     locale: 'en_IN',
//     type: 'website',
//     images: [
//       {
//         url: 'https://synctrip.in/logo_1200.png',
//         width: 1200,
//         height: 630,
//         alt: 'SyncTrip — Group Travel & Travel Buddies',
//       },
//     ],
//   },
//   twitter: {
//     card: 'summary_large_image',
//     title: 'SyncTrip — Group Travel & Travel Buddies in India',
//     description: 'Find verified travel companions, curated group trips and shared itineraries across India.',
//     creator: '@synctrip',
//     site: '@synctrip',
//     images: ['https://synctrip.in/logo_1200.png'],
//   },
//   alternates: { canonical: 'https://synctrip.in' },
// };
export const metadata: Metadata = {
  title: 'SyncTrip: Group Travel, Destinations & Itineraries in India',
  description: 'SyncTrip helps you plan the perfect trip. Explore curated destinations, join group adventures, discover itineraries, book hotels, and connect with fellow travelers in India.',
  keywords: 'group travel India, travel planning, curated itineraries, SyncTrip, travel with friends, solo trips, book trips online, travel communities',
  authors: [{ name: 'SyncTrip' }],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  openGraph: {
    title: 'SyncTrip - Plan Your Perfect Adventure',
    description: 'Discover destinations, plan trips, and connect with fellow travelers. Start your journey with SyncTrip today!',
    type: 'website',
    url: 'https://synctrip.in',
    siteName: 'SyncTrip',
    locale: 'en_US',
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
    title: 'SyncTrip - Group Travel & Destinations',
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
    likes: Math.floor(Math.random() * 900) + 100,
    comments: Math.floor(Math.random() * 50) + 5,
    shares: Math.floor(Math.random() * 20) + 2
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
      <HomeHeroSection />
      <FeaturesSection />
      {/* <ExploreNearbySection /> */}
      <HowItWorksSectionHome />
      <Testimonials />
      <BlogsHomePage posts={enriched} categories={categories} />
    </>
  );
}
