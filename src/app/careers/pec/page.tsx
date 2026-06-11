"use client";

import { useLogin } from "@/components/providers/LoginProvider";
import React, { use, useEffect, useState } from "react";
import { triggerLogin } from './../../../utils/login.utils';

// Replace this with your real auth/profile hooks or context
// This implementation uses localStorage for demo/testing purposes.
// localStorage keys expected (for demo):
//   user -> JSON.stringify({ id: string, name: string, email: string })
//   profileCompleted -> "true" | "false"
// Example to set in browser console for testing:
// localStorage.setItem('user', JSON.stringify({ id: 'u123', name: 'Aman', email: 'a@b.com' }));
// localStorage.setItem('profileCompleted', 'true');

const FORM_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSeAtpZYCaI200vI_Ej0joqTGuLpcHu6yxxi5SvZf5FGt7OfqQ/viewform?usp=dialog"; // <-- replace with actual Google Form link

function generateToken(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
}

type User = {
    id: string;
    name?: string;
    email?: string;
};

export default function Page() {
    const { user, isLoggedIn } = useLogin();
    const [showModal, setShowModal] = useState<"login" | "completeProfile" | "token" | "usePersonalEmail" | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [applied, setApplied] = useState<boolean>(false);

    useEffect(() => {
        // read user & profile state from localStorage (replace with real auth in production)
        try {


            // check if already applied for PEC internship
            const uid = user?.id;

            if (uid) {
                const appliedKey = `synctrip_applied_pec_${uid}`;
                setApplied(localStorage.getItem(appliedKey) === "true");
            }
        } catch (e) {
            console.error(e);
        }
    }, []);
    useEffect(() => {
        const profileCompleted = user?.profileCompleted;
        if (!isLoggedIn) {
            setApplied(false);
        }
        else if (isLoggedIn && user && profileCompleted && !applied) {
            handleApplyClick();
        }
    }, [isLoggedIn, user]);
    function handleApplyClick() {
        if (!user) {
            setShowModal("login");
            return;
        }
        if (!user.profileCompleted) {
            setShowModal("completeProfile");
            return;
        }
        if (user.email?.includes("@pec.edu.in")) {
            setShowModal("usePersonalEmail");
            return;
        }

        // generate one-time token, save application record locally and show popup with form link and token
        const newToken = generateToken(10);
        setToken(newToken);

        // save applied flag and token to localStorage so page remembers
        const appliedKey = `synctrip_applied_pec_${user.id}`;
        localStorage.setItem(appliedKey, "true");
        localStorage.setItem(`${appliedKey}_token`, newToken);
        setApplied(true);
        setShowModal("token");
    }

    function handleCopyToken() {
        if (!token) return;
        navigator.clipboard.writeText(token).then(
            () => {
                alert("Token copied to clipboard - paste it in the Google Form field.");
            },
            () => {
                alert("Could not copy automatically. Please copy it manually.");
            }
        );
    }

    function handleOpenForm() {
        window.open(FORM_LINK, "_blank");
    }



    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold">Software Developer Intern - On-site (Chandigarh)</h1>
                    <p className="text-sm text-slate-600 mt-1">SyncTrip • 4–6 months • Stipend: Competitive • Internship Certificate + PPO</p>
                </header>

                <section className="prose prose-slate max-w-none mb-6">
                    <p>
                        SyncTrip is a travel-tech startup building a platform where people can create trips, match with other travelers,
                        collaborate on itineraries, discover places, and manage the whole experience in one place.
                    </p>
                    <br></br>
                    <h3>Role overview</h3>
                    <p>
                        We are looking for a Software Developer Intern who is an all-rounder - someone who can contribute to product
                        development, UI design, tech implementation, social media & online presence, trip/event management and
                        operations support.
                    </p>
                    <br></br>

                    <h3>Tech stack you will work on</h3>
                    <p>Next.js, MERN, Python, React Native, Cloud (AWS / Cloudflare / S3 / OCI), APIs, Databases, DevTools.</p>
                    <br></br>

                    <h3>Responsibilities</h3>
                    <ul>
                        <li>Build and improve features in Next.js, MERN, Python services, and React Native.</li>
                        <li>Work on UI/UX design for web and app experiences.</li>
                        <li>Help with backend API logic, debugging, and performance fixes.</li>
                        <li>Assist in scaling production systems and deployments.</li>
                        <li>Work closely with founders to understand product thinking and user psychology.</li>
                    </ul>
                    <br></br>

                    <h3>What we’re looking for</h3>
                    <ul>
                        <li>Good understanding of coding (JavaScript / Python preferred).</li>
                        <li>Strong willingness to learn new technologies fast.</li>
                        <li>Basic knowledge of web/mobile frameworks.</li>
                        <li>Creativity in UI, design tools and social media content.</li>
                        <li>Interest in travel, community and startups. Self-driven and responsible.</li>
                    </ul>
                    <br></br>

                    <h3>Perks</h3>
                    <ul>
                        <li>Mentorship from founders.</li>
                        <li>Experience in AI integrations, cloud services and production-ready architectures.</li>
                        <li>Portfolio-worthy projects and internship certificate + PPO for high performers.</li>
                    </ul>
                </section>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleApplyClick}
                        disabled={applied}
                        className={`px-5 py-2 rounded-lg text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${applied ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {applied ? "Applied (PEC)" : "Apply - PEC Software Dev Internship"}
                    </button>

                    <div className="text-sm text-slate-600">
                        {user ? (
                            <>
                                Logged in as <strong>{user.name ?? user.email}</strong>
                                {!user.profileCompleted && <span className="ml-2 text-orange-600">(profile incomplete)</span>}
                            </>
                        ) : (
                            <span>Not logged in</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal area */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4" style={{ zIndex: 1001 }}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-lg">
                        {showModal === "usePersonalEmail" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2 text-red-600">College Email Not Allowed</h3>
                                <p className="text-sm text-slate-700 mb-4">
                                    You are currently logged in using your <strong>@pec.edu.in</strong> email.<br />
                                    Please logout and create a new account using a <strong>personal email ID</strong> to apply.
                                </p>
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setShowModal(null)} className="px-4 py-2 rounded-md border">
                                        Okay
                                    </button>
                                </div>
                            </div>
                        )}
                        {showModal === "login" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">You need to sign in</h3>
                                <p className="text-sm text-slate-600 mb-4">Please sign in and complete profile to apply for the PEC internship.</p>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setShowModal(null)}
                                        className="px-4 py-2 rounded-md border"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => triggerLogin(handleApplyClick)}
                                        className="px-4 py-2 rounded-md bg-indigo-600 text-white"
                                    >
                                        Sign In
                                    </button>
                                </div>
                            </div>
                        )}

                        {showModal === "completeProfile" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Complete your profile to apply</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    We found your account but your profile is incomplete. Please finish your profile (education / skills / CV)
                                    to apply for on-site placements.
                                </p>
                                <div className="flex gap-2 justify-end">
                                    <button
                                        onClick={() => setShowModal(null)}
                                        className="px-4 py-2 rounded-md border"
                                    >
                                        Later
                                    </button>
                                    <button
                                        onClick={() => {
                                            // simulate marking profile complete in demo
                                            setShowModal(null);
                                            triggerLogin(handleApplyClick);

                                        }}
                                        className="px-4 py-2 rounded-md bg-indigo-600 text-white"
                                    >
                                        Complete Profile
                                    </button>
                                </div>
                            </div>
                        )}

                        {showModal === "token" && (
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Application - PEC Software Dev Internship</h3>
                                <p className="text-sm text-slate-600 mb-4">
                                    Thanks for applying! We&apos;ve generated a one-time Application Token for you. Please paste this token in the
                                    Google Form (link provided) to complete the test/selection process.
                                </p>

                                <div className="bg-slate-50 p-4 rounded-md mb-4">
                                    <div className="text-sm text-slate-500 mb-2">Your Application Token</div>
                                    <div className="flex items-center gap-3">
                                        <code className="px-3 py-2 rounded-md bg-white border font-mono">{token}</code>
                                        <button onClick={handleCopyToken} className="px-3 py-2 rounded-md border">Copy</button>
                                        <button onClick={handleOpenForm} className="px-3 py-2 rounded-md bg-indigo-600 text-white">Open Google Form</button>
                                    </div>
                                </div>

                                {/* <div className="text-xs text-slate-500 mb-4">
                  The token is recorded locally for this browser. If you switch devices, generate a new token from the
                  careers page.
                </div> */}

                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => setShowModal(null)} className="px-4 py-2 rounded-md border">
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}


        </div>
    );
}
