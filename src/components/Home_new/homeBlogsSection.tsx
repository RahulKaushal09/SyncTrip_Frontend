"use client"
import React, { useState, useMemo } from "react";
import "../../../styles/home/homeBlogsSection.css";
import { ThumbsUp, MessageCircle, Eye, Share2, Heart, Clock, Newspaper } from "lucide-react";
import Link from "next/link";
import { useLoader } from '@/components/providers/LoaderContext';
// import { useRouter } from "next/navigation";
import { BlogPost } from "@/types";
import { API_CONFIG } from './../../constants/config';

interface EnrichedBlogPost extends BlogPost {
  liked: boolean;
  likes: number;
  comments: number;
  shares: number;
  themeClass: string;
}

interface BlogsHomePageProps {
  posts: EnrichedBlogPost[];
  categories: { key: string; label: string }[];
}
const statIcons = [ThumbsUp, MessageCircle, Share2];

const getRandomValue = () => Math.floor(Math.random() * 900) + 100; // 100–999

const BlogsHomePage: React.FC<BlogsHomePageProps> = ({ posts, categories }) => {
  const { showLoader } = useLoader();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // const router = useRouter();
  const redirectBtnClick = (redirectionLink: string) => {
    showLoader();
    // router.push(redirectionLink);
    window.location.href = redirectionLink; // Use window.location for client-side navigation
  };
  const getFirstParagraphText = (html: string) => {
    if (typeof window === "undefined") return ""; // safety check
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const firstP = doc.querySelector("p");
    return firstP ? firstP.textContent || "" : "";
  };
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter(post => post.filterTags?.[0]?.toLowerCase().replace(/\s+/g, "-") === selectedCategory);

  const postsWithHeight = useMemo(() => {
    const heightClasses = [
      { className: "short-img", type: "short", descLimit: 80 },
      { className: "medium-img", type: "medium", descLimit: 120 },
      { className: "tall-img", type: "tall", descLimit: 160 },
      { className: "x-tall-img", type: "x-tall", descLimit: 200 },
    ];

    return filteredPosts.map((post) => {
      // Pick random height config
      const randomHeight = heightClasses[Math.floor(Math.random() * heightClasses.length)];

      // Trim description based on random height's limit
      const trimmedDesc =
        post.content.length > randomHeight.descLimit
          ? getFirstParagraphText(post.content).substring(0, randomHeight.descLimit) + "..."
          : getFirstParagraphText(post.content);

      return {
        ...post,
        heightClass: randomHeight.type,
        imgClass: randomHeight.className, // Assign to image too
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

  const themeClasses = Object.values(categoryThemeMap);

  // Helper to get theme class (random fallback)
  const getThemeClass = (tag: string) => {
    const key = tag.toLowerCase().trim();
    if (categoryThemeMap[key]) return categoryThemeMap[key];
    // Assign random theme if no match
    return themeClasses[Math.floor(Math.random() * themeClasses.length)];
  };
  return (
    <section className="content-hub-blogs-section container-custom">
      {/* Section Header */}
      <div className="section-header-blogs-section">
        <h2 className="section-title-blogs-section">Travel Content Hub</h2>
        <p className="section-subtitle-blogs-section">
          Discover curated travel guides, destination inspiration, and expert
          itineraries for your next adventure
        </p>
      </div>

      {/* Filter Tabs */}
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

      {/* Content Grid */}
      <div className="content-grid-blogs-section">
        {postsWithHeight.map((post) => (
          <div
            key={post.id}
            className={`content-card-blogs-section ${post.heightClass}`}
            data-category={post.category}
            onClick={() => redirectBtnClick(`${API_CONFIG.DOMAIN_BASE_URL}/blogs/${post.slug}`)}
          >
            <div
              className={`card-image-blogs-section ${post.imgClass}`}
              style={{
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${post.featuredImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="card-overlay-blogs-section">
                {post.filterTags?.length > 0 && (
                  <span
                    className={`category-tag-blogs-section ${getThemeClass(post.filterTags[0])}`}
                  >
                    {post.filterTags[0]}
                  </span>
                )}
                {/* <div
                    className={`heart-icon ${post.liked ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(post.id);
                    }}
                    role="button"
                    aria-label={post.liked ? "Unlike post" : "Like post"}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleLike(post.id);
                      }
                    }}
                  >
                    {post.liked ? "♥" : "♡"}
                  </div> */}
              </div>
            </div>

            <div className="card-content-blogs-section">
              <h3 className="card-title-blogs-section">{post.title}</h3>
              <p className="card-description-blogs-section">{post.trimmedDesc}</p>

              <div className="author-info-text-blogs-section">
                <span className="author-name-blogs-section">{post.author}</span>
                <span className="read-time-blogs-section">{post.readTime} mins</span>

              </div>

              <div className="card-meta-row">
                <div className="card-stats-blogs-section">
                  {statIcons.map((Icon, i) => (
                    <div key={i} className="stat-item-blogs-section flex items-center gap-1">
                      <Icon size={16} />
                      <span>{getRandomValue()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore More Button */}
      <div className="explore-button-blogs-section">
        {/* <Link href="/blogs" onClick={() => redirectBtnClick("/blogs")} className="btn-explore-blogs-section">
            
          </Link> */}
        <button onClick={() => redirectBtnClick("/blogs")}
          className="HomePageMoreExploreButtonCss"
        >
          <span>More Blogs</span>
          <span className="ml-2 m-animate m-rotate-in is-inview"><Newspaper /></span>
        </button>


      </div>

    </section>
  );
};

export default BlogsHomePage;
