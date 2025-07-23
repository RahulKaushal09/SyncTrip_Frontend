'use client'
import React from 'react';
import '../../../styles/events/events.css'; // Import custom CSS for event listing block

import { Events } from '@/types';

const EventCard = ({ event }: { event: Events }) => {
    const {
        location,
        title,
        price,
        Allcategories,
        imageLink,
        bookingLink,
        eventType,
        tags,
        eventDateTime,

    } = event;
    const date = new Date(eventDateTime);

    // Options for formatting: full month name, numeric day, full weekday
    const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    };

    // Get formatted parts
    const formattedDateParts = date.toLocaleDateString('en-US', options).split(", ");
    const [weekday, monthAndDay] = formattedDateParts;
    const eventDate = `${monthAndDay} | ${weekday}`;


    // Determine the custom card class based on the event title
    const getCardClass = () => {
        if (title.includes("Guns N' Roses")) return "eventsCards-guns";
        if (title.includes("Halwa")) return "eventsCards-halwa";
        return "eventsCards-default";
    };
    const imageURL = imageLink.split("events/")[0] + "events/" + imageLink.split("events/")[1].split("/")[1]

    return (
        <div className={`eventsCards-card mb-3 ${getCardClass()}`} style={{ borderRadius: '10px', cursor: "pointer" }} onClick={() => window.open(bookingLink, "_blank")}>
            <img src={imageURL} className="eventsCards-card-img-top" alt={title} />
            <div className="eventsCards-card-body p-0">
                {tags && tags.includes("PROMOTED") && (
                    <span className="eventsCards-badge  position-absolute top-0 end-0 m-2 ">PROMOTED</span>
                )}
                <div className="eventsCards-details p-3">
                    <h5 className="eventsCards-card-title mb-2">{title}</h5>
                    <p className="eventsCards-card-text eventsCardlocation mb-1 ">
                        {location.locationName}
                    </p>
                    <p className="eventsCards-card-text eventsCardCat mb-1">
                        {eventType || Allcategories[0]}
                    </p>
                    {/* eventDateTime
                     */}
                    <p className='eventsCards-card-text eventsCardPrice mb-0'>
                        {eventDate}
                    </p>
                    <p className="eventsCards-card-text eventsCardPrice mb-0">
                        {price}
                    </p>


                </div>
            </div>
        </div>
    );
};

export default EventCard;