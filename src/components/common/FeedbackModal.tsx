// components/FeedbackModal.tsx
"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ApiService } from "@/utils/api.utils"; // adjust path
import "../../../styles/Common/feedbackModal.css";
import { User } from "@/types";

type Props = {
  feedBackFormOpen: boolean;
  setFeedbackFormOpen: (v: boolean) => void;
  isLoggedIn: boolean;
  user?: User | null;
};

const SMILEY_LABELS = [
  "Very poor",
  "Poor",
  "Okay",
  "Good",
  "Excellent"
];

export default function FeedbackModal({ feedBackFormOpen, setFeedbackFormOpen, isLoggedIn, user }: Props) {
  const [message, setMessage] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [rating, setRating] = useState<number | null>(null); // 1..5
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState("");
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});

  // prepare portal container
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPageUrl(window.location.href);
      setMetadata({
        ua: navigator.userAgent || "",
        locale: navigator.language || "",
        screen: {
          w: window.screen?.width || null,
          h: window.screen?.height || null,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (feedBackFormOpen && user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
    if (!feedBackFormOpen) {
      setMessage("");
      setRating(null);
      setError(null);
      setHoverRating(null);
    }
  }, [feedBackFormOpen, user]);

  // close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFeedbackFormOpen(false);
    };
    if (feedBackFormOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [feedBackFormOpen, setFeedbackFormOpen]);

  if (!mounted) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    // close only when clicking overlay, not content
    if ((e.target as HTMLElement).classList.contains("feedback-form-modal")) {
      setFeedbackFormOpen(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!message || message.trim().length === 0) {
      setError("Please enter your feedback.");
      return;
    }

    const isAnon = !isLoggedIn && !(name || email);

    const payload = {
      feedbackText: message.trim(),
      rating: rating ?? undefined,
      pageUrl: pageUrl || undefined,
      metadata: {
        ...metadata,
        providedName: !isLoggedIn ? name || undefined : undefined,
        providedEmail: !isLoggedIn ? email || undefined : undefined,
        authUser: isLoggedIn ? { id: user?.id, email: user?.email, name: user?.name } : undefined,
      },
      isAnonymous: !!isAnon,
    };

    setLoading(true);
    try {
      const res = await ApiService.sendUserFeedback(payload, !!isLoggedIn);
      if (res && res.success) {
        setSubmitted(true);
      } else {
        setError((res && res.message) || "Unable to submit feedback.");
      }
    } catch (err) {
      console.error("Error submitting feedback:", err);
      setError((err as Error).message || "Something went wrong while sending feedback.");
    } finally {
      setLoading(false);
    }
  };

  const Smiley = ({ idx }: { idx: number }) => {
    // idx: 1..5
    const isActive = (hoverRating ?? rating) === idx;
    return (
      <button
        type="button"
        className={`smiley ${isActive ? "active" : ""}`}
        aria-label={`${SMILEY_LABELS[idx - 1]} (${idx})`}
        onMouseEnter={() => setHoverRating(idx)}
        onMouseLeave={() => setHoverRating(null)}
        onFocus={() => setHoverRating(idx)}
        onBlur={() => setHoverRating(null)}
        onClick={() => setRating(idx)}
      >
        {/* simple emojis - replace with icons if you have a brand icon set */}
        {idx === 1 && "😠"}
        {idx === 2 && "😕"}
        {idx === 3 && "😐"}
        {idx === 4 && "🙂"}
        {idx === 5 && "🤩"}
      </button>
    );
  };

  const modalContent = (
    <div className="feedback-form-modal" onMouseDown={handleOverlayClick}>
      <div className="feedback-form-content" role="dialog" aria-modal="true" aria-labelledby="feedback-heading">
        <button className="close-button" aria-label="Close feedback" onClick={() => setFeedbackFormOpen(false)}>&times;</button>

        {submitted ? (
          <div className="feedback-submitted">
            <h2 id="feedback-heading">Thanks - feedback received</h2>
            <p className="muted">✅ We appreciate you helping make SyncTrip better.</p>
            <div className="actions">
              <button className="btn primary" onClick={() => { setSubmitted(false); setFeedbackFormOpen(false); }}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 id="feedback-heading">SyncTrip Feedback</h2>
            <p className="muted">{isLoggedIn ? "Tell us what features you'd like or any issues you faced." : "Share your suggestion or problem. You can submit anonymously or provide contact for follow up."}</p>

            <form onSubmit={handleFeedbackSubmit} className="feedback-form">
              <div className="rating-row">
                <div className="rating-label">How was your experience?</div>
                <div className="rating-smileys" role="radiogroup" aria-label="Rate your experience">
                  {[1, 2, 3, 4, 5].map((n) => <Smiley key={n} idx={n} />)}
                </div>
                {/* <div className="rating-caption">{ (hoverRating ?? rating) ? SMILEY_LABELS[(hoverRating ?? rating)! - 1] : "Select" }</div> */}
              </div>

              {!isLoggedIn && (
                <div className="row-inline">
                  <div className="field">
                    <label htmlFor="name">Name (optional)</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" />
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email (optional)</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email (optional)" />
                  </div>
                </div>
              )}

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe the issue or share suggestion..." />
              </div>

              {/* <div className="meta-row">
                <small className="muted">Page: <span className="page-url">{pageUrl}</span></small>
              </div> */}

              {error && <div className="error">{error}</div>}

              <div className="actions">
                <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? "Sending..." : "Send Feedback"}</button>
                <button className="btn ghost" type="button" onClick={() => setFeedbackFormOpen(false)} disabled={loading}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
