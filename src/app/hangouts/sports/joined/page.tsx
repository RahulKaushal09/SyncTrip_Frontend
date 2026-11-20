import type { Metadata } from "next";
import Joined from "../../_components/Joined";

export const metadata: Metadata = { title: { absolute: "You're in · SyncTrip" }, robots: { index: false, follow: false } };

type Params = Promise<{ when?: string; where?: string; pass?: string }>;

export default async function JoinedPage({ searchParams }: { searchParams: Params }) {
  const q = await searchParams;
  const clip = (v?: string) => (typeof v === "string" ? v.slice(0, 80) : undefined);
  return <Joined category="sports" when={clip(q.when)} where={clip(q.where)} pass={clip(q.pass)} />;
}
