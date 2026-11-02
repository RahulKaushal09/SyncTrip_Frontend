/** Cities SyncTrip clubs run events in, and how an event is placed in one. */

export type CityKey = "chandigarh" | "delhi" | "gurgaon" | "noida";

export const CITIES: Record<CityKey, { name: string; lat: number; lng: number; words: RegExp }> = {
  chandigarh: { name: "Chandigarh", lat: 30.7333, lng: 76.7794, words: /chandigarh|mohali|panchkula|zirakpur|kharar/i },
  delhi: { name: "Delhi", lat: 28.6139, lng: 77.209, words: /delhi|dwarka|saket|rohini|malviya|hauz khas|connaught|mayur vihar|pitampura|janakpuri/i },
  gurgaon: { name: "Gurgaon", lat: 28.4595, lng: 77.0266, words: /gurgaon|gurugram/i },
  noida: { name: "Noida", lat: 28.5355, lng: 77.391, words: /noida|greater noida/i },
};

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/** Nearest city within 45 km of the venue, else a name match on the venue text. */
export function cityOf(e: { lat: number | null; lng: number | null; venueName?: string | null; locality?: string | null }): CityKey | null {
  if (e.lat != null && e.lng != null) {
    let best: CityKey | null = null;
    let bestKm = 45;
    (Object.keys(CITIES) as CityKey[]).forEach((k) => {
      const km = distanceKm({ lat: e.lat!, lng: e.lng! }, CITIES[k]);
      if (km < bestKm) {
        best = k;
        bestKm = km;
      }
    });
    if (best) return best;
  }
  const text = `${e.venueName ?? ""} ${e.locality ?? ""}`;
  return (Object.keys(CITIES) as CityKey[]).find((k) => CITIES[k].words.test(text)) ?? null;
}
