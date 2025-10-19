'use client';

import React, { useState } from 'react';
import { Restaurants } from '@/types';
import LocationRestaurantCard from '../Cards/LocationRestaurantCard';
import { WishlistTypeEnum } from '@/constants';
import SkeletonRestaurantCard from '../Skeleton/SkeletonRestaurantCard';
import { SwitchButtons } from '../switch/2SwitchButtons';
import ListMapToggleSwitch from '../switch/ListMapToggle';

type Props = {
    restaurants: Restaurants[];
    totalRestaurants: number;
    locationUUID: string;
    isLoading?: boolean;
};

const RestaurantsSection: React.FC<Props> = ({
    restaurants,
    totalRestaurants,
    locationUUID,
    isLoading = false,
}) => {
    const [selectedViewType, setSelectedViewType] = useState<'List' | 'Map'>('List');

    return (
        <div style={styles.container}>
            {/* Header row */}
            <div style={{ ...styles.row, marginBottom: 20 }}>
                <h2 className='DescriptionHeading'><strong>{totalRestaurants} Restaurants</strong></h2>
                {/* <SwitchButtons
                    options={[
                        { text: 'Cultures', value: 'cultures', onClick: () => setAboutTab('cultures') },
                        { text: 'Festivals', value: 'festivals', onClick: () => setAboutTab('festivals') },
                    ]}
                    selectedValue={aboutTab}
                    setSelectedValue={(value) => setAboutTab(value as 'cultures' | 'festivals')}
                /> */}
                {/* <SwitchButtons
          options={[
            { text: 'List', value: 'List' },
            { text: 'Map', value: 'Map' },
          ]}
          selectedValue={selectedViewType}
          setSelectedValue={(value) => setSelectedViewType(value as 'List' | 'Map')}
        /> */}
                <ListMapToggleSwitch
                    options={['List', 'Map']}
                    value={selectedViewType}
                    onChange={(val: string) => setSelectedViewType(val as 'List' | 'Map')}
                />
            </div>

            {/* List / Map rendering */}
            {selectedViewType === 'List' && (
                <>
                    {isLoading ? (
                        <>
                            <SkeletonRestaurantCard />
                            <SkeletonRestaurantCard />
                            <SkeletonRestaurantCard />
                        </>
                    ) : (
                        <div style={styles.gridWrapper}>
                            {restaurants.map((item, index) => (
                                <div key={`${item.id}-${index}`} style={styles.gridItem}>
                                    <LocationRestaurantCard
                                        r={item}
                                        cardId={item.id}
                                        whishlistParentId={locationUUID}
                                        whishlistParentType={WishlistTypeEnum.location}
                                        typeOfWhishlistCardEnum={WishlistTypeEnum.restaurant}
                                        isWishlisted={item.isWishlisted || false}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Empty list fallback */}
            {restaurants.length === 0 && !isLoading && <ListEmpty />}
        </div>
    );
};

const ListEmpty = () => (
    <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>No items available for this section.</p>
    </div>
);

export default RestaurantsSection;

/* ---------------------- */
/* Styles (const object)  */
/* ---------------------- */
const styles: { [key: string]: React.CSSProperties } = {
  container: { marginTop: 25 },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  /* responsive grid: each column at least 280px, otherwise 1fr; gap = 16px */
  gridWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: 16,
    alignItems: 'start',
  },
  gridItem: {
    /* ensures card fills grid cell and prevents extra inner margins */
    width: '100%',
    boxSizing: 'border-box',
  },
  emptyContainer: { padding: 20 },
  emptyText: { color: 'var(--neutral-1)', fontSize: 14 },
};
