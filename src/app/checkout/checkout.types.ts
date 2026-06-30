/**
 * Types for the web checkout flow (SyncTrip Plus via Razorpay).
 * Mirrors the SyncTrip backend responses — see WEB_CHECKOUT_PLAN.md §4.
 */

/** Response of POST {base}/subscription/razorpay/order */
export interface CreateOrderData {
    orderId: string;
    amount: number; // payable in ₹ (price − walletApplied) — DISPLAY ONLY, never alter
    currency: string; // "INR"
    planId: string;
    planName: string;
    price: number; // full plan price in ₹
    walletApplied: number; // server-computed wallet credit in ₹
}

/** Response of POST {base}/subscription/razorpay/create (recurring subscription mode) */
export interface CreateSubscriptionData {
    subscriptionId: string;
    planId: string;
    amount: number; // full recurring price in ₹
    currency: string; // "INR"
    isTrial: boolean;
    planName: string;
}

/** Response of POST {base}/subscription/razorpay/order/verify and /razorpay/verify */
export interface VerifyData {
    subscription?: {
        endDate?: string;
        planId?: string;
        status?: string;
    };
}

/** Response of GET {base}/subscription/active — used to reconcile recurring mode. */
export interface ActiveSubscriptionData {
    isActive?: boolean;
    active?: boolean;
    status?: string;
    subscription?: {
        endDate?: string;
        planId?: string;
        status?: string;
    };
}

/** Which purchase flow the page is running — decided by the `applyWallet` URL param. */
export type CheckoutMode = 'order' | 'subscription';

/**
 * Normalized view-model the UI renders from, regardless of mode.
 * `order` mode comes from CreateOrderData; `subscription` from CreateSubscriptionData.
 */
export interface CheckoutDetails {
    mode: CheckoutMode;
    planId: string;
    planName: string;
    currency: string;
    amount: number; // payable today in ₹ (DISPLAY ONLY)
    price: number; // full plan price in ₹ (== amount for subscription)
    walletApplied: number; // ₹; always 0 for subscription mode
    orderId?: string; // order mode only
    subscriptionId?: string; // subscription mode only
    isTrial?: boolean; // subscription mode only
}

/** Response of GET {base}/subscription/razorpay/order/:orderId/status */
export interface OrderStatusData {
    status: 'active' | 'pending';
    subscription?: {
        endDate?: string;
        planId?: string;
    };
}

/** Standard SyncTrip API envelope */
export interface ApiEnvelope<T> {
    success: boolean;
    message?: string;
    data: T;
}

/** Terminal results we report back to the app WebView. */
export type CheckoutSignal = 'success' | 'failed' | 'cancel';

/** Fields Razorpay Checkout returns for a one-time ORDER payment. */
export interface RazorpayHandlerResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

/** Fields Razorpay Checkout returns for a recurring SUBSCRIPTION mandate. */
export interface RazorpaySubscriptionHandlerResponse {
    razorpay_subscription_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

/** Union returned to our `handler` — order mode populates *_order_id, subscription mode *_subscription_id. */
export interface RazorpayCheckoutResponse {
    razorpay_order_id?: string;
    razorpay_subscription_id?: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

/**
 * Minimal shape of the Razorpay Checkout constructor options we use.
 * Order mode passes `order_id` (+ amount/currency); subscription mode passes
 * `subscription_id` and lets Razorpay derive the amount from the plan.
 */
export interface RazorpayOptions {
    key: string;
    order_id?: string;
    subscription_id?: string;
    amount?: number; // in paise — order mode only
    currency?: string; // order mode only
    name?: string;
    description?: string;
    image?: string;
    prefill?: { name?: string; email?: string; contact?: string };
    notes?: Record<string, string>;
    theme?: { color?: string };
    handler?: (response: RazorpayCheckoutResponse) => void;
    modal?: { ondismiss?: () => void; escape?: boolean; backdropclose?: boolean };
}

export interface RazorpayInstance {
    open: () => void;
    on: (event: string, cb: (resp: unknown) => void) => void;
}

declare global {
    interface Window {
        Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
        ReactNativeWebView?: { postMessage: (msg: string) => void };
    }
}
