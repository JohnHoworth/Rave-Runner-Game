export default function FuelIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M3 22v-3.34a.94.94 0 0 1 .6-.9L8 16" />
            <path d="M11 16h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />
            <path d="M14 16.5a6.5 6.5 0 1 1-13 0" fill="#10b981" stroke="#10b981" />
            <path d="M11 5V3a1 1 0 0 0-1-1H7" />
            <path d="M18 12h.01" />
            <path d="M21 12h.01" />
            <path d="M18 15h.01" />
            <path d="M21 15h.01" />
        </svg>
    );
}
