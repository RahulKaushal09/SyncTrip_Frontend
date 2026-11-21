"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Ico } from "./Shell";
import { useMoviePicks } from "./MoviePicks";
import { portrait, type Slot } from "../_lib/api";
import type { RazorpayCheckoutResponse } from "@/app/checkout/checkout.types";

export type Variant = "movies" | "hangouts" | "sports";
type Pass = "solo" | "ladies" | "duo";
type Gender = "female" | "male" | "other";

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
/** The pass cards for the picked date: its own prices if it has them. */
function passesFor(variant: Variant, slot: Slot | null): Record<Pass, PassInfo> {
  const base = PASSES[variant];
  const p = slot?.prices;
  if (!p) return base;
  const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  // A date priced on its own (e.g. a small evening meetup) may not include the standard meal / court.
  const own = !!slot?.ownPrices && variant !== "movies";
  return {
    solo: { ...base.solo, price: rupees(p.solo), amount: rupees(p.solo), line: own ? "Price for this date · we put you in a group" : base.solo.line },
    ladies: { ...base.ladies, price: rupees(p.ladies), amount: rupees(p.ladies), line: own ? `Price for this date · ${rupees(p.ladies)} back as credit when you check in` : base.ladies.line.replace("₹99", rupees(p.ladies)) },
    duo: { ...base.duo, price: rupees(p.duo), amount: rupees(p.duo), line: own ? "You + a friend · one payment for both" : base.duo.line },
  };
}

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

/**
 * Sign-up form. People book one of the open dates (`slots`, set in the panel); the date
 * decides the day, time and area. With no open date the form is replaced by "coming soon".
 */
export default function JoinWizard({ variant, slots = [] }: { variant: Variant; slots?: Slot[] }) {
  const picks = useMoviePicks();
  const [slotId, setSlotId] = useState(() => slots.find((s) => !s.full)?.id || "");
  const slot = slots.find((s) => s.id === slotId) || null;
  // "Invite a friend" links from the app carry ?slot=<id>: start on that date if it's still bookable.
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("slot");
    if (wanted && slots.some((s) => s.id === wanted && !s.full)) setSlotId(wanted);
  }, [slots]);

  // Answers
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

  const toggle = (list: string[], set: (v: string[]) => void, v: string, max = 99) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : list.length >= max ? list : [...list, v]);

  const steps = useMemo(() => {
    const s: { name: string; valid: boolean }[] = [];
    // The date comes first; a date with its own film / sport skips that question.
    s.push({ name: "Date", valid: !!slot && !slot.full });
    if (variant === "movies" && !slot?.movie) s.push({ name: "Movies", valid: (picks?.picked.size || 0) > 0 || !!picks?.anyMovie });
    if (variant === "sports") {
      if (!slot?.sport) s.push({ name: "Sport", valid: sports.length > 0 });
      s.push({ name: "Level", valid: !!level && !!gear });
    }
    if (variant === "hangouts") s.push({ name: "Vibe", valid: !!food && vibes.length > 0 });
    s.push({ name: "You", valid: name.trim().length >= 2 && !!gender && isAdult(dob) && validPhone(phone) });
    s.push({ name: "Pass", valid: true });
    return s;
  }, [variant, slot, picks, sports, level, gear, food, vibes, name, gender, dob, phone]);

  const step = steps[Math.min(cur, steps.length - 1)];
  const last = cur === steps.length - 1;
  const passes = passesFor(variant, slot);
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

  // "Continue with my picks" under the movie rail: go to the first question still open.
  useEffect(() => {
    if (!picks?.jump) return;
    const open = steps.findIndex((s) => !s.valid);
    setCur(open < 0 ? steps.length - 1 : open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picks?.jump]);

  async function submit() {
    setSending(true);
    setError("");
    // The date sets the day, time and area on the server.
    const body = {
      category: variant,
      cityId: "b536b222-3661-4c60-9695-f34c7a5519d4",
      slotId,
      name: name.trim(),
      gender,
      dateOfBirth: dob,
      phone: "+91" + phone,
      prefs: {
        movies: variant === "movies" && !slot?.movie ? (picks?.anyMovie ? ["any"] : Array.from(picks?.picked || [])) : undefined,
        sports: variant === "sports" && !slot?.sport ? sports : undefined,
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
        const q = new URLSearchParams({ when: slot?.label || "", where: [slot?.venueName, slot?.area].filter(Boolean).join(", "), pass });
        window.location.href = `${window.location.pathname.replace(/\/$/, "")}/joined?${q}`;
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
  if (!slots.length) {
    return (
      <div className="scard wiz-closed" id="wiz">
        <h3>Next date coming soon</h3>
        <p>We open a few fixed dates at a time so every group fills up. Follow <b>@synctrips</b> on Instagram to hear first.</p>
      </div>
    );
  }

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

      {step.name === "Date" && (
        <div className="wstep on">
          <h3>Pick your date</h3>
          <p className="hint">Everyone who books the same date goes into one group. Chandigarh Tricity only for now.</p>
          <div className="passes">
            {slots.map((d) => (
              <div key={d.id} className={`pass slot${slotId === d.id ? " on" : ""}${d.full ? " full" : ""}`} onClick={() => !d.full && setSlotId(d.id)}>
                <span className="radio" />
                <div className="txt">
                  <b>{d.label}</b>
                  <small>{[d.movie?.name || d.title, d.venueName, d.area].filter(Boolean).join(" · ")}</small>
                  {!d.full && <small className="by">{d.ownPrices && d.prices ? <b className="slot-price">₹{d.prices.solo.toLocaleString("en-IN")} {variant === "sports" ? "per player" : "per person"}</b> : null}Book by {d.cutoffLabel}</small>}
                </div>
                {d.full && <span className="slot-full">Full</span>}
              </div>
            ))}
          </div>
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
          <p className="hint">{slot?.ownPrices && variant !== "movies" ? `Prices for ${slot.label}${slot.title ? ` · ${slot.title}` : ""}.` : PASS_HINT[variant]}</p>
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
            {variant === "movies" && <div><Ico name="i-ticket" /><span><b>Movie:</b> {slot?.movie?.name || movieSummary || "-"}</span></div>}
            {variant === "sports" && <div><Ico name="i-ball" /><span><b>Sport:</b> {(slot?.sport ? SPORTS.filter((s) => s.key === slot.sport) : SPORTS.filter((s) => sports.includes(s.key))).map((s) => s.name).join(", ")} · {level}</span></div>}
            <div><Ico name="i-calendar" /><span><b>Date:</b> {slot?.label || "-"}</span></div>
            <div><Ico name="i-pin" /><span><b>Where:</b> {[slot?.venueName, slot?.area].filter(Boolean).join(", ") || "-"}{food ? ` · ${food}` : ""}</span></div>
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
