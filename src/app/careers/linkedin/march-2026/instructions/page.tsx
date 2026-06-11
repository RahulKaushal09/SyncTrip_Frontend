"use client";

import GumletImage from "@/components/common/GumletImage";
import { useLogin } from "@/components/providers/LoginProvider";
import { triggerLogin } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Clock,
  User,
  AlertCircle,
  CheckCircle2,
  Mail,
  Phone,
  Lock
} from "lucide-react";
import { END_TIME, START_TIME } from "@/app/careers/linkedin/march-2026/data";

const InstructionsPage: React.FC = () => {
  const { user, isLoggedIn } = useLogin();
  const router = useRouter();

  // NEW: State for the confirmation input
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    document.title = "SyncTrip Behavioral Evaluation - March 2026";
  }, []);

  const handleVerifyIdentity = () => {
    triggerLogin(() => {
      toast.success("Identity verified successfully!");
    });
  };

  const handleBeginAssessment = () => {
    const now = new Date();

    if (!user?.profileCompleted) {
      triggerLogin();
      toast.error("Please complete your profile before starting the assessment.");
      return;
    }

    if (now < START_TIME) {
      toast.error(
        `Assessment will start on ${START_TIME.toLocaleString()}.`
      );
      return;
    }

    if (now > END_TIME) {
      toast.error(
        `The assessment window has closed.`
      );
      return;
    }

    if (isLoggedIn) {
      router.push("/careers/linkedin/march-2026/assessment");
    }
  };

  // NEW: Compute whether the button should be enabled
  const isReadyToStart = isLoggedIn && confirmationText.trim().toLowerCase() === "start";

  const now = new Date();

  if (now > END_TIME) {
    return (
      <div className="min-h-screen flex items-center flex-col justify-center w-full text-center">
        <h2 className="text-3xl font-bold text-secondary-1 mb-3">
          Assessment Closed
        </h2>
        <p className="text-neutral-1 border rounded-lg p-3 max-w-xl text-justify">
          The assessment window has ended. Thank you for your interest in SyncTrip. Please contact us at synctripofficial@gmail.com for any questions or future opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="container-custom marginSectionLeftRight animate-fade-up pt-[70px] pb-[100px]">
      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-secondary-1 mb-4 flex items-center gap-3">
          SyncTrip Candidate Assessment Portal
        </h1>
        <p className="text-lg text-neutral-1 leading-relaxed">
          Welcome to the SyncTrip evaluation platform. This assessment is a critical step in our
          recruitment process and helps us understand your decision-making, collaboration style,
          and problem-solving approach in real-world scenarios.
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* LEFT PANEL - PROFILE */}
        <div className="w-full lg:w-[360px] shrink-0 bg-secondary-5 border border-secondary-3 rounded-2xl p-8 shadow-sm relative overflow-hidden">
          {/* Decorative background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-3 opacity-20 rounded-bl-full -z-10" />

          <h3 className="text-xl font-semibold text-secondary-1 mb-6 pb-4 border-b border-secondary-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            Candidate Verification
          </h3>

          {isLoggedIn ? (
            <div className="animate-fade-up space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary-3 shadow-sm shrink-0">
                  <GumletImage
                    containerClassName="h-full w-full object-cover"
                    src={user?.profile_picture?.[0]}
                    alt={user?.name as string}
                  />
                </div>

                <div className="space-y-1 overflow-hidden">
                  <p className="font-semibold text-text truncate text-lg">
                    {user?.name}
                  </p>
                  {user?.email && <div className="flex items-center gap-2 text-sm text-neutral-1 truncate">
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{user?.email}</span>
                  </div>}
                  <div className="flex items-center gap-2 text-sm text-neutral-1">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span>{user?.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-success-5 border border-success-3 p-2 px-3 rounded-xl flex items-center gap-2">
                <span className="text-[15px] font-medium">
                  Hey <strong>{user?.name}</strong>, your identity is verified!
                  <br />We are glad to have you here and excited to see how you approach the upcoming assessment. Please review the instructions on the right panel and click <strong>&quot;Begin Assessment&quot;</strong> when you&apos;re ready. <br />Best of luck!
                </span>
              </div>
              <div className="bg-success-5 border border-success-3 p-2 px-3 rounded-xl flex flex-col items-center gap-2">
                <h3 className="text-xl font-bold">Assessment Window</h3>
                <div>
                  <p className="text-sm text-neutral-1">
                    Begins: <strong>{START_TIME.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {START_TIME.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} IST</strong>
                  </p>
                  <p className="text-sm text-neutral-1">
                    Closes: <strong>{END_TIME.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} at {END_TIME.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })} IST</strong>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-up text-center py-4">
              <div className="w-16 h-16 bg-neutral-4 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-neutral-1" />
              </div>
              <p className="text-sm text-neutral-1 mb-6 leading-relaxed">
                For security and fairness reasons, candidates must authenticate
                their identity before accessing the evaluation portal.
              </p>
              <button
                className="btn btn-secondary hov-lift w-full py-3 rounded-lg font-medium transition-all shadow-sm !flex !items-center !justify-center gap-2"
                onClick={handleVerifyIdentity}
              >
                <User className="w-4 h-4" />
                Verify Identity & Continue
              </button>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - INSTRUCTIONS */}
        <div className="flex-1 bg-white border border-neutral-4 rounded-2xl p-8 lg:p-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-4">
            Assessment Instructions
          </h2>

          <p className="text-neutral-1 mb-8 leading-relaxed text-lg">
            This behavioral assessment is designed to evaluate how candidates
            approach planning, collaboration, and decision-making in dynamic
            environments. Your responses will help us understand your
            professional mindset and how you may contribute to the SyncTrip team.
          </p>

          <h4 className="text-lg font-semibold text-secondary-1 mb-6">
            Important Guidelines
          </h4>

          <div className="space-y-5 mb-10">
            <div className="flex items-start gap-4">
              <div className="bg-secondary-5 p-2 rounded-lg text-secondary-1 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-text block mb-1">Estimated Duration</strong>
                <span className="text-neutral-1">The assessment typically takes 20–30 minutes to complete.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-secondary-5 p-2 rounded-lg text-secondary-1 shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-text block mb-1">Quiet Environment</strong>
                <span className="text-neutral-1">Please ensure you are in a distraction-free environment with a stable internet connection.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-secondary-5 p-2 rounded-lg text-secondary-1 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-text block mb-1">Independent Work</strong>
                <span className="text-neutral-1">The evaluation must be completed solely by the candidate without external assistance.</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-secondary-5 p-2 rounded-lg text-secondary-1 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-text block mb-1">Authentic Responses</strong>
                <span className="text-neutral-1">We value thoughtful, genuine answers that reflect your real experiences over perfectly polished responses.</span>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-4 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-sm text-neutral-1 max-w-sm">
              By starting this assessment, you confirm that all responses will
              be your own and that you agree to SyncTrip&apos;s privacy policy and terms of use.
            </p>

            <div className="flex flex-col md:items-end gap-3 w-full md:w-auto">
              {/* NEW: Confirmation Input Field (Only visible when logged in) */}
              {isLoggedIn && (
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="confirmStart" className="text-sm text-neutral-1 text-left md:text-right">
                    Please type <strong className="text-text">start</strong> to confirm:
                  </label>
                  <input
                    id="confirmStart"
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type 'start'..."
                    className="px-4 py-2.5 border border-neutral-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-1 focus:border-transparent transition-all w-full md:w-[220px] text-text"
                  />
                </div>
              )}

              <button
                className={`btn px-8 py-3 rounded-lg font-semibold transition-all shadow-sm whitespace-nowrap w-full md:w-auto ${isReadyToStart
                  ? "btn-primary hov-lift cursor-pointer hover:shadow-md"
                  : "btn-secondary-outline opacity-50 cursor-not-allowed bg-neutral-3 text-neutral-1"
                  }`}
                disabled={!isReadyToStart}
                onClick={handleBeginAssessment}
              >
                {isLoggedIn ? "Begin Assessment" : "Login to Begin"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InstructionsPage;