
"use client";

import { useState } from "react";
import type { HighScore } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, RotateCw } from "lucide-react";

export default function GameOverScreen({
  score,
  highScores,
  onAddHighScore,
  onRestart,
}: {
  score: number;
  highScores: HighScore[];
  onAddHighScore: (name: string) => void;
  onRestart: () => void;
}) {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isHighScore = score > 0 && (highScores.length < 5 || score > highScores[highScores.length - 1].score);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !submitted) {
      onAddHighScore(name.trim().toUpperCase());
      setSubmitted(true);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black text-primary font-body overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-scanline" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      
      <div className="relative z-10 text-center p-8 w-full max-w-4xl">
        <h1 className="text-8xl font-bold font-headline mb-4 text-accent animate-flicker" style={{ textShadow: '0 0 15px hsl(var(--accent))' }}>
          GAME OVER
        </h1>
        <p className="text-3xl mb-8 text-primary">Your Final Score: {score}</p>

        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {/* High Score Submission */}
          {(isHighScore || submitted) && (
            <Card className="bg-black/50 border-accent/50 w-full md:w-1/2 lg:w-1/3 text-left">
              <CardHeader>
                <CardTitle className="text-accent flex items-center gap-2 font-headline tracking-widest">
                  <Award />
                  {isHighScore && !submitted ? "New High Score!" : "Score Submitted"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isHighScore && !submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-muted-foreground">Enter your initials to join the legends:</p>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      maxLength={3}
                      placeholder="AAA"
                      className="text-center text-2xl h-12 bg-background/80 border-primary/50 text-primary font-mono tracking-[0.3em]"
                    />
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                      Submit Score
                    </Button>
                  </form>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-2xl text-primary font-bold">Thanks for playing!</p>
                    </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* High Score List */}
          <Card className="bg-black/50 border-primary/50 w-full md:w-1/2 lg:w-1/3 text-left">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 font-headline tracking-widest">
                <Award />
                Top 5 Ravers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {highScores.length > 0 ? (
                <ol className="space-y-2 font-mono text-lg">
                  {highScores.map((hs, index) => (
                    <li key={index} className="flex justify-between items-center p-2 rounded-md bg-background/30">
                      <span className="flex items-center gap-4">
                        <span className="font-bold text-accent">{index + 1}.</span>
                        <span className="text-primary">{hs.name}</span>
                      </span>
                      <span className="text-primary font-bold">{hs.score}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-center text-muted-foreground py-8">No high scores yet. Be the first!</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Button onClick={onRestart} className="mt-12 text-2xl px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90">
          <RotateCw className="mr-3 w-6 h-6" />
          Play Again
        </Button>
      </div>
    </div>
  );
}

// Add this to your globals.css or tailwind config for the background pattern
const styles = `
  .bg-grid-pattern {
    background-image:
      linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
      linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px);
    background-size: 2rem 2rem;
  }
`;
