"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, BellRing, Check, CheckCircle2, MapPin, Minus, Plus, QrCode, ShieldCheck, Ticket, Users,
} from "lucide-react";
import type { ClubEvent, EventPass, EventQuestion } from "@/types";
import { APP_LINKS } from "@/constants/config";
import { appOpenUrl } from "@/utils/appDeepLink";
import {
  CheckoutError, CheckoutOrder, CheckoutQuote, PassQuote, book, getPassQuote, getQuote, sendOtp, verifyPayment,
} from "@/utils/clubCheckout.api";
import { captureWebAttribution, getWebAttribution } from "@/utils/webAttribution";
import { trackInitiateCheckout, trackPurchase } from "@/utils/adTracking";
import type { RazorpayCheckoutResponse } from "@/app/checkout/checkout.types";
import { formatWhen } from "./shareFormat";
import s from "./ClubBookingPage.module.css";

/**
 * /share/club-event/:id/book - booking on the website as a full page.
 *
 *   tickets (passes or seats) → questions + names → your details →
 *   "Verify & pay" → OTP → Razorpay → done
 *
 * Everything the buyer decides is on one page with a live summary beside it;
 * the OTP comes last so nobody is asked for a code before they've chosen.
 * Prices come from the server (quote-passes / quote), never totalled here.
 */

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const SUPPORT_EMAIL = "synctripofficial@gmail.com";
const rupees = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;
const people = (n: number) => `${n} ${n === 1 ? "person" : "people"}`;

type Gender = "male" | "female" | "other";
type Phase = "form" | "otp" | "paying" | "done" | "blocked";

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SRC}"]`);
    const el = existing || document.createElement("script");
    el.addEventListener("load", () => resolve(true));
    el.addEventListener("error", () => resolve(false));
    if (!existing) {
      el.src = RAZORPAY_SRC;
      el.async = true;
      document.body.appendChild(el);
    }
  });
}

const answered = (q: EventQuestion, v: unknown) => {
  if (q.type === "yes_no") return typeof v === "boolean";
  if (Array.isArray(v)) return v.length > 0;
  return v != null && String(v).trim() !== "";
};

function passBadge(p: EventPass): string | null {
  if (p.state === "sold_out") return "Sold out";
  if (p.state === "ended") return "Sales ended";
  if (p.state === "unavailable") return "Not available";
  if (p.remaining != null && p.remaining <= 5) return `Only ${p.remaining} left`;
  if (p.salesEndAt) {
    const ms = new Date(p.salesEndAt).getTime() - Date.now();
    if (ms > 0 && ms < 3 * 86400e3) return ms > 86400e3 ? `Ends in ${Math.floor(ms / 86400e3)}d` : "Ends today";
  }
  return null;
}

