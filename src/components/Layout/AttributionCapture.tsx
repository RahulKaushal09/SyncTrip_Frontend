"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureWebAttribution } from "@/utils/webAttribution";

/**
 * Records where a visitor came from (utm_*, fbclid, gclid, referrer) on
 * whatever page they land on, not just event pages. Someone who arrives on
 * /events or a city guide from an Instagram ad and clicks through to an event
 * keeps that ad as their source when they book. Renders nothing.
 */
export default function AttributionCapture() {
  const pathname = usePathname();
  useEffect(() => {
    captureWebAttribution();
  }, [pathname]);
  return null;
}
