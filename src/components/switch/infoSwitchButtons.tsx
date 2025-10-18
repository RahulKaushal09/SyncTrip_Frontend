'use client';

import '../../../styles/style.css';
import React, { useState } from 'react';

type TabKey = 'about' | 'itinerary' | 'stay' | 'restaurants' | 'places';

interface InfoSwitchProps {
  data: {
    about?: React.ReactNode;
    itinerary?: React.ReactNode;
    stay?: React.ReactNode;
    restaurants?: React.ReactNode;
    places?: React.ReactNode;
  };
  onTabChange?: (tab: TabKey) => void;
}

const InfoSwitch: React.FC<InfoSwitchProps> = ({ data, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('about');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'stay', label: 'Stay' },
    data.restaurants && { key: 'restaurants', label: 'Restaurants' },
    data.places && { key: 'places', label: 'Places to Visit' },
  ].filter(Boolean) as { key: TabKey; label: string }[];

  return (
    <div className="w-full">
      {/* Switch Tabs */}
      <div className="flex infoSwitchButtons gap-2 border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              onTabChange?.(tab.key);
            }}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.key
                ? 'active-switch-button'
                : 'inactive-switch-button'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="">
        {activeTab === 'about' && data.about}
        {activeTab === 'itinerary' && data.itinerary}
        {activeTab === 'stay' && data.stay}
        {activeTab === 'restaurants' && data.restaurants}
        {activeTab === 'places' && data.places}
      </div>
    </div>
  );
};

export default InfoSwitch;
