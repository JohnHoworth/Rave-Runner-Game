
export default function PlayerIcon({ className }: { className?: string }) {
    const extrusion = 8;
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
             <style dangerouslySetInnerHTML={{__html: `
                @keyframes player-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .player { 
                    animation: player-bob 1.5s ease-in-out infinite;
                    transform-origin: center;
                }
            `}} />
            <g className="player" transform={`translate(0, -${extrusion}) rotateY(90deg)`}>
                {/* Body Extrusion */}
                <path d="M 40 90 L 40 50 L 60 50 L 60 90 Z" fill="#1e293b" transform={`translate(0, ${extrusion})`} />
                <path d="M 40 90 L 60 90 L 60 ${90 + extrusion} L 40 ${90 + extrusion} Z" fill="#29364a" />
                
                {/* Head Extrusion */}
                <path d="M 35 20 A 15 15 0 0 0 35 50 L 65 50 A 15 15 0 0 0 65 20 Z" fill="#c0a98a" transform={`translate(0, ${extrusion})`} />

                {/* Body Top */}
                <path d="M 40 90 L 40 50 L 60 50 L 60 90 Z" fill="#334155" />

                {/* Head Top */}
                <rect x="35" y="20" width="30" height="30" rx="15" fill="#f1d4ad" />

                 {/* Headphones */}
                <path d="M 30 40 C 20 20, 80 20, 70 40" stroke="hsl(var(--primary))" strokeWidth="5" fill="none" />
                <rect x="28" y="40" width="10" height="15" fill="hsl(var(--primary))" />
                <rect x="62" y="40" width="10" height="15" fill="hsl(var(--primary))" />
            </g>
        </svg>
    );
}
