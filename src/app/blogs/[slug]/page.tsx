import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ApiService, BlogsApiServices } from "@/utils";
import { BlogPost, Location } from "@/types";
import Script from "next/script";
import dynamic from 'next/dynamic';
import "../../../../styles/Blogs/blogDetail.css";
import { LocationFields } from "@/constants";

const BlogContent = dynamic(() => import("@/components/Blogs/BlogContent"), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-[#4bbef5] border-t-transparent animate-spin" />
    </div>
  ),
});

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog: BlogPost = await BlogsApiServices.fetchBlogBySlug(slug);
  if (!blog) return {};

  return {
    title: blog.seo?.seo_title || blog.title,
    description: blog.seo?.seo_description || blog.content?.substring(0, 160),
    keywords: blog.seo?.seo_keywords?.join(", "),
    openGraph: {
      title: blog.seo?.seo_title || blog.title,
      description: blog.seo?.seo_description,
      images: [
        {
          url: blog.seo?.seo_image || blog.featuredImage,
          alt: blog.title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seo?.seo_title || blog.title,
      description: blog.seo?.seo_description,
      images: [blog.seo?.seo_image || blog.featuredImage],
    },
    alternates: {
      canonical: blog.seo?.canonical_url || `https://synctrip.in/blogs/${blog.slug}`,
    },
  };
}

const BlogDetailPage = async ({ params }: BlogDetailProps) => {
  const { slug } = await params;
  const blog: BlogPost = await BlogsApiServices.fetchBlogBySlug(slug);
  
  if (!blog) {
    return notFound(); 
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.seo?.seo_title || blog.title,
    "description": blog.seo?.seo_description || blog.content?.replace(/<[^>]+>/g, '').slice(0, 155),
    "image": [blog.seo?.seo_image || blog.featuredImage],
    "datePublished": blog.createdAt,
    "dateModified": blog.createdAt,
    "author": {
      "@type": "Person",
      "name": blog.author || "Verified Explorer",
      "url": "https://synctrip.in/community"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SyncTrip",
      "logo": {
        "@type": "ImageObject",
        "url": "https://synctrip.in/logo_main_withoutBG.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://synctrip.in/blogs/${blog.slug}`
    }
  };

  return (
    <div className="blog-detail-wrapper">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="editorial-blog-container">
        <BlogContent blog={blog} />
      </main>
    </div>
  );
};

export default BlogDetailPage;