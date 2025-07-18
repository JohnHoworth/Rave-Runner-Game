
export default function FlashingPillIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <defs>
                <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ff0000" />
                </filter>
                 <style>
                    {`
                        @keyframes pill-glow-anim {
                            0%, 100% {
                                opacity: 1;
                                transform: scale(1);
                            }
                            50% {
                                opacity: 0.7;
                                transform: scale(0.95);
                            }
                        }
                        .pill-glow {
                            animation: pill-glow-anim 1.5s infinite ease-in-out;
                        }
                    `}
                </style>
            </defs>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <g className="pill-glow" style={{ filter: 'url(#glow-red)' }}>
                 <path d="M4.5 12.5l8 8" stroke="#ff8080" fill="#ff4d4d" />
                 <path d="M19.5 4.5l-8 8" stroke="#ff8080" fill="#ff4d4d" />
            </g>
        </svg>
    );
}
