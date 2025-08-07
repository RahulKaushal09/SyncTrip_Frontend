import { BlogPost } from "@/types";

export interface wishlistRequestSchema {
    type: string;
    refId: string;
    parentType?: string;
    parentId?: string;
    name?: string;
}

export interface getUserWishlistRequestSchema {
    wishlistType: string;
}


export interface blogResponseSchema{
    success: boolean;
    data: BlogPost;
    message?: string;
    error?: string;
}

export interface addBlogRequestSchema {
    title: string;
    slug: string;
    content: string; // Full HTML content
    featuredImage?: string;
    relatedLocations?: string[]; // Array of location IDs
    seo?: {
        seo_title?: string;
        seo_description?: string;
        seo_keywords?: string[];
        canonical_url?: string;
        seo_image?: string;
    };
    author?: string;
    readTime?: string;
    // category?: string;
    rating?: string ; // Rating can be null if not provided
    featured?: boolean; // Optional field to mark the blog as featured
}
export interface getBlogsByIdsRequestSchema {
    blogIds: string[];
}