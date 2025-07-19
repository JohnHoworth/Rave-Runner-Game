
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

export default function MainAnimatedScore({ score }: { score: number }) {
  const [animationKey, setAnimationKey] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevScore, setPrevScore] = useState(score);

  useEffect(() => {
    if (score > prevScore) {
      setAnimationKey(prevKey => prevKey + 1);
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500); 
      setPrevScore(score);
      return () => clearTimeout(timer);
    } else if (score === 0 && prevScore !== 0) { // Handle reset
      setPrevScore(0);
    }
  }, [score, prevScore]);

  const scoreString = score.toString();

  return (
    <div
      key={animationKey}
      className={cn(
        "text-5xl font-bold tabular-nums font-mono overflow-hidden h-[1.2em] transition-colors text-orange-400",
        isAnimating && "animate-pop-burst"
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
