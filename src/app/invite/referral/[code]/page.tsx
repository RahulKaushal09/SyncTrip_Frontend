// app/invite/referral/[code]/page.tsx
//
// Referral invite landing page. Renders ONLY when the SyncTrip app is not
// installed — when it is, the OS opens the app directly via Universal Links
// (iOS) / App Links (Android), and this page never loads. That bypass is wired
// in public/.well-known/{apple-app-site-association,assetlinks.json}, whose
// paths already include /invite/*.
//
// The static `referral` segment takes precedence over the sibling dynamic
// `[type]` route (invite/[type]/[slug]), so there is no collision.

import Image from "next/image";
import QRCode from "qrcode";
import { Metadata } from "next";
import { MapPin, Users, Sparkles } from "lucide-react";
import { APP_LINKS } from "@/constants";
import { resolveReferral } from "@/utils/referral";
import ReferralCTA from "@/components/Referral/ReferralCTA";
import GetAppButton from "@/components/Referral/GetAppButton";

// App Store numeric id (from APP_LINKS.APP_STORE) for the iOS Smart App Banner.
const APP_STORE_ID = "6761762665";
const OG_IMAGE = `${APP_LINKS.WEB_HOME}/og/referral-preview.png`;
const REWARD_COPY = "Find travel buddies, plan trips together. Get ₹50 when you join.";

const inviteUrl = (code: string) => `${APP_LINKS.WEB_HOME}/invite/referral/${code}`;

// ─── Metadata (SSR — scraped by WhatsApp/iMessage before any JS runs) ─────────

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ code: string }>;
// }): Promise<Metadata> {
//   const { code: raw } = await params;
//   const code = raw.toUpperCase();
//   const result = await resolveReferral(code);

//   const name = result.state === "valid" ? result.referrer?.firstName : undefined;
//   const title = name
//     ? `${name} invited you to SyncTrip`
//     : "You've been invited to SyncTrip";

//   return {
//     title,
//     description: REWARD_COPY,
//     // Per-user page — must never be indexed (dilutes authority, leaks names).
//     robots: { index: false, follow: false },
//     openGraph: {
//       type: "website",
//       title,
//       description: REWARD_COPY,
//       url: inviteUrl(code),
//       images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: title }],
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description: REWARD_COPY,
//       images: [OG_IMAGE],
//     },
//     other: {
//       // iOS Smart App Banner + best-effort referral pass-through on install.
//       "apple-itunes-app": `app-id=${APP_STORE_ID}, affiliate-data=ct=referral_${code}`,
//     },
//   };
// }

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ReferralInvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: raw } = await params;
  const code = raw.toUpperCase();
  const result = await resolveReferral(code);
  console.log(result);
  const isInvalid = result.state === "invalid";
  const referrer = result.state === "valid" ? result.referrer : null;
  const referrerName = referrer?.firstName;

  // QR (desktop only) — generated server-side so qrcode stays out of the client
  // bundle. Skipped for the invalid state, which shows no code.
  let qrDataUrl: string | null = null;
  if (!isInvalid) {
    try {
      qrDataUrl = await QRCode.toDataURL(inviteUrl(code), {
        margin: 1,
        width: 320,
        color: { dark: "#16324F", light: "#ffffff" },
      });
    } catch {
      qrDataUrl = null;
    }
  }

  return (
    <main className="min-h-screen  flex flex-col items-center px-4 py-10 md:py-16">
      <link rel="preconnect" href="https://apps.apple.com" />
      <link rel="preconnect" href="https://play.google.com" />

      <div className="w-full max-w-[480px] flex flex-col gap-6">
        {/* ── Hero card ── */}
        <section className="bg-white rounded-[28px] border border-neutral-4/70 shadow-[0_8px_40px_rgba(22,50,79,0.07)] p-6 md:p-8 flex flex-col gap-6">
          {isInvalid ? (
            <>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-5 border border-neutral-4">
                  <Sparkles size={14} className="text-primary-1" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-1/60">
                    SyncTrip
                  </span>
                </div>
                <h1 className="h3 text-secondary-1 leading-tight">
                  This invite link is invalid or expired
                </h1>
                <p className="r1 text-neutral-1 leading-relaxed">
                  No worries — you can still join SyncTrip and start planning trips
                  with new travel buddies.
                </p>
              </div>
              <GetAppButton />
            </>
          ) : (
            <>
              {/* Referrer header */}
              <div className="flex flex-col items-center text-center gap-3">
                {referrer?.profilePicture ? (
                  <Image
                    src={referrer.profilePicture}
                    alt={referrerName ?? "Your inviter"}
                    width={72}
                    height={72}
                    className="rounded-full object-cover border-2 border-primary-2"
                  />
                ) : (
                  <div className="w-[72px] h-[72px] rounded-full bg-primary-5 border-2 border-primary-2 flex items-center justify-center">
                    <Users size={30} className="text-primary-1" />
                  </div>
                )}

                <h1 className="h3 text-secondary-1 leading-tight">
                  {referrerName
                    ? `${referrerName} invited you to SyncTrip`
                    : "A friend invited you to SyncTrip"}
                </h1>
                <p className="r1 text-neutral-1 leading-relaxed">
                  You&apos;ll both get{" "}
                  <span className="font-semibold text-secondary-1">₹50</span> on your
                  first paid plan.
                </p>
              </div>

              <ReferralCTA
                code={code}
                inviteUrl={inviteUrl(code)}
                qrDataUrl={qrDataUrl}
              />
            </>
          )}
        </section>

        {/* ── Light explainer (below the fold) ── */}
        <section className="bg-white rounded-[28px] border border-neutral-4/70 shadow-[0_8px_40px_rgba(22,50,79,0.07)] p-6 md:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary-1/50 mb-4">
            How SyncTrip works
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex gap-3 items-start">
              <span className="shrink-0 w-9 h-9 rounded-2xl bg-primary-5 border border-primary-2 flex items-center justify-center text-primary-1">
                <MapPin size={17} />
              </span>
              <p className="text-sm text-secondary-1/80 leading-relaxed">
                <strong className="text-secondary-1">Plan together.</strong> Create
                trips, rides, movies, sports and outings — and coordinate every
                detail in one place.
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="shrink-0 w-9 h-9 rounded-2xl bg-primary-5 border border-primary-2 flex items-center justify-center text-primary-1">
                <Users size={17} />
              </span>
              <p className="text-sm text-secondary-1/80 leading-relaxed">
                <strong className="text-secondary-1">Meet verified people.</strong>{" "}
                Face verification keeps the community safe and adults-only.
              </p>
            </li>
            <li className="flex gap-3 items-start">
              <span className="shrink-0 w-9 h-9 rounded-2xl bg-primary-5 border border-primary-2 flex items-center justify-center text-primary-1">
                <Sparkles size={17} />
              </span>
              <p className="text-sm text-secondary-1/80 leading-relaxed">
                <strong className="text-secondary-1">Discover nearby.</strong> Find
                trips and travellers around you and join the ones that fit.
              </p>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
