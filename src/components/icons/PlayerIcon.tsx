
export default function PlayerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="smileyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#FFEE00' }} />
                    <stop offset="100%" style={{ stopColor: '#FFD700' }} />
                </linearGradient>
            </defs>
            <g>
                {/* Face */}
                <circle cx="50" cy="50" r="48" fill="url(#smileyGradient)" stroke="black" strokeWidth="3" />
                
                {/* Eyes */}
                <ellipse cx="35" cy="40" rx="8" ry="14" fill="black" />
                <ellipse cx="65" cy="40" rx="8" ry="14" fill="black" />

                {/* Smile */}
                <path d="M 30 65 A 25 25 0 0 0 70 65" stroke="black" strokeWidth="5" fill="none" strokeLinecap="round" />
            </g>
        </svg>
    );
}
