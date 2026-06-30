# Web Checkout Page — Build Plan (SyncTrip Frontend / Next.js)

> **Status:** ready to build · **Owner:** website · **Target route:** `/checkout`
> **Stack (verified):** Next.js 15 App Router, React 18, TypeScript, axios, `react-hot-toast`, `js-cookie`. Backend base URL is `NEXT_PUBLIC_BACKEND_BASE_URL`.

This page lets a **logged-in mobile-app user** pay for a SyncTrip Plus subscription on the
web via Razorpay so **wallet credit can be applied** (Apple IAP can't be discounted, so iOS
routes wallet payments here). The mobile app opens this page inside a WebView bottom sheet.

The **mobile app + SyncTrip backend are already done.** This doc is everything the *website*
must build to make the flow work end to end.

---

## 0. The one correction that changes the architecture

The original draft said "build a BFF to hold the Razorpay secret." **That is not needed here**:

- The **SyncTrip backend creates the order** (`/order`) and **verifies the signature**
  (`/order/verify`). The Razorpay **secret never touches the website** — it lives on the
  SyncTrip backend, exactly as it does for the mobile app today.
- Razorpay **Checkout JS in the browser only needs the public `key_id`** plus the
  `orderId`/`amount` returned by the backend. The public key is safe to ship to the client.

So **v1 ships as a client-rendered page that talks straight to the SyncTrip backend** — the
same pattern the rest of this site already uses (`src/utils/*.api.utils.ts` call
`NEXT_PUBLIC_BACKEND_BASE_URL` directly with a bearer token). No new server, no secret.

The *only* legitimate reason to add a thin Next.js server proxy is to keep the app **JWT out
of browser-readable JS / analytics** (§7). That is **optional hardening, not a v1 blocker** —
and is documented below so we don't over-engineer the first cut.

---

## 1. How the page is opened (from the app)

iOS opens this (only when `isWebviewPaymentEnabled` is on and the user chose to apply wallet
credit):

```
https://synctrip.in/checkout?planId=<PLAN_ID>&applyWallet=1&source=app_ios&token=<JWT>
```

| param         | meaning |
|---------------|---------|
| `planId`      | SyncTrip plan slug (e.g. `plus_monthly`) — **not** the Razorpay plan id |
| `applyWallet` | `1` = apply wallet credit, `0` = don't |
| `source`      | analytics source, currently `app_ios` |
| `token`       | the user's **app access JWT** — identifies the user |

> ⚠️ The token is a bearer credential in a URL. Treat it like a password: use it to
> authenticate, **never log it, never send it to analytics, never put it in a redirect URL**,
> and rely on its short expiry. Longer term we may switch to a one-time `checkoutToken` (§7).

---

## 2. How the page identifies the user

The page does **not** ask the user to log in again. It reads `token` from the URL and sends
it as `Authorization: Bearer <token>` to the existing SyncTrip endpoints.

**Important — do not reuse the site's default `apiClient`.** `src/utils/apiClient.ts` injects
the token from `StorageUtils.getToken()` (cookie/localStorage of the *web* session), which is
empty/irrelevant inside the WebView. The checkout page needs a **dedicated client whose token
comes from the URL**. See §3a.

---

## 3. Files to add (Next.js App Router)

```
src/app/checkout/
  page.tsx                 # Server wrapper: noindex + no-store, renders the client component
  CheckoutClient.tsx       # 'use client' — the whole flow + state machine (§5)
  checkout.types.ts        # response types for order / verify / status
src/utils/
  checkout.api.utils.ts    # dedicated axios instance that takes the URL token (§3a)
```

### 3a. Dedicated checkout API client

```ts
// src/utils/checkout.api.utils.ts
import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:5000';

/** A bearer-scoped client. `token` comes from the URL, never from cookies. */
export function makeCheckoutClient(token: string) {
  const client = axios.create({
    baseURL: BASE, // base already includes the right prefix — no `/api` (see referral.ts, *.api.utils.ts)
    timeout: 20000, // payment calls can be slow; longer than the global 10s
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    // NOTE: no withCredentials — we authenticate purely by the URL token.
  });
  return client;
}

export const createOrder = (c: ReturnType<typeof makeCheckoutClient>, planId: string, applyWallet: boolean) =>
  c.post('/subscription/razorpay/order', { planId, applyWallet });

export const verifyOrder = (c: ReturnType<typeof makeCheckoutClient>, p: {
  razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
}) => c.post('/subscription/razorpay/order/verify', p);

export const getOrderStatus = (c: ReturnType<typeof makeCheckoutClient>, orderId: string) =>
  c.get(`/subscription/razorpay/order/${orderId}/status`);
```

---

## 4. Backend endpoints (already built — reuse, do not change)

All paths are relative to `NEXT_PUBLIC_BACKEND_BASE_URL` (**no `/api` prefix** — the base URL
already includes whatever the backend mounts at, exactly like every other call in this repo,
e.g. `${base}/referral/...`, `${base}/riders/plans`). All require `Authorization: Bearer <token>`.

