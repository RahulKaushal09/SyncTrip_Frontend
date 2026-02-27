// utils/gumletLoader.ts
const GUMLET_HOST = "synctrip.gumlet.io";
const ORIGIN_HOSTS = [
    "synctrip.in",
    "www.synctrip.in",
    "synctrip-image-storage.s3.amazonaws.com",
];

export default function gumletLoader({ src, width, quality }: { src: string, width: number, quality?: number }) {
    if (!src) return "";

    let uri = src;
    try {
        const hostname = new URL(src).hostname;
        const matchedHost = ORIGIN_HOSTS.find((h) => hostname === h);

        if (matchedHost) {
            uri = matchedHost !== ORIGIN_HOSTS[2]
                ? src.replace(`${matchedHost}/AllImages`, GUMLET_HOST)
                : src.replace(matchedHost, GUMLET_HOST);
        }

        const params = `w=${width}&q=${quality || 85}&format=auto&fit=crop&sharp=1`;
        return uri.includes("?") ? `${uri}&${params}` : `${uri}?${params}`;
    } catch {
        return src;
    }
}