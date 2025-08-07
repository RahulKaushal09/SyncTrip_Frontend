"use client";

import "../../../styles/Blogs/blogCard.css";
import BlogCard from './BlogsCard';

interface BlogsPageClientProps {
  blogs: {
    id: string;
    slug: string;
    featuredImage: string;
    title: string;
    seo: { seo_description: string };
    author: string;
    createdAt: string;
    readTime: string;
    category: string;
    rating?: string;
    featured?: boolean;
  }[];
}

const BlogsPageClient = ({ blogs }: BlogsPageClientProps) => {
  return (
    <div className="blog-grid">
      {blogs.map((blog) => (
        <BlogCard
          key={blog.id}
          id={blog.id}
          slug={blog.slug}
          image={blog.featuredImage}
          title={blog.title}
          excerpt={blog.seo.seo_description}
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
  );
};

export default BlogsPageClient;