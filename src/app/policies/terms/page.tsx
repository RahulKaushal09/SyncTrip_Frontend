// app/terms/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Terms of Use | SyncTrip",
  description:
    "Read the terms of use for SyncTrip, a social activity and travel coordination platform connecting people for group trips, rides, movies, sports, and outings.",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
};

type Item = { term: string; detail: string };

type Section = {
  number: string;
  title: string;
  highlight?: boolean;
  badge?: string;
  intro?: string;
  items?: Item[];
  content?: string;
  note?: string;
  safetyItems?: string[];
};

const sections: Section[] = [
  {
    number: "1",
    title: "Eligibility",
    items: [
      {
        term: "Age requirement",
        detail:
          "You must be at least 18 years old to use SyncTrip. Face verification is used as an additional safeguard to enforce this requirement.",
      },
      {
        term: "Legal capacity",
        detail:
          "You represent that you have the legal capacity to enter into these Terms in your jurisdiction.",
      },
      {
        term: "Accurate information",
        detail:
          "You must provide accurate, complete, and current information during registration and keep it updated at all times.",
      },
    ],
  },
  {
    number: "2",
    title: "Account Registration and Security",
    items: [
      {
        term: "Registration",
        detail:
          "Registration requires a valid email, phone number, or third-party login (e.g., Google).",
      },
      {
        term: "Account responsibility",
        detail:
          "You are solely responsible for all activity on your account and for keeping your credentials secure.",
      },
      {
        term: "Unauthorized use",
        detail:
          "Notify us immediately at synctripofficial@gmail.com of any unauthorized use of your account.",
      },
      {
        term: "Suspension",
        detail:
          "We reserve the right to suspend or terminate accounts for violations of these Terms, suspicious activity, failed face verification, or at our discretion.",
      },
    ],
  },
  {
    number: "3",
    title: "Platform Purpose and Features",
    intro:
      "SyncTrip is a social activity coordination platform - not a dating service, romantic matchmaking platform, or booking service. It is strictly for facilitating group coordination among users who share common activity interests.",
    items: [
      {
        term: "Groups",
        detail:
          "Users create or join Groups for shared activities: Trips (travel planning), Riders (bike rides), Cinema (movies), Sports, and Outings/Hangouts. Groups allow collaborative planning, activity coordination, and group chat.",
      },
      {
        term: "Face Verification for Chat",
        detail:
          "To access group chat, users must complete a one-time face verification by submitting a selfie, which is compared against their profile photo. This is required to maintain community safety. Refusing verification restricts chat access.",
      },
      {
        term: "SyncMaps",
        detail:
          "Users may opt in to SyncMaps to view and be visible to nearby SyncTrip users on a live map. By default, your location is shared at approximate precision (~500 meters). You may switch to precise sharing (~150 meters) or hidden mode (not visible) at any time within the app. Location sharing is active only while SyncMaps is open.",
      },
      {
        term: "No booking services",
        detail:
          "SyncTrip does not book flights, hotels, transportation, or activities. Any arrangements made off-platform are solely between users.",
      },
      {
        term: "Curated content",
        detail:
          "We may display destination info, points of interest, or recommendations for convenience, but do not guarantee accuracy or availability.",
      },
    ],
  },
  {
    number: "4",
    title: "User Responsibilities and Safety",
    intro:
      "You are solely responsible for your interactions with other users. SyncTrip facilitates connections but does not screen users beyond face verification and basic account checks.",
    safetyItems: [
      "Always meet group members in public places first before any private arrangements.",
      "Do not meet in private locations (e.g., hotels, homes) unless you have built substantial trust.",
      "Share your plans with friends or family outside the Platform.",
      "Verify information shared by others independently before acting on it.",
      "Use caution when sharing personal financial information or sensitive details.",
      "Be aware that enabling SyncMaps shares your location with nearby users. Even at approximate precision (~500m), your general area is visible. Only enable precise location sharing if you are comfortable with nearby users knowing your location.",
      "Report any concerning behavior immediately via in-app reporting tools.",
    ],
    note: "SyncTrip is not liable for any outcomes from user interactions, including but not limited to personal safety, disputes, financial loss, or travel disruptions.",
  },
  {
    number: "5",
    title: "Prohibited Conduct",
    highlight: true,
    badge: "IMPORTANT",
    intro: "You agree not to:",
    items: [
      {
        term: "Platform misuse",
        detail:
          "Use the Platform for dating, romantic matchmaking, or any non-activity-related purposes.",
      },
      {
        term: "Harassment",
        detail: "Harass, threaten, abuse, defame, or discriminate against other users.",
      },
      {
        term: "False information",
        detail: "Post false, misleading, or fraudulent group or activity information.",
      },
      {
        term: "Scams",
        detail: "Solicit money, engage in scams, or promote illegal activities.",
      },
      {
        term: "Impersonation",
        detail:
          "Impersonate others, create fake accounts, or submit someone else's photo for face verification.",
      },
      {
        term: "Verification fraud",
        detail:
          "Submit any image other than your own face for verification (cartoons, other people, manipulated photos). This is a serious violation and may be reported to authorities.",
      },
      {
        term: "Location misuse",
        detail:
          "Use SyncMaps or any location data from the Platform to stalk, track, follow, or repeatedly appear near another user without their consent.",
      },
      {
        term: "Spam & privacy",
        detail: "Spam, send unsolicited messages, or violate other users' privacy.",
      },
      {
        term: "Technical interference",
        detail:
          "Upload harmful code, viruses, or otherwise interfere with the Platform's functionality or security.",
      },
      {
        term: "Unauthorized access",
        detail: "Attempt to access other users' accounts or data without permission.",
      },
    ],
    note: "Violations may result in immediate account termination and reporting to law enforcement where applicable.",
  },
  {
    number: "6",
    title: "User Content",
    items: [
      {
        term: "Ownership",
        detail:
          "You retain ownership of content you post (group details, itineraries, messages, photos).",
      },
      {
        term: "License to SyncTrip",
        detail:
          "You grant SyncTrip a worldwide, non-exclusive, royalty-free license to use, display, modify, and distribute your content solely for operating and promoting the Platform.",
      },
      {
        term: "Your responsibility",
        detail:
          "You are responsible for your content and warrant it does not infringe third-party rights, violate any laws, or breach these Terms.",
      },
      {
        term: "Removal",
        detail:
          "We may remove content that violates these Terms or applicable laws without notice.",
      },
    ],
  },
  {
    number: "7",
    title: "Intellectual Property",
    items: [
      {
        term: "SyncTrip IP",
        detail:
          "SyncTrip owns all Platform content, features, branding, and technology (excluding user content).",
      },
      {
        term: "Restrictions",
        detail:
          "You may not copy, modify, reverse-engineer, or create derivative works of any part of the Platform without express written permission.",
      },
    ],
  },
  {
    number: "8",
    title: "Disclaimers",
    items: [
      {
        term: "As-is service",
        detail:
          'The Platform is provided "as is" without warranties of any kind, express or implied.',
      },
      {
        term: "No guarantees",
        detail:
          "We do not guarantee group compatibility, activity outcomes, user reliability, or uninterrupted service.",
      },
      {
        term: "Third-party content",
        detail:
          "Third-party links or information displayed on the Platform are not endorsed by SyncTrip.",
      },
      {
        term: "SyncMaps accuracy",
        detail:
          "Location data on SyncMaps is approximate and may not reflect exact real-time positions. Do not rely solely on SyncMaps for safety decisions.",
      },
    ],
  },
  {
    number: "9",
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by applicable law:

• SyncTrip is not liable for indirect, incidental, special, or consequential damages.
• Our total liability to you is limited to the amount you paid us (if any) in the past 12 months.
• We are not responsible for user conduct, activity risks, location-based interactions, or third-party services.
• We are not liable for any harm arising from SyncMaps usage, face verification disputes, or group interactions arranged through the Platform.`,
  },
  {
    number: "10",
    title: "Termination",
    items: [
      {
        term: "By you",
        detail: "You may delete your account at any time through the app settings.",
      },
      {
        term: "By SyncTrip",
        detail:
          "We may terminate or suspend your access immediately for violations of these Terms, failed verification, or at our discretion without prior notice.",
      },
      {
        term: "Effect",
        detail:
          "Surviving provisions including disclaimers, limitation of liability, and intellectual property rights remain in effect after termination.",
      },
    ],
  },
  {
    number: "11",
    title: "Governing Law and Dispute Resolution",
    items: [
      {
        term: "Governing law",
        detail: "These Terms are governed by the laws of India.",
      },
      {
        term: "Jurisdiction",
        detail:
          "Disputes shall be resolved exclusively in the courts of Chandigarh, India.",
      },
      {
        term: "Consumer disputes",
        detail:
          "For consumer disputes, you may approach relevant consumer forums under Indian law.",
      },
    ],
  },
  {
    number: "12",
    title: "SyncTrip Plus Subscription",
    highlight: true,
    badge: "BILLING",
    intro:
      "SyncTrip Plus is an optional premium subscription. The following terms govern your purchase, renewal, cancellation, and refunds. Prices are inclusive of applicable GST.",
    items: [
      {
        term: "Plans and pricing",
        detail:
          "SyncTrip Plus Weekly - ₹49 per week, auto-renewing every 7 days. SyncTrip Plus Monthly - ₹199 per month, auto-renewing every 30 days. Prices may be adjusted with at least 30 days' advance notice via email and in-app notification. Existing subscribers keep their then-current price until their next renewal.",
      },
      {
        term: "Auto-renewal",
        detail:
          "Your subscription renews automatically at the end of each billing period using the payment method on file. By confirming payment you authorize SyncTrip and the applicable payment processor (Razorpay on Android/web, Apple on iOS, Google on supported Android billing) to charge the published price at each renewal until you cancel.",
      },
      {
        term: "Cancellation",
        detail:
          "You may cancel at any time before the next billing date. Razorpay (Android/web): Settings → Subscription → Cancel, or email synctripofficial@gmail.com from your registered address. Apple (iOS): Apple ID Settings → Subscriptions → SyncTrip → Cancel. Google Play (Android via Play Billing): Google Play → Subscriptions → SyncTrip → Cancel. Cancellation stops the next auto-renewal; you keep Plus access through the end of the current paid period. There is no separate cancellation fee.",
      },
      {
        term: "Refunds",
        detail:
          "All charges are final and non-refundable except: (a) duplicate charges or technical billing errors - full refund within 7 working days of report; (b) inability to access Plus features for more than 48 continuous hours due to a confirmed SyncTrip-side outage - pro-rated credit; (c) charges processed after a successful cancellation - full refund. Apple App Store and Google Play purchases are governed by Apple's and Google's respective refund policies and must be requested through them (https://reportaproblem.apple.com for Apple); SyncTrip cannot directly refund those transactions. For Razorpay-originated charges, email synctripofficial@gmail.com with your registered email/phone and a transaction reference; we aim to respond within 3 working days.",
      },
      {
        term: "Pre-debit notification",
        detail:
          "As required by the Reserve Bank of India for recurring e-mandates, you will receive a notification at least 24 hours before each auto-renewal charge, with instructions to cancel if you no longer wish to renew.",
      },
      {
        term: "Failed payments and grace period",
        detail:
          "If a renewal payment fails, we will retry as permitted by the payment processor. You receive a 3-day grace period during which Plus features remain active. If payment is not successfully collected after the grace period, the subscription is suspended and the account reverts to the free tier.",
      },
      {
        term: "Free trial",
        detail:
          "SyncTrip does not currently offer a free trial. If a free trial is introduced, the trial duration, conversion price, and cancellation deadline will be disclosed before signup.",
      },
      {
        term: "Plan changes",
        detail:
          "Switching between Weekly and Monthly takes effect at the next billing cycle. Downgrades do not prorate; upgrades may prorate where the payment processor supports it.",
      },
      {
        term: "Tax invoices",
        detail:
          "GST-compliant invoices for Razorpay purchases are emailed to your registered address within 7 days of each successful charge. iOS and Android purchases are invoiced by Apple and Google respectively.",
      },
      {
        term: "Termination of Plus by SyncTrip",
        detail:
          "We may suspend or terminate a subscription without refund for material violations of these Terms or the Community Guidelines (including verification fraud, harassment, or abuse). Where required, we will provide notice and a 14-day appeal window.",
      },
    ],
    note: "Apple App Store and Google Play subscriptions are also subject to the terms of those platforms. Where a platform's terms conflict with these Terms for purchases made through that platform, the platform's terms govern the transaction.",
  },
  {
    number: "13",
    title: "Changes to Terms",
    content:
      "We may update these Terms as our features and legal obligations evolve. Significant changes will be notified via email or in-app notification at least 7 days before taking effect. Continued use after changes constitutes your acceptance of the revised Terms.",
  },
];

export default function TermsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f0f4f8",
        padding: "48px 16px 64px",
        fontFamily:
          "'Geist', 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        {/* Header Card */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: "20px",
            padding: "40px 40px 36px",
            marginBottom: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: "100px",
              padding: "6px 14px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#34d399",
              }}
            />
            <span
              style={{
                fontSize: "12px",
                color: "#6ee7b7",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              LEGAL DOCUMENT
            </span>
          </div>
          <h1
            style={{
              margin: "0 0 10px 0",
              fontSize: "32px",
              fontWeight: 800,
              color: "#f8fafc",
              letterSpacing: "-0.5px",
              lineHeight: 1.2,
            }}
          >
            Terms of Use
          </h1>
          <p
            style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}
          >
            Effective Date: June 11, 2026 &nbsp;·&nbsp; Applies to all SyncTrip Platform services
          </p>
          <p
            style={{
              margin: "16px 0 0 0",
              fontSize: "14px",
              color: "#cbd5e1",
              lineHeight: 1.7,
              maxWidth: "600px",
            }}
          >
            Welcome to{" "}
            <strong style={{ color: "#e2e8f0" }}>SyncTrip</strong>, operated by{" "}
            <strong style={{ color: "#e2e8f0" }}>
              SyncTrip Digital Private Limited
            </strong>{" "}
            (&quot;we,&quot; &quot;us,&quot; or &quot;SyncTrip&quot;). SyncTrip is a social activity coordination
            platform - not a dating service or booking platform - for group trips,
            rides, movies, sports, and outings. By using the Platform, you agree to
            these Terms.
          </p>
        </div>

        {/* Quick Nav */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "20px 28px",
            marginBottom: "20px",
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px 0",
              fontSize: "11px",
              fontWeight: 700,
              color: "#94a3b8",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Contents
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {sections.map((s) => (
              <a
                key={s.number}
                href={`#section-${s.number}`}
                style={{
                  fontSize: "13px",
                  color: "#334155",
                  background: "#f1f5f9",
                  borderRadius: "8px",
                  padding: "5px 12px",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {s.number}. {s.title}
              </a>
            ))}
          </div>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div
            key={section.number}
            id={`section-${section.number}`}
            style={{
              background: section.highlight ? "#fafafa" : "#fff",
              borderRadius: "16px",
              padding: "28px 32px",
              marginBottom: "16px",
              border: section.highlight
                ? "1.5px solid #10b981"
                : "1px solid #e2e8f0",
              boxShadow: section.highlight
                ? "0 0 0 4px rgba(16,185,129,0.06), 0 2px 8px rgba(0,0,0,0.04)"
                : "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Section Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  minWidth: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: section.highlight ? "#10b981" : "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {section.number}
              </div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {section.title}
                {section.badge && (
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#10b981",
                      background: "rgba(16,185,129,0.1)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {section.badge}
                  </span>
                )}
              </h2>
            </div>

            {/* Intro paragraph */}
            {section.intro && (
              <p
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  color: "#64748b",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                }}
              >
                {section.intro}
              </p>
            )}

            {/* Items */}
            {section.items && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.items.map((item) => (
                  <div
                    key={item.term}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "12px 14px",
                      background: "#f8fafc",
                      borderRadius: "10px",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <div
                      style={{
                        minWidth: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: section.highlight ? "#10b981" : "#6366f1",
                        marginTop: "7px",
                      }}
                    />
                    <div>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {item.term}:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#475569",
                          lineHeight: 1.7,
                        }}
                      >
                        {item.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Safety items (yellow callout style) */}
            {section.safetyItems && (
              <div
                style={{
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  padding: "16px 18px",
                  marginTop: section.intro ? "0" : "0",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "#92400e",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  ⚠ Safety Guidelines (Strongly Recommended)
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "8px" }}
                >
                  {section.safetyItems.map((item, i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}
                    >
                      <div
                        style={{
                          minWidth: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#d97706",
                          marginTop: "7px",
                        }}
                      />
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          color: "#78350f",
                          lineHeight: 1.65,
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prose content */}
            {section.content && (
              <p
                style={{
                  margin: 0,
                  fontSize: "14px",
                  color: "#475569",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </p>
            )}

            {/* Note */}
            {section.note && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "rgba(99,102,241,0.06)",
                  borderRadius: "10px",
                  borderLeft: "3px solid #6366f1",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#4338ca",
                    lineHeight: 1.6,
                  }}
                >
                  {section.note}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Contact Footer */}
        <div
          style={{
            background: "#0f172a",
            borderRadius: "16px",
            padding: "28px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px 0",
                fontSize: "15px",
                fontWeight: 700,
                color: "#f8fafc",
              }}
            >
              Questions about these Terms?
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              Governed by the laws of India.
              <br />
              Disputes resolved in the courts of Chandigarh, India.
            </p>
          </div>
          <a
            href="mailto:synctripofficial@gmail.com"
            style={{
              display: "inline-block",
              background: "#10b981",
              color: "#fff",
              borderRadius: "10px",
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              letterSpacing: "0.01em",
            }}
          >
            synctripofficial@gmail.com
          </a>
        </div>
      </div>
    </main>
  );
}