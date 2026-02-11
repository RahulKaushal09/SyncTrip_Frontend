"use client"
import React, { useState, useMemo, useEffect } from "react";
import "../../../styles/home/homeBlogsSection.css";
import { Newspaper } from "lucide-react";
import { useLoader } from '@/components/providers/LoaderContext';
import { BlogPost } from "@/types";
import { API_CONFIG } from './../../constants/config';

interface BlogsHomePageProps {
  posts: BlogPost[];
  categories: { key: string; label: string }[];
}

const BlogsHomePage: React.FC<BlogsHomePageProps> = ({ posts, categories }) => {
  const { showLoader } = useLoader();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  // Fix hydration by ensuring browser-only logic waits for mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const redirectBtnClick = (redirectionLink: string) => {
    showLoader();
    window.location.href = redirectionLink;
  };

  const getFirstParagraphText = (html: string) => {
    if (typeof window === "undefined") return ""; 
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const firstP = doc.querySelector("p");
    return firstP ? firstP.textContent || "" : "";
  };

  const filteredPosts = useMemo(() => {
    return selectedCategory === "all"
      ? posts
      : posts.filter(post => post.filterTags?.[0]?.toLowerCase().replace(/\s+/g, "-") === selectedCategory);
  }, [posts, selectedCategory]);

  const processedPosts = useMemo(() => {
    // Deterministic configs: Server and Client will now pick the same ones
    const imgHeights = ["short-img", "medium-img", "tall-img", "medium-img"];
    const textLimits = [100, 140, 80, 120];

    return filteredPosts.map((post, index) => {
      // Use index % length instead of Math.random()
      const imgClass = imgHeights[index % imgHeights.length];
      const limit = textLimits[index % textLimits.length];
      
      const fullText = getFirstParagraphText(post.content);
      const trimmedDesc = fullText.length > limit 
        ? fullText.substring(0, limit) + "..." 
        : fullText;

      return {
        ...post,
        imgClass,
        trimmedDesc,
      };
    });
  }, [filteredPosts]);

  const categoryThemeMap: Record<string, string> = {
    culture: "tag-culture", 
    adventure: "tag-adventure", 
    food: "tag-food", 
    "food & drink": "tag-food", 
    city: "tag-city", 
    "city breaks": "tag-city", 
    nature: "tag-nature"
  };

  const getThemeClass = (tag: string) => {
    const key = tag?.toLowerCase().trim();
    return categoryThemeMap[key] || "tag-nature";
  };

  // Prevent flash of unstyled content/mismatch during hydration
  if (!mounted) return null;

  return (
    <section className="content-hub-blogs-section container-custom">
      <div className="section-header-blogs-section">
        <h2 className="section-title-blogs-section text-3xl md:text-4xl font-bold">Travel Content Hub</h2>
        <p className="section-subtitle-blogs-section">
          Discover curated travel guides, destination inspiration, and expert
          itineraries for your next adventure
        </p>
      </div>

      <div className="filter-tabs-blogs-section">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            className={`filter-tab-blogs-section ${selectedCategory === key ? "active" : ""}`}
            onClick={() => setSelectedCategory(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {/* 1. 'lg:columns-3' is usually better for 4-column looks to keep cards from being too skinny.
          2. 'break-inside-avoid' + 'inline-block' prevents the "white space" by hugging content.
      */}
      <div className="block sm:columns-2 lg:columns-3 xl:columns-3 gap-6 space-y-6">
        {processedPosts.map((post) => (
          <div
            key={post.id}
            className="content-card-blogs-section break-inside-avoid inline-block w-full mb-6 group"
            onClick={() => redirectBtnClick(`${API_CONFIG.DOMAIN_BASE_URL}/blogs/${post.slug}`)}
          >
            <div
              className={`card-image-blogs-section transition-transform duration-500 ${post.imgClass}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.2)), url(${post.featuredImage})`,
              }}
            >
              <div className="card-overlay-blogs-section">
                {post.filterTags?.[0] && (
                  <span className={`category-tag-blogs-section shadow-sm ${getThemeClass(post.filterTags[0])}`}>
                    {post.filterTags[0]}
                  </span>
                )}
              </div>
            </div>

            <div className="card-content-blogs-section">
              <h3 className="card-title-blogs-section group-hover:text-primary-600 transition-colors">
                {post.title}
              </h3>
              <p className="card-description-blogs-section">
                {post.trimmedDesc}
              </p>

              <div className="author-info-text-blogs-section pt-2 border-t border-neutral-50">
                <span className="author-name-blogs-section">{post.author}</span>
                <span className="read-time-blogs-section">{post.readTime} mins</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="explore-button-blogs-section">
        <button 
          onClick={() => redirectBtnClick("/blogs")}
          className="HomePageMoreExploreButtonCss"
        >
          <span>More Blogs</span>
          <span className="ml-2 m-animate m-rotate-in is-inview"><Newspaper size={18} /></span>
        </button>
      </div>
    </section>
  );
};

export default BlogsHomePage;