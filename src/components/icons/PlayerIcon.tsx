export default function PlayerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 48 48"
            fill="none"
        >
            <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {/* Base shape */}
            <path d="M24 34 L14 28 L14 16 L24 10 L34 16 L34 28 Z" fill="hsl(var(--accent))" filter="url(#glow)" />
            {/* Top face */}
            <path d="M24 10 L34 16 L24 22 L14 16 Z" fill="hsl(var(--accent) / 0.7)" />
            {/* Side face */}
            <path d="M34 16 L34 28 L24 34 L24 22 Z" fill="hsl(var(--accent) / 0.5)" />
            {/* Inner highlight */}
            <path d="M24 30 L18 27 L18 19 L24 16 L30 19 L30 27 Z" fill="hsl(var(--primary))" />
        </svg>
    );
}
