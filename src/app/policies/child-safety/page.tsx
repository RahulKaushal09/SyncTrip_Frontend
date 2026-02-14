// app/child-safety/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncTrip Child Safety & Protection Policy",
  description:
    "SyncTrip is committed to maintaining a safe environment and strictly prohibits any form of child sexual abuse or exploitation (CSAE) on the platform.",
};

export default function ChildSafetyPage() {
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
            Child Safety & Protection Policy
          </h1>

          <p
            style={{
              margin: "8px 0 0 0",
              fontSize: "14px",
              color: "#475569",
              lineHeight: 1.6,
            }}
          >
            Effective Date: February 14, 2026
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
            {`Child Safety & Protection Policy

SyncTrip is committed to maintaining a safe and respectful environment for all users and strictly prohibits any form of child sexual abuse or exploitation (CSAE) on our platform.

1. Age Requirement

SyncTrip is intended only for users aged 16 and above.
We do not knowingly allow minors below the permitted age to create accounts or use the platform.

If we become aware that a user under the permitted age has created an account, we will take immediate steps to remove the account and associated data.

2. Zero Tolerance Policy

SyncTrip maintains a strict zero-tolerance policy toward any activity involving the exploitation of minors.

This includes but is not limited to:

• Child sexual abuse material (CSAM)  
• Exploitation or trafficking of minors  
• Grooming or solicitation of minors  
• Inappropriate or sexualized communication involving minors  
• Any attempt to share, request, or promote such content  

Any violation will result in:

• Immediate account suspension or permanent ban  
• Removal of content  
• Reporting to relevant law enforcement authorities  
• Cooperation with legal investigations  

3. Reporting & Moderation

We provide tools within the app for users to:

• Report inappropriate content or behaviour  
• Block other users  
• Flag safety concerns  

Our moderation team reviews reports promptly and takes appropriate action, including removing content, suspending accounts, or banning users who violate our policies.

4. Cooperation With Authorities

SyncTrip complies with applicable child protection and safety laws.
We cooperate fully with law enforcement agencies and government authorities in cases involving child safety risks or illegal activity.

5. Contact for Safety Concerns

If you have concerns related to child safety, please contact us immediately:

Email: synctripofficial@gmail.com

We review all reports as a priority and take appropriate action to ensure platform safety.

SyncTrip is dedicated to providing a safe and respectful travel community for all users.`}
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
          For any safety concerns, contact us at{" "}
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
