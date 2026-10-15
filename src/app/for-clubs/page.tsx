import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import {
  ArrowRight, BadgeCheck, CalendarPlus, Check, MessageCircle, QrCode, ScanLine, Search, Share2,
  Star, Ticket, Users, Wallet, X,
} from "lucide-react";
import { cityImage } from "@/lib/cityImages";
import home from "@/components/HomeV3/HomeV3.module.css";
import ScrollReveal from "@/components/HomeV3/ScrollReveal";
import WordCycle from "@/components/HomeV3/WordCycle";
import CountUp from "@/components/ForClubs/CountUp";
import s from "@/components/ForClubs/ForClubs.module.css";

/**
 * Static pitch page for club and community owners: why list on SyncTrip and use it as the booking
 * platform. Built from the homepage's own styles (HomeV3.module.css) plus ForClubs.module.css; no data
 * fetching, no changes to existing code. Meant to also be served at host.synctrip.in later.
 *
 * Until the apply form exists (CLUB_PANEL_WEB_APP_PLAN.md §3, /club/apply), the CTA opens an email.
 * Change APPLY_HREF in one place when it does.
 */

const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["800"], variable: "--font-home-display", display: "swap" });

const APPLY_HREF =
  "mailto:synctripofficial@gmail.com?subject=List%20my%20club%20on%20SyncTrip&body=Club%20name%3A%0AFounder%20name%3A%0AFounder%20phone%20number%3A%0ACity%3A%0AWhat%20you%20host%3A%0AInstagram%20or%20WhatsApp%20community%20link%3A%0AHow%20many%20events%20a%20month%3A";

const TITLE = "Free Booking Platform for Clubs & Event Hosts | Zero Fees | SyncTrip";
const DESCRIPTION =
  "Take event bookings and check guests in by QR with zero fees for clubs and no payment gateway of your own. SyncTrip is the free booking platform for clubs, communities and event hosts in Gurgaon, Delhi NCR and Chandigarh.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "https://synctrip.in/for-clubs" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://synctrip.in/for-clubs",
    siteName: "SyncTrip",
    locale: "en_IN",
    type: "website",
    images: [{ url: "https://synctrip.in/og-home.png", alt: "SyncTrip for clubs: a free booking platform with zero fees for clubs" }],
  },
  twitter: { card: "summary_large_image", site: "@synctrip44398", title: TITLE, description: DESCRIPTION, images: ["https://synctrip.in/og-home.png"] },
  robots: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
};

/** Community numbers. Keep these true: update here when they change (user base and MAU come from the admin panel). */
const STATS = [
  { to: 9000, suffix: "+", label: "People on SyncTrip", note: "and growing every week" },
  { to: 1000, suffix: "+", label: "Active every month", note: "people making real plans" },
  { to: 4, suffix: "", label: "Cities live", note: "Gurgaon · Delhi · Noida · Chandigarh" },
  { to: 4.8, decimals: 1, suffix: "★", label: "On Google Play", note: "rated by app users" },
];

const STRIP = [
  { icon: Wallet, title: "Zero fees for clubs", text: "No commission, nothing deducted" },
  { icon: BadgeCheck, title: "No gateway for you", text: "Paid within 1–2 working days of your event" },
  { icon: ScanLine, title: "QR check-in", text: "Scan tickets at the door" },
  { icon: MessageCircle, title: "Community chat", text: "Your members stay with you" },
];

const PAINS = [
  { tag: "Today", title: "Bookings buried in WhatsApp", text: "\"Is there a seat left?\" \"Did you get my payment?\" Forty messages for one event.", fix: "One booking page, live seat count, tickets issued automatically." },
  { tag: "Today", title: "No idea who is actually coming", text: "Names in chats, screenshots in DMs, a list on paper. On the day, nobody is sure who booked.", fix: "Every booking in one attendee list, each with its own ticket code." },
  { tag: "Today", title: "Booking tools that take a cut", text: "Gateway setup, approvals, and a percentage off every ticket, even for a 20-person meetup.", fix: "Zero fees for clubs and no gateway of your own. We collect, you get paid within 1–2 working days of the event." },
];

