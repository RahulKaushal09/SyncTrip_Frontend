// app/verify/[token]/AlreadyVerified.tsx  ← SERVER COMPONENT (pure SSR, no JS needed)

import { ShieldCheck } from "lucide-react";

export default function AlreadyVerified({ userName }: { userName: string | null }) {
    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }

                .av-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 16px;
                    padding-top: 80px;
                }

                .av-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #e2e4e9;
                    max-width: 420px;
                    width: 100%;
                    padding: 48px 32px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .av-icon {
                    width: 76px;
                    height: 76px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #16a34a, #15803d);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 22px;
                    box-shadow: 0 8px 24px rgba(22,163,74,0.28);
                }

                .av-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #16324f;
                    margin: 0 0 10px;
                }

                .av-desc {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0 0 28px;
                }

                .av-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: #f0fdf4;
                    border: 1.5px solid #bbf7d0;
                    color: #15803d;
                    border-radius: 999px;
                    padding: 8px 18px;
                    font-size: 13px;
                    font-weight: 600;
                }

                .av-close-hint {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #94a3b8;
                }
            `}</style>

            <div className="av-page">
                <div className="av-card">
                    <div className="av-icon">
                        <ShieldCheck size={36} color="#fff" />
                    </div>

                    <h1 className="av-title">
                        {userName
                            ? `You're verified, ${userName.split(" ")[0]}!`
                            : "Already Verified"}
                    </h1>

                    <p className="av-desc">
                        Your face has already been verified and is securely linked to your
                        account. No further action is needed.
                    </p>

                    <div className="av-badge">
                        <ShieldCheck size={14} />
                        Face Verification Active
                    </div>

                    <p className="av-close-hint">You may safely close this page.</p>
                </div>
            </div>
        </>
    );
}