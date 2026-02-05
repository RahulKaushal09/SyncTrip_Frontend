// app/blogs/[slug]/page.tsx


import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ApiService, BlogsApiServices } from "@/utils";
// import BlogContent from "@/components/Blogs/BlogContent";
// import BlogsLocationCard from "@/components/Blogs/BlogsLocationCard";
import { BlogPost, Location } from "@/types";
import Script from "next/script";

import dynamic from 'next/dynamic';
const BlogContent = dynamic(() => import("@/components/Blogs/BlogContent"), {
  loading: () => <p>Loading...</p>,
});
const BlogsLocationCard = dynamic(() => import("@/components/Blogs/BlogsLocationCard"));

// import "@/styles/Blogs/blogDetail.css";
import "../../../../styles/Blogs/blogDetail.css";

import { LocationFields } from "@/constants";

interface BlogDetailProps {
  params: Promise<{ slug: string }>; // Define params as a Promise


}
// export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
//   const { slug } = await params;
//   const blog = await BlogsApiServices.fetchBlogBySlug(slug);
//   if (!blog) return {};
//   const title = blog.seo?.seo_title || blog.title;
//   const description = blog.seo?.seo_description || (blog.content?.replace(/<[^>]+>/g, '').slice(0, 155));
//   const image = blog.seo?.seo_image || blog.featuredImage;

//   return {
//     title,
//     description,
//     keywords: blog.seo?.seo_keywords?.join(', '),
//     openGraph: {
//       title,
//       description,
//       type: 'article',
//       url: blog.seo?.canonical_url || `https://synctrip.in/blogs/${blog.slug}`,
//       images: [{ url: image, alt: blog.title }],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images: [image],
//     },
//     alternates: { canonical: blog.seo?.canonical_url || `https://synctrip.in/blogs/${blog.slug}` }
//   };
// }

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
    return notFound(); // SSR 404 if blog not found
  }
  const relatedLocationsIds = blog.relatedLocations || [];
  let relatedLocations: Location[] = [];
  if (relatedLocationsIds.length > 0) {
    const locationFieldsTofetch = [
      LocationFields.ID,
      LocationFields.TITLE,
      LocationFields.IMAGES,
      LocationFields.PHOTOS,
      LocationFields.PLACES_NUMBER_TO_VISIT,
      LocationFields.COUNTRY,
      LocationFields.STATE,
      LocationFields.BEST_TIME,
      LocationFields.DESCRIPTION,

    ];
    relatedLocations = await ApiService.fetchLocationsByIds(
      relatedLocationsIds,
      locationFieldsTofetch
    );
  }

  const openCreateTripPage = () => {
    window.open('/create/trip', '_blank');
  }
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "image": [blog.featuredImage],
    "author": { "@type": "Person", "name": blog.author || 'SyncTrip' },
    "datePublished": blog.createdAt,
    "dateModified": blog.createdAt,
    "publisher": { "@type": "Organization", "name": "SyncTrip", "logo": { "@type": "ImageObject", "url": "https://synctrip.in/logo_main_withoutBG.png" } },
    "description": blog.seo?.seo_description || blog.content?.replace(/<[^>]+>/g, '').slice(0, 155),
    "mainEntityOfPage": { "@type": "WebPage", "@id": blog.seo?.canonical_url || `https://synctrip.in/blogs/${blog.slug}` }
  };


  return (

    <div className="blog-detail">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main className="blog-container">
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: blog.seo?.seo_title || blog.title,
            description: blog.seo?.seo_description,
            image: blog.seo?.seo_image || blog.featuredImage,
            author: {
              "@type": "Person",
              name: blog.author,
            },
            publisher: {
              "@type": "Organization",
              name: "SyncTrip",
              logo: {
                "@type": "ImageObject",
                url: "https://synctrip.in/logo_main.png",
              },
            },
            datePublished: blog.createdAt,
          })}
        </Script>

        <BlogContent blog={blog} />

        {/* {relatedLocations.length > 0 && (
          <section className="related-section">
            <div className="section-header">
              <h2>Explore Related Destinations</h2>
              <p>
                Discover amazing places mentioned in this blog and start planning your next adventure
              </p>
            </div>
            <div className="related-grid">
              {relatedLocations.map((location) => (
                <BlogsLocationCard
                  key={location.id}
                  location={location}
                />
              ))}
            </div>
          </section>
        )} */}

        <section className="cta-section">
          <div className="cta-box">
            <h3>Ready to Start Your Journey?</h3>
            <p>
              Turn your travel dreams into reality. Create personalized itineraries and discover hidden gems with SyncTrip.
            </p>
            {/* <CTAButton /> */}
            <a href="/create/trip" target="_blank" className="btn btn-primary">
              Plan Your Trip
            </a>
            {/* <button onClick={()=>openCreateTripPage()} className="cta-button">Plan Your Trip</button> */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogDetailPage;
