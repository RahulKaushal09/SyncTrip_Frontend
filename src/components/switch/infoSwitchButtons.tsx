'use client';

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
}

const InfoSwitch: React.FC<InfoSwitchProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabKey>('about');

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'about', label: 'About' },
    { key: 'itinerary', label: 'Itinerary' },
    { key: 'stay', label: 'Stay' },
    { key: 'restaurants', label: 'Restaurants' },
    { key: 'places', label: 'Places to Visit' },
  ];

  return (
    <div className="w-full">
      {/* Switch Tabs */}
      <div className="flex infoSwitchButtons gap-2 border-b border-gray-200 mb-4">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 rounded-lg bg-white border shadow-sm min-h-[200px]">
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
