import { getAllBlogsResponseSchema } from '@/classes/ApiResponse.classes';
import { API_CONFIG, blogfields } from '../constants';
import { BlogPost } from '@/types/component.types';
import { addBlogRequestSchema, blogResponseSchema } from '@/classes/ApiRequest.classes';
// import { cookies } from 'next/headers';

export class BlogsApiServices {

    static async fetchBlogsForSitemap(): Promise<BlogPost[]> {
        const Fields = [
            blogfields.ID,
            blogfields.TITLE,
            blogfields.SLUG,
            blogfields.CREATED_AT,
            blogfields.UPDATED_AT,
        ];

        // Build query string for fields
        const queryParams = new URLSearchParams({
            fields: Fields.join(',')
        });

        const allBlogsResponse = await fetch(
            `${API_CONFIG.BACKEND_BASE_URL}/api/blogs/all?${queryParams.toString()}`,
            
            {
                next: { revalidate: 7200 }, // ✅ cache for 2 hours
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ limit: 100 }), // body
                // cache: "no-store"
            }
        );

        if (allBlogsResponse.status === 404) {
            return [];
        }

        const allBlogsData: getAllBlogsResponseSchema = await allBlogsResponse.json();
        if (!allBlogsData?.blogs?.length) {
            return [];
        }

        return allBlogsData.blogs;
    }
    static async fetchAllBlogs(): Promise<BlogPost[]> {
        const allBlogsResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/blogs/all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ limit: 100 }),
            cache: "no-store"
        });
        if (allBlogsResponse.status === 404) {
            // throw new Error('No blogs found. Please check back later.');
            return [];
        }
        const allBlogsData: getAllBlogsResponseSchema = await allBlogsResponse.json();
        if (!allBlogsData || !allBlogsData.blogs || allBlogsData.blogs.length === 0) {
            return [];
        }
        return allBlogsData.blogs;
    }
    static async fetchBlogBySlug(blogSlug: string): Promise<BlogPost> {
        const blogResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/blogs/${blogSlug}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Authorization: `Bearer ${token}`,
            },
        });
        if (!blogResponse.ok) {
            throw new Error('Failed to fetch blog details');
        }
        const response: blogResponseSchema = await blogResponse.json();
        if (!response || !response.success || !response.data) {
            throw new Error('Blog not found');
        }
        return response.data;
    }
    static async createNewBlog(blogData: addBlogRequestSchema): Promise<BlogPost> {
        try {
            const createBlogResponse = await fetch(`${API_CONFIG.BACKEND_BASE_URL}/api/blogs/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(blogData),
            });
            if (!createBlogResponse.ok) {
                throw new Error('Failed to create new blog');
            }
            const createdBlog: BlogPost = await createBlogResponse.json();
            return createdBlog;
        } catch (error) {
            console.error('Error creating blog:', error);
            throw error;
        }
    }


}