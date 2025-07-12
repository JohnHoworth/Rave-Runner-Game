"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const AnimatedDigit = ({ digit, style }: { digit: string; style: React.CSSProperties }) => {
  return (
    <span className="animate-roll-up" style={style}>
      {digit}
    </span>
  );
};

export default function AnimatedScore({ score }: { score: number }) {
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (score > 0) {
      setAnimationKey(prevKey => prevKey + 1);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000); // Animation duration is 0.5s * 2 iterations
      return () => clearTimeout(timer);
    }
  }, [score]);

  const scoreString = score.toString().padStart(8, '0');

  return (
    <div
      key={animationKey}
      className={cn(
        "text-5xl font-bold tabular-nums font-mono overflow-hidden h-[1.2em]",
        isAnimating ? "animate-flash-yellow-glow" : "text-primary"
      )}
    >
      {scoreString.split('').map((digit, index) => (
        <AnimatedDigit
          key={index}
          digit={digit}
          style={{ animationDelay: `${index * 0.05}s` }}
        />
      ))}
    </div>
  );
}
