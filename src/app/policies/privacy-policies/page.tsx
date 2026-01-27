
// app/privacy-policy/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Privacy Policy",
  description:
    "Read the privacy policy for SyncTrip, explaining how we collect, use, share, and protect user information in compliance with applicable laws in India.",
};

export default function PrivacyPolicyPage() {
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
            SyncTrip Privacy Policy
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
            {`SyncTrip Privacy Policy
Effective Date: January 22, 2026
SyncTrip respects your privacy. This Privacy Policy explains how we collect, use, share, and protect your personal information in compliance with applicable laws, including India's Digital Personal Data Protection Act, 2023 (DPDP Act) and Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
By using the Platform, you consent to the practices described here.
1. Information We Collect
a. Information You Provide:

Account details: Name, email, phone number, profile photo, gender, age (for verification), travel preferences.
Trip details: Destinations, dates, budget, interests, itineraries.
Communications: Chat messages, shared plans.

b. Automatically Collected:

Usage data: Device info, IP address, browser type, pages viewed, search history.
Location data: Approximate location (if enabled) for matching relevance.
Analytics: Interaction logs via tools like Google Analytics.

c. From Third Parties:

Verification data from login providers (e.g., Google).

We do not collect sensitive personal data (e.g., health, financial details) unless voluntarily shared in itineraries.
2. How We Use Your Information

To provide core services: Matching, chat, itinerary collaboration.
To improve the Platform: Analytics, feature development.
To communicate: Notifications, updates, support.
For safety: Detect fraud, enforce policies.
For marketing: Optional promotional emails (opt-out available).

3. How We Share Your Information

With Matched Users: Trip details, profile info, and messages visible only to matched connections.
Service Providers: Hosting (e.g., AWS), analytics, payment processors (if introduced).
Legal Requirements: When required by law, court order, or to protect rights/safety.
Business Transfers: In case of merger/acquisition.

We do not sell your personal data.
4. Data Retention
We retain data as long as your account is active or needed for legal/compliance purposes. Deleted accounts have data anonymized or removed within 30 days (except backups/legal holds).
5. Your Rights and Choices
Under applicable laws (including DPDP Act):

Access, correct, or delete your data.
Withdraw consent (may limit functionality).
Opt-out of marketing.
Data portability.
File complaints with the Data Protection Board of India.

Contact synctripofficial@gmail.com to exercise rights. We respond within 30 days.
6. Security
We use industry-standard measures (encryption, access controls) but no system is fully secure. You are responsible for device security.
7. International Data Transfers
Data may be processed outside India with appropriate safeguards (e.g., standard contractual clauses).
8. Children's Privacy
SyncTrip is not for users under 18. We do not knowingly collect data from minors.
9. Updates
We may update this Policy. Material changes will be notified via email or in-app.
Contact: synctripofficial@gmail.com or the Grievance Officer details (to be appointed as per IT Rules).`}
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
          If you have any questions, contact us at{" "}
          <a
            href="mailto:synctripofficial@gmail.com"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            synctripofficial@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
