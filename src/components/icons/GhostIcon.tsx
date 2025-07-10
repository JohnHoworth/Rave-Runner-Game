export default function GhostIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <style>
                {`
                @keyframes siren-red {
                    0%, 100% { fill: #ff0000; }
                    50% { fill: #660000; }
                }
                @keyframes siren-blue {
                    0%, 100% { fill: #660000; }
                    50% { fill: #0000ff; }
                }
                .siren-red { animation: siren-red 0.5s infinite; }
                .siren-blue { animation: siren-blue 0.5s infinite; animation-delay: 0.25s; }
                `}
            </style>
            <path className="siren-red" d="M12 2 L2 7 L12 12 L22 7 L12 2 Z" />
            <path className="siren-blue" d="M2 7 L12 12 L2 17 L2 7 Z" />
            <path className="siren-blue" d="M22 7 L12 12 L22 17 L22 7 Z" />
            <path fill="#444" d="M4 16 L20 16 L20 20 L4 20 Z" />
        </svg>
    );
}
