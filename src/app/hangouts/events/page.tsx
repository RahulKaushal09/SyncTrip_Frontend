import type { Metadata } from "next";
import { getActiveCities, getClubEvents, getClubs } from "../_lib/api";
import { categoryUrl, SITE } from "../_lib/links";
import EventsBrowser from "./EventsBrowser";
import { CategoryFooter, Faq, Final, Highlight, IBox, Ico, Nav } from "../_components/Shell";

export const revalidate = 600;

const TITLE = "SyncTrip Events · Board game nights, sports, trips & socials near you";
const DESCRIPTION =
  "Things to do this week in Chandigarh, Delhi, Gurugram and Noida. Events hosted by verified clubs on SyncTrip. Book in a tap and chat with everyone before you go.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: categoryUrl("events") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: categoryUrl("events"), siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: "https://synctrip.in/og-home.png" }] },
};

const clubActivity = (a: unknown, fallback?: string) =>
  (typeof a === "string" ? a : (a as { label?: string } | undefined)?.label || fallback || "").replace(/_/g, " ");

export default async function EventsPage() {
  const [allEvents, cities, clubs] = await Promise.all([getClubEvents(60), getActiveCities(), getClubs(20)]);

  // Only active cities (CityModel.isActive). Chandigarh first, the rest as the backend orders them.
  const active = [...cities].sort((a, b) => (a.title === "Chandigarh" ? -1 : b.title === "Chandigarh" ? 1 : 0));
  const activeIds = new Set(active.map((c) => c.id));
  const events = activeIds.size ? allEvents.filter((e) => !e.venue?.cityId || activeIds.has(e.venue.cityId)) : allEvents;
  const covers = events.filter((e) => e.coverImageUrl).slice(0, 3);
  const fallback = [
    ["/home/real-boardgame-cafe.webp", "Board game night"],
    ["/home/real-roundtable.webp", "Social meetup"],
    ["/home/real-cardgame.webp", "Card games"],
  ];
  const cityNames = active.map((c) => c.title.replace("-NCR", "")).join(", ");

  return (
    <div className="stl p-events" id="top">
      <Nav category="events" cta="See events" links={[["#whats-on", "What's on"], ["#clubs", "Clubs"], ["#faq", "FAQ"], [`${SITE}/for-clubs`, "For clubs"]]} />

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="chip"><img src="/hangouts/icons/clubsIcon.png" alt="" />Hosted by verified clubs</span>
            <h1>Something fun,<br /><Highlight color="#EC4899">every week.</Highlight></h1>
            <p className="lead">Board game nights, sports mornings, trips and socials{cityNames ? ` in ${cityNames}` : ""}. Book in a tap, then chat with everyone before you go. Most people come alone.</p>
            <div className="hero-ctas">
              <a className="sbtn sbtn-primary" href="#whats-on">See what&apos;s on</a>
              <a className="sbtn sbtn-light" href={`${SITE}/for-clubs`}>Run a club? Host here</a>
            </div>
            <div className="proof">
              <div className="faces">
                {[["/home/real-boardgame-cafe.webp", "30% 40%"], ["/home/real-roundtable.webp", "40% 30%"], ["/home/real-dinner.webp", "75% 45%"], ["/home/real-cardgame.webp", "50% 40%"]].map(([src, pos]) => (
                  <span key={src} style={{ backgroundImage: `url(${src})`, backgroundPosition: pos }} />
                ))}
              </div>
              <div>Real people at <b>SyncTrip club events</b></div>
            </div>
          </div>
          <div className="collage">
            {[0, 1, 2].map((i) => {
              const e = covers[i];
              return (
                <div key={i} className={`cv cv${i + 1}`} style={{ backgroundImage: `url('${e?.coverImageUrl || fallback[i][0]}')` }}>
                  <span>{e?.title || fallback[i][1]}</span>
                </div>
              );
            })}
            <div className="booked"><IBox name="i-ticket" /><div><b>You&apos;re booked!</b><small>Event chat is open in the app</small></div></div>
          </div>
        </div>
      </header>

      <section id="whats-on">
        <div className="wrap">
          <div className="head-row">
            <div>
              <div className="eyebrow">What&apos;s on</div>
              <h2 className="h2">Upcoming events</h2>
              <p className="sub">Live from SyncTrip. Tap any event to see details and book.</p>
            </div>
            <span className="live light"><i />Updated live</span>
          </div>
          <EventsBrowser events={events} cities={active} />

          <div className="why">
            <div><IBox name="i-verified" /><h3>Verified clubs</h3><p>Every club is checked by SyncTrip before its events go live.</p></div>
            <div><IBox name="i-chat" /><h3>Chat before you go</h3><p>Every event has a group chat, so you know faces before you arrive.</p></div>
            <div><IBox name="i-users" tone="pink" /><h3>Great alone</h3><p>Most people come solo. Hosts make sure everyone gets included.</p></div>
            <div><IBox name="i-qr" tone="green" /><h3>Ticket in your phone</h3><p>Pay with UPI or card. Your QR ticket lives in the SyncTrip app.</p></div>
          </div>
        </div>
      </section>

      {clubs.length > 0 && (
        <section id="clubs" className="clubs-wrap">
          <div className="wrap">
            <div className="eyebrow">Clubs on SyncTrip</div>
            <h2 className="h2">The people behind the plans.</h2>
            <p className="sub">Follow a club in the app to hear about their next event first.</p>
            <div className="crail">
              {clubs.map((c) => (
                <a key={c.id} className="cc" href={`${SITE}/share/club/${encodeURIComponent(c.slug || c.id)}`}>
                  <div className="cb" style={c.coverImageUrl ? { backgroundImage: `url('${c.coverImageUrl}')` } : undefined} />
                  <div className="ci">
                    <img src={c.logoUrl || "/hangouts/img/logo.png"} alt="" />
                    <b><span>{c.name}</span>{c.isVerified && <Ico name="i-verified" />}</b>
                    <p>{c.tagline}</p>
                    <div className="act">{clubActivity(c.activity, c.category)}</div>
                  </div>
                </a>
              ))}
            </div>
            <div className="host">
              <div><h3>Run a club or community?</h3><p>Sell tickets, run passes and early-bird prices, and get a group chat for every event. Free to start.</p></div>
              <a className="sbtn sbtn-primary" href={`${SITE}/for-clubs`}>Host on SyncTrip</a>
            </div>
          </div>
        </section>
      )}

      <Faq items={[
        ["Who hosts these events?", "Clubs on SyncTrip: board game groups, running clubs, sports clubs and community organisers. Every club is verified before its events go live."],
        ["Can I go alone?", "Yes. Most people at SyncTrip club events come on their own, and every event has a group chat in the app so you can say hello before you arrive."],
        ["How do I book a ticket?", "Open the event and book on the website or in the SyncTrip app. Pay with UPI, card or wallet. Your QR ticket and the event chat are in the app."],
        ["Can I cancel?", "Each club sets its own refund policy, shown on the event before you pay. If a club cancels, you always get a full refund."],
      ]} />

      <Final title={<>Your next plan<br />is already on.</>} text="Pick an event, book in a tap, and say hi in the chat before you go." cta="See what's on" href="#whats-on" />
      <CategoryFooter current="events" blurb="Meet new people at fun plans every week." />
    </div>
  );
}
