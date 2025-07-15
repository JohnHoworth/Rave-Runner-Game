
export default function FlashingPillIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth="1.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <defs>
                <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#ff0000" />
                </filter>
                <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#0000ff" />
                </filter>
            </defs>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <g className="siren-red">
                <path d="M4.5 12.5l8 8" stroke="#ff0000" fill="#ff0000" style={{ filter: 'url(#glow-red)' }} />
                <path d="M8.5 8.5l7 7" stroke="#ff0000" fill="#ff0000" opacity="0" />
            </g>
             <g className="siren-blue">
                <path d="M19.5 4.5l-8 8" stroke="#0000ff" fill="#0000ff" style={{ filter: 'url(#glow-blue)' }} />
                <path d="M15.5 15.5l-7-7" stroke="#0000ff" fill="#0000ff" opacity="0" />
            </g>
        </svg>
    );
}
