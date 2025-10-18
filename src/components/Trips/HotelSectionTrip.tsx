
import React, { useEffect, useRef, useState } from 'react';
import SkeletonHotelCard from '../Skeleton/HotelSkeletonBox';
import { Hotel } from '@/types/api.types';
import { WishlistTypeEnum } from '@/constants';
import LocationHotelCard from '../Cards/LocationHotelCard';
import "../../styles/TripHotelStaySection.css"
import HotelBookingSheet from '../bottomSheets/HotelBookingSheet';
const HotelsSection: React.FC<{
    hotels: Hotel[];
    totalHotels: number;
    locationUUID: string;
    isLoading?: boolean;
    selectionHotels?: Hotel[];
}> = ({ hotels, totalHotels, locationUUID, isLoading = false, selectionHotels = [] }) => {
    const [showSheet, setShowSheet] = useState(false);
    const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);
    const openHotelBookingSheet = (hotel: Hotel) => {
        setBookingHotel(hotel);
        setShowSheet(true);

    }
    return (
        <div style={{ marginTop: 25 }}>
            <div className='row' style={{ marginBottom: 20 }}>
                {/* <p style={styles.headingText} >{totalHotels} Hotels</p> */}
                <h2 className='DescriptionHeading'><strong>{totalHotels} Hotels</strong></h2>

            </div>

            {selectionHotels.length > 0 && (
                <>
                    <div className='row' style={{ marginBottom: 20 }}>
                        <h2 className='DescriptionHeading'><strong>Booked Hotels</strong></h2>
                    </div>
                    {selectionHotels.length === 0 && !isLoading ? (
                        <ListEmpty />
                    ) : (
                        selectionHotels.map((item, index) => (
                            <LocationHotelCard
                                key={index}
                                h={item}
                                title={`Top ${index + 1} hotels in ${item.hotel_name}`}
                                whishlistParentId={locationUUID}
                                whishlistParentType={WishlistTypeEnum.location}
                                typeOfWhishlistCardEnum={WishlistTypeEnum.hotel}
                                cardId={item.id}
                                isWishlisted={item.isWishlisted || false}
                            />
                        ))
                    )}

                </>
            )}
            {isLoading ? (
                [1, 2, 3].map((item) => (
                    <SkeletonHotelCard key={item} />
                ))) : (
                hotels.length > 0 && (
                    <div className="hotels-grid-400">
                        {hotels.map((hotel, index) => (
                            <LocationHotelCard

                                key={index}
                                h={hotel}
                                title={`Top ${index + 1} hotels in ${hotel.hotel_name}`}
                                whishlistParentId={locationUUID}
                                whishlistParentType={WishlistTypeEnum.location}
                                typeOfWhishlistCardEnum={WishlistTypeEnum.hotel}
                                cardId={hotel.id}
                                isWishlisted={hotel.isWishlisted || false}
                                onBookingClick={() => openHotelBookingSheet(hotel)}
                            />
                        ))
                        }
                    </div>
                )
            )
            }


            {hotels.length === 0 && <ListEmpty />}
            {showSheet && <HotelBookingSheet visible={showSheet} onClose={() => setShowSheet(false)} hotelName={bookingHotel?.hotel_name ?? ''} hotelLinks={bookingHotel?.hotelLinks ?? []} />}

        </div>
    );
};

const ListEmpty = () => (
    <div style={{ padding: 20 }}>
        <p style={{ color: '#666' }}>No items available for this section.</p>
    </div>
);



export default HotelsSection;