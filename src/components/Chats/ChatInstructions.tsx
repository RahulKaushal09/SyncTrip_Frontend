import React, { useEffect, useState } from 'react';
import { ChevronDown, ShieldCheck, Video, Users, Info, Star } from 'lucide-react';

// interface ChatInstructionsProps {
//     currentUserName: string | undefined;
//     isAdmin: boolean;
// }

const generalInstructions = [{
    title: "Privacy & Conduct",
    description: "Respect the privacy of trip mates. Sharing personal data without consent or sending obscene messages will lead to an immediate ban.",
    icon: <ShieldCheck size={18} style={{ color: 'var(--primary-1)', flexShrink: 0 }} />
},
{
    title: "ID Verification",
    description: "Always request a video call verification if you haven't scheduled one yet. Never share financial details in this chat.",
    icon: <Video size={18} style={{ color: 'var(--primary-1)', flexShrink: 0 }} />
},
{
    title: "Itinerary Planning",
    description: "Use this space to finalize budgets, gear requirements, and meeting points. Ensure the group pace suits everyone.",
    icon: <Users size={18} style={{ color: 'var(--primary-1)', flexShrink: 0 }} />
}];

const ChatInstructions = () => {
    const isOpenBefore = localStorage.getItem('chatInstructionsOpen');
    const [isOpen, setIsOpen] = useState(isOpenBefore === null ? true : isOpenBefore === 'true');

    useEffect(() => {
        localStorage.setItem('chatInstructionsOpen', isOpen.toString());
    }, [isOpen]);

    const panelStyle: React.CSSProperties = {
        backgroundColor: 'var(--secondary-5)',
        borderBottom: '1px solid var(--neutral-4)',
        padding: '14px 20px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 20,
    };

    const listItemStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        marginBottom: '12px',
        alignItems: 'flex-start',
    };

    const adminBoxStyle: React.CSSProperties = {
        backgroundColor: 'var(--primary-5)',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid var(--primary-3)',
        marginBottom: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    };

    return (
        <div style={panelStyle} className="m-animate m-fade-in select-none">
            <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={18} color="var(--secondary-1)" />
                    <h4 className="h4" style={{ margin: 0, color: 'var(--secondary-1)', fontSize: '16px' }}>
                        Group Safety & Trip Guidelines
                    </h4>
                </div>
                <ChevronDown
                    size={20}
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        color: 'var(--secondary-1)'
                    }}
                />
            </div>

            {isOpen && (
                <div className="m-animate border-t border-gray-200 m-slide-down" style={{ marginTop: '16px', paddingTop: '16px' }}>

                    {/* Admin Specific Instruction */}

                    <div style={adminBoxStyle} className="m-animate m-zoom-in">
                        <Star size={24} style={{ color: 'var(--primary-1)', flexShrink: 0 }} fill="var(--primary-1)" />
                        <div className="r3 md:r2" style={{ color: 'var(--text)' }}>
                            <strong>All the members are requested to host a short group video chat with other members to confirm identities before the trip starts. Lead the way for a safe and authentic journey!</strong>
                        </div>
                    </div>

                    <div className="ul-withNoListStyle">
                        {generalInstructions.map((item, index) => (
                            <div key={index} style={listItemStyle}>
                                {item.icon}
                                <div>
                                    <strong style={{ color: 'var(--secondary-1)' }}>{item.title}</strong>
                                    <div className="r3 md:r2" style={{ color: 'var(--text)' }}>{item.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInstructions;