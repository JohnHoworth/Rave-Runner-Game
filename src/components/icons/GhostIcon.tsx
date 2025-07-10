export default function GhostIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes siren-red-car {
                    0%, 100% { fill: #ff4444; }
                    50% { fill: #8b0000; }
                }
                @keyframes siren-blue-car {
                    0%, 100% { fill: #4444ff; }
                    50% { fill: #222288; }
                }
                .siren-red-car { animation: siren-red-car 0.5s infinite; }
                .siren-blue-car { animation: siren-blue-car 0.5s infinite; animation-delay: 0.25s; }
            `}} />
            <g transform="translate(0, 8)">
                {/* Car body */}
                <path d="M12 36 L4 40 L4 28 L12 24 Z" fill="#FFFFFF" /> {/* Left side */}
                <path d="M12 36 L36 48 L36 36 L12 24 Z" fill="#EEEEEE" /> {/* Back */}
                <path d="M36 48 L60 40 L60 28 L36 36 Z" fill="#FAFAFA" /> {/* Right side */}
                <path d="M12 24 L36 36 L60 28 L36 16 Z" fill="#4444FF" /> {/* Roof */}
                <path d="M12 24 L36 16 L36 4 L12 12 Z" fill="#BBBBFF" /> {/* Windshield */}

                {/* Wheels */}
                <ellipse cx="10" cy="42" rx="6" ry="3" fill="#333333" />
                <ellipse cx="40" cy="50" rx="6" ry="3" fill="#222222" />
                <ellipse cx="54" cy="42" rx="6" ry="3" fill="#333333" />

                {/* Sirens */}
                <path className="siren-red-car" d="M28 15 L32 17 L32 13 L28 11 Z" />
                <path className="siren-blue-car" d="M36 16 L40 18 L40 14 L36 12 Z" />
            </g>
        </svg>
    );
}
