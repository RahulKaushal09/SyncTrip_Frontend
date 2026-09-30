// app/policies/refund-cancellation/page.tsx
//
// Refund & Cancellation Policy. Every rule here mirrors what the backend
// actually does (config/clubRefundPolicy.js, UserCancellationService,
// ClubCancellationService, ClubBookingService) - change them together.

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | SyncTrip",
  description:
    "How refunds and cancellations work on SyncTrip: club event tickets (full and partial cancellations, organiser refund policies, event cancellations), SyncTrip Plus subscriptions and wallet credit.",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  alternates: { canonical: "https://synctrip.in/policies/refund-cancellation" },
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
    title: "At a glance",
    items: [
      {
        term: "Club event tickets",
        detail:
          "Each event has a refund policy set by the club that organises it. You see it on the event page and at checkout before you pay, and the policy you bought under is the one that applies to you - even if the club changes it later.",
      },
      {
        term: "You cancel",
        detail:
          "You can cancel all or some of your seats until the event starts (and before you check in). You get back the refund percentage your policy gives for how early you cancel. The booking fee is not refunded, and 3% of the amount you paid online is kept to cover payment gateway charges.",
      },
      {
        term: "The club cancels",
        detail:
          "You get back everything you paid - including the booking fee, with no deduction - automatically.",
      },
      {
        term: "Where the money goes",
        detail:
          "Back to the UPI / card you paid with (5-7 working days) and to your SyncTrip wallet for any part you paid with wallet credit (instant).",
      },
      {
        term: "SyncTrip Plus",
        detail:
          "Cancel any time before your next billing date and you keep Plus until the end of the paid period. Charges are otherwise non-refundable except in the cases listed in Section 9.",
      },
    ],
  },
  {
    number: "2",
    title: "The refund policy you book under",
    intro:
      "Clubs sell tickets on SyncTrip and choose how refunds work for their events. SyncTrip applies that policy automatically and consistently.",
    items: [
      {
        term: "Set by the organiser",
        detail:
          "A club either offers no refunds, or refunds by time: for example, 100% if you cancel 7 or more days before the start and 50% if you cancel 2 or more days before. After the last window, no refund is due. A later window never refunds more than an earlier one.",
      },
      {
        term: "Shown before you pay",
        detail:
          "The policy is shown on the event page and at checkout. By completing payment you accept the policy shown at that moment.",
      },
      {
        term: "Locked at purchase",
        detail:
          "The policy is saved with your booking. If the club edits its policy afterwards, the change applies only to people who book after the edit - never to you.",
      },
      {
        term: "Added seats",
        detail:
          "If you add more seats to a ticket later, that purchase is covered by the policy shown when you added them. A ticket can therefore hold purchases under different policies; each is refunded under its own.",
      },
    ],
  },
  {
    number: "3",
    title: "Cancelling your ticket",
    highlight: true,
    badge: "EVENT TICKETS",
    intro:
      "Open the event in the SyncTrip app and tap Cancel booking. Before you confirm, you see the exact refund you will receive and how it was worked out - the same calculation that runs when you confirm.",
    items: [
      {
        term: "When you can cancel",
        detail:
          "Any time before the event starts, as long as you have not checked in and no seat purchase is still being processed. You can cancel even when no refund is due - it frees your seats for someone else. Your seats go back on sale immediately and you leave the event chat.",
      },
      {
        term: "What is refundable",
        detail:
          "The amount you paid for the tickets themselves - by UPI / card and from your wallet. The booking fee is not refundable when you cancel. A SyncTrip Plus member discount is not refunded (you are refunded what you actually paid).",
      },
      {
        term: "Refund percentage",
        detail:
          "Taken from your refund policy, based on how long before the event's start time you cancel.",
      },
      {
        term: "Payment gateway charges",
        detail:
          "Our payment gateway keeps its fee when a payment is refunded, so 3% of the amount you paid online (UPI / card) is deducted from the online part of your refund. Nothing is deducted from the part you paid with wallet credit.",
      },
      {
        term: "Where it goes",
        detail:
          "The refund is split in the same proportion you paid: the wallet share goes back to your SyncTrip wallet, the rest to the UPI / card you paid with. Wallet credit is never converted to cash.",
      },
      {
        term: "Small amounts",
        detail:
          "An online refund below ₹1 after deductions cannot be processed by the payment gateway and is not issued.",
      },
      {
        term: "Multiple purchases",
        detail:
          "If your ticket includes added seats, each purchase is refunded under its own policy and its own payment, and the amounts are added together.",
      },
    ],
    content:
      "Worked example: you paid ₹530 for 2 seats - ₹480 by UPI and ₹50 from your wallet, including a ₹30 booking fee. You cancel 3 days before the event and your policy gives 50%.\n\n• Ticket amount: ₹530 − ₹30 booking fee = ₹500\n• 50% of ₹500 = ₹250\n• Split as you paid: ₹24 to your wallet, ₹226 to UPI\n• Gateway charges: 3% of the ₹480 paid by UPI = ₹14, taken from the UPI part\n• You receive ₹212 to UPI + ₹24 to your wallet = ₹236",
  },
  {
    number: "4",
    title: "Cancelling some of your seats",
    intro:
      "Booked for a group and someone dropped out? You can cancel only some seats and keep the rest.",
    items: [
      {
        term: "How",
        detail:
          "In the cancel screen, choose how many seats to cancel. The refund updates as you change the number.",
      },
      {
        term: "Which seats are cancelled",
        detail:
          "The seats that give you the highest refund go first. A seat's value is what you paid for it (its price tier, such as Early bird or Regular) multiplied by the refund percentage that applies to it. This works the same whether prices went up or down over time, and cancelling one seat at a time adds up to the same total as cancelling them all at once.",
      },
      {
        term: "Your ticket stays valid",
        detail:
          "The remaining seats stay on the same booking and the same QR code - it simply admits fewer people.",
      },
      {
        term: "Same rules",
        detail:
          "Refund percentage, the 3% gateway deduction on the online part and the wallet split work exactly as in Section 3. The booking fee stays with the purchase and is not refunded.",
      },
    ],
  },
  {
    number: "5",
    title: "If the club cancels the event",
    items: [
      {
        term: "Full refund",
        detail:
          "Everyone with a paid ticket gets back everything they paid - ticket price and booking fee - with no gateway deduction, whatever the event's refund policy says.",
      },
      {
        term: "Automatic",
        detail:
          "Refunds start as soon as the event is cancelled. You are told by notification and in the event chat, together with the reason the club gave.",
      },
      {
        term: "Where it goes",
        detail:
          "UPI / card payments go back to the source; wallet credit goes back to your wallet.",
      },
    ],
  },
  {
    number: "6",
    title: "Payments that do not complete",
    items: [
      {
        term: "Checkout closed or failed",
        detail:
          "If you close the payment screen or the payment fails, you are not charged and the seats held for you are released straight away.",
      },
      {
        term: "Money debited, no ticket",
        detail:
          "If your bank shows a debit but the booking did not confirm (for example, the app closed mid-payment), we check the payment with the gateway: it either confirms your ticket or, if it cannot be fulfilled, is refunded in full automatically.",
      },
      {
        term: "Seats that could not be added",
        detail:
          "If you pay for extra seats on a ticket that was cancelled in the meantime, that payment is refunded in full automatically.",
      },
      {
        term: "Duplicate charges",
        detail:
          "Charged twice for the same purchase? Write to us with both payment IDs and the duplicate is refunded in full.",
      },
    ],
  },
  {
    number: "7",
    title: "Free events and seats given by the organiser",
    items: [
      {
        term: "Free RSVPs",
        detail:
          "You can cancel a free RSVP at any time before the event. There is nothing to refund.",
      },
      {
        term: "Seats added by the organiser",
        detail:
          "Some seats are added directly by the club - a complimentary seat, or one you paid for in person (cash or UPI at the venue). SyncTrip did not collect any money for these, so no refund is issued by SyncTrip. For money paid to the club directly, please contact the club.",
      },
    ],
  },
  {
    number: "8",
    title: "Refund timelines and tracking",
    items: [
      {
        term: "UPI / card",
        detail:
          "Usually 5-7 working days to appear in your bank after the refund is issued. The exact time depends on your bank.",
      },
      {
        term: "Wallet credit",
        detail: "Instant.",
      },
      {
        term: "Track it",
        detail:
          "In the app, open Settings → Payments & refunds. Every payment and refund is listed there with its breakdown, status and payment / refund ID.",
      },
      {
        term: "Delays",
        detail:
          "If part of a refund does not go through first time, it is retried automatically and our team is alerted - you do not need to do anything. If a UPI / card refund has not reached you 7 working days after it shows as refunded, write to us with the refund ID.",
      },
    ],
  },
  {
    number: "9",
    title: "SyncTrip Plus subscriptions",
    highlight: true,
    badge: "BILLING",
    intro:
      "Full subscription terms are in Section 12 of our Terms of Use. In short:",
    items: [
      {
        term: "Cancel any time",
        detail:
          "Cancel before your next billing date to stop the next renewal. You keep Plus until the end of the period you have paid for. There is no cancellation fee. Razorpay (Android / web): Settings → Subscription → Cancel, or email us from your registered address. Apple: Apple ID settings → Subscriptions. Google Play: Play Store → Subscriptions.",
      },
      {
        term: "Refunds",
        detail:
          "Subscription charges are non-refundable except for: (a) duplicate charges or technical billing errors - full refund within 7 working days of your report; (b) more than 48 continuous hours without access to Plus because of a confirmed SyncTrip-side outage - pro-rated credit; (c) a charge taken after you had successfully cancelled - full refund.",
      },
      {
        term: "App Store and Google Play",
        detail:
          "Purchases made through Apple or Google are refunded only by them, under their policies (for Apple: reportaproblem.apple.com). SyncTrip cannot refund those transactions directly.",
      },
      {
        term: "Account action",
        detail:
          "A subscription ended because of a serious breach of our Terms or Community Guidelines is not refunded.",
      },
    ],
  },
  {
    number: "10",
    title: "SyncTrip wallet credit",
    items: [
      {
        term: "What it is",
        detail:
          "Credit earned through referrals, promotions or refunds of wallet-paid amounts. It can be used towards eligible purchases on SyncTrip, up to the limits shown at checkout.",
      },
      {
        term: "Not cash",
        detail:
          "Wallet credit cannot be refunded to a bank account or card. When a purchase paid partly with wallet credit is refunded, that part always goes back to your wallet.",
      },
    ],
  },
  {
    number: "11",
    title: "Disputes and chargebacks",
    content:
      "If something looks wrong, please contact us before raising a dispute with your bank - most issues are resolved within a few days, and a chargeback raised while a refund is already on its way can delay it. If a chargeback is raised, we share the booking and refund records with the payment gateway and your bank to resolve it.",
  },
  {
    number: "12",
    title: "Contact",
    content:
      "Email synctripofficial@gmail.com from your registered email or phone, with your booking code or the payment / refund ID (all shown in Settings → Payments & refunds). We aim to reply within 3 working days.",
  },
  {
    number: "13",
    title: "Changes to this policy",
    content:
      "We may update this policy as our services change. Changes never affect a ticket's refund policy after you have bought it. Significant changes are announced by email or in-app notification at least 7 days before they take effect.",
  },
];

export default function RefundCancellationPage() {
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
            Refund &amp; Cancellation Policy
          </h1>
          <p
            style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: 1.6 }}
          >
            Effective Date: September 30, 2026 &nbsp;·&nbsp; Club event tickets, SyncTrip Plus and wallet credit
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
            This policy explains when and how{" "}
            <strong style={{ color: "#e2e8f0" }}>SyncTrip Digital Private Limited</strong>{" "}
            (&quot;SyncTrip&quot;) refunds money: tickets for club events booked in the
            app or on synctrip.in, SyncTrip Plus subscriptions, and SyncTrip wallet
            credit. Wherever a refund is due under this policy it is issued
            automatically - you never have to ask for money the rules already owe you.
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
              Questions about a refund?
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              Include your booking code or payment / refund ID.
              <br />
              We reply within 3 working days.
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