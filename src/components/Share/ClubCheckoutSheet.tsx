"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, BellRing, Check, MapPin, MessageCircle, QrCode, Ticket, X } from "lucide-react";
import type { ClubEvent } from "@/types";
import { APP_LINKS } from "@/constants/config";
import { appOpenUrl } from "@/utils/appDeepLink";
import {
  CheckoutError, CheckoutOrder, CheckoutQuote, book, getQuote, sendOtp, verifyPayment,
} from "@/utils/clubCheckout.api";
import { getWebAttribution } from "@/utils/webAttribution";
import { trackInitiateCheckout, trackPurchase } from "@/utils/adTracking";
import type { RazorpayCheckoutResponse } from "@/app/checkout/checkout.types";
import { formatWhen } from "./shareFormat";
import styles from "./ClubBooking.module.css";

/**
 * Website checkout for a club event. Steps:
 *   seats → your details (name, gender, phone) → OTP → Razorpay → done
 * The OTP is deliberately LAST: people decide and fill everything first.
 */

const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";
const SUPPORT_EMAIL = "synctripofficial@gmail.com";
const rupees = (n: number) => `₹${Math.round(n || 0).toLocaleString("en-IN")}`;

type Step = "seats" | "details" | "otp" | "paying" | "done" | "blocked";
type Gender = "male" | "female" | "other";

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SRC}"]`);
    const s = existing || document.createElement("script");
    s.addEventListener("load", () => resolve(true));
    s.addEventListener("error", () => resolve(false));
    if (!existing) {
      s.src = RAZORPAY_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
  });
}

type Props = {
  event: ClubEvent;
  onClose: () => void;
};

