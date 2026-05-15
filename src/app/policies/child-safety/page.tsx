// app/child-safety/page.tsx

import { Metadata } from "next";

interface Item {
  label: string | null;
  text: string;
  isEmail?: boolean;
}

interface Subsection {
  heading: string;
  bullets: string[];
}

interface Section {
  id: string;
  icon: string;
  title: string;
  badge?: string;
  items: Item[];
  subsections?: Subsection[];
}

export const metadata: Metadata = {
  title: "SyncTrip Child Safety & Protection Policy",
  description:
    "SyncTrip is committed to maintaining a safe environment and strictly prohibits any form of child sexual abuse or exploitation (CSAE) on the platform. All users must be 18+ and verified.",
};

const sections : Section[] = [
  {
    id: "age-requirement",
    icon: "🔞",
    title: "Age Requirement",
    badge: "Updated",
    items: [
      {
        label: "18+ Only",
        text: "SyncTrip is strictly intended for users aged 18 and above. We do not knowingly allow minors to create accounts, use platform features, or interact with other users in any capacity.",
      },
      {
        label: "Account Removal",
        text: "If we become aware that a user under the age of 18 has created an account, we will immediately suspend the account, remove associated data, and report the incident where legally required.",
      },
      {
        label: "Face Verification",
        text: "SyncTrip uses face verification to confirm user identity and age. If during this process we detect — or receive credible reports — that a user may be a minor, their account will be immediately suspended pending review.",
      },
      {
        label: "Restricted Features",
        text: "Group features, SyncMaps, and in-app chat are restricted to verified adult users only. These features remain inaccessible until age verification is successfully completed.",
      },
    ],
  },
  {
    id: "zero-tolerance",
    icon: "🚫",
    title: "Zero Tolerance Policy",
    items: [
      {
        label: null,
        text: "SyncTrip maintains a strict zero-tolerance policy toward any activity involving the exploitation, abuse, or endangerment of minors.",
      },
    ],
    subsections: [
      {
        heading: "Prohibited conduct includes, but is not limited to:",
        bullets: [
          "Child sexual abuse material (CSAM) of any kind",
          "Exploitation, trafficking, or coercion of minors",
          "Grooming or solicitation of minors",
          "Inappropriate or sexualized communication involving minors",
          "Any attempt to share, request, distribute, or promote such content",
          "Impersonating a minor or using a minor's identity to bypass verification",
        ],
      },
      {
        heading: "Consequences of violation:",
        bullets: [
          "Immediate account suspension or permanent ban",
          "Removal of all associated content",
          "Mandatory reporting to relevant law enforcement authorities",
          "Full cooperation with legal investigations",
        ],
      },
    ],
  },
  {
    id: "face-verification-safety",
    icon: "🪪",
    title: "Face Verification & Child Protection",
    badge: "New",
    items: [
      {
        label: "Purpose",
        text: "Face verification is a core safety measure used to confirm that all users are adults before accessing social features of the platform.",
      },
      {
        label: "Detection During Verification",
        text: "Our verification system is designed to flag accounts where the submitted face appears to belong to a minor. Such accounts are suspended automatically and reviewed by our Trust & Safety team.",
      },
      {
        label: "Fraudulent Submissions",
        text: "Submitting any image other than your own face — including images of minors, other adults, cartoons, AI-generated faces, or manipulated photos — is a serious violation of this Policy and our Content Policy, and will result in permanent account termination.",
      },
      {
        label: "Data Privacy",
        text: "Face verification data is processed solely for age and identity confirmation. It is not used for marketing, profiling, or shared with third parties outside of legally mandated circumstances.",
      },
    ],
  },
  {
    id: "syncmaps-child-safety",
    icon: "🗺️",
    title: "SyncMaps & Location Safety",
    badge: "New",
    items: [
      {
        label: "Adults Only",
        text: "SyncMaps and all location-sharing features are exclusively available to verified adult users. Any account that has not completed face verification will not have access to these features.",
      },
      {
        label: "Prohibited Use",
        text: "SyncMaps must not be used to locate, track, follow, or approach any individual — particularly minors — without explicit consent. Such behaviour constitutes a serious safety violation.",
      },
      {
        label: "Immediate Action",
        text: "Reports of location-based harassment or any use of SyncMaps in a manner that endangers a minor will result in immediate suspension and referral to law enforcement.",
      },
    ],
  },
  {
    id: "reporting-moderation",
    icon: "🛡️",
    title: "Reporting & Moderation",
    items: [
      {
        label: null,
        text: "We provide in-app tools for users to report inappropriate content or behaviour, block other users, and flag safety concerns at any time.",
      },
      {
        label: null,
        text: "Our Trust & Safety team reviews all child safety reports as the highest priority and takes immediate action — including content removal, account suspension, or permanent bans.",
      },
      {
        label: null,
        text: "Reporters remain anonymous. We do not disclose the identity of users who flag safety concerns.",
      },
    ],
  },
  {
    id: "cooperation",
    icon: "⚖️",
    title: "Cooperation With Authorities",
    items: [
      {
        label: null,
        text: "SyncTrip complies with all applicable child protection and safety laws across jurisdictions.",
      },
      {
        label: null,
        text: "We cooperate fully and without delay with law enforcement agencies, government authorities, and child protection organizations in cases involving child safety risks or illegal activity.",
      },
      {
        label: null,
        text: "Where legally required, we proactively report detected CSAM or related violations to the National Center for Missing & Exploited Children (NCMEC) and equivalent bodies.",
      },
    ],
  },
  {
    id: "contact",
    icon: "📩",
    title: "Contact for Safety Concerns",
    items: [
      {
        label: null,
        text: "If you have any concerns related to child safety on SyncTrip, please contact us immediately. All reports are treated as a top priority.",
      },
      {
        label: "Email",
        text: "synctripofficial@gmail.com",
        isEmail: true,
      },
      {
        label: null,
        text: "We review every safety report and take all necessary steps to protect the platform and its users.",
      },
    ],
  },
];