### a) Create order — `POST /subscription/razorpay/order`
Body: `{ "planId": "<planId>", "applyWallet": true|false }`
```json
{ "success": true, "data": {
  "orderId": "order_XXX",
  "amount": 49,            // payable in ₹ (price − walletApplied)
  "currency": "INR",
  "planId": "plus_monthly",
  "planName": "SyncTrip Plus",
  "price": 299,            // full price
  "walletApplied": 250     // server-computed, max 50% of usable balance, capped at price
}
```
**The wallet amount is computed server-side.** The page **displays** `walletApplied` and
`amount` but **must never recompute or alter them**.

### b) Open Razorpay Checkout (browser)
Use Razorpay Checkout JS with: `key` (public `key_id`), `order_id` = `orderId`,
`amount` = `data.amount * 100` (paise), `currency`. On success Razorpay returns
`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`.

### c) Verify + activate — `POST /subscription/razorpay/order/verify`
Body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
Backend verifies the signature, **debits the wallet and activates the plan**
(`autoRenew: false`, one-time). On `success: true` the subscription is live;
`data.subscription.endDate` is what we forward to the app.

### d) (Safety net) reconcile — `GET /subscription/razorpay/order/:orderId/status`
Returns `{ status: "active" | "pending", subscription? }`. Checks Razorpay directly and
finalizes a paid-but-unverified order. The page uses this as a **fallback if `verify` fails
with a network/5xx error** (see §5).

> **Idempotency:** create→verify→reconcile are all safe to call repeatedly. The wallet is
> debited and the plan activated **at most once** per order. You cannot double-charge.

---

## 5. Page behaviour — explicit state machine

```
boot ──► validating ──► summary ──► paying ──► verifying ──► success
           │              │           │          │
           ▼(401/expired)  ▼(error)   ▼(dismiss)  ▼(verify fails)
        expired         error       cancel     reconcile ──► success | failed
```

1. **boot** — parse `planId`, `applyWallet`, `source`, `token` from the URL
   (`useSearchParams`). If `token` or `planId` is missing → **error** ("Reopen from the app").
2. **validating** — call **(a) create order**. This both authenticates the token *and*
   returns the summary, so it doubles as the §6 token check.
   - `401` → **expired** state: "Session expired — please reopen checkout from the app."
   - other failure → **error** with a Retry button.
3. **summary** — render: plan name, full price, `− ₹walletApplied wallet credit`,
   **₹amount to pay today**. When `walletApplied > 0`, clearly state **one-time purchase,
   no auto-renew**. Primary button: **Pay ₹amount**.
4. **paying** — open **(b) Razorpay Checkout**. Guard against double-tap (disable button while
   open). Wire Razorpay `handler` (success) and `modal.ondismiss` (cancel).
5. **verifying** — on Razorpay success, call **(c) verify**.
   - `success: true` → **success**; signal app `success` with `endDate` + `planId` (§6).
   - network/5xx error → call **(d) status** once; `active` → **success**, else **failed**.
6. **cancel** — Razorpay dismissed by user → signal `cancel`, show a "Resume / Close" screen.
7. **failed** — payment failed → signal `failed`, offer **Retry** (re-open Razorpay with the
   *same* order; do not create a second order unless the first expired).

### Razorpay wiring (sketch)
```ts
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  order_id: order.orderId,
  amount: order.amount * 100,
  currency: order.currency,
  name: 'SyncTrip',
  description: order.planName,
  handler: (res) => verify(res),                 // → verifying
  modal: { ondismiss: () => signalApp('cancel') }, // → cancel
  theme: { color: '#<brand>' },
};
const rzp = new window.Razorpay(options);
rzp.on('payment.failed', () => signalApp('failed'));
rzp.open();
```

Load the SDK with `next/script`:
```tsx
<Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
```
Before opening, guard for `typeof window.Razorpay !== 'undefined'`; if the script failed to
load (offline WebView), show **error** with Retry.

---

## 6. Signalling the result back to the app (REQUIRED)

The WebView listens **two** ways. Implement **A** always; **B** as fallback.

### A — postMessage (preferred)
```ts
function signalApp(status: 'success' | 'failed' | 'cancel', extra?: { endDate?: string; planId?: string }) {
  const payload = JSON.stringify({ status, ...extra });
  // iOS WebView (React Native)
  (window as any).ReactNativeWebView?.postMessage?.(payload);
}
```
- `success` → app closes the sheet, shows success screen.
- `failed`  → app shows failure screen.
- `cancel` / `close` → app just closes the sheet.

> Send the signal **once** per terminal state. Guard with a `signalledRef` so re-renders or a
> late Razorpay callback can't double-fire.

### B — redirect URL (fallback)
Navigate to a URL containing one of these substrings (the app watches the URL):
- `…/payment-success` → success    ·    `…/payment-failed` → failure

