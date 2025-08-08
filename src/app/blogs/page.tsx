import BlogHero from "@/components/Blogs/BlogHero";
export const dynamic = "force-dynamic";

// import BlogCategories from "@/components/Blogs/BlogCategories";
// import BlogCard from "@/components/Blogs/BlogsCard";
// import BlogFooter from "@/components/Blogs/BlogFooter";
import { Metadata } from "next";
import Script from "next/script";

// import { sampleBlogs } from "@/data/sampleData";
import "../../../styles/Blogs/blogPage.css";
import BlogsPageClient from "@/components/Blogs/BlogsPageClient";
import { BlogPost } from "@/types";
import { BlogsApiServices } from "@/utils";
export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Explore Travel Blogs | SyncTrip",
    description: "Discover inspiring travel stories, guides, and experiences from real travelers. Explore blogs to plan your next adventure.",
    keywords: [
      "travel blogs",
      "destination guides",
      "SyncTrip blogs",
      "travel stories",
      "travel experiences",
    ].join(", "),
    alternates: {
      canonical: "https://synctrip.in/blogs",
    },
    openGraph: {
      title: "Explore Travel Blogs | SyncTrip",
      description: "Discover inspiring travel stories, guides, and experiences from real travelers.",
      url: "https://synctrip.in/blogs",
      type: "website",
      images: [
        {
          url: "https://synctrip.in/logo_main.jpg", // ✅ Replace with your OG image
          alt: "Explore Travel Blogs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Explore Travel Blogs | SyncTrip",
      description: "Read blogs and plan your next trip with SyncTrip.",
      images: ["https://synctrip.in/logo_main.jpg"], // ✅ Replace with your image
    },
  };
};
const Blog = async  () => {
    const blogs:BlogPost[] = await BlogsApiServices.fetchAllBlogs();
    return (
        <div className="blog-page">

            <Script id="blog-listing-schema" type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Travel Blogs | SyncTrip",
    description: "Read expert travel blogs and destination guides curated by SyncTrip.",
    mainEntity: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.seo?.seo_title || blog.title,
      url: `https://synctrip.in/blogs/${blog.slug}`,
      image: blog.seo?.seo_image || blog.featuredImage,
      datePublished: blog.createdAt,
      author: {
        "@type": "Person",
        name: blog.author,
      },
    })),
  })}
</Script>
            <BlogHero />
            {/* <BlogCategories blogs={blogs} /> */}

            <section className="blog-section" id="#blog-section">
                <div className="blog-container">
                   

                    <BlogsPageClient blogs={blogs} />

                    {/* <div className="pagination">
                        <button className="btn-outline btn-small">
                            <FaChevronLeft />
                            <span>Previous</span>
                        </button>

                        <div className="page-numbers">
                            <button className="btn-primary btn-small">1</button>
                            <button className="btn-outline btn-small">2</button>
                            <button className="btn-outline btn-small">3</button>
                            <span className="ellipsis">...</span>
                            <button className="btn-outline btn-small">8</button>
                        </div>

                        <button className="btn-outline btn-small">
                            <span>Next</span>
                            <FaChevronRight />
                        </button>
                    </div> */}
                </div>
            </section>

        </div>
    );
};

export default Blog;
