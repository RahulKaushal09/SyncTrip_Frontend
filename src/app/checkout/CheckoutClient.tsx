'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Script from 'next/script';
import axios from 'axios';
import {
    BadgeCheck,
    Check,
    CheckCircle2,
    Lock,
    Loader2,
    RefreshCw,
    Repeat,
    Sparkles,
    Wallet,
    XCircle,
    AlertTriangle,
} from 'lucide-react';
import {
    createOrder,
    createSubscription,
    getActiveSubscription,
    getOrderStatus,
    makeCheckoutClient,
    verifyOrder,
    verifySubscription,
} from '@/utils/checkout.api.utils';
import type {
    CheckoutDetails,
    CheckoutSignal,
    RazorpayCheckoutResponse,
} from './checkout.types';

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
const BRAND = '#00bcd4';

/** Page-level finite states — see WEB_CHECKOUT_PLAN.md §5. */
type Phase =
    | 'validating' // creating order / authenticating the token
    | 'summary' // order ready, awaiting "Pay"
    | 'paying' // Razorpay modal open
    | 'verifying' // verifying signature with backend
    | 'reconciling' // verify failed → checking real status
    | 'success'
    | 'failed'
    | 'cancel'
    | 'expired' // 401 — token invalid/expired
    | 'error'; // generic, retryable

