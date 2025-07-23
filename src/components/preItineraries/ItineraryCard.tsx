"use client";
import '../../../styles/preItinerary/card.css'; // Custom CSS for styling
interface ItineraryCardProps {
    name: string;
    imgSrc: string;
    days: string;
}

const ItineraryCard: React.FC<ItineraryCardProps> = ({ name, imgSrc, days }) => {
    return (
        <div className="itinerary-card" key={name}>
            <img
                src={imgSrc || 'https://via.placeholder.com/200x300?text=No+Image'} // Fallback image if imgSrc is missing
                alt={`${name} Itinerary`}
                className="card-image-itinerary"
                style={{ maxWidth: "none" }}
            />
            <div className="card-overlay">
                <h3 className="card-title">{name}</h3>
                <p className="card-text">{days}</p> {/* Use days as passed, no hard-coded "Days" */}
            </div>
        </div>
    );
};

export default ItineraryCard;