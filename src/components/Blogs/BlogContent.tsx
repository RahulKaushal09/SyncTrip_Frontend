"use client";
import { BlogPost } from "@/types";
import "../../../styles/Blogs/blogContent.css";
import { Calendar, Clock, User, Share2, Tag, Smartphone, Play, Apple, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { APP_LINKS } from "@/constants";
import { redirectToStore } from "@/utils/redirectToStore";

interface BlogContentProps {
    blog: BlogPost;
}

const BlogContent = ({ blog }: BlogContentProps) => {
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

            {/* ── LEFT SIDEBAR (Sticky on Desktop) ── */}
            <aside className="editorial-sidebar">

                {/* Back Button */}
                <button onClick={() => router.push('/blogs')} className="editorial-back-btn">
                    <ArrowLeft size={16} />
                    <span>Back to Blogs</span>
                </button>

                {/* Category & Title */}
                <div className="sidebar-header">
                    <span className="editorial-category">{blog.category}</span>
                    <h1 className="editorial-title">{blog.title}</h1>
                </div>

                {/* Meta Info */}
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

                {/* Tags */}
                {blog.filterTags && blog.filterTags.length > 0 && (
                    <div className="editorial-tags">
                        {blog.filterTags.map((tag, index) => (
                            <span key={index} className="tag-pill">
                                <Tag size={12} className="meta-icon" /> {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Share Action */}
                <button onClick={handleShare} className="editorial-share-btn">
                    <Share2 size={16} />
                    <span>Share Article</span>
                </button>

                {/* SyncTrip App Promo Card (Desktop Only) */}
                {/* <button onClick={redirectToStore} className="btn btn-primary">
                    Download SyncTrip App
                </button> */}

            </aside>

            {/* ── RIGHT CONTENT (Scrollable) ── */}
            <main className="editorial-main-content">

                {/* Hero Image */}
                <div className="editorial-hero">
                    <img
                        src={blog.featuredImage}
                        alt={blog.title}
                        className="editorial-hero-image"
                        loading="eager"
                    />
                </div>

                {/* Rich Text Body */}
                <div
                    className="editorial-body-text"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <button onClick={redirectToStore} className="btn btn-primary !w-full !text-xl">
                    Download SyncTrip App 
                </button>

            </main>
        </article>
    );
};

export default BlogContent;