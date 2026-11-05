import type { Metadata } from "next";
import { getChandigarhVenues } from "./_lib/api";
import { categoryUrl } from "./_lib/links";
import JoinWizard from "./_components/JoinWizard";
import {
  CategoryFooter, Faq, Final, Highlight, Ico, Included, JoinAside, Nav, PriceCards, Proof, SafetyGrid, Steps, WOMEN_SAFETY,
} from "./_components/Shell";

export const revalidate = 600;

const TITLE = "SyncTrip Hangouts · Meet new people over food & games in Chandigarh";
const DESCRIPTION =
  "Tell us when you're free. SyncTrip matches you with 4-6 people in Chandigarh, Mohali & Panchkula, plans a hangout at a café we've hosted at, and your meal is included.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: categoryUrl("hangouts") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: categoryUrl("hangouts"), siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: "https://synctrip.in/og-home.png" }] },
};

const EXAMPLES: [string, string, string, string][] = [
  ["/home/real-boardgame-cafe.webp", "clubsIcon", "Board-game café", "Games break the ice for you."],
  ["/home/real-dinner.webp", "place-Restaurant", "Dinner", "A table for 6 and conversation that runs late."],
  ["/home/real-chess.webp", "place-Cafe", "Chai & a game", "A slow evening with chai, chess or cards."],
  ["/home/real-roundtable.webp", "place-Cafe", "Brunch", "Daylight, coffee, zero pressure."],
];
const CAFE_ACTS = ["cafe", "restaurant", "board_games", "gaming"];
const iconFor = (a: string[]) => (a.includes("restaurant") ? "place-Restaurant" : a.includes("board_games") || a.includes("gaming") ? "clubsIcon" : "place-Cafe");