function rupees(n: number): string {
    return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function CheckoutClient() {
    const params = useSearchParams();

    const planId = params.get('planId') ?? '';
    const applyWallet = params.get('applyWallet') === '1';
    // applyWallet=1 → one-time wallet order; applyWallet=0 → recurring auto-renew subscription.
    const mode: CheckoutDetails['mode'] = applyWallet ? 'order' : 'subscription';
    // NOTE: token is a bearer credential — read it, never log it, never put it in a URL.
    const token = params.get('token') ?? '';

    const [phase, setPhase] = useState<Phase>('validating');
    const [details, setDetails] = useState<CheckoutDetails | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [scriptReady, setScriptReady] = useState<boolean>(false);

    // Guards against double-fired signals / double-tap / re-entrancy.
    const signalledRef = useRef(false);
    const payingRef = useRef(false);
    const endDateRef = useRef<string | undefined>(undefined);

    const client = useMemo(
        () => (token ? makeCheckoutClient(token) : null),
        [token],
    );

    /** Report the terminal result to the app WebView — exactly once. */
    const signalApp = useCallback(
        (status: CheckoutSignal) => {
            if (signalledRef.current) return;
            signalledRef.current = true;
            try {
                const payload = JSON.stringify({
                    status,
                    endDate: endDateRef.current,
                    planId: details?.planId || planId || undefined,
                });
                window.ReactNativeWebView?.postMessage(payload);
            } catch {
                /* postMessage best-effort; URL fallback below */
            }
            // Fallback channel (Option B): the app also watches the URL.
            if (status === 'success') {
                window.location.hash = 'payment-success';
            } else if (status === 'failed') {
                window.location.hash = 'payment-failed';
            }
        },
        [details?.planId, planId],
    );

    /** Manual "return to app" — re-posts success even after the guarded auto-signal. */
    const returnToApp = useCallback(() => {
        try {
            window.ReactNativeWebView?.postMessage(
                JSON.stringify({
                    status: 'success',
                    endDate: endDateRef.current,
                    planId: details?.planId || planId || undefined,
                }),
            );
        } catch {
            /* best-effort */
        }
    }, [details?.planId, planId]);

    const isAuthError = useCallback((err: unknown) => {
        if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            const code = (err.response?.data as { code?: string } | undefined)?.code;
            return (
                status === 401 ||
                code === 'INVALID_TOKEN' ||
                code === 'SESSION_NOT_FOUND'
            );
        }
        return false;
    }, []);

    // ── Boot: validate params + create order/subscription (this also authenticates the token) ──
    const loadCheckout = useCallback(async () => {
        if (!client || !token || !planId) {
            setPhase('error');
            setErrorMsg('This checkout link is incomplete. Please reopen it from the app.');
            return;
        }
        setPhase('validating');
        setErrorMsg('');
        try {
            if (mode === 'order') {
                const d = await createOrder(client, planId, true);
                setDetails({
                    mode: 'order',
                    planId: d.planId,
                    planName: d.planName,
                    currency: d.currency,
                    amount: d.amount,
                    price: d.price,
                    walletApplied: d.walletApplied,
                    orderId: d.orderId,
                });
            } else {
                const s = await createSubscription(client, planId);
                setDetails({
                    mode: 'subscription',
                    planId: s.planId,
                    planName: s.planName,
                    currency: s.currency,
                    amount: s.amount,
                    price: s.amount,
                    walletApplied: 0,
                    subscriptionId: s.subscriptionId,
                    isTrial: s.isTrial,
                });
            }
            setPhase('summary');
        } catch (err) {
            if (isAuthError(err)) {
                setPhase('expired');
            } else {
                setPhase('error');
                setErrorMsg('We could not start your checkout. Please try again.');
            }
        }
    }, [client, token, planId, mode, isAuthError]);

    useEffect(() => {
        loadCheckout();
    }, [loadCheckout]);

    // ── Verify (with reconcile fallback) — branches on mode ──
    const runVerify = useCallback(
        async (resp: RazorpayCheckoutResponse) => {
            if (!client || !details) return;
            setPhase('verifying');
            try {
                const { ok, data } =
                    details.mode === 'order'
                        ? await verifyOrder(client, {
                              razorpay_order_id: resp.razorpay_order_id ?? '',
                              razorpay_payment_id: resp.razorpay_payment_id,
                              razorpay_signature: resp.razorpay_signature,
                          })
                        : await verifySubscription(client, {
                              razorpay_subscription_id: resp.razorpay_subscription_id ?? '',
                              razorpay_payment_id: resp.razorpay_payment_id,
                              razorpay_signature: resp.razorpay_signature,
                          });
                if (ok) {
                    endDateRef.current = data?.subscription?.endDate;
                    setPhase('success');
                    signalApp('success');
                } else {
                    setPhase('failed');
                    signalApp('failed');
                }
            } catch (err) {
                // Network/5xx during verify → reconcile against the real status once.
                // (create→verify→reconcile are all idempotent: no double-charge.)
                if (isAuthError(err)) {
                    setPhase('expired');
                    return;
                }
                setPhase('reconciling');
                try {
                    let active = false;
                    let endDate: string | undefined;
                    if (details.mode === 'order' && details.orderId) {
                        const status = await getOrderStatus(client, details.orderId);
                        active = status.status === 'active';
                        endDate = status.subscription?.endDate;
                    } else {
                        // Recurring has no order id → reconcile via the active-subscription endpoint.
                        const res = await getActiveSubscription(client);
                        active = res.active;
                        endDate = res.endDate;
                    }
                    if (active) {
                        endDateRef.current = endDate;
                        setPhase('success');
                        signalApp('success');
                    } else {
                        setPhase('failed');
                        signalApp('failed');
                    }
                } catch {
                    setPhase('failed');
                    signalApp('failed');
                }
            }
        },
        [client, details, signalApp, isAuthError],
    );

    // ── Open Razorpay Checkout ──
    const openCheckout = useCallback(() => {
        if (payingRef.current) return; // double-tap guard
        if (!details) return;
        if (typeof window === 'undefined' || !window.Razorpay || !scriptReady) {
            setPhase('error');
            setErrorMsg('Payment is still loading. Please check your connection and retry.');
            return;
        }
        payingRef.current = true;
        setPhase('paying');

        const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
            // One-time order → order_id (+ amount). Recurring → subscription_id; Razorpay
            // derives the amount from the plan, so we must NOT pass amount/currency here.
            ...(details.mode === 'order'
                ? {
                      order_id: details.orderId,
                      amount: Math.round(details.amount * 100), // paise
                      currency: details.currency || 'INR',
                  }
                : { subscription_id: details.subscriptionId }),
            name: 'SyncTrip',
            description: details.planName,
            theme: { color: BRAND },
            handler: (response: RazorpayCheckoutResponse) => {
                payingRef.current = false;
                runVerify(response);
            },
            modal: {
                ondismiss: () => {
                    payingRef.current = false;
                    // Only treat as cancel if we haven't already moved on to verify/success.
                    setPhase((prev) => (prev === 'paying' ? 'cancel' : prev));
                    if (!signalledRef.current) signalApp('cancel');
                },
            },
        });

        rzp.on('payment.failed', () => {
            payingRef.current = false;
            setPhase('failed');
            signalApp('failed');
        });

        rzp.open();
    }, [details, scriptReady, runVerify, signalApp]);

    // ── Render ──
    return (
        <main className="checkout-root">
            <Script
                src={RAZORPAY_SRC}
                strategy="afterInteractive"
                onLoad={() => setScriptReady(true)}
                onError={() => {
                    setScriptReady(false);
                    setPhase('error');
                    setErrorMsg('Could not load the payment module. Check your connection and retry.');
                }}
            />

            <div className="card animate-fade-up" key={phase}>
                {phase === 'validating' && <SkeletonView />}

                {(phase === 'summary' ||
                    phase === 'paying' ||
                    phase === 'verifying' ||
                    phase === 'reconciling') &&
                    details && (
                        <SummaryView
                            details={details}
                            phase={phase}
                            disabled={!scriptReady}
                            onPay={openCheckout}
                        />
                    )}

                {phase === 'success' && (
                    <SuccessView
                        endDate={endDateRef.current}
                        recurring={details?.mode === 'subscription'}
                        onReturn={returnToApp}
                    />
                )}

                {phase === 'failed' && (
                    <ResultView
                        kind="failed"
                        title="Payment failed"
                        body="Your payment didn't go through and you have not been charged. You can safely try again."
                        primaryLabel="Retry payment"
                        onPrimary={() => {
                            signalledRef.current = false;
                            setPhase('summary');
                        }}
                    />
                )}

                {phase === 'cancel' && (
                    <ResultView
                        kind="cancel"
                        title="Checkout cancelled"
                        body="You closed the payment before it completed. Nothing has been charged — resume whenever you're ready."
                        primaryLabel="Resume payment"
                        onPrimary={() => {
                            signalledRef.current = false;
                            setPhase('summary');
                        }}
                    />
                )}

                {phase === 'expired' && (
                    <ResultView
                        kind="expired"
                        title="Session expired"
                        body="Your secure checkout session has expired. Please reopen checkout from the SyncTrip app to continue."
                    />
                )}

                {phase === 'error' && (
                    <ResultView
                        kind="error"
                        title="Something went wrong"
                        body={errorMsg || 'Please try again in a moment.'}
                        primaryLabel="Try again"
                        onPrimary={loadCheckout}
                    />
                )}
            </div>

            <p className="trust-footer">
                <Lock size={13} /> 256-bit encrypted · Secured by Razorpay
            </p>

            <StyleBlock />
        </main>
    );
}

