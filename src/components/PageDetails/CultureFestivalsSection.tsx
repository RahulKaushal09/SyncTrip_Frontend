'use client';

import React from 'react';
import { Palette, Sparkles } from 'lucide-react';
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
    return null; // Returning null is cleaner than rendering an empty text div that breaks the layout flow
  }

  const isCulture = type === 'culture';

  return (
    <div className="cf-section m-animate m-fade-in" style={{ marginBottom: '60px', marginTop: '40px' }}>

      {/* =========================================
          HEADER SECTION WITH ICONS
          ========================================= */}
      <div style={{ marginBottom: '24px' }}>
        <h2 className="h4 text-secondary-1" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 8px 0' }}>
          {isCulture ? (
            <Palette size={28} color="var(--primary-1)" />
          ) : (
            <Sparkles size={28} color="var(--warning-1)" />
          )}
          {heading}
        </h2>

        {/* UI CHANGE: Added a subtle description to set the context that this is an informational reading section */}
        <p className="r2 text-neutral-1" style={{ margin: 0 }}>
          {isCulture
            ? "Immerse yourself in the heritage, traditions, and local way of life."
            : "Discover local events, music, and seasonal celebrations."}
        </p>
      </div>

      {/* =========================================
          STATIC GRID LAYOUT
          ========================================= */}
      <div
        className="cf-grid m-stagger"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr', // UI CHANGE: Forces exactly 1 column (1 item per line)
          gap: '24px',
          cursor: 'default' // explicitly removes any pointer hand
        }}
      >
        {data.map((item, index) => (
          <div key={index} style={{ cursor: 'default', transition: 'none' }}>
            <CultureFestivalsCard data={item} type={type} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default CultureFestivalsSection;