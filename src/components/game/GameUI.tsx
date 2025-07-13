
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, Coins, DiscAlbum, FileText, Pill, Gamepad2, Timer, Fuel, Siren } from "lucide-react";
import RaveCustomizer from "./RaveCustomizer";
import { useState } from "react";
import type { GameState, Level, CollectibleType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import AnimatedScore from './AnimatedScore';


export default function GameUI({ gameState, levels, lastCollected, isBustedAnimating, onSelectTrack }: { gameState: GameState, levels: Level[], lastCollected: CollectibleType | null, isBustedAnimating: boolean, onSelectTrack: (level: Level) => void }) {
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

  const fuelPercentage = (gameState.fuel / gameState.maxFuel) * 100;
  
  // Calculate color from green (120) to red (0)
  const fuelColorHue = (fuelPercentage / 100) * 120;
  const fuelColor = `hsl(${fuelColorHue}, 100%, 50%)`;

  const glowClass = fuelPercentage < 25 ? 'animate-glow' : '';

  return (
    <>
      <aside className="w-80 bg-card/30 border-r border-border/50 p-6 flex flex-col gap-6 hidden lg:flex">
        {/* Score and Currency */}
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">SCORE</h2>
          <AnimatedScore score={gameState.score} />
          <div className="flex items-center justify-center gap-4 text-2xl font-semibold text-accent">
            <div className="flex items-center gap-2">
                <Timer className="w-7 h-7" />
                <span className="text-primary tabular-nums font-mono">{formatTime(gameState.time)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Siren className={cn("w-7 h-7 text-destructive", isBustedAnimating && "animate-flash-blue-glow")} />
                <span className="text-primary tabular-nums font-mono">{gameState.bustedCount}</span>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <h3 className="text-sm font-semibold text-accent font-headline tracking-widest flex items-center justify-center gap-2">
                <Fuel className="w-4 h-4" />
                FUEL-O-METER
            </h3>
            <Progress 
              value={fuelPercentage} 
              className={cn("h-3", glowClass)}
              indicatorStyle={{ backgroundColor: fuelColor, color: fuelColor }}
            />
          </div>

          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-accent">
              <Coins className="w-6 h-6" />
              <span>RaveBucks™:</span>
              <span className="text-primary">{gameState.raveBucks}</span>
            </div>
          </div>
        </div>
        
        <Separator />

        {/* Scrollable middle section */}
        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6 flex flex-col gap-6">
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
                <div className={inventoryItemClasses('pills')}>
                  <div className="flex items-center gap-3">
                    <Pill className="w-6 h-6 text-accent" />
                    <span className="font-medium">Pills</span>
                  </div>
                  <span className="text-2xl font-bold text-primary">{gameState.collectibles.pills}</span>
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
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">LEVELS</h2>
              <ul className="space-y-2">
                {levels.map((level, index) => (
                  <li 
                    key={index} 
                    onClick={() => onSelectTrack(level)}
                    className={`p-3 rounded-md transition-colors border cursor-pointer ${gameState.level === index + 1 ? 'bg-primary/20 border-primary shadow-[0_0_10px_hsl(var(--primary))]' : 'border-transparent hover:bg-primary/10'}`}>
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
                  <li>Collect items for points: <FileText className="inline-block w-4 h-4 text-primary/80" /> <Pill className="inline-block w-4 h-4 text-accent" /> <DiscAlbum className="inline-block w-4 h-4 text-primary" />.</li>
                  <li>Refuel at Fuel Stations!</li>
                  <li>Avoid the ghosts!</li>
                  <li>Watch your fuel, it depletes as you move!</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
        
        <Separator />
        
        <Button onClick={() => setIsCustomizerOpen(true)} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
          <BrainCircuit className="mr-2 h-5 w-5" />
          AI Rave Customizer
        </Button>
      </aside>
      <RaveCustomizer open={isCustomizerOpen} onOpenChange={setIsCustomizerOpen} />
    </>
  );
}
