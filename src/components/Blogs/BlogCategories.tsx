import React, { useState, useMemo } from "react";
import { BlogPost } from "@/types";
import "../../../styles/Blogs/blogCategories.css";

interface Props {
  blogs: BlogPost[];
  onFilterChange: (filteredBlogs: BlogPost[]) => void; // callback to pass filtered blogs
}

const BlogCategories = ({ blogs, onFilterChange }: Props) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Get unique tags and count how many blogs use them
  const tagMap = useMemo(() => {
    const map: { [tag: string]: number } = {};
    blogs.forEach((blog) => {
      blog.filterTags.forEach((tag) => {
        map[tag] = (map[tag] || 0) + 1;
      });
    });
    return map;
  }, [blogs]);

  // Convert to an array for rendering
  const categories = useMemo(() => {
    return Object.entries(tagMap).map(([name, count]) => ({
      name,
      count,
      active: name === activeCategory,
    }));
  }, [tagMap, activeCategory]);

  const handleFilterClick = (category: string) => {
    const newCategory = activeCategory === category ? null : category;
    setActiveCategory(newCategory);

    // Filter blogs based on the new active category
    if (newCategory) {
      const filtered = blogs.filter((blog) =>
        blog.filterTags.includes(newCategory)
      );
      onFilterChange(filtered);
    } else {
      onFilterChange(blogs); // reset filter
    }
  };

  return (
    <section className="blogCategories-section">
      <div className="blogCategories-container">
        <div className="blogCategories-list">
          {categories.map((category,i) => (
            <button
              key={category.name}
              className={`blogCategories-btn ${i === 0 ? "first" : ""} ${category.active ? "active" : ""}`}
              onClick={() => handleFilterClick(category.name)}
            >
              <span className="blogCategories-name">{category.name}</span>
              <span className="blogCategories-badge">{category.count}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogCategories;