export default async function HangoutsPage() {
  const venues = (await getChandigarhVenues())
    .filter((v) => v.syncTripHosted && v.activities?.some((a) => CAFE_ACTS.includes(a)))
    .slice(0, 6);

  return (
    <div className="stl p-hangouts" id="top">
      <Nav category="hangouts" cta="Find my group" links={[["#types", "Hangouts"], ["#venues", "Places"], ["#pricing", "Pricing"], ["#safety", "Safety"], ["#faq", "FAQ"]]} />

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="chip"><img src="/hangouts/icons/outingIcon.png" alt="" />Hangouts in Chandigarh · Mohali · Panchkula</span>
            <h1>New people.<br />Good food. <Highlight color="#3ABEF5">Every week.</Highlight></h1>
            <p className="lead">Tell us when you&apos;re free. We&apos;ll match you with 4-6 people near you, plan a hangout at a café we&apos;ve hosted at, and open your group chat on SyncTrip. Your meal is included.</p>
            <div className="hero-ctas">
              <a className="sbtn sbtn-primary" href="#join">Find my hangout group</a>
              <a className="sbtn sbtn-light" href="#types">What&apos;s a hangout?</a>
            </div>
            <Proof>Real people from <b>SyncTrip meetups</b> in Tricity</Proof>
          </div>
          <div className="visual">
            <div className="photo" style={{ backgroundImage: "url(/home/real-roundtable.webp)", backgroundPosition: "center 40%" }} />
            <div className="stoast t1"><img src="/hangouts/icons/communityIcon.png" alt="" /><div><b>Your group is ready</b>Say hi before Thursday</div></div>
            <div className="stoast t2"><img src="/hangouts/icons/place-Restaurant.png" alt="" /><div><b>Meal included</b>Up to ₹250, on us</div></div>
            <div className="group-card">
              <div className="gc-head"><img src="/home/real-dinner.webp" alt="" /><div><b>Your hangout</b><small>{venues[0] ? `${venues[0].name} · ${venues[0].locality}` : "A café near you"}</small></div></div>
              <div className="gc-rows"><div>Time<b>Thu · 8 pm</b></div><div>Table<b>For 6</b></div></div>
              <div className="gc-foot">
                <div className="faces">
                  <span style={{ background: "#3ABEF5" }}>N</span><span style={{ background: "#EC4899" }}>P</span>
                  <span style={{ background: "#16324F" }}>V</span><span style={{ background: "#2B9A66" }}>J</span>
                  <span style={{ background: "#F8FAFC", color: "#0D344B", borderColor: "#fff" }}>+2</span>
                </div>
                <span className="open">Open chat →</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="types">
        <div className="wrap">
          <div className="eyebrow">What a hangout looks like</div>
          <h2 className="h2">You bring yourself.<br />We plan the rest.</h2>
          <p className="sub">You don&apos;t choose the activity. We plan something that suits your group and the time you&apos;re free: chai, a board-game café, dinner, brunch. Always 4-6 people at a public café we know.</p>
          <div className="types">
            {EXAMPLES.map(([img, icon, title, text]) => (
              <div className="type" key={title}>
                <div className="pic" style={{ backgroundImage: `url(${img})` }}><span className="when">For example</span></div>
                <div className="body"><img src={`/hangouts/icons/${icon}.png`} alt="" /><div><h3>{title}</h3><p>{text}</p></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {venues.length > 0 && (
        <section id="venues" className="venues-wrap">
          <div className="wrap">
            <div className="head-row">
              <div>
                <div className="eyebrow">Where groups meet</div>
                <h2 className="h2">Cafés we&apos;ve already hosted at.</h2>
                <p className="sub">Public, busy, comfortable places in Tricity. We pick the one closest to your group.</p>
              </div>
              <span className="live light"><i style={{ background: "var(--success)", boxShadow: "0 0 0 4px rgba(43,154,102,.2)" }} />Live from SyncTrip city guide</span>
            </div>
            <div className="venues">
              {venues.map((v) => (
                <div className="venue" key={v.id}>
                  <div className="vic"><img src={`/hangouts/icons/${iconFor(v.activities)}.png`} alt="" /></div>
                  <div>
                    <b>{v.name}</b>
                    <small><Ico name="i-pin" /><span>{v.locality}</span></small>
                    <div className="tags"><span className="hosted">SyncTrip hosted</span>{v.activities.slice(0, 2).map((a) => <span key={a}>{a.replace(/_/g, " ")}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Steps items={[
        ["outingIcon", "Tell us when you're free", "Weekdays, weekends, and the time of day that suits you."],
        ["vibe-Friendly", "Tell us about you", "Food, your vibe at a table, your name and birthday."],
        ["communityIcon", "We plan your hangout", "Once 4-6 people fit, we pick the plan and a café near all of you."],
        ["place-Restaurant", "Chat, meet, eat", "Your group chat opens in the app. Check in at the café and your meal is on us."],
      ]} />

      <section id="pricing" style={{ paddingTop: 20 }}>
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="eyebrow">Pricing</div>
          <h2 className="h2">Your meal is included.</h2>
          <p className="sub" style={{ margin: "0 auto" }}>Everyone gets a meal worth up to <b>₹250</b> at the café, paid by SyncTrip. Order more if you like and pay the difference.</p>
          <Included items={[
            { icon: "i-meal", label: "Meal up to ₹250 per person" },
            { icon: "i-table", label: "Table reserved" },
            { icon: "i-users", label: "A matched group of 4-6" },
            { icon: "i-chat", label: "Group chat on SyncTrip" },
            { icon: "i-coffee", label: "Extra orders: pay your own", off: true },
          ]} />
          <PriceCards
            note="How the meal works: check in at the café in the SyncTrip app, show your meal pass at the counter, and the café bills SyncTrip. The Ladies' Pass needs a verified profile."
            cards={[
              { pass: "solo", name: "Solo Pass", badge: "Most booked", amount: "₹449", unit: "/ person", fine: "Come alone, we'll put you in a group.", payIcon: "i-meal", payLine: <><b>1 meal up to ₹250</b> included</>, bullets: ["Your meal at the café, paid by us", "Table booked for your group", "Group chat before you meet"], cta: "Choose Solo" },
              { pass: "ladies", ladies: true, name: "Ladies' Pass", badge: "Free meal", amount: "₹99", unit: "refundable", fine: "Your meal is free, up to ₹250. The ₹99 is a holding deposit so tables don't go empty.", payIcon: "i-refund", payLine: <><b>₹99 comes back</b> as SyncTrip credit when you check in</>, bullets: ["Free meal up to ₹250, paid by us", "Never the only woman in a group", "Women-only groups if you prefer"], cta: "Claim free meal" },
              { pass: "duo", name: "Duo Pass", badge: "You + a friend", amount: "₹849", unit: "for both of you", fine: "Bring a friend. You two join a group together. One payment covers both.", payIcon: "i-meal", payLine: <><b>2 meals, up to ₹250 each</b> included</>, bullets: ["A meal for you and one for your friend", "You sit together", "Easiest way to try it the first time"], cta: "Choose Duo" },
            ]}
          />
        </div>
      </section>

      <SafetyGrid eyebrow="Safety" title="Built so everyone feels comfortable." sub="If it feels safe for her, it's better for everyone." items={WOMEN_SAFETY} />

      <section id="join">
        <div className="wrap join-grid">
          <JoinAside eyebrow="Join the next group" title="2 minutes, then we take it from here." last={["i-qr", "Check in, eat", "Scan in at the café and your meal pass unlocks."]} />
          <JoinWizard variant="hangouts" />
        </div>
      </section>

      <Faq items={[
        ["Is this a dating app?", "No. It's a way to make new friends in Tricity over food and games. Groups are 4-6 people, matched on interests, age, food and where you live."],
        ["How does the meal work?", "When you reach the café, check in on SyncTrip with your group. Your meal pass unlocks in the app. Show it at the counter and order anything up to ₹250. The café bills SyncTrip, not you. If your order costs more, you pay only the difference."],
        ["Can I choose what we do or where?", "No, and that's the fun part. We plan the hangout (chai, games, dinner or brunch) at a café we've hosted at, close to everyone in your group."],
        ["How does the Ladies' Pass work?", "Your meal is free. You pay a ₹99 holding deposit so tables don't go empty. When you check in with your group, the ₹99 comes back as SyncTrip credit for your next plan."],
        ["What if you can't find my group?", "If we can't match you within 14 days, you get a full refund. You can also cancel any time before you're matched."],
      ]} />

      <Final title={<>Your next table<br />is already waiting.</>} text="Tell us when you're free. We'll handle the group, the plan, the café and your meal." cta="Find my hangout group" />
      <CategoryFooter current="hangouts" blurb="Meet new people at fun plans every week in Chandigarh, Mohali & Panchkula." />
    </div>
  );
}
