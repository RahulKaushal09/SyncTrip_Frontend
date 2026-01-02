import '../../../styles/trips/Trip.css';
import { Metadata } from 'next';
import HostedTripSection from '@/components/Trips/TripSectionHosted';
import { TripsApiService } from '@/utils/trips.api.utils';
import { HostedTrip } from '@/types';


export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Hosted Group Trips | SyncTrip',
    description:
      'Explore curated hosted group trips across India. Fixed dates, limited seats.',
    metadataBase: new URL('https://synctrip.in'),
    alternates: { canonical: 'https://synctrip.in/trips' },
    openGraph: {
      title: 'Hosted Group Trips | SyncTrip',
      description:
        'Curated group trips with fixed dates and limited seats.',
      url: 'https://synctrip.in/trips',
      siteName: 'SyncTrip',
      images: [
        {
          url: '/images/default-travel-og.jpg',
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// export async function generateMetadata(): Promise<Metadata> {
//   try {
//     const res = await TripsApiService.fetchAllHostedTrips();
//     const trips: HostedTrip[] = res;

//     const totalTrips = trips.length;
//     const minPrice = trips.length
//       ? Math.min(...trips.map(t => t.price))
//       : null;

//     const title =
//       totalTrips > 0
//         ? `${totalTrips} Hosted Group Trips | Starting ₹${minPrice}+ | SyncTrip`
//         : 'Hosted Group Trips | SyncTrip';

//     const description =
//       totalTrips > 0
//         ? `Explore ${totalTrips} curated group trips across India. Fixed dates, limited seats, real people. Join trips starting from ₹${minPrice}.`
//         : 'Explore curated group trips with fixed dates and limited seats. Join and start matching instantly.';

//     return {
//       title,
//       description,
//       alternates: { canonical: 'https://synctrip.in/trips' },
//       openGraph: {
//         title,
//         description,
//         url: 'https://synctrip.in/trips',
//         siteName: 'SyncTrip',
//         images: [
//           {
//             url: trips[0]?.mainImageUrl || '/images/default-travel-og.jpg',
//             width: 1200,
//             height: 630,
//           },
//         ],
//         locale: 'en_IN',
//         type: 'website',
//       },
//       robots: {
//         index: true,
//         follow: true,
//       },
//     };
//   } catch {
//     return {
//       title: 'Hosted Group Trips | SyncTrip',
//       description: 'Discover curated hosted group trips and join instantly.',
//     };
//   }
// }

const HostedTripsPage = async () => {
  const res = await TripsApiService.fetchAllHostedTrips();
  const trips = res;

  return (
    <div className="trips-container">
      <HostedTripSection trips={trips} />
    </div>
  );
};

export default HostedTripsPage;
