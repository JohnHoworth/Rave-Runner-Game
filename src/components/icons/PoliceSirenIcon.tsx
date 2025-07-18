export default function PoliceSirenIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <g className="siren-red">
                <path d="M50 0 A 50 50 0 0 1 50 100" fill="#ff0000" />
            </g>
             <g className="siren-blue">
                <path d="M50 0 A 50 50 0 0 0 50 100" fill="#0000ff" />
            </g>
        </svg>
    );
}
