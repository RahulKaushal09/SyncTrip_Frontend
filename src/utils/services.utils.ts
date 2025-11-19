
export class CommonServices {
    static formatDateShortHeaderTripSelection(startDate: string, endDate: string): string {
        const d = new Date(startDate);
        const e = new Date(endDate);
        const day = d.getDate();
        const startMonthName = d.toLocaleString("en-GB", { month: "short" });
        const endMonthName = e.toLocaleString("en-GB", { month: "short" });
        const endDay = e.getDate();
        const year = d.getFullYear();
        return `${day} ${startMonthName} - ${endDay} ${endMonthName}, ${year}`;
    }

    static customSlugify = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")  // Remove special characters
            .replace(/\s+/g, "-")          // Replace spaces with hyphens
            .replace(/-+/g, "-");          // Replace multiple hyphens with single
    };
    static formatRange(s: string, e: string) {
        if (!s || !e) return "";
        try {
            const sd = new Date(s);
            const ed = new Date(e);
            const optsMonthDay: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
            const year = ed.getFullYear();
            const left = sd.toLocaleDateString(undefined, optsMonthDay);
            const right =
                // sd.getMonth() === ed.getMonth() && sd.getFullYear() === ed.getFullYear()
                //     ? ed.getDate().toString()
                //     : 
                ed.toLocaleDateString(undefined, optsMonthDay);
            return `${left} to ${right}, ${year}`;
        } catch {
            return `${s} to ${e}`;
        }
    }
    static convertLongBestTimeNameToShortNotations = (bestTime: string): string => {
        if (!bestTime) return 'N/A';

        const bestTimeMap: Record<string, string> = {
            'January': 'Jan',
            'February': 'Feb',
            'March': 'Mar',
            'April': 'Apr',
            'May': 'May',
            'June': 'Jun',
            'July': 'Jul',
            'August': 'Aug',
            'September': 'Sep',
            'October': 'Oct',
            'November': 'Nov',
            'December': 'Dec',
        };

        // For long text or comma-separated values, convert months to short form
        if (bestTime.length > 20 || bestTime.includes(',') || bestTime.includes(';')) {
            return bestTime.split(' ').map((word) => {
                const containsSeparator = word.includes(',') || word.includes(';');
                const cleanWord = word.replace(/[,;]/g, '');

                if (bestTimeMap[cleanWord]) {
                    return bestTimeMap[cleanWord] + (containsSeparator ? ' & ' : '');
                } else {
                    return word + (containsSeparator ? ' & ' : '');
                }
            }).join(' ');
        }

        return bestTime;
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