export default function ChildSafetyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #fff1f2 0%, #f8fafc 50%, #f0f9ff 100%)",
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
              background: "#be123c",
              color: "#fff",
              fontSize: "12px",
              fontFamily: "Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "6px 14px",
              borderRadius: "999px",
              marginBottom: "20px",
            }}
          >
            <span>🛡️</span>
            <span>Child Safety Policy</span>
          </div>

          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "clamp(26px, 5vw, 40px)",
              fontWeight: 700,
              color: "#0c1a3a",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Child Safety & Protection Policy
          </h1>

          <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#64748b", fontFamily: "Arial, sans-serif" }}>
            Effective Date: February 14, 2026 &nbsp;·&nbsp; Last Updated: 2026
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
            SyncTrip is committed to maintaining a safe and respectful environment for all users.
            We strictly prohibit any form of child sexual abuse or exploitation (CSAE) on our platform
            and enforce an <strong>18+ verified adults only</strong> policy across all features.
          </p>

          {/* Update Banner */}
          <div
            style={{
              marginTop: "20px",
              padding: "14px 18px",
              background: "linear-gradient(90deg, #fff1f2, #fff8f8)",
              border: "1px solid #fca5a5",
              borderLeft: "4px solid #be123c",
              borderRadius: "8px",
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>🔔</span>
            <div>
              <strong style={{ fontSize: "13px", color: "#9f1239", display: "block", marginBottom: "4px" }}>
                POLICY UPDATE NOTICE
              </strong>
              <span style={{ fontSize: "13px", color: "#881337", lineHeight: 1.5 }}>
                This version includes critical updates: the <strong>minimum age has been raised to 18+</strong>,
                and new sections on <strong>Face Verification</strong> and <strong>SyncMaps Safety</strong> have been added.
                Please review all highlighted sections carefully.
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
                      ? "#fecaca"
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
                        ? "linear-gradient(90deg, #fff1f2, #ffffff)"
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
                      background: section.badge === "New" ? "#dcfce7" : "#fee2e2",
                      color: section.badge === "New" ? "#166534" : "#be123c",
                      border: `1px solid ${section.badge === "New" ? "#86efac" : "#fca5a5"}`,
                    }}
                  >
                    {section.badge}
                  </span>
                )}
              </div>

              {/* Section Body */}
              <div style={{ padding: "16px 24px 20px" }}>
                {/* Main items */}
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
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
                        {item.isEmail ? (
                          <a
                            href={`mailto:${item.text}`}
                            style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}
                          >
                            {item.text}
                          </a>
                        ) : (
                          item.text
                        )}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Subsections (bullet groups) */}
                {section.subsections?.map((sub: Subsection, sidx: number) => (
                  <div
                    key={sidx}
                    style={{
                      marginTop: "16px",
                      padding: "14px 16px",
                      background: sidx === 0 ? "#fff7ed" : "#fff1f2",
                      border: `1px solid ${sidx === 0 ? "#fed7aa" : "#fecaca"}`,
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 10px 0",
                        fontSize: "13px",
                        fontWeight: 700,
                        color: sidx === 0 ? "#c2410c" : "#be123c",
                        fontFamily: "Arial, sans-serif",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {sub.heading}
                    </p>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                      }}
                    >
                      {sub.bullets.map((bullet: string, bidx: number) => (
                        <li
                          key={bidx}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "10px",
                            fontFamily: "Arial, sans-serif",
                          }}
                        >
                          <span
                            style={{
                              flexShrink: 0,
                              fontSize: "14px",
                              marginTop: "1px",
                              color: sidx === 0 ? "#ea580c" : "#e11d48",
                            }}
                          >
                            {sidx === 0 ? "•" : "›"}
                          </span>
                          <span style={{ fontSize: "14px", color: "#374151", lineHeight: 1.65 }}>
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
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
                Safe, verified travel coordination — adults only.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "13px" }}>
                Safety concerns?{" "}
                <a href="mailto:synctripofficial@gmail.com" style={{ color: "#93c5fd" }}>
                  synctripofficial@gmail.com
                </a>
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
            To report a child safety concern, use the in-app{" "}
            <strong style={{ color: "#cbd5e1" }}>Report</strong> button or email us directly.
            All child safety reports are reviewed immediately as our highest priority.
          </div>
        </footer>
      </div>
    </main>
  );
}