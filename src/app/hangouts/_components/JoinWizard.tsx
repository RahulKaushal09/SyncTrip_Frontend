"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Ico } from "./Shell";
import { useMoviePicks } from "./MoviePicks";
import { portrait } from "../_lib/api";
import type { RazorpayCheckoutResponse } from "@/app/checkout/checkout.types";

export type Variant = "movies" | "hangouts" | "sports";
type Pass = "solo" | "ladies" | "duo";
type Gender = "female" | "male" | "other";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const WEEKENDS = ["Sat", "Sun"];
const AREAS = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Kharar", "New Chandigarh"];
const VIBES: [string, string][] = [
  ["i-chat", "Talker"], ["i-headphones", "Chill listener"], ["i-meal", "Foodie"], ["i-smile", "Friendly"],
  ["i-sparkle", "First time"], ["i-cap", "Student"], ["i-briefcase", "Working"], ["i-nodrink", "Non-drinker"],
];
export const SPORTS = [
  { key: "badminton", name: "Badminton", icon: "Badminton" },
  { key: "football", name: "Football", icon: "Football" },
  { key: "pickleball", name: "Pickleball", icon: "Pickleball" },
  { key: "cricket", name: "Cricket", icon: "Cricket" },
  { key: "tennis", name: "Tennis", icon: "Tennis" },
  { key: "squash", name: "Squash", icon: "Squash" },
];
const LEVELS: [string, string, string][] = [["Beginner", "Beginner", "Here to learn"], ["Intermediate", "Intermediate", "Can rally"], ["Pro", "Hard", "Play often"]];

type PassInfo = { name: string; price: string; amount: string; unit?: string; line: string };
const PASSES: Record<Variant, Record<Pass, PassInfo>> = {
  movies: {
    solo: { name: "Solo Pass", price: "₹449", amount: "₹449", line: "1 ticket included · we put you in a group" },
    ladies: { name: "Ladies' Pass", price: "₹99", amount: "₹99", unit: "refundable", line: "Free ticket · ₹99 back as credit when you show up" },
    duo: { name: "Duo Pass", price: "₹799", amount: "₹799", unit: "for both", line: "2 tickets included · you + a friend" },
  },
  hangouts: {
    solo: { name: "Solo Pass", price: "₹449", amount: "₹449", line: "1 meal up to ₹250 · we put you in a group" },
    ladies: { name: "Ladies' Pass", price: "₹99", amount: "₹99", unit: "refundable", line: "Free meal up to ₹250 · ₹99 back as credit when you check in" },
    duo: { name: "Duo Pass", price: "₹849", amount: "₹849", unit: "for both", line: "You + a friend · 2 meals, up to ₹250 each" },
  },
  sports: {
    solo: { name: "Player Pass", price: "₹249", amount: "₹249", line: "Court fee included · we put you in a game" },
    ladies: { name: "Ladies' Pass", price: "₹99", amount: "₹99", unit: "refundable", line: "Free court · ₹99 back as credit when you check in" },
    duo: { name: "Duo Pass", price: "₹449", amount: "₹449", unit: "for both", line: "You + a partner · court fee for both" },
  },
};
const PASS_HINT: Record<Variant, string> = {
  movies: "Movie ticket is included in every pass.",
  hangouts: "Every pass includes a meal worth up to ₹250 per person.",
  sports: "Your court fee is included in every pass.",
};

type CreateResponse = {
  requestId: string;
  token: string;
  checkout: { orderId: string; amount: number; currency: string; keyId: string; name: string; description: string; prefill: { name: string; contact: string } };
};

/** POST to the backend; throws the backend's own message on failure. */
async function api<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.success === false) throw new Error(json.message || json.error || "Something went wrong. Try again.");
  return json as T;
}

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";
function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = RAZORPAY_SRC;
    s.async = true;
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** utm_* from the landing URL, so the backend knows which ad brought them. */
function utm() {
  const q = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => { const v = q.get(k); if (v) out[k] = v.slice(0, 120); });
  return Object.keys(out).length ? out : undefined;
}

const TICK = (
  <svg width="12" height="12" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Indian mobile; in dev also the backend's built-in test numbers (OTP 6345). */
const validPhone = (p: string) => /^[6-9]\d{9}$/.test(p) || (process.env.NODE_ENV !== "production" && /^1234512\d{3}$/.test(p));

/** 18th birthday on or before today. */
function isAdult(dob: string) {
  if (!dob) return false;
  const d = new Date(dob);
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);
  return d <= cutoff && d.getFullYear() > 1930;
}
const maxDob = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return d.toISOString().slice(0, 10);
};