/* ──────────────────────────── sub-views ──────────────────────────── */

function PlanHeader({ planName, subtitle }: { planName: string; subtitle: string }) {
    return (
        <div className="hero">
            <div className="hero-glow" aria-hidden />
            <div className="hero-icon">
                <Sparkles size={22} strokeWidth={2.2} />
            </div>
            <div>
                <div className="hero-badge">
                    <BadgeCheck size={13} /> SyncTrip Plus
                </div>
                <h1 className="hero-title">{planName}</h1>
                <p className="hero-sub">{subtitle}</p>
            </div>
        </div>
    );
}

function SkeletonView() {
    return (
        <>
            <div className="hero hero--skeleton">
                <div className="sk sk-circle" />
                <div style={{ flex: 1 }}>
                    <div className="sk sk-line" style={{ width: '40%' }} />
                    <div className="sk sk-line" style={{ width: '70%', height: 18, marginTop: 10 }} />
                    <div className="sk sk-line" style={{ width: '55%', marginTop: 8 }} />
                </div>
            </div>
            <div className="body">
                <div className="sk sk-block" />
                <div className="sk sk-btn" />
            </div>
        </>
    );
}

function SummaryView({
    details,
    phase,
    disabled,
    onPay,
}: {
    details: CheckoutDetails;
    phase: Phase;
    disabled: boolean;
    onPay: () => void;
}) {
    const busy = phase === 'paying' || phase === 'verifying' || phase === 'reconciling';
    const busyLabel =
        phase === 'verifying'
            ? 'Confirming payment…'
            : phase === 'reconciling'
                ? 'Finalising your plan…'
                : 'Opening secure payment…';

    const isOrder = details.mode === 'order';
    const hasWallet = isOrder && details.walletApplied > 0;
    const savePct =
        hasWallet && details.price > 0
            ? Math.round((details.walletApplied / details.price) * 100)
            : 0;

    const subtitle = isOrder
        ? hasWallet
            ? 'One-time purchase · wallet credit applied'
            : 'One-time purchase'
        : details.isTrial
            ? 'Auto-renewing subscription · free trial'
            : 'Auto-renewing subscription';

    const totalLabel = isOrder
        ? 'To pay today'
        : details.isTrial
            ? 'Due after trial'
            : 'Billed today';

    return (
        <>
            <PlanHeader planName={details.planName} subtitle={subtitle} />

            <div className="body">
                <div className="summary">
                    <Row
                        label={isOrder ? 'Plan price' : 'Subscription'}
                        value={rupees(details.price)}
                    />

                    {hasWallet && (
                        <Row
                            label={
                                <span className="wallet-label">
                                    <span className="wallet-chip">
                                        <Wallet size={13} />
                                    </span>
                                    Wallet credit
                                </span>
                            }
                            value={`− ${rupees(details.walletApplied)}`}
                            valueClass="credit"
                        />
                    )}

                    <div className="divider" />

                    <div className="total-row">
                        <div>
                            <span className="total-label">{totalLabel}</span>
                            {savePct > 0 && (
                                <span className="save-pill">You save {savePct}%</span>
                            )}
                        </div>
                        <span className="total-amount">{rupees(details.amount)}</span>
                    </div>
                </div>

                {isOrder
                    ? hasWallet && (
                          <div className="note">
                              <Check size={15} className="note-icon" />
                              <span>
                                  This is a <b>one-time purchase</b> using your wallet credit - it
                                  will <b>not auto-renew</b>.
                              </span>
                          </div>
                      )
                    : (
                          <div className="note">
                              <Repeat size={15} className="note-icon" />
                              <span>
                                  {rupees(details.amount)} will <b>auto-debit every billing cycle</b>
                                  {details.isTrial ? ' once your free trial ends' : ''}. You can{' '}
                                  <b>cancel anytime</b> from the SyncTrip app.
                              </span>
                          </div>
                      )}

                <button
                    type="button"
                    onClick={onPay}
                    disabled={busy || disabled}
                    className="pay-btn"
                >
                    {busy ? (
                        <>
                            <Loader2 className="spin" size={19} /> {busyLabel}
                        </>
                    ) : (
                        <>
                            {isOrder ? <Lock size={17} /> : <Repeat size={17} />}
                            <span>
                                {isOrder
                                    ? `Pay ${rupees(details.amount)}`
                                    : `Subscribe · ${rupees(details.amount)}`}
                            </span>
                        </>
                    )}
                </button>

                <div className="trust-row">
                    <span><Lock size={12} /> Encrypted</span>
                    <span className="dot" />
                    <span><BadgeCheck size={12} /> Razorpay</span>
                    <span className="dot" />
                    <span>UPI · Cards · Netbanking</span>
                </div>

                {disabled && !busy && (
                    <p className="loading-hint">Loading secure payment…</p>
                )}
            </div>
        </>
    );
}

