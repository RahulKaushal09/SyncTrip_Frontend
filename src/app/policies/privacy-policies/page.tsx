// app/privacy-policy/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Privacy Policy | SyncTrip",
  description:
    "Read the privacy policy for SyncTrip, explaining how we collect, use, share, and protect user information in compliance with applicable laws in India.",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
};

const sections = [
  {
    number: "1",
    title: "Information We Collect",
    subsections: [
      {
        label: "a. Information You Provide",
        items: [
          {
            term: "Account details",
            detail:
              "Name, email, phone number, profile photo, gender, age (for verification), and activity preferences.",
          },
          {
            term: "Group & Activity details",
            detail:
              "Activity type (trips, riders, movies, sports, outings), destinations, dates, group preferences, and itineraries.",
          },
          {
            term: "Face Verification Data",
            detail:
              "When accessing group chat, you may be required to submit a selfie for one-time face verification. This image is processed solely to verify your identity against your profile photo. Raw selfie images are deleted within 24 hours of processing. Verification status (pass/fail) may be retained for account integrity purposes.",
          },
          {
            term: "Communications",
            detail: "Chat messages and shared plans within groups.",
          },
        ],
      },
      {
        label: "b. Automatically Collected",
        items: [
          {
            term: "Usage data",
            detail:
              "Device info (model, OS version, app version), IP address, browser type, pages viewed, and interaction logs.",
          },
          {
            term: "Advertising identifiers",
            detail:
              "With your consent, we collect your device's advertising identifier (Apple IDFA on iOS, Google Advertising ID on Android) and limited in-app event data for the purposes described in Sections 2 and 3B. You can disable this at any time via the in-app “Personalized ads & audience matching” toggle in Settings → Privacy, or by denying App Tracking Transparency permission on iOS.",
          },
          {
            term: "Location data (SyncMaps)",
            detail:
              "If you enable SyncMaps, your real-time location is collected and shared with nearby SyncTrip users on the map. By default, location is shared at approximate precision (~500 meters). You may switch to precise sharing (~150 meters) or hidden mode (not visible to others) at any time within the app. Location is collected only while SyncMaps is active.",
          },
          {
            term: "Analytics",
            detail: "Interaction logs via tools like Google Analytics.",
          },
        ],
      },
      {
        label: "c. From Third Parties",
        items: [
          {
            term: "Login providers",
            detail: "Verification data from login providers (e.g., Google).",
          },
        ],
      },
      {
        label: "d. Subscription & Billing Data",
        items: [
          {
            term: "Subscription details",
            detail:
              "When you purchase SyncTrip Plus we collect the plan selected, billing period, transaction ID, payment method type (e.g., UPI, card type, wallet - but not the full card number or UPI VPA), subscription status, renewal date, and the platform that processed the payment (Razorpay, Apple, or Google).",
          },
          {
            term: "What we never see",
            detail:
              "Card numbers, CVVs, and UPI PINs are never seen or stored by SyncTrip. They go directly from your device to the payment processor over a secured channel.",
          },
        ],
      },
    ],
    note: "Face verification data constitutes sensitive personal data under the DPDP Act 2023 and IT (SPDI) Rules, 2011. We do not collect other sensitive personal data (e.g., health details) unless voluntarily shared. Payment is handled by our payment processors; we store only billing metadata, never full payment-instrument details.",
  },
  {
    number: "2",
    title: "How We Use Your Information",
    items: [
      {
        term: "Core services",
        detail:
          "Group creation and management, activity coordination (trips, riders, movies, sports, outings), chat, and itinerary collaboration.",
      },
      {
        term: "Face Verification",
        detail:
          "To verify your identity before enabling chat access within groups, ensuring only profile-verified users can communicate.",
      },
      {
        term: "SyncMaps & Proximity",
        detail:
          "To display your approximate or precise location (per your chosen setting) to other nearby SyncTrip users and enable in-person meetups for group activities.",
      },
      {
        term: "Platform improvement",
        detail: "Analytics, feature development, and performance monitoring.",
      },
      {
        term: "Communications",
        detail: "Notifications, updates, and support.",
      },
      {
        term: "Safety",
        detail: "Detect fraud, enforce policies, and protect the community.",
      },
      {
        term: "Marketing",
        detail: "Optional promotional emails (opt-out available at any time).",
      },
      {
        term: "Advertising & Audience Matching",
        detail:
          "With your consent, we use limited identifiers (such as a hashed email address, hashed phone number, and device/advertising identifiers) and in-app activity signals to measure the performance of our advertising, to show you relevant SyncTrip ads on third-party platforms, and to build “lookalike” audiences that help us reach people similar to our existing users. You can withdraw this consent at any time in the app settings or by contacting us, after which we stop using your data for these purposes.",
      },
    ],
  },
  {
    number: "3",
    title: "How We Share Your Information",
    items: [
      {
        term: "With Group Members",
        detail:
          "When you join or create a group (trips, riders, movies, sports, outings), your profile and relevant activity details are visible to other members of that group.",
      },
      {
        term: "SyncMaps Visibility",
        detail:
          "Your location on SyncMaps is visible to nearby SyncTrip users at the precision level you have chosen (hidden, approximate ~500m, or precise ~150m). You control this at all times.",
      },
      {
        term: "Service Providers",
        detail:
          "Hosting (e.g., AWS) and analytics providers, all bound by confidentiality obligations.",
      },
      {
        term: "Payment Processors",
        detail:
          "Razorpay (Android and web payments), Apple Inc. (iOS in-app purchases), and Google LLC (Play Billing where applicable). These processors receive the minimum data needed to charge your subscription and operate under their own privacy commitments.",
      },
      {
        term: "Advertising Partners",
        detail:
          "With your consent, we share limited identifiers (hashed email, hashed phone number, device/advertising identifiers) and in-app event data with advertising platforms — currently Meta Platforms, Inc. (Facebook/Instagram) and Google LLC — solely to measure advertising performance, deliver relevant ads, and create audience segments. Identifiers are hashed before sharing where supported. These platforms process this data under their own terms. We do not share your name, chat content, photos, or precise location with advertising partners, and we do not sell your personal data.",
      },
      {
        term: "Legal Requirements",
        detail:
          "When required by law, court order, or to protect rights and safety.",
      },
      {
        term: "Business Transfers",
        detail:
          "In case of merger, acquisition, or asset sale, with appropriate notice to users.",
      },
    ],
    note: "We do not sell your personal data.",
  },
  {
    number: "3A",
    title: "Biometric & Face Verification Data",
    highlight: true,
    content: `SyncTrip collects facial image data solely for the purpose of verifying your identity before granting chat access within groups. This constitutes sensitive personal data under the DPDP Act 2023 and IT (SPDI) Rules, 2011.

We commit to the following:
• Raw selfie images are deleted within 24 hours of verification processing.
• We do not use facial data for recognition beyond one-time identity verification.
• We do not share facial data with any third party.
• Verification status (pass/fail) may be retained for account security during your account's lifetime.
• You may refuse face verification, but group chat access will be restricted.
• You may request deletion of any stored verification data by contacting synctripofficial@gmail.com.`,
  },
  {
    number: "3B",
    title: "Advertising Technologies (Meta SDK & Conversions API)",
    content: `To measure our advertising and show you relevant SyncTrip ads, our mobile app integrates the Meta SDK (software provided by Meta Platforms, Inc., operator of Facebook and Instagram). With your consent, this SDK collects and transmits to Meta certain in-app events (such as app installs, sign-ups, and key actions) together with device and advertising identifiers. We also use server-side tracking through Meta's Conversions API (CAPI), which sends the same categories of event data to Meta from our servers, with identifiers such as email and phone number hashed before transmission. Google's equivalent advertising and measurement tools may be used in the same way.

This data is used to attribute ad performance, deliver relevant ads, and build "lookalike" audiences — it is not used to share your name, chat content, photos, or precise location. Meta processes this information as an independent controller under its own terms; you can review how Meta handles it in the Meta Privacy Policy. You can turn off personalized advertising and audience matching at any time through the advertising-consent toggle in the app settings or by contacting synctripofficial@gmail.com, after which we stop sending your data for these purposes.`,
    link: {
      label: "Meta Privacy Policy",
      href: "https://www.facebook.com/about/privacy",
    },
  },
  {
    number: "4",
    title: "Data Retention",
    content: `We retain your data for as long as your account is active or as needed for legal and compliance purposes.

• Deleted accounts: Data is anonymized or removed within 30 days (except where required for legal holds or backups).
• Face verification images: Deleted within 24 hours of processing.
• Verification status: Retained for account integrity for the duration of your account.
• Location data: Not stored persistently beyond the active SyncMaps session unless required for dispute resolution.
• Billing and tax records: As required by the Companies Act 2013 and the GST Act, transaction records, invoices, and subscription-status history are retained for 8 years from the end of the financial year, even after account deletion. This applies only to billing metadata - not to your profile, chats, or photos, which follow the standard 30-day deletion rule.
• Advertising event data shared with Meta and Google is retained by those platforms per their own retention policies. We do not store individual ad-event records ourselves beyond status flags used to prevent duplicate reporting.`,
  },
  {
    number: "5",
    title: "Your Rights and Choices",
    content: `Under applicable laws (including the DPDP Act 2023):

• Access, correct, or delete your personal data.
• Withdraw consent at any time (may limit certain features).
• Opt out of marketing communications.
• Opt out of personalized advertising and audience matching at any time (in-app settings or by contacting us).
• Request data portability.
• File complaints with the Data Protection Board of India.
• Location precision control: Change your SyncMaps visibility (hidden, approximate, precise) at any time within the app.
• Face verification data: Request deletion of stored verification data at any time.

Contact synctripofficial@gmail.com to exercise any of these rights. We respond within 30 days.`,
  },
  {
    number: "6",
    title: "Security",
    content: `We use industry-standard security measures including encryption in transit and at rest, access controls, and regular security audits. Face verification data is handled with heightened security given its sensitive nature.

No system is fully secure. You are responsible for maintaining the security of your device and account credentials. Report any suspected unauthorized access immediately to synctripofficial@gmail.com.`,
  },
  {
    number: "7",
    title: "International Data Transfers",
    content:
      "Data may be processed outside India (e.g., on cloud infrastructure) with appropriate safeguards such as standard contractual clauses, ensuring your data receives equivalent protection.",
  },
  {
    number: "8",
    title: "Children's Privacy",
    content: `SyncTrip is strictly for users aged 18 and above. We do not knowingly collect data from minors.

Face verification is used as an additional safeguard. If during verification or through a credible report we determine a user may be a minor, their account will be immediately suspended pending review. If you believe a minor has registered, contact us immediately at synctripofficial@gmail.com.`,
  },
  {
    number: "9",
    title: "Updates to This Policy",
    content:
      "We may update this Policy as our features and legal obligations evolve. Material changes will be notified via email or in-app notification at least 7 days before taking effect. Continued use after changes constitutes acceptance.",
  },
];

