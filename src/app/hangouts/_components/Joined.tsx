import { appStoreUrl, playStoreUrl } from "@/lib/storeLinks";
import { CategoryFooter, Ico } from "./Shell";
import type { Category } from "../_lib/links";

const WHAT: Record<Exclude<Category, "events">, { thing: string; place: string }> = {
  movies: { thing: "movie group", place: "the cinema, show and your seats" },
  hangouts: { thing: "hangout group", place: "the plan and the café" },
  sports: { thing: "game", place: "the court, time and your team" },
};

/**
 * Shown after someone pays on movies./hangouts./sports. Everything after this
 * happens in the app: updates, the group, the chat, finishing the profile.
 */
export default function Joined({ category }: { category: Exclude<Category, "events"> }) {
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
            <h1>You&apos;re in.<br />Now get the app.</h1>
            <p className="lead">
              We&apos;re finding your {w.thing}. From here on, <b>every update comes only through the SyncTrip app</b>: your group, {w.place}, and the group chat.
            </p>
            <div className="jsteps">
              <div className="jstep"><span className="num">1</span><div><b>Download SyncTrip</b><span>Log in with the same phone number you just used.</span></div></div>
              <div className="jstep"><span className="num">2</span><div><b>Finish your profile</b><span>Add a photo and do the quick selfie check. Verified profiles get matched first.</span></div></div>
              <div className="jstep"><span className="num">3</span><div><b>Wait for your group</b><span>You&apos;ll see &quot;Finding your group…&quot; in the app. Usually 3-5 days. Full refund if we can&apos;t match you in 14.</span></div></div>
              <div className="jstep"><span className="num">4</span><div><b>Say hi in the group chat</b><span>When your group is ready, the chat opens and you get a notification.</span></div></div>
            </div>
            <div className="store-row">
              <a className="sbtn sbtn-primary" href={play}><Ico name="i-download" />Get it on Google Play</a>
              <a className="sbtn sbtn-navy" href={ios}><Ico name="i-download" />Download on the App Store</a>
            </div>
          </div>
          <div className="jphone">
            <div className="frame"><img src="/home/app-home.webp" alt="SyncTrip app" /></div>
            <div className="note">
              <span className="spin" style={{ width: 34, height: 34, borderWidth: 3, borderStyle: "solid", borderColor: "var(--primary-4)", borderTopColor: "var(--primary)", borderRadius: "50%", flex: "none" }} />
              <div><b>Finding your {w.thing}…</b><small>We&apos;ll notify you in the app</small></div>
            </div>
          </div>
        </div>
      </div>
      <CategoryFooter current={category} blurb="Meet new people at fun plans every week in Chandigarh, Mohali & Panchkula." />
    </div>
  );
}
