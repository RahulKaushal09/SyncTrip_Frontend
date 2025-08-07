import "../../../styles/Blogs/blogCategories.css"; // Adjust path if needed

import { travelBlogFilters } from "@/constants";

const categories = travelBlogFilters.map((category) => ({
  name: category,
  count: Math.floor(Math.random() * 100) + 1, // Random count for demonstration
  active: false // Initially not active
}));

const BlogCategories = () => {
  return (
    <section className="blogCategories-section">
      <div className="blogCategories-container">
        <div className="blogCategories-list">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`blogCategories-btn ${category.active ? "active" : ""
                }`}
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
