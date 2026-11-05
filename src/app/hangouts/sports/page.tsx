import type { Metadata } from "next";
import { getChandigarhVenues, getClubEvents, CHANDIGARH_CITY_ID } from "../_lib/api";
import { categoryUrl, SITE } from "../_lib/links";
import JoinWizard from "../_components/JoinWizard";
import {
  CategoryFooter, Faq, Final, Highlight, Ico, Included, JoinAside, Nav, PriceCards, SafetyGrid,
} from "../_components/Shell";

export const revalidate = 600;

const TITLE = "SyncTrip Sports · Find players, we book the court · Chandigarh";
const DESCRIPTION =
  "Badminton, football, pickleball, cricket, tennis and squash with new people in Chandigarh, Mohali & Panchkula. Pick your sport, level and days. SyncTrip makes a balanced game and books the court.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: categoryUrl("sports") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: categoryUrl("sports"), siteName: "SyncTrip", locale: "en_IN", type: "website", images: [{ url: "https://synctrip.in/og-home.png" }] },
};

// Same list as the app (SyncTripApp activityMetaConfig SPORTS_LIST).
const SPORT_CARDS: [string, string, string, string[]][] = [
  ["Badminton", "Badminton", "Indoor courts, quick rallies.", ["Doubles", "4 players", "1 hr"]],
  ["Football", "Football", "Turf games under lights.", ["5-a-side", "10 players", "1 hr"]],
  ["Pickleball", "Pickleball", "Easiest to learn, very social.", ["Doubles", "4 players", "1 hr"]],
  ["Cricket", "Cricket", "Short overs, big hits.", ["Box cricket", "8-12 players"]],
  ["Tennis", "Tennis", "Proper courts, proper rallies.", ["Doubles", "4 players", "1 hr"]],
  ["Squash", "Squash", "Fast, sweaty, great workout.", ["Round robin", "3-4 players"]],
];
const SPORT_OF: Record<string, string> = {
  badminton: "Badminton", football: "Football", futsal: "Football", box_cricket: "Cricket", cricket: "Cricket",
  pickleball: "Pickleball", padel: "Pickleball", tennis: "Tennis", squash: "Squash",
};
const when = (d: string) =>
  new Date(d).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default async function SportsPage() {
  const [venues, events] = await Promise.all([getChandigarhVenues(), getClubEvents(60, CHANDIGARH_CITY_ID)]);
  const courts = venues.filter((v) => v.activities?.some((a) => SPORT_OF[a])).slice(0, 9);
  const clubGames = events.filter((e) => e.category === "sports");

  return (
    <div className="stl p-sports" id="top">
      <Nav category="sports" cta="Find a game" links={[["#sports", "Sports"], ["#levels", "Levels"], ["#courts", "Courts"], ["#pricing", "Pricing"], ["#faq", "FAQ"]]} />

      <header className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="chip"><img src="/hangouts/icons/sportIcon.png" alt="" />Sports in Chandigarh · Mohali · Panchkula</span>
            <h1>Find players.<br />We book <Highlight color="#2E7D4F">the court.</Highlight></h1>
            <p className="lead">No more &quot;anyone up for badminton?&quot; in five WhatsApp groups. Pick your sport, your level and when you&apos;re free. We&apos;ll make a balanced game near you, book the court, and open your team chat on SyncTrip.</p>
            <div className="hero-ctas">
              <a className="sbtn sbtn-primary" href="#join">Find my game</a>
              <a className="sbtn sbtn-light" href="#sports">See the sports</a>
            </div>
            <div className="proof">
              <div className="faces">
                {["Badminton", "Football", "Pickleball", "Cricket"].map((s) => (
                  <span key={s} style={{ backgroundImage: `url(/hangouts/icons/sport-${s}.png)`, backgroundSize: "70%", backgroundRepeat: "no-repeat", backgroundColor: "#E8F5EC" }} />
                ))}
              </div>
              <div><b>6 sports</b>, matched by skill level</div>
            </div>
          </div>
          <div className="visual">
            <div className="photo" style={{ backgroundImage: "url(/hangouts/img/sports-hero.jpg)", backgroundPosition: "center 40%" }} />
            <div className="stoast t1"><img src="/hangouts/icons/level-Intermediate.png" alt="" /><div><b>Matched by level</b>Everyone plays, nobody waits</div></div>
            <div className="stoast t2"><img src="/hangouts/icons/sportIcon.png" alt="" /><div><b>Court booked</b>Fee included</div></div>
            <div className="group-card">
              <div className="gc-head"><img src="/hangouts/icons/sport-Badminton.png" alt="" style={{ background: "#E8F5EC", padding: 6 }} /><div><b>Badminton doubles</b><small>Saturday · 7:00 am</small></div></div>
              <div className="gc-rows"><div>Court<b>Sector 42</b></div><div>Level<b>Intermediate</b></div></div>
              <div className="gc-foot">
                <div className="faces">
                  <span style={{ background: "#2E7D4F" }}>R</span><span style={{ background: "#EC4899" }}>S</span>
                  <span style={{ background: "#16324F" }}>A</span><span style={{ background: "#3ABEF5" }}>K</span>
                </div>
                <span className="open">Team chat →</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section id="sports">
        <div className="wrap">
          <div className="eyebrow">Pick your game</div>
          <h2 className="h2">Six sports. Always a full game.</h2>
          <p className="sub">The same sports you&apos;ll find in the SyncTrip app. Pick as many as you like.</p>
          <div className="sgrid">
            {SPORT_CARDS.map(([name, icon, about, fmt]) => (
              <div className="sp" key={name}>
                <div className="si"><img src={`/hangouts/icons/sport-${icon}.png`} alt="" /></div>
                <div><h3>{name}</h3><p>{about}</p><div className="fmt">{fmt.map((f) => <span key={f}>{f}</span>)}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="levels" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="eyebrow">Matched by level</div>
          <h2 className="h2">Fun games, not one-sided ones.</h2>
          <p className="sub">Tell us honestly how you play. We only put you with people around your level.</p>
          <div className="levels">
            {[["Beginner", "Beginner", "New, or haven't played in years. Here for fun and to learn."], ["Intermediate", "Intermediate", "You know the rules and can hold a rally or a pass."], ["Pro", "Hard", "You play often and want a proper, fast game."]].map(([lv, icon, text]) => (
              <div className="lv" key={lv}><img src={`/hangouts/icons/level-${icon}.png`} alt="" /><h3>{lv}</h3><p>{text}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section id="courts" className="venues-wrap">
        <div className="wrap">
          <div className="head-row">
            <div>
              <div className="eyebrow">Courts &amp; turfs</div>
              <h2 className="h2">We book places near your team.</h2>
              <p className="sub">Courts and turfs across Tricity from the SyncTrip city guide. We pick the one closest to everyone.</p>
            </div>
            <span className="live light"><i style={{ background: "var(--success)", boxShadow: "0 0 0 4px rgba(43,154,102,.2)" }} />Live from SyncTrip city guide</span>
          </div>
          <div className="vgrid">
            {courts.map((v) => {
              const sp = Array.from(new Set(v.activities.map((a) => SPORT_OF[a]).filter(Boolean)));
              return (
                <div className="vn" key={v.id}>
                  <div className="vi"><img src={`/hangouts/icons/sport-${sp[0]}.png`} alt="" /></div>
                  <div><b>{v.name}</b><small>{v.locality}</small><div className="tags">{sp.map((s) => <span key={s}>{s}</span>)}</div></div>
                </div>
              );
            })}
          </div>

          {clubGames.length > 0 && (
            <div className="clubgames">
              <div className="eyebrow">Or join a club game</div>
              <h2 className="h2" style={{ fontSize: "clamp(26px,3vw,36px)" }}>Sports events from clubs</h2>
              {clubGames.map((e) => (
                <a className="cg" key={e.id} href={`${SITE}/share/club-event/${encodeURIComponent(e.id)}`}>
                  <div className="cgc" style={{ backgroundImage: `url('${e.coverImageUrl}')` }} />
                  <div className="cgb">
                    <h3>{e.title}</h3>
                    <p>{e.subtitle}</p>
                    <div className="srow">
                      <div className="meta">
                        <span><Ico name="i-clock" />{when(e.startsAt)}</span>
                        <span><Ico name="i-pin" />{e.venue?.name}</span>
                        <span><Ico name="i-verified" />{e.club?.name}</span>
                      </div>
                      <span className="sbtn sbtn-navy">{e.isFree ? "Free" : `${e.hasPasses ? "From " : ""}₹${e.ticketPrice}`}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="pricing">
        <div className="wrap" style={{ textAlign: "center" }}>
          <div className="eyebrow">Pricing</div>
          <h2 className="h2">Your court fee is included.</h2>
          <p className="sub" style={{ margin: "0 auto" }}>You pay us once. We book and pay for the court or turf for the whole game.</p>
          <Included items={[
            { icon: "i-court", label: "Your share of the court" },
            { icon: "i-ball", label: "Shuttles / balls" },
            { icon: "i-level", label: "Players at your level" },
            { icon: "i-chat", label: "Team chat on SyncTrip" },
            { icon: "i-whistle", label: "Racket & shoes: bring your own", off: true },
          ]} />
          <PriceCards
            note="Football turf and cricket box games may cost a little more because of bigger venues. You'll see the exact price before paying."
            cards={[
              { pass: "solo", name: "Player Pass", badge: "Most booked", amount: "₹249", unit: "/ game", fine: "Come alone, we'll put you in a game.", payIcon: "i-court", payLine: <><b>Court fee included</b> for 1 player</>, bullets: ["About 1 hour of play", "Players at your level", "Team chat before the game"], cta: "Choose Player" },
              { pass: "ladies", ladies: true, name: "Ladies' Pass", badge: "Free court", amount: "₹99", unit: "refundable", fine: "Your court is free. The ₹99 is a holding deposit so games don't fall short.", payIcon: "i-refund", payLine: <><b>₹99 comes back</b> as SyncTrip credit when you check in</>, bullets: ["Free court, booked by us", "Women-only games if you prefer", "Never the only woman in a game"], cta: "Claim free game" },
              { pass: "duo", name: "Duo Pass", badge: "You + a partner", amount: "₹449", unit: "for both of you", fine: "Bring your doubles partner. We find the other side.", payIcon: "i-court", payLine: <><b>Court fee included</b> for 2 players</>, bullets: ["You two play on the same team", "Great for doubles and pickleball", "One payment covers both"], cta: "Choose Duo" },
            ]}
          />
        </div>
      </section>

      <SafetyGrid eyebrow="Fair play" title="Good games, good people." sub="Everyone on the court is verified, and no-shows don't get a second chance." items={[
        { icon: "i-shield", title: "Verified players", text: "Phone and live selfie check before anyone is matched." },
        { icon: "i-level", title: "Matched by level", text: "Beginners with beginners, pros with pros. Rate your game after, so the next match is better." },
        { icon: "i-women", tone: "pink", title: "Women-only games", text: "Prefer to play with women only? Choose it and we'll match you only with women." },
        { icon: "i-court", title: "Real venues", text: "Public courts, sports complexes and turfs. Never a private place." },
        { icon: "i-clock", title: "No-shows get strikes", text: "Miss a game without telling us and you lose the fee. Two strikes and you're out." },
        { icon: "i-flag", title: "Report & block", text: "One tap to report or block. Anyone flagged is removed from future games." },
      ]} />

      <section id="join">
        <div className="wrap join-grid">
          <JoinAside eyebrow="Join the next game" title="2 minutes, then get your shoes ready." last={["i-bell", "Get notified", "Court, time and team chat in the SyncTrip app."]} />
          <JoinWizard variant="sports" />
        </div>
      </section>

      <Faq items={[
        ["I'm a beginner. Is this for me?", "Yes. Pick \"Beginner\" and you'll only play with other beginners. Lots of people use SyncTrip to get back into a sport after years."],
        ["Is the court really included?", "Yes. We book and pay for the court or turf for the whole game. Your pass covers your share. Shuttles or balls are provided. Bring your own racket and shoes, or tell us if you need to rent."],
        ["How many people are in a game?", "It depends on the sport: 4 for badminton, pickleball and tennis doubles, 3-4 for squash, 8-12 for box cricket, and 10 for 5-a-side football."],
        ["What if someone doesn't show up?", "We keep a short waitlist for every game and fill gaps where we can. Players who miss a game without telling us lose their fee and get a strike."],
        ["What if you can't find my game?", "If we can't match you within 14 days, you get a full refund. You can also cancel any time before you're matched."],
      ]} />

      <Final title={<>Your next game<br />is one tap away.</>} text="Pick your sport, level and days. We'll handle the players, the court and the chat." cta="Find my game" />
      <CategoryFooter current="sports" blurb="Meet new people at fun plans every week in Chandigarh, Mohali & Panchkula." />
    </div>
  );
}