const BENEFITS = [
  { icon: Wallet, title: "Zero fees for clubs", text: "No commission, no monthly plan and nothing deducted from your earnings. Hosting on SyncTrip costs your club nothing." },
  { icon: BadgeCheck, title: "We handle the payments", text: "No payment gateway account of your own to open. We collect from attendees and transfer your earnings within 1–2 working days of the event." },
  { icon: Ticket, title: "Proper online booking", text: "Seats, ticket types and a live count. Free RSVP or ticketed, you choose per event." },
  { icon: Share2, title: "A link you can share", text: "Every event gets its own page for Instagram and WhatsApp, so people can book from the link." },
  { icon: ScanLine, title: "Door check-in", text: "Each ticket has a QR. Scan it at the entrance and see who showed up, live." },
  { icon: MessageCircle, title: "Keep your community", text: "Attendees can join your club's chat after the event, so the group stays together." },
  { icon: Users, title: "Team access", text: "Add co-hosts and door volunteers with limited roles, so everyone can help without full access." },
  { icon: Search, title: "A community to be part of", text: "SyncTrip is full of people looking for plans. Your events are visible to them. No promises, just a good room to be in." },
];

const STEPS = [
  { title: "Apply", text: "Tell us about your club and what you host. Takes a few minutes." },
  { title: "Get verified", text: "We check your club so attendees can trust the Verified badge." },
  { title: "Create your event", text: "Add photos, date, venue, seats and price. Publish when it looks right." },
  { title: "Host, then get paid", text: "Bookings come in and you scan tickets at the door. Within 1–2 working days of your event, your earnings are transferred to you." },
];

type Cmp = { what: string; them: string; us: string };
const COMPARE: Cmp[] = [
  { what: "Cost", them: "Fees or a cut per ticket", us: "Zero fees for clubs" },
  { what: "Setup", them: "Gateway account and approvals", us: "No gateway of your own, publish in minutes" },
  { what: "Getting paid", them: "Chasing UPI screenshots", us: "Transferred within 1–2 working days" },
  { what: "Taking bookings", them: "Replies and forms", us: "One booking page, live seats" },
  { what: "Entry at the door", them: "A name list on paper", us: "QR scan, live check-in count" },
  { what: "Knowing who's coming", them: "Scattered across chats", us: "One attendee list per event" },
  { what: "Bringing people back", them: "Hope they remember", us: "Follow, community chat, reviews" },
];

const KINDS = [
  "Board game nights", "Running clubs", "Sports socials", "Book clubs", "Open mics", "Comedy nights",
  "Pottery & art workshops", "Trekking groups", "Language meetups", "Chess & card nights", "Photography walks", "Founder meetups",
];

const FAQS = [
  { q: "What does it cost?", a: "Nothing. SyncTrip charges clubs no listing fee, no commission and no monthly plan, and nothing is deducted from your earnings." },
  { q: "How do I get paid?", a: "Attendees pay through SyncTrip when they book. Within 1–2 working days after your event, the money from your bookings is transferred to you, in full. SyncTrip takes no fee from you." },
  { q: "Do I need a payment gateway?", a: "No. You don't need a payment gateway account of your own. SyncTrip collects the booking payments and transfers them to you within 1–2 working days of the event." },
  { q: "Will SyncTrip bring me customers?", a: "We can't promise any numbers. SyncTrip is a community that is growing at its own pace, made up of people looking for plans, often because they're new somewhere or want company. Your events are visible to them, so you may well get new faces, but treat SyncTrip first as a free booking tool." },
  { q: "Who can host on SyncTrip?", a: "Clubs, communities and independent hosts running real, in-person events: game nights, sports, workshops, open mics, treks and socials. We review clubs before they get the Verified badge, which keeps quality high for attendees." },
  { q: "Do my attendees need the app?", a: "No. Every event has a shareable page where people can see details and book. Installing the app gives them tickets, reminders and your club's community chat." },
  { q: "Can my team help run it?", a: "Yes. Add co-hosts or door volunteers with their own access. Volunteers can scan tickets and see who is coming without getting full control of the club." },
  { q: "Which cities are you in?", a: "Gurgaon, Delhi NCR (Delhi and Noida) and Chandigarh, with Mohali, Panchkula and Zirakpur. More cities are coming, so tell us where you are." },
  { q: "Is SyncTrip only for travel?", a: "No. The name started with trips, but today SyncTrip is a social app for plans, clubs and events: board games, sports, workshops, nights out and weekend trips. Clubs are a big part of it." },
];

