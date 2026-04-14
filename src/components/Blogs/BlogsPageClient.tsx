// "use client";

// import { useState } from "react";
// import { BlogPost } from "@/types";
// import BlogCategories from "./BlogCategories";
// import BlogCard from "./BlogsCard";
// import "../../../styles/Blogs/blogCard.css";

// interface BlogsPageClientProps {
//   blogs: BlogPost[];
// }

// const BlogsPageClient = ({ blogs }: BlogsPageClientProps) => {
//   const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>(blogs);

//   return (
//     <>
//       <BlogCategories blogs={blogs} onFilterChange={setFilteredBlogs} />
//       <div className="blogPageClient-section">
//         <div className="blog-header">
//           <h2>Latest Travel Stories</h2>
//           <p>
//             Discover inspiring travel stories, destination guides, and insider
//             tips from experienced travelers around the world
//           </p>
//         </div>
//         <div className="blog-grid">
//           {filteredBlogs.map((blog) => (
//             <BlogCard
//               key={blog.id}
//               id={blog.id}
//               slug={blog.slug}
//               image={blog.featuredImage}
//               title={blog.title}
//               excerpt={blog.seo?.seo_description || ""}
//               author={blog.author}
//               date={new Date(blog.createdAt).toLocaleDateString("en-US", {
//                 year: "numeric",
//                 month: "short",
//                 day: "numeric",
//               })}
//               readTime={blog.readTime}
//               category={blog.category}
//               rating={blog.rating}
//               featured={blog.featured}
//             />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default BlogsPageClient;

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
      {/* Category Filter */}
      <BlogCategories blogs={blogs} onFilterChange={setFilteredBlogs} />

      <div className="blogPageClient-section">
        {/* Minimalist Editorial Header */}
        <div className="editorial-header">
          <div className="editorial-title-wrap">
            <h2>Latest Stories</h2>
            {/* <p>
              Insider tips, destination guides, and experiences from the SyncTrip community.
              </p> */}
          </div>
        </div>
          <div className="editorial-line" />

        {/* Premium Grid Layout */}
        <div className="premium-blog-grid">
          {filteredBlogs.map((blog, index) => (
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
              // Make the first card automatically featured if not explicitly set
              featured={blog.featured || index === 0}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogsPageClient;