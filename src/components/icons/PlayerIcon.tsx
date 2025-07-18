
export default function PlayerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 50 100"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMax meet"
        >
            <g>
                {/* Body */}
                <path d="M 20 30 L 20 70 L 30 70 L 30 30 Z" fill="hsl(var(--primary))" />
                {/* Legs */}
                <path d="M 20 70 L 15 95 L 20 95 Z" fill="hsl(var(--primary) / 0.8)" />
                <path d="M 30 70 L 35 95 L 30 95 Z" fill="hsl(var(--primary) / 0.8)" />
                 {/* Arms */}
                <path d="M 20 35 L 15 60 L 20 60 Z" fill="hsl(var(--primary) / 0.9)" />
                <path d="M 30 35 L 35 60 L 30 60 Z" fill="hsl(var(--primary) / 0.9)" />
                {/* Head */}
                <circle cx="25" cy="15" r="12" fill="hsl(var(--accent))" />
                {/* Visor */}
                <rect x="15" y="10" width="20" height="8" fill="hsl(var(--background))" />
            </g>
        </svg>
    );
}
