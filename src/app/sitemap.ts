import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://synctrip.in/',
            lastModified: new Date('2025-07-07'),
            priority: 1.0,
        },
        // add more URLs as needed
    ];
}