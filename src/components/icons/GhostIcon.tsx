
export default function GhostIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
        >
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes flash-red {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.2; }
                }
                @keyframes flash-blue {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 1; }
                }
                .siren-red { animation: flash-red 0.8s ease-in-out infinite; }
                .siren-blue { animation: flash-blue 0.8s ease-in-out infinite; }
            `}} />
            <g>
                {/* Base of the siren */}
                <circle cx="50" cy="50" r="45" fill="#444" stroke="#666" strokeWidth="2" />

                {/* Red Light */}
                <path className="siren-red" d="M 50 10 A 40 40 0 0 1 50 90" fill="#ff0000" stroke="#ff0000" strokeWidth="4" />

                {/* Blue Light */}
                <path className="siren-blue" d="M 50 10 A 40 40 0 0 0 50 90" fill="#0000ff" stroke="#0000ff" strokeWidth="4" />

                {/* Glare */}
                <path d="M 30 25 A 30 30 0 0 1 70 25" stroke="rgba(255,255,255,0.7)" strokeWidth="4" fill="none" />
            </g>
        </svg>
    );
}
