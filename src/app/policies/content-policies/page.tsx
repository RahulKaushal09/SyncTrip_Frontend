// app/community-guidelines/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Community Guidelines",
  description:
    "Read SyncTrip Community Guidelines to understand allowed and prohibited content, safety rules, face verification policies, SyncMaps conduct, and enforcement policies for a respectful travel coordination platform.",
};

const sections = [
  {
    id: "core-principles",
    icon: "🧭",
    title: "Core Principles",
    items: [
      {
        label: "Travel-Focused",
        text: "Use SyncTrip only for planning and coordinating trips. No dating, romantic solicitation, or non-travel connections.",
      },
      {
        label: "Respect",
        text: "Treat others with kindness and inclusivity regardless of background, identity, or travel style.",
      },
      {
        label: "Safety First",
        text: "Prioritize real-world safety in all interactions, both online and during in-person meetups.",
      },
    ],
  },
  {
    id: "allowed-content",
    icon: "✅",
    title: "Allowed Content",
    items: [
      {
        label: null,
        text: "Genuine trip plans, itineraries, and destination discussions.",
      },
      {
        label: null,
        text: "Positive collaboration, travel tips, and community support.",
      },
      {
        label: null,
        text: "Sharing travel experiences, photos from trips, and honest reviews of destinations.",
      },
    ],
  },
  {
    id: "prohibited",
    icon: "🚫",
    title: "Prohibited Content & Behavior",
    items: [
      {
        label: null,
        text: "Harassment, hate speech, or discrimination based on gender, religion, caste, nationality, disability, or any other characteristic.",
      },
      {
        label: null,
        text: "Explicit, sexual, or romantic content of any kind.",
      },
      {
        label: null,
        text: "Threats, violence, or promotion of illegal activities.",
      },
      {
        label: null,
        text: "Scams, spam, phishing attempts, or financial solicitation.",
      },
      {
        label: null,
        text: "False or misleading information that could endanger others.",
      },
      {
        label: null,
        text: "Unauthorized commercial promotion or advertising.",
      },
    ],
  },
  {
    id: "child-safety",
    icon: "🛡️",
    title: "Child Safety Policy",
    badge: "Updated",
    items: [
      {
        label: "Age Restriction",
        text: "SyncTrip is strictly an 18+ platform. All users must be adults to register and participate.",
      },
      {
        label: "Face Verification",
        text: "SyncTrip uses face verification to confirm user identity. If during this process we detect or receive credible reports that a user may be a minor, their account will be immediately suspended pending review.",
      },
      {
        label: "Feature Restrictions",
        text: "Group features, SyncMaps, and chat are restricted to verified adult users only. These features will not be accessible until age verification is successfully completed.",
      },
      {
        label: "Reporting",
        text: "Any content involving or targeting minors must be reported immediately. SyncTrip will cooperate fully with law enforcement in such cases.",
      },
    ],
  },
  {
    id: "syncmaps-conduct",
    icon: "🗺️",
    title: "SyncMaps Conduct",
    badge: "New",
    items: [
      {
        label: "Location-Based Harassment",
        text: "Users must not use SyncMaps or location data from the app to follow, stalk, or repeatedly appear near another user without consent. Reports of location-based harassment will result in immediate suspension.",
      },
      {
        label: "Consent & Boundaries",
        text: "Location sharing is a trust feature. Only share your location with users you have explicitly agreed to coordinate with. Do not attempt to track or infer the location of users who have not shared it with you.",
      },
      {
        label: "Group Coordination Only",
        text: "SyncMaps is designed for coordinating group travel plans — not for monitoring individuals. Misuse of this feature for surveillance or coercion is strictly prohibited.",
      },
    ],
  },
  {
    id: "face-verification",
    icon: "🪪",
    title: "Face Verification Policy",
    badge: "New",
    items: [
      {
        label: "Authentic Submission Required",
        text: "Submitting any image other than your own face for verification purposes — including images of other people, cartoons, AI-generated faces, or manipulated photos — is a violation of this Content Policy.",
      },
      {
        label: "Identity Integrity",
        text: "Attempting to impersonate another individual through verification, or using fraudulent documents or images, will result in permanent account termination and may be reported to relevant authorities.",
      },
      {
        label: "Data Handling",
        text: "Face verification data is processed solely for age and identity confirmation. It is not used for marketing, profiling, or shared with third parties outside of legally mandated circumstances.",
      },
    ],
  },
  {
    id: "safety-rules",
    icon: "🔒",
    title: "Safety-Specific Rules",
    items: [
      {
        label: null,
        text: "Do not pressure others for private meetings or personal information.",
      },
      {
        label: null,
        text: "Report users who make you feel uncomfortable — your report is confidential.",
      },
      {
        label: null,
        text: "We strongly encourage public meetups only after trust is established over time.",
      },
      {
        label: null,
        text: "Never share financial information or make payments through the app.",
      },
    ],
  },
  {
    id: "enforcement",
    icon: "⚖️",
    title: "Enforcement",
    items: [
      {
        label: null,
        text: "All reports are reviewed promptly by our Trust & Safety team.",
      },
      {
        label: null,
        text: "Violations may lead to warnings, content removal, feature restrictions, or permanent bans depending on severity.",
      },
      {
        label: null,
        text: "Severe violations — including threats, location-based harassment, and child safety violations — are reported to law enforcement.",
      },
      {
        label: null,
        text: "You may appeal enforcement decisions by contacting support@synctrip.app within 14 days.",
      },
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4ff 0%, #f8fafc 50%, #fff7f0 100%)",
        padding: "48px 16px 64px",
        fontFamily: "'Georgia', 'Times New Roman', serif",
      }}
    >
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>

        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#1e40af",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "'Arial', sans-serif",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "999px",
              marginBottom: "20px",
            }}
          >
            <span>📋</span>
            <span>Community Guidelines</span>
          </div>

          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 700,
              color: "#0c1a3a",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            SyncTrip Community Guidelines
          </h1>

          <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#64748b", fontFamily: "Arial, sans-serif" }}>
            Effective Date: January 22, 2026 &nbsp;·&nbsp; Last Updated: 2026
          </p>

          <p
            style={{
              margin: "16px 0 0 0",
              fontSize: "16px",
              color: "#334155",
              lineHeight: 1.7,
              maxWidth: "680px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            These Guidelines outline expected behavior to keep SyncTrip safe, respectful,
            and focused on travel coordination. All users must read and agree to these
            guidelines upon registration.
          </p>

          {/* Update Banner */}
          <div
            style={{
              marginTop: "20px",
              padding: "14px 18px",
              background: "linear-gradient(90deg, #fef3c7, #fef9ee)",
              border: "1px solid #f59e0b",
              borderLeft: "4px solid #f59e0b",
              borderRadius: "8px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
            <div>
              <strong style={{ fontSize: "13px", color: "#92400e", display: "block", marginBottom: "4px" }}>
                POLICY UPDATE NOTICE
              </strong>
              <span style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.5 }}>
                This version includes new policies on <strong>Face Verification</strong>, <strong>SyncMaps Conduct</strong>,
                and an updated <strong>Child Safety Policy</strong>. Please review all highlighted sections carefully.
              </span>
            </div>
          </div>
        </header>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              style={{
                background: "#ffffff",
                borderRadius: "14px",
                border: "1px solid",
                borderColor:
                  section.badge === "New"
                    ? "#bbf7d0"
                    : section.badge === "Updated"
                      ? "#bfdbfe"
                      : "rgba(0,0,0,0.07)",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                overflow: "hidden",
              }}
            >
              {/* Section Header */}
              <div
                style={{
                  padding: "18px 24px",
                  background:
                    section.badge === "New"
                      ? "linear-gradient(90deg, #f0fdf4, #ffffff)"
                      : section.badge === "Updated"
                        ? "linear-gradient(90deg, #eff6ff, #ffffff)"
                        : "#fafafa",
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "22px" }}>{section.icon}</span>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "#0f172a",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {section.title}
                </h2>
                {section.badge && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "Arial, sans-serif",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      padding: "3px 10px",
                      borderRadius: "999px",
                      background: section.badge === "New" ? "#dcfce7" : "#dbeafe",
                      color: section.badge === "New" ? "#166534" : "#1e40af",
                      border: `1px solid ${section.badge === "New" ? "#86efac" : "#93c5fd"}`,
                    }}
                  >
                    {section.badge}
                  </span>
                )}
              </div>

              {/* Section Items */}
              <ul
                style={{
                  margin: 0,
                  padding: "16px 24px 20px",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {section.items.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "#94a3b8",
                        marginTop: "8px",
                      }}
                    />
                    <p style={{ margin: 0, fontSize: "14.5px", color: "#334155", lineHeight: 1.7 }}>
                      {item.label && (
                        <strong style={{ color: "#0f172a", fontWeight: 700 }}>
                          {item.label}:{" "}
                        </strong>
                      )}
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: "40px",
            padding: "24px",
            background: "#0c1a3a",
            borderRadius: "14px",
            color: "#cbd5e1",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "16px",
            }}
          >
            <div>
              <p style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: 700, color: "#f8fafc" }}>
                🌍 SyncTrip
              </p>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.6 }}>
                Safe travel coordination for verified adults.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "13px" }}>
                Questions? <a href="mailto:support@synctrip.app" style={{ color: "#93c5fd" }}>support@synctrip.app</a>
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
                © 2026 SyncTrip. All rights reserved.
              </p>
            </div>
          </div>
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              fontSize: "13px",
              lineHeight: 1.6,
              color: "#94a3b8",
            }}
          >
            Help keep SyncTrip safe — report violations directly in the app using the{" "}
            <strong style={{ color: "#cbd5e1" }}>Report</strong> button on any profile or message.
            Our Trust & Safety team reviews every report.
          </div>
        </footer>
      </div>
    </main>
  );
}