function Chips({ options, selected, onToggle, none }: { options: ReactNode[]; selected: number[]; onToggle: (i: number) => void; none?: number }) {
  return (
    <div className="opts">
      {options.map((o, i) => (
        <button type="button" key={i} className={`opt${selected.includes(i) ? " on" : ""}${i === none ? " none" : ""}`} onClick={() => onToggle(i)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export default function JoinWizard({ variant }: { variant: Variant }) {
  const picks = useMoviePicks();

  // Answers
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [weekends, setWeekends] = useState<string[]>([]);
  const [times, setTimes] = useState<string[]>(variant === "sports" ? [] : ["Evening"]);
  const [area, setArea] = useState("");
  const [food, setFood] = useState("");
  const [vibes, setVibes] = useState<string[]>([]);
  const [sports, setSports] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [gear, setGear] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState<Pass>("solo");
  // The pass tapped on a price card. The Ladies' Pass can't apply until the gender is "Woman",
  // so it is remembered here instead of being reset to Solo straight away.
  const [want, setWant] = useState<Pass | null>(null);
  const [womenOnly, setWomenOnly] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [cur, setCur] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const timeOptions = variant === "sports" ? ["Early morning", "Morning", "Evening", "Night"] : ["Morning", "Afternoon", "Evening", "Night"];
  const weekdayNone = weekdays.includes("none");
  const weekendNone = weekends.includes("none");
  const anyDay = weekdays.filter((d) => d !== "none").length + weekends.filter((d) => d !== "none").length > 0;
  const whenAnswered = weekdays.length > 0 && weekends.length > 0 && times.length > 0;

  const toggle = (list: string[], set: (v: string[]) => void, v: string, max = 99) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : list.length >= max ? list : [...list, v]);
  const toggleDays = (list: string[], set: (v: string[]) => void, v: string) => {
    if (v === "none") set(list.includes("none") ? [] : ["none"]);
    else set(list.includes(v) ? list.filter((x) => x !== v) : [...list.filter((x) => x !== "none"), v]);
  };

  const steps = useMemo(() => {
    const s: { name: string; valid: boolean }[] = [];
    if (variant === "movies") s.push({ name: "Movies", valid: (picks?.picked.size || 0) > 0 || !!picks?.anyMovie });
    if (variant === "sports") {
      s.push({ name: "Sport", valid: sports.length > 0 });
      s.push({ name: "Level", valid: !!level && !!gear });
    }
    s.push({ name: "When", valid: whenAnswered && anyDay });
    s.push({ name: "Area", valid: !!area });
    if (variant === "hangouts") s.push({ name: "Vibe", valid: !!food && vibes.length > 0 });
    s.push({ name: "You", valid: name.trim().length >= 2 && !!gender && isAdult(dob) && validPhone(phone) });
    s.push({ name: "Pass", valid: true });
    return s;
  }, [variant, picks, sports, level, gear, whenAnswered, anyDay, area, food, vibes, name, gender, dob, phone]);

  const step = steps[cur];
  const last = cur === steps.length - 1;
  const passes = PASSES[variant];
  const available: Pass[] = gender === "female" ? ["solo", "ladies", "duo"] : ["solo", "duo"];

  // Ladies' Pass only for women; switch back if gender changes.
  useEffect(() => {
    if (pass === "ladies" && gender !== "female") setPass("solo");
  }, [gender, pass]);

  // A remembered Ladies' Pass applies as soon as the person says they are a woman.
  useEffect(() => {
    if (want === "ladies" && gender === "female") setPass("ladies");
  }, [want, gender]);

  // Bring the form card (not the section heading above it) to just under the sticky bar.
  const showForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // Price cards link to #join-solo / #join-ladies / #join-duo.
  useEffect(() => {
    const onHash = () => {
      const m = window.location.hash.match(/^#join-(solo|ladies|duo)$/);
      if (!m) return;
      const p = m[1] as Pass;
      setWant(p);
      // Ladies waits for the gender step; until then show Solo's price rather than a stale Duo.
      if (p === "ladies") setPass((prev) => (prev === "duo" ? "solo" : prev));
      else setPass(p);
      showForm();
      history.replaceState(null, "", window.location.pathname + window.location.search);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [showForm]);

  // Next / Back change the card's height. If its top has scrolled up under the sticky bar, bring it
  // back, so people stay at the form instead of having to scroll up to find it.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const top = formRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 80) showForm();
  }, [cur, showForm]);

  // "Continue with my picks" under the movie rail.
  useEffect(() => {
    if (picks?.jump) setCur(steps[0].valid ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picks?.jump]);

  async function submit() {
    setSending(true);
    setError("");
    const body = {
      category: variant,
      cityId: "b536b222-3661-4c60-9695-f34c7a5519d4",
      name: name.trim(),
      gender,
      dateOfBirth: dob,
      phone: "+91" + phone,
      availability: {
        weekdays: weekdayNone ? [] : weekdays,
        weekends: weekendNone ? [] : weekends,
        timeOfDay: times,
      },
      area,
      prefs: {
        movies: variant === "movies" ? (picks?.anyMovie ? ["any"] : Array.from(picks?.picked || [])) : undefined,
        sports: variant === "sports" ? sports : undefined,
        level: level || undefined,
        gear: gear || undefined,
        food: food || undefined,
        vibes,
      },
      pass,
      groupType: pass === "ladies" && womenOnly ? "women_only" : "mixed",
    };
    // Flow (backend: routes/hangouts.routes.js):
    //   1. POST /hangouts/web/otp       → SMS code
    //   2. POST /hangouts/requests      form + OTP → user + request + Razorpay order
    //   3. Razorpay checkout → POST /hangouts/requests/:id/verify → "You're in" page
    try {
      if (!otpSent) {
        await api("/hangouts/web/otp", { phone });
        setOtpSent(true);
        setSending(false);
        return;
      }
      const created = await api<CreateResponse>("/hangouts/requests", { ...body, otp, attribution: utm() });
      const finish = async (resp: RazorpayCheckoutResponse) => {
        try {
          await api(`/hangouts/requests/${created.requestId}/verify`, { token: created.token, ...resp });
        } catch {
          // Money went through Razorpay; the team re-checks it from the panel. Don't show a scary error.
        }
        window.location.href = `${window.location.pathname.replace(/\/$/, "")}/joined`;
      };
      if (created.checkout.keyId === "dev") {
        // Local backend with HANGOUTS_DEV_PAYMENTS=1: no real payment.
        await finish({ razorpay_order_id: created.checkout.orderId, razorpay_payment_id: "dev_pay", razorpay_signature: "dev" });
        return;
      }
      if (!(await loadRazorpay()) || !window.Razorpay) throw new Error("Payment couldn't load. Check your connection and try again.");
      const rzp = new window.Razorpay({
        key: created.checkout.keyId,
        order_id: created.checkout.orderId,
        amount: created.checkout.amount,
        currency: created.checkout.currency,
        name: created.checkout.name,
        description: created.checkout.description,
        prefill: created.checkout.prefill,
        theme: { color: "#3ABEF5" },
        handler: finish,
        modal: { ondismiss: () => { setError("Payment not completed. Tap pay to try again."); setSending(false); } },
      });
      rzp.on("payment.failed", () => setError("The payment failed. No money was taken. Try again or use another method."));
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setSending(false);
    }
  }

  const movieSummary = picks?.anyMovie
    ? "Any movie"
    : Array.from(picks?.picked || []).slice(0, 3).join(", ") + ((picks?.picked.size || 0) > 3 ? ` +${(picks?.picked.size || 0) - 3} more` : "");
  const dayText = [...weekdays, ...weekends].filter((d) => d !== "none").join(", ");

  return (
    <form className="scard" id="wiz" ref={formRef} onSubmit={(e) => e.preventDefault()}>
      <div className="wiz-top">
        <span>Step <b>{cur + 1}</b> of {steps.length}</span>
        <span>{step.name}</span>
      </div>
      <div className="wiz-bar"><i style={{ width: `${((cur + 1) / steps.length) * 100}%` }} /></div>
      {want && !last && (
        <div className="pass-chip">
          <Ico name="i-check" />
          {want === "ladies" && gender !== "female"
            ? "Ladies' Pass saved. It applies when you choose Woman."
            : `${passes[pass].name} selected · ${passes[pass].price}`}
        </div>
      )}

      {step.name === "Movies" && picks && (
        <div className="wstep on">
          <h3>Which movies would you watch?</h3>
          <p className="hint">Tap all you like. More picks = faster match.</p>
          <div className="pgrid">
            {picks.movies.map((m) => (
              <div key={m.id} className={`pm${picks.picked.has(m.title) ? " on" : ""}`} onClick={() => picks.toggle(m.title)}>
                <div className="art">
                  <img loading="lazy" src={portrait(m.image, 200, 268)} alt={m.title} />
                  <span className="tick">{TICK}</span>
                </div>
                <p>{m.title}</p>
              </div>
            ))}
          </div>
          <div className="opts anymovie">
            <button type="button" className={`opt${picks.anyMovie ? " on" : ""}`} onClick={picks.toggleAny}>I&apos;m fine with any movie</button>
          </div>
        </div>
      )}

      {step.name === "Sport" && (
        <div className="wstep on">
          <h3>What do you play?</h3>
          <p className="hint">Pick all you&apos;d play. More picks = faster match.</p>
          <div className="spick">
            {SPORTS.map((s) => (
              <div key={s.key} className={`spk${sports.includes(s.key) ? " on" : ""}`} onClick={() => toggle(sports, setSports, s.key)}>
                <span className="tick">{TICK}</span>
                <img src={`/hangouts/icons/sport-${s.icon}.png`} alt="" />
                <b>{s.name}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {step.name === "Level" && (
        <div className="wstep on">
          <h3>How do you play?</h3>
          <p className="hint">Be honest. It keeps the game fun for everyone.</p>
          <div className="lvpick">
            {LEVELS.map(([lv, icon, sub]) => (
              <div key={lv} className={`lvp${level === lv ? " on" : ""}`} onClick={() => setLevel(lv)}>
                <img src={`/hangouts/icons/level-${icon}.png`} alt="" />
                <b>{lv}</b>
                <small>{sub}</small>
              </div>
            ))}
          </div>
          <div className="wgroup" style={{ marginTop: 18 }}>
            <span>Gear</span>
            <Chips options={["I have my own racket / shoes", "I'll need to rent"]} selected={gear ? [gear === "own" ? 0 : 1] : []} onToggle={(i) => setGear(i === 0 ? "own" : "rent")} />
          </div>
        </div>
      )}

      {step.name === "When" && (
        <div className="wstep on">
          <h3>When are you free?</h3>
          <p className="hint">Answer all three. More options = faster match.</p>
          <div className="wgroup"><span>Weekdays</span>
            <Chips options={[...WEEKDAYS, "No weekdays"]} none={5}
              selected={weekdayNone ? [5] : weekdays.map((d) => WEEKDAYS.indexOf(d))}
              onToggle={(i) => toggleDays(weekdays, setWeekdays, i === 5 ? "none" : WEEKDAYS[i])} />
          </div>
          <div className="wgroup"><span>Weekends</span>
            <Chips options={[...WEEKENDS, "No weekends"]} none={2}
              selected={weekendNone ? [2] : weekends.map((d) => WEEKENDS.indexOf(d))}
              onToggle={(i) => toggleDays(weekends, setWeekends, i === 2 ? "none" : WEEKENDS[i])} />
          </div>
          <div className="wgroup"><span>Time of day</span>
            <Chips options={timeOptions} selected={times.map((t) => timeOptions.indexOf(t))} onToggle={(i) => toggle(times, setTimes, timeOptions[i])} />
          </div>
          {weekdays.length > 0 && weekends.length > 0 && !anyDay && (
            <p className="hint" style={{ color: "var(--cinema)", margin: 0 }}>You need at least one day, on a weekday or the weekend.</p>
          )}
        </div>
      )}

      {step.name === "Area" && (
        <div className="wstep on">
          <h3>Where will you come from?</h3>
          <p className="hint">We&apos;ll pick a place close to everyone in your group. Chandigarh Tricity only for now.</p>
          <Chips options={AREAS} selected={area ? [AREAS.indexOf(area)] : []} onToggle={(i) => setArea(AREAS[i])} />
        </div>
      )}

      {step.name === "Vibe" && (
        <div className="wstep on">
          <h3>A little about you</h3>
          <p className="hint">So your table clicks, and the café gets your food right.</p>
          <div className="wgroup"><span>Food</span>
            <Chips options={["Veg", "Non-veg", "Jain"]} selected={food ? [["Veg", "Non-veg", "Jain"].indexOf(food)] : []} onToggle={(i) => setFood(["Veg", "Non-veg", "Jain"][i])} />
          </div>
          <div className="wgroup"><span>You at a table · up to 3</span>
            <Chips options={VIBES.map(([icon, label]) => <><Ico name={icon} />{label}</>)}
              selected={vibes.map((v) => VIBES.findIndex(([, l]) => l === v))}
              onToggle={(i) => toggle(vibes, setVibes, VIBES[i][1], 3)} />
          </div>
        </div>
      )}

      {step.name === "You" && (
        <div className="wstep on">
          <h3>Tell us about you</h3>
          <p className="hint">We create your SyncTrip profile with this. You finish it in the app.</p>
          <div className="fields">
            <label className="field"><span>Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
            </label>
            <div className="field"><span>Gender</span>
              <Chips options={["Woman", "Man", "Other"]}
                selected={gender ? [["female", "male", "other"].indexOf(gender)] : []}
                onToggle={(i) => setGender((["female", "male", "other"] as Gender[])[i])} />
            </div>
            <label className="field"><span>Date of birth</span>
              <input type="date" value={dob} max={maxDob()} onChange={(e) => setDob(e.target.value)} />
              {dob && !isAdult(dob) && <em>You need to be 18 or older.</em>}
            </label>
            <label className="field"><span>Phone number</span>
              <div className="phone-in"><b>+91</b>
                <input inputMode="numeric" value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setOtpSent(false); setOtp(""); }} placeholder="10-digit mobile" autoComplete="tel-national" />
              </div>
              <small>We&apos;ll send a one-time code to verify it.</small>
            </label>
          </div>
        </div>
      )}

      {step.name === "Pass" && (
        <div className="wstep on">
          <h3>Choose your pass</h3>
          <p className="hint">{PASS_HINT[variant]}</p>
          <div className="passes">
            {available.map((p) => (
              <div key={p} className={`pass${p === "ladies" ? " ladies" : ""}${pass === p ? " on" : ""}`} onClick={() => setPass(p)}>
                <span className="radio" />
                <div className="txt"><b>{passes[p].name}</b><small>{passes[p].line}</small></div>
                <div className="amt2">{passes[p].amount}{passes[p].unit && <small>{passes[p].unit}</small>}</div>
              </div>
            ))}
          </div>
          {pass === "ladies" && (
            <div className="opts subopt on">
              <button type="button" className={`opt${!womenOnly ? " on" : ""}`} onClick={() => setWomenOnly(false)}>Mixed group</button>
              <button type="button" className={`opt pink${womenOnly ? " on" : ""}`} onClick={() => setWomenOnly(true)}>Women-only group</button>
            </div>
          )}
          <div className="summary">
            {variant === "movies" && <div><Ico name="i-ticket" /><span><b>Movies:</b> {movieSummary || "-"}</span></div>}
            {variant === "sports" && <div><Ico name="i-ball" /><span><b>Sports:</b> {SPORTS.filter((s) => sports.includes(s.key)).map((s) => s.name).join(", ")} · {level}</span></div>}
            <div><Ico name="i-calendar" /><span><b>Free on:</b> {dayText || "-"} · {times.join(", ")}</span></div>
            <div><Ico name="i-pin" /><span><b>From:</b> {area}{food ? ` · ${food}` : ""}</span></div>
            <div><Ico name="i-users" /><span><b>{name}</b> · +91 {phone}</span></div>
          </div>
          {otpSent && (
            <label className="field" style={{ marginTop: 16 }}>
              <span>Code sent to +91 {phone}</span>
              <input inputMode="numeric" autoComplete="one-time-code" value={otp} placeholder="Enter the OTP"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} />
              <small>
                Didn&apos;t get it?{" "}
                <button type="button" className="sbtn-text" style={{ padding: 0, fontSize: 13 }} onClick={() => { setOtpSent(false); setOtp(""); }}>Send again</button>
              </small>
            </label>
          )}
          {error && <p className="wiz-error">{error}</p>}
        </div>
      )}

      <div className="wiz-foot">
        <button className="sbtn-text" type="button" style={{ visibility: cur === 0 ? "hidden" : "visible" }} onClick={() => setCur((c) => Math.max(0, c - 1))}>← Back</button>
        <button className="sbtn sbtn-primary" type="button" disabled={!step.valid || sending || (last && otpSent && otp.length < 4)}
          onClick={() => (last ? submit() : setCur((c) => c + 1))}>
          {last
            ? sending ? "Please wait…" : otpSent ? `Confirm & pay ${passes[pass].price}` : `Verify phone & pay ${passes[pass].price}`
            : "Next"}
        </button>
      </div>
    </form>
  );
}
