/**
 * Dedicated API client for the web checkout flow.
 *
 * Unlike the global `apiClient` (which injects the token from cookies/localStorage of the
 * *web* session), this client authenticates with the **app JWT passed in the URL** — the web
 * session inside the WebView is empty/irrelevant. See WEB_CHECKOUT_PLAN.md §2/§3a.
 *
 * The Razorpay SECRET never lives here — the SyncTrip backend creates the order AND verifies
 * the signature. The browser only ever uses the public key id.
 */
import axios, { AxiosInstance } from 'axios';
import type {
    ActiveSubscriptionData,
    ApiEnvelope,
    CreateOrderData,
    CreateSubscriptionData,
    OrderStatusData,
    RazorpayHandlerResponse,
    RazorpaySubscriptionHandlerResponse,
    VerifyData,
} from '@/app/checkout/checkout.types';

const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5000';

/**
 * Build a bearer-scoped axios client. `token` comes from the URL, never from cookies.
 * No `withCredentials` — we authenticate purely by the URL token.
 */
export function makeCheckoutClient(token: string): AxiosInstance {
    return axios.create({
        baseURL: BASE, // base already includes the right prefix — NO `/api`
        timeout: 20000, // payment calls can be slow; longer than the global 10s
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
}

export async function createOrder(
    client: AxiosInstance,
    planId: string,
    applyWallet: boolean,
): Promise<CreateOrderData> {
    const res = await client.post<ApiEnvelope<CreateOrderData>>(
        '/subscription/razorpay/order',
        { planId, applyWallet },
    );
    if (!res.data?.success || !res.data?.data?.orderId) {
        throw new Error(res.data?.message || 'Could not create order');
    }
    return res.data.data;
}

export async function verifyOrder(
    client: AxiosInstance,
    payload: RazorpayHandlerResponse,
): Promise<{ ok: boolean; data?: VerifyData }> {
    const res = await client.post<ApiEnvelope<VerifyData>>(
        '/subscription/razorpay/order/verify',
        payload,
    );
    return { ok: Boolean(res.data?.success), data: res.data?.data };
}

/** Safety-net reconcile (ORDER mode): used only when verify fails with a network/5xx error. */
export async function getOrderStatus(
    client: AxiosInstance,
    orderId: string,
): Promise<OrderStatusData> {
    const res = await client.get<ApiEnvelope<OrderStatusData>>(
        `/subscription/razorpay/order/${orderId}/status`,
    );
    return res.data?.data ?? { status: 'pending' };
}

/* ───────────────────── recurring SUBSCRIPTION mode (applyWallet=0) ───────────────────── */

export async function createSubscription(
    client: AxiosInstance,
    planId: string,
): Promise<CreateSubscriptionData> {
    const res = await client.post<ApiEnvelope<CreateSubscriptionData>>(
        '/subscription/razorpay/create',
        { planId },
    );
    if (!res.data?.success || !res.data?.data?.subscriptionId) {
        throw new Error(res.data?.message || 'Could not create subscription');
    }
    return res.data.data;
}

export async function verifySubscription(
    client: AxiosInstance,
    payload: RazorpaySubscriptionHandlerResponse,
): Promise<{ ok: boolean; data?: VerifyData }> {
    const res = await client.post<ApiEnvelope<VerifyData>>(
        '/subscription/razorpay/verify',
        payload,
    );
    return { ok: Boolean(res.data?.success), data: res.data?.data };
}

/**
 * Safety-net reconcile (SUBSCRIPTION mode): recurring has no order id, so we ask the
 * backend for the user's active subscription. Defensive about the response shape.
 */
export async function getActiveSubscription(
    client: AxiosInstance,
): Promise<{ active: boolean; endDate?: string }> {
    const res = await client.get<ApiEnvelope<ActiveSubscriptionData>>('/subscription/active');
    const d = res.data?.data;
    const active =
        d?.isActive === true ||
        d?.active === true ||
        d?.status === 'active' ||
        d?.subscription?.status === 'active';
    return { active, endDate: d?.subscription?.endDate };
}
