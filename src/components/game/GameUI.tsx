
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, Coins, DiscAlbum, FileText, Sparkles, Gamepad2, Timer } from "lucide-react";
import RaveCustomizer from "./RaveCustomizer";
import { useState } from "react";
import type { GameState, Level, CollectibleType } from "@/lib/types";
import { cn } from "@/lib/utils";


export default function GameUI({ gameState, levels, lastCollected }: { gameState: GameState, levels: Level[], lastCollected: CollectibleType | null }) {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const inventoryItemClasses = (type: CollectibleType) => cn(
    "flex items-center justify-between p-2 rounded-lg transition-all duration-300",
    lastCollected === type && "animate-flash"
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <aside className="w-80 bg-card/30 border-r border-border/50 p-6 flex-col gap-6 hidden lg:flex">
        {/* Score and Currency */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">SCORE</h2>
          <p className="text-5xl font-bold text-primary tabular-nums font-mono animate-pulse">{gameState.score.toString().padStart(8, '0')}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-lg font-semibold text-accent">
              <Coins className="w-6 h-6" />
              <span>RaveBucks™:</span>
              <span className="text-primary">{gameState.raveBucks}</span>
            </div>
             <div className="flex items-center gap-2 text-lg font-semibold text-accent">
              <Timer className="w-6 h-6" />
              <span className="text-primary tabular-nums font-mono">{formatTime(gameState.time)}</span>
            </div>
          </div>
        </div>
        <Separator />
        {/* Collectibles */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">INVENTORY</h2>
          <div className="space-y-3">
            <div className={inventoryItemClasses('flyer')}>
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary/80" />
                <span className="font-medium">Flyers</span>
              </div>
              <span className="text-2xl font-bold text-primary">{gameState.collectibles.flyers}</span>
            </div>
             <div className={inventoryItemClasses('glowstick')}>
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-accent" />
                <span className="font-medium">Glowsticks</span>
              </div>
              <span className="text-2xl font-bold text-primary">{gameState.collectibles.glowsticks}</span>
            </div>
             <div className={inventoryItemClasses('vinyl')}>
              <div className="flex items-center gap-3">
                <DiscAlbum className="w-6 h-6 text-primary" />
                <span className="font-medium">Vinyls</span>
              </div>
              <span className="text-2xl font-bold text-primary">{gameState.collectibles.vinyls}</span>
            </div>
          </div>
        </div>
        <Separator />
        {/* Levels */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">LEVELS</h2>
          <ul className="space-y-2">
            {levels.map((level, index) => (
              <li key={index} className={`p-3 rounded-md transition-colors border ${gameState.level === index + 1 ? 'bg-primary/20 border-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'border-transparent'}`}>
                <p className="font-bold text-primary">{`LVL ${index + 1}: ${level.name}`}</p>
                <p className="text-sm text-muted-foreground">{level.artist}</p>
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        {/* How to Play */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest flex items-center gap-2">
            <Gamepad2 className="w-6 h-6" />
            HOW TO PLAY
          </h2>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-2 pl-2">
              <li>Use <kbd>Arrow Keys</kbd> to move.</li>
              <li>Collect items for points: <FileText className="inline-block w-4 h-4 text-primary/80" /> <Sparkles className="inline-block w-4 h-4 text-accent" /> <DiscAlbum className="inline-block w-4 h-4 text-primary" />.</li>
              <li>Avoid the ghosts!</li>
          </ul>
        </div>
        <Separator />
        <Button onClick={() => setIsCustomizerOpen(true)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <BrainCircuit className="mr-2 h-5 w-5" />
          AI Rave Customizer
        </Button>
      </aside>
      <RaveCustomizer open={isCustomizerOpen} onOpenChange={setIsCustomizerOpen} />
    </>
  );
}
