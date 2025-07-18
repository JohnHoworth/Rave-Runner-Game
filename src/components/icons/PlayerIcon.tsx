
export default function PlayerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 50 100"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax meet"
        >
            <g transform="translate(0, 10)">
                {/* Suit Jacket */}
                <path d="M 10 30 L 10 90 L 40 90 L 40 30 L 25 45 Z" fill="#334155" />
                <path d="M 10 30 L 25 45 L 40 30" fill="#273244"/>

                {/* Shirt */}
                <polygon points="20,30 30,30 25,40" fill="white" />
                
                {/* Tie */}
                <polygon points="25,40 22,55 28,55" fill="hsl(var(--primary))" />

                {/* Head */}
                <circle cx="25" cy="15" r="15" fill="#f1d4ad" />

                {/* Hair */}
                <path d="M 10 15 A 15 15 0 0 1 40 15 A 15 18 0 0 0 10 15 Z" fill="#1e293b" />
            </g>
        </svg>
    );
}