const cityImg = (slug: string) => cityImage(slug, 640)!.src;
const CITIES = [
  { name: "Gurgaon", href: "/city/gurgaon", img: cityImg("gurgaon"), note: "Cyber Hub · Golf Course Rd · Sohna Rd" },
  { name: "Delhi", href: "/city/delhi", img: cityImg("delhi"), note: "Hauz Khas · CP · South Delhi" },
  { name: "Noida", href: "/city/noida", img: cityImg("noida"), note: "Sector 18 · 62 · Greater Noida" },
  { name: "Chandigarh", href: "/city/chandigarh", img: cityImg("chandigarh"), note: "Tricity · Mohali · Zirakpur" },
];

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": "https://synctrip.in/for-clubs", url: "https://synctrip.in/for-clubs", name: TITLE, description: DESCRIPTION, isPartOf: { "@type": "WebSite", name: "SyncTrip", url: "https://synctrip.in" } },
      { "@type": "FAQPage", mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };
}

/** Deterministic pseudo-QR so the ticket mock is decorative and never scannable. */
const QR_CELLS = (() => {
  const n = 11;
  const finder = (r: number, c: number) => (r < 3 && c < 3) || (r < 3 && c > n - 4) || (r > n - 4 && c < 3);
  return Array.from({ length: n * n }, (_, i) => {
    const r = Math.floor(i / n), c = i % n;
    return finder(r, c) || ((r * 7 + c * 13 + r * c * 3) % 5 < 2);
  });
})();

function Feature({
  id, eyebrow, title, lead, points, visual, flip, tint,
}: {
  id: string; eyebrow: string; title: string; lead: string; points: string[]; visual: React.ReactNode; flip?: boolean; tint: string;
}) {
  return (
    <section id={id} data-reveal className={`${home.feature} ${flip ? home.flip : ""}`} style={{ ["--tint" as string]: tint } as React.CSSProperties} aria-labelledby={`${id}-h`}>
      <div className={home.featureCopy}>
        <span className={home.eyebrow}>{eyebrow}</span>
        <h2 id={`${id}-h`} className={home.h2}>{title}</h2>
        <p className={home.lead}>{lead}</p>
        <ul className={home.points}>
          {points.map((p) => (
            <li key={p}><Check size={18} aria-hidden /> <span>{p}</span></li>
          ))}
        </ul>
      </div>
      <div className={home.featureVisual}>{visual}</div>
    </section>
  );
}

