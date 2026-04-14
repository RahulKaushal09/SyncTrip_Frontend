// "use client";

// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import "../../../styles/Blogs/blogCard.css";
// import { ICONS_CLASS } from "@/utils/icon.utils";
// import Icon from "../Icons/Icons";
// import { useLoader } from '@/components/providers/LoaderContext';

// interface BlogCardProps {
//     id?: string;
//     slug?: string;
//     image: string;
//     title: string;
//     excerpt: string;
//     author: string;
//     date: string;
//     readTime: string;
//     category: string;
//     rating?: string;
//     featured?: boolean;
// }

// const BlogCard = ({
//     slug,
//     image,
//     title,
//     excerpt,
//     author,
//     date,
//     readTime,
//     category,
//     rating,
//     featured = false,
// }: BlogCardProps) => {
//     const { showLoader } = useLoader();
//     const router = useRouter();
//     const [isMobile, setIsMobile] = useState(false);

//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         handleResize(); // set initially

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
//     const handleClick = () => {
//         if (slug) {
//             showLoader();
//             router.push(`/blogs/${slug}`);
//         }
//     };

//     return (
//         <div
//             className={`blog-card ${featured && !isMobile ? "featured" : ""}`}
//             onClick={handleClick}
//         >
//             <div className="blog-card-image-wrapper">
//                 <img src={image} alt={title} className="blog-card-image" />
//                 <div className="blog-card-category">{category}</div>
//                 {rating && (
//                     <div className="blog-card-rating">
//                         <Icon name={ICONS_CLASS.starIcon.iconName} alt={ICONS_CLASS.starIcon.alt} className="star-icon" />
//                         <span>{rating}</span>
//                     </div>
//                 )}
//             </div>

//             <div className="blog-card-content">
//                 <h3 className="blog-card-title">{title}</h3>
//                 <p className="blog-card-excerpt">{excerpt}</p>
//                 <div className="blog-card-meta">
//                     <div className="blog-card-author-date">
//                         <span><Icon name={ICONS_CLASS.personIcon.iconName} alt={ICONS_CLASS.personIcon.alt} className="meta-icon" /> {author}</span>
//                         <span><Icon name={ICONS_CLASS.calendarIcon.iconName} alt={ICONS_CLASS.calendarIcon.alt} className="meta-icon" /> {date}</span>
//                     </div>
//                     <div className="blog-card-readtime">
//                         <Icon name={ICONS_CLASS.clockIcon.iconName} alt={ICONS_CLASS.clockIcon.alt} className="meta-icon" /> <span>{readTime} min</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BlogCard;

"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "../../../styles/Blogs/blogCard.css";
import { Clock, Calendar, User, Star, ArrowUpRight } from "lucide-react";
import { useLoader } from '@/components/providers/LoaderContext';

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
    const { showLoader } = useLoader();
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleClick = () => {
        if (slug) {
            showLoader();
            router.push(`/blogs/${slug}`);
        }
    };

    const isFeatured = featured && !isMobile;

    return (
        <article
            className={`premium-blog-card ${isFeatured ? "is-featured" : "is-regular"}`}
            onClick={handleClick}
        >
            <div className="pbc-image-wrapper">
                <img src={image} alt={title} className="pbc-image" loading="lazy" />
                
                {/* Scrim for featured cards to make text pop */}
                {isFeatured && <div className="pbc-scrim" />}

                <div className="pbc-badges">
                    <span className="pbc-category">{category}</span>
                    {rating && (
                        <span className="pbc-rating">
                            <Star size={12} className="pbc-star-icon" />
                            {rating}
                        </span>
                    )}
                </div>
            </div>

            <div className="pbc-content">
                <div className="pbc-meta-top">
                    <div className="pbc-meta-item">
                        <Calendar size={14} /> {date}
                    </div>
                    <div className="pbc-meta-item">
                        <Clock size={14} /> {readTime} min read
                    </div>
                </div>

                <h3 className="pbc-title">{title}</h3>
                <p className="pbc-excerpt">{excerpt}</p>

                <div className="pbc-footer">
                    <div className="pbc-author">
                        <div className="pbc-author-avatar">
                            <User size={14} />
                        </div>
                        <span>{author}</span>
                    </div>
                    
                    <div className="pbc-read-more">
                        <span>Read Article</span>
                        <ArrowUpRight size={18} className="pbc-arrow" />
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BlogCard;