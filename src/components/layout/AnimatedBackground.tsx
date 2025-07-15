
"use client";

const blueprintBackgroundStyle: React.CSSProperties = {
    backgroundColor: '#fdf6e3', // A parchment/aged paper color
    backgroundImage: `
        linear-gradient(rgba(0, 110, 255, 0.15) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 110, 255, 0.15) 1px, transparent 1px),
        radial-gradient(circle at 10% 10%, rgba(0, 0, 0, 0.05), transparent 20%),
        radial-gradient(circle at 90% 80%, rgba(0, 0, 0, 0.05), transparent 25%)
    `,
    backgroundSize: '20px 20px, 20px 20px, 100% 100%, 100% 100%',
};


const vignetteEffect = {
    backgroundImage: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.1) 95%)',
};

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" data-ai-hint="aged blueprint paper">
            <div 
                className="absolute inset-0" 
                style={blueprintBackgroundStyle}
            />
            <div 
                className="absolute inset-0"
                style={vignetteEffect}
            />
        </div>
    );
}