export default function ClubCheckoutSheet({ event, onClose }: Props) {
  const isFree = !!event.pricing?.isFree;
  const maxSeats = Math.max(1, Math.min(event.pricing?.maxSeatsPerBooking ?? 4, event.seatsLeft ?? 1));
  const appPath = `/share/club-event/${event.id}`;
  const heroImage = event.coverImageUrl || event.media?.find((m) => m.type === "image")?.url || null;

  const [step, setStep] = useState<Step>("seats");
  const [seats, setSeats] = useState(1);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(!isFree);

  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<CheckoutError | null>(null);

  // Kept after /book so a closed Razorpay window can be reopened without a new OTP.
  const session = useRef<{ token: string; order: CheckoutOrder } | null>(null);
  const [paid, setPaid] = useState<{ seats: number; amount: number; free: boolean } | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState(false);

  // ── Live price for the chosen seats ────────────────────────────────────
  useEffect(() => {
    if (isFree) return;
    let alive = true;
    setQuoteLoading(true);
    getQuote(event.id, seats)
      .then((q) => alive && setQuote(q))
      .catch(() => alive && setQuote(null))
      .finally(() => alive && setQuoteLoading(false));
    return () => {
      alive = false;
    };
  }, [event.id, seats, isFree]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  // Lock page scroll behind the sheet.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const total = isFree ? 0 : quote?.amountPayable ?? (event.pricing?.ticketPrice ?? 0) * seats;
  const phoneDigits = phone.replace(/\D/g, "").slice(-10);
  const detailsValid = name.trim().length >= 2 && !!gender && /^[6-9]\d{9}$/.test(phoneDigits);

  const fail = (e: unknown) => {
    const err = e instanceof CheckoutError ? e : new CheckoutError("NETWORK", "Something went wrong. Please try again.");
    if (["ACCOUNT_BANNED", "ACCOUNT_DEACTIVATED", "ALREADY_BOOKED"].includes(err.code)) {
      setBlocked(err);
      setStep("blocked");
      return;
    }
    setError(err.message);
  };

  // ── Step 2 → 3: send the OTP ───────────────────────────────────────────
  const requestOtp = async () => {
    if (!detailsValid || busy) return;
    setBusy(true);
    setError(null);
    try {
      await sendOtp(phoneDigits);
      trackInitiateCheckout({ eventId: event.id, value: total, seats });
      setOtp("");
      setResendIn(30);
      setStep("otp");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(false);
    }
  };

  const resendOtp = async () => {
    if (resendIn > 0 || busy) return;
    setError(null);
    try {
      await sendOtp(phoneDigits);
      setResendIn(30);
    } catch (e) {
      fail(e);
    }
  };

  // ── Razorpay ───────────────────────────────────────────────────────────
  const openRazorpay = useCallback(async () => {
    const s = session.current;
    if (!s) return;
    const ready = await loadRazorpay();
    if (!ready || !window.Razorpay) {
      setError("Payment couldn't load. Check your connection and tap Pay again.");
      setStep("paying");
      return;
    }
    setStep("paying");
    const rzp = new window.Razorpay({
      key: s.order.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY || "",
      order_id: s.order.orderId,
      amount: Math.round(s.order.amount * 100),
      currency: s.order.currency || "INR",
      name: event.club?.name || "SyncTrip",
      description: `${event.title} · ${s.order.seats} seat${s.order.seats === 1 ? "" : "s"}`,
      prefill: s.order.prefill,
      theme: { color: "#3ABEF5" },
      handler: async (resp: RazorpayCheckoutResponse) => {
        setBusy(true);
        setError(null);
        let refunded = false;
        try {
          const result = await verifyPayment(event.id, s.token, resp);
          // Paid after the seat hold had expired: no seat, money refunded.
          refunded = result?.status === "refunded";
        } catch {
          // The payment went through Razorpay; our webhook confirms the seat
          // even if this call failed. Say so instead of showing an error.
          setPendingConfirm(true);
        } finally {
          setBusy(false);
          if (refunded) {
            // Not a purchase - stay on the sheet and say what happened.
            setError("Your seat hold expired before the payment completed, so the full amount has been refunded (5-7 working days). Tap Pay to book again.");
          } else {
            trackPurchase({
              bookingId: s.order.bookingId, eventId: event.id, value: s.order.amount, seats: s.order.seats,
              phone: `+91${phoneDigits}`,
            });
            setPaid({ seats: s.order.seats, amount: s.order.amount, free: false });
            setStep("done");
          }
        }
      },
      modal: {
        ondismiss: () => setError("Payment not completed. Your seats are held for a few minutes - tap Pay to try again."),
      },
    });
    rzp.on("payment.failed", () => setError("The payment failed. No money was taken - try again or use another method."));
    rzp.open();
  }, [event.id, event.title, event.club?.name, phoneDigits]);

  // ── Step 3: verify OTP + book ──────────────────────────────────────────
  const confirmOtp = async () => {
    if (otp.length < 4 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await book(event.id, {
        phone: phoneDigits, otp, name: name.trim(), gender: gender as string, seats, attribution: getWebAttribution(),
      });
      if (res.free) {
        trackPurchase({ bookingId: "", eventId: event.id, value: 0, seats: res.seats, free: true });
        setPaid({ seats: res.seats, amount: 0, free: true });
        setStep("done");
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

  const stepIndex = { seats: 0, details: 1, otp: 2, paying: 3, done: 4, blocked: 4 }[step];
  const canGoBack = step === "details" || step === "otp";
  const back = () => {
    setError(null);
    setStep(step === "otp" ? "details" : "seats");
  };

  const title = {
    seats: isFree ? "Reserve your spot" : "Choose tickets",
    details: "Your details",
    otp: "Verify your number",
    paying: "Complete payment",
    done: isFree ? "Spot reserved" : "Booking confirmed",
    blocked: "Can't book here",
  }[step];

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && step !== "paying" && onClose()}>
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.sheetHead}>
          {canGoBack && (
            <button type="button" className={styles.iconBtn} onClick={back} aria-label="Back">
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className={styles.sheetTitle}>{title}</h2>
          <button type="button" className={styles.iconBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {step !== "done" && step !== "blocked" && (
          <div className={styles.steps} aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`${styles.stepDot} ${i <= stepIndex ? styles.stepDotOn : ""}`} />
            ))}
          </div>
        )}

        <div className={styles.sheetBody}>
          {step !== "done" && step !== "blocked" && (
            <div className={styles.eventMini}>
              {heroImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={heroImage} alt="" className={styles.eventMiniImg} />
              ) : (
                <div className={styles.eventMiniImg} />
              )}
              <div>
                <div className={styles.eventMiniTitle}>{event.title}</div>
                <div className={styles.eventMiniMeta}>{formatWhen(event.startsAt, event.endsAt)}</div>
              </div>
            </div>
          )}

          {/* ── 1. Seats ── */}
          {step === "seats" && (
            <>
              <div>
                <span className={styles.label}>How many people?</span>
                <div className={styles.stepper}>
                  <button type="button" className={styles.stepperBtn} disabled={seats <= 1} onClick={() => setSeats((v) => v - 1)} aria-label="Fewer seats">−</button>
                  <div className={styles.stepperValue}>
                    {seats}
                    <span className={styles.stepperSub}>{seats === 1 ? "seat" : "seats"} · max {maxSeats}</span>
                  </div>
                  <button type="button" className={styles.stepperBtn} disabled={seats >= maxSeats} onClick={() => setSeats((v) => v + 1)} aria-label="More seats">+</button>
                </div>
              </div>

              {!isFree && (
                <div className={styles.summary}>
                  {quoteLoading && !quote ? (
                    <div className={styles.sumRow}><span>Calculating…</span></div>
                  ) : quote ? (
                    <>
                      {(quote.tierLines?.length ? quote.tierLines : [{ label: null, price: quote.ticketPrice, seats: quote.seats }]).map((l, i) => (
                        <div className={styles.sumRow} key={i}>
                          <span>{l.seats} × {l.label || "Ticket"} ({rupees(l.price)})</span>
                          <span>{rupees(l.price * l.seats)}</span>
                        </div>
                      ))}
                      {quote.platformFee > 0 && (
                        <div className={styles.sumRow}><span>Booking fee</span><span>{rupees(quote.platformFee)}</span></div>
                      )}
                      <div className={`${styles.sumRow} ${styles.sumTotal}`}><span>Total</span><span>{rupees(quote.amountPayable)}</span></div>
                    </>
                  ) : (
                    <div className={styles.sumRow}><span>Couldn&apos;t load the price. You can still continue.</span></div>
                  )}
                </div>
              )}

              {(event.refundPolicyLines?.length ?? 0) > 0 && (
                <p className={styles.helper}>
                  <strong>Refunds:</strong> {event.refundPolicyLines![0]}
                  {event.refundPolicyLines!.length > 1 ? " (full policy on the event page)." : ""}
                </p>
              )}

              <button type="button" className={styles.primaryBtn} onClick={() => { setError(null); setStep("details"); }}>
                Continue
              </button>
            </>
          )}

          {/* ── 2. Details ── */}
          {step === "details" && (
            <>
              <div>
                <label className={styles.label} htmlFor="wc-name">Full name</label>
                <input
                  id="wc-name" className={styles.input} value={name} maxLength={50} autoComplete="name"
                  placeholder="As you'd like the club to see it" onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <span className={styles.label}>Gender</span>
                <div className={styles.genderRow}>
                  {(["male", "female", "other"] as Gender[]).map((g) => (
                    <button
                      key={g} type="button" onClick={() => setGender(g)}
                      className={`${styles.genderBtn} ${gender === g ? styles.genderOn : ""}`}
                    >
                      {g === "male" ? "Male" : g === "female" ? "Female" : "Other"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={styles.label} htmlFor="wc-phone">Mobile number</label>
                <div className={styles.phoneWrap}>
                  <span className={styles.phonePrefix}>+91</span>
                  <input
                    id="wc-phone" className={styles.phoneInput} inputMode="numeric" autoComplete="tel-national"
                    placeholder="98765 43210" value={phone} maxLength={11}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
                  />
                </div>
                <p className={styles.helper} style={{ marginTop: "0.5rem" }}>
                  Your ticket is linked to this number. Log in to the SyncTrip app with it to see your ticket and the event chat.
                </p>
              </div>

              {!isFree && quote && (
                <div className={styles.summary}>
                  <div className={`${styles.sumRow} ${styles.sumTotal}`} style={{ border: "none", padding: 0, margin: 0 }}>
                    <span>{seats} seat{seats === 1 ? "" : "s"}</span><span>{rupees(quote.amountPayable)}</span>
                  </div>
                  {quote.memberDiscountPercent ? (
                    <span className={styles.helper}>SyncTrip Plus members get {quote.memberDiscountPercent}% off - applied automatically after verification.</span>
                  ) : null}
                </div>
              )}

              {error && <div className={styles.error}>{error}</div>}
              <button type="button" className={styles.primaryBtn} disabled={!detailsValid || busy} onClick={requestOtp}>
                {busy ? <span className={styles.spinner} /> : isFree ? "Verify & reserve" : `Verify & pay ${rupees(total)}`}
              </button>
            </>
          )}

          {/* ── 3. OTP ── */}
          {step === "otp" && (
            <>
              <p className={styles.helper}>
                Enter the code we sent to <strong>+91 {phoneDigits.slice(0, 5)} {phoneDigits.slice(5)}</strong>.
              </p>
              <input
                className={styles.otpInput} inputMode="numeric" autoComplete="one-time-code" autoFocus
                maxLength={6} value={otp} placeholder="••••"
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && confirmOtp()}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button type="button" className={styles.linkBtn} onClick={back}>Change number</button>
                <button type="button" className={styles.linkBtn} disabled={resendIn > 0} onClick={resendOtp}>
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                </button>
              </div>
              {error && <div className={styles.error}>{error}</div>}
              <button type="button" className={styles.primaryBtn} disabled={otp.length < 4 || busy} onClick={confirmOtp}>
                {busy ? <span className={styles.spinner} /> : isFree ? "Confirm my spot" : `Confirm & pay ${rupees(total)}`}
              </button>
            </>
          )}

          {/* ── 4. Paying (Razorpay window open / closed) ── */}
          {step === "paying" && (
            <>
              <div className={styles.notice}>
                {busy ? "Confirming your payment…" : "Complete the payment in the Razorpay window."}
              </div>
              {error && <div className={styles.error}>{error}</div>}
              {!busy && (
                <button type="button" className={styles.primaryBtn} onClick={openRazorpay}>
                  Pay {rupees(session.current?.order.amount ?? total)}
                </button>
              )}
            </>
          )}

          {/* ── Done ── */}
          {step === "done" && paid && (
            <>
              <div className={styles.successHero}>
                <div className={styles.successEmoji}>🎉</div>
                <h3 className={styles.successTitle}>You&apos;re in!</h3>
                <p className={styles.successSub}>
                  {paid.seats} seat{paid.seats === 1 ? "" : "s"} for <strong>{event.title}</strong>
                  {paid.free ? "" : ` · ${rupees(paid.amount)} paid`}
                </p>
              </div>
              {pendingConfirm && (
                <div className={styles.notice}>
                  Payment received - we&apos;re confirming it with the bank. Your ticket will appear in the app within a few minutes.
                </div>
              )}

              <div className={styles.notice}>
                Everything for this event happens in the <strong>SyncTrip app</strong>:
              </div>
              <div className={styles.perks}>
                <span className={styles.perk}><Ticket size={16} /> Your ticket</span>
                <span className={styles.perk}><QrCode size={16} /> Entry check-in</span>
                <span className={styles.perk}><MapPin size={16} /> Venue details</span>
                <span className={styles.perk}><BellRing size={16} /> Updates from the club</span>
              </div>

              <ol className={styles.appSteps}>
                <li className={styles.appStep}>
                  <span className={styles.appStepNum}>1</span>
                  <span className={styles.appStepText}>Download <strong>SyncTrip</strong> from the Play Store or App Store.</span>
                </li>
                <li className={styles.appStep}>
                  <span className={styles.appStepNum}>2</span>
                  <span className={styles.appStepText}>
                    Log in with <strong>+91 {phoneDigits.slice(0, 5)} {phoneDigits.slice(5)}</strong> - the number you booked with.
                  </span>
                </li>
                <li className={styles.appStep}>
                  <span className={styles.appStepNum}>3</span>
                  <span className={styles.appStepText}>
                    Open <strong>Chats</strong> - the <strong>{event.title}</strong> group is waiting, with your ticket inside.
                  </span>
                </li>
              </ol>

              <div className={styles.storeRow}>
                <a className={styles.storeBtn} href={APP_LINKS.PLAY_STORE} target="_blank" rel="noopener">Google Play</a>
                <a className={styles.storeBtn} href={APP_LINKS.APP_STORE} target="_blank" rel="noopener">App Store</a>
              </div>
              <div className={styles.stickyCta}>
                <a className={styles.primaryBtn} href={appOpenUrl(appPath)} style={{ textDecoration: "none" }}>
                  <Check size={18} /> Open the event in SyncTrip
                </a>
              </div>
            </>
          )}

          {/* ── Blocked (banned / deactivated / already booked) ── */}
          {step === "blocked" && blocked && (
            <>
              <div className={styles.notice}>{blocked.message}</div>
              {blocked.code === "ACCOUNT_BANNED" && (
                <a className={styles.primaryBtn} style={{ textDecoration: "none" }}
                  href={`mailto:${blocked.supportEmail || SUPPORT_EMAIL}?subject=${encodeURIComponent(`Booking help: ${event.title}`)}`}>
                  Email {blocked.supportEmail || SUPPORT_EMAIL}
                </a>
              )}
              {(blocked.code === "ACCOUNT_DEACTIVATED" || blocked.code === "ALREADY_BOOKED") && (
                <a className={styles.primaryBtn} href={appOpenUrl(appPath)} style={{ textDecoration: "none" }}>
                  Open this event in SyncTrip
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
