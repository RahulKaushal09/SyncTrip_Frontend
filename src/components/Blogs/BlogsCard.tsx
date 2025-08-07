"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "../../../styles/Blogs/blogCard.css";
import { ICONS_CLASS } from "@/utils/icon.utils";
import Icon from "../Icons/Icons";

interface BlogCardProps {
    id?: string;
    slug?: string;
    image: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    category: string;
    rating?: string;
    featured?: boolean;
}

const BlogCard = ({
    slug,
    image,
    title,
    excerpt,
    author,
    date,
    readTime,
    category,
    rating,
    featured = false,
}: BlogCardProps) => {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        handleResize(); // set initially

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleClick = () => {
        if (slug) {
            router.push(`/blogs/${slug}`);
        }
    };

    return (
        <div
            className={`blog-card ${featured && !isMobile ? "featured" : ""}`}
            onClick={handleClick}
        >
            <div className="blog-card-image-wrapper">
                <img src={image} alt={title} className="blog-card-image" />
                <div className="blog-card-category">{category}</div>
                {rating && (
                    <div className="blog-card-rating">
                        <Icon name={ICONS_CLASS.starIcon.iconName} alt={ICONS_CLASS.starIcon.alt} className="star-icon" />
                        <span>{rating}</span>
                    </div>
                )}
            </div>

            <div className="blog-card-content">
                <h3 className="blog-card-title">{title}</h3>
                <p className="blog-card-excerpt">{excerpt}</p>
                <div className="blog-card-meta">
                    <div className="blog-card-author-date">
                        <span><Icon name={ICONS_CLASS.personIcon.iconName} alt={ICONS_CLASS.personIcon.alt} className="meta-icon" /> {author}</span>
                        <span><Icon name={ICONS_CLASS.calendarIcon.iconName} alt={ICONS_CLASS.calendarIcon.alt} className="meta-icon" /> {date}</span>
                    </div>
                    <div className="blog-card-readtime">
                        <Icon name={ICONS_CLASS.clockIcon.iconName} alt={ICONS_CLASS.clockIcon.alt} className="meta-icon" /> <span>{readTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
