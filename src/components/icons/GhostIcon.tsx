
export default function GhostIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
           <circle cx="50" cy="50" r="15" fill="hsl(var(--destructive))" />
        </svg>
    );
}