export default function ForClubsPage() {
  return (
    <div className={`${home.page} ${display.variable}`} data-motion-root>
      <ScrollReveal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />

      {/* ---------- Hero ---------- */}
      <header className={home.hero}>
        <div className={`${home.wrap} ${home.heroGrid}`}>
          <div className={home.heroCopy}>
            <span className={home.pill}>
              <span className={home.liveDot} /> Zero fees for clubs hosting{" "}
              <WordCycle words={["board-game nights", "running clubs", "open mics", "workshops", "sports socials", "weekend treks"]} />
            </span>
            <h1 className={`${home.h1} ${s.h1Fit}`}>
              A booking platform for your club.{" "}
              <span className={`${home.circled} ${s.circledWrap}`}>
                <span className={home.grad}>Zero fees.</span>
                <svg viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden>
                  <path pathLength={1} d="M150 8 C 60 6, 8 22, 10 52 C 12 84, 110 94, 196 90 C 268 86, 296 64, 290 40 C 284 14, 214 2, 120 10" />
                </svg>
              </span>
            </h1>
            <p className={home.heroSub}>
              Take bookings, scan guests in by QR and keep your members in one chat. No fees for your club, no gateway to set
              up, and you&apos;re paid within 1–2 working days of your event.
            </p>
            <div className={s.ctaRow}>
              <a className={`${s.btn} ${s.btnPrimary}`} href={APPLY_HREF}>List your club, it&apos;s free <ArrowRight size={18} aria-hidden /></a>
              <a className={`${s.btn} ${s.btnGhost}`} href="#how">See how it works</a>
            </div>
            <div className={home.trustRow}>
              <span className={home.trust}><Star size={14} aria-hidden /> Free for clubs</span>
              <span className={home.trust}>No gateway needed</span>
              <span className={home.trust}>Live in Gurgaon, Delhi NCR &amp; Chandigarh</span>
            </div>
          </div>

          <div className={home.phoneStage}>
            <div className={home.phone}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static, pre-compressed screenshot */}
              <img src="/home/app-clubs.webp" alt="SyncTrip clubs list in the app: clubs in Chandigarh with categories and follow buttons" width={640} height={1306} fetchPriority="high" />
            </div>
            {/* eslint-disable @next/next/no-img-element -- static, pre-compressed photos */}
            <figure className={`${home.polaroid} ${home.pA}`}><img src="/home/real-boardgame-cafe.webp" alt="" /><figcaption>game night</figcaption></figure>
            <figure className={`${home.polaroid} ${home.pB} ${home.polaroidWide}`}><img src="/home/real-roundtable.webp" alt="" /><figcaption>club meetup</figcaption></figure>
            {/* eslint-enable @next/next/no-img-element */}
            <div className={`${home.float} ${home.fA}`}>
              <span className={home.floatIcon} style={{ background: "#2785e7" }}><Ticket size={16} aria-hidden /></span>
              <span><b>New booking · 2 seats</b><small>Catan Night, Friday 7 pm</small></span>
            </div>
            <div className={`${home.float} ${home.fB}`}>
              <span className={home.floatIcon} style={{ background: "#10b981" }}><QrCode size={16} aria-hidden /></span>
              <span><b>Checked in · 18 of 24</b><small>QR scanned at the door</small></span>
            </div>
          </div>
        </div>

        <div className={`${home.wrap} ${s.strip}`} style={{ marginTop: 56 }}>
          {STRIP.map(({ icon: Icon, title, text }) => (
            <div key={title} className={s.stripItem}>
              <span className={s.stripIcon}><Icon size={18} aria-hidden /></span>
              <span><b>{title}</b><small>{text}</small></span>
            </div>
          ))}
        </div>
      </header>

      <main className={home.wrap}>
        {/* ---------- Community numbers ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="community">
          <span className={home.eyebrow}>The community</span>
          <h2 id="community" className={home.h2}>Build your presence where people already make plans</h2>
          <p className={home.lead}>We can&apos;t promise bookings. What we can say is that a club that keeps showing up here builds a following over time.</p>
          <div className={s.stats}>
            {STATS.map((st, i) => (
              <div key={st.label} className={s.stat} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                <span className={s.statNum}><CountUp to={st.to} decimals={st.decimals} suffix={st.suffix} /></span>
                <span className={s.statLabel}>{st.label}</span>
                <span className={s.statNote}>{st.note}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Problem ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="pain">
          <span className={home.eyebrow}>Sound familiar?</span>
          <h2 id="pain" className={home.h2}>Small events deserve a proper booking page, without the fees</h2>
          <p className={home.lead}>You built the community. Stop spending your evenings chasing replies and counting who is coming.</p>
          <div className={s.pains}>
            {PAINS.map((p, i) => (
              <div key={p.title} className={s.pain} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                <span className={s.painTag}>{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className={s.fix}><Check size={16} aria-hidden /> <span>{p.fix}</span></div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Benefit grid ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="benefits">
          <span className={home.eyebrow}>Why SyncTrip</span>
          <h2 id="benefits" className={home.h2}>Everything a club needs, in one place</h2>
          <p className={home.lead}>Not just a ticket page. SyncTrip brings you the audience, the booking and the community.</p>
          <div className={home.bento}>
            {BENEFITS.map(({ icon: Icon, title, text }, i) => (
              <div key={title} className={home.bentoTile} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                <span className={home.bentoIcon}><Icon size={20} aria-hidden /></span>
                <b>{title}</b>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Discovery ---------- */}
        <Feature
          id="discover"
          tint="#eaf4ff"
          eyebrow="A growing community"
          title="Part of a community that's here to make plans"
          lead="We won't promise you customers, because nobody honestly can. What we can say: SyncTrip is growing at its own pace, and people join because they want company, whether they're new in the city or just up for something to do. Your events sit where they already look."
          points={[
            "Listed in the city feed, on SyncMap and in club discovery",
            "People can follow your club and hear about your next event",
            "Free to be listed. Nothing to pay for visibility",
          ]}
          visual={
            <div className={home.phoneStage}>
              <div className={home.phone}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static, pre-compressed screenshot */}
                <img src="/home/app-syncmap.webp" alt="SyncMap showing a board-games club event on a map of Chandigarh" width={640} height={1306} loading="lazy" />
              </div>
              <div className={`${home.float} ${home.fA}`}>
                <span className={home.floatIcon} style={{ background: "#f3359e" }}><Search size={16} aria-hidden /></span>
                <span><b>Board games near me</b><small>3 events this week</small></span>
              </div>
            </div>
          }
        />

        {/* ---------- Booking ---------- */}
        <Feature
          id="booking"
          flip
          tint="#f4efff"
          eyebrow="Booking platform"
          title="A booking platform with zero fees and nothing to set up"
          lead="Set your seats and ticket types, publish, and share the link. Attendees book in a few taps and get a ticket. There's no payment gateway for you to connect and we take no cut from your earnings. We collect the payments and transfer them to you within 1–2 working days of the event."
          points={[
            "Free RSVP or ticketed events, your choice per event",
            "Live seat count, so you always know how full you are",
            "No gateway account of your own, and nothing deducted from your earnings",
            "Payments collected by SyncTrip, transferred to you within 1–2 working days of the event",
          ]}
          visual={
            <div className={s.mockWrap}>
              <span className={s.example}>Example</span>
              <div className={s.mock}>
                <div className={s.mockHead}>
                  <span className={s.avatar}>BG</span>
                  <span><b>Catan Night</b><small>Fri, 7:00 pm · Cyber Hub, Gurgaon</small></span>
                </div>
                <div className={s.rowLine}><span>Seats left</span><b>6 of 24</b></div>
                <div className={s.bar}><span style={{ ["--w" as string]: "75%" } as React.CSSProperties} /></div>
                <div className={s.receipt}>
                  <div><span>Tickets · 2 × ₹500</span><span>₹1,000</span></div>
                  <div><span>Fees deducted from you</span><span className={s.credit}>₹0</span></div>
                  <div className={s.total}><span>Transferred within 1–2 working days</span><span>₹1,000</span></div>
                </div>
                <span className={s.payBtn}>Booking confirmed</span>
                <p className={s.note}>What the club sees for a booking. Example numbers.</p>
              </div>
            </div>
          }
        />

        {/* ---------- Check-in ---------- */}
        <Feature
          id="door"
          tint="#ecfbf6"
          eyebrow="Event day"
          title="Check guests in with a scan, not a spreadsheet"
          lead="Every booking gets a ticket with a QR. Your team scans at the entrance and the attendee list updates live, even when you have a queue."
          points={[
            "See who's coming and who has arrived, in real time",
            "Door volunteers can scan tickets without full control of your club",
            "Attendees see their ticket in the app, ready to show",
          ]}
          visual={
            <div className={s.mockWrap}>
              <span className={s.example}>Example</span>
              <div className={s.mock}>
                <div className={s.mockHead}>
                  <span className={s.avatar} style={{ background: "linear-gradient(135deg,#059669,#4bbef5)" }}>P</span>
                  <span><b>Priya S.</b><small>2 seats · Catan Night</small></span>
                  <span className={s.badge}><Check size={12} aria-hidden /> Confirmed</span>
                </div>
                <div className={s.qr} aria-hidden>
                  {QR_CELLS.map((on, i) => <i key={i} className={on ? s.on : undefined} />)}
                </div>
                <div className={s.ticketMeta}><b>ST-4KQ9MP</b><small>Show this at the entrance</small></div>
                <div className={s.scanned}><Check size={16} aria-hidden /> Checked in · 18 of 24 arrived</div>
              </div>
            </div>
          }
        />

        {/* ---------- Dashboard ---------- */}
        <Feature
          id="dashboard"
          flip
          tint="#fff4ec"
          eyebrow="Your dashboard"
          title="See your whole club at a glance"
          lead="Seats sold, who's coming and who has arrived, on your phone between events."
          points={[
            "Next event, seats sold and check-ins on one screen",
            "Attendee list for every event",
            "Ratings and reviews that build your club's reputation",
          ]}
          visual={
            <div className={s.mockWrap}>
              <span className={s.example}>Example</span>
              <div className={s.mock}>
                <div className={s.mockHead}>
                  <span className={s.avatar}>BG</span>
                  <span><b>Gurgaon Board Game Society</b><small>Club dashboard</small></span>
                  <span className={s.badge}><BadgeCheck size={12} aria-hidden /> Verified</span>
                </div>
                <div className={s.kpis}>
                  <div className={s.kpi}><b>18/24</b><small>Seats sold</small></div>
                  <div className={s.kpi}><b>412</b><small>Followers</small></div>
                  <div className={s.kpi}><b>4.8★</b><small>Rating</small></div>
                </div>
                <div className={s.rowLine}><span>Next: Catan Night, Fri 7 pm</span><b>75% full</b></div>
                <div className={s.bar}><span style={{ ["--w" as string]: "75%" } as React.CSSProperties} /></div>
                <ul className={s.list}>
                  <li><span className={`${s.dot} ${s.dotOk}`}>P</span>Priya S. · 2 seats<small>Arrived</small></li>
                  <li><span className={s.dot}>R</span>Rahul K. · 1 seat<small>Booked</small></li>
                  <li><span className={s.dot}>A</span>Aman &amp; friends · 4 seats<small>Booked</small></li>
                </ul>
              </div>
            </div>
          }
        />

        {/* ---------- How it works ---------- */}
        <section id="how" className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="how-h" style={{ scrollMarginTop: 90 }}>
          <span className={home.eyebrow}>How it works</span>
          <h2 id="how-h" className={home.h2}>From first message to full house in four steps</h2>
          <div className={s.steps}>
            {STEPS.map((st, i) => (
              <div key={st.title} className={s.step} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                <b>{st.title}</b>
                <span>{st.text}</span>
              </div>
            ))}
          </div>
          <div className={`${s.ctaRow} ${s.ctaCenter}`}>
            <a className={`${s.btn} ${s.btnPrimary}`} href={APPLY_HREF}><CalendarPlus size={18} aria-hidden /> Apply to host</a>
          </div>
        </section>

        {/* ---------- Comparison ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="cmp">
          <span className={home.eyebrow}>Why switch</span>
          <h2 id="cmp" className={home.h2}>The old way vs SyncTrip</h2>
          <div className={s.compare} data-reveal role="table" aria-label="Running events the old way compared with SyncTrip">
            <div className={`${s.cmpRow} ${s.cmpHead}`} role="row">
              <span className={s.what} role="columnheader">&nbsp;</span>
              <span role="columnheader">WhatsApp + forms + paid tools</span>
              <span className={s.us} role="columnheader">SyncTrip</span>
            </div>
            {COMPARE.map((c) => (
              <div key={c.what} className={s.cmpRow} role="row">
                <span className={s.what} role="rowheader">{c.what}</span>
                <span className={s.them} role="cell"><X size={16} aria-hidden /> {c.them}</span>
                <span className={s.us} role="cell"><Check size={16} aria-hidden /> {c.us}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Pricing ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="price">
          <span className={home.eyebrow}>Pricing</span>
          <h2 id="price" className={home.h2}>Zero fees for clubs. No gateway. Nothing to pay.</h2>
          <p className={home.lead}>SyncTrip is a community first. The booking tools are our way of making hosting easier for the people who make it worth joining.</p>
          <div className={s.prices}>
            <div className={s.price} data-reveal>
              <small>Listing</small>
              <span className={s.big}>₹0</span>
              <p>Create your club page, post events, build followers and use the community chat. No setup fee, no monthly plan.</p>
            </div>
            <div className={s.price} data-reveal style={{ ["--i" as string]: 1 } as React.CSSProperties}>
              <small>Bookings</small>
              <span className={s.big}>₹0 fees</span>
              <p>RSVPs, tickets, attendee list and QR check-in. No commission, and nothing deducted from what you earn.</p>
            </div>
            <div className={`${s.price} ${s.priceHot}`} data-reveal style={{ ["--i" as string]: 2 } as React.CSSProperties}>
              <small>Payments</small>
              <span className={s.big}>We handle it</span>
              <p>No gateway account of your own to open. We collect from attendees and transfer your earnings to you within 1–2 working days of the event.</p>
            </div>
          </div>
        </section>

        {/* ---------- Who it's for ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="kinds">
          <span className={home.eyebrow}>Who it&apos;s for</span>
          <h2 id="kinds" className={home.h2}>If people gather around it, it belongs here</h2>
          <div className={s.kindPhotos} data-reveal>
            {/* eslint-disable @next/next/no-img-element -- static, pre-compressed photos */}
            <figure><img src="/home/real-boardgame-cafe.webp" alt="Board-game night at a café" loading="lazy" /><figcaption>Game nights</figcaption></figure>
            <figure><img src="/home/real-chess.webp" alt="Players at a chess meetup" loading="lazy" /><figcaption>Chess &amp; cards</figcaption></figure>
            <figure><img src="/city-guides/workshops-pottery.jpg" alt="A pottery workshop" loading="lazy" /><figcaption>Workshops</figcaption></figure>
            <figure><img src="/city-guides/gurgaon-running.jpg" alt="A running group in Gurgaon" loading="lazy" /><figcaption>Runs &amp; sports</figcaption></figure>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
          <div className={s.kinds}>
            {KINDS.map((k) => <span key={k} className={s.kind}>{k}</span>)}
          </div>
        </section>

        {/* ---------- Cities ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="cities">
          <span className={home.eyebrow}>Where we are</span>
          <h2 id="cities" className={home.h2}>Live in four cities, growing</h2>
          <p className={home.lead}>Members across the tricity and NCR are already looking for things to do. Don&apos;t see your city? Apply anyway and tell us where you are.</p>
          <div className={home.cities}>
            {CITIES.map((c, i) => (
              <Link key={c.name} href={c.href} className={home.city} data-reveal style={{ ["--i" as string]: i } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.img} alt={`${c.name} city`} loading="lazy" />
                <b>{c.name}</b>
                <span>{c.note}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className={`${home.section} ${home.center}`} data-reveal-head aria-labelledby="faq">
          <span className={home.eyebrow}>FAQ</span>
          <h2 id="faq" className={home.h2}>Questions from club owners</h2>
          <div className={home.faq} data-reveal>
            {FAQS.map((f, i) => (
              <details key={f.q} className={home.faqItem} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className={home.final} data-reveal aria-labelledby="final">
          <h2 id="final" className={home.h2}>Your next event, booked in minutes.</h2>
          <p>Set up your club in a few minutes. Zero fees for clubs, no gateway of your own, and a community of people who came here looking for plans.</p>
          <div className={`${s.ctaRow} ${s.ctaCenter}`}>
            <a className={`${s.btn} ${s.btnLight}`} href={APPLY_HREF}>List your club, it&apos;s free <ArrowRight size={18} aria-hidden /></a>
            <Link className={`${s.btn} ${s.btnOutlineLight}`} href="/">See the SyncTrip app</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
