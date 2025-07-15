
"use client";

const skyboxStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--background))',
    backgroundImage: `
        radial-gradient(ellipse at 50% 100%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 150%, hsl(var(--accent) / 0.2) 0%, transparent 60%),
        radial-gradient(circle at 20% 80%, hsl(var(--accent) / 0.15) 0%, transparent 10%),
        radial-gradient(circle at 80% 75%, hsl(var(--primary) / 0.15) 0%, transparent 10%),
        radial-gradient(circle at 50% 90%, hsl(var(--foreground) / 0.05) 0%, transparent 8%),
        radial-gradient(circle at 90% 95%, hsl(var(--accent) / 0.1) 0%, transparent 7%)
    `,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
};

const vignetteEffect = {
    backgroundImage: 'radial-gradient(ellipse at center, transparent 60%, hsl(var(--background)) 95%)',
};

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" data-ai-hint="futuristic city nightclub">
            <div 
                className="absolute inset-0" 
                style={skyboxStyle}
            />
            <div 
                className="absolute inset-0"
                style={vignetteEffect}
            />
        </div>
    );
}
