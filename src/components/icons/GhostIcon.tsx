
export default function GhostIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes ghost-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .ghost { animation: ghost-bob 2s ease-in-out infinite; }
            `}} />
            <g className="ghost">
                <path
                    d="M20 100 C20 60, 80 60, 80 100 L85 90 L75 100 L65 90 L55 100 L45 90 L35 100 L25 90 Z"
                    fill="hsl(var(--accent) / 0.8)"
                    stroke="hsl(var(--accent))"
                    strokeWidth="4"
                />
                <circle cx="38" cy="45" r="8" fill="hsl(var(--background))" />
                <circle cx="62" cy="45" r="8" fill="hsl(var(--background))" />
                 <circle cx="38" cy="45" r="3" fill="hsl(var(--primary))" className="animate-pulse" />
                <circle cx="62" cy="45" r="3" fill="hsl(var(--primary))" className="animate-pulse" />
            </g>
        </svg>
    );
}