export default function ClubBookingPage({ event }: { event: ClubEvent }) {
  const passes = event.passes ?? null;
  const usesPasses = !!passes?.length;
  const eventPath = `/share/club-event/${event.id}`;
  const hero = event.coverImageUrl || event.media?.find((m) => m.type === "image")?.url || null;
  const maxPeople = Math.max(0, Math.min(event.pricing?.maxSeatsPerBooking ?? 4, event.seatsLeft ?? 0));
  const classicFree = !usesPasses && !!event.pricing?.isFree;

  // ── Selection ───────────────────────────────────────────────────────────
  const [cart, setCart] = useState<Record<string, number>>(() => {
    const onSale = (passes ?? []).filter((p) => p.state === "on_sale");
    return onSale.length === 1 ? { [onSale[0].id]: 1 } : {};
  });
  const [seats, setSeats] = useState(1);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [names, setNames] = useState<string[]>([]);

  // ── You ─────────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);

  // ── Price ───────────────────────────────────────────────────────────────
  const [passQuote, setPassQuote] = useState<PassQuote | null>(null);
  const [seatQuote, setSeatQuote] = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>("form");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [blocked, setBlocked] = useState<CheckoutError | null>(null);
  const session = useRef<{ token: string; order: CheckoutOrder } | null>(null);
  const [paid, setPaid] = useState<{ seats: number; amount: number; free: boolean; summary?: string } | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  useEffect(() => { captureWebAttribution(); }, []);
  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const items = useMemo(
    () => Object.entries(cart).filter(([, q]) => q > 0).map(([passId, quantity]) => ({ passId, quantity })),
    [cart],
  );
  const cartPeople = useMemo(
    () => items.reduce((n, it) => n + it.quantity * (passes?.find((p) => p.id === it.passId)?.admits ?? 1), 0),
    [items, passes],
  );

  // ── Live price ──────────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    setQuoteError(null);
    if (usesPasses) {
      setPassQuote(null);
      if (!items.length) return;
      setQuoteLoading(true);
      const t = setTimeout(() => {
        getPassQuote(event.id, items)
          .then((q) => alive && setPassQuote(q))
          .catch((e) => alive && setQuoteError(e instanceof CheckoutError ? e.message : "Couldn't load the price"))
          .finally(() => alive && setQuoteLoading(false));
      }, 250);
      return () => { alive = false; clearTimeout(t); };
    }
    if (classicFree) return;
    setQuoteLoading(true);
    getQuote(event.id, seats)
      .then((q) => alive && setSeatQuote(q))
      .catch(() => alive && setSeatQuote(null))
      .finally(() => alive && setQuoteLoading(false));
    return () => { alive = false; };
  }, [event.id, usesPasses, items, seats, classicFree]);

  const questions: EventQuestion[] = useMemo(() => {
    if (!usesPasses) return [];
    if (passQuote) return passQuote.questions;
    const ids = items.map((i) => i.passId);
    return (event.questions ?? []).filter((q) => !q.passIds.length || q.passIds.some((id) => ids.includes(id)));
  }, [usesPasses, passQuote, event.questions, items]);

  const askNames = usesPasses && !!event.collectAttendeeNames;
  const nameCount = usesPasses ? (passQuote?.seats ?? cartPeople) : 0;
  useEffect(() => {
    if (!askNames) return;
    setNames((prev) => Array.from({ length: nameCount }, (_, i) => prev[i] ?? (i === 0 ? name : "")));
    // `name` deliberately not tracked - only seeds person 1 when the list grows.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [askNames, nameCount]);

  const isFreeTotal = usesPasses ? passQuote?.isFree === true : classicFree;
  const total = usesPasses ? passQuote?.amountPayable ?? 0 : classicFree ? 0 : seatQuote?.amountPayable ?? 0;
  const phoneDigits = phone.replace(/\D/g, "").slice(-10);
  const detailsValid = name.trim().length >= 2 && !!gender && /^[6-9]\d{9}$/.test(phoneDigits);
  const missingQuestions = questions.filter((q) => q.required && !answered(q, answers[q.id]));
  const namesMissing = askNames && names.filter((n) => n.trim()).length < nameCount;
  const cartReady = usesPasses ? items.length > 0 && !!passQuote : classicFree || !!seatQuote;

  const fail = (e: unknown) => {
    const err = e instanceof CheckoutError ? e : new CheckoutError("NETWORK", "Something went wrong. Please try again.");
    if (["ACCOUNT_BANNED", "ACCOUNT_DEACTIVATED", "ALREADY_BOOKED"].includes(err.code)) {
      setBlocked(err);
      setPhase("blocked");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError(err.message);
  };

  const requestOtp = async () => {
    setShowErrors(true);
    if (!cartReady) { setError(usesPasses ? "Choose at least one ticket." : "Couldn't load the price - refresh and try again."); return; }
    if (missingQuestions.length) { setError("Please answer the required questions."); return; }
    if (namesMissing) { setError(`Add the name of each person (${nameCount}).`); return; }
    if (!detailsValid) { setError("Add your name, gender and a valid mobile number."); return; }
    setBusy(true);
    setError(null);
    try {
      await sendOtp(phoneDigits);
      trackInitiateCheckout({ eventId: event.id, value: total, seats: usesPasses ? cartPeople : seats });
      setOtp("");
      setResendIn(30);
      setPhase("otp");
      // On phones the code box is in the summary, below the form.
      setTimeout(() => document.getElementById("bk-summary")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const openRazorpay = useCallback(async () => {
    const sess = session.current;
    if (!sess) return;
    const ready = await loadRazorpay();
    setPhase("paying");
    if (!ready || !window.Razorpay) {
      setError("Payment couldn't load. Check your connection and tap Pay again.");
      return;
    }
    const rzp = new window.Razorpay({
      key: sess.order.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
      order_id: sess.order.orderId,
      amount: Math.round(sess.order.amount * 100),
      currency: sess.order.currency || "INR",
      name: event.club?.name || "SyncTrip",
      description: usesPasses && passQuote ? `${event.title} · ${passQuote.summary}` : `${event.title} · ${sess.order.seats} seat${sess.order.seats === 1 ? "" : "s"}`,
      prefill: sess.order.prefill,
      theme: { color: "#3ABEF5" },
      handler: async (resp: RazorpayCheckoutResponse) => {
        setBusy(true);
        setError(null);
        let refunded = false;
        try {
          const result = await verifyPayment(event.id, sess.token, resp);
          refunded = result?.status === "refunded";
        } catch {
          setPendingConfirm(true);
        } finally {
          setBusy(false);
          if (refunded) {
            setError("Your hold expired before the payment completed, so the full amount has been refunded (5-7 working days). Tap Pay to book again.");
          } else {
            trackPurchase({
              bookingId: sess.order.bookingId, eventId: event.id, value: sess.order.amount, seats: sess.order.seats,
              phone: `+91${phoneDigits}`,
            });
            setPaid({ seats: sess.order.seats, amount: sess.order.amount, free: false, summary: passQuote?.summary });
            setPhase("done");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
      },
      modal: { ondismiss: () => setError("Payment not completed. Your tickets are held for a few minutes - tap Pay to try again.") },
    });
    rzp.on("payment.failed", () => setError("The payment failed. No money was taken - try again or use another method."));
    rzp.open();
  }, [event.id, event.title, event.club?.name, phoneDigits, usesPasses, passQuote]);

  const confirmOtp = async () => {
    if (otp.length < 4 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await book(event.id, {
        phone: phoneDigits, otp, name: name.trim(), gender: gender as string, attribution: getWebAttribution(),
        ...(usesPasses
          ? {
            items,
            answers: questions.filter((q) => answered(q, answers[q.id])).map((q) => ({ questionId: q.id, value: answers[q.id] as string })),
            ...(askNames ? { attendeeNames: names.map((n) => n.trim()) } : {}),
          }
          : { seats }),
      });
      if (res.free) {
        trackPurchase({ bookingId: "", eventId: event.id, value: 0, seats: res.seats, free: true });
        setPaid({ seats: res.seats, amount: 0, free: true, summary: passQuote?.summary });
        setPhase("done");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      session.current = { token: res.token, order: res.checkout };
      await openRazorpay();
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  // ── Done / blocked ──────────────────────────────────────────────────────
  if (phase === "done" && paid) {
    return (
      <div className={s.page}>
        <Backdrop hero={hero} />
        <main className={s.narrow}>
          <section className={`${s.glass} ${s.done}`}>
            <div className={s.doneIcon}><CheckCircle2 size={44} /></div>
            <h1 className={s.doneTitle}>You&apos;re in!</h1>
            <p className={s.doneSub}>
              {paid.summary || `${paid.seats} seat${paid.seats === 1 ? "" : "s"}`} for <strong>{event.title}</strong>
              {paid.free ? "" : ` · ${rupees(paid.amount)} paid`}
            </p>
            {pendingConfirm && (
              <div className={s.notice}>Payment received - we&apos;re confirming it with the bank. Your ticket will appear in the app within a few minutes.</div>
            )}
            <div className={s.perks}>
              <span><Ticket size={16} /> Your ticket</span>
              <span><QrCode size={16} /> Entry check-in</span>
              <span><MapPin size={16} /> Venue details</span>
              <span><BellRing size={16} /> Updates from the club</span>
            </div>
            <ol className={s.appSteps}>
              <li><span>1</span>Download <strong>SyncTrip</strong> from the Play Store or App Store.</li>
              <li><span>2</span>Log in with <strong>+91 {phoneDigits.slice(0, 5)} {phoneDigits.slice(5)}</strong> - the number you booked with.</li>
              <li><span>3</span>Open <strong>Chats</strong> - the <strong>{event.title}</strong> group is waiting, with your ticket inside.</li>
            </ol>
            <div className={s.storeRow}>
              <a className={s.ghostBtn} href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener">Google Play</a>
              <a className={s.ghostBtn} href={APP_LINKS.APP_STORE} target="_blank" rel="noopener">App Store</a>
            </div>
            <a className={s.primaryBtn} href={appOpenUrl(eventPath)}><Check size={18} /> Open the event in SyncTrip</a>
          </section>
        </main>
      </div>
    );
  }

  if (phase === "blocked" && blocked) {
    return (
      <div className={s.page}>
        <Backdrop hero={hero} />
        <main className={s.narrow}>
          <section className={s.glass}>
            <h1 className={s.sectionTitle}>Can&apos;t book here</h1>
            <p className={s.helper}>{blocked.message}</p>
            {blocked.code === "ACCOUNT_BANNED" ? (
              <a className={s.primaryBtn} href={`mailto:${blocked.supportEmail || SUPPORT_EMAIL}?subject=${encodeURIComponent(`Booking help: ${event.title}`)}`}>
                Email {blocked.supportEmail || SUPPORT_EMAIL}
              </a>
            ) : (
              <a className={s.primaryBtn} href={appOpenUrl(eventPath)}>Open this event in SyncTrip</a>
            )}
            <Link href={eventPath} className={s.backLink}>Back to the event</Link>
          </section>
        </main>
      </div>
    );
  }

  // ── The page ────────────────────────────────────────────────────────────
  const payLabel = busy ? null : isFreeTotal ? "Verify & reserve" : cartReady ? `Verify & pay ${rupees(total)}` : "Verify & pay";

  return (
    <div className={s.page}>
      <Backdrop hero={hero} />

      <header className={s.top}>
        <Link href={eventPath} className={s.back} aria-label="Back to the event">
          <ArrowLeft size={18} /> <span>Back to event</span>
        </Link>
        <div className={s.secure}><ShieldCheck size={16} /> Secure checkout</div>
      </header>

      <main className={s.layout}>
        <div className={s.col}>
          {/* Event */}
          <section className={`${s.glass} ${s.eventCard}`}>
            {hero && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero} alt="" className={s.eventImg} />
            )}
            <div>
              {event.club?.name && <div className={s.kicker}>{event.club.name}</div>}
              <h1 className={s.eventTitle}>{event.title}</h1>
              <div className={s.eventMeta}>{formatWhen(event.startsAt, event.endsAt ?? undefined)}</div>
              {(event.venue?.name || event.venue?.locality) && (
                <div className={s.eventMeta}><MapPin size={14} /> {[event.venue?.name, event.venue?.locality].filter(Boolean).join(" · ")}</div>
              )}
            </div>
          </section>

          {/* 1 · Tickets */}
          <section className={s.glass}>
            <div className={s.sectionHead}>
              <h2 className={s.sectionTitle}><span className={s.num}>1</span>{usesPasses ? "Choose your tickets" : "How many people?"}</h2>
              <span className={s.sectionHint}>{maxPeople > 0 ? `Up to ${people(maxPeople)} per booking` : "Sold out"}</span>
            </div>

            {usesPasses ? (
              <div className={s.passes}>
                {passes!.map((p) => {
                  const qty = cart[p.id] ?? 0;
                  const others = cartPeople - qty * p.admits;
                  let cap = Math.floor(Math.max(0, maxPeople - others) / Math.max(1, p.admits));
                  if (p.maxPerBooking != null) cap = Math.min(cap, p.maxPerBooking);
                  if (p.remaining != null) cap = Math.min(cap, p.remaining);
                  const off = p.state !== "on_sale";
                  const badge = passBadge(p);
                  return (
                    <article key={p.id} className={`${s.pass} ${qty > 0 ? s.passOn : ""} ${off ? s.passOff : ""}`}>
                      {p.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.imageUrl} alt={p.name} className={s.passImg} />
                      )}
                      <div className={s.passBody}>
                        <div className={s.passTop}>
                          <div>
                            <h3 className={s.passName}>{p.name}</h3>
                            <div className={s.badges}>
                              <span className={s.badge}><Users size={12} /> Admits {people(p.admits)}</span>
                              {badge && <span className={`${s.badge} ${off ? "" : s.badgeWarn}`}>{badge}</span>}
                            </div>
                          </div>
                          <div className={s.passPrice}>{p.price === 0 ? "Free" : rupees(p.price)}</div>
                        </div>
                        {p.description && <p className={s.passDesc}>{p.description}</p>}
                        {p.highlights.length > 0 && (
                          <ul className={s.highlights}>
                            {p.highlights.map((h) => <li key={h}><Check size={14} /> {h}</li>)}
                          </ul>
                        )}
                        {!off && (
                          <div className={s.passFoot}>
                            <span className={s.sectionHint}>
                              {qty > 0 ? people(qty * p.admits) : p.maxPerBooking ? `Max ${p.maxPerBooking} per booking` : " "}
                            </span>
                            <Stepper
                              value={qty}
                              max={qty + cap}
                              onChange={(v) => { setError(null); setCart((c) => ({ ...c, [p.id]: Math.max(0, v) })); }}
                              label={p.name}
                            />
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={s.seatRow}>
                <div>
                  <div className={s.passName}>{classicFree ? "Free entry" : `${rupees(event.tierInfo?.current?.price ?? event.pricing?.ticketPrice ?? 0)} per person`}</div>
                  {event.tierInfo?.current?.label && !classicFree && <div className={s.sectionHint}>{event.tierInfo.current.label} price</div>}
                </div>
                <Stepper value={seats} min={1} max={Math.max(1, maxPeople)} onChange={setSeats} label="seats" />
              </div>
            )}
          </section>

          {/* 2 · Questions + names */}
          {(questions.length > 0 || (askNames && nameCount > 0)) && (
            <section className={s.glass}>
              <div className={s.sectionHead}>
                <h2 className={s.sectionTitle}><span className={s.num}>2</span>A few questions from the club</h2>
              </div>
              <div className={s.form}>
                {questions.map((q) => (
                  <QuestionField
                    key={q.id}
                    q={q}
                    value={answers[q.id]}
                    error={showErrors && q.required && !answered(q, answers[q.id])}
                    onChange={(v) => { setError(null); setAnswers((a) => ({ ...a, [q.id]: v })); }}
                  />
                ))}
                {askNames && nameCount > 0 && (
                  <div>
                    <span className={s.label}>Who&apos;s coming? <em className={s.req}>*</em></span>
                    <div className={s.names}>
                      {names.map((n, i) => (
                        <input
                          key={i}
                          className={`${s.input} ${showErrors && !n.trim() ? s.inputError : ""}`}
                          value={n}
                          maxLength={60}
                          placeholder={`Person ${i + 1} - full name`}
                          onChange={(e) => setNames((arr) => arr.map((x, k) => (k === i ? e.target.value : x)))}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* 3 · You */}
          <section className={s.glass}>
            <div className={s.sectionHead}>
              <h2 className={s.sectionTitle}>
                <span className={s.num}>{questions.length || askNames ? 3 : 2}</span>Your details
              </h2>
            </div>
            <div className={s.form}>
              <div>
                <label className={s.label} htmlFor="bk-name">Full name</label>
                <input
                  id="bk-name" className={`${s.input} ${showErrors && name.trim().length < 2 ? s.inputError : ""}`}
                  value={name} maxLength={50} autoComplete="name" placeholder="As you'd like the club to see it"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <span className={s.label}>Gender</span>
                <div className={s.chips}>
                  {(["male", "female", "other"] as Gender[]).map((g) => (
                    <button key={g} type="button" onClick={() => setGender(g)} className={`${s.chip} ${gender === g ? s.chipOn : ""}`}>
                      {g === "male" ? "Male" : g === "female" ? "Female" : "Other"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={s.label} htmlFor="bk-phone">Mobile number</label>
                <div className={`${s.phoneWrap} ${showErrors && !/^[6-9]\d{9}$/.test(phoneDigits) ? s.inputError : ""}`}>
                  <span className={s.phonePrefix}>+91</span>
                  <input
                    id="bk-phone" className={s.phoneInput} inputMode="numeric" autoComplete="tel-national"
                    placeholder="98765 43210" value={phone} maxLength={11}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
                  />
                </div>
                <p className={s.helper}>Your ticket is linked to this number - log in to the SyncTrip app with it to see your ticket and the event chat.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Summary - sticky beside the form on desktop */}
        <aside className={s.side}>
          <section id="bk-summary" className={`${s.glass} ${s.summary}`}>
            <h2 className={s.sectionTitle}>Summary</h2>
            {usesPasses ? (
              passQuote ? passQuote.lines.map((l) => (
                <div key={l.passId} className={s.sumRow}><span>{l.quantity} × {l.name}</span><span>{l.lineTotal ? rupees(l.lineTotal) : "Free"}</span></div>
              )) : <div className={s.sumRow}><span className={s.muted}>{items.length ? (quoteLoading ? "Calculating…" : quoteError ?? "—") : "No tickets chosen yet"}</span></div>
            ) : classicFree ? (
              <div className={s.sumRow}><span>{seats} × seat</span><span>Free</span></div>
            ) : seatQuote ? (
              (seatQuote.tierLines?.length ? seatQuote.tierLines : [{ label: undefined, price: seatQuote.ticketPrice, seats: seatQuote.seats }]).map((l, i) => (
                <div key={i} className={s.sumRow}><span>{l.seats} × {l.label || "Ticket"}</span><span>{rupees(l.price * l.seats)}</span></div>
              ))
            ) : (
              <div className={s.sumRow}><span className={s.muted}>Calculating…</span></div>
            )}
            {!isFreeTotal && (usesPasses ? passQuote : seatQuote) && (usesPasses ? passQuote!.platformFee : seatQuote!.platformFee) > 0 && (
              <div className={s.sumRow}><span>Booking fee</span><span>{rupees(usesPasses ? passQuote!.platformFee : seatQuote!.platformFee)}</span></div>
            )}
            <div className={`${s.sumRow} ${s.sumTotal}`}>
              <span>Total</span>
              <span>{isFreeTotal && cartReady ? "Free" : cartReady ? rupees(total) : "—"}</span>
            </div>
            {usesPasses && passQuote && <p className={s.helper}>One ticket admits {people(passQuote.seats)}.</p>}
            {!isFreeTotal && (passQuote?.memberDiscountPercent || seatQuote?.memberDiscountPercent) ? (
              <p className={s.helper}>SyncTrip Plus members get {passQuote?.memberDiscountPercent ?? seatQuote?.memberDiscountPercent}% off - applied after you verify.</p>
            ) : null}
            {!isFreeTotal && (event.refundPolicyLines?.length ?? 0) > 0 && (
              <ul className={s.policy}>{event.refundPolicyLines!.map((l) => <li key={l}>{l}</li>)}</ul>
            )}

            {phase === "form" && (
              <>
                {error && <div className={s.error}>{error}</div>}
                <button type="button" className={`${s.primaryBtn} ${s.desktopOnly}`} disabled={busy} onClick={requestOtp}>
                  {busy ? <span className={s.spinner} /> : payLabel}
                </button>
              </>
            )}

            {phase === "otp" && (
              <div className={s.otpBox}>
                <p className={s.helper}>Enter the code sent to <strong>+91 {phoneDigits.slice(0, 5)} {phoneDigits.slice(5)}</strong></p>
                <input
                  className={s.otpInput} inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={6}
                  value={otp} placeholder="••••" onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  onKeyDown={(e) => e.key === "Enter" && confirmOtp()}
                />
                <div className={s.otpLinks}>
                  <button type="button" className={s.linkBtn} onClick={() => { setPhase("form"); setError(null); }}>Change details</button>
                  <button type="button" className={s.linkBtn} disabled={resendIn > 0} onClick={async () => { try { await sendOtp(phoneDigits); setResendIn(30); } catch (e) { fail(e); } }}>
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                  </button>
                </div>
                {error && <div className={s.error}>{error}</div>}
                <button type="button" className={s.primaryBtn} disabled={otp.length < 4 || busy} onClick={confirmOtp}>
                  {busy ? <span className={s.spinner} /> : isFreeTotal ? "Confirm my spot" : `Confirm & pay ${rupees(total)}`}
                </button>
              </div>
            )}

            {phase === "paying" && (
              <div className={s.otpBox}>
                <div className={s.notice}>{busy ? "Confirming your payment…" : "Complete the payment in the Razorpay window."}</div>
                {error && <div className={s.error}>{error}</div>}
                {!busy && <button type="button" className={s.primaryBtn} onClick={openRazorpay}>Pay {rupees(session.current?.order.amount ?? total)}</button>}
              </div>
            )}

            <div className={s.trust}><ShieldCheck size={15} /> Secure payment by Razorpay · UPI, cards, netbanking</div>
          </section>
        </aside>
      </main>

      {/* Phone: sticky pay bar */}
      {phase === "form" && (
        <div className={s.mobileBar}>
          {error && <div className={`${s.error} ${s.mobileError}`}>{error}</div>}
          <div>
            <div className={s.muted}>{usesPasses ? (items.length ? people(cartPeople) : "Choose tickets") : `${seats} ${seats === 1 ? "seat" : "seats"}`}</div>
            <div className={s.mobileTotal}>{isFreeTotal && cartReady ? "Free" : cartReady ? rupees(total) : "—"}</div>
          </div>
          <button type="button" className={s.primaryBtn} disabled={busy} onClick={requestOtp}>
            {busy ? <span className={s.spinner} /> : isFreeTotal ? "Verify & reserve" : "Verify & pay"}
          </button>
        </div>
      )}
    </div>
  );
}

function Backdrop({ hero }: { hero: string | null }) {
  return (
    <div className={s.backdrop} aria-hidden="true">
      {hero && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={hero} alt="" className={s.backdropImg} />
      )}
      <div className={s.backdropVeil} />
    </div>
  );
}

function Stepper({ value, min = 0, max, onChange, label }: { value: number; min?: number; max: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className={s.stepper}>
      <button type="button" disabled={value <= min} onClick={() => onChange(value - 1)} aria-label={`Fewer ${label}`}><Minus size={16} /></button>
      <span>{value}</span>
      <button type="button" className={value < max ? s.stepPlus : ""} disabled={value >= max} onClick={() => onChange(value + 1)} aria-label={`More ${label}`}><Plus size={16} /></button>
    </div>
  );
}

function QuestionField({ q, value, onChange, error }: { q: EventQuestion; value: unknown; onChange: (v: unknown) => void; error: boolean }) {
  const chip = (label: string, on: boolean, press: () => void) => (
    <button key={label} type="button" onClick={press} className={`${s.chip} ${on ? s.chipOn : ""}`}>{label}</button>
  );
  return (
    <div>
      <span className={s.label}>{q.label}{q.required && <em className={s.req}> *</em>}</span>
      {q.helpText && <p className={s.helper} style={{ marginTop: 0 }}>{q.helpText}</p>}
      {q.type === "short_text" || q.type === "number" ? (
        <input
          className={`${s.input} ${error ? s.inputError : ""}`}
          inputMode={q.type === "number" ? "decimal" : undefined}
          value={value == null ? "" : String(value)}
          maxLength={200}
          placeholder={q.type === "number" ? "0" : "Your answer"}
          onChange={(e) => onChange(q.type === "number" ? e.target.value.replace(/[^\d.]/g, "") : e.target.value)}
        />
      ) : q.type === "long_text" ? (
        <textarea
          className={`${s.input} ${s.textarea} ${error ? s.inputError : ""}`}
          value={value == null ? "" : String(value)} maxLength={1000} placeholder="Your answer"
          onChange={(e) => onChange(e.target.value)}
        />
      ) : q.type === "yes_no" ? (
        <div className={s.chips}>{chip("Yes", value === true, () => onChange(true))}{chip("No", value === false, () => onChange(false))}</div>
      ) : q.type === "single_choice" ? (
        <div className={s.chips}>{q.options.map((o) => chip(o, value === o, () => onChange(o)))}</div>
      ) : (
        <div className={s.chips}>
          {q.options.map((o) => {
            const arr = Array.isArray(value) ? (value as string[]) : [];
            const on = arr.includes(o);
            return chip(o, on, () => onChange(on ? arr.filter((x) => x !== o) : [...arr, o]));
          })}
        </div>
      )}
      {error && <p className={s.fieldError}>This one&apos;s required</p>}
    </div>
  );
}
