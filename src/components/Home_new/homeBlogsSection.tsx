"use client";

import React, { useState, useMemo } from "react";
import "../../../styles/home/homeBlogsSection.css";
import { ThumbsUp, MessageCircle, Eye, Share2, Heart, Star } from "lucide-react";

type BlogPost = {
  id: number;
  imageLink:string;
  category: string;
  categoryTag: string;
  categoryClass: string;
  imgClass: string;
  title: string;
  description: string;
  authorName: string;
  authorAvatarClass: string;
  readTime: string;
  stats: { icon: string; value: string }[];
  liked: boolean;
};

const initialPosts: BlogPost[] = [
  // 👇 India-related posts here
  {
    id: 1,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "culture",
    categoryTag: "Culture",
    categoryClass: "tag-culture",
    imgClass: "bg-varanasi tall-img",
    title: "Sacred Ghats of Varanasi",
    description:
      "Experience the spiritual heart of India at the ghats of Varanasi. Witness mesmerizing Ganga Aarti rituals, explore ancient temples, and immerse yourself in centuries-old traditions.",
    authorName: "Ravi Sharma",
    authorAvatarClass: "avatar-1",
    readTime: "6 min read",
    stats: [
      { icon: "👍", value: "3.1k" },
      { icon: "💬", value: "89" },
      { icon: "📤", value: "241" },
    ],
    liked: false,
  },
  {
    id: 2,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "city",
    categoryTag: "City Breaks",
    categoryClass: "tag-city",
    imgClass: "bg-mumbai medium-img",
    title: "48 Hours in Mumbai: The City of Dreams",
    description:
      "From the Gateway of India to bustling markets and Bollywood vibes, explore Mumbai's vibrant energy in just two days.",
    authorName: "Ananya Mehta",
    authorAvatarClass: "avatar-2",
    readTime: "5 min read",
    stats: [
      { icon: "👍", value: "2.5k" },
      { icon: "💬", value: "72" },
      { icon: "📤", value: "198" },
    ],
    liked: false,
  },
  {
    id: 3,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "nature",
    categoryTag: "Nature",
    categoryClass: "tag-nature",
    imgClass: "bg-kerala x-tall-img",
    title: "Backwaters of Kerala: A Serene Escape",
    description:
      "Cruise through tranquil backwaters, enjoy traditional houseboats, and indulge in authentic Kerala cuisine amidst lush greenery.",
    authorName: "Meera Nair",
    authorAvatarClass: "avatar-3",
    readTime: "9 min read",
    stats: [
      { icon: "👍", value: "4.2k" },
      { icon: "💬", value: "132" },
      { icon: "📤", value: "322" },
    ],
    liked: true,
  },
  {
    id: 4,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "adventure",
    categoryTag: "Adventure",
    categoryClass: "tag-adventure",
    imgClass: "bg-himalayas short-img",
    title: "Trekking in the Indian Himalayas",
    description:
      "Challenge yourself with scenic trails, snow-clad peaks, and breathtaking landscapes in the Indian Himalayas.",
    authorName: "Karan Verma",
    authorAvatarClass: "avatar-4",
    readTime: "11 min read",
    stats: [
      { icon: "👍", value: "5.1k" },
      { icon: "💬", value: "145" },
      { icon: "📤", value: "410" },
    ],
    liked: false,
  },
  {
    id: 5,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "culture",
    categoryTag: "Culture",
    categoryClass: "tag-culture",
    imgClass: "bg-varanasi tall-img",
    title: "Sacred Ghats of Varanasi",
    description:
      "Experience the spiritual heart of India at the ghats of Varanasi. Witness mesmerizing Ganga Aarti rituals, explore ancient temples, and immerse yourself in centuries-old traditions.",
    authorName: "Ravi Sharma",
    authorAvatarClass: "avatar-1",
    readTime: "6 min read",
    stats: [
      { icon: "👍", value: "3.1k" },
      { icon: "💬", value: "89" },
      { icon: "📤", value: "241" },
    ],
    liked: false,
  },
  {
    id: 6,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "city",
    categoryTag: "City Breaks",
    categoryClass: "tag-city",
    imgClass: "bg-mumbai medium-img",
    title: "48 Hours in Mumbai: The City of Dreams",
    description:
      "From the Gateway of India to bustling markets and Bollywood vibes, explore Mumbai's vibrant energy in just two days.",
    authorName: "Ananya Mehta",
    authorAvatarClass: "avatar-2",
    readTime: "5 min read",
    stats: [
      { icon: "👍", value: "2.5k" },
      { icon: "💬", value: "72" },
      { icon: "📤", value: "198" },
    ],
    liked: false,
  },
  {
    id: 7,
    imageLink:'https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg',
    category: "nature",
    categoryTag: "Nature",
    categoryClass: "tag-nature",
    imgClass: "bg-kerala x-tall-img",
    title: "Backwaters of Kerala: A Serene Escape",
    description:
      "Cruise through tranquil backwaters, enjoy traditional houseboats, and indulge in authentic Kerala cuisine amidst lush greenery.",
    authorName: "Meera Nair",
    authorAvatarClass: "avatar-3",
    readTime: "9 min read",
    stats: [
      { icon: "👍", value: "4.2k" },
      { icon: "💬", value: "132" },
      { icon: "📤", value: "322" },
    ],
    liked: true,
  },
  {
    id: 8,
    imageLink:"https://synctrip.in/AllImages/compressed/Location/Kashmir/images/0_KASHMIR.jpg",
    category: "adventure",
    categoryTag: "Adventure",
    categoryClass: "tag-adventure",
    imgClass: "bg-himalayas short-img",
    title: "Trekking in the Indian Himalayas",
    description:
      "Challenge yourself with scenic trails, snow-clad peaks, and breathtaking landscapes in the Indian Himalayas.",
    authorName: "Karan Verma",
    authorAvatarClass: "avatar-4",
    readTime: "11 min read",
    stats: [
      { icon: "👍", value: "5.1k" },
      { icon: "💬", value: "145" },
      { icon: "📤", value: "410" },
    ],
    liked: false,
  },
];

const categories = [
  { key: "all", label: "All Content" },
  { key: "adventure", label: "Adventure" },
  { key: "culture", label: "Culture" },
  { key: "food", label: "Food & Drink" },
  { key: "nature", label: "Nature" },
  { key: "city", label: "City Breaks" },
];
const statIcons = [ThumbsUp, MessageCircle,  Share2];

const getRandomValue = () => Math.floor(Math.random() * 900) + 100; // 100–999

const BlogsHomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);

  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, liked: !post.liked } : post
      )
    );
  };

  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);
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
      post.description.length > randomHeight.descLimit
        ? post.description.substring(0, randomHeight.descLimit) + "..."
        : post.description;

    return {
      ...post,
      heightClass: randomHeight.type,
      imgClass: randomHeight.className, // Assign to image too
      trimmedDesc,
    };
  });
}, [filteredPosts]);

  return (
    <section className="content-hub-blogs-section paddingSectionLeftRight">
      <div className="container">
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
            >
             <div
  className={`card-image-blogs-section ${post.imgClass}`}
  style={{
    background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.1)), url(${post.imageLink})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
                <div className="card-overlay-blogs-section">
                  <span className={`category-tag-blogs-section ${post.categoryClass}`}>
                    {post.categoryTag}
                  </span>
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
                  <span className="author-name-blogs-section">{post.authorName}</span>
                  <span className="read-time-blogs-section">{post.readTime}</span>

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
          <a href="/blogs" className="btn-explore-blogs-section">
            More Blogs
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogsHomePage;
