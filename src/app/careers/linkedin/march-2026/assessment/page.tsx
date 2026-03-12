"use client";

import React, { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/components/providers/LoginProvider";
import GumletImage from "@/components/common/GumletImage";
import toast from "react-hot-toast";
import { Check, CheckCircle2, Mail, User as UserIcon, AlertTriangle, Maximize, Phone, IdCard } from "lucide-react";
import { START_TIME, QUESTIONS } from "@/app/careers/linkedin/march-2026/data";
import { UserApiService } from "@/utils/user.api.utils";

// Global variable controlling the form's availability
const IS_OPEN = true;

interface FormData {
  [key: number]: string | string[];
}

const HiringForm: React.FC = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useLogin();

  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // --- FULL SCREEN STATES ---
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- HYDRATION & AUTHENTICATION CHECK ---
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const submitted = localStorage.getItem("hasSubmittedAssessment") === "true";
    setHasSubmitted(submitted);
  }, []);

  const checkIfUserCanAccess = () => {
    const submitted = localStorage.getItem("hasSubmittedAssessment") === "true";
    setHasSubmitted(submitted);
  };

  useEffect(() => {
    if (!user?.id) return;
    checkIfUserCanAccess();
  }, [user]);

  useEffect(() => {
    if (!isMounted) return;

    const now = new Date();
    if (now < START_TIME) {
      router.push("/careers/linkedin/march-2026/instructions");
      toast.error("The behavioral evaluation will open on March 14th at 10 AM IST. Please check back then!");
      return;
    }

    if (isLoggedIn === false) {
      router.push("/careers/linkedin/march-2026/instructions");
      toast.error("Please log in to access the behavioral evaluation.");
    }
  }, [isLoggedIn, isMounted, router]);

  // --- FULL SCREEN LISTENERS ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const enterFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      toast.error("Could not enable full-screen mode. Please try again.");
    }
  };

  const handleStartAssessment = async () => {
    await enterFullscreen();
    setHasStarted(true);
  };

  // Helper to check if a specific question is answered
  const isQuestionAnswered = (id: number, type: string) => {
    const val = formData[id];
    if (type === "multiple") return Array.isArray(val) && val.length > 0;
    return !!val && (val as string).trim() !== "";
  };

  // Calculate progress
  const answeredCount = QUESTIONS.filter(q => isQuestionAnswered(q.id, q.type)).length;
  const progressPercentage = Math.round((answeredCount / QUESTIONS.length) * 100);

  // Smooth scroll to a specific question
  const scrollToQuestion = (id: number) => {
    const element = document.getElementById(`question-${id}`);
    if (element) {
      const yOffset = -40; // Offset to give some breathing room at the top
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Form Handlers
  const handleInputChange = (id: number, value: string, type: string, checked?: boolean) => {
    setFormData((prev) => {
      if (type === "multiple") {
        const currentValues = (prev[id] as string[]) || [];
        if (checked) {
          return { ...prev, [id]: [...currentValues, value] };
        } else {
          return { ...prev, [id]: currentValues.filter((v) => v !== value) };
        }
      }
      return { ...prev, [id]: value };
    });
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);

    const firstUnanswered = QUESTIONS.find(
      (q) => q.required && !isQuestionAnswered(q.id, q.type)
    );

    if (firstUnanswered) {
      toast.error("Please answer all the required questions before submitting.");
      scrollToQuestion(firstUnanswered.id);
      return;
    }

    try {
      const response = await UserApiService.submitAssessment(
        JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          data: formData
        })
      );

      if (!response.success) {
        throw new Error(response.message || "Submission failed");
      }

      toast.success(response.message || "Assessment submitted successfully!");
      setIsSubmitted(true);
      localStorage.setItem("hasSubmittedAssessment", "true");

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }

      // redirect to /instructions after short delay to allow toast to show
      setTimeout(() => {
        router.push("/careers/linkedin/march-2026/instructions");
      }, 1500);

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error: unknown) {
      console.error("Submission error:", error);
      toast.error("Failed to submit assessment");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const firstUnanswered = QUESTIONS.find(
      (q) => q.required && !isQuestionAnswered(q.id, q.type)
    );

    if (firstUnanswered) {
      toast.error("Please answer all the required questions before submitting.");
      scrollToQuestion(firstUnanswered.id);
      return;
    }

    try {
      const response = await UserApiService.submitAssessment(JSON.stringify({ userId: user?.id, userName: user?.name, data: formData }));

      if (!response.success) {
        throw new Error(response.message || "Submission failed");
      }

      toast.success("Assessment submitted successfully!");
      setIsSubmitted(true);

      // Exit fullscreen after submission
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }

      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error: unknown) {
      console.error("Submission error:", error);
      toast.error("Failed to submit assessment");
    }
  };

  // --- RENDER GUARDS ---
  if (!isMounted) return null;

  if (hasSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-6 px-4">
        <div className="max-w-xl w-full bg-white p-10 text-center rounded-3xl border border-neutral-4 shadow-sm animate-fade-up">

          <div className="w-20 h-20 bg-success-5 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-success-1" />
          </div>

          <h2 className="text-3xl font-bold text-text mb-3">
            Assessment Already Submitted
          </h2>

          <p className="text-neutral-1 text-lg leading-relaxed mb-6">
            Our records indicate that you have already submitted this behavioral evaluation.
            Each candidate is allowed only one submission.
          </p>

          <p className="text-neutral-2 text-sm">
            If you believe this is an error, please contact us at
            <span className="font-medium text-secondary-1"> synctripofficial@gmail.com</span>.
          </p>

        </div>
      </div>
    );
  }

  if (!IS_OPEN) {
    return (
      <div className="container-custom min-h-[60vh] flex items-center justify-center bg-secondary-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-secondary-1 mb-2">Applications Closed</h1>
          <p className="text-neutral-1">We are not currently accepting responses for this behavioral test. Please check back later.</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  if (now < START_TIME) return null;
  if (!isLoggedIn) return null;

  if (isSubmitted) {
    return (
      <div className="container-custom pt-[100px] pb-[100px] animate-fade-up min-h-[70vh] flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full bg-white p-12 text-center rounded-3xl border border-neutral-4 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-success-5 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-success-1" />
          </div>
          <h2 className="text-3xl font-bold text-text mb-4">Assessment Submitted!</h2>
          <p className="text-lg text-neutral-1 leading-relaxed">
            Thank you for taking the time to complete the evaluation. Your responses have been recorded successfully, and our team will review them shortly.
          </p>
        </div>
      </div>
    );
  }

  // Generate dynamic watermark using the user's email
  const userEmail = user?.email || user?.phone;
  const watermarkSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="rgba(15, 23, 42, 0.04)" font-size="16" font-family="sans-serif" font-weight="bold" transform="rotate(-35 150 150)">
        ${userEmail}
      </text>
    </svg>
  `);

  // --- START SCREEN (To trigger initial full screen) ---
  if (!hasStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-6 px-4">
        <div className="max-w-md w-full bg-white p-8 text-center rounded-3xl border border-neutral-4 shadow-md animate-fade-up">
          <div className="w-16 h-16 bg-secondary-5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Maximize className="w-8 h-8 text-secondary-1" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-3">Ready to Begin?</h2>
          <p className="text-neutral-1 mb-8 leading-relaxed">
            This behavioral assessment requires you to be in full-screen mode. Please ensure you are in a distraction-free environment before starting.
          </p>
          <button
            onClick={handleStartAssessment}
            className="w-full bg-secondary-1 hover:bg-secondary-2 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md hov-lift"
          >
            Enter Full Screen & Start
          </button>
        </div>
      </div>
    );
  }

  // --- MAIN FORM RENDER ---
  return (
    <>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-fade-up text-center">

            <h3 className="text-2xl font-bold text-text mb-3">
              Confirm Submission
            </h3>

            <p className="text-neutral-1 mb-6 leading-relaxed">
              Are you sure you want to submit your assessment? <br />
              You will not be able to edit your answers after submission.
            </p>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 rounded-lg border border-neutral-3 text-neutral-2 hover:bg-neutral-6"
              >
                Cancel
              </button>

              <button
                onClick={confirmSubmit}
                className="px-6 py-2 rounded-lg bg-secondary-1 text-white font-semibold hover:bg-secondary-2"
              >
                Yes, Submit
              </button>
            </div>

          </div>
        </div>
      )}
      {/* FULL SCREEN WARNING BANNER (Shows when user escapes fullscreen) */}
      {!isFullscreen && (
        <div className="fixed top-0 left-0 w-full bg-red-600/95 backdrop-blur-md text-white px-6 py-4 z-[100] flex flex-col sm:flex-row items-center justify-center gap-4 shadow-lg animate-fade-in border-b border-red-700">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold text-center sm:text-left">
              Full-screen mode is required to continue this assessment.
            </span>
          </div>
          <button
            onClick={enterFullscreen}
            className="bg-white text-red-600 hover:bg-neutral-100 px-5 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm whitespace-nowrap"
          >
            Re-enter Full Screen
          </button>
        </div>
      )}

      {/* Wrap the main layout in a container that blurs and disables interactions 
        if the user is not in full-screen mode 
      */}
      <div className={`bg-neutral-6 min-h-screen select-none relative pb-[100px] transition-all duration-300 ${!isFullscreen ? "pointer-events-none blur-sm select-none h-screen overflow-hidden" : ""}`}>

        {/* FULL SCREEN WATERMARK */}
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,${watermarkSvg}")` }}
        />

        <div className="container-custom pt-10 animate-fade-up relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">

            {/* --- LEFT SIDEBAR (STICKY) --- */}
            <aside className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-8 flex flex-col gap-6">

              {/* User Info Card */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-4 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary-3 shadow-sm shrink-0 bg-neutral-5 flex items-center justify-center">
                    {user?.profile_picture?.[0] ? (
                      <GumletImage
                        containerClassName="h-full w-full object-cover"
                        src={user.profile_picture[0]}
                        alt={user?.name as string}
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-neutral-2" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-text truncate text-lg leading-tight">
                      {user?.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-neutral-1 mt-1 truncate">
                      <IdCard className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{user?.id?.slice(0, 8)?.toUpperCase() || user?.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Progress Tracking Line */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-text">Overall Progress</span>
                    <span className="text-sm font-bold text-secondary-1">{progressPercentage}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-neutral-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary-1 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-1 mt-2 text-right">
                    {answeredCount} of {QUESTIONS.length} answered
                  </p>
                </div>
              </div>

              {/* Questions Grid */}
              <div className="bg-white p-6 rounded-2xl border border-neutral-4 shadow-sm">
                <h3 className="text-sm font-semibold text-text mb-4 uppercase tracking-wider">Question Tracker</h3>
                <div className="grid grid-cols-6 gap-2">
                  {QUESTIONS.map((q, i) => {
                    const isAnswered = isQuestionAnswered(q.id, q.type);
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => scrollToQuestion(q.id)}
                        className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all hover:-translate-y-0.5 ${isAnswered
                          ? "bg-success-1 text-white shadow-sm border border-success-2"
                          : "bg-neutral-5 text-neutral-1 border border-neutral-4 hover:border-secondary-3 hover:text-secondary-1"
                          }`}
                        title={isAnswered ? `Question ${i + 1} (Answered)` : `Question ${i + 1} (Pending)`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

            </aside>

            {/* --- RIGHT SIDE MAIN FORM --- */}
            <main className="flex-1 w-full max-w-3xl">
              <div className="mb-8 pl-4 border-l-4 border-secondary-1">
                <h1 className="text-3xl font-bold text-text mb-2">Behavioral Evaluation</h1>
                <p className="text-neutral-1 text-lg">Please answer all required questions thoughtfully. There are no strictly right or wrong answers.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {QUESTIONS.map((q, index) => {
                  const isAnswered = isQuestionAnswered(q.id, q.type);

                  return (
                    <div
                      key={q.id}
                      id={`question-${q.id}`} // Used for scrolling anchor
                      className={`bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-sm border transition-all duration-300 scroll-mt-24 ${isAnswered ? "border-success-3" : "border-neutral-4 hover:border-neutral-3"
                        }`}
                    >
                      <p className="text-lg font-medium text-text mb-6 leading-relaxed flex items-start justify-between gap-4">
                        <span>
                          <span className="text-neutral-2 mr-2 font-bold">{index + 1}.</span>
                          {q.question}
                          {q.required && <span className="text-red-500 ml-1" title="Required">*</span>}
                        </span>
                      </p>

                      {/* Short Answer */}
                      {q.type === "short" && (
                        <textarea
                          required={q.required}
                          rows={4}
                          className="w-full p-4 rounded-xl border border-neutral-3 focus:outline-none focus:ring-2 focus:ring-secondary-1 focus:border-transparent transition-all resize-y text-text placeholder:text-neutral-3 bg-neutral-6/50 focus:bg-white relative z-10"
                          placeholder="Type your answer here..."
                          value={formData[q.id] as string || ""}
                          onChange={(e) => handleInputChange(q.id, e.target.value, q.type)}
                        />
                      )}

                      {/* Multiple Choice Question (Radio) */}
                      {q.type === "mcq" && q.options && (
                        <div className="flex flex-col gap-3">
                          {q.options.map((option, i) => {
                            const isSelected = formData[q.id] === option;
                            return (
                              <label
                                key={i}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all relative z-10 ${isSelected
                                  ? "border-secondary-1 bg-secondary-5/40"
                                  : "border-neutral-4 hover:border-neutral-3 hover:bg-neutral-6/50"
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-secondary-1" : "border-neutral-3"
                                  }`}>
                                  {isSelected && <div className="w-2.5 h-2.5 bg-secondary-1 rounded-full animate-fade-in" />}
                                </div>
                                <input
                                  type="radio"
                                  name={`question_${q.id}`}
                                  value={option}
                                  required={q.required}
                                  className="hidden"
                                  onChange={(e) => handleInputChange(q.id, e.target.value, q.type)}
                                />
                                <span className={`text-[15px] ${isSelected ? "text-secondary-1 font-medium" : "text-text"}`}>
                                  {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Multiple Selection (Checkboxes) */}
                      {q.type === "multiple" && q.options && (
                        <div className="flex flex-col gap-3">
                          {q.options.map((option, i) => {
                            const isSelected = (formData[q.id] as string[] || []).includes(option);
                            return (
                              <label
                                key={i}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all relative z-10 ${isSelected
                                  ? "border-secondary-1 bg-secondary-5/40"
                                  : "border-neutral-4 hover:border-neutral-3 hover:bg-neutral-6/50"
                                  }`}
                              >
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-secondary-1 bg-secondary-1" : "border-neutral-3"
                                  }`}>
                                  {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                </div>
                                <input
                                  type="checkbox"
                                  value={option}
                                  className="hidden"
                                  onChange={(e) => handleInputChange(q.id, e.target.value, q.type, e.target.checked)}
                                />
                                <span className={`text-[15px] ${isSelected ? "text-secondary-1 font-medium" : "text-text"}`}>
                                  {option}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div className="mt-6 pt-8 border-t border-neutral-4 flex flex-col sm:flex-row items-center justify-between gap-6 pb-12">
                  <p className="text-sm text-neutral-1 text-center sm:text-left">
                    Ensure all {QUESTIONS.length} questions are answered. <br className="hidden sm:block" />
                    Your responses will be recorded securely.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary hov-lift px-12 py-4 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all w-full sm:w-auto relative z-10 bg-secondary-1 text-white"
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Submit Assessment
                  </button>
                </div>
              </form>
            </main>

          </div>
        </div>
      </div>
    </>
  );
};

export default HiringForm;