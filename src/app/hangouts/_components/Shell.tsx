import type { ReactNode } from "react";
import { categoryHref, SITE, type Category } from "../_lib/links";

/** Line icon from /hangouts/icons.svg (one stroke style for every page). */
export function Ico({ name, className = "ico", style }: { name: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} aria-hidden="true">
      <use href={`/hangouts/icons.svg#${name}`} />
    </svg>
  );
}

export function IBox({ name, tone }: { name: string; tone?: "pink" | "green" | "navy" }) {
  return (
    <span className={`ibox${tone ? " " + tone : ""}`}>
      <Ico name={name} />
    </span>
  );
}

const TAGS: Record<Category, string> = { movies: "Movies", hangouts: "Hangouts", events: "Events", sports: "Sports" };

export function Nav({ category, links, cta }: { category: Category; links: [string, string][]; cta: string }) {
  return (
    <nav>
      <div className="wrap">
        <a className="brand" href="#top">
          <img src="/hangouts/img/logo.png" alt="SyncTrip" />
          <b>SyncTrip</b>
          <span className="tag">{TAGS[category]}</span>
        </a>
        <div className="links">
          {links.map(([href, label]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </div>
        <div className="nav-ctas">
          <a className="sbtn sbtn-light" href={SITE}>Get the app</a>
          <a className="sbtn sbtn-primary" href={category === "events" ? "#whats-on" : "#join"}>{cta}</a>
        </div>
      </div>
    </nav>
  );
}

/** Small round crops of real SyncTrip meetup photos. */
export function Proof({ children }: { children: ReactNode }) {
  const faces: [string, string][] = [
    ["/home/real-dinner.webp", "8% 60%"],
    ["/home/real-roundtable.webp", "40% 30%"],
    ["/home/real-dinner.webp", "75% 45%"],
    ["/home/real-roundtable.webp", "62% 40%"],
  ];
  return (
    <div className="proof">
      <div className="faces">
        {faces.map(([src, pos], i) => (
          <span key={i} style={{ backgroundImage: `url(${src})`, backgroundPosition: pos }} />
        ))}
      </div>
      <div>{children}</div>
    </div>
  );
}

export function Highlight({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span className="hl">
      {children}
      <svg viewBox="0 0 300 14" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 10 C 80 2, 200 2, 297 8" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export type SafeItem = { icon: string; tone?: "pink"; title: string; text: string };

export function SafetyGrid({ eyebrow, title, sub, items }: { eyebrow: string; title: string; sub: string; items: SafeItem[] }) {
  return (
    <div id="safety" className="safe-wrap">
      <div className="wrap">
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="h2">{title}</h2>
        <p className="sub">{sub}</p>
        <div className="safe-grid">
          {items.map((s) => (
            <div className="safe" key={s.title}>
              <div className="ic"><IBox name={s.icon} tone={s.tone} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const WOMEN_SAFETY: SafeItem[] = [
  { icon: "i-shield", title: "Verified profiles", text: "Phone and live selfie check before anyone is matched." },
  { icon: "i-women", tone: "pink", title: "Never the only woman", text: "Mixed groups have at least two women, or someone from the SyncTrip team comes along." },
  { icon: "i-store", title: "Public places only", text: "Busy cafés, cinemas and courts. No homes, no private venues." },
  { icon: "i-users", tone: "pink", title: "Women-only groups", text: "Prefer an all-girls group? Choose it and we'll match you only with women." },
  { icon: "i-eye", title: "Meet your group first", text: "Names, photos and the group mix show up in the app before the day." },
  { icon: "i-flag", title: "Report & block", text: "One tap to report or block. Anyone flagged is removed from future groups." },
];

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <section id="faq" style={{ paddingTop: 24 }}>
      <div className="wrap" style={{ textAlign: "center" }}>
        <div className="eyebrow">FAQ</div>
        <h2 className="h2">Good questions.</h2>
        <div className="faq" style={{ textAlign: "left" }}>
          {items.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Final({ title, text, cta, href = "#join" }: { title: ReactNode; text: string; cta: string; href?: string }) {
  return (
    <div className="final">
      <h2>{title}</h2>
      <p>{text}</p>
      <a className="sbtn" href={href}>{cta}</a>
    </div>
  );
}

const CATS: { c: Category; label: string; icon: string }[] = [
  { c: "movies", label: "Movies", icon: "movieIcon" },
  { c: "hangouts", label: "Hangouts", icon: "outingIcon" },
  { c: "events", label: "Events", icon: "clubsIcon" },
  { c: "sports", label: "Sports", icon: "sportIcon" },
];

export function CategoryFooter({ current, blurb }: { current: Category; blurb: string }) {
  return (
    <footer>
      <div className="wrap">
        <div className="foot">
          <div>
            <a className="brand" href={SITE}>
              <img src="/hangouts/img/logo.png" alt="" />
              <b>SyncTrip</b>
            </a>
            <p style={{ color: "var(--text-2)", marginTop: 10, maxWidth: 330 }}>{blurb}</p>
          </div>
          <div>
            <div className="eyebrow">More ways to meet</div>
            <div className="cats">
              {CATS.map(({ c, label, icon }) => (
                <a key={c} className={c === current ? "cur" : undefined} href={c === current ? "#top" : categoryHref(c)}>
                  <img src={`/hangouts/icons/${icon}.png`} alt="" />
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="legal">
          © 2026 SyncTrip · <a href={`${SITE}/policies`}>Policies</a> · <a href={SITE}>synctrip.in</a>
        </p>
      </div>
    </footer>
  );
}

/** Left column next to the join form. */
export function JoinAside({ eyebrow, title, last }: { eyebrow: string; title: string; last: [string, string, string] }) {
  return (
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className="h2">{title}</h2>
      <div className="list">
        <div><IBox name="i-phone" /><div><b>Tell us about you</b>Name, birthday and phone. We create your SyncTrip profile.</div></div>
        <div><IBox name="i-shield" /><div><b>Pay securely</b>UPI, cards and wallets via Razorpay.</div></div>
        <div><IBox name="i-users" /><div><b>We make your group</b>Usually within 3-5 days. Full refund if not in 14.</div></div>
        <div><IBox name={last[0]} /><div><b>{last[1]}</b>{last[2]}</div></div>
      </div>
      <div className="waiting">
        <span className="spin" />
        <div><b>Finding your group…</b><small>What you&apos;ll see in the app while we match you</small></div>
      </div>
    </div>
  );
}

export function Steps({ items }: { items: [string, string, string][] }) {
  return (
    <section id="how">
      <div className="wrap">
        <div className="eyebrow">How it works</div>
        <h2 className="h2">You pick. We plan.<br />You just show up.</h2>
        <div className="steps">
          {items.map(([icon, title, text], i) => (
            <div className="step" key={title}>
              <div className="ic"><img src={`/hangouts/icons/${icon}.png`} alt="" /></div>
              <div className="n">Step {i + 1}</div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Included({ items }: { items: { icon: string; label: string; off?: boolean }[] }) {
  return (
    <div className="incl">
      {items.map((i) => (
        <span key={i.label} className={i.off ? "off" : undefined}>
          <IBox name={i.icon} tone={i.off ? undefined : "green"} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

export type PassCard = {
  pass: string;
  name: string;
  badge: string;
  amount: string;
  unit: string;
  fine: string;
  payIcon: string;
  payLine: ReactNode;
  bullets: string[];
  cta: string;
  ladies?: boolean;
};

export function PriceCards({ cards, note }: { cards: PassCard[]; note: string }) {
  return (
    <>
      <div className="prices" style={{ textAlign: "left" }}>
        {cards.map((c) => (
          <div key={c.pass} className={`sprice${c.ladies ? " ladies" : ""}`}>
            <div className="top">{c.name} <span className="sbadge">{c.badge}</span></div>
            <div className="amt">{c.amount} <small>{c.unit}</small></div>
            <p className="fine">{c.fine}</p>
            <div className="pay-line"><Ico name={c.payIcon} /><span>{c.payLine}</span></div>
            <ul>{c.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <a className={`sbtn ${c.ladies ? "sbtn-pink" : "sbtn-navy"}`} href={`#join-${c.pass}`}>{c.cta}</a>
          </div>
        ))}
      </div>
      <p className="sprice-note">{note}</p>
    </>
  );
}
