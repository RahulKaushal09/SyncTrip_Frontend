
export class CommonServices {
    static customSlugify = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")  // Remove special characters
            .replace(/\s+/g, "-")          // Replace spaces with hyphens
            .replace(/-+/g, "-");          // Replace multiple hyphens with single
    };

    static generateLocationSlug = (uuid: string, title: string, places: string, country: string) => {
        const maxTotalLength = 75;
        if (title.length > 15 && title.split(' ').length > 1) {
            title = title.split(' ')[0];
        }

        const slug = CommonServices.customSlugify(title);
        const combined = `${uuid}_${slug}-${places}-places-to-visit-in-${country}`;

        if (combined.length > maxTotalLength) {
            const allowedSlugLength = maxTotalLength - uuid.length - 1;
            return `${combined.slice(0, allowedSlugLength)}`;
        }

        return combined;
    };
    static generateTripSlug = (uuid: string, title: string) => {
        const maxTotalLength = 75;
        if (title.length > 15 && title.split(' ').length > 1) {
            title = title.split(' ')[0];
        }

        const slug = CommonServices.customSlugify(title);
        const combined = `${uuid}_${slug}-trip-in-India`;

        if (combined.length > maxTotalLength) {
            const allowedSlugLength = maxTotalLength - uuid.length - 1;
            return `${combined.slice(0, allowedSlugLength)}`;
        }

        return combined;
    }
}