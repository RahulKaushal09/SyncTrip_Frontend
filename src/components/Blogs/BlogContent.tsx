"use client";
import { BlogPost } from "@/types";
import "../../../styles/Blogs/blogContent.css";
import { ICONS_CLASS } from "@/utils/icon.utils";
import Icon from "../Icons/Icons";
interface BlogContentProps {
    blog: BlogPost;
}

const BlogContent = ({ blog }: BlogContentProps) => {
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: blog.title,
                text: blog.seo.seo_description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
        }
    };

    return (
        <article className="blogContent-article">
            {/* Hero Image */}
            <div className="blogContent-hero">
                <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="blogContent-hero-image"
                />
                <div className="blogContent-hero-overlay" />
                <div className="blogContent-category-badge">{blog.category}</div>
            </div>

            {/* Article Header */}
            <header className="blogContent-header">
                <h1 className="blogContent-title">{blog.title}</h1>

                <div className="blogContent-meta">
                    <div className="blogContent-meta-item">
                        <Icon name={ICONS_CLASS.personIcon.iconName} alt={ICONS_CLASS.personIcon.alt} className="blogContent-icon" />
                        <span>{blog.author}</span>
                    </div>
                    <div className="blogContent-meta-item">
                        <Icon name={ICONS_CLASS.calendarIcon.iconName} alt={ICONS_CLASS.calendarIcon.alt} className="blogContent-icon" />
                        <span>
                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <div className="blogContent-meta-item">
                        <Icon name={ICONS_CLASS.clockIcon.iconName} alt={ICONS_CLASS.clockIcon.alt} className="blogContent-icon" />
                        <span>{blog.readTime}</span>
                    </div>
                    <button onClick={handleShare} className="blogContent-share-btn">
                        <Icon name={ICONS_CLASS.shareIcon.iconName} alt={ICONS_CLASS.shareIcon.alt} className="blogContent-icon" />
                        <span>Share</span>
                    </button>
                </div>

                {/* Tags */}
                <div className="blogContent-tags">
                    {blog.filterTags.map((tag, index) => (
                        <span key={index} className="blogContent-tag">
                            <Icon name={ICONS_CLASS.tagsIcon.iconName} alt={ICONS_CLASS.tagsIcon.alt} className="blogContent-icon-small" />
                            {tag}
                        </span>
                    ))}
                </div>
            </header>

            {/* Article Content */}
            <div
                className="blogContent-body"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        </article>
    );
};

export default BlogContent;
