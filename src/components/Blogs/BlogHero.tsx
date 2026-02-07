
import heroImage from "../../assets/images/hero-blog.jpg";
import "../../../styles/Blogs/blogHero.css"; // Adjust path as needed
import { ICONS_CLASS } from "@/utils/icon.utils";
import Icon from "../Icons/Icons";

const BlogHero = () => {
  return (
    <section className="blogHero-section">
      <div
        className="blogHero-bg"
        style={{ backgroundImage: `url(${heroImage.src})` }}
      >
        <div className="blogHero-overlay" />
      </div>

      <div className="blogHero-content">
        <h1 className="blogHero-title">
          Travel Stories &amp;
          <span className="blogHero-highlight">
            Adventures
          </span>
        </h1>
        <p className="blogHero-subtitle">
          Discover incredible destinations through our curated travel experiences and insider tips
        </p>
        <div className="blogHero-buttons">
          <button className="blogHero-btn-blue">
            Explore Stories
          </button>
          <button className="blogHero-btn-blue-reverse">
            Plan Your Trip
          </button>
        </div>
      </div>

      <div className="blogHero-arrow">
        <Icon
          name={ICONS_CLASS.arrowDownIcon.iconName}
          alt={ICONS_CLASS.arrowDownIcon.alt}
          className="blogHero-icon"
          width="24px"
          height="24px"
        />
      </div>
    </section>
  );
};

export default BlogHero;
