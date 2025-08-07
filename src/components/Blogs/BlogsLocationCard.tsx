import { Location } from "@/types";
import { ICONS_CLASS } from "@/utils/icon.utils";
import Icon from "../Icons/Icons";
import "../../../styles/Locations/locationCard.css";

interface LocationCardProps {
    location: Location;
    onCreateTrip: (locationId: string) => void;
}

const LocationCard = ({ location, onCreateTrip }: LocationCardProps) => {
    return (
        <div className="location-card">
            <div className="location-card-image-wrapper">
                <img
                    src={location.PlaceImageLink}
                    alt={location.title}
                    className="location-card-image"
                />
                <div className="location-card-rating">
                    <Icon name={ICONS_CLASS.starIcon.iconName} alt={ICONS_CLASS.starIcon.alt} className="star-icon" />
                    <span>{location.rating}</span>
                </div>
                <div className="location-card-places">
                    {location.placesNumberToVisit} Places
                </div>
            </div>

            <div className="location-card-content">
                <h3 className="location-card-title">{location.title}</h3>

                <div className="location-card-location">
                    <Icon
                            name={ICONS_CLASS.mapMarkerIcon.iconName}
                            alt={ICONS_CLASS.mapMarkerIcon.alt}
                            className="meta-icon"
                        />
                    <span>{location.state}, {location.country}</span>
                </div>

                <p className="location-card-description">{location.description}</p>

                <div className="location-card-details">
                    <div className="location-card-info">
                        <Icon
                            name={ICONS_CLASS.clockIcon.iconName}
                            alt={ICONS_CLASS.clockIcon.alt}
                            className="meta-icon"
                        />
                        <span>{location.best_time}</span>
                    </div>
                    <div className="location-card-info">
                        <Icon
                            name={ICONS_CLASS.personIcon.iconName}
                            alt={ICONS_CLASS.personIcon.alt}
                            className="meta-icon"
                        />
                        <span>{location.objective}</span>
                    </div>
                </div>

                <button
                    className="location-card-button"
                    onClick={() => onCreateTrip(location.id)}
                >
                    Create Trip to {location.title}
                </button>
            </div>
        </div>
    );
};

export default LocationCard;
