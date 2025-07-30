'use client';

import React, { useState, useEffect } from 'react';
import CultureFestivalsCard from './CultureFestivalsCard';
import { Culture, Festival } from '@/types';
import '../../../styles/CultureFestivalsSection.css';

interface CultureFestivalsSectionProps {
  data: (Culture | Festival)[];
  heading: string;
  type: 'culture' | 'festival';
}

const CultureFestivalsSection: React.FC<CultureFestivalsSectionProps> = ({ data, heading, type }) => {
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   setLoading(false);
  // }, []);

  // const jsonLd = {
  //   '@context': 'https://schema.org',
  //   '@type': type === 'culture' ? 'CulturalEvent' : 'Festival',
  //   name: heading,
  //   description: `Explore ${type === 'culture' ? 'cultural experiences' : 'festivals'} in ${heading.split(' of ')[1] || 'this location'}.`,
  //   eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  //   eventStatus: 'https://schema.org/EventScheduled',
  //   subEvents: data.map((item) => ({
  //     '@type': type === 'culture' ? 'CulturalEvent' : 'Festival',
  //     name: item.name,
  //     description: item.description,
  //     location: {
  //       '@type': 'Place',
  //       name: heading.split(' of ')[1] || 'this location',
  //     },
  //     // startDate: null,
  //     image: item.images?.[0]?.image_url || '',
  //   })),
  // };

  // if (loading) {
  //   return (
  //     <div className="cf-section" style={{ marginBottom: '50px' }}>
  //       <h2 className="DescriptionHeading">
  //         <strong>{heading}</strong>
  //       </h2>
  //       <div className="cf-grid">
  //         {Array.from({ length: 3 }).map((_, index) => (
  //           <div key={index} className="cf-card skeleton">
  //             <div className="skeleton-image" style={{ height: '150px', background: '#e0e0e0' }} />
  //             <div className="cf-content">
  //               <div className="skeleton-text" style={{ height: '20px', background: '#e0e0e0', marginBottom: '10px' }} />
  //               <div className="skeleton-text" style={{ height: '16px', background: '#e0e0e0' }} />
  //             </div>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // }

  if (!data || data.length === 0) {
    return <div>No {type === 'culture' ? 'cultural experiences' : 'festivals'} available.</div>;
  }

  return (
    <div className="cf-section" style={{ marginBottom: '50px' }}>
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      /> */}
      <h2 className="DescriptionHeading">
        <strong>{heading}</strong>
      </h2>
      <div className="cf-grid">
        {data.map((item, index) => (
          <CultureFestivalsCard key={index} data={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default CultureFestivalsSection;