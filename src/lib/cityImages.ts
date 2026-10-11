/**
 * City photos from the backend `cities.imageUrl` (the same images the app shows),
 * served and resized by Gumlet. If a city photo is replaced in the panel its file id
 * changes, so update it here.
 */
const CITY_IMAGE_IDS: Record<string, { id: string; alt: string }> = {
  chandigarh: { id: "3e3a15a4-b7db-4e21-9793-0893f5cf052e", alt: "Open Hand monument, Chandigarh" },
  gurgaon: { id: "7b4eb1dc-f1c8-48ab-9c23-420eb00bb486", alt: "Gurugram skyline and traffic on the expressway" },
  delhi: { id: "ccb264d4-ed82-4033-8046-9424a6503a4b", alt: "India Gate, New Delhi, at sunset" },
  noida: { id: "d7756f45-1d1b-4ec6-ad10-acc743cbb5f0", alt: "Noida city skyline at night" },
};

export function cityImage(slug: string, width = 1600): { src: string; alt: string } | null {
  const c = CITY_IMAGE_IDS[slug];
  return c ? { src: `https://synctrip.gumlet.io/compressed/cities/${c.id}.jpg?w=${width}&format=auto`, alt: c.alt } : null;
}

/** Absolute URL for an image src that may be site-relative ("/city-guides/…") or already absolute. */
export const absImage = (src: string) => (/^https?:\/\//.test(src) ? src : `https://synctrip.in${src}`);
