// src/app/blogs/[slug]/page.tsx

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ApiService, BlogsApiServices } from "@/utils";
import { BlogPost } from "@/types";
import BlogContent from "@/components/Blogs/BlogContent";
import "../../../../styles/Blogs/blogDetail.css";
import { cache } from 'react';
import { LocationFields } from "@/constants";

interface BlogDetailProps {
  params: Promise<{ slug: string }>;
}

// ✅ Cache the fetch so it's called ONCE per slug, reused by both
// generateMetadata and the page component during the same build/request

// Wrap with React cache - guarantees single fetch per slug per render
const getBlog = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    return await BlogsApiServices.fetchBlogBySlug(slug) ?? null;
  } catch {
    return null;
  }
});

// ✅ Pre-build all blog slugs at deploy time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/blogs/slugs`, {
      cache: 'force-cache',

    });
    const slugs: string[] = await res.json();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return []; // build won't fail if backend is down
  }
}

// ✅ Built once, never revalidated - blogs don't change after publish
export const revalidate = 3600; // 1 hour - blogs don't change so this barely matters
export const dynamicParams = true; // new blog slug → SSR on first hit → cached forever after

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug); // ✅ Next.js dedupes this automatically (React cache)
  if (!blog) return {};

  /**
   * layout.tsx applies the `%s | SyncTrip` title template, and most backend
   * seo_title values already end in "| SyncTrip" - which was shipping titles
   * like "Best Time to Visit Goa ... | SyncTrip | SyncTrip" and burning ~11
   * characters of the ~60 Google actually displays.
   */
  const rawTitle = blog.seo?.seo_title || blog.title;
  const title = rawTitle?.replace(/\s*[|\-–]\s*SyncTrip\s*$/i, "").trim() || blog.title;

  return {
    title,
    description: blog.seo?.seo_description || blog.content?.substring(0, 160),
    keywords: blog.seo?.seo_keywords?.join(", "),
    openGraph: {
      title,
      description: blog.seo?.seo_description,
      images: [{ url: blog.seo?.seo_image || blog.featuredImage, alt: blog.title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
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
  const blog = await getBlog(slug); // ✅ same call, Next.js serves from cache - no second network hit

  const relatedLocations = blog?.relatedLocations || [];

  const relatedLocDetails = await ApiService.fetchLocationsByIds(relatedLocations, [LocationFields.ID, LocationFields.TITLE, LocationFields.SLUG, LocationFields.COUNTRY, LocationFields.STATE, LocationFields.PHOTOS]);


  if (!blog) return notFound();

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
      "logo": { "@type": "ImageObject", "url": "https://synctrip.in/logo_main_withoutBG.png" }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://synctrip.in/blogs/${blog.slug}`
    }
  };

  return (
    <div className="blog-detail-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="editorial-blog-container">
        <BlogContent blog={blog} relatedLocations={relatedLocDetails} />
      </main>
    </div>
  );
};

export default BlogDetailPage;