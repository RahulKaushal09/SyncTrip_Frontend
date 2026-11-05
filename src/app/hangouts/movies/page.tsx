import type { Metadata } from "next";
import { getActiveMovies, portrait } from "../_lib/api";
import { categoryUrl } from "../_lib/links";
import { MoviePicksProvider, ShowingRail } from "../_components/MoviePicks";
import JoinWizard from "../_components/JoinWizard";
import {
  CategoryFooter, Faq, Final, Highlight, Included, JoinAside, Nav, PriceCards, Proof, SafetyGrid, Steps, WOMEN_SAFETY,
} from "../_components/Shell";

export const revalidate = 600;

const TITLE = "SyncTrip Movies · Watch together, meet new people in Chandigarh";
const DESCRIPTION =
  "Pick the movies you'd watch and the days you're free. SyncTrip makes a group of 4-6 people in Chandigarh, Mohali & Panchkula, books your seats together, and opens your group chat.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: categoryUrl("movies") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: categoryUrl("movies"), siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: "https://synctrip.in/og-home.png" }] },
};

export default async function MoviesPage() {
  const movies = await getActiveMovies();
  const [heroA, heroB] = movies;

  return (
    <div className="stl p-movies" id="top">
      <Nav category="movies" cta="Find my group" links={[["#showing", "Now showing"], ["#how", "How it works"], ["#pricing", "Pricing"], ["#safety", "Safety"], ["#faq", "FAQ"]]} />

      <MoviePicksProvider movies={movies}>
        <header className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="chip"><img src="/hangouts/icons/movieIcon.png" alt="" />Movie nights in Chandigarh · Mohali · Panchkula</span>
              <h1>Watch together.<br />Meet <Highlight color="#3ABEF5">new people.</Highlight></h1>
              <p className="lead">Pick the movies you&apos;d watch and the days you&apos;re free. We&apos;ll make a group of 4-6 people near you, book your seats together, and open your group chat on SyncTrip.</p>
              <div className="hero-ctas">
                <a className="sbtn sbtn-primary" href="#join">Find my movie group</a>
                <a className="sbtn sbtn-light" href="#showing">See what&apos;s showing</a>
              </div>
              <Proof>Real people from <b>SyncTrip meetups</b> in Tricity</Proof>
            </div>
            <div className="visual">
              <div className="photo" style={{ backgroundImage: "url(/hangouts/img/movieMela.jpg)", backgroundPosition: "center 70%" }} />
              {heroB && <div className="poster pb"><img src={portrait(heroB.image, 300, 400)} alt={heroB.title} /></div>}
              {heroA && <div className="poster pa"><img src={portrait(heroA.image, 300, 400)} alt={heroA.title} /></div>}
              <div className="stoast t1"><img src="/hangouts/icons/communityIcon.png" alt="" /><div><b>Your group is ready</b>Say hi before the show</div></div>
              <div className="stoast t2"><img src="/hangouts/icons/verifiedBadge.png" alt="" /><div><b>Everyone&apos;s verified</b>Phone + selfie check</div></div>
              <div className="group-card">
                <div className="gc-head">
                  {heroA && <img src={portrait(heroA.image, 120, 120)} alt="" />}
                  <div><b>{heroA?.title || "Saturday night show"}</b><small>Saturday · 7:15 pm</small></div>
                </div>
                <div className="gc-rows"><div>Cinema<b>Elante, Chd</b></div><div>Seats<b>Row F · 7-12</b></div></div>
                <div className="gc-foot">
                  <div className="faces">
                    <span style={{ background: "#3ABEF5" }}>A</span><span style={{ background: "#EC4899" }}>S</span>
                    <span style={{ background: "#16324F" }}>R</span><span style={{ background: "#2B9A66" }}>K</span>
                    <span style={{ background: "#F8FAFC", color: "#0D344B", borderColor: "#fff" }}>+2</span>
                  </div>
                  <span className="open">Open chat →</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div id="showing" className="showing">
          <div className="wrap">
            <div className="head-row">
              <div>
                <div className="eyebrow">Now showing</div>
                <h2 className="h2">Which ones would you watch?</h2>
                <p className="sub">Tap every movie you&apos;re up for. We&apos;ll match you with people who picked the same.</p>
              </div>
              <span className="live"><i />Live from the SyncTrip app</span>
            </div>
          </div>
          <ShowingRail />
        </div>

        <Steps items={[
          ["movieIcon", "Pick movies & days", "Choose the films you'd watch and when you're free. Add a backup day to get matched faster."],
          ["vibe-Friendly", "Tell us about you", "Where you'll come from, your name and birthday. Takes a minute."],
          ["communityIcon", "We make your group", "Once 4-6 people fit, we pick the cinema and show near you and book your seats together."],
          ["outingIcon", "Chat, watch, chai", "Your group chat opens in the SyncTrip app. Meet at the cinema, grab chai after."],
        ]} />

        <section className="real">
          <div className="wrap">
            <div className="eyebrow">Real SyncTrip people</div>
            <h2 className="h2">Strangers at 7. Friends by the interval.</h2>
            <p className="sub">These are real SyncTrip meetups in Tricity. Movies are the easiest way to start: no pressure to talk for two hours, and plenty to talk about after.</p>
            <div className="real-grid">
              <figure className="tall" style={{ backgroundImage: "url(/home/real-roundtable.webp)" }}><figcaption><img src="/hangouts/icons/clubsIcon.png" alt="" />SyncTrip meetup, Chandigarh</figcaption></figure>
              <figure style={{ backgroundImage: "url(/home/real-dinner.webp)" }}><figcaption><img src="/hangouts/icons/outingIcon.png" alt="" />Dinner after a SyncTrip plan</figcaption></figure>
              <div className="appcard">
                <div>
                  <h3>Your group lives in the app</h3>
                  <p>Group chat, show details, seat numbers, and the people you met, all in one place.</p>
                  <div className="store"><a href="https://synctrip.in">Google Play</a><a href="https://synctrip.in">App Store</a></div>
                </div>
                <div className="phone"><img src="/home/app-home.webp" alt="SyncTrip app home screen" /></div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing">
          <div className="wrap" style={{ textAlign: "center" }}>
            <div className="eyebrow">Pricing</div>
            <h2 className="h2">Your movie ticket is included.</h2>
            <p className="sub" style={{ margin: "0 auto" }}>You pay us once. We buy the tickets for the whole group, so you never book anything yourself.</p>
            <Included items={[
              { icon: "i-ticket", label: "Movie ticket" },
              { icon: "i-court", label: "Seats next to your group" },
              { icon: "i-users", label: "A matched group of 4-6" },
              { icon: "i-chat", label: "Group chat on SyncTrip" },
              { icon: "i-clock", label: "Popcorn & chai: pay your own", off: true },
            ]} />
            <PriceCards
              note="Tickets are standard 2D seats at the multiplex we pick near your group. IMAX/recliner cost extra. The Ladies' Pass needs a verified profile."
              cards={[
                { pass: "solo", name: "Solo Pass", badge: "Most booked", amount: "₹449", unit: "/ person", fine: "Come alone, we'll put you in a group.", payIcon: "i-ticket", payLine: <><b>1 ticket included</b> in ₹449</>, bullets: ["Your movie ticket, booked by us", "Seated with your group", "Group chat before the show"], cta: "Choose Solo" },
                { pass: "ladies", ladies: true, name: "Ladies' Pass", badge: "Free ticket", amount: "₹99", unit: "refundable", fine: "Your ticket is free. The ₹99 is a holding deposit so seats don't go empty.", payIcon: "i-refund", payLine: <><b>₹99 comes back</b> as SyncTrip credit when you show up</>, bullets: ["Free movie ticket, booked by us", "Never the only woman in a group", "Women-only groups if you prefer"], cta: "Claim free ticket" },
                { pass: "duo", name: "Duo Pass", badge: "You + a friend", amount: "₹799", unit: "for 2 people", fine: "Bring a friend. You two join a group together.", payIcon: "i-ticket", payLine: <><b>2 tickets included</b> · ₹400 each</>, bullets: ["Tickets for you and your friend", "You sit next to each other", "Easiest way to try it the first time"], cta: "Choose Duo" },
              ]}
            />
          </div>
        </section>

        <SafetyGrid eyebrow="Safety" title="Built so everyone feels comfortable." sub="If it feels safe for her, it's better for everyone." items={WOMEN_SAFETY} />

        <section id="join">
          <div className="wrap join-grid">
            <JoinAside eyebrow="Join the next group" title="2 minutes, then we take it from here." last={["i-bell", "Get your ticket", "Seat details and the ticket arrive in the app."]} />
            <JoinWizard variant="movies" />
          </div>
        </section>
      </MoviePicksProvider>

      <Faq items={[
        ["Is this a dating app?", "No. It's a way to make new friends in Tricity over a movie. Groups are 4-6 people, matched on movies, languages, age and where you live."],
        ["When will I know my group?", "Usually within 3-5 days. You'll get a notification and your group chat opens in the SyncTrip app with the movie, cinema, show time and seats."],
        ["How do I get my ticket?", "We book seats for the whole group together and send your ticket to the BookMyShow app on your phone number. Your seat number shows in SyncTrip too."],
        ["How does the Ladies' Pass work?", "Your ticket is free and we book it for you. You pay a ₹99 holding deposit so seats don't go empty. When you check in with your group, the ₹99 comes back as SyncTrip credit."],
        ["What if you can't find my group?", "If we can't match you within 14 days, you get a full refund. You can also cancel any time before you're matched."],
      ]} />

      <Final title={<>Your next movie night<br />is one tap away.</>} text="Pick your movies and days. We'll handle the group, the seats and the chat." cta="Find my movie group" />
      <CategoryFooter current="movies" blurb="Meet new people at fun plans every week in Chandigarh, Mohali & Panchkula." />
    </div>
  );
}
