"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { sampleBlogs, sampleLocations } from "@/data/sampleData";
import BlogContent from "@/components/Blogs/BlogContent";
import LocationCard from "@/components/Blogs/BlogsLocationCard";
// import BlogHeader from "@/components/Blogs/BlogHeader";
// import BlogFooter from "@/components/Blogs/BlogFooter";

import { BlogPost, Location } from "@/types";
import "../../../../styles/Blogs/blogDetail.css";

const BlogDetail = () => {
    const params = useParams();
    const router = useRouter();
    const slug = typeof params.slug === "string" ? params.slug : params.slug?.[0];

    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [relatedLocations, setRelatedLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const foundBlog = sampleBlogs.find((b) => b.slug === slug);

        if (!foundBlog) {
            router.push("/blog");
            return;
        }

        setBlog(foundBlog);

        const locations = sampleLocations.filter((location) =>
            foundBlog.relatedLocations.includes(location.id)
        );
        setRelatedLocations(locations);
        setLoading(false);
        console.log("Blog loaded:", foundBlog);
        document.title = foundBlog.seo.seo_title;

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute("content", foundBlog.seo.seo_description);
        } else {
            const meta = document.createElement("meta");
            meta.name = "description";
            meta.content = foundBlog.seo.seo_description;
            document.head.appendChild(meta);
        }

        const canonicalLink = document.querySelector('link[rel="canonical"]');
        if (canonicalLink) {
            canonicalLink.setAttribute("href", foundBlog.seo.canonical_url);
        } else {
            const link = document.createElement("link");
            link.rel = "canonical";
            link.href = foundBlog.seo.canonical_url;
            document.head.appendChild(link);
        }
    }, [slug, router]);

    const handleCreateTrip = (locationId: string) => {
        console.log("Creating trip for location:", locationId);
        // router.push(`/create-trip?location=${locationId}`);
    };

    // const handleBackToBlog = () => {
    //     router.push("/blogs");
    // };

    if (loading) {
        return (
            <div className="blog-detail">
                {/* <BlogHeader /> */}
                <div className="loading-section">
                    <div className="loading-title"></div>
                    <div className="loading-banner"></div>
                    <div className="loading-lines">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
                {/* <BlogFooter /> */}
            </div>
        );
    }

    if (!blog) return null;

    return (
        <div className="blog-detail">
            {/* <BlogHeader /> */}

            <main className="blog-container">
                {/* <button onClick={handleBackToBlog} className="back-button">
                    <FaArrowLeft />
                    <span>Back to Blogs</span>
                </button> */}

                <BlogContent blog={blog} />

                {relatedLocations.length > 0 && (
                    <section className="related-section">
                        <div className="section-header">
                            <h2>Explore Related Destinations</h2>
                            <p>
                                Discover amazing places mentioned in this blog and start planning your next adventure
                            </p>
                        </div>

                        <div className="related-grid">
                            {relatedLocations.map((location) => (
                                <LocationCard
                                    key={location.id}
                                    location={location}
                                    onCreateTrip={handleCreateTrip}
                                />
                            ))}
                        </div>
                    </section>
                )}

                <section className="cta-section">
                    <div className="cta-box">
                        <h3>Ready to Start Your Journey?</h3>
                        <p>
                            Turn your travel dreams into reality. Create personalized itineraries and discover hidden gems with SyncTrip.
                        </p>
                        <button className="cta-button">Plan Your Trip</button>
                    </div>
                </section>
            </main>

            {/* <BlogFooter /> */}
        </div>
    );
};

export default BlogDetail;
