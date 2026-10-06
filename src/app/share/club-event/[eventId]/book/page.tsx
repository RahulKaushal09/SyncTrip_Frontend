import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClubBookingPage from "@/components/Share/ClubBookingPage";
import { ClubApiService } from "@/utils/club.api.utils";

/**
 * /share/club-event/:eventId/book - the booking page (tickets, the club's
 * questions, your details, OTP, payment). A full page rather than a modal:
 * pass events have too much to choose for an overlay. Not indexed - the
 * event page is the one to find.
 */

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ eventId: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { eventId } = await params;
  const event = await ClubApiService.getClubEvent(eventId);
  return {
    title: event ? `Book · ${event.title} | SyncTrip` : "Book | SyncTrip",
    robots: { index: false, follow: false },
  };
}

export default async function BookClubEventPage({ params }: PageProps) {
  const { eventId } = await params;
  const event = await ClubApiService.getClubEvent(eventId);
  if (!event) notFound();
  return <ClubBookingPage event={event} />;
}