function Row({
    label,
    value,
    valueClass = '',
}: {
    label: React.ReactNode;
    value: React.ReactNode;
    valueClass?: string;
}) {
    return (
        <div className="row-cust">
            <span className="row-label">{label}</span>
            <span className={`row-value ${valueClass}`}>{value}</span>
        </div>
    );
}

function SuccessView({
    endDate,
    recurring,
    onReturn,
}: {
    endDate?: string;
    recurring?: boolean;
    onReturn: () => void;
}) {
    const pretty = endDate
        ? new Date(endDate).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : null;
    return (
        <div className="state">
            <div className="success-burst">
                <span className="ring ring-1" />
                <span className="ring ring-2" />
                <div className="success-badge animate-pop">
                    <CheckCircle2 size={40} strokeWidth={2.2} />
                </div>
            </div>
            <h1 className="state-title">You&apos;re on SyncTrip Plus 🎉</h1>
            <p className="state-body">
                Your subscription is active{pretty ? <> until <b>{pretty}</b></> : ''}.{' '}
                {recurring
                    ? 'It renews automatically — manage or cancel it anytime in the app.'
                    : 'Enjoy every Plus feature.'}
            </p>
            <button type="button" onClick={onReturn} className="pay-btn pay-btn--success">
                Return to the app
            </button>
            <p className="loading-hint">You can close this and head back to SyncTrip.</p>
        </div>
    );
}

