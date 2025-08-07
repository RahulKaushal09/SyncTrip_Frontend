import BlogHero from "@/components/Blogs/BlogHero";
import BlogCategories from "@/components/Blogs/BlogCategories";
// import BlogCard from "@/components/Blogs/BlogsCard";
// import BlogFooter from "@/components/Blogs/BlogFooter";

import { sampleBlogs } from "@/data/sampleData";
import "../../../styles/Blogs/blogPage.css";
import BlogsPageClient from "@/components/Blogs/BlogsPageClient";

const Blog = () => {
    return (
        <div className="blog-page">
            <BlogHero />
            <BlogCategories />

            <section className="blog-section" id="#blog-section">
                <div className="blog-container">
                    <div className="blog-header">
                        <h2>Latest Travel Stories</h2>
                        <p>
                            Discover inspiring travel stories, destination guides, and insider
                            tips from experienced travelers around the world
                        </p>
                    </div>

                    <BlogsPageClient blogs={sampleBlogs} />

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
