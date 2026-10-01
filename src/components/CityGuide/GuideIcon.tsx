import React from "react";
import {
  Activity, CalendarDays, Coffee, Footprints, Gamepad2, Mountain, Music, Palette, Sparkles, Trophy, Zap,
} from "lucide-react";

/** Icon names used by cityGuides.ts. Safe to import from server and client components. */
const GUIDE_ICONS: Record<string, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  Zap, Coffee, Music, Gamepad2, Activity, Trophy, CalendarDays, Palette, Footprints, Mountain, Sparkles,
};

export default function GuideIcon({ name, size = 20 }: { name: string; size?: number }) {
  const Icon = GUIDE_ICONS[name] || Sparkles;
  return <Icon size={size} aria-hidden />;
}
