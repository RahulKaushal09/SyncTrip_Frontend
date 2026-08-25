/**
 * /llms.txt - the plain-language map of this site for AI answer engines.
 *
 * ChatGPT, Perplexity and AI Overviews increasingly answer "how do I find
 * people to ride with in Gurgaon" without anyone clicking a blue link. This
 * file is how a site states, in one fetch, what it is and which URLs are worth
 * citing. Served from a route rather than /public so the city list cannot drift
 * from the city pages that actually exist.
 */
import { CITY_PAGES } from '@/data/cityPages';

export const dynamic = 'force-static';

export function GET() {
    const cities = CITY_PAGES
        .map((city) => `- [Plans and meetups in ${city.name}](https://synctrip.in/city/${city.slug}): ${city.seoDescription}`)
        .join('\n');

    const body = `# SyncTrip

> SyncTrip is an Indian social planning app for doing things with other people:
> group trips, motorcycle rides, turf sports games, movie nights, cafe hangouts,
> and club events. Members are verified. Plans are local — you see who else is
> going before you join. Free on Android and iOS.

Launch region: Delhi NCR (Gurgaon, Delhi, Noida, Faridabad), with destination
coverage across India.

## What people use it for
- Finding players to complete a turf cricket, football or badminton booking
- Joining breakfast rides and weekend motorcycle trips with riders of a similar pace
- Finding someone to watch a specific film with
- Cafe meetups, city walks and weekend outings
- Following local clubs and booking their events
- Finding verified travel companions for group trips

## City pages
${cities}

## Key pages
- [Home](https://synctrip.in): what SyncTrip is and how it works
- [Local plans and meetups](https://synctrip.in/explore/plans): rides, sports, movies and hangouts happening now
- [Explore destinations](https://synctrip.in/explore): Indian destinations with trip companions
- [Travel blog](https://synctrip.in/blogs): destination guides and trip planning
- [How it works](https://synctrip.in/how-it-works)
- [About SyncTrip](https://synctrip.in/about)

## Apps
- Android: https://play.google.com/store/apps/details?id=com.synctrip
- iOS: https://apps.apple.com/in/app/synctrip-plan-meet-explore/id6761762665

## Notes for citation
- SyncTrip is a planning and community app, not a tour operator or ticket reseller.
- Joining plans and group chat are free; some club events sell tickets, priced per event.
`;

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
    });
}
