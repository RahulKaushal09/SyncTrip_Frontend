// app/community-guidelines/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Community Guidelines",
  description:
    "Read SyncTrip Community Guidelines to understand allowed and prohibited content, safety rules, and enforcement policies for a respectful travel coordination platform.",
};

export default function CommunityGuidelinesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: "16px",
          padding: "28px 22px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "18px" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            SyncTrip Community Guidelines (Content Policies)
          </h1>

          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            Effective Date: January 22, 2026
          </p>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "18px",
            borderRadius: "12px",
            background: "#f1f5f9",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily:
                "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
              fontSize: "15px",
              lineHeight: "1.8",
              margin: 0,
              color: "#0f172a",
            }}
          >
            {`SyncTrip Community Guidelines (Content Policies)
Effective Date: January 22, 2026
These Guidelines outline expected behavior to keep SyncTrip safe, respectful, and focused on travel coordination.
Core Principles

Travel-Focused: Use SyncTrip only for planning and coordinating trips. No dating, romantic solicitation, or non-travel connections.
Respect: Treat others with kindness and inclusivity.
Safety First: Prioritize real-world safety in all interactions.

Allowed Content

Genuine trip plans, itineraries, destination discussions.
Positive collaboration and travel tips.

Prohibited Content and Behavior

Harassment, hate speech, discrimination (based on gender, religion, caste, etc.).
Explicit, sexual, or romantic content.
Threats, violence, or illegal activities promotion.
Scams, spam, or financial solicitation.
False information that could endanger others.
Unauthorized commercial promotion.

Safety-Specific Rules

Do not pressure others for private meetings.
Report users who make you uncomfortable.
We encourage public meetups only after trust is established.

Enforcement

Reports are reviewed promptly.
Violations may lead to warnings, content removal, restrictions, or permanent bans.
Severe cases (e.g., threats) reported to law enforcement.

Help keep SyncTrip safe—report violations in-app.`}
          </pre>
        </div>

        {/* Footer */}
        <p
          style={{
            marginTop: "18px",
            fontSize: "13px",
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          Help keep SyncTrip safe — report violations in-app.
        </p>
      </div>
    </main>
  );
}