**Never include the `token` in these redirect URLs.**

### If the user closes the sheet manually
The app can't see a signal, so it shows a *"Did you complete the payment?"* sheet:
- **Yes, I paid** → app calls `GET /subscription/active` (and/or reconcile) and unlocks Plus
  if active.
- **Retry payment** → app re-opens this checkout page.

This is why verify/reconcile are idempotent (they are).

---

## 7. Optional hardening (later, not v1)

Instead of the raw JWT in the URL, add an app→backend exchange:
`POST {base}/subscription/web-checkout-token` → short-lived single-use `checkoutToken`. The app
passes that; the page exchanges it for a scoped session. If/when we do this, the page can move
its API calls into **Next.js Route Handlers** (`src/app/api/checkout/*`) so the token is read
server-side and never reaches browser JS. **Not required for v1.**

---

## 8. Security checklist (website side)

- [x] **No `RAZORPAY_SECRET` anywhere on the website** — it stays on the SyncTrip backend (§0).
- [ ] Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` (public) is used client-side.
- [ ] Never trust `amount` / `walletApplied` from anywhere except the **create order** response.
- [ ] Validate the token via **create order** before showing the summary; on `401` show
      "session expired, reopen from the app".
- [ ] **Never log** the `token` or the full checkout URL; keep it out of analytics & redirects.
- [ ] Set the route to **`no-store`** and **`noindex`** (§9); add `/checkout` to `robots.ts` disallow.
- [ ] HTTPS only.
- [ ] Confirm with backend team that the Razorpay **order webhook** (`order.paid` /
      `payment.captured`) also calls the idempotent finalize path — this is the ultimate
      backstop (backend item, §10).

---

## 9. Next.js specifics for this repo

```tsx
// src/app/checkout/page.tsx
import { Suspense } from 'react';
import CheckoutClient from './CheckoutClient';

export const dynamic = 'force-dynamic';     // never statically cached
export const metadata = { robots: { index: false, follow: false } }; // noindex

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutClient />
    </Suspense>
  );
}
```
- `useSearchParams()` requires the `<Suspense>` boundary above (Next 15 build rule).
- Add **no-store** headers for `/checkout` in `next.config.ts` (or a middleware) —
  `Cache-Control: no-store`.
- Add `'/checkout'` to the `disallow` list in `src/app/robots.ts` (alongside `/api/` etc.).
- Reuse the existing `react-hot-toast` for transient errors, but **terminal** states should be
  full-screen UI (not just a toast) since this is a one-purpose WebView page.
- New env var to add to `.env.local` and prod: `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx`.

### Types
```ts
// src/app/checkout/checkout.types.ts
export interface CreateOrderData {
  orderId: string; amount: number; currency: string;
  planId: string; planName: string; price: number; walletApplied: number;
}
export interface VerifyData { subscription?: { endDate?: string; planId?: string } }
export interface OrderStatusData { status: 'active' | 'pending'; subscription?: { endDate?: string } }
```

---

## 10. Open item for the SyncTrip BACKEND team (not the website)

For full resilience, add a Razorpay **webhook** handler for `order.paid` /
`payment.captured` that calls the same idempotent finalize path (`_finalizeWalletOrder`)
using the order's `notes` (`userId`, `planId`, `walletApplied`). That guarantees activation
even if the user closes everything immediately after paying. (Recurring-subscription webhook
exists today; the one-time **order** webhook may need adding.)

---

## TL;DR for the website dev
1. Add `/checkout` route (client component) — read `planId`, `applyWallet`, `token` from URL.
2. Build a **dedicated axios client** whose token comes from the **URL**, not cookies.
3. `POST {base}/subscription/razorpay/order` (bearer token) → render summary from `amount` +
   `walletApplied` (display only, never alter).
4. Open Razorpay Checkout with `NEXT_PUBLIC_RAZORPAY_KEY_ID` + the returned order.
5. `POST {base}/subscription/razorpay/order/verify`; if it errors, fall back to the `/status`
   reconcile endpoint once.
6. `window.ReactNativeWebView.postMessage({status, endDate, planId})` exactly once.
7. **No Razorpay secret on the website. Never log the token. `no-store` + `noindex`.**
```

## 11. Test checklist
- [ ] Happy path: wallet applied → pay → verify → `success` postMessage with `endDate`.
- [ ] `applyWallet=0` path shows ₹price and no wallet line.
- [ ] Expired/garbage token → `401` → "reopen from app" screen (no crash, no leaked token).
- [ ] User dismisses Razorpay modal → exactly one `cancel` signal.
- [ ] `payment.failed` → one `failed` signal + Retry reuses the same order.
- [ ] Verify network failure → `/status` reconcile resolves to the true state.
- [ ] Razorpay script blocked/offline → error screen with Retry, no white screen.
- [ ] Double-tapping **Pay** opens Razorpay only once.
- [ ] `token` never appears in console logs, network analytics, or any redirect URL.
