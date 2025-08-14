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
      <HomeHeroSection />
      <FeaturesSection />
      <ExploreNearbySection />
      <HowItWorksSectionHome />
      <Testimonials />
      <BlogsHomePage posts={enriched} categories={categories} />
    </>
  );
}
