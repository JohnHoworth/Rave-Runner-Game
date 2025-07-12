"use client";

import { useState, useEffect } from 'react';

const AnimatedDigit = ({ digit, style }: { digit: string; style: React.CSSProperties }) => {
  return (
    <span className="animate-roll-up" style={style}>
      {digit}
    </span>
  );
};

export default function AnimatedScore({ score }: { score: number }) {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, [score]);

  const scoreString = score.toString().padStart(8, '0');

  return (
    <div
      key={animationKey}
      className="text-5xl font-bold text-primary tabular-nums font-mono overflow-hidden h-[1.2em]"
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
