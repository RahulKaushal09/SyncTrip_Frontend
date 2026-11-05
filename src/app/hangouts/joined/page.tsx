import type { Metadata } from "next";
import Joined from "../_components/Joined";

export const metadata: Metadata = { title: { absolute: "You're in · SyncTrip" }, robots: { index: false, follow: false } };

export default function JoinedPage() {
  return <Joined category="hangouts" />;
}
