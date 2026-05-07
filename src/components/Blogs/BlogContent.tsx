"use client";
import { BlogPost, Location } from "@/types";
import "../../../styles/Blogs/blogContent.css";
import { Calendar, Clock, User, Share2, Tag, ArrowLeft, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { redirectToStore } from "@/utils/redirectToStore";

interface BlogContentProps {
    blog: BlogPost;
    relatedLocations: Partial<Location>[];
}

const BlogContent = ({ blog, relatedLocations }: BlogContentProps) => {
    const router = useRouter();

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.seo?.seo_description || "",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <article className="editorial-layout">

            {/* ── LEFT SIDEBAR ── */}
            <aside className="editorial-sidebar">
                <button onClick={() => router.push('/blogs')} className="editorial-back-btn">
                    <ArrowLeft size={16} />
                    <span>Back to Blogs</span>
                </button>

                <div className="sidebar-header">
                    <span className="editorial-category">{blog.category}</span>
                    <h1 className="editorial-title">{blog.title}</h1>
                </div>

                <div className="editorial-meta">
                    <div className="meta-item">
                        <User size={16} className="meta-icon" />
                        <span>{blog.author}</span>
                    </div>
                    <div className="meta-item">
                        <Calendar size={16} className="meta-icon" />
                        <span>
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="meta-item">
                        <Clock size={16} className="meta-icon" />
                        <span>{blog.readTime} min read</span>
                    </div>
                </div>

                {blog.filterTags && blog.filterTags.length > 0 && (
                    <div className="editorial-tags">
                        {blog.filterTags.map((tag, index) => (
                            <span key={index} className="tag-pill">
                                <Tag size={12} className="meta-icon" /> {tag}
                            </span>
                        ))}
                    </div>
                )}

                <button onClick={handleShare} className="editorial-share-btn">
                    <Share2 size={16} />
                    <span>Share Article</span>
                </button>
            </aside>

            {/* ── RIGHT CONTENT ── */}
            <main className="editorial-main-content">

                <div className="editorial-hero">
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="editorial-hero-image"
                        loading="eager"
                    />
                </div>

                <div
                    className="editorial-body-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                {/* ── RELATED LOCATIONS ── */}
                {relatedLocations && relatedLocations.length > 0 && (
                    <section className="related-locations">
                        <div className="related-locations-header">
                            <MapPin size={24} className="related-locations-icon" />
                            <h2 className="related-locations-title">Read More About</h2>
                        </div>

                        <div className="related-locations-scroll-wrap">
                            <div className="related-locations-strip">
                                {relatedLocations.map((location) => (
                                    <a
                                        key={location.id}
                                        href={`${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/location/${location.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="location-card"
                                    >
                                        <div className="location-card-image-wrap">
                                            <img
                                                src={location.photos?.[0]}
                                                alt={location.title}
                                                className="location-card-image"
                                                loading="lazy"
                                            />
                                            <div className="location-card-overlay" />
                                        </div>
                                        <div className="location-card-body">
                                            <span className="location-card-name">{location.title}</span>
                                            <span className="location-card-meta">
                                                <MapPin size={11} />
                                                {[location.state, location.country].filter(Boolean).join(", ")}
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <button onClick={redirectToStore} className="btn btn-primary !w-full !text-xl">
                    Download SyncTrip App
                </button>

            </main>
        </article>
    );
};

export default BlogContent;