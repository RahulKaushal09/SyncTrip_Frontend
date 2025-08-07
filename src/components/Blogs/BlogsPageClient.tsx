"use client";

import { useState } from "react";
import { BlogPost } from "@/types";
import BlogCategories from "./BlogCategories";
import BlogCard from "./BlogsCard";
import "../../../styles/Blogs/blogCard.css";

interface BlogsPageClientProps {
  blogs: BlogPost[];
}

const BlogsPageClient = ({ blogs }: BlogsPageClientProps) => {
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(blogs);

  return (
    <>
      <BlogCategories blogs={blogs} onFilterChange={setFilteredBlogs} />
      <div className="blog-header">
        <h2>Latest Travel Stories</h2>
        <p>
          Discover inspiring travel stories, destination guides, and insider
          tips from experienced travelers around the world
        </p>
      </div>
      <div className="blog-grid">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            id={blog.id}
            slug={blog.slug}
            image={blog.featuredImage}
            title={blog.title}
            excerpt={blog.seo?.seo_description || ""}
            author={blog.author}
            date={new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            readTime={blog.readTime}
            category={blog.category}
            rating={blog.rating}
            featured={blog.featured}
          />
        ))}
      </div>
    </>
  );
};

export default BlogsPageClient;
