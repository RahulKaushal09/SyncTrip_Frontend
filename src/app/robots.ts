import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/', '/blogs/', '/explore/', '/about', '/location/', '/city/', '/share/', '/how-it-works'],
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
                    // Per-user share targets. The club / club-event / mega-event
                    // share pages ARE public and indexable; these two are not.
                    '/share/user/',
                    '/share/chat/',
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