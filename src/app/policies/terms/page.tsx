// app/terms/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Terms of Use",
  description:
    "Read the terms of use for SyncTrip, a social travel coordination platform connecting travelers for collaborative itinerary planning and group travel.",
};

export default function TermsPage() {
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
            SyncTrip Terms of Use
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
            {`SyncTrip Terms of Use
Effective Date: January 22, 2026
Welcome to SyncTrip (the "Platform"), operated by SyncTrip Technologies Private Limited (or the relevant entity operating in India) ("we," "us," "our," or "SyncTrip"). SyncTrip is a social travel coordination platform that connects travelers planning trips to the same destinations in India (and potentially internationally) to enable collaborative itinerary planning, shared experiences, and group travel coordination. SyncTrip is not a dating service, matchmaking for romantic purposes, or a booking platform. It is strictly for facilitating travel companionship and logistical collaboration among users heading to similar locations.
By accessing, registering, or using the Platform (including the website at synctrip.in, mobile apps, or any related services), you agree to be bound by these Terms of Use ("Terms"). If you do not agree, do not use the Platform.
1. Eligibility

You must be at least 18 years old to use SyncTrip.
You represent that you have the legal capacity to enter into these Terms.
You must provide accurate, complete, and current information during registration and maintain it updated.

2. Account Registration and Security

Registration requires a valid email, phone number, or third-party login (e.g., Google).
You are solely responsible for all activity on your account and for keeping your password secure.
Notify us immediately of any unauthorized use.
We reserve the right to suspend or terminate accounts for violations of these Terms, suspicious activity, or at our discretion.

3. Platform Purpose and Features

Users create "Trip Profiles" with details such as destination, dates, budget, interests, and preferences.
The Platform matches users based on overlapping trip details (not personal profiles for romantic purposes).
Matches enable chat, collaborative itinerary creation, and sharing of travel plans.
SyncTrip does not book flights, hotels, transportation, or activities. Any arrangements made off-platform are solely between users.
We may display curated destination information, hotels, or points of interest for convenience, but we do not guarantee accuracy or availability.

4. User Responsibilities and Safety
You are solely responsible for your interactions with other users. SyncTrip facilitates connections but does not screen users beyond basic verification (e.g., email/phone).
Important Safety Guidelines (Strongly Recommended):

Always meet matched travelers in public places first.
Do not meet in private locations (e.g., hotels, homes) unless you have built substantial trust through ongoing communication and feel completely safe.
Share your travel plans with friends or family outside the Platform.
Verify information shared by others independently.
Use caution when sharing personal details, locations, or financial information.
Report any concerning behavior immediately via the in-app reporting tools.

SyncTrip is not liable for any outcomes from user interactions, including but not limited to personal safety, disputes, financial loss, or travel disruptions.
5. Prohibited Conduct
You agree not to:

Use the Platform for dating, romantic matchmaking, or any non-travel-related purposes.
Harass, threaten, abuse, defame, or discriminate against others.
Post false, misleading, or fraudulent trip information.
Solicit money, engage in scams, or promote illegal activities.
Impersonate others or create fake accounts.
Spam, send unsolicited messages, or violate privacy.
Upload harmful code, viruses, or interfere with the Platform's functionality.
Attempt to access others' accounts or data without permission.

Violations may result in immediate account termination and reporting to authorities if illegal.
6. User Content

You retain ownership of content you post (trip details, itineraries, messages, photos).
You grant SyncTrip a worldwide, non-exclusive, royalty-free license to use, display, modify, and distribute your content for operating and promoting the Platform.
You are responsible for your content and warrant it does not infringe third-party rights.
We may remove content that violates these Terms.

7. Intellectual Property

SyncTrip owns all Platform content, features, and branding (excluding user content).
You may not copy, modify, or create derivative works without permission.

8. Disclaimers

The Platform is provided "as is" without warranties of any kind.
We do not guarantee matches, travel outcomes, user reliability, or uninterrupted service.
Third-party links or information are not endorsed by us.

9. Limitation of Liability
To the fullest extent permitted by law:

SyncTrip is not liable for indirect, incidental, or consequential damages.
Our total liability is limited to the amount you paid us (if any) in the past 12 months.
We are not responsible for user conduct, travel risks, or third-party services.

10. Termination

You may delete your account at any time.
We may terminate or suspend access immediately for violations or at our discretion.
Surviving provisions (e.g., disclaimers, liability) remain in effect post-termination.

11. Governing Law and Dispute Resolution

These Terms are governed by the laws of India.
Disputes shall be resolved exclusively in the courts of Chandigarh, India.
For consumer disputes, you may approach relevant forums under Indian law.

12. Changes to Terms
We may update these Terms. Continued use after changes constitutes acceptance. Significant changes will be notified via email or in-app.
Contact us at synctripofficial@gamil.com for questions.`}
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
            href="mailto:synctripofficial@gamil.com"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            synctripofficial@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}



