
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BrainCircuit, Coins, DiscAlbum, FileText, Pill, Gamepad2, Timer, Fuel, Siren } from "lucide-react";
import RaveCustomizer from "./RaveCustomizer";
import { useState } from "react";
import type { GameState, CollectibleType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import AnimatedScore from './AnimatedScore';
import MainAnimatedScore from './MainAnimatedScore';
import FlashingPillIcon from "../icons/FlashingPillIcon";


export default function GameUI({ 
    gameState, 
    lastCollected, 
    isBustedAnimating, 
}: { 
    gameState: GameState, 
    lastCollected: CollectibleType | null, 
    isBustedAnimating: boolean, 
}) {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const inventoryItemClasses = (type: CollectibleType) => cn(
    "flex items-center justify-between p-2 rounded-lg transition-all duration-300",
    lastCollected === 'flyer' && type === 'flyer' && "animate-flash-green-glow",
    lastCollected === 'pills' && type === 'pills' && "animate-flash-red-glow",
    lastCollected === 'tunes' && type === 'tunes' && "animate-flash-yellow-glow"
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const fuelPercentage = (gameState.fuel / gameState.maxFuel) * 100;
  
  const fuelColorHue = (fuelPercentage / 100) * 120;
  const fuelColor = `hsl(${fuelColorHue}, 100%, 50%)`;

  const glowClass = fuelPercentage < 25 ? 'animate-glow' : '';
  const timerFlashingClass = gameState.time > 0 && gameState.time <= 10 ? 'animate-glow-red-text' : '';

  const pillEffectPercentage = (gameState.pillEffectTimer / 10) * 100;

  return (
    <>
      <aside className="w-80 bg-card/30 border-r border-border/50 p-6 flex flex-col gap-6 hidden lg:flex">
        {/* Score and Currency */}
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">SCORE</h2>
          <MainAnimatedScore score={gameState.score} />
          <div className="flex items-center justify-center gap-4 text-2xl font-semibold text-accent">
            <div className="flex items-center gap-2">
                <Timer className="w-7 h-7" />
                <span className={cn("text-primary tabular-nums font-mono", timerFlashingClass)}>
                  {formatTime(gameState.time)}
                </span>
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
                    <FileText className="w-6 h-6 text-green-400" style={{filter: 'drop-shadow(0 0 5px #39FF14)'}}/>
                    <span className="font-medium">Flyers</span>
                  </div>
                  <AnimatedScore score={gameState.collectibles.flyers} />
                </div>
                <div>
                  <div className={inventoryItemClasses('pills')}>
                    <div className="flex items-center gap-3">
                      <Pill className="w-6 h-6 text-red-500" style={{filter: 'drop-shadow(0 0 5px #ff0000)'}} />
                      <span className="font-medium">Pills</span>
                    </div>
                     <AnimatedScore score={gameState.collectibles.pills} />
                  </div>
                  <div className="flex items-start flex-col gap-2 text-xs text-muted-foreground mt-2 pl-3">
                    {gameState.collectibles.pills > 0 && (
                      <div className="flex items-center gap-2">
                        <FlashingPillIcon className="w-4 h-4" />
                        <span>EVASION PILL: Press <kbd>SPACE</kbd> to drop</span>
                      </div>
                    )}
                    {gameState.pillEffectActive && (
                      <div className="w-full pr-3 mt-1">
                        <Progress value={pillEffectPercentage} className="h-2" indicatorClassName="animate-glow-red-bar" />
                      </div>
                    )}
                  </div>
                </div>
                <div className={inventoryItemClasses('tunes')}>
                  <div className="flex items-center gap-3">
                    <DiscAlbum className="w-6 h-6 text-yellow-300" style={{filter: 'drop-shadow(0 0 5px #DFFF00)'}} />
                    <span className="font-medium">Tunes</span>
                  </div>
                  <AnimatedScore score={gameState.collectibles.tunes} />
                </div>
              </div>
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
                  <li>Collect items for points: <FileText className="inline-block w-4 h-4 text-primary/80" /> <Pill className="inline-block w-4 h-4 text-red-500" /> <DiscAlbum className="inline-block w-4 h-4 text-yellow-300" />.</li>
                  <li>Press <kbd>SPACE</kbd> to drop an Evasion Pill and distract police.</li>
                  <li>Refuel at Fuel Stations!</li>
                  <li>Avoid the police!</li>
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
