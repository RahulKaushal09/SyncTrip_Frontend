import { appStoreUrl, playStoreUrl } from "@/lib/storeLinks";
import { CategoryFooter, Ico } from "./Shell";
import type { Category } from "../_lib/links";

const WHAT: Record<Exclude<Category, "events">, { thing: string; place: string }> = {
  movies: { thing: "movie group", place: "the cinema, show time and your seats" },
  hangouts: { thing: "hangout group", place: "the café and the plan" },
  sports: { thing: "game", place: "the court, time and your team" },
};

/**
 * Shown after someone pays on movies./hangouts./sports. The form passes the booked
 * date (`when`, `where`) and the pass. The group is shared on WhatsApp the evening
 * before; the app is where the group chat lives, so it stays the second step.
 */
export default function Joined({ category, when, where, pass }: { category: Exclude<Category, "events">; when?: string; where?: string; pass?: string }) {
  const w = WHAT[category];
  const utm = { campaign: `${category}_joined`, term: "joined", content: "button" };
  const play = playStoreUrl(utm);
  const ios = appStoreUrl(utm);

  return (
    <div className={`stl p-${category}`} id="top">
      <div className="joined">
        <div className="wrap jgrid">
          <div>
            <div className="ok"><Ico name="i-check" /></div>
            <h1>You&apos;re in{when ? <><br />for {when}.</> : "."}</h1>
            <p className="lead">
              {where && <>{where}. </>}We&apos;re making your {w.thing}. <b>We&apos;ll WhatsApp you the evening before</b> with your group, {w.place}.
            </p>
            <div className="jsteps">
              <div className="jstep"><span className="num">1</span><div><b>Watch WhatsApp</b><span>We message you on the number you just used, then add you to your group.</span></div></div>
              {pass === "ladies" && (
                <div className="jstep"><span className="num">2</span><div><b>Expect a quick call</b><span>For the Ladies&apos; Pass we call to verify you before your group. It takes a minute.</span></div></div>
              )}
              <div className="jstep"><span className="num">{pass === "ladies" ? 3 : 2}</span><div><b>Get the SyncTrip app</b><span>Log in with the same number. Your group chat opens there once your group is made.</span></div></div>
              <div className="jstep"><span className="num">{pass === "ladies" ? 4 : 3}</span><div><b>Show up and say hi</b><span>If we can&apos;t make your group for this date, you get a full refund within 48 hours.</span></div></div>
            </div>
            <div className="store-row">
              <a className="sbtn sbtn-primary" href={play}><Ico name="i-download" />Get it on Google Play</a>
              <a className="sbtn sbtn-navy" href={ios}><Ico name="i-download" />Download on the App Store</a>
            </div>
          </div>
          <div className="jphone">
            <div className="frame"><img src="/home/app-home.webp" alt="SyncTrip app" /></div>
            <div className="note">
              <span className="wait-ico" style={{ width: 34, height: 34, borderRadius: "50%", flex: "none", display: "grid", placeItems: "center", background: "var(--primary-4)", color: "var(--primary)" }}><Ico name="i-calendar" /></span>
              <div><b>{when || "Your date"}</b><small>Group details on WhatsApp the evening before</small></div>
            </div>
          </div>
        </div>
      </div>
      <CategoryFooter current={category} blurb="Meet new people at fun plans every week in Chandigarh, Mohali & Panchkula." />
    </div>
  );
}
