// app/verify/InvalidToken.tsx  ← SERVER COMPONENT

import { ShieldX, Clock } from "lucide-react";

interface Props {
    expired?: boolean;
}

export default function InvalidToken({ expired = false }: Props) {
    return (
        <>
            <style>{`
                *, *::before, *::after { box-sizing: border-box; }

                .it-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px 16px;
                    padding-top: 80px;
                }

                .it-card {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #e2e4e9;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.07);
                    max-width: 400px;
                    width: 100%;
                    padding: 48px 32px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .it-icon {
                    width: 76px;
                    height: 76px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 22px;
                    box-shadow: 0 8px 24px rgba(220,38,38,0.25);
                }

                .it-title {
                    font-size: 20px;
                    font-weight: 700;
                    color: #16324f;
                    margin: 0 0 10px;
                }

                .it-desc {
                    font-size: 14px;
                    color: #64748b;
                    line-height: 1.6;
                    margin: 0 0 28px;
                }

                .it-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    background: #fff5f5;
                    border: 1.5px solid #fecaca;
                    color: #b91c1c;
                    border-radius: 999px;
                    padding: 8px 18px;
                    font-size: 13px;
                    font-weight: 600;
                }

                .it-hint {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #94a3b8;
                }
            `}</style>

            <div className="it-page">
                <div className="it-card">
                    <div className="it-icon">
                        {expired ? <Clock size={36} color="#fff" /> : <ShieldX size={36} color="#fff" />}
                    </div>

                    <h1 className="it-title">
                        {expired ? "Link Expired" : "Invalid Verification Link"}
                    </h1>

                    <p className="it-desc">
                        {expired
                            ? "This verification link has expired. Please request a new one from the app and try again."
                            : "This verification link is missing or invalid. Please request a new verification link from the app and try again."}
                    </p>

                    <div className="it-badge">
                        {expired ? <Clock size={14} /> : <ShieldX size={14} />}
                        {expired ? "Link Expired" : "Link Not Valid"}
                    </div>

                    <p className="it-hint">If you believe this is an error, please contact support.</p>
                </div>
            </div>
        </>
    );
}