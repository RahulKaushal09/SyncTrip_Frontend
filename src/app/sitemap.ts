import { MetadataRoute } from 'next'
import { CITY_PAGES } from '@/data/cityPages'
import { CITY_GUIDES, MIN_INDEXABLE_VENUES } from '@/data/cityGuides'
import { getCityVenues, venuesForGuide } from '@/lib/cityGuideApi'

const base = 'https://synctrip.in'

/**
 * Indian states and union territories, as they appear at the end of a location
 * slug ("things-to-do-in-udaipur-rajasthan").
 *
 * The backend serves ~776 location slugs, of which roughly 300 are outside
 * India — Basel, Pigeon Forge, the Solomon Islands. A domain this young cannot
 * spend its crawl budget proving it has a thin page about Fort Worth, and those
 * pages carry `noindex` in the route itself, so listing them in the sitemap
 * would only ask Google to crawl something we then tell it to drop.
 */
const INDIAN_REGIONS = [
    'andhra-pradesh', 'arunachal-pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat',
    'haryana', 'himachal-pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya-pradesh',
    'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
    'rajasthan', 'sikkim', 'tamil-nadu', 'telangana', 'tripura', 'uttar-pradesh', 'uttarakhand',
    'west-bengal', 'delhi', 'jammu-and-kashmir', 'ladakh', 'puducherry', 'chandigarh',
    'andaman-and-nicobar-islands', 'lakshadweep', 'dadra-and-nagar-haveli', 'daman-and-diu',
    'india',
]

const isIndianSlug = (slug: string) =>
    INDIAN_REGIONS.some((region) => slug.endsWith(`-${region}`))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch blog slugs
    let blogUrls: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/blogs/slugs`, { cache: 'force-cache' })
        const slugs: string[] = await res.json()
        blogUrls = slugs.map(slug => ({
            url: `${base}/blogs/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }))
    } catch { }

    // Fetch location slugs
    let locationUrls: MetadataRoute.Sitemap = []
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/locations/slugs`, { cache: 'force-cache' })
        const slugs: string[] = await res.json()
        locationUrls = slugs
            .filter(isIndianSlug)
            .map(slug => ({
                url: `${base}/location/${slug}`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
            }))
    } catch { }

    // Delhi NCR launch cluster - the pages we are actively trying to rank.
    const cityUrls: MetadataRoute.Sitemap = CITY_PAGES.map(city => ({
        url: `${base}/city/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.9,
    }))

    // City guides: hub + activity pages. Activity pages only once they have enough
    // venues to be worth indexing (same rule as their robots meta).
    const guideUrls: MetadataRoute.Sitemap = []
    for (const guide of CITY_GUIDES) {
        guideUrls.push({ url: `${base}/city/${guide.citySlug}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 })
        const venues = await getCityVenues(guide.citySlug).catch(() => [])
        for (const activity of guide.activities) {
            if (venuesForGuide(venues, activity).length < MIN_INDEXABLE_VENUES) continue
            guideUrls.push({ url: `${base}/city/${guide.citySlug}/${activity.slug}`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 })
        }
    }

    return [
        { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${base}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/explore/plans`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        ...cityUrls,
        ...guideUrls,
        { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
        { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        ...blogUrls,
        ...locationUrls,
    ]
}