function ResultView({
    kind,
    title,
    body,
    primaryLabel,
    onPrimary,
}: {
    kind: 'failed' | 'cancel' | 'error' | 'expired';
    title: string;
    body: string;
    primaryLabel?: string;
    onPrimary?: () => void;
}) {
    const icon =
        kind === 'failed' ? (
            <XCircle size={38} />
        ) : kind === 'error' || kind === 'expired' ? (
            <AlertTriangle size={36} />
        ) : (
            <RefreshCw size={34} />
        );

    return (
        <div className="state">
            <div className={`state-icon state-icon--${kind} animate-pop`}>{icon}</div>
            <h1 className="state-title">{title}</h1>
            <p className="state-body">{body}</p>
            {primaryLabel && onPrimary && (
                <button type="button" onClick={onPrimary} className="pay-btn">
                    {kind === 'cancel' ? <RefreshCw size={16} /> : null}
                    {primaryLabel}
                </button>
            )}
        </div>
    );
}

/* ──────────────────────────── styles ──────────────────────────── */

function StyleBlock() {
    return (
        <style jsx global>{`
            .checkout-root {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                min-height: 100dvh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 14px;
                padding: 20px 16px calc(20px + env(safe-area-inset-bottom));
                background:
                    radial-gradient(1200px 600px at 50% -10%, #d9fbff 0%, rgba(217, 251, 255, 0) 55%),
                    linear-gradient(180deg, #f4fbfd 0%, #ffffff 60%);
                color: #0f172a;
                font-family: inherit;
            }
            .card {
                width: 100%;
                max-width: 420px;
                background: #fff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow:
                    0 1px 2px rgba(15, 23, 42, 0.04),
                    0 18px 48px -12px rgba(8, 145, 178, 0.22);
                border: 1px solid rgba(8, 145, 178, 0.08);
            }

            /* Hero */
            .hero {
                position: relative;
                display: flex;
                align-items: flex-start;
                gap: 14px;
                padding: 22px 20px 24px;
                background: linear-gradient(135deg, #00bcd4 0%, #0891b2 55%, #0e7490 100%);
                color: #fff;
                overflow: hidden;
            }
            .hero-glow {
                position: absolute;
                top: -60px;
                right: -40px;
                width: 180px;
                height: 180px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.35), transparent 70%);
                pointer-events: none;
            }
            .hero-icon {
                flex-shrink: 0;
                width: 46px;
                height: 46px;
                display: grid;
                place-items: center;
                border-radius: 14px;
                background: rgba(255, 255, 255, 0.18);
                backdrop-filter: blur(6px);
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.25);
            }
            .hero-badge {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                font-size: 11px;
                font-weight: 600;
                letter-spacing: 0.02em;
                text-transform: uppercase;
                background: rgba(255, 255, 255, 0.18);
                padding: 3px 9px;
                border-radius: 999px;
            }
            .hero-title {
                margin: 8px 0 2px;
                font-size: 21px;
                font-weight: 700;
                line-height: 1.15;
            }
            .hero-sub {
                font-size: 13px;
                opacity: 0.92;
            }

            /* Body */
            .body {
                padding: 18px 20px 22px;
            }
            .summary {
                border: 1px solid #eef2f6;
                border-radius: 16px;
                padding: 16px;
                background: linear-gradient(180deg, #fbfdfe, #ffffff);
            }
            .row-cust {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                padding: 5px 0;
            }
            .row-label {
                color: #64748b;
            }
            .row-value {
                font-weight: 600;
                color: #0f172a;
            }
            .row-value.credit {
                color: #0f9d8f;
            }
            .wallet-label {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: #0f766e;
                font-weight: 500;
            }
            .wallet-chip {
                display: grid;
                place-items: center;
                width: 22px;
                height: 22px;
                border-radius: 7px;
                background: #d1fae5;
                color: #0f766e;
            }
            .divider {
                height: 1px;
                margin: 10px 0;
                background: repeating-linear-gradient(90deg, #e2e8f0 0 6px, transparent 6px 12px);
            }
            .total-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .total-label {
                font-size: 15px;
                font-weight: 700;
                color: #0f172a;
            }
            .save-pill {
                display: inline-block;
                margin-left: 8px;
                font-size: 11px;
                font-weight: 700;
                color: #047857;
                background: #d1fae5;
                padding: 2px 8px;
                border-radius: 999px;
                vertical-align: middle;
            }
            .total-amount {
                font-size: 26px;
                font-weight: 800;
                letter-spacing: -0.01em;
                color: #0f172a;
            }

            .note {
                display: flex;
                align-items: flex-start;
                gap: 8px;
                margin-top: 14px;
                padding: 11px 12px;
                font-size: 12.5px;
                line-height: 1.45;
                color: #155e63;
                background: #ecfeff;
                border: 1px solid #cffafe;
                border-radius: 12px;
            }
            .note-icon {
                margin-top: 1px;
                flex-shrink: 0;
                color: #0891b2;
            }

            /* Buttons */
            .pay-btn {
                margin-top: 18px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 9px;
                padding: 15px;
                font-size: 16px;
                font-weight: 700;
                color: #fff;
                border: none;
                border-radius: 14px;
                cursor: pointer;
                background: linear-gradient(135deg, #00bcd4, #0891b2);
                box-shadow: 0 10px 22px -8px rgba(8, 145, 178, 0.6);
                transition: transform 0.12s ease, box-shadow 0.12s ease, opacity 0.12s ease;
            }
            .pay-btn:active {
                transform: scale(0.985);
            }
            .pay-btn:disabled {
                cursor: not-allowed;
                opacity: 0.6;
                box-shadow: none;
            }
            .pay-btn--success {
                background: linear-gradient(135deg, #10b981, #059669);
                box-shadow: 0 10px 22px -8px rgba(5, 150, 105, 0.55);
            }

            .trust-row {
                margin-top: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                gap: 8px;
                font-size: 11.5px;
                color: #94a3b8;
            }
            .trust-row span {
                display: inline-flex;
                align-items: center;
                gap: 4px;
            }
            .trust-row .dot {
                width: 3px;
                height: 3px;
                border-radius: 50%;
                background: #cbd5e1;
            }
            .loading-hint {
                margin-top: 10px;
                text-align: center;
                font-size: 12px;
                color: #94a3b8;
            }
            .trust-footer {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px;
                color: #64748b;
            }

            /* Terminal states */
            .state {
                padding: 34px 22px 26px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 12px;
            }
            .state-title {
                font-size: 19px;
                font-weight: 700;
            }
            .state-body {
                font-size: 14px;
                line-height: 1.5;
                color: #475569;
                max-width: 320px;
            }
            .state .pay-btn {
                max-width: 280px;
            }
            .state-icon {
                width: 76px;
                height: 76px;
                display: grid;
                place-items: center;
                border-radius: 50%;
            }
            .state-icon--failed {
                background: #fee2e2;
                color: #ef4444;
            }
            .state-icon--error,
            .state-icon--expired {
                background: #fef3c7;
                color: #f59e0b;
            }
            .state-icon--cancel {
                background: #f1f5f9;
                color: #64748b;
            }

            /* Success burst */
            .success-burst {
                position: relative;
                width: 96px;
                height: 96px;
                display: grid;
                place-items: center;
                margin-bottom: 2px;
            }
            .success-badge {
                position: relative;
                z-index: 2;
                width: 76px;
                height: 76px;
                display: grid;
                place-items: center;
                border-radius: 50%;
                color: #fff;
                background: linear-gradient(135deg, #10b981, #059669);
                box-shadow: 0 12px 26px -8px rgba(5, 150, 105, 0.55);
            }
            .ring {
                position: absolute;
                inset: 0;
                border-radius: 50%;
                border: 2px solid #6ee7b7;
                opacity: 0;
                animation: ringPulse 1.8s ease-out infinite;
            }
            .ring-2 {
                animation-delay: 0.6s;
            }

            /* Skeleton */
            .hero--skeleton {
                background: linear-gradient(135deg, #e2e8f0, #f1f5f9);
            }
            .sk {
                position: relative;
                overflow: hidden;
                background: rgba(255, 255, 255, 0.45);
                border-radius: 8px;
            }
            .hero--skeleton .sk {
                background: rgba(255, 255, 255, 0.55);
            }
            .sk::after {
                content: '';
                position: absolute;
                inset: 0;
                transform: translateX(-100%);
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent);
                animation: shimmer 1.3s infinite;
            }
            .sk-circle {
                width: 46px;
                height: 46px;
                border-radius: 14px;
                flex-shrink: 0;
            }
            .sk-line {
                height: 12px;
            }
            .sk-block {
                height: 132px;
                border-radius: 16px;
                background: #eef2f6;
            }
            .sk-btn {
                height: 50px;
                border-radius: 14px;
                margin-top: 18px;
                background: #e2e8f0;
            }

            /* Animations */
            .spin {
                animation: spin 0.9s linear infinite;
            }
            .animate-fade-up {
                animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .animate-pop {
                animation: pop 0.45s cubic-bezier(0.16, 1, 0.5, 1.3) both;
            }
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
            @keyframes shimmer {
                100% {
                    transform: translateX(100%);
                }
            }
            @keyframes fadeUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            @keyframes pop {
                0% {
                    opacity: 0;
                    transform: scale(0.6);
                }
                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            @keyframes ringPulse {
                0% {
                    opacity: 0.7;
                    transform: scale(0.7);
                }
                100% {
                    opacity: 0;
                    transform: scale(1.5);
                }
            }
            @media (prefers-reduced-motion: reduce) {
                .animate-fade-up,
                .animate-pop,
                .ring,
                .sk::after {
                    animation: none !important;
                }
            }
        `}</style>
    );
}
