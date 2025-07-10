export default function PlayerIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 50 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Shadow */}
            <path d="M 25,95 L 35,90 L 15,80 Z" fill="hsl(var(--background) / 0.5)" />

            {/* Suit */}
            <path d="M 25,40 L 15,35 L 15,85 L 25,90 L 35,85 L 35,35 Z" fill="#334155" />
            
            {/* Head */}
            <path d="M 25,5 L 15,0 L 15,35 L 25,40 L 35,35 L 35,0 Z" fill="#f1d4ad" />
            
            {/* Hair */}
            <path d="M 25,5 L 15,0 L 15,20 L 25,25 L 35,20 L 35,0 Z" fill="#1e293b" />
            
            {/* Tie */}
            <path d="M 25,55 L 22,53 L 22,70 L 25,72 L 28,70 L 28,53 Z" fill="hsl(var(--primary))" />
        </svg>
    );
}