export default function PrivacyPolicyPage() {
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
          {/* decorative circle */}
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
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
                background: "#818cf8",
              }}
            />
            <span style={{ fontSize: "12px", color: "#a5b4fc", fontWeight: 600, letterSpacing: "0.05em" }}>
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
            Privacy Policy
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}>
            Effective Date: June 20, 2026 &nbsp;·&nbsp; Governs all SyncTrip Platform services
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
            SyncTrip respects your privacy. This Policy explains how we collect, use, share, and
            protect your personal information in compliance with India&apos;s{" "}
            <strong style={{ color: "#e2e8f0" }}>
              Digital Personal Data Protection Act, 2023 (DPDP Act)
            </strong>{" "}
            and IT (SPDI) Rules, 2011. By using the Platform, you consent to the practices described here.
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
                  transition: "background 0.2s",
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
                ? "1.5px solid #6366f1"
                : "1px solid #e2e8f0",
              boxShadow: section.highlight
                ? "0 0 0 4px rgba(99,102,241,0.06), 0 2px 8px rgba(0,0,0,0.04)"
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
                  background: section.highlight ? "#6366f1" : "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.3px",
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
                }}
              >
                {section.title}
                {section.highlight && (
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6366f1",
                      background: "rgba(99,102,241,0.1)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                      verticalAlign: "middle",
                      letterSpacing: "0.04em",
                    }}
                  >
                    SENSITIVE DATA
                  </span>
                )}
              </h2>
            </div>

            {/* Subsections */}
            {"subsections" in section && section.subsections && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {section.subsections.map((sub) => (
                  <div key={sub.label}>
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#6366f1",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {sub.label}
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {sub.items.map((item) => (
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
                              background: "#6366f1",
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
                  </div>
                ))}
              </div>
            )}

            {/* Flat items list */}
            {"items" in section && section.items && (
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
                        background: "#6366f1",
                        marginTop: "7px",
                      }}
                    />
                    <div>
                      <span
                        style={{ fontSize: "14px", fontWeight: 700, color: "#1e293b" }}
                      >
                        {item.term}:{" "}
                      </span>
                      <span
                        style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7 }}
                      >
                        {item.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Prose content */}
            {"content" in section && section.content && (
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

            {/* External link */}
            {"link" in section && section.link && (
              <a
                href={section.link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  marginTop: "14px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#4338ca",
                  background: "rgba(99,102,241,0.08)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  textDecoration: "none",
                }}
              >
                {section.link.label} ↗
              </a>
            )}

            {/* Note */}
            {"note" in section && section.note && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "rgba(99,102,241,0.06)",
                  borderRadius: "10px",
                  borderLeft: "3px solid #6366f1",
                }}
              >
                <p style={{ margin: 0, fontSize: "13px", color: "#4338ca", lineHeight: 1.6 }}>
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
            <p style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: 700, color: "#f8fafc" }}>
              Questions about this Policy?
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>
              Grievance Officer: Rahul Kaushal, Founder &amp; Grievance Officer, SyncTrip Digital Private Limited.
              <br />
              Contact: synctripofficial@gmail.com &nbsp;·&nbsp; Data Protection Board of India complaints accepted.
            </p>
          </div>
          <a
            href="mailto:synctripofficial@gmail.com"
            style={{
              display: "inline-block",
              background: "#6366f1",
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