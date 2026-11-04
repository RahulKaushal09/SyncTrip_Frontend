"use client";
import { useEffect } from "react";
import apiClient from "@/utils/apiClient";
import { setClubPixel } from "@/utils/adTracking";

/**
 * On a club event's pages: load that club's own Meta Pixel (if it connected
 * one in the SyncTrip panel) so PageView / ViewContent / InitiateCheckout /
 * Purchase also reach the club's ads. Off again when the page goes away.
 * Any failure just means no club pixel - never affects the page.
 */
export function useClubPixel(event: { id: string; title?: string; price?: number } | null | undefined) {
  const id = event?.id;
  useEffect(() => {
    if (!id) return undefined;
    let alive = true;
    apiClient
      .get<{ pixelId?: string | null }>(`/club-events/${encodeURIComponent(id)}/ad-pixel`)
      .then((res) => {
        const pixelId = res.data?.pixelId;
        if (alive && pixelId) setClubPixel(pixelId, { eventId: id, title: event?.title || "", price: Number(event?.price) || 0 });
      })
      .catch(() => { /* no club pixel */ });
    return () => { alive = false; setClubPixel(null); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
}
