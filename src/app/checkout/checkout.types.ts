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

/** Response of POST {base}/subscription/razorpay/order/verify */
export interface VerifyData {
    subscription?: {
        endDate?: string;
        planId?: string;
        status?: string;
    };
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

/** Fields Razorpay Checkout returns to the success handler. */
export interface RazorpayHandlerResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

/** Minimal shape of the Razorpay Checkout constructor options we use. */
export interface RazorpayOptions {
    key: string;
    order_id: string;
    amount: number; // in paise
    currency: string;
    name?: string;
    description?: string;
    image?: string;
    prefill?: { name?: string; email?: string; contact?: string };
    notes?: Record<string, string>;
    theme?: { color?: string };
    handler?: (response: RazorpayHandlerResponse) => void;
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
