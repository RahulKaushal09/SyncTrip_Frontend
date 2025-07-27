"use client";
// components/FestivalsEvents.tsx (Server Component)
import React, { useState } from 'react';
import GetLocationBlock from './GetLocationBlock';
import EventList from './EventsListingBlock';
// import EmptyState from './EmptyState'; // Server component
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Events } from '@/types';

interface FestivalsEventsProps {
    initialEvents: Events[];
    initialLocation: string;
}

export default function FestivalsEvents({ initialEvents, initialLocation }: FestivalsEventsProps) {
    const [events, setEvents] = useState<Events[]>(initialEvents);
    const locationTitle = initialLocation || 'India'; // Default to 'India' if no location is provided
    return (
        <section itemScope itemType="https://schema.org/Event">
            <div className="row">
                <div className="col-lg-8 col-sm-12 col-md-8">
                    <h2 className="fw-bold majorHeadings" style={{ textAlign: 'left' }}>
                        Festivals & Events
                    </h2>
                    <meta itemProp="name" content="Festivals and Events" />
                    <meta itemProp="description" content="Discover exciting festivals and events in various cities across India." />
                </div>

                <div className="col-lg-4 col-sm-12 col-md-4">
                    <GetLocationBlock initialLocation={locationTitle} setEvents={setEvents} />
                </div>
            </div>

            <div
                className="col-lg-12"
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                }}
            >
                {events.length > 0 ? (
                    <EventList initialEvents={events} />
                ) : (
                    // <EmptyState />
                    ""
                )}
            </div>
        </section>
    );
}