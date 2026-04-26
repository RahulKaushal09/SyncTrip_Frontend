import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = 'https://synctrip.in'

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
        locationUrls = slugs.map(slug => ({
            url: `${base}/location/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }))
    } catch { }

    return [
        { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
        { url: `${base}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${base}/explore/plans`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${base}/blogs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
        { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
        ...blogUrls,
        ...locationUrls,
    ]
}