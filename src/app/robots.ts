import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/blogs/', '/explore/', '/about', '/location/'],
                disallow: [
                    '/create/',
                    '/hostedTrips',
                    '/notifications',
                    '/chats',
                    '/user/',
                    '/userTrip/',
                    '/userTrips/',
                    '/trips/',
                    '/api/',
                    '/checkout',
                ],
            },
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'OAI-SearchBot', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'GoogleExtended', allow: '/' },
            { userAgent: 'Applebot-Extended', allow: '/' },
        ],
        sitemap: 'https://synctrip.in/sitemap.xml',
    }
}