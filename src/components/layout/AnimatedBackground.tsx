
"use client";

const holographicBackgroundStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--background))',
    backgroundImage: `
        linear-gradient(90deg, hsla(var(--primary) / 0.05) 1px, transparent 1px),
        linear-gradient(hsla(var(--primary) / 0.05) 1px, transparent 1px),
        radial-gradient(circle at 10% 10%, hsla(var(--accent) / 0.08), transparent 40%),
        radial-gradient(circle at 90% 80%, hsla(var(--primary) / 0.08), transparent 40%)
    `,
    backgroundSize: '25px 25px, 25px 25px, 100% 100%, 100% 100%',
    animation: 'move-grid 3s linear infinite',
};

const scanlineEffect: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    backgroundImage: 'linear-gradient(to bottom, transparent 50%, hsla(var(--primary) / 0.1) 51%)',
    backgroundSize: '100% 4px',
    opacity: 0.4,
    pointerEvents: 'none',
};

const vignetteEffect: React.CSSProperties = {
    backgroundImage: 'radial-gradient(ellipse at center, transparent 30%, hsl(var(--background)) 100%)',
};

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" data-ai-hint="nightclub background">
            <div 
                className="absolute inset-0" 
                style={holographicBackgroundStyle}
            />
            <div
                style={scanlineEffect}
            />
            <div 
                className="absolute inset-0"
                style={vignetteEffect}
            />
        </div>
    );
}
