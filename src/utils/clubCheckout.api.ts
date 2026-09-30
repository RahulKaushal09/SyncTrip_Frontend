import axios, { AxiosError } from "axios";
import type { WebAttribution } from "./webAttribution";

/**
 * Website club-event checkout → backend /api/web-checkout.
 * Its own axios instance: no cookies, no app token. The only credential is the
 * short-lived checkout token /book returns after the phone OTP.
 */

const BASE = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:5000";
const http = axios.create({ baseURL: BASE, timeout: 20000, headers: { "Content-Type": "application/json" } });

export type CheckoutQuote = {
  seats: number;
  currency: string;
  ticketPrice: number;
  subtotal: number;
  tierLines?: { label?: string; price: number; seats: number }[];
  platformFee: number;
  amountPayable: number;
  memberDiscountPercent?: number;
  seatsLeft: number;
};

export type CheckoutOrder = {
  bookingId: string;
  orderId: string;
  amount: number;
  currency: string;
  subtotal: number;
  platformFee: number;
  seats: number;
  razorpayKeyId?: string;
  prefill: { name?: string; contact?: string };
};

export type BookResult =
  | { token: string; free: true; status: "confirmed"; seats: number; name: string; isNewUser: boolean }
  | { token: string; free: false; name: string; isNewUser: boolean; checkout: CheckoutOrder };

export class CheckoutError extends Error {
  code: string;
  supportEmail?: string;
  constructor(code: string, message: string, supportEmail?: string) {
    super(message);
    this.code = code;
    this.supportEmail = supportEmail;
  }
}

function toError(e: unknown): CheckoutError {
  const ax = e as AxiosError<{ code?: string; error?: string; supportEmail?: string }>;
  const d = ax?.response?.data;
  if (d?.code) return new CheckoutError(d.code, d.error || "Something went wrong", d.supportEmail);
  if (ax?.response?.status === 429) return new CheckoutError("RATE_LIMITED", "Too many attempts. Please wait a few minutes.");
  return new CheckoutError("NETWORK", "Couldn't reach SyncTrip. Check your connection and try again.");
}

export async function getQuote(eventId: string, seats: number): Promise<CheckoutQuote> {
  try {
    const r = await http.get<CheckoutQuote>(`/web-checkout/club-events/${encodeURIComponent(eventId)}/quote`, { params: { seats } });
    return r.data;
  } catch (e) {
    throw toError(e);
  }
}

export async function sendOtp(phone: string): Promise<void> {
  try {
    await http.post("/web-checkout/otp/send", { phone });
  } catch (e) {
    throw toError(e);
  }
}

export async function book(eventId: string, body: {
  phone: string; otp: string; name: string; gender: string; seats: number; attribution: WebAttribution;
}): Promise<BookResult> {
  try {
    const r = await http.post<BookResult>(`/web-checkout/club-events/${encodeURIComponent(eventId)}/book`, body);
    return r.data;
  } catch (e) {
    throw toError(e);
  }
}

export async function verifyPayment(eventId: string, token: string, resp: {
  razorpay_order_id?: string; razorpay_payment_id: string; razorpay_signature: string;
}): Promise<{ status: string; bookingId?: string }> {
  try {
    const r = await http.post(`/web-checkout/club-events/${encodeURIComponent(eventId)}/verify`, resp, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return r.data;
  } catch (e) {
    throw toError(e);
  }
}
