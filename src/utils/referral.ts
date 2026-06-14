/**
 * Referral invite helpers.
 *
 * The referral landing page (/invite/referral/[code]) is public — the 8-char
 * code is the credential. These helpers validate the code format and fetch the
 * referrer's public info (first name + photo only) from the backend.
 */

// Backend alphabet: A-Z minus I, L, O  +  2-9 (no 0, 1).
// Mirrors CODE_ALPHABET ("ABCDEFGHJKMNPQRSTUVWXYZ23456789") on the backend.
const CODE_FORMAT = /^[A-CDEFGHJ-KM-NP-Z2-9]{8}$/;

export type Referrer = {
  firstName: string;
  profilePicture: string | null;
};

/**
 * Result of resolving a referral code.
 *  - valid:       code is good. `referrer` is the named inviter, or null if the
 *                 backend confirmed the code but exposed no profile (hidden).
 *  - invalid:     bad format, unknown code, or backend said valid:false. The
 *                 page hides the code and drops referral attribution.
 *  - unreachable: backend timed out / errored. Degrade gracefully — still show
 *                 the code so the in-app clipboard flow works; just no name.
 */
export type ReferralResult =
  | { state: "valid"; referrer: Referrer | null }
  | { state: "invalid" }
  | { state: "unreachable" };

/**
 * Reject obviously bad input before hitting the backend. The URL is
 * user-shared, so never trust it.
 */
export function isValidCodeFormat(code: string): boolean {
  return CODE_FORMAT.test(code);
}

/**
 * Server-side resolution of a referral code.
 *
 * Called from a Server Component, so there is no CORS surface (server-to-server)
 * and no auth — the code is the credential.
 */
export async function resolveReferral(code: string): Promise<ReferralResult> {
  if (!isValidCodeFormat(code)) return { state: "invalid" };

  const base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";

  try {
    const res = await fetch(`${base}/referral/validate/${code}`, {
      // No auth needed — code is the credential.
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    // 4xx → the code itself is bad/unknown. 5xx → our problem, degrade.
    if (!res.ok) {
      return res.status >= 500 ? { state: "unreachable" } : { state: "invalid" };
    }

    const body = await res.json();
    const data = body?.data;
    if (!data?.valid) return { state: "invalid" };

    const r = data.referrer;
    const referrer: Referrer | null = r?.firstName
      ? { firstName: String(r.firstName), profilePicture: r.profilePicture ?? null }
      : null;

    return { state: "valid", referrer };
  } catch {
    // Timeout / network error — don't show an error, just drop attribution.
    return { state: "unreachable" };
  }
}
