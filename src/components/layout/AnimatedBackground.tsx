
"use client";

import { cn } from "@/lib/utils";

const gridPattern = {
    backgroundImage: `
        linear-gradient(hsl(var(--primary) / 0.15) 1px, transparent 1px),
        linear-gradient(to right, hsl(var(--primary) / 0.15) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
};

const scanlineEffect = {
    backgroundImage: 'linear-gradient(to bottom, transparent, hsl(var(--background)) 75%, transparent)',
    backgroundSize: '100% 3px',
};

const vignetteEffect = {
    backgroundImage: 'radial-gradient(ellipse at center, transparent 50%, hsl(var(--background)) 90%)',
};

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" data-ai-hint="futuristic background">
            <div 
                className="absolute inset-0 animate-[move-grid_8s_linear_infinite]" 
                style={gridPattern}
            />
            <div 
                className="absolute inset-0"
                style={vignetteEffect}
            />
            <div 
                className="absolute inset-0 animate-[scanline_10s_linear_infinite]"
                style={scanlineEffect}
            />
        </div>
    );
